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
            <div class="carousel-container" @wheel="onWheel">
                <div class="carousel-item" v-for="(progress, index) in user_progress" :key="index"
                    :style="{ backgroundColor: 'white', zIndex: getZIndex(index), left: getPositionX(index) }"
                    :class="{ 'carousel-item--active': index === activeIndex, 'carousel-item--hidden': isHidden(index) }">
                    <div class="partie-information">
                        <div style="border-radius: 3px"
                            :class="'fi fi-' + getPaysFromId(progress.language_id).language_code"></div> {{
                                getPaysFromId(progress.language_id).language_name }}
                    </div>
                    <div class="partie-barre">
                        <div id="progress"
                            :style="{ position: 'absolute',width: progress.score + '%', height: '15px', backgroundColor: getProgressColor(progress.score), borderRadius: '15px' }"
                            class="progress-inner"></div>
                        <div
                                :style="{ width:  '100%', height: '15px', backgroundColor: '#e3e3e3', borderRadius: '15px' }"
                                class="progress-inner"></div>
                    </div>

                </div>


            </div>
            <div class="espace-nom">{{ user.username }}</div>
            <div class="espace-icone" @click="logout">
                <img src="../assets/images/log-out_color.png">
            </div>
        </div>
    </nav>
    <div class="ligne"></div>
</template>

<style scoped>
.partie-information {
    width: 100%;
    height: 60%;
    font-family: "DinRoundPro-Light";
    font-size: 20px;
    font-weight: 600;
    display: flex;
    text-transform: capitalize;
    justify-content: center;
    align-items: center;


}


.progress-inner {
    height: 100%;
    background-color: #ddd;
}

.partie-barre {
    width: 100%;
    height: 40%;
    display: flex;
    align-items: center;
        padding: 0 5%;
}

.carousel-container {
    overflow: hidden;
    z-index: 1000;
    /* Ajouter cette ligne */
    justify-content: center;
    /* Ajouter cette ligne */
    align-items: center;
    /* Ajouter cette ligne */
    display: flex;
    width: 65%;
    height: 100px;
}

.carousel-item {
    position: absolute;
    left: 50%;
    transform: translateX(0%);
    display: block;
    width: 140px;
    height: 70px;
    transition: all 0.3s ease;
    margin: 0;
}

.carousel-item--active {
    left: calc(50% + 140px);
    /* 140px est la largeur des rectangles */
    transform: translateX(0%) scale(1.5);
}

.carousel-item--hidden {
    opacity: 0;
    visibility: hidden;
}


.espace-nom {
    width: 30%;
    font-family: "Whyte Medium";
    font-size: 40px;
    color: var(--dark-gris);
    display: flex;
    justify-content: flex-end;
    padding-right: 2%;
    align-items: center;
}

.espace-icone {
    width: 5%;
    background-color: rgb(194, 194, 194);
    display: flex;
    justify-content: center;
    align-items: center;
}

.espace-icone img {
    max-width: 80%;
}

.carousel-container,
.espace-nom,
.espace-icone {
    height: 100%;
}

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

.nav-user {
    width: 60%;
    height: 80%;
    display: flex;

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
            languages: [],
            user_progress: [],
            activeIndex: 0,
        };
    },
    async mounted() {


        // check s'il est connecté et s'il est connecté récupère sa progress grâce à getUserProgress() et checkIfConnected()
        this.fetchLanguages();
        this.checkIfConnected().then(() => {
            if (this.user) {
                this.getUserProgress(this.user.id);
            }
        });


    },

    watch: {
        user() {
            console.log('User changed:', this.user);
        }
    },
    methods: {
        getPaysFromId(id) {
            return this.languages.find((language) => language.id === id);
        },
        getProgressColor(progress) {
            const hue = progress / 100 * 120;
            const saturation = 100;
            const lightness = 50;
            const color = `hsl(${hue}, ${saturation}%, ${lightness}%)`;
            return color;
        },
        async fetchLanguages() {
            try {
                const response = await axios.get('http://localhost:3001/api/languages');
                this.languages = response.data;
            } catch (error) {
                console.error('Error fetching languages:', error);
            }
        },

        onWheel(event) {
            if (event.deltaY < 0) {
                this.activeIndex = (this.activeIndex - 1 + this.languages.length) % this.languages.length;
            } else {
                this.activeIndex = (this.activeIndex + 1) % this.languages.length;
            }
        },
        getZIndex(index) {
            const zIndex = Math.abs(this.languages.length - Math.abs(this.activeIndex - index));
            if (zIndex <= 1 || zIndex >= this.languages.length - 1) {
                return zIndex;
            }
            return -1;
        },
        getPositionX(index) {
            const diff = index - this.activeIndex;
            if (diff === -1 || diff === this.languages.length - 1) {
                return "49%";
            }
            if (diff === 1 || diff === -(this.languages.length - 1)) {
                return "71%";
            }
            return "60%";
        }
        ,
        isHidden(index) {
            const zIndex = Math.abs(this.languages.length - Math.abs(this.activeIndex - index));
            return zIndex > 2 && zIndex < this.languages.length - 2;
        },


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
        },
        async getUserProgress(user_id) {
            const response = await axios.get('http://localhost:3001/api/user-progress?userId=' + user_id);
            this.user_progress = response.data;
        },

    },
    async getUserInfo(identifiant) {
        const response = await axios.get('http://localhost:3001/api/user/', {
            headers: { Authorization: `Bearer ${identifiant}` },
        });
        const userA = response.data;
        console.log('user', userA);

    }

};
</script>
