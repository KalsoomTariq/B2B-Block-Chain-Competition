package main

import (
	"crypto/sha256"
	"encoding/hex"
	"fmt"
	"sort"
	"strings"
)

// MerkleNode represents a single node in the recursive Merkle trie.
type MerkleNode struct {
	Key      string
	Value    string
	Children map[string]*MerkleNode
	Hash     string
}

// MerkleProof represents a proof for inclusion in the trie
type MerkleProof struct {
	Path          []string
	SiblingHashes []string
}

func (n *MerkleNode) GenerateProof(keyParts []string, proof *MerkleProof) bool {
	if len(keyParts) == 0 {
		return true
	}

	childKey := keyParts[0]
	child, ok := n.Children[childKey]
	if !ok {
		return false
	}

	// Collect sibling hashes (excluding the target child)
	for k, v := range n.Children {
		if k != childKey {
			proof.SiblingHashes = append(proof.SiblingHashes, fmt.Sprintf("%s:%s", k, v.Hash))
		}
	}
	proof.Path = append(proof.Path, childKey)
	return child.GenerateProof(keyParts[1:], proof)
}

func CompressProof(proof *MerkleProof) []string {
	// Just keep hashes without key names to simulate compression
	compressed := make([]string, len(proof.SiblingHashes))
	for i, entry := range proof.SiblingHashes {
		parts := strings.Split(entry, ":")
		if len(parts) == 2 {
			compressed[i] = parts[1]
		}
	}
	return compressed
}

// NewMerkleNode creates a new Merkle node.
func NewMerkleNode(key, value string) *MerkleNode {
	node := &MerkleNode{
		Key:      key,
		Value:    value,
		Children: make(map[string]*MerkleNode),
	}
	node.UpdateHash()
	return node
}

// UpdateHash recalculates the node’s hash based on its value and children.
func (n *MerkleNode) UpdateHash() {
	hasher := sha256.New()

	// Add key and value to the hash input
	hasher.Write([]byte(n.Key + n.Value))

	// Sort keys to ensure consistent hash across nodes
	childKeys := make([]string, 0, len(n.Children))
	for k := range n.Children {
		childKeys = append(childKeys, k)
	}
	sort.Strings(childKeys)

	for _, k := range childKeys {
		child := n.Children[k]
		hasher.Write([]byte(k + child.Hash))
	}

	n.Hash = hex.EncodeToString(hasher.Sum(nil))
}

// Insert inserts or updates a key-value pair in the trie.
func (n *MerkleNode) Insert(keyParts []string, value string) {
	if len(keyParts) == 0 {
		n.Value = value
		n.UpdateHash()
		return
	}

	childKey := keyParts[0]
	if _, ok := n.Children[childKey]; !ok {
		n.Children[childKey] = NewMerkleNode(childKey, "")
	}

	n.Children[childKey].Insert(keyParts[1:], value)
	n.UpdateHash()
}

// Get retrieves the value for a given key.
func (n *MerkleNode) Get(keyParts []string) (string, bool) {
	if len(keyParts) == 0 {
		return n.Value, true
	}

	child, ok := n.Children[keyParts[0]]
	if !ok {
		return "", false
	}

	return child.Get(keyParts[1:])
}

// Print displays the trie (for debug)
func (n *MerkleNode) Print(indent string) {
	fmt.Printf("%s[%s]: %s | Hash: %s\n", indent, n.Key, n.Value, n.Hash)
	for _, child := range n.Children {
		child.Print(indent + "  ")
	}
}
