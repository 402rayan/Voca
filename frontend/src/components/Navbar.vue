<template>
    <nav class="navbarVoca">

        <router-link class="logo" to="/">
            <img id="logo" src="../assets/images/logo_3.png">
        </router-link>
        <div v-if="!user" class="nav-buttons">
            <router-link class="connexion-button" to="/login">Connexion</router-link>
            <router-link class="inscription-button" to="/register">Inscription</router-link>
        </div>
        <div v-else class="nav-user">
            <div class="carousel-container" @wheel="onWheel" @click="onWheel" @contextmenu.prevent="onWheel">
                <div class="carousel-item" v-for="(progress, index) in user_progress" :key="index"
                    :style="{ zIndex: getZIndex(index), left: getPositionX(index) }"
                    :class="{ 'carousel-item--active': index === activeIndex, 'carousel-item--hidden': isHidden(index) }">
                    <div class="partie-information" style="display: flex; align-items: flex-end; padding-bottom : 5px">
                        <div style="border-radius: 3px; margin-right: 3px;    transform: translateY(-3px);"
                            :class="'fi fi-' + getPaysFromId(progress.language_id).language_code"></div>
                        <span style="text-align: center;">{{ getPaysFromId(progress.language_id).language_name }}</span>
                    </div>

                    <div class="partie-barre">
                        <div id="progress"
                            :style="{ position: 'absolute', width: getProgressWidth(progress.score) + '%', height: '11px', backgroundColor: getProgressColor(progress.score), borderRadius: '15px' }"
                            class="progress-inner"></div>

                        <div :style="{ width: '100%', height: '11px', backgroundColor: 'rgb(233 233 233)', borderRadius: '15px' }"
                            class="progress-inner"></div>
                    </div>

                </div>


            </div>
            <div class="espace-nom">{{ user.username }}</div>
            <div class="espace-icone" @click="logout">
                <img src="../assets/images/exit.png">
            </div>
        </div>
    </nav>
    <div class="ligne"></div>
</template>

<style scoped>
@keyframes floatLogo {
    0% {
        transform: translateY(0px);
    }

    50% {
        transform: translateY(-3px);
    }

    100% {
        transform: translateY(0px);
    }
}

#logo {
    animation: floatLogo 3s ease-in-out infinite;
}

#progress 
{
    transition: width 1s ease;
}

.connexion-button:hover {
    background-color: rgb(240, 240, 240);
}

.inscription-button:hover {
    background-color: var(--main-violet-dark);
}

.espace-nom:hover {
    color: var(--main-violet);
}

.espace-icone img:hover {
    transform: rotate(90deg);
    cursor: pointer;
    transition: transform 0.3s ease-in-out;
}

.partie-information {
    color: var(--dark-gris);
    width: 100%;
    height: 60%;
    font-family: "DinRoundPro-Light";
    font-size: 16px;
    font-weight: 600;
    display: flex;
    text-transform: capitalize;
    justify-content: center;
    align-items: flex-end;


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
    transition: all 0.3s ease, opacity 0.3s ease;
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
    transition: color 200ms ease;
}

.espace-icone {
    width: 5%;
    display: flex;
    justify-content: flex-start;
    align-items: center;
}

.espace-icone img {
    max-width: 50%;
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
                setInterval(async () => {
                    await this.getUserProgress(this.user.id);
                }, 10000);
            }
        });



    },

    watch: {
        user() {
        }
    },
    methods: {
        getProgressWidth(progress) {
            const maxScore = 100;
            const adjustedProgress = Math.min(progress, maxScore);
            const width = (Math.log10(adjustedProgress + 1) / Math.log10(maxScore + 1)) * 90;
            if (width < 0) {
                return 0;
            }
            else if (width > 89) {
                return 89;
            }
            return width;
        },
        getPaysFromId(id) {
            return this.languages.find((language) => language.id === id);
        },
        getProgressColor(progress) {
            const maxScore = 100;
            const adjustedProgress = Math.min(progress, maxScore);
            const hue = adjustedProgress / maxScore * 120;
            const saturation = 90; // Diminuez la saturation pour obtenir des couleurs pastel
            const lightness = 70; // Augmentez la luminosité pour obtenir des couleurs pastel
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
            if (zIndex <= 1 || zIndex >= this.languages.length - 1) {
                return false;
            }
            return true;
        },


        logout() {
            // Remove the token cookie and user data
            localStorage.clear();
            this.user = null;
        },

        async checkIfConnected() {
            const token = localStorage.getItem('authToken');

            if (token) {
                try {
                    // Make a request to the server to retrieve the user information
                    const response = await axios.get('http://localhost:3001/api/user/', {
                        headers: { Authorization: `Bearer ${token}` },
                    });
                    this.user = response.data;
                    localStorage.clear();
                    localStorage.setItem('authToken', token);
                    localStorage.setItem('user', JSON.stringify(this.user));

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

};
</script>
