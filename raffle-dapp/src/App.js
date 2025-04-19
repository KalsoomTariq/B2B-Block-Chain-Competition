// src/App.js
import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

import { initWeb3, getAccounts } from './utils/web3';
import { initContract, getRaffleInstance } from './contracts/Raffle';

import Header from './components/Header';
import RaffleInfo from './components/RaffleInfo';
import BuyTickets from './components/BuyTickets';
import MyTickets from './components/MyTickets';
import AdminPanel from './components/AdminPanel';

function App() {
  const [web3, setWeb3] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [currentAccount, setCurrentAccount] = useState('');
  const [contractInstance, setContractInstance] = useState(null);
  const [raffleInfo, setRaffleInfo] = useState({
    ticketPrice: 0,
    jackpotAmount: 0,
    totalTickets: 0,
    timeRemaining: 0,
    isEnded: false,
    winner: null,
    userRole: null,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Initialize Web3, Contract and Account
  useEffect(() => {
    const init = async () => {
      try {
        setIsLoading(true);
        // Initialize web3
        const web3Instance = await initWeb3();
        setWeb3(web3Instance);

        // Get user accounts
        const accts = await getAccounts(web3Instance);
        setAccounts(accts);
        setCurrentAccount(accts[0]);

        // Initialize the contract
        const contract = await initContract(web3Instance.currentProvider);
        const instance = await getRaffleInstance(contract, accts[0]);
        setContractInstance(instance);

        setIsLoading(false);
      } catch (error) {
        console.error("Failed to initialize:", error);
        setError("Failed to connect to the blockchain. Please make sure you have MetaMask installed and connected.");
        setIsLoading(false);
      }
    };

    init();

    // Add listener for account changes
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', (accts) => {
        setAccounts(accts);
        setCurrentAccount(accts[0]);
      });
    }

    return () => {
      // Clean up listeners
      if (window.ethereum) {
        window.ethereum.removeAllListeners('accountsChanged');
      }
    };
  }, []);

  // Load raffle info when contract instance changes
  useEffect(() => {
    const loadRaffleInfo = async () => {
      if (!contractInstance || !web3) return;

      try {
        console.log("Contract instance:", contractInstance);
        // Get ticket price
        const ticketPrice = await contractInstance.ticketPrice();
        console.log("Ticket price:", ticketPrice.toString());
        
        // Get jackpot amount
        const jackpotAmount = await contractInstance.getJackpotAmount();
        
        // Get total tickets sold
        const totalTickets = await contractInstance.getTotalTickets();
        
        // Get raffle duration
        const raffleDuration = await contractInstance.raffleDuration();
        
        // Get raffle start time
        const raffleStartTime = await contractInstance.raffleStartTime();
        
        // Calculate time remaining
        const now = Math.floor(Date.now() / 1000);
        const endTime = parseInt(raffleStartTime) + parseInt(raffleDuration);
        const timeRemaining = Math.max(0, endTime - now);
        
        // Check if raffle ended
        const isEnded = await contractInstance.raffleEnded();
        
        // Get winner if raffle ended
        let winner = null;
        if (isEnded) {
          winner = await contractInstance.winner();
        }

        // Get user role
        const userRole = await contractInstance.roles(currentAccount);

        setRaffleInfo({
          ticketPrice: web3.utils.fromWei(ticketPrice.toString(), 'ether'),
          jackpotAmount: web3.utils.fromWei(jackpotAmount.toString(), 'ether'),
          totalTickets: totalTickets.toString(),
          timeRemaining,
          isEnded,
          winner,
          userRole: parseInt(userRole),
        });
      } catch (error) {
        console.error("Error loading raffle info:", error);
        setError(`Error loading raffle information: ${error.message}`);
      }
    };

    loadRaffleInfo();
    
    // Set up interval to refresh time remaining
    const interval = setInterval(() => {
      loadRaffleInfo();
    }, 10000); // Refresh every 10 seconds
    
    return () => clearInterval(interval);
  }, [contractInstance, web3, currentAccount]);

  if (isLoading) {
    return <div className="loading">Loading DApp...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="App">
      <Header 
        account={currentAccount} 
        userRole={raffleInfo.userRole}
      />
      
      <Container className="mt-4">
        <Row>
          <Col md={8}>
            <RaffleInfo 
              raffleInfo={raffleInfo}
              currentAccount={currentAccount}
              contractInstance={contractInstance}
              web3={web3}
            />
            
            {/* Only show buy tickets if user is a BUYER and raffle is active */}
            {raffleInfo.userRole === 1 && !raffleInfo.isEnded && (
              <BuyTickets 
                ticketPrice={raffleInfo.ticketPrice}
                contractInstance={contractInstance}
                currentAccount={currentAccount}
                web3={web3}
              />
            )}
            
            <MyTickets 
              contractInstance={contractInstance}
              currentAccount={currentAccount}
              isWinner={raffleInfo.winner === currentAccount}
              isEnded={raffleInfo.isEnded}
              web3={web3}
            />
          </Col>
          
          <Col md={4}>
            {/* Only show admin panel for ORGANIZER */}
            {raffleInfo.userRole === 0 && (
              <AdminPanel 
                contractInstance={contractInstance}
                currentAccount={currentAccount}
                web3={web3}
              />
            )}
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default App;