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
const routes = [
    {path: '/events', name:'events', component: eventsComp},
    {path: '/', redirect: '/events'},
];
const router = new VueRouter({routes});
let vm = new Vue({
    el: '#app',
    router: router,
});