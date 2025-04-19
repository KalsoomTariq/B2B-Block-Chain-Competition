// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.8.0;
contract Raffle {
    enum Role { ORGANIZER, BUYER }

    struct Ticket {
        address owner;
    }

    address public owner;
    uint public ticketPrice;
    uint public maxTicketsPerTx;
    uint public jackpotPercentage;
    uint public raffleDuration;
    uint public raffleStartTime;

    Ticket[] public tickets;
    mapping(address => Role) public roles;
    mapping(address => uint[]) public ticketsOf;

    address public winner;
    bool public raffleEnded;
    uint public lastPurchaseTime;
    uint public unclaimedSince;

    event TicketPurchased(address indexed buyer, uint indexed ticketId);
    event RaffleEnded(address indexed winner, uint amount);
    event JackpotClaimed(address indexed winner, uint amount);

    modifier onlyRole(Role _role) {
        require(roles[msg.sender] == _role, "Access denied");
        _;
    }

    modifier raffleActive() {
        require(!raffleEnded, "Raffle already ended");
        _;
    }

    modifier raffleHasEnded() {
        require(raffleEnded, "Raffle not ended yet");
        _;
    }

    constructor(
        uint _ticketPrice,
        uint _maxTicketsPerTx,
        uint _jackpotPercentage,
        uint _raffleDuration // in seconds
    ) public {
        require(_jackpotPercentage <= 100, "Invalid jackpot percentage");
        owner = msg.sender;
        roles[msg.sender] = Role.ORGANIZER;
        ticketPrice = _ticketPrice;
        maxTicketsPerTx = _maxTicketsPerTx;
        jackpotPercentage = _jackpotPercentage;
        raffleDuration = _raffleDuration;
        raffleStartTime = block.timestamp;
    }

    function assignRole(address _user, Role _role) external onlyRole(Role.ORGANIZER) {
        roles[_user] = _role;
    }

    function purchaseTickets(uint _numTickets) external payable onlyRole(Role.BUYER) raffleActive {
        require(_numTickets > 0 && _numTickets <= maxTicketsPerTx, "Invalid ticket amount");
        require(msg.value == _numTickets * ticketPrice, "Incorrect Ether sent");

        for (uint i = 0; i < _numTickets; i++) {
            tickets.push(Ticket(msg.sender));
            ticketsOf[msg.sender].push(tickets.length - 1);
            emit TicketPurchased(msg.sender, tickets.length - 1);
        }

        lastPurchaseTime = block.timestamp;

        // Check for time-based end
        if (block.timestamp >= raffleStartTime + raffleDuration) {
            endRaffle();
        }
    }

    function endRaffle() public raffleActive {
        require(block.timestamp >= raffleStartTime + raffleDuration, "Raffle duration not met");
        require(tickets.length > 0, "No tickets sold");

        uint randomIndex = uint(keccak256(
            abi.encodePacked(
                blockhash(block.number - 1),
                block.difficulty,
                address(this),
                tickets.length
            )
        )) % tickets.length;

        winner = tickets[randomIndex].owner;
        raffleEnded = true;
        unclaimedSince = block.timestamp;

        emit RaffleEnded(winner, getJackpotAmount());
    }

    function claimJackpot() external raffleHasEnded {
        require(msg.sender == winner, "Not the winner");

        uint amount = getJackpotAmount();
        address(uint160(msg.sender)).transfer(amount);

        emit JackpotClaimed(msg.sender, amount);

        resetRaffle();
    }

    function getJackpotAmount() public view returns (uint) {
        return address(this).balance * jackpotPercentage / 100;
    }

    function getTotalTickets() public view returns (uint) {
        return tickets.length;
    }

    function resetRaffle() internal {
        delete tickets;
        raffleEnded = false;
        winner = address(0);
        raffleStartTime = block.timestamp;
    }

    function handleUnclaimedJackpot(uint timeout) external onlyRole(Role.ORGANIZER) raffleHasEnded {
        require(block.timestamp >= unclaimedSince + timeout, "Timeout not reached");
        address(uint160(owner)).transfer(getJackpotAmount());
        resetRaffle();
    }
}
