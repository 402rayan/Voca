import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'http://localhost:3001', // Remplacez par l'URL de votre API
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
});

export default apiClient;
