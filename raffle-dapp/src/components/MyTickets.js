// src/components/MyTickets.js
import React, { useState, useEffect } from 'react';
import { Card, ListGroup, Badge } from 'react-bootstrap';

function MyTickets({ contractInstance, currentAccount, isWinner, isEnded, web3 }) {
  const [myTickets, setMyTickets] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const loadMyTickets = async () => {
      if (!contractInstance || !currentAccount) return;
      
      setIsLoading(true);
      try {
        const ticketsOfUser = await contractInstance.ticketsOf(currentAccount);
        
        // Convert BigNumber array to regular array of numbers
        const ticketNumbers = ticketsOfUser.map(ticket => parseInt(ticket.toString()));
        
        setMyTickets(ticketNumbers);
      } catch (error) {
        console.error("Error loading tickets:", error);
      }
      setIsLoading(false);
    };
    
    loadMyTickets();
  }, [contractInstance, currentAccount]);

  return (
    <Card>
      <Card.Header as="h5">
        My Tickets
        {isWinner && isEnded && (
          <Badge bg="warning" className="ms-2">Winner!</Badge>
        )}
      </Card.Header>
      <Card.Body>
        {isLoading ? (
          <p>Loading your tickets...</p>
        ) : myTickets.length > 0 ? (
          <ListGroup>
            {myTickets.map((ticketId, index) => (
              <ListGroup.Item key={index} className="d-flex justify-content-between align-items-center">
                Ticket #{ticketId}
                {isWinner && isEnded && (
                  <Badge bg="success" pill>
                    Winning Ticket!
                  </Badge>
                )}
              </ListGroup.Item>
            ))}
          </ListGroup>
        ) : (
          <p>You don't have any tickets yet.</p>
        )}
      </Card.Body>
    </Card>
  );
}

export default MyTickets;