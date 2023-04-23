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
            <input type="text" v-model="guess" @keydown.enter="checkGuess" />
            <button @click="checkGuess">Valider</button>
            <p v-if="message">{{ message }}</p>
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
                    console.log(response);
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

    },
    watch: {
        selectedSourceLanguage() {
            this.fetchWordToGuess();
        },
        selectedTargetLanguage() {
            this.fetchWordToGuess();
        },
    },
    mounted() {
        this.fetchLanguages();
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
</style>