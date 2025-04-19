package main

import (
	"fmt"
	"time"
)

func main() {
	sm := NewShardManager(4)

	for tick := 0; tick < 4; tick++ {
		sm.Tick = tick
		fmt.Printf("\n===== TICK %d =====\n", tick)

		sm.Insert("account.alice.balance", "100")
		sm.Insert("account.bob.balance", "200")
		sm.Insert("account.carol.balance", "300")
		sm.Insert("account.dave.nonce", "1")

		sm.PrintActiveShards()
		sm.Rebalance()

		fmt.Printf("🌐 Global Root Hash: %s\n", sm.GlobalRootHash())

		sm.GenerateCompressedProof("account.alice.balance")
		sm.GenerateCompressedProof("account.bob.balance")

		time.Sleep(1 * time.Second)
	}
}
