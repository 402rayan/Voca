<template>
    <nav class="navbar navbar-expand-lg navbar-dark bg-primary">
        <div class="container">
            <router-link class="navbar-brand" to="/">Voca</router-link>
            <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarContent"
                aria-controls="navbarContent" aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
            </button>

            <div class="collapse navbar-collapse" id="navbarContent">
                <ul class="navbar-nav mr-auto">
                    <!-- Ajoutez d'autres liens de navigation ici si nécessaire -->
                </ul>
                <ul class="navbar-nav">
                    <li v-if="!isLoggedIn" class="nav-item">
                        <router-link class="nav-link" to="/register">S'inscrire</router-link>
                    </li>
                    <li v-if="!isLoggedIn" class="nav-item">
                        <div v-if="!isLoggedIn" class="login-container">
                <input v-model="username" type="text" placeholder="Nom d'utilisateur" />
                <input v-model="password" type="password" placeholder="Mot de passe" />
                <button @click="login">Connexion</button>
            </div>
            <div v-if="isLoggedIn" class="logout-container">
                <button @click="logout">Déconnexion</button>
            </div>

                    </li>
                    <li v-if="isLoggedIn" class="nav-item">
                        <a class="nav-link" href="#" @click.prevent="logout">Se déconnecter</a>
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
            isLoggedIn: false,
            username: '',
            password: '',
        };
    },
    created() {
        // Vérifiez si l'utilisateur est connecté en vérifiant la présence d'un JWT dans le localStorage
        this.isLoggedIn = !!localStorage.getItem('authToken');
    },
    methods: {
        async login() {
            try {
                const response = await axios.post('http://localhost:3001/api/login', {
                    username: this.username,
                    password: this.password,
                });

                const authToken = response.data.token;
                localStorage.setItem('authToken', authToken);
                this.isLoggedIn = true;
            } catch (error) {
                console.error('Erreur lors de la connexion:', error);
                alert(`Erreur lors de la connexion: ${error.response.data.errorMessage}`);
            }
        },
        logout() {
            localStorage.removeItem('authToken');
            this.isLoggedIn = false;
            this.$router.push('/');
        },
    },
};
</script>

<style scoped>
/* Votre style pour la navbar et les éléments de connexion */
</style>
