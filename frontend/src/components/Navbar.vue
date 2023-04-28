<template>
    <nav class="navbarVoca">
        
        <router-link class="logo" to="/">
            <img id="logo" src="../assets/images/final_voca.png">
        </router-link>
        <div v-if="!user" class="nav-buttons">
            <router-link class="connexion-button" to="/login">Connexion</router-link>
            <router-link class="inscription-button" to="/register">Inscription</router-link>
        </div>
        <div v-else class="nav-user">
                <h1>{{ user.username }}</h1>
                <a class="nav-link" href="#" @click.prevent="logout">Se déconnecter</a>
            </div>
    </nav>
    <div class="ligne"></div>

</template>
<style scoped>


.ligne {
    border-bottom: 1px solid #BEBEBE;
    box-shadow: 0 4px 4px rgba(0, 0, 0, 0.25);
    width: 80%;
    margin: 0 auto;
}
.connexion-button {
    background-color: rgba(255, 255, 255, 0);
    font-weight: normal;
    text-decoration: none;
    border-radius: 18px;
    border: 0px #B4B4B4 solid;
    text-shadow: 0px 1px 4px rgba(0, 0, 0, 0.25);
    /*box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);*/
    color: var(--dark-gris);
    cursor: pointer;
    transition: background-color 0.2s ease;
    font-family: 'Whyte Medium';
    width: 261px;
    height: 68px;
    font-size: 40px;
}

.inscription-button {
    text-decoration: none;
    font-weight: normal;
    background-color: var(--main-violet);
    border-radius: 18px;
    border: 1px #A0A0A0 solid;
    text-shadow: 0px 1px 4px rgba(0, 0, 0, 0.25);
    box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
    color: white;
    cursor: pointer;
    transition: background-color 0.2s ease;
    font-family: 'Whyte Medium';
    width: 261px;
    height: 68px;
    font-size: 40px;
}

.navbarVoca {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 120px;
    /* hauteur de votre navbar */
    background-color: #ffffff;
    /* couleur de fond de votre navbar */
    padding: 0 20px;
    /* espacement intérieur de votre navbar */
}

.nav-buttons {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    gap: 30px;
    /* espacement entre les deux boutons */
}

nav .nav-buttons a {
    display: inline-block;
    line-height: 70px;
    /* ajustez la valeur en fonction de la hauteur de votre navbar */
    vertical-align: middle;
}

.logo {
    flex-grow: 0.1;
    /* le logo prendra tout l'espace restant à gauche */
}

#logo {
    width: 250px;
    /* ajustez la taille en fonction de vos besoins */
    height: auto;
    /* permet de maintenir le ratio de l'image */
}
</style>
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

        await this.checkIfConnected();

        
    },

    watch: {
        user() {
            console.log('User changed:', this.user);
        }
    },
    methods: {

        logout() {
            // Remove the token cookie and user data
            localStorage.clear();
            this.user = null;
        },
        
        async checkIfConnected() {
            const token = localStorage.getItem('authToken');
            console.log('je cherche le token dans le local storage');

            if (token) {
                try {
                    // Make a request to the server to retrieve the user information
                    console.log('Jai trouvé un token,je fais une requete pour avoir les infos de l\'utilisateur');
                    const response = await axios.get('http://localhost:3001/api/user/', {
                        headers: { Authorization: `Bearer ${token}` },
                    });
                    this.user = response.data;
                    console.log('user', this.user);
                } catch (error) {
                    console.error('Error retrieving user information:', error);
                    // SUpprime tout le local storage
                    localStorage.clear();
                }
            }
        }
    },
    
    
};
</script>
