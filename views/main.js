const createEventComp = Vue.component('create-event-component',{
    template: '#create-event',
    data(){
        return {
            name: '',
            loading: 0,
        }
    },
    methods: {
        create(){
            this.loading = 1;
            axios.post('/index.php','action=create-event&name='+this.name)
                .then(response => {
                    console.log(response);
                    if (response.data.success){
                        this.$router.push('/events');
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
            pool: {
                options: ['test', 'test1'],
                name: '',
                arbitrator: '',
                fee: 0,
                min: 0,
                max: 0,
                endblock: 0
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