<template>
    <div class="guess-word">
        <div class="language-selectors">
            <label for="source-language">Mot en</label>
            <select id="source-language" v-model="selectedSourceLanguage">
                <option v-for="language in languages" :key="language.id" :value="language.id">
                    {{ language.language_name }}
                </option>
            </select>
            <span v-if="selectedSourceLanguage" class="flag-icon"
                :class="`flag-icon-${getLanguageCode(selectedSourceLanguage)}`"></span>
            <br />
            <label for="target-language">Traduire en</label>
            <select id="target-language" v-model="selectedTargetLanguage">
                <option v-for="language in languages" :key="language.id" :value="language.id">
                    {{ language.language_name }}
                </option>
            </select>
            <span v-if="selectedTargetLanguage" class="flag-icon"
                :class="`flag-icon-${getLanguageCode(selectedTargetLanguage)}`"></span>
        </div>
        <!-- Reste du code HTML ... -->
        <div>
            <h2>{{ translations[this.selectedSourceLanguage] }}</h2>
            <!-- Ajoutez 'v-if="mode === 'text'"' pour les éléments suivants -->
            <input type="text" v-if="mode === 'text'" v-model="guess" @keydown.enter="checkGuess" />
            <button v-if="mode === 'text'" @click="checkGuess">Valider</button>
            <p v-if="message">{{ message }}</p>
            <div style="background-color : #dfdfdf;">
                <!-- Ajoutez ces lignes pour le bouton de basculement -->
                <button @click="toggleMode">
                    {{ mode === 'text' ? 'Passer au mode propositions' : 'Passer au mode texte' }}
                </button>
                <!-- ... -->
                <div v-if="mode === 'choices'">
                    <button v-for="(choice, index) in choices" :key="index" @click="checkChoice(choice)">
                        {{ choice }}
                    </button>
                </div>
            </div>
            <!-- Vocabulary.vue -->
            

        </div>
    <div class="progress-container">
                    <p>Progression en {{ getLanguageName(selectedSourceLanguage) }} :</p>
                    <div class="progress-bar">
                        <div class="progress" :style="{ width: `${progress}%` }"></div>
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
            wordToGuess: '',
            guess: '',
            message: '',
            translations: '',
            languages: [],
            selectedSourceLanguage: null,
            selectedTargetLanguage: null,
            mode: 'text', // Ajoutez cette ligne
            choices: '',
            progress: 70,
        };
    },
    methods: {
        async fetchLanguages() {
            try {
                const response = await axios.get('http://localhost:3001/api/languages');
                this.languages = response.data;
                this.selectedSourceLanguage = this.languages.find((language) => language.language_code === 'gb').id;
                this.selectedTargetLanguage = this.languages.find((language) => language.language_code === 'fr').id;
            } catch (error) {
                console.error('Error fetching languages:', error);
            }
        },
        getLanguageCode(languageId) {
            const language = this.languages.find((language) => language.id === languageId);
            return language ? language.language_code : '';
        },
        async fetchWordToGuess() {
            axios
                .get(`http://localhost:3001/api/word-to-guess`, {
                    params: {
                        sourceLanguageId: this.selectedSourceLanguage,
                        targetLanguageId: this.selectedTargetLanguage,
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
        async checkGuess() {
            if (this.guess.length < 1) {
                this.message = "Vous n'avez rien marqué!";
                return;
            }
            axios
                .post('http://localhost:3001/api/check-guess', {
                    wordId: this.wordToGuess.id,
                    targetLanguageId: this.selectedTargetLanguage,
                    guess: this.guess,
                })
                .then((response) => {
                    const { correct } = response.data;
                    if (correct) {
                        this.message = 'Correct!';
                    } else {
                        this.message = 'Incorrect!';
                    }
                    this.fetchWordToGuess();
                })
                .catch((error) => {
                    console.error('Error checking guess:', error);
                    this.message = 'Error checking guess';
                });
        },
        toggleMode() {
            this.mode = this.mode === 'text' ? 'choices' : 'text';
        },
        async generateChoices() {
            const otherWordsCount = 3;

            const otherWords = await this.fetchRandomWords(this.selectedTargetLanguage, otherWordsCount);

            // Extraire les mots de chaque objet de traduction
            const extractedWords = otherWords.map(obj => obj.translation);

            // Ajoutez la bonne réponse et mélangez les choix
            this.choices = [this.translations[this.selectedTargetLanguage], ...extractedWords].sort(() => Math.random() - 0.5);
        },

        checkChoice(choice) {
            const bonne_reponse = this.translations[this.selectedTargetLanguage];
            if (choice === bonne_reponse) {
                this.message = 'Correct!';
            } else {
                this.message = 'Incorrect!';
            }
            this.fetchWordToGuess();
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
        getLanguageName(languageId) {
            const language = this.languages.find((language) => language.id === languageId);
            return language ? language.language_name : '';
        },
        async fetchUserProgress() {
            console.log(this.$store);
            if (!this.$store.state.user) {
                console.warn('User not logged in');
                return;
            }
            console.log("je recheche la progress");
            try {
                const response = await axios.get('http://localhost:3001/api/user/progress', {
                    params: {
                        sourceLanguageId: this.selectedSourceLanguage,
                        userId: this.$store.state.user.id, 
                    },
                });

                this.progress = response.data.progress;
            } catch (error) {
                console.error('Error fetching user progress:', error);
                this.progress = 0;
            }
        },

    },
    watch: {
        selectedSourceLanguage() {
            this.fetchWordToGuess();
            this.fetchUserProgress(); // Ajoutez cette ligne
        },
        selectedTargetLanguage() {
            this.fetchWordToGuess();
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
    mounted() {
        this.fetchLanguages();
        this.fetchUserProgress(); // Ajoutez cette ligne
    },

};
</script>

<style scoped>
.guess-word {
    text-align: center;
}

input {
    margin: 1rem 0;
}

.flags-container {
    display: flex;
    justify-content: center;
    margin-bottom: 1rem;
}

.flag {
    margin: 0 0.5rem;
    cursor: pointer;
}
/* Vocabulary.vue */
.progress-container {
  margin: 1rem 0;
}

.progress-bar {
  width: 100%;
  height: 20px;
  background-color: #f2f2f2;
  border-radius: 8px;
}

.progress {
  height: 100%;
  background-color: #4caf50;
  border-radius: 8px;
}

</style>