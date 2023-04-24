import { createStore } from 'vuex';
import axios from 'axios';

export default createStore({
  state: {
    user: null,
    authToken: null,
  },
  mutations: {
    setUser(state, user) {
      state.user = user;
    },
    setAuthToken(state, token) {
      state.authToken = token;
    },
  },
  actions: {
    async loginUser({ commit }, { username, password }) {
      try {
        const response = await axios.post('/api/login', {
          username,
          password,
        });

        const token = response.data.token;
        localStorage.setItem('authToken', token);
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

        const user = response.data.user;
        commit('setUser', user);
      } catch (error) {
        console.error('Erreur lors de la connexion:', error);
        throw error;
      }
    },
    async loadUserFromLocalStorage({ commit }) {
      const token = localStorage.getItem('authToken');
      if (token) {
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        try {
          const response = await axios.get('/api/user'); // Une route d'API pour récupérer les informations de l'utilisateur à l'aide du token JWT
          const user = response.data;
          commit('setUser', user);
        } catch (error) {
          console.error('Erreur lors de la récupération de l\'utilisateur:', error);
          localStorage.removeItem('authToken');
        }
      }
    },


    logoutUser({ commit }) {
      localStorage.removeItem('authToken');
      delete axios.defaults.headers.common['Authorization'];
      commit('setUser', null);
    },

  },
  modules: {},
});
