<template>
    <div class="fil-arianne">
        <RouterLink to="/">home</RouterLink> > vocabulary
    </div>
    <div class="wrapper">
        <div class="wrapper-word">
            <div class="espace-langage">
                <div class="language-selector" @click="toggleSourceLanguageList">

                    <div class="language-flag">
                        <div :class="'fi fi-' + sourceLanguage.language_code"></div>
                    </div>

                    <div class="language-name">{{ sourceLanguage.language_name }}</div>

                    <ul style="top : 60px; left: 0" v-if="showSourceLanguageList" class="language-list" @click.stop>
                        <li v-for="(language, index) in languages" :key="index" @click="selectSourceLanguage(language)">
                            <div :class="'fi fi-' + language.language_code"></div>
                            <div class="language-name">{{ language.language_name }}
                            </div>
                            <div class="petite-ligne"></div>
                        </li>

                    </ul>
                </div>
            </div>

            <div id="word">{{ translations[this.sourceLanguage.id] }}</div>
        </div>
        <div class="wrapper-guess">
            <div v-if="mode === 'text'" class="wrapper-guess-one">
                <div class="targetLanguage" @click="toggleTargetLanguageList">
                    <div class="espace-drapeau">

                        <div :class="'fi fi-' + targetLanguage.language_code"></div>
                    </div>
                    <div class="espace-nom">
                        {{ targetLanguage.language_name }}
                    </div>
                    <ul style="top : -50px; left :-75px; border : 0px" v-if="showTargetLanguageList" class="language-list"
                        @click.stop>
                        <li v-for="(language, index) in languages" :key="index" @click="selectTargetLanguage(language)">
                            <div :class="'fi fi-' + language.language_code"></div>
                            <div class="language-name">{{ language.language_name }}
                            </div>
                            <div class="petite-ligne"></div>
                        </li>

                    </ul>
                </div>

                <div class="wrapper-input">
                    <input type="text" v-model="guess" @keydown.enter="checkGuess" placeholder="Guess the word" />
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
                    <ul style="top : -50px; left :-95px; border : 0px" v-if="showTargetLanguageList" class="language-list"
                        @click.stop>
                        <li v-for="(language, index) in languages" :key="index" @click="selectTargetLanguage(language)">
                            <div :class="'fi fi-' + language.language_code"></div>
                            <div class="language-name">{{ language.language_name }}
                            </div>
                            <div class="petite-ligne"></div>
                        </li>

                    </ul>
                </div>
                <div class="bouton-container">
                    <button v-for="(choice, index) in choices" :key="index" @click="checkChoice(choice)"
                        class="bouton-proposition">
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
export default {
    name: 'VocabularyVue',
    data() {
        return {
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
            mode: 'text',
            choices: [],
        };
    },
    async mounted() {

        //trouve les languages grâce à fetch languages puis mets le premier language de la liste en sourceLanguage
        this.fetchLanguages().then(() => {
            this.sourceLanguage = this.languages[1];
            this.targetLanguage = this.languages[0];
            this.fetchWordToGuess(this.languages[1].id, this.languages[0].id);
        });
    },
    methods: {
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
            if (this.user) {
                this.updateUserLanguage(this.user.id, language.id);
            }

        },
        // Fais moi une fonction qui effectue une requête pour dire que l'utilisateur a changé de langue, la route est /api/user/:id/language
        async updateUserLanguages(userId, languageId) {
            try {
                const response = await axios.put(`/api/users/${userId}/languages`, { languageId });
                return response.data;
            } catch (error) {
                console.error(error);
                throw new Error('Error updating user languages');
            }
        },
        selectTargetLanguage(language) {
            this.targetLanguage = language;
            this.showTargetLanguageList = false;
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
            if (this.guess.length < 1) {
                console.log("Vous navez rien marqué!");
                return;
            }
            axios
                .post('http://localhost:3001/api/check-guess', {
                    wordId: this.wordToGuess.id,
                    targetLanguageId: this.targetLanguage.id,
                    guess: this.guess,
                })
                .then((response) => {
                    const { correct } = response.data;
                    if (correct) {
                        console.log('Correct!');
                    } else {
                        console.log('Incorrect!');
                    }
                    this.fetchWordToGuess(this.sourceLanguage.id, this.targetLanguage.id);
                })
                .catch((error) => {
                    console.error('Error checking guess:', error);
                });
        },

        checkChoice(choice) {
            this.showSourceLanguageList = false; this.showTargetLanguageList = false;
            const bonne_reponse = this.translations[this.targetLanguage.id];
            if (choice === bonne_reponse) {
                console.log('Correct!')
            } else {
                console.log('Incorrect!')
            }
            this.fetchWordToGuess(this.sourceLanguage.id, this.targetLanguage.id);
        },

        async fetchRandomWords(languageId, count) {
            try {
                const response = await axios.get(`http://localhost:3001/api/random-words?languageId=${languageId}&count=${count}`);
                return response.data;
            } catch (error) {
                console.error('Error fetching random words:', error);
                return [];
            }
        },
        async fetchWordToGuess(langue1, langue2) {
            axios
                .get(`http://localhost:3001/api/word-to-guess`, {
                    params: {
                        sourceLanguageId: langue1,
                        targetLanguageId: langue2,
                    },
                })
                .then((response) => {
                    const { word, translations } = response.data;
                    this.wordToGuess = word;
                    this.translations = translations;
                    this.guess = '';
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
    margin: 7px 15px;
    background-color: #FFFCF9;
    border: 1px #E0E0E0 solid;
    box-shadow: 0px 7px 4px rgba(0, 0, 0, 0.06);
    width: 220px;
    height: 60px;
    border-radius: 32px;
    font-family: "DinRoundPro-Bold";
    color: var(--dar-gris);
    font-size: 32px;

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
    font-size: 22px;
    font-family: "DINPro-Light";
    text-transform: capitalize;
    font-weight: 600;
    color: #484848;

}

.liste_language {
    top: 0;
}

.language-list {
    position: absolute;
    width: 100%;
    padding: 0;
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


.language-list li:hover {
    background-color: #f2f2f2;
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
}
</style>