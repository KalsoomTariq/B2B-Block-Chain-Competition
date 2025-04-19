// src/components/BuyTickets.js
import React, { useState } from 'react';
import { Card, Form, Button, InputGroup } from 'react-bootstrap';

function BuyTickets({ ticketPrice, contractInstance, currentAccount, web3 }) {
  const [ticketCount, setTicketCount] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  const handlePurchase = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const totalCost = web3.utils.toWei((ticketPrice * ticketCount).toString(), 'ether');
      
      await contractInstance.purchaseTickets(
        ticketCount, 
        { 
          from: currentAccount, 
          value: totalCost 
        }
      );
      
      alert(`Successfully purchased ${ticketCount} ticket(s)!`);
      setTicketCount(1);
    } catch (error) {
      console.error("Error purchasing tickets:", error);
      alert(`Error: ${error.message}`);
    }
    
    setIsLoading(false);
  };

  return (
    <Card className="mb-4">
      <Card.Header as="h5">Buy Tickets</Card.Header>
      <Card.Body>
        <Form onSubmit={handlePurchase}>
          <Form.Group className="mb-3">
            <Form.Label>Number of Tickets</Form.Label>
            <InputGroup>
              <Form.Control
                type="number"
                min="1"
                value={ticketCount}
                onChange={(e) => setTicketCount(parseInt(e.target.value) || 1)}
              />
              <Button variant="primary" type="submit" disabled={isLoading}>
                {isLoading ? 'Processing...' : 'Buy Tickets'}
              </Button>
            </InputGroup>
            <Form.Text className="text-muted">
              Total cost: {(ticketPrice * ticketCount).toFixed(4)} ETH
            </Form.Text>
          </Form.Group>
        </Form>
      </Card.Body>
    </Card>
  );
}

export default BuyTickets;