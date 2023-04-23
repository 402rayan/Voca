import { createRouter, createWebHistory } from 'vue-router';
import HomePage from '../components/HomePage.vue';
import Alphabets from '../components/Alphabets.vue';
import Vocabulary from '../components/Vocabulary.vue';
import LudicWords from '../components/LudicWords.vue';
import Register from '../components/Register.vue';


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
    path: '/ludic-words',
    name: 'LudicWords',
    component: LudicWords,
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;