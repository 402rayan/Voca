<template>
    <div class="register-container">
        <h2>Inscription</h2>
        <form @submit.prevent="register">
            <div class="form-group">
                <label for="username">Nom d'utilisateur</label>
                <input v-model="username" type="text" class="form-control" id="username" required>
            </div>
            <div class="form-group">
                <label for="email">Email</label>
                <input v-model="email" type="email" class="form-control" id="email" required>
            </div>
            <div class="form-group">
                <label for="password">Mot de passe</label>
                <input v-model="password" type="password" class="form-control" id="password" required>
            </div>
            <button type="submit" class="btn btn-primary">S'inscrire</button>
        </form>
    </div>
</template>

<script>
import axios from 'axios';

export default {
    name: 'RegisterVue',
    data() {
        return {
            username: '',
            email: '',
            password: '',
        };
    },
    methods: {
        register() {
            axios
                .post('http://localhost:3001/api/register', {
                    username: this.username,
                    email: this.email,
                    password: this.password,
                })
                .then((response) => {
                    const { message, token } = response.data;
                    alert(message);
                    localStorage.setItem('authToken', token);
                    this.$router.push('/'); // Redirigez l'utilisateur vers la page souhaitée
                })
                .catch((error) => {
                    console.error('Erreur lors de l\'inscription:', error);
                    // Vérifiez la propriété `error` dans la réponse d'erreur
                    if (error.response.data){
                        if (error.response.data.error) {
                            alert(`Erreur lors de l'inscription: ${error.response.data.error}`);
                        } else {
                            alert(`Erreur lors de l'inscription: ${error.message}`);
                        }
                    }
                    
                });
        },
    },
};
</script>

<style scoped>
.register-container {
    width: 50%;
    margin: 0 auto;
    padding-top: 50px;
}
</style>
