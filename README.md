# Progressive Jackpot Raffle - Smart Contract DApp

A decentralized blockchain application implementing a progressive jackpot raffle system using Solidity smart contracts.

## Overview

This project provides a complete decentralized raffle solution where users can purchase tickets, contribute to a growing prize pool, and participate in a provably fair winner selection process when the raffle concludes.

## Features

### Role-Based Access Control

| Role      | Description                               |
|-----------|-------------------------------------------|
| Organizer | Deploys contract and manages raffle setup |
| Buyer     | Purchases tickets and claims jackpot      |

### Configurable Parameters

When deploying the smart contract, you can customize:
- `ticketPrice`: Price per ticket (in wei)
- `maxTicketsPerTx`: Maximum tickets a buyer can purchase per transaction
- `jackpotPercentage`: Percentage of contract balance awarded to winner (0-100)
- `raffleDuration`: Time period before raffle ends (in seconds)

## Installation

1. Clone the repository:
   ```
   git clone https://github.com/KalsoomTariq/B2B-Block-Chain-Competition.git
   ```

2. Ensure Ganache is running and connected to MetaMask

3. Compile the contract:
   ```
   truffle compile
   ```

4. Install DApp dependencies:
   ```
   cd raffle-dapp
   npm install
   ```

5. Launch the application:
   ```
   npm start
   ```

## Application Screenshots

### Organizer Dashboard
![Organizer Dashboard](https://github.com/user-attachments/assets/622e0933-e958-49cf-8fad-66aa265ee1f2)

### Buyer Dashboard
![Buyer Dashboard](https://github.com/user-attachments/assets/88b74f03-1dd8-4b95-a4bf-e180fddc5224)

### Role Assignment Interface
![Role Assignment Interface](https://github.com/user-attachments/assets/f7a4f6d5-05fc-4bc7-9de9-c6cbf0c8d611)

### Role Assignment (Ganache View)
![Role Assignment Ganache View](https://github.com/user-attachments/assets/7c8c52ac-6a49-4953-b96f-ad3bcb92fc48)

### Ticket Binding Interface
![Ticket Binding Interface](https://github.com/user-attachments/assets/32c3405c-cae7-4fc8-a3c3-0c6a80a2770e)

### Ticket Binding (Ganache View)
![Ticket Binding Ganache View](https://github.com/user-attachments/assets/41184d97-1869-41d6-875e-5c5451bf3bad)

## Contributors
1 - Kalsoom Tariq
2-  Kissa Zahra
3-  Aliza Ibrahim
