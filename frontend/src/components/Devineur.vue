<template>
    <div class="fil-arianne">
        <RouterLink to="/">home</RouterLink> > {{ this.titre }}
    </div>

    <div class="wrapper" style="animation : fadeIn 1s ease">

        <div class="wrapper-word">
            <div class="espace-langage">
                <div class="language-selector" @click="toggleSourceLanguageList">

                    <div class="language-flag">
                        <div :class="'fi fi-' + sourceLanguage.language_code"></div>
                    </div>

                    <div class="language-name">{{ sourceLanguage.language_name }}</div>

                    <ul v-if="showSourceLanguageList" class="language-list animate__animated animate__fadeInDown "
                        @click.stop>

                        <li v-for="(language, index) in languages" :key="index" @click="selectSourceLanguage(language)">
                            <div :class="'fi fi-' + language.language_code"></div>
                            <div class="language-name">{{ language.language_name }}
                            </div>
                            <div class="petite-ligne"></div>
                        </li>

                    </ul>
                </div>
            </div>

            <div id="word" :style="{ 'font-size':  word_font_size }"></div>
        </div>

        <div class="wrapper-guess" :style="{ 'width': wrapper_guess_width }">
            <div v-if="mode === 'text'" class="wrapper-guess-one">
                <div class="targetLanguage" @click="toggleTargetLanguageList">
                    <div class="espace-drapeau">

                        <div :class="'fi fi-' + targetLanguage.language_code"></div>
                    </div>
                    <div class="espace-nom">
                        {{ targetLanguage.language_name }}
                    </div>
                    <ul style="top : -50px; left :-75px; border : 0px" v-if="showTargetLanguageList"
                        class="language-list  animate__animated animate__zoomIn" @click.stop>
                        <li v-for="(language, index) in languages" :key="index" @click="selectTargetLanguage(language)">
                            <div :class="'fi fi-' + language.language_code"></div>
                            <div class="language-name">{{ language.language_name }}
                            </div>
                            <div class="petite-ligne"></div>
                        </li>

                    </ul>
                </div>

                <div class="wrapper-input">
                    <input id="inputGuess" type="text" v-bind:disabled="!peut_ecrire" v-model="guess"
                        @keydown.enter="checkGuess" placeholder="Guess the word" />
                </div>
                <div class="send-button">&rarr;</div>
            </div>
            <div v-else-if="mode === 'choices'" class="wrapper-guess-one">
                <div class="targetLanguage" @click="toggleTargetLanguageList">
                    <div class="espace-drapeau">

                        <div :class="'fi fi-' + targetLanguage.language_code"></div>
                    </div>
                    <div class="espace-nom">
                        {{ targetLanguage.language_name }}
                    </div>
                    <ul style="top : -50px; left :-95px; border : 0px" v-if="showTargetLanguageList"
                        class="language-list animate__animated animate__zoomIn" @click.stop>
                        <li v-for="(language, index) in languages" :key="index" @click="selectTargetLanguage(language)">
                            <div :class="'fi fi-' + language.language_code"></div>
                            <div class="language-name">{{ language.language_name }}
                            </div>
                            <div class="petite-ligne"></div>
                        </li>

                    </ul>
                </div>
                <div class="bouton-container">
                    <button  :style="{ 'min-width': taille_input }" v-for="(choice, index) in choices" v-bind:disabled="!bouton_cliquable" :key="index"
                        @click="checkChoice(choice, index)" class="bouton-proposition"
                        :class="{ 'animate__animated animate__pulse animate__shakeX animate__flash incorrect': index === incorrectButtonIndex, 'animate__animated animate__bounce correct': index === correctButtonIndex }">
                        {{ choice }}
                    </button>
                </div>
            </div>
            <div class="wrapper-guess-two">
                <button class="ecriture-propositions" @click="toggleMode">
                    {{ mode === 'text' ? 'propositions' : 'écriture' }}
                </button>
            </div>
        </div>
    </div>
</template>

<script>
import axios from 'axios';
import Typed from 'typed.js';


export default {
    props: {
        titre: {
            type: String,
            default: 'titre'
        },
        taille_input: {
            type: String,
            default: '220px'
        },
        word_font_size: {
            type: String,
            default: '96px'
        },
        wrapper_guess_width: {
            type: String,
            default: '740px'
            // 
        },
        specialization: {
            type: String,
            default: 'isVocabulary'
        },
        vitesse_texte: {
            type: Number,
            default: 100
        },
        texte: {
            type: String,
            default: ''
        }
    },
    name: 'DevineurVue',
    data() {
        return {

            peut_ecrire: true,
            bouton_cliquable: true,
            sourceLanguage: {
            },
            targetLanguage: {
            },
            languages: [],
            showSourceLanguageList: false,
            showTargetLanguageList: false,
            wordToGuess: '',
            translations: [],
            guess: '',
            mode: 'choices',
            choices: [],
            incorrectButtonIndex: -1,
            correctButtonIndex: -1,
        };
    },
    async mounted() {

        //trouve les languages grâce à fetch languages puis mets le premier language de la liste en sourceLanguage
        this.fetchLanguages().then(() => {
            // source language est égal à "user_source_language" du user contenu dans le local storage s'il existe, sinon c'est le premier de la liste
            const userSourceLanguage = localStorage.getItem('user');
            if (userSourceLanguage) {
                this.sourceLanguage = this.languages.find(language => language.id === JSON.parse(userSourceLanguage).user_source_language);
                // fais de même pour le target
                this.targetLanguage = this.languages.find(language => language.id === JSON.parse(userSourceLanguage).user_target_language);
            } else {
                this.sourceLanguage = this.languages[0];
                this.targetLanguage = this.languages[0];
            }


            this.fetchWordToGuess(this.languages[1].id, this.languages[0].id);
        });
    },
    methods: {
        changeColor() {
            // Ajouter la classe d'animation pour changer la couleur
            const button = document.querySelector('.btn');
            button.classList.add('animate__heartBeat');

            // Changer la couleur de fond du bouton
            button.style.backgroundColor = '#FF5733';

            // Supprimer la classe d'animation après un délai pour réinitialiser le bouton
            setTimeout(() => {
                button.classList.remove('animate__heartBeat');
                button.style.backgroundColor = '';
            }, 1000);
        },
        toggleSourceLanguageList() {
            this.showSourceLanguageList = !this.showSourceLanguageList;
        },
        toggleTargetLanguageList() {
            this.showTargetLanguageList = !this.showTargetLanguageList;
        },
        hideSourceLanguageList() {
            this.showSourceLanguageList = false;
        },
        hideTargetLanguageList() {
            this.showTargetLanguageList = false;
        },
        selectSourceLanguage(language) {
            this.sourceLanguage = language;
            this.showSourceLanguageList = false;
            if (localStorage.getItem('user')) {
                this.updateUserLanguages();
            }


        },
        // Fais moi une fonction qui effectue une requête pour dire que l'utilisateur a changé de langue, la fonction nécessite router.post('/api/user_languages', authenticateToken, async (req, res) => {const userId = req.user.userId; const { user_source_language, user_target_language } = req.body;
        async updateUserLanguages() {
            console.log('je tente une requête avec les paramètres suivants :' + JSON.parse(localStorage.getItem('user')).id + ' ' + this.sourceLanguage.id + ' ' + this.targetLanguage.id + ' ');
            const token = localStorage.getItem('authToken');
            console.log(" le token est : " + token + "")
            try {
                const response = await axios.post(
                    `http://localhost:3001/api/user_languages/`,
                    {
                        userId: JSON.parse(localStorage.getItem('user')).id,
                        user_source_language: this.sourceLanguage.id,
                        user_target_language: this.targetLanguage.id,
                    },
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
                console.log(response.data);
            } catch (error) {
                console.error(error);
                throw new Error('Error updating user languages');
            }
        },
        selectTargetLanguage(language) {
            this.targetLanguage = language;
            this.showTargetLanguageList = false;
            if (localStorage.getItem('user')) {
                this.updateUserLanguages();
            }
        },
        getFlagImageUrl(languageCode) {
            return `https://flagcdn.com/16x12/${languageCode.toLowerCase()}.png`;
        },
        async fetchLanguages() {
            try {
                const response = await axios.get('http://localhost:3001/api/languages');
                this.languages = response.data;
            } catch (error) {
                console.error('Error fetching languages:', error);
            }
        },
        async generateChoices() {
            const otherWordsCount = 3;

            const otherWords = await this.fetchRandomWords(this.targetLanguage.id, otherWordsCount);
            // Extraire les mots de chaque objet de traduction
            const extractedWords = otherWords.map(obj => obj.translation);
            // Ajoutez la bonne réponse et mélangez les choix
            this.choices = [this.translations[this.targetLanguage.id], ...extractedWords].sort(() => Math.random() - 0.5);
        },
        async checkGuess() {
            if (this.guess.length < 1 || !this.peut_ecrire) {
                console.log("Vous navez rien marqué!");
                return;
            }


            try {
                const response = await axios.post('http://localhost:3001/api/check-guess', {
                    wordId: this.wordToGuess.id,
                    targetLanguageId: this.targetLanguage.id,
                    guess: this.guess,
                    userId: localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')).id : null,
                    secondeLangue: this.sourceLanguage.id,
                });
                const { correct } = response.data;
                const input_guess = document.getElementById("inputGuess");
                if (correct) {
                    this.peut_ecrire = false;
                    input_guess.classList.add('animate__animated', 'animate__bounce', 'correct');
                    setTimeout(() => {
                        this.fetchWordToGuess(this.sourceLanguage.id, this.targetLanguage.id);
                        input_guess.classList.remove('animate__animated', 'animate__bounce', 'correct');
                    }, 1000);
                    this.peut_ecrire = true;
                } else {
                    input_guess.classList.add('animate__animated', 'animate__pulse', 'animate__shakeX', 'animate__flash', 'incorrect');
                    setTimeout(() => {
                        input_guess.classList.remove('animate__animated', 'animate__pulse', 'animate__shakeX', 'animate__flash', 'incorrect');
                    }, 1000);
                }
            } catch (error) {
                console.error('Error checking guess:', error);
            }
        },


        checkChoice(choice, index) {

            this.showSourceLanguageList = false;
            this.showTargetLanguageList = false;
            const bonne_reponse = this.translations[this.targetLanguage.id];
            if (choice === bonne_reponse) {
                this.bouton_cliquable = false;
                axios.post('http://localhost:3001/api/check-guess', {
                    wordId: this.wordToGuess.id,
                    targetLanguageId: this.targetLanguage.id,
                    guess: this.translations[this.targetLanguage.id],
                    userId: localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')).id : null,
                    secondeLangue: this.sourceLanguage.id,
                });
                this.incorrectButtonIndex = -1;
                this.correctButtonIndex = index;
                setTimeout(() => {
                    this.correctButtonIndex = -1;
                    this.fetchWordToGuess(this.sourceLanguage.id, this.targetLanguage.id);
                    this.bouton_cliquable = true;
                }, 1000);

            } else {
                this.incorrectButtonIndex = index;
                this.correctButtonIndex = -1;
                setTimeout(() => {
                    this.incorrectButtonIndex = -1;
                }, 1000);
            }

        },

        async fetchRandomWords(languageId, count) {
            try {
                const response = await axios.get(`http://localhost:3001/api/random-words?languageId=${languageId}&count=${count}&typeMot=${this.specialization}`);
                return response.data;
            } catch (error) {
                console.error('Error fetching random words:', error);
                return [];
            }
        },
        async fetchWordToGuess(langue1, langue2) {
            console.log("je fais une requête avec les paramètres suivants : " + langue1 + " " + langue2 + " " + this.specialization + "")
            axios
                .get(`http://localhost:3001/api/word-to-guess`, {
                    params: {
                        sourceLanguageId: langue1,
                        targetLanguageId: langue2,
                        typeMot: this.specialization,
                    },
                })
                .then((response) => {
                    console.log(response.data)
                    const { word, translations } = response.data;
                    this.wordToGuess = word;
                    this.translations = translations;
                    this.guess = '';
                    document.getElementById('word').innerHTML = '';

                    // Supprimer l'instance précédente de Typed si elle existe
                    if (this.typedInstance) {
                        this.typedInstance.destroy();
                    }

                    // Créer une nouvelle instance Typed avec le nouveau mot
                    setTimeout(() => {
                        console.log("je crée une nouvelle instance")
                        this.$nextTick(() => {
                            this.typedInstance = new Typed('#word', {
                                strings: [this.translations[this.sourceLanguage.id]],
                                typeSpeed: this.vitesse_texte,
                                showCursor: false,
                            });
                        });
                    }, 100);
                })
                .catch((error) => {
                    console.error('Error fetching word to guess:', error);
                    this.wordToGuess = 'Error fetching word';
                    this.translations = [];
                });
        },

        toggleMode() {
            this.mode = this.mode === 'text' ? 'choices' : 'text';
            this.showSourceLanguageList = false;
            this.showTargetLanguageList = false;
        },
    },
    watch: {
        sourceLanguage() {
            this.fetchWordToGuess(this.sourceLanguage.id, this.targetLanguage.id);

            //this.fetchUserProgress(); // Ajoutez cette ligne
        },
        targetLanguage() {
            this.fetchWordToGuess(this.sourceLanguage.id, this.targetLanguage.id);
        },
        mode() {
            if (this.mode === 'choices') {
                this.generateChoices();
            }
        },
        translations: {
            handler() {
                if (this.mode === 'choices') {
                    this.generateChoices();
                }
            },
            deep: true,
        },
    },

};
</script>


<style scoped>
#word,
.bouton-container button {
    text-transform: lowercase;
}

.animate__fadeInDown {
    --animate-duration: 400ms;
    animation-name: fadeInDown;
    transform-origin: top;
    animation-timing-function: cubic-bezier(.22, 1.18, .78, .99);
    animation-fill-mode: both;
}

@keyframes fadeInDown {
    0% {
        opacity: 0;
        transform: translateY(-10%);
    }

    100% {
        opacity: 1;
        transform: translateY(0%);
    }
}

.animate__zoomIn {
    --animate-duration: 400ms;
    animation-name: zoomIn;
    animation-timing-function: cubic-bezier(.22, 1.18, .78, .99);
    animation-fill-mode: both;
}

@keyframes zoomIn {
    0% {
        opacity: 0;
        transform: scale(0.2);
    }

    100% {
        opacity: 1;
        transform: scale(1);
    }
}



@keyframes appear {
    0% {
        opacity: 0;
        transform: translateY(10px);
    }

    100% {
        opacity: 1;
        transform: translateY(0);
    }
}

.correct {
    background-color: rgba(20, 255, 59, 0.676) !important;
    transition: background-color 0.3s ease;
}

.incorrect {
    background-color: rgba(255, 36, 20, 0.769) !important;
}

.fade-enter-active,
.fade-leave-active {
    transition: opacity .5s;
}

.fade-enter,
.fade-leave-to {
    opacity: 0;
}

.slide-fade-enter-active,
.slide-fade-leave-active {
    transition: all 0.3s ease;
}

.slide-fade-enter,
.slide-fade-leave-to {
    transform: translateY(-10px);
    opacity: 0;
}

.bouton-proposition:hover,
.ecriture-propositions:hover {
    background-color: #f0f0f0;
    transform: scale(1.05);
    transition: all 0.1s ease;
}

.bouton-proposition:active,
.ecriture-propositions:active {
    background-color: #e0e0e0;
    transform: scale(1);
}

.petite-ligne {
    height: 1px;
    width: 10%;
    margin-left: 52%;
    background-color: #d9d9d9;
}

.mini-ligne {
    height: 1px;
    width: 10%;
    margin-left: 52%;
    background-color: #d9d9d9;
}

.espace-drapeau .fi {
    height: 50%;
    width: 50%;
    border-radius: 12px;
}


.wrapper-input {
    display: flex;
    justify-content: center;
    align-items: center;
}

.bouton-container {
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    padding-right: 8%;
}

.bouton-proposition {
    overflow: auto;
    margin: 7px 15px;
    background-color: #FFFCF9;
    border: 1px #E0E0E0 solid;
    box-shadow: 0px 7px 4px rgba(0, 0, 0, 0.06);
    min-width: 220px;
    height: 60px;
    border-radius: 32px;
    font-family: "DinRoundPro-Bold";
    color: var(--dar-gris);
    font-size: 32px;
    transition: background-color 0.3s ease;

}

.targetLanguage {
    position: relative;
}

.wrapper-guess ul {
    position: absolute;
    width: 250px;
    margin: 0;
    padding: 0;
    background-color: white;
    border: 1px solid black;
    list-style: none;
}



.wrapper-guess li .fi {
    width: 20px;
    margin-right: 5px;
}

.ecriture-propositions {
    width: 220px;
    height: 55px;
    border-radius: 32px;
    background-color: #F9F9F9;
    box-shadow: 0px 7px 4px rgba(0, 0, 0, 0.06);
    font-size: 28px;
    font-family: "DinRoundPro-Bold";
    text-transform: uppercase;
    color: #9E9E9E;
    border: 0px;
}

.espace-drapeau {
    width: 100%;
    height: 70%;
    display: flex;
    justify-content: center;
    align-items: flex-end;
}

.espace-nom {
    display: flex;
    font-family: "DINPro-Light";
    text-transform: capitalize;
    justify-content: center;
    align-items: center;
    font-size: 18px;
    color: #484848;
    font-weight: 600;
}

.espace-drapeau .fi {
    min-width: 60px;
}

.wrapper-guess-one {
    display: flex;
    width: 100%;
    height: 65%;
    padding: 2.5% 0;
}

.targetLanguage,
.send-button {
    width: 16%;
    height: 100%;
}

.send-button {
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 40px;
}

.wrapper-guess-two {
    display: flex;
    width: 100%;
    justify-content: center;
    align-items: center;
    height: 30%;
}

.espace-langage {
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: rgba(255, 0, 0, 0);
    width: 100%;
    height: 20%;
}

.wrapper-guess {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 270px;
    width: 680px;
}

input[type="text"] {
    width: 470px;
    height: 80px;
    margin: 8px 0;
    padding: 12px 16px;
    border-radius: 41px;
    border: 1px solid #ADADAD;
    box-shadow: 0 4px 4px rgba(0, 0, 0, 0.25);
    background-color: #F4F4F4;
    font-size: 32px;
    font-family: "DINRoundPro-Bold";
    color: var(--dark-gris);
    outline: none;

}

input::placeholder,
input[type="text"] {
    text-indent: 10px;
}

input::placeholder {
    color: #ADADAD;
}

#word {
    font-family: "DINPro-MediumItalic";
    font-size: 96px;
    color: #262626;

    display: flex;
    justify-content: center;
    align-items: center;
    text-shadow: 0px 4px 4px rgba(0, 0, 0, 0.10);
    height: 55%;
}

.wrapper {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 80vh;


}

.wrapper-word {

    height: 400px;
    width: 680px;
    border-radius: 75px;
    background-color: var(--light-beige);
    box-shadow: 0px 4px 4px 0px rgba(0, 0, 0, 0.25);
}

.language-selector {
    padding-right: 37px;
    justify-self: flex-start;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    width: 250px;
    height: 60px;
    border-radius: 27px;
    background-color: #ffffff;
    cursor: pointer;
}

.language-flag {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 32px;

    height: 100%;
    margin-right: 10px;
}

.language-flag .fi {
    width: 100%;
    height: 60%;
    border-radius: 12px;
}

.language-name {
    font-size: 18px;
    font-family: "DINPro-Light";
    text-transform: capitalize;
    font-weight: 600;
    color: #484848;

}

.liste_language {
    top: 0;
}

.language-list {
    height: 250px;
    overflow-y: auto;
    z-index: 300;
    position: absolute;
    width: 100%;
    padding: 0;
    top: 0;
    margin: 0;
    list-style-type: none;
    background-color: #ffffff;
    border-radius: 5px;
    border-radius: 30px;
}

.language-list li {
    list-style: none;
    text-align: center;
    padding: 5px;
    cursor: pointer;
    margin-bottom: 2px;
    padding-right: 32px;
}

.language-list li div {
    transition: all 0.1s ease-in-out;
}


.language-list li:hover div {

    transform: scale(1.01);
}

.language-list li .fi {
    float: left;
    width: 32px;
    height: 32px;
    transform: translateX(120%);
    border-radius: 9px;
}

.word-input-box {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 300px;
    height: 50px;
    border-radius: 25px;
    background-color: #eeeeee;
    margin-bottom: 20px;
}

.word-input-box .language-flag {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    margin-right: 10px;
}

.word-input-box .language-name {
    font-size: 18px;
    margin-right: 10px;
}

.word-input-box input {
    border: none;
    outline: none;
    font-size: 18px;
    width: 100%;
    height: 100%;
    padding: 0 10px;
    background-color: transparent;
}

.word-input-box input::placeholder {
    color: #c3c3c3;
}

.word-input-box input:focus {
    border: none;
    outline: none;
}</style>