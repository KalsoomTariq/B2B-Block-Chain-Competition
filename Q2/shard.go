package main

import (
	"crypto/sha256"
	"encoding/hex"
	"fmt"
	"sort"
	"strings"
)

// Shard represents a single state shard
type Shard struct {
	ID        int
	Root      *MerkleNode
	Mutations int // number of mutations (writes) in a tick
}

func NewShard(id int) *Shard {
	return &Shard{
		ID:        id,
		Root:      NewMerkleNode("root", ""),
		Mutations: 0,
	}
}

func (sm *ShardManager) GlobalRootHash() string {
	hashes := []string{}
	for _, shard := range sm.Shards {
		hashes = append(hashes, shard.Root.Hash)
	}
	sort.Strings(hashes) // ensure deterministic order
	combined := strings.Join(hashes, "")
	final := sha256.Sum256([]byte(combined))
	return hex.EncodeToString(final[:])
}

func (sm *ShardManager) GenerateCompressedProof(key string) {
	shard := sm.getShardForKey(key)
	proof := &MerkleProof{}
	found := shard.Root.GenerateProof(strings.Split(key, "."), proof)
	if found {
		fmt.Printf("✔️  Compressed Proof for '%s': %v\n", key, CompressProof(proof))
	} else {
		fmt.Printf("❌  Key '%s' not found for proof.\n", key)
	}
}

func (s *Shard) Insert(key string, value string) {
	s.Root.Insert(strings.Split(key, "."), value)
	s.Mutations++
}

func (s *Shard) Get(key string) (string, bool) {
	return s.Root.Get(strings.Split(key, "."))
}

// ShardManager handles all the shards and rebalancing
type ShardManager struct {
	Shards []*Shard
	Tick   int
}

func NewShardManager(initialShards int) *ShardManager {
	shards := make([]*Shard, initialShards)
	for i := range shards {
		shards[i] = NewShard(i)
	}
	return &ShardManager{
		Shards: shards,
		Tick:   0,
	}
}

func (sm *ShardManager) getShardForKey(key string) *Shard {
	index := int(sha256Hash(key)[0]) % len(sm.Shards)
	return sm.Shards[index]
}

func (sm *ShardManager) Insert(key string, value string) {
	shard := sm.getShardForKey(key)
	shard.Insert(key, value)
}

func (sm *ShardManager) PrintActiveShards() {
	fmt.Printf("=== Tick %d ===\n", sm.Tick)
	for _, shard := range sm.Shards {
		if shard.ID%2 == sm.Tick%2 { // simple time-slicing rule
			fmt.Printf("Shard %d:\n", shard.ID)
			shard.Root.Print("  ")
		}
	}
}

func (sm *ShardManager) Rebalance() {
	totalMutations := 0
	for _, shard := range sm.Shards {
		totalMutations += shard.Mutations
	}

	avg := totalMutations / len(sm.Shards)
	fmt.Println("Rebalancing shards...")

	for _, shard := range sm.Shards {
		if shard.Mutations > avg+2 {
			fmt.Printf("Shard %d overloaded, consider splitting\n", shard.ID)
		}
		shard.Mutations = 0
	}
}

func sha256Hash(s string) []byte {
	h := sha256.Sum256([]byte(s))
	return h[:]
}
