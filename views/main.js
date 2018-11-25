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
            event: {}
        }
    },
    props: {
        id: 0,
    },
    methods: {

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