package main

import (
	"fmt"
	"math/rand"
	"sort"
	"strings"
	"time"
)

type Tx struct {
	ID     string
	Input  string
	Output string
}

type Block struct {
	ID           string
	Parents      []*Block
	Transactions []Tx
	CumulativeTx int
}

type DAG struct {
	Blocks    map[string]*Block
	UTXO      map[string]bool
	Finalized map[string]bool
	Tips      []*Block
	FinalityN int
}

func NewDAG() *DAG {
	gen := &Block{ID: "GEN"}
	return &DAG{
		Blocks:    map[string]*Block{"GEN": gen},
		UTXO:      map[string]bool{},
		Finalized: map[string]bool{},
		Tips:      []*Block{gen},
		FinalityN: 2,
	}
}

func (dag *DAG) AddBlock(parents []*Block, txs []Tx) *Block {
	validTxs := []Tx{}
	for _, tx := range txs {
		if dag.UTXO[tx.Input] {
			validTxs = append(validTxs, tx)
		}
	}

	blockID := fmt.Sprintf("B%d", len(dag.Blocks))
	block := &Block{
		ID:           blockID,
		Parents:      parents,
		Transactions: validTxs,
	}

	// Set cumulative transaction count
	for _, p := range parents {
		if p.CumulativeTx > block.CumulativeTx {
			block.CumulativeTx = p.CumulativeTx
		}
	}
	block.CumulativeTx += len(validTxs)

	// Update UTXO
	for _, tx := range validTxs {
		delete(dag.UTXO, tx.Input)
		dag.UTXO[tx.Output] = true
	}

	// Update DAG
	dag.Blocks[blockID] = block
	dag.Tips = append(dag.Tips, block)
	dag.pruneTips()

	return block
}

func (dag *DAG) pruneTips() {
	active := map[string]bool{}
	for _, b := range dag.Blocks {
		for _, p := range b.Parents {
			active[p.ID] = true
		}
	}

	newTips := []*Block{}
	for _, tip := range dag.Tips {
		if !active[tip.ID] {
			newTips = append(newTips, tip)
		}
	}
	dag.Tips = newTips
}

func (dag *DAG) Finalize() {
	for id, blk := range dag.Blocks {
		if dag.Finalized[id] {
			continue
		}
		if dag.countChildren(blk) >= dag.FinalityN {
			dag.Finalized[id] = true
			fmt.Printf("✅ Block %s finalized\n", id)
		}
	}
}

func (dag *DAG) countChildren(b *Block) int {
	count := 0
	for _, blk := range dag.Blocks {
		for _, p := range blk.Parents {
			if p.ID == b.ID {
				count++
			}
		}
	}
	return count
}

func (dag *DAG) BestTip() *Block {
	best := dag.Tips[0]
	for _, tip := range dag.Tips[1:] {
		if tip.CumulativeTx > best.CumulativeTx || (tip.CumulativeTx == best.CumulativeTx && tip.ID < best.ID) {
			best = tip
		}
	}
	return best
}

func (dag *DAG) PrintDAG() {
	fmt.Println("\n🧩 DAG Structure:")
	ids := make([]string, 0, len(dag.Blocks))
	for id := range dag.Blocks {
		ids = append(ids, id)
	}
	sort.Strings(ids)
	for _, id := range ids {
		b := dag.Blocks[id]
		parentIDs := []string{}
		for _, p := range b.Parents {
			parentIDs = append(parentIDs, p.ID)
		}
		fmt.Printf("%s <- %s\n", id, strings.Join(parentIDs, ", "))
	}
	fmt.Printf("🏁 Best tip: %s\n", dag.BestTip().ID)
}

func simulate(dag *DAG) {
	validators := 3
	rand.Seed(time.Now().UnixNano())

	for tick := 1; tick <= 5; tick++ {
		fmt.Printf("\n⏱️ TICK %d\n", tick)
		tips := dag.Tips

		for v := 0; v < validators; v++ {
			tx := Tx{
				ID:     fmt.Sprintf("tx-%d-%d", tick, v),
				Input:  fmt.Sprintf("utxo-%d", rand.Intn(5)),
				Output: fmt.Sprintf("utxo-%d-%d", tick, v),
			}
			dag.AddBlock(tips, []Tx{tx})
		}

		dag.Finalize()
		dag.PrintDAG()
	}
}

func main() {
	dag := NewDAG()
	for i := 0; i < 5; i++ {
		dag.UTXO[fmt.Sprintf("utxo-%d", i)] = true
	}
	simulate(dag)
}
