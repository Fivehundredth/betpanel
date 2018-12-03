const betting = artifacts.require('./betting.sol');
contract('betting', function(accounts){
    it('creates pool', async function(){
        let c = await betting.deployed();
        let name = web3.toHex('test');
        let names = [web3.toHex('test'), web3.toHex('test1')];
        let min = web3.toWei(0, 'ether');
        let max = web3.toWei(0, 'ether');
        let create = await c.createPool(name, names, min, max);
        let pools = await c.getPoolsNum();
        console.log(pools.toNumber());
        let bidsNum = await c.getBidsNum(0);
        console.log(bidsNum.toNumber());
        let bid = await c.getBid(0,0);
        console.log(bid);
        let bid1 = await c.getBid(0,1);
        console.log(bid1);
    })
});