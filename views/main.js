const createEventComp = Vue.component('create-event-component',{
    template: '#create-event',
    data(){
        return {
            name: '',
            loading: 0,
            id: 0,
            fee: 0,
            end: 0,
            arbitrator: '',
            contract: ''
        }
    },
    methods: {
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
            let bettingContract = web3.eth.contract([{"constant":true,"inputs":[{"name":"numerator","type":"uint256"},{"name":"denominator","type":"uint256"},{"name":"precision","type":"uint256"}],"name":"percent","outputs":[{"name":"quotient","type":"uint256"}],"payable":false,"stateMutability":"pure","type":"function"},{"constant":true,"inputs":[],"name":"creator","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"endBlock","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"bettingPools","outputs":[{"name":"id","type":"uint256"},{"name":"name","type":"bytes32"},{"name":"winner","type":"bytes32"},{"name":"minBid","type":"uint256"},{"name":"maxBid","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"status","outputs":[{"name":"","type":"uint8"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_pool","type":"uint256"},{"name":"_bet","type":"uint256"}],"name":"getBet","outputs":[{"name":"","type":"address"},{"name":"","type":"bytes32"},{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_name","type":"bytes32"},{"name":"_names","type":"bytes32[]"},{"name":"_minBid","type":"uint256"},{"name":"_maxBid","type":"uint256"}],"name":"createPool","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"_pool","type":"uint256"}],"name":"getBetsNums","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"arbitratorFee","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_pool","type":"uint256"},{"name":"_bid","type":"uint256"}],"name":"getBid","outputs":[{"name":"","type":"uint256"},{"name":"","type":"bytes32"},{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_pool","type":"uint256"}],"name":"getBidsNum","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"arbitrator","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"finishEvent","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_pool","type":"uint256"},{"name":"_bidName","type":"bytes32"}],"name":"makeBet","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},{"constant":false,"inputs":[],"name":"requestWithdraw","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"_name","type":"bytes32"}],"name":"getPoolId","outputs":[{"name":"","type":"uint256"},{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_pool","type":"uint256"},{"name":"_bid","type":"uint256"}],"name":"getWhoBet","outputs":[{"name":"","type":"address[]"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"pendingWithdrawals","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_pool","type":"uint256"},{"name":"_bidName","type":"bytes32"}],"name":"determineWinner","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"inputs":[{"name":"_eventId","type":"uint256"},{"name":"_eventName","type":"bytes32"},{"name":"_fee","type":"uint256"},{"name":"_endBlock","type":"uint256"},{"name":"_arbitrator","type":"address"}],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":false,"name":"id","type":"uint256"},{"indexed":false,"name":"creator","type":"address"}],"name":"poolCreated","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"value","type":"uint256"},{"indexed":false,"name":"id","type":"uint256"}],"name":"betMade","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"status","type":"uint256"}],"name":"eventStatusChanged","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"amount","type":"uint256"}],"name":"withdrawalDone","type":"event"}]);
            let betting = bettingContract.new(
                _eventId,
                _eventName,
                _fee,
                _endBlock,
                _arbitrator,
                {
                    from: web3.eth.accounts[0],
                    data: '0x608060405234801561001057600080fd5b5060405160a0806116c9833981018060405260a081101561003057600080fd5b508051602082015160408301516060840151608090940151929391929091906064831061005c57600080fd5b600094855560019390935560029190915560045560068054600160a060020a0392909216600160a060020a03199283161790556003805460ff19169055600580543392169190911790556116139081906100b690396000f3fe6080604052600436106101055763ffffffff7c01000000000000000000000000000000000000000000000000000000006000350416622c1a9e811461010a57806302d05d3f14610152578063083c63231461018357806312959b8914610198578063200d2ed2146101ed5780632301b83d146102265780633620c38d1461027e5780633ece0d311461030a57806351aecca414610334578063582c7ffd146103495780636539528c146103975780636cc6cde1146103c15780637e65b543146103d6578063967364ad146103eb578063b3423eec1461040e578063db620f4f14610423578063e18f7d7814610466578063f3f43703146104e6578063f4abf2dc14610519575b600080fd5b34801561011657600080fd5b506101406004803603606081101561012d57600080fd5b5080359060208101359060400135610549565b60408051918252519081900360200190f35b34801561015e57600080fd5b5061016761057e565b60408051600160a060020a039092168252519081900360200190f35b34801561018f57600080fd5b5061014061058d565b3480156101a457600080fd5b506101c2600480360360208110156101bb57600080fd5b5035610593565b6040805195865260208601949094528484019290925260608401526080830152519081900360a00190f35b3480156101f957600080fd5b506102026105d2565b6040518082600281111561021257fe5b60ff16815260200191505060405180910390f35b34801561023257600080fd5b506102566004803603604081101561024957600080fd5b50803590602001356105db565b60408051600160a060020a039094168452602084019290925282820152519081900360600190f35b34801561028a57600080fd5b50610308600480360360808110156102a157600080fd5b813591908101906040810160208201356401000000008111156102c357600080fd5b8201836020820111156102d557600080fd5b803590602001918460208302840111640100000000831117156102f757600080fd5b919350915080359060200135610643565b005b34801561031657600080fd5b506101406004803603602081101561032d57600080fd5b50356108be565b34801561034057600080fd5b506101406108e9565b34801561035557600080fd5b506103796004803603604081101561036c57600080fd5b50803590602001356108ef565b60408051938452602084019290925282820152519081900360600190f35b3480156103a357600080fd5b50610140600480360360208110156103ba57600080fd5b503561094f565b3480156103cd57600080fd5b5061016761097a565b3480156103e257600080fd5b50610308610989565b6103086004803603604081101561040157600080fd5b5080359060200135610a10565b34801561041a57600080fd5b50610308610da5565b34801561042f57600080fd5b5061044d6004803603602081101561044657600080fd5b5035610db0565b6040805192835290151560208301528051918290030190f35b34801561047257600080fd5b506104966004803603604081101561048957600080fd5b5080359060200135610e22565b60408051602080825283518183015283519192839290830191858101910280838360005b838110156104d25781810151838201526020016104ba565b505050509050019250505060405180910390f35b3480156104f257600080fd5b506101406004803603602081101561050957600080fd5b5035600160a060020a0316610ec4565b34801561052557600080fd5b506103086004803603604081101561053c57600080fd5b5080359060200135610ed6565b60008082600101600a0a850290506000600a858381151561056657fe5b0460050181151561057357fe5b049695505050505050565b600554600160a060020a031681565b60045481565b60078054829081106105a157fe5b6000918252602090912060079091020180546001820154600283015460038401546004909401549294509092909185565b60035460ff1681565b6000806000806007868154811015156105f057fe5b90600052602060002090600702016006018581548110151561060e57fe5b6000918252602090912060039091020180546001820154600290920154600160a060020a039091169891975095509350505050565b6000805b60075460ff8216101561068c578660078260ff1681548110151561066757fe5b906000526020600020906007020160010154141561068457600191505b600101610647565b50801561069857600080fd5b60005b60ff81168511156106ec57858560ff60018401168181106106b857fe5b9050602002013586868360ff1681811015156106d057fe5b90506020020135141515156106e457600080fd5b60010161069b565b50600780546000916107019060018301611416565b90508060078281548110151561071357fe5b9060005260206000209060070201600001819055508660078281548110151561073857fe5b9060005260206000209060070201600101819055508360078281548110151561075d57fe5b9060005260206000209060070201600301819055508260078281548110151561078257fe5b600091825260208220600460079092020101919091555b60ff811686111561087a5760006007838154811015156107b557fe5b906000526020600020906007020160050180548091906001016107d89190611447565b9050878760ff84168181106107e957fe5b905060200201356007848154811015156107ff57fe5b90600052602060002090600702016005018281548110151561081d57fe5b9060005260206000209060040201600101819055508060078481548110151561084257fe5b90600052602060002090600702016005018281548110151561086057fe5b600091825260209091206004909102015550600101610799565b506040805182815233602082015281517fc334500aac4388383891836a45c5d1508ae08a122decad92b34b0b67f3d14a5d929181900390910190a150505050505050565b60006007828154811015156108cf57fe5b600091825260209091206006600790920201015492915050565b60025481565b60008060008060078681548110151561090457fe5b90600052602060002090600702016005018581548110151561092257fe5b90600052602060002090600402019050806000015481600101548260030154935093509350509250925092565b600060078281548110151561096057fe5b600091825260209091206005600790920201015492915050565b600654600160a060020a031681565b600060035460ff16600281111561099c57fe5b1480156109a95750600454155b15156109b457600080fd5b600654600160a060020a031633146109cb57600080fd5b6003805460ff1916600190811790915560408051918252517f3fcf8f8068f296a809a1ac04b4c62eded5bbddb0fdc29ec37d70e6a00defabf8916020908290030190a1565b600060035460ff166002811115610a2357fe5b14610a2d57600080fd5b600080600784815481101515610a3f57fe5b90600052602060002090600702016005016000815481101515610a5e57fe5b60009182526020822060049091020191505b6007805486908110610a7e57fe5b9060005260206000209060070201600501805490508160ff161015610b325783600786815481101515610aad57fe5b90600052602060002090600702016005018260ff16815481101515610ace57fe5b9060005260206000209060040201600101541415610b2a576007805486908110610af457fe5b90600052602060002090600702016005018160ff16815481101515610b1557fe5b90600052602060002090600402019150600192505b600101610a70565b50811515610b3f57600080fd5b60006004541115610b58576004544311610b5857600080fd5b6000600785815481101515610b6957fe5b9060005260206000209060070201600301541115610bae576007805485908110610b8f57fe5b90600052602060002090600702016003015434111515610bae57600080fd5b6000600785815481101515610bbf57fe5b9060005260206000209060070201600401541115610c04576007805485908110610be557fe5b90600052602060002090600702016004015434101515610c0457600080fd5b60028101805460018101825560009182526020822001805473ffffffffffffffffffffffffffffffffffffffff191633179055600382018054340190556007805486908110610c4f57fe5b90600052602060002090600702016006018054809190600101610c729190611473565b905033600786815481101515610c8457fe5b906000526020600020906007020160060182815481101515610ca257fe5b906000526020600020906003020160000160006101000a815481600160a060020a030219169083600160a060020a0316021790555034600786815481101515610ce757fe5b906000526020600020906007020160060182815481101515610d0557fe5b600091825260209091206002600390920201015560018201546007805487908110610d2c57fe5b906000526020600020906007020160060182815481101515610d4a57fe5b9060005260206000209060030201600101819055507f7ab34bd06200e7c082317f756f877d9cfc2824bcd0c76caf636a921fe9bd8cb43482604051808381526020018281526020019250505060405180910390a15050505050565b610dae33611301565b565b600080805b600754811015610e1b5783600782815481101515610dcf57fe5b9060005260206000209060070201600101541415610e13576007805482908110610df557fe5b90600052602060002090600702016000015460019250925050610e1d565b600101610db5565b505b915091565b6060600783815481101515610e3357fe5b906000526020600020906007020160050182815481101515610e5157fe5b9060005260206000209060040201600201805480602002602001604051908101604052809291908181526020018280548015610eb657602002820191906000526020600020905b8154600160a060020a03168152600190910190602001808311610e98575b505050505090505b92915050565b60086020526000908152604090205481565b600160035460ff166002811115610ee957fe5b1480610ef6575043600454105b156112fd57600654600160a060020a03163314156112fd57610f188282611383565b1515610f2357600080fd5b6000600783815481101515610f3457fe5b600091825260208220600260079092020190810184905591508080805b6005850154811015610fba57600285015460058601805483908110610f7257fe5b906000526020600020906004020160010154141515610fb25760058501805482908110610f9b57fe5b906000526020600020906004020160030154840193505b600101610f51565b5060005b600685015460ff8216101561108a57600285015460068601805460ff8416908110610fe557fe5b906000526020600020906003020160010154141561107b576000856006018260ff1681548110151561101357fe5b906000526020600020906003020160020154905080840193508060086000886006018560ff1681548110151561104557fe5b60009182526020808320600390920290910154600160a060020a0316835282019290925260400190208054909101905550611082565b6001909101905b600101610fbe565b5060008211156111985760028054600654600160a060020a03166000908152600860205260408120805460648804938402019055915402909303925b600685015460ff8216101561119257600285015460068601805460ff84169081106110ed57fe5b906000526020600020906003020160010154141561118a576000611138866006018360ff1681548110151561111e57fe5b906000526020600020906003020160020154856002610549565b905080606486040260086000886006018560ff1681548110151561115857fe5b60009182526020808320600390920290910154600160a060020a03168352820192909252604001902080549091019055505b6001016110c6565b506112b5565b60005b600685015460ff821610156112b3576002546064866006018360ff168154811015156111c357fe5b9060005260206000209060030201600201548115156111de57fe5b0402856006018260ff168154811015156111f457fe5b9060005260206000209060030201600201540360086000876006018460ff1681548110151561121f57fe5b60009182526020808320600390920290910154600160a060020a031683528201929092526040019020805490910190556002546006860180546064919060ff851690811061126957fe5b90600052602060002090600302016002015481151561128457fe5b600654600160a060020a031660009081526008602052604090208054929091049290920201905560010161119b565b505b6003805460ff1916600290811790915560408051918252517f3fcf8f8068f296a809a1ac04b4c62eded5bbddb0fdc29ec37d70e6a00defabf8916020908290030190a1505050505b5050565b600160a060020a038116600081815260086020526040808220805490839055905190929183156108fc02918491818181858888f1935050505015801561134b573d6000803e3d6000fd5b506040805182815290517f9598756b267e966571913df494fd8c0f2079acf08d41f924142d58a809f8bfee9181900360200190a15050565b6000805b600780548590811061139557fe5b9060005260206000209060070201600501805490508160ff16101561140f57826007858154811015156113c457fe5b90600052602060002090600702016005018260ff168154811015156113e557fe5b9060005260206000209060040201600101541415611407576001915050610ebe565b600101611387565b5092915050565b81548183558181111561144257600702816007028360005260206000209182019101611442919061149f565b505050565b8154818355818111156114425760040281600402836000526020600020918201910161144291906114f9565b815481835581811115611442576003028160030283600052602060002091820191016114429190611530565b6114f691905b808211156114f2576000808255600182018190556002820181905560038201819055600482018190556114db600583018261156f565b6114e9600683016000611593565b506007016114a5565b5090565b90565b6114f691905b808211156114f25760008082556001820181905561152060028301826115b4565b50600060038201556004016114ff565b6114f691905b808211156114f257805473ffffffffffffffffffffffffffffffffffffffff191681556000600182018190556002820155600301611536565b508054600082556004029060005260206000209081019061159091906114f9565b50565b50805460008255600302906000526020600020908101906115909190611530565b508054600082559060005260206000209081019061159091906114f691905b808211156114f257600081556001016115d356fea165627a7a723058204f3c7609a6d33a21c8f2b2ad6d45c6a9cf9f9bc5e36d21b6f26656f3911bc9a80029',
                    gas: '4700000'
                }, function (e, contract){
                    console.log(e, contract);
                    if (typeof contract.address !== 'undefined') {
                        console.log('Contract mined! address: ' + contract.address + ' transactionHash: ' + contract.transactionHash);
                        that.contract = contract.address;
                        that.updateContractAddress();
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
            create: 0,
            fee: 0,
            arbitrator: '',
            end: 0,
            pool: {
                options: [
                    {name: 'test'},
                    {name: 'test1'}
                ],
                name: '',
                min: 0,
                max: 0,
            }
        }
    },
    props: {
        id: 0,
    },
    methods: {
        getEvent(){
            axios.get('/index.php?action=get-event&event_id='+this.id)
                .then(response => {
                    this.loading = 0;
                    //console.log(response.data);
                    this.event = response.data;
                    this.getFromBlockchain();
                })
        },
        addOption() {
            this.pool.options.push({name: ''});
        },
        getFromBlockchain(){
            let that = this;
            let abi = [
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
            ];
            let contract = web3.eth.contract(abi).at(this.event.contract);
            contract.arbitratorFee(function(e,d){
                that.fee = d.toNumber();
            });
            contract.arbitrator(function(e,d){
                that.arbitrator = d;
            });
            contract.endBlock(function(e,d){
                that.end = d.toNumber();
            })

        }
    },
    mounted(){
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