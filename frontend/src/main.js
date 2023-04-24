import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import 'bootstrap/dist/css/bootstrap.min.css';
import store from './store'; // Assurez-vous d'importer le store ici



createApp(App).use(store).use(router).mount('#app');
