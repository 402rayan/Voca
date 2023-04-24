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
                    <li v-if="!user" class="nav-item">
                        <router-link class="nav-link" to="/register">S'inscrire</router-link>
                    </li>
                    <li v-if="!user" class="nav-item">
                        <div class="login-container">
                            <input v-model="username" type="text" placeholder="Nom d'utilisateur" />
                            <input v-model="password" type="password" placeholder="Mot de passe" />
                            <button @click="login">Connexion</button>
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
                            <img class="user-avatar" :src="user" alt="User avatar" />
                            <p class="user-name">{{ user.username }}</p>
                        </div>
                    </li>
                </ul>
            </div>
        </div>
    </nav>
</template>


<script>
import { mapState } from 'vuex';

export default {
    name: 'NavbarVue',
    data() {
        return {
            username: '',
            password: '',
        };
    },
    computed: {
        ...mapState(['user']),
    },
    methods: {
        async login() {
            console.log("jessaie de login");
            console.log(this.$store);
            try {
                await this.$store.dispatch('loginUser', {
                    username: this.username,
                    password: this.password,
                    
                });
            } catch (error) {
                console.error('Erreur lors de la connexion:', error);
                alert(`Erreur lors de la connexion: ${error.response.data.errorMessage}`);
            }
        },
        logout() {
            this.$store.dispatch('logoutUser');
            this.$router.push('/');
        },
    },
    created() {
        this.$store.dispatch('loadUserFromLocalStorage');
        this.$store.commit('setUser', JSON.parse(localStorage.getItem('user')));
        this.$store.commit('setAuthToken', localStorage.getItem('authToken'));
    },
};
</script>

<style scoped>
/* Votre style pour la navbar et les éléments de connexion */

/* Navbar.vue */
.user-profile {
    display: flex;
    align-items: center;
    padding: 0 1rem;
}

.user-avatar {
    width: 40px;
    height: 40px;
    margin-right: 0.5rem;
    border-radius: 50%;
    object-fit: cover;
}

.user-name {
    font-size: 1.2rem;
    font-weight: bold;
    margin: 0;
}
</style>
