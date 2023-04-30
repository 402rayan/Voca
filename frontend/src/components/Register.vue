<template>
    <div class="fil-arianne"><RouterLink to="/" >home</RouterLink> > register</div>
    <form @submit.prevent="register" class="wrapper" style="animation : fadeIn 1s ease">
            <div class="register-form">
                <input v-model="username" type="text" placeholder="Nom d'utilisateur">
                <input v-model="email" type="email" placeholder="E-mail">
                <input v-model="password" type="password" placeholder="Mot de passe">
                <button type="submit" class="register-button">S'inscrire</button>
                <div class="register-line"></div>
                <button class="register-google-button">S'inscrire avec Google</button>
            </div>
        </form>
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
    mounted:
        function () {
            if (localStorage.getItem('authToken')) {
                this.$router.push('/');
            }
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

                    const response_deux = axios.post('/api/login', {
                        username: this.username,
                        password: this.password,
                    }).then((response_deux) => {
                        this.user = response_deux.data.user;
                        localStorage.setItem('user', JSON.stringify(this.user));
                        this.$router.push('/'); // Redirigez l'utilisateur vers la page souhaitée
                        location.reload();
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
                    this.user = response_deux.data.user;
                    localStorage.setItem('user', JSON.stringify(this.user));
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
.wrapper {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 80vh;
}

.register-form {
    display: flex;
    flex-direction: column;
    align-items: center;
    border-radius: 8px;
    width: 25%;
    height: 70%;
    padding: 24px;
}

input[type="text"],
input[type="password"],
input[type="email"] {
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

.register-button {
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

.register-google-button {
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

.register-line {
    width: 100%;
    height: 1px;
    background-color: #b6b6b6;
    margin: 16px 0;
        box-shadow: 0 4px 4px rgba(0, 0, 0, 0.25);
}

</style>
