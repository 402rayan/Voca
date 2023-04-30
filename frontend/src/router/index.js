import { createRouter, createWebHistory } from 'vue-router';
import HomePage from '../components/HomePage.vue';
import Alphabets from '../components/Alphabets.vue';
import Vocabulary from '../components/Vocabulary.vue';
import Sentences from '../components/Sentences.vue';
import Register from '../components/Register.vue';
import AddWord from '../components/AddWord.vue';
import Login from '../components/Login.vue';


const routes = [
  {
    path: '/',
    name: 'Home',
    component: HomePage,
  },
  {
    path: '/register',
    name: 'Register',
    component: Register,
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
  },
  {
    path: '/add-word',
    name: 'AddWord',
    component: AddWord,
  },
  {
    path: '/alphabets',
    name: 'Alphabets',
    component: Alphabets,
  },
  {
    path: '/vocabulary',
    name: 'Vocabulary',
    component: Vocabulary,
  },
  {
    path: '/sentences',
    name: 'Sentences',
    component: Sentences,
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;