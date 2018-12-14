const createEventComp = Vue.component('create-event-component',{
    template: '#create-event',
    data(){
        return {
            name: '',
            loading: 0,
            id: 0,
            fee: '',
            end: '',
            arbitrator: '',
            contract: '',
            error: '',
        }
    },
    methods: {
        validate(){
            if (typeof web3 == 'undefined'){
                this.error = 'Please install MetaMask';
                return;
            }
            if (web3.eth.accounts.length == 0){
                this.error = 'Please unlock MetaMask';
                return;
            }
            if (!this.name.length){
                this.error = 'Enter name';
            } else {
                this.error = '';
            }
            if (!this.arbitrator || !web3.isAddress(this.arbitrator) ){
                this.error = 'Enter valid ETH abritrator address';
            } else {
                this.error = '';
            }
            if (!this.error){
                this.create();
            }
        },
        create(){
            this.loading = 1;
            axios.post('/index.php','action=create-event&name='+this.name)
                .then(response => {
                    //console.log(response);
                    if (response.data.success){
                        this.id = response.data.success;
                        this.deployContract();
                    }
                })
        },
        deleteEvent(){
            this.loading = 1;
            axios.post('/index.php', 'action=delete&id='+this.id)
                .then(response => {
                    console.log(response);
                    if (response.data.success){
                        this.loading = 0;
                    }
                })
        },
        updateContractAddress(){
            console.log('this.contract is '+this.contract);
            console.log('...perform post request');
            this.loading = 1;
            axios.post('/index.php', 'action=contract&event='+this.id+'&address='+this.contract)
                .then(response => {
                    console.log('Respond is :');
                    console.log(response.data);
                    if (response.data.success){
                        this.$router.push('/events');
                    }
                })
        },
        deployContract(){
            let that = this;
            let _eventId = this.id;
            let _eventName = web3.toHex(this.name);
            let _fee = this.fee ;
            let _endBlock = this.end;
            let _arbitrator = this.arbitrator ;
            let bettingContract = web3.eth.contract([{"constant":true,"inputs":[{"name":"numerator","type":"uint256"},{"name":"denominator","type":"uint256"},{"name":"precision","type":"uint256"}],"name":"percent","outputs":[{"name":"quotient","type":"uint256"}],"payable":false,"stateMutability":"pure","type":"function"},{"constant":true,"inputs":[],"name":"creator","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"endBlock","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"bettingPools","outputs":[{"name":"id","type":"uint256"},{"name":"name","type":"bytes32"},{"name":"winner","type":"bytes32"},{"name":"minBid","type":"uint256"},{"name":"maxBid","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"status","outputs":[{"name":"","type":"uint8"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_pool","type":"uint256"},{"name":"_bet","type":"uint256"}],"name":"getBet","outputs":[{"name":"","type":"address"},{"name":"","type":"bytes32"},{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_name","type":"bytes32"},{"name":"_names","type":"bytes32[]"},{"name":"_minBid","type":"uint256"},{"name":"_maxBid","type":"uint256"}],"name":"createPool","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"_pool","type":"uint256"}],"name":"getBetsNums","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"arbitratorFee","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_pool","type":"uint256"},{"name":"_bid","type":"uint256"}],"name":"getBid","outputs":[{"name":"","type":"uint256"},{"name":"","type":"bytes32"},{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_pool","type":"uint256"}],"name":"getBidsNum","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"getPoolsNum","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"arbitrator","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"finishEvent","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_pool","type":"uint256"},{"name":"_bidName","type":"bytes32"}],"name":"makeBet","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},{"constant":false,"inputs":[],"name":"requestWithdraw","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"_name","type":"bytes32"}],"name":"getPoolId","outputs":[{"name":"","type":"uint256"},{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_pool","type":"uint256"},{"name":"_bid","type":"uint256"}],"name":"getWhoBet","outputs":[{"name":"","type":"address[]"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"pendingWithdrawals","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_pool","type":"uint256"},{"name":"_bidName","type":"bytes32"}],"name":"determineWinner","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"inputs":[{"name":"_eventId","type":"uint256"},{"name":"_eventName","type":"bytes32"},{"name":"_fee","type":"uint256"},{"name":"_endBlock","type":"uint256"},{"name":"_arbitrator","type":"address"}],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":false,"name":"id","type":"uint256"},{"indexed":false,"name":"creator","type":"address"}],"name":"poolCreated","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"value","type":"uint256"},{"indexed":false,"name":"id","type":"uint256"}],"name":"betMade","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"status","type":"uint256"}],"name":"eventStatusChanged","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"amount","type":"uint256"}],"name":"withdrawalDone","type":"event"}]);
            let betting = bettingContract.new(
                _eventId,
                _eventName,
                _fee,
                _endBlock,
                _arbitrator,
                {
                    from: web3.eth.accounts[0],
                    data: '0x608060405234801561001057600080fd5b5060405160a080611698833981018060405260a081101561003057600080fd5b508051602082015160408301516060840151608090940151929391929091906064831061005c57600080fd5b600094855560019390935560029190915560045560068054600160a060020a0392909216600160a060020a03199283161790556003805460ff19169055600580543392169190911790556115e29081906100b690396000f3fe6080604052600436106101105763ffffffff7c01000000000000000000000000000000000000000000000000000000006000350416622c1a9e811461011557806302d05d3f1461015d578063083c63231461018e57806312959b89146101a3578063200d2ed2146101f85780632301b83d146102315780633620c38d146102895780633ece0d311461031557806351aecca41461033f578063582c7ffd146103545780636539528c146103a25780636b08f54f146103cc5780636cc6cde1146103e15780637e65b543146103f6578063967364ad1461040b578063b3423eec1461042e578063db620f4f14610443578063e18f7d7814610486578063f3f4370314610506578063f4abf2dc14610539575b600080fd5b34801561012157600080fd5b5061014b6004803603606081101561013857600080fd5b5080359060208101359060400135610569565b60408051918252519081900360200190f35b34801561016957600080fd5b5061017261059e565b60408051600160a060020a039092168252519081900360200190f35b34801561019a57600080fd5b5061014b6105ad565b3480156101af57600080fd5b506101cd600480360360208110156101c657600080fd5b50356105b3565b6040805195865260208601949094528484019290925260608401526080830152519081900360a00190f35b34801561020457600080fd5b5061020d6105f2565b6040518082600281111561021d57fe5b60ff16815260200191505060405180910390f35b34801561023d57600080fd5b506102616004803603604081101561025457600080fd5b50803590602001356105fb565b60408051600160a060020a039094168452602084019290925282820152519081900360600190f35b34801561029557600080fd5b50610313600480360360808110156102ac57600080fd5b813591908101906040810160208201356401000000008111156102ce57600080fd5b8201836020820111156102e057600080fd5b8035906020019184602083028401116401000000008311171561030257600080fd5b919350915080359060200135610663565b005b34801561032157600080fd5b5061014b6004803603602081101561033857600080fd5b5035610889565b34801561034b57600080fd5b5061014b6108b4565b34801561036057600080fd5b506103846004803603604081101561037757600080fd5b50803590602001356108ba565b60408051938452602084019290925282820152519081900360600190f35b3480156103ae57600080fd5b5061014b600480360360208110156103c557600080fd5b503561091a565b3480156103d857600080fd5b5061014b610945565b3480156103ed57600080fd5b5061017261094c565b34801561040257600080fd5b5061031361095b565b6103136004803603604081101561042157600080fd5b50803590602001356109e2565b34801561043a57600080fd5b50610313610d77565b34801561044f57600080fd5b5061046d6004803603602081101561046657600080fd5b5035610d82565b6040805192835290151560208301528051918290030190f35b34801561049257600080fd5b506104b6600480360360408110156104a957600080fd5b5080359060200135610df4565b60408051602080825283518183015283519192839290830191858101910280838360005b838110156104f25781810151838201526020016104da565b505050509050019250505060405180910390f35b34801561051257600080fd5b5061014b6004803603602081101561052957600080fd5b5035600160a060020a0316610e96565b34801561054557600080fd5b506103136004803603604081101561055c57600080fd5b5080359060200135610ea8565b60008082600101600a0a850290506000600a858381151561058657fe5b0460050181151561059357fe5b049695505050505050565b600554600160a060020a031681565b60045481565b60078054829081106105c157fe5b6000918252602090912060079091020180546001820154600283015460038401546004909401549294509092909185565b60035460ff1681565b60008060008060078681548110151561061057fe5b90600052602060002090600702016006018581548110151561062e57fe5b6000918252602090912060039091020180546001820154600290920154600160a060020a039091169891975095509350505050565b6000805b60075460ff821610156106ac578660078260ff1681548110151561068757fe5b90600052602060002090600702016001015414156106a457600191505b600101610667565b5080156106b857600080fd5b600780546000916106cc90600183016113e8565b9050806007828154811015156106de57fe5b9060005260206000209060070201600001819055508660078281548110151561070357fe5b9060005260206000209060070201600101819055508360078281548110151561072857fe5b9060005260206000209060070201600301819055508260078281548110151561074d57fe5b600091825260208220600460079092020101919091555b60ff811686111561084557600060078381548110151561078057fe5b906000526020600020906007020160050180548091906001016107a39190611419565b9050878760ff84168181106107b457fe5b905060200201356007848154811015156107ca57fe5b9060005260206000209060070201600501828154811015156107e857fe5b9060005260206000209060040201600101819055508060078481548110151561080d57fe5b90600052602060002090600702016005018281548110151561082b57fe5b600091825260209091206004909102015550600101610764565b506040805182815233602082015281517fc334500aac4388383891836a45c5d1508ae08a122decad92b34b0b67f3d14a5d929181900390910190a150505050505050565b600060078281548110151561089a57fe5b600091825260209091206006600790920201015492915050565b60025481565b6000806000806007868154811015156108cf57fe5b9060005260206000209060070201600501858154811015156108ed57fe5b90600052602060002090600402019050806000015481600101548260030154935093509350509250925092565b600060078281548110151561092b57fe5b600091825260209091206005600790920201015492915050565b6007545b90565b600654600160a060020a031681565b600060035460ff16600281111561096e57fe5b14801561097b5750600454155b151561098657600080fd5b600654600160a060020a0316331461099d57600080fd5b6003805460ff1916600190811790915560408051918252517f3fcf8f8068f296a809a1ac04b4c62eded5bbddb0fdc29ec37d70e6a00defabf8916020908290030190a1565b600060035460ff1660028111156109f557fe5b146109ff57600080fd5b600080600784815481101515610a1157fe5b90600052602060002090600702016005016000815481101515610a3057fe5b60009182526020822060049091020191505b6007805486908110610a5057fe5b9060005260206000209060070201600501805490508160ff161015610b045783600786815481101515610a7f57fe5b90600052602060002090600702016005018260ff16815481101515610aa057fe5b9060005260206000209060040201600101541415610afc576007805486908110610ac657fe5b90600052602060002090600702016005018160ff16815481101515610ae757fe5b90600052602060002090600402019150600192505b600101610a42565b50811515610b1157600080fd5b60006004541115610b2a576004544311610b2a57600080fd5b6000600785815481101515610b3b57fe5b9060005260206000209060070201600301541115610b80576007805485908110610b6157fe5b90600052602060002090600702016003015434111515610b8057600080fd5b6000600785815481101515610b9157fe5b9060005260206000209060070201600401541115610bd6576007805485908110610bb757fe5b90600052602060002090600702016004015434101515610bd657600080fd5b60028101805460018101825560009182526020822001805473ffffffffffffffffffffffffffffffffffffffff191633179055600382018054340190556007805486908110610c2157fe5b90600052602060002090600702016006018054809190600101610c449190611445565b905033600786815481101515610c5657fe5b906000526020600020906007020160060182815481101515610c7457fe5b906000526020600020906003020160000160006101000a815481600160a060020a030219169083600160a060020a0316021790555034600786815481101515610cb957fe5b906000526020600020906007020160060182815481101515610cd757fe5b600091825260209091206002600390920201015560018201546007805487908110610cfe57fe5b906000526020600020906007020160060182815481101515610d1c57fe5b9060005260206000209060030201600101819055507f7ab34bd06200e7c082317f756f877d9cfc2824bcd0c76caf636a921fe9bd8cb43482604051808381526020018281526020019250505060405180910390a15050505050565b610d80336112d3565b565b600080805b600754811015610ded5783600782815481101515610da157fe5b9060005260206000209060070201600101541415610de5576007805482908110610dc757fe5b90600052602060002090600702016000015460019250925050610def565b600101610d87565b505b915091565b6060600783815481101515610e0557fe5b906000526020600020906007020160050182815481101515610e2357fe5b9060005260206000209060040201600201805480602002602001604051908101604052809291908181526020018280548015610e8857602002820191906000526020600020905b8154600160a060020a03168152600190910190602001808311610e6a575b505050505090505b92915050565b60086020526000908152604090205481565b600160035460ff166002811115610ebb57fe5b1480610ec8575043600454105b156112cf57600654600160a060020a03163314156112cf57610eea8282611355565b1515610ef557600080fd5b6000600783815481101515610f0657fe5b600091825260208220600260079092020190810184905591508080805b6005850154811015610f8c57600285015460058601805483908110610f4457fe5b906000526020600020906004020160010154141515610f845760058501805482908110610f6d57fe5b906000526020600020906004020160030154840193505b600101610f23565b5060005b600685015460ff8216101561105c57600285015460068601805460ff8416908110610fb757fe5b906000526020600020906003020160010154141561104d576000856006018260ff16815481101515610fe557fe5b906000526020600020906003020160020154905080840193508060086000886006018560ff1681548110151561101757fe5b60009182526020808320600390920290910154600160a060020a0316835282019290925260400190208054909101905550611054565b6001909101905b600101610f90565b50600082111561116a5760028054600654600160a060020a03166000908152600860205260408120805460648804938402019055915402909303925b600685015460ff8216101561116457600285015460068601805460ff84169081106110bf57fe5b906000526020600020906003020160010154141561115c57600061110a866006018360ff168154811015156110f057fe5b906000526020600020906003020160020154856002610569565b905080606486040260086000886006018560ff1681548110151561112a57fe5b60009182526020808320600390920290910154600160a060020a03168352820192909252604001902080549091019055505b600101611098565b50611287565b60005b600685015460ff82161015611285576002546064866006018360ff1681548110151561119557fe5b9060005260206000209060030201600201548115156111b057fe5b0402856006018260ff168154811015156111c657fe5b9060005260206000209060030201600201540360086000876006018460ff168154811015156111f157fe5b60009182526020808320600390920290910154600160a060020a031683528201929092526040019020805490910190556002546006860180546064919060ff851690811061123b57fe5b90600052602060002090600302016002015481151561125657fe5b600654600160a060020a031660009081526008602052604090208054929091049290920201905560010161116d565b505b6003805460ff1916600290811790915560408051918252517f3fcf8f8068f296a809a1ac04b4c62eded5bbddb0fdc29ec37d70e6a00defabf8916020908290030190a1505050505b5050565b600160a060020a038116600081815260086020526040808220805490839055905190929183156108fc02918491818181858888f1935050505015801561131d573d6000803e3d6000fd5b506040805182815290517f9598756b267e966571913df494fd8c0f2079acf08d41f924142d58a809f8bfee9181900360200190a15050565b6000805b600780548590811061136757fe5b9060005260206000209060070201600501805490508160ff1610156113e1578260078581548110151561139657fe5b90600052602060002090600702016005018260ff168154811015156113b757fe5b90600052602060002090600402016001015414156113d9576001915050610e90565b600101611359565b5092915050565b815481835581811115611414576007028160070283600052602060002091820191016114149190611471565b505050565b8154818355818111156114145760040281600402836000526020600020918201910161141491906114c8565b8154818355818111156114145760030281600302836000526020600020918201910161141491906114ff565b61094991905b808211156114c4576000808255600182018190556002820181905560038201819055600482018190556114ad600583018261153e565b6114bb600683016000611562565b50600701611477565b5090565b61094991905b808211156114c4576000808255600182018190556114ef6002830182611583565b50600060038201556004016114ce565b61094991905b808211156114c457805473ffffffffffffffffffffffffffffffffffffffff191681556000600182018190556002820155600301611505565b508054600082556004029060005260206000209081019061155f91906114c8565b50565b508054600082556003029060005260206000209081019061155f91906114ff565b508054600082559060005260206000209081019061155f919061094991905b808211156114c457600081556001016115a256fea165627a7a72305820e278f3bf1fb171c239cc3ff14cd43f6cd1e5da94a87629195c57b962938fd2ff0029',
                    gas: '4700000'
                }, function (e, contract){
                    console.log(e, contract);
                    if (!e){
                        if (typeof contract.address !== 'undefined') {
                            console.log('Contract mined! address: ' + contract.address + ' transactionHash: ' + contract.transactionHash);
                            that.contract = contract.address;
                            that.updateContractAddress();
                        }
                    } else {
                        that.deleteEvent();
                    }
                })
        }
    }
});
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
    template: '#show-event',
    data(){
        return {
            loading: 1,
            event: {},
            fee: 0,
            arbitrator: '',
            end: 0,
            pools: [],
            currentpool: false,
            possiblePools:
                [
                    {
                        id: 1,
                        name: 'winner',
                        options: [
                            {name: 'team1'},
                            {name: 'team2'}
                        ],
                        min: 0,
                        max: 0,
                    },
                    {
                        id: 2,
                        name: 'exact-result',
                        options:
                            [
                                {name: '1-0'},
                                {name: '2-0'},
                                {name: '0-1'},
                                {name: '0-2'},
                                {name: '0-0'},
                                {name: '1-1'}
                            ],
                        min: 0,
                        max: 0
                    }
            ],
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
            poolcreated: 0,
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
        }
    },
    methods: {
        getEvent(){
            axios.get('/index.php?action=get-event&event_id='+this.id)
                .then(response => {
                    this.loading = 0;
                    //console.log(response.data);
                    this.event = response.data;
                    this.getFromBlockchain();
                    this.getPools();
                })
        },
        addOption() {
            this.pool.options.push({name: ''});
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
            })

        },
        createPool(){
            let that = this;
            let contract = web3.eth.contract(this.abi).at(this.event.contract);
            let hexname = web3.toHex(this.currentpool.name);
            let hexnames = [];
            this.currentpool.options.forEach(function(el){
                hexnames.push(web3.toHex(el));
            });
            contract.createPool(hexname, hexnames, this.currentpool.min, this.currentpool.max, function(e,d){
                if (d){
                    that.poolcreated = 1;
                    console.log('Sent! Hash: '+d);
                }
            });
        },
        getPools(){
            let that = this;
            let contract = web3.eth.contract(this.abi).at(this.event.contract);
            contract.getPoolsNum(function(e,d){
                if (d){
                    let num = d.toNumber();
                    for (let i = 0;i<num;i++){
                        contract.bettingPools(i, function(e,d){
                            if (d){
                                let pool = {};
                                pool.id = d[0].toNumber();
                                pool.name = web3.toAscii(d[1]).replace(/\0.*$/g,'');
                                pool.winner = web3.toAscii(d[2]);
                                pool.min = d[3].toNumber();
                                pool.max = d[4].toNumber();
                                that.pools.push(pool);
                            }
                        })
                    }
                }
            })
        },
        setCurrentPool(id){
            let that = this;
            this.possiblePools.forEach(function(elem){
                if (elem.id == id){
                    that.currentpool = elem;
                }
            })
        }
    },
    created(){
        this.getEvent();
    }
});
const routes = [
    {path: '/create-event', name:'create-event', component: createEventComp},
    {path: '/events', name:'events', component: eventsComp},
    {path: '/', redirect: '/events'},
    {path: '/event/:id', name: 'show-event', component: showEventComp, props: true}
];
const router = new VueRouter({routes});
let vm = new Vue({
    el: '#app',
    router: router
});