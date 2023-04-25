<template>
    <nav class="navbar navbar-expand-lg navbar-dark bg-primary">
        <div class="container">
            <router-link class="navbar-brand" to="/">Voca</router-link>
            <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarContent"
                aria-controls="navbarContent" aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
            </button>

            <div class="collapse navbar-collapse" id="navbarContent">
                <ul class="navbar-nav">
                    <li v-if="!user" class="nav-item">
                        <router-link class="nav-link" to="/register">S'inscrire</router-link>
                    </li>
                    <li v-if="!user" class="nav-item">
                        <div class="login-container">
                            <input v-model="username" type="text" placeholder="Nom d'utilisateur" />
                            <input v-model="password" type="password" placeholder="Mot de passe" />
                            <button @click="handleLogin">Connexion</button>
                        </div>
                    </li>
                    <li v-if="user" class="nav-item">
                        <a class="nav-link" href="#" @click.prevent="logout">Se déconnecter</a>
                    </li>
                    <li class="nav-item">
                        <router-link class="nav-link" to="/add-word">Ajouter un mot</router-link>
                    </li>
                    <li v-if="user" class="nav-item">
                        <div class="user-profile">
                            <p class="user-name">{{ user.username }}</p>
                        </div>
                    </li>
                </ul>
            </div>
        </div>
    </nav>
</template>

<script>
import axios from 'axios';

export default {
    name: 'NavbarVue',
    data() {
        return {
            user: null,
            username: '',
            password: '',
        };
    },
    async mounted() {

    // Check if the token is present in local storage
    const token = localStorage.getItem('authToken');

    if (token) {
        try {
            // Make a request to the server to retrieve the user information
            console.log('je fais une requete pour avoir les infos de l\'utilisateur');
            const response = await axios.get('http://localhost:3001/api/user/', {
                headers: { Authorization: `Bearer ${token}` },
            });
            this.user = response.data;
            console.log('user', this.user);
        } catch (error) {
            console.error('Error retrieving user information:', error);
        }
    }
},


    methods: {
        async handleLogin() {
            try {
                const response = await axios.post('/api/login', {
                    username: this.username,
                    password: this.password,
                });

                // Set the user data and token as a local storage item
                this.user = response.data.user;
                localStorage.clear();
                const token = response.data.token;
                localStorage.setItem('authToken', token);
                localStorage.setItem('user', this.user);


                // Clear the login form
                this.username = '';
                this.password = '';
            } catch (error) {
                console.error('Error logging in:', error);
            }
        },


        logout() {
            // Remove the token cookie and user data
            localStorage.clear();
            this.user = null;
        },
    },
};
</script>
