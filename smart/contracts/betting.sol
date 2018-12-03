pragma solidity 0.5.0;

contract Betting {
    
    /* Types */
    
    enum eventStatus{ open, finished, closed }
    
    struct bid{
        uint id;
        bytes32 name;
        address[] whoBet;
        uint amountReceived;
    }
    
    struct bettingPool{
        uint256 id;
        bytes32 name;
        bytes32 winner;
        uint256 minBid;
        uint256 maxBid;
        bid[] bids;
        bet[] bets;
    }
    
    struct bet{
        address person;
        bytes32 bidName;
        uint amount;
    }
    
    /* Storage */
    uint256 eventId;
    bytes32 eventName;
    uint256 public arbitratorFee;
    eventStatus public status;
    uint256 public endBlock;
    address public creator;
    address public arbitrator;
    bettingPool[] public bettingPools;
    mapping (address => uint) public pendingWithdrawals;
    
    /* Events */
    
    event poolCreated(uint id, address creator);
    event betMade(uint value, uint id);
    event eventStatusChanged(uint status);
    event withdrawalDone(uint amount);
    
    /* Modifiers */
    modifier onlyFinished(){
        if (status == eventStatus.finished || endBlock < block.number){
            _;
        }
    }
    modifier onlyArbitrator(){
        if (arbitrator == msg.sender){
            _;
        }
    }
    /* Constructor */
    constructor (uint256 _eventId, bytes32 _eventName, uint256 _fee, uint256 _endBlock, address _arbitrator) public {
        require(_fee < 100);
        eventId = _eventId;
        eventName = _eventName;
        arbitratorFee = _fee;
        endBlock = _endBlock;
        arbitrator = _arbitrator;
        status = eventStatus.open;
        creator = msg.sender;
    }
    
    /* Methods */
    
    function createPool(bytes32 _name, bytes32[] calldata _names, uint256 _minBid, uint256 _maxBid) external{
        
        /* check whether pool with such name already exist */
        bool found;
        for (uint8 x = 0;x<bettingPools.length;x++){
            if(bettingPools[x].name == _name){
                found = true;
            }
        }
        require(!found);
        //
        /* check names for duplicates */
        //for (uint8 y=0;y<_names.length;y++){
        //    require(_names[y] != _names[(y+1)]);
        //}
        
        uint newId = bettingPools.length++;
        bettingPools[newId].id = newId;
        bettingPools[newId].name = _name;
        bettingPools[newId].minBid = _minBid;
        bettingPools[newId].maxBid = _maxBid;
        
        for (uint8 i = 0;i < _names.length; i++){
            uint newBidId = bettingPools[newId].bids.length++;
            bettingPools[newId].bids[newBidId].name = _names[i];
            bettingPools[newId].bids[newBidId].id = newBidId;
        }
        
        emit poolCreated(newId, msg.sender);
    }
    
    function makeBet(uint _pool, bytes32 _bidName) payable external{
        require(status == eventStatus.open);
        /* check whether bid with given name actually exists */
        bool found;
        bid storage foundBid = bettingPools[_pool].bids[0];
        for (uint8 i=0;i<bettingPools[_pool].bids.length;i++){
            if (bettingPools[_pool].bids[i].name == _bidName){
                foundBid = bettingPools[_pool].bids[i];
                found = true;
            }
        }
        require(found);
        //check for block
        if (endBlock > 0){
        	require(endBlock < block.number);
        }
        //check for minimal amount
        if (bettingPools[_pool].minBid > 0){
        	require(msg.value > bettingPools[_pool].minBid);
        }
        //check for maximal amount
        if (bettingPools[_pool].maxBid > 0){
        	require(msg.value < bettingPools[_pool].maxBid);
        }
        foundBid.whoBet.push(msg.sender);
        foundBid.amountReceived += msg.value;
        uint newBetId =bettingPools[_pool].bets.length++;
        bettingPools[_pool].bets[newBetId].person = msg.sender;
        bettingPools[_pool].bets[newBetId].amount = msg.value;
        bettingPools[_pool].bets[newBetId].bidName = foundBid.name;
        
        emit betMade(msg.value, newBetId);
    }
    
    function finishEvent() external{
        require(status == eventStatus.open && endBlock == 0);
        require(msg.sender == arbitrator);
        status = eventStatus.finished;
        emit eventStatusChanged(1);
    }
    
    function determineWinner(uint _pool, bytes32 _bidName) external onlyFinished() onlyArbitrator(){
        require (findBid(_pool, _bidName));
        bettingPool storage cPool = bettingPools[_pool];
        cPool.winner = _bidName;
        uint amountLost;
        uint amountWon;
        uint lostBetsLen;
        /*Calculating amount of all lost bets */
        for (uint x=0;x<cPool.bids.length;x++){
            if (cPool.bids[x].name != cPool.winner){
                amountLost += cPool.bids[x].amountReceived;
            }
        }
        
        /* Calculating amount of all won bets */
        for (uint8 x=0;x<cPool.bets.length;x++){
            if(cPool.bets[x].bidName == cPool.winner){
                uint wonBetAmount = cPool.bets[x].amount;
                amountWon += wonBetAmount;
                pendingWithdrawals[cPool.bets[x].person] += wonBetAmount;
            } else {
                lostBetsLen++;
            }
        }
        /* If we do have win bets */
        if (amountWon > 0){
            pendingWithdrawals[arbitrator] += amountLost/100*arbitratorFee;
            amountLost = amountLost - (amountLost/100*arbitratorFee);
            for (uint8 x=0;x<cPool.bets.length;x++){
            if(cPool.bets[x].bidName == cPool.winner){
                //uint wonBetPercentage = cEvent.bets[x].amount*100/amountWon;
                uint wonBetPercentage = percent(cPool.bets[x].amount, amountWon, 2);
                pendingWithdrawals[cPool.bets[x].person] += (amountLost/100)*wonBetPercentage;
            }
        }
        } else {
            /* If we dont have any bets won, we pay all the funds back except arbitrator fee */
            for(uint8 x=0;x<cPool.bets.length;x++){
                pendingWithdrawals[cPool.bets[x].person] += cPool.bets[x].amount-((cPool.bets[x].amount/100) * arbitratorFee);
                pendingWithdrawals[arbitrator] += (cPool.bets[x].amount/100) * arbitratorFee;
            }
        }
        status = eventStatus.closed;
        emit eventStatusChanged(2);
    }
    
    function withdraw(address payable person) private{
        uint amount = pendingWithdrawals[person];
        pendingWithdrawals[person] = 0;
        person.transfer(amount);
        emit withdrawalDone(amount);
    }
    
    function requestWithdraw() external {
        //require(pendingWithdrawals[msg.sender] != 0);
        withdraw(msg.sender);
    }
    
    function findBid(uint pool, bytes32 bidName) private view returns(bool){
        for (uint8 i=0;i<bettingPools[pool].bids.length;i++){
            if(bettingPools[pool].bids[i].name == bidName){
                return true;
            }
        }
    }
    
    function calc(uint one, uint two) private pure returns(uint){
        return one/two;
    }
    function percent(uint numerator, uint denominator, uint precision) public 

    pure returns(uint quotient) {
           // caution, check safe-to-multiply here
          uint _numerator  = numerator * 10 ** (precision+1);
          // with rounding of last digit
          uint _quotient =  ((_numerator / denominator) + 5) / 10;
          return ( _quotient);
    }
    /* Getters */
    
    function getBidsNum(uint _pool) external view returns (uint){
        return bettingPools[_pool].bids.length;
    }
    
    function getBid(uint _pool, uint _bid) external view returns (uint, bytes32, uint){
        bid storage foundBid = bettingPools[_pool].bids[_bid];
        return(foundBid.id, foundBid.name, foundBid.amountReceived);
    }

    function getBetsNums(uint _pool) external view returns (uint){
        return bettingPools[_pool].bets.length;
    }

    function getWhoBet(uint _pool, uint _bid) external view returns (address[] memory){
        return bettingPools[_pool].bids[_bid].whoBet;
    }
    
    function getBet(uint _pool, uint _bet) external view returns(address, bytes32, uint){
        bet storage foundBet = bettingPools[_pool].bets[_bet];
        return (foundBet.person, foundBet.bidName, foundBet.amount);
    }
    
    function getPoolId(bytes32 _name) external view returns (uint, bool){
        for (uint i=0;i<bettingPools.length;i++){
            if(bettingPools[i].name == _name){
                return (bettingPools[i].id, true);
            }
        }
    }
    function getPoolsNum() external view returns(uint){
        return bettingPools.length;
    }
}