import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import 'bootstrap/dist/css/bootstrap.min.css';
import "/node_modules/flag-icons/css/flag-icons.min.css";
import 'animate.css';
import 'animate.css/animate.min.css';

const app = createApp(App);

app.use(router);
app.mount('#app');
