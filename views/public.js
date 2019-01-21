const eventsComp = Vue.component('events-component', {
    template: '#events',
    data(){
        return {
            loading: 1,
            events: []
        }
    },
    methods: {
        getEvents(){
            axios.get('/index.php?action=get-events')
                .then(response => {
                    //console.log(response.data);
                    this.loading = 0;
                    this.events = response.data;
                })
        }
    },
    mounted(){
        this.getEvents();
    }
});
const showEventComp = Vue.component('show-event-component', {
    template: '#show-event-component',
    data(){
        return {
            loading: 1,
            event: {
                name: '',
            },
            fee: 0,
            arbitrator: '',
            estatus: 0,
            end: 0,
            pools: [],
            abi:[
                {
                    "constant": true,
                    "inputs": [
                        {
                            "name": "numerator",
                            "type": "uint256"
                        },
                        {
                            "name": "denominator",
                            "type": "uint256"
                        },
                        {
                            "name": "precision",
                            "type": "uint256"
                        }
                    ],
                    "name": "percent",
                    "outputs": [
                        {
                            "name": "quotient",
                            "type": "uint256"
                        }
                    ],
                    "payable": false,
                    "stateMutability": "pure",
                    "type": "function"
                },
                {
                    "constant": true,
                    "inputs": [],
                    "name": "creator",
                    "outputs": [
                        {
                            "name": "",
                            "type": "address"
                        }
                    ],
                    "payable": false,
                    "stateMutability": "view",
                    "type": "function"
                },
                {
                    "constant": true,
                    "inputs": [],
                    "name": "endBlock",
                    "outputs": [
                        {
                            "name": "",
                            "type": "uint256"
                        }
                    ],
                    "payable": false,
                    "stateMutability": "view",
                    "type": "function"
                },
                {
                    "constant": true,
                    "inputs": [
                        {
                            "name": "",
                            "type": "uint256"
                        }
                    ],
                    "name": "bettingPools",
                    "outputs": [
                        {
                            "name": "id",
                            "type": "uint256"
                        },
                        {
                            "name": "name",
                            "type": "bytes32"
                        },
                        {
                            "name": "winner",
                            "type": "bytes32"
                        },
                        {
                            "name": "minBid",
                            "type": "uint256"
                        },
                        {
                            "name": "maxBid",
                            "type": "uint256"
                        }
                    ],
                    "payable": false,
                    "stateMutability": "view",
                    "type": "function"
                },
                {
                    "constant": true,
                    "inputs": [],
                    "name": "status",
                    "outputs": [
                        {
                            "name": "",
                            "type": "uint8"
                        }
                    ],
                    "payable": false,
                    "stateMutability": "view",
                    "type": "function"
                },
                {
                    "constant": true,
                    "inputs": [
                        {
                            "name": "_pool",
                            "type": "uint256"
                        },
                        {
                            "name": "_bet",
                            "type": "uint256"
                        }
                    ],
                    "name": "getBet",
                    "outputs": [
                        {
                            "name": "",
                            "type": "address"
                        },
                        {
                            "name": "",
                            "type": "bytes32"
                        },
                        {
                            "name": "",
                            "type": "uint256"
                        }
                    ],
                    "payable": false,
                    "stateMutability": "view",
                    "type": "function"
                },
                {
                    "constant": false,
                    "inputs": [
                        {
                            "name": "_name",
                            "type": "bytes32"
                        },
                        {
                            "name": "_names",
                            "type": "bytes32[]"
                        },
                        {
                            "name": "_minBid",
                            "type": "uint256"
                        },
                        {
                            "name": "_maxBid",
                            "type": "uint256"
                        }
                    ],
                    "name": "createPool",
                    "outputs": [],
                    "payable": false,
                    "stateMutability": "nonpayable",
                    "type": "function"
                },
                {
                    "constant": true,
                    "inputs": [
                        {
                            "name": "_pool",
                            "type": "uint256"
                        }
                    ],
                    "name": "getBetsNums",
                    "outputs": [
                        {
                            "name": "",
                            "type": "uint256"
                        }
                    ],
                    "payable": false,
                    "stateMutability": "view",
                    "type": "function"
                },
                {
                    "constant": true,
                    "inputs": [],
                    "name": "arbitratorFee",
                    "outputs": [
                        {
                            "name": "",
                            "type": "uint256"
                        }
                    ],
                    "payable": false,
                    "stateMutability": "view",
                    "type": "function"
                },
                {
                    "constant": true,
                    "inputs": [
                        {
                            "name": "_pool",
                            "type": "uint256"
                        },
                        {
                            "name": "_bid",
                            "type": "uint256"
                        }
                    ],
                    "name": "getBid",
                    "outputs": [
                        {
                            "name": "",
                            "type": "uint256"
                        },
                        {
                            "name": "",
                            "type": "bytes32"
                        },
                        {
                            "name": "",
                            "type": "uint256"
                        }
                    ],
                    "payable": false,
                    "stateMutability": "view",
                    "type": "function"
                },
                {
                    "constant": true,
                    "inputs": [
                        {
                            "name": "_pool",
                            "type": "uint256"
                        }
                    ],
                    "name": "getBidsNum",
                    "outputs": [
                        {
                            "name": "",
                            "type": "uint256"
                        }
                    ],
                    "payable": false,
                    "stateMutability": "view",
                    "type": "function"
                },
                {
                    "constant": true,
                    "inputs": [],
                    "name": "getPoolsNum",
                    "outputs": [
                        {
                            "name": "",
                            "type": "uint256"
                        }
                    ],
                    "payable": false,
                    "stateMutability": "view",
                    "type": "function"
                },
                {
                    "constant": true,
                    "inputs": [],
                    "name": "arbitrator",
                    "outputs": [
                        {
                            "name": "",
                            "type": "address"
                        }
                    ],
                    "payable": false,
                    "stateMutability": "view",
                    "type": "function"
                },
                {
                    "constant": false,
                    "inputs": [],
                    "name": "finishEvent",
                    "outputs": [],
                    "payable": false,
                    "stateMutability": "nonpayable",
                    "type": "function"
                },
                {
                    "constant": false,
                    "inputs": [
                        {
                            "name": "_pool",
                            "type": "uint256"
                        },
                        {
                            "name": "_bidName",
                            "type": "bytes32"
                        }
                    ],
                    "name": "makeBet",
                    "outputs": [],
                    "payable": true,
                    "stateMutability": "payable",
                    "type": "function"
                },
                {
                    "constant": false,
                    "inputs": [],
                    "name": "requestWithdraw",
                    "outputs": [],
                    "payable": false,
                    "stateMutability": "nonpayable",
                    "type": "function"
                },
                {
                    "constant": true,
                    "inputs": [
                        {
                            "name": "_name",
                            "type": "bytes32"
                        }
                    ],
                    "name": "getPoolId",
                    "outputs": [
                        {
                            "name": "",
                            "type": "uint256"
                        },
                        {
                            "name": "",
                            "type": "bool"
                        }
                    ],
                    "payable": false,
                    "stateMutability": "view",
                    "type": "function"
                },
                {
                    "constant": true,
                    "inputs": [
                        {
                            "name": "_pool",
                            "type": "uint256"
                        },
                        {
                            "name": "_bid",
                            "type": "uint256"
                        }
                    ],
                    "name": "getWhoBet",
                    "outputs": [
                        {
                            "name": "",
                            "type": "address[]"
                        }
                    ],
                    "payable": false,
                    "stateMutability": "view",
                    "type": "function"
                },
                {
                    "constant": true,
                    "inputs": [
                        {
                            "name": "",
                            "type": "address"
                        }
                    ],
                    "name": "pendingWithdrawals",
                    "outputs": [
                        {
                            "name": "",
                            "type": "uint256"
                        }
                    ],
                    "payable": false,
                    "stateMutability": "view",
                    "type": "function"
                },
                {
                    "constant": false,
                    "inputs": [
                        {
                            "name": "_pool",
                            "type": "uint256"
                        },
                        {
                            "name": "_bidName",
                            "type": "bytes32"
                        }
                    ],
                    "name": "determineWinner",
                    "outputs": [],
                    "payable": false,
                    "stateMutability": "nonpayable",
                    "type": "function"
                },
                {
                    "inputs": [
                        {
                            "name": "_eventId",
                            "type": "uint256"
                        },
                        {
                            "name": "_eventName",
                            "type": "bytes32"
                        },
                        {
                            "name": "_fee",
                            "type": "uint256"
                        },
                        {
                            "name": "_endBlock",
                            "type": "uint256"
                        },
                        {
                            "name": "_arbitrator",
                            "type": "address"
                        }
                    ],
                    "payable": false,
                    "stateMutability": "nonpayable",
                    "type": "constructor"
                },
                {
                    "anonymous": false,
                    "inputs": [
                        {
                            "indexed": false,
                            "name": "id",
                            "type": "uint256"
                        },
                        {
                            "indexed": false,
                            "name": "creator",
                            "type": "address"
                        }
                    ],
                    "name": "poolCreated",
                    "type": "event"
                },
                {
                    "anonymous": false,
                    "inputs": [
                        {
                            "indexed": false,
                            "name": "value",
                            "type": "uint256"
                        },
                        {
                            "indexed": false,
                            "name": "id",
                            "type": "uint256"
                        }
                    ],
                    "name": "betMade",
                    "type": "event"
                },
                {
                    "anonymous": false,
                    "inputs": [
                        {
                            "indexed": false,
                            "name": "status",
                            "type": "uint256"
                        }
                    ],
                    "name": "eventStatusChanged",
                    "type": "event"
                },
                {
                    "anonymous": false,
                    "inputs": [
                        {
                            "indexed": false,
                            "name": "amount",
                            "type": "uint256"
                        }
                    ],
                    "name": "withdrawalDone",
                    "type": "event"
                }
            ],
            contract: {},
            locked: 0,
            mining: 0,
            loadingpools: 0,
            currentblock: 0,
        }

    },
    props: {
        id: 0,
    },
    computed:{
        link(){
            return 'https://rinkeby.etherscan.io/address/'+this.event.contract;
        },
        alink(){
            return 'https://rinkeby.etherscan.io/address/'+this.arbitrator;
        },
        status(){
            if (this.estatus == 0){
                return 'Open';
            } else if (this.estatus == 1){
                return 'Finished';
            } else if (this.estatus == 2){
                return 'Closed';
            }
        },
        isarbitrator(){
            if (web3.eth.accounts[0] == this.arbitrator){
                return true;
            } else {
                return false;
            }
        },
        canfinish(){
            if (web3.eth.accounts[0] == this.arbitrator && this.estatus == 0){
                if (this.end > 0){
                    return this.currentblock > this.end;
                } else {
                    return true;
                }
            } else {
                return false;
            }
        },
        cansetwinner(){
            if (web3.eth.accounts[0] == this.arbitrator && this.estatus == 1 && !this.activepool.winner){
                return true;
            } else {
                return false;
            }
        },
    },
    methods: {
        getEvent(){
            axios.get('/index.php?action=get-event&event_id='+this.id)
                .then(response => {
                    this.loading = 0;
                    //console.log(response.data);
                    this.event = response.data;
                    this.contract = web3.eth.contract(this.abi).at(this.event.contract);
                    this.getFromBlockchain();
                    this.getPools();
                })
        },
        watchBlock(){
            let that = this;
            setInterval(function(){
                web3.eth.getBlockNumber(function(e,d){
                    that.currentblock = d;
                })
            }, 3000)
        },
        watchStatus(){
            let that = this;
            setInterval(function(){
                that.contract.status(function(e,d){
                    if (d.toNumber() != that.estatus){
                        that.mining = 0;
                    }
                    that.estatus = d.toNumber();
                })
            },3000)
        },
        addOption() {
            this.pool.options.push({name: ''});
        },
        finishevent(){
            let that = this;
            this.contract.finishEvent(function(e,d){
                if (d){
                    that.mining = 1;
                }
            })
        },
        setwinner(id, name){
            this.contract.determineWinner(id, web3.toHex(name),function(e,d){
                if (d){
                    this.mining = 1;
                }
            })
        },
        getFromBlockchain(){
            let that = this;
            let contract = web3.eth.contract(this.abi).at(this.event.contract);
            contract.arbitratorFee(function(e,d){
                that.fee = d.toNumber();
            });
            contract.arbitrator(function(e,d){
                that.arbitrator = d;
            });
            contract.endBlock(function(e,d){
                that.end = d.toNumber();
            });
            contract.status(function(e,d){
                that.estatus = d.toNumber();
            })

        },
        getPools(){
            let that = this;
            this.contract.getPoolsNum(function(e,d){
                if (d){
                    let num = d.toNumber();
                    for (let i = 0; i < num; i++){
                        that.contract.bettingPools(i, function(e,d){
                            if (d){
                                let pool = {};
                                pool.id = d[0].toNumber();
                                pool.name = web3.toAscii(d[1]).replace(/\0.*$/g,'');
                                pool.winner = web3.toAscii(d[2]);
                                pool.min = d[3].toNumber();
                                pool.max = d[4].toNumber();
                                pool.bids = [];
                                that.contract.getBidsNum(pool.id, function(e,d){
                                    if (d){
                                        bidsNum = d.toNumber();
                                        for (let y = 0; y < bidsNum; y++){
                                            that.contract.getBid(pool.id, y, function(e,d){
                                                if (d){
                                                    let bid = {};
                                                    bid.id = y;
                                                    bid.name = web3.toAscii(d[1]).replace(/\0.*$/g, '');
                                                    bid.amount = web3.fromWei(d[2].toNumber(), 'ether');
                                                    pool.bids.push(bid);
                                                }
                                            });
                                            if (y == bidsNum-1){
                                                console.log(pool);
                                                that.pools.push(pool);
                                            }
                                        }
                                    }
                                });
                            }
                        })
                    }
                }
            })
        },
        setCurrentPool(id){
            this.locked = 1;
            let that = this;
            this.possiblePools.forEach(function(elem){
                if (elem.id == id){
                    if (elem.id == 1){
                        elem.options =
                            [
                                {name: that.event.name.split('-vs-')[0]},
                                {name: 'draw'},
                                {name: that.event.name.split('-vs-')[1]}
                            ]
                    }
                    that.currentpool = elem;
                }
            })
        },
        close(){
            this.locked = 0;
            this.currentpool = false;
            this.activepool.active = 0;
        }
    },
    created(){
        this.getEvent();
        this.watchBlock();
        this.watchStatus();
    }
});
const routes = [
    {path: '/events', name:'events', component: eventsComp},
    {path: '/', redirect: '/events'},
    {path: '/event/:id', component: showEventComp, name: 'show-event', props: true},
];
const router = new VueRouter({routes});
let vm = new Vue({
    el: '#app',
    router: router,
});