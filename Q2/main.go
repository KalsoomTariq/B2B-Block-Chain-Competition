// package main

// import (
// 	"time"
// )

// func main() {
// 	sm := NewShardManager(4)

// 	// Simulate a few ticks
// 	for tick := 0; tick < 4; tick++ {
// 		sm.Tick = tick

// 		// Simulate state updates
// 		sm.Insert("account.alice.balance", "100")
// 		sm.Insert("account.bob.balance", "200")
// 		sm.Insert("account.carol.balance", "300")
// 		sm.Insert("account.dave.nonce", "1")

// 		sm.PrintActiveShards()
// 		sm.Rebalance()

// 		time.Sleep(1 * time.Second)
// 	}
// }

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

		// 🔥 Global Root Hash
		fmt.Printf("🌐 Global Root Hash: %s\n", sm.GlobalRootHash())

		// 🔍 Generate compressed proof
		sm.GenerateCompressedProof("account.alice.balance")
		sm.GenerateCompressedProof("account.bob.balance")

		time.Sleep(1 * time.Second)
	}
}
