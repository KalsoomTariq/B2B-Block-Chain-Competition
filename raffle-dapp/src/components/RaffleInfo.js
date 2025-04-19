// src/components/RaffleInfo.js
import React from 'react';
import { Card, Button } from 'react-bootstrap';

function RaffleInfo({ raffleInfo, currentAccount, contractInstance, web3 }) {
  const formatTime = (seconds) => {
    const days = Math.floor(seconds / (24 * 60 * 60));
    seconds -= days * 24 * 60 * 60;
    const hours = Math.floor(seconds / (60 * 60));
    seconds -= hours * 60 * 60;
    const minutes = Math.floor(seconds / 60);
    seconds -= minutes * 60;
    
    return `${days}d ${hours}h ${minutes}m ${seconds}s`;
  };

  const handleEndRaffle = async () => {
    try {
      await contractInstance.endRaffle({ from: currentAccount });
      alert("Raffle ended successfully!");
      // You might want to refresh the page or update the UI here
    } catch (error) {
      console.error("Error ending raffle:", error);
      alert(`Error: ${error.message}`);
    }
  };

  const handleClaimJackpot = async () => {
    try {
      await contractInstance.claimJackpot({ from: currentAccount });
      alert("Jackpot claimed successfully!");
      // You might want to refresh the page or update the UI here
    } catch (error) {
      console.error("Error claiming jackpot:", error);
      alert(`Error: ${error.message}`);
    }
  };

  return (
    <Card className="mb-4">
      <Card.Header as="h5">Raffle Status</Card.Header>
      <Card.Body>
        <div className="d-flex justify-content-between mb-3">
          <div>
            <h6>Ticket Price:</h6>
            <p className="text-primary">{raffleInfo.ticketPrice} ETH</p>
          </div>
          <div>
            <h6>Total Tickets Sold:</h6>
            <p className="text-primary">{raffleInfo.totalTickets}</p>
          </div>
          <div>
            <h6>Current Jackpot:</h6>
            <p className="text-success">{raffleInfo.jackpotAmount} ETH</p>
          </div>
          <div>
            <h6>Max Tickets:</h6>
            <p>{raffleInfo.totalTickets} / {raffleInfo.maxTickets}</p>
          </div>
        </div>

        {!raffleInfo.isEnded ? (
          <div>
            <h6>Time Remaining:</h6>
            <p className="text-danger">{formatTime(raffleInfo.timeRemaining)}</p>
            
            {raffleInfo.timeRemaining === 0 && (
              <Button variant="warning" onClick={handleEndRaffle}>
                End Raffle Now
              </Button>
            )}
          </div>
        ) : (
          <div>
            <h6>Winner:</h6>
            <p>{raffleInfo.winner}</p>
            
            {raffleInfo.winner === currentAccount && (
              <Button variant="success" onClick={handleClaimJackpot}>
                Claim Jackpot
              </Button>
            )}
          </div>
        )}
      </Card.Body>
    </Card>
  );
}

export default RaffleInfo;