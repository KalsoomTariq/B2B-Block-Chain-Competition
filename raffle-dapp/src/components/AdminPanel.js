// src/components/AdminPanel.js
import React, { useState } from 'react';
import { Card, Form, Button, InputGroup } from 'react-bootstrap';

function AdminPanel({ contractInstance, currentAccount, web3 }) {
  const [newBuyerAddress, setNewBuyerAddress] = useState('');
  const [timeoutPeriod, setTimeoutPeriod] = useState(86400); // Default 1 day in seconds
  const [isLoading, setIsLoading] = useState(false);

  const handleAssignBuyer = async (e) => {
    e.preventDefault();
    
    if (!web3.utils.isAddress(newBuyerAddress)) {
      alert("Please enter a valid Ethereum address");
      return;
    }
    
    setIsLoading(true);
    try {
      // Role.BUYER = 1
      await contractInstance.assignRole(newBuyerAddress, 1, { from: currentAccount });
      alert(`User ${newBuyerAddress} assigned as Buyer successfully!`);
      setNewBuyerAddress('');
    } catch (error) {
      console.error("Error assigning buyer role:", error);
      alert(`Error: ${error.message}`);
    }
    setIsLoading(false);
  };

  const handleUnclaimedJackpot = async () => {
    setIsLoading(true);
    try {
      await contractInstance.handleUnclaimedJackpot(timeoutPeriod, { from: currentAccount });
      alert("Unclaimed jackpot handled successfully!");
    } catch (error) {
      console.error("Error handling unclaimed jackpot:", error);
      alert(`Error: ${error.message}`);
    }
    setIsLoading(false);
  };

  return (
    <Card className="mb-4">
      <Card.Header as="h5">Admin Panel</Card.Header>
      <Card.Body>
        <Form onSubmit={handleAssignBuyer} className="mb-4">
          <Form.Group className="mb-3">
            <Form.Label>Assign Buyer Role</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter Ethereum address"
              value={newBuyerAddress}
              onChange={(e) => setNewBuyerAddress(e.target.value)}
            />
          </Form.Group>
          <Button variant="primary" type="submit" disabled={isLoading}>
            {isLoading ? 'Processing...' : 'Assign as Buyer'}
          </Button>
        </Form>
        
        <hr />
        
        <Form className="mb-3">
          <Form.Group className="mb-3">
            <Form.Label>Handle Unclaimed Jackpot</Form.Label>
            <InputGroup>
              <Form.Control
                type="number"
                placeholder="Timeout period (seconds)"
                value={timeoutPeriod}
                onChange={(e) => setTimeoutPeriod(parseInt(e.target.value) || 0)}
              />
              <Button 
                variant="warning" 
                onClick={handleUnclaimedJackpot}
                disabled={isLoading}
              >
                {isLoading ? 'Processing...' : 'Claim Unclaimed'}
              </Button>
            </InputGroup>
            <Form.Text className="text-muted">
              Timeout in human-readable: {Math.floor(timeoutPeriod / 86400)} days, {Math.floor((timeoutPeriod % 86400) / 3600)} hours
            </Form.Text>
          </Form.Group>
        </Form>
      </Card.Body>
    </Card>
  );
}

export default AdminPanel;