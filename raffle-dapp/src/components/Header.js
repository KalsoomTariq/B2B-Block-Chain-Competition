// src/components/Header.js
import React from 'react';
import { Navbar, Container, Badge } from 'react-bootstrap';

function Header({ account, userRole }) {
  // Convert role number to text
  const roleName = userRole === 0 ? 'Organizer' : userRole === 1 ? 'Buyer' : 'Unassigned';
  
  return (
    <Navbar bg="dark" variant="dark" expand="lg">
      <Container>
        <Navbar.Brand href="#home">Blockchain Raffle</Navbar.Brand>
        <Navbar.Toggle />
        <Navbar.Collapse className="justify-content-end">
          <Navbar.Text>
            Role: <Badge bg={userRole === 0 ? 'danger' : userRole === 1 ? 'success' : 'secondary'}>
              {roleName}
            </Badge>
          </Navbar.Text>
          <Navbar.Text className="ms-3">
            Connected: <span className="text-warning">{`${account.substring(0, 6)}...${account.substring(account.length - 4)}`}</span>
          </Navbar.Text>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default Header;