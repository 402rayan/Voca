<template>
    <div class="fil-arianne"><RouterLink to="/" >home</RouterLink> > login</div>
    <form @submit.prevent="handleLogin" class="wrapper" style="animation : fadeIn 1s ease">
        <div class="login-form">
            <input v-model="username" type="text" placeholder="Nom d'utilisateur">
            <input v-model="password" type="password" placeholder="Mot de passe">
            <button type="submit" @click="handleLogin" class="login-button">Se connecter</button>
            <div class="login-line"></div>
            <button class="login-google-button">Se connecter avec Google</button>
        </div>
    </form>
</template>

<style scoped>
.wrapper {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 80vh;
}

.login-form {
    display: flex;
    flex-direction: column;
    align-items: center;
    border-radius: 8px;
    width: 25%;
    height: 70%;
    padding: 24px;
}

input[type="text"],
input[type="password"] {
    width: 100%;
    height:13%;
    margin: 8px 0;
    padding: 12px 16px;
    border-radius: 8px;
    border: 1px solid #ADADAD;
    box-shadow: 0 4px 4px rgba(0, 0, 0, 0.25);
    background-color: #F4F4F4;
    font-size: 20px;
    font-family: "DINRoundPro-Bold";
    font-weight: bold;
    color: var(--dark-gris);
    outline: none;
}

input::placeholder {
    color: #ADADAD;
}

button {
    margin: 16px 0;
    padding: 12px 32px;
    border-radius: 8px;
    font-size: 16px;
    font-weight: bold;
    color: white;
    cursor: pointer;
    outline: none;
    border: none;
}

.login-button {
    text-decoration: none;
    font-weight: normal;
    background-color: var(--main-violet);
    border-radius: 18px;
    border: 1px #A0A0A0 solid;
    text-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
    box-shadow: 0px 8px 4px rgba(0, 0, 0, 0.25);
    color: white;
    cursor: pointer;
    transition: background-color 0.2s ease;
    font-family: 'Whyte Medium';
    font-size: 22px;
}

.login-google-button {
    text-decoration: none;
    font-weight: normal;
    background-color: var(--main-beige);
    border-radius: 18px;
    border: 1px #cbcbcb solid;
    box-shadow: 0px 8px 4px rgba(0, 0, 0, 0.25);
    color: var(--dark-gris);
    cursor: pointer;
    transition: background-color 0.2s ease;
    font-family: 'Whyte Medium';
    font-size: 22px;
}

.login-line {
    width: 100%;
    height: 1px;
    background-color: #b6b6b6;
    margin: 16px 0;
        box-shadow: 0 4px 4px rgba(0, 0, 0, 0.25);
}
</style>

<script>
import axios from 'axios';

export default {
    name: 'loginVue',
    data() {
        return {
            username: '',
            password: ''
        }
    },
    methods: {
        submitForm() {
            // Mettre en place votre logique de connexion ici
        },
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
                // met dans le local storage this.user sous forme de json
                localStorage.setItem('user', JSON.stringify(this.user));


                // Clear the login form
                location.reload();

            } catch (error) {
                console.error('Error logging in:', error);
            }
        },
    },
    mounted:
    function () {
        if (localStorage.getItem('authToken')) {
            this.$router.push('/');
        }
    }
    

}
</script>

