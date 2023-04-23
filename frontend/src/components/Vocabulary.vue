<template>
    <div class="guess-word">
        <div class="language-selectors">
            <label for="source-language">Mot en</label>
            <select id="source-language" v-model="selectedSourceLanguage">
                <option v-for="language in languages" :key="language.id" :value="language">
                    {{ language.language_name }}
                </option>
            </select>
            <span v-if="selectedSourceLanguage" class="flag-icon" :class="`flag-icon-${selectedSourceLanguage.language_code}`"></span>
            <br />
            <label for="target-language">Traduire en</label>
            <select id="target-language" v-model="selectedTargetLanguage">
                <option v-for="language in languages" :key="language.id" :value="language">
                    {{ language.language_name }}
                </option>
            </select>
            <span v-if="selectedTargetLanguage" class="flag-icon" :class="`flag-icon-${selectedTargetLanguage.language_code}`"></span>
        </div>
        <!-- Reste du code HTML ... -->
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
                console.log(response);
                this.languages = response.data;
                this.selectedSourceLanguage = this.languages.find(
                    (language) => language.language_code === 'fr'
                );
                this.selectedTargetLanguage = this.languages.find(
                    (language) => language.language_code === 'gb'
                );
            } catch (error) {
                console.error('Error fetching languages:', error);
            }
        },
        selectLanguage(language) {
            this.selectedLanguage = language;
            this.fetchWordToGuess();
        },
        async fetchWordToGuess() {
            // Utilisez this.selectedLanguage pour filtrer les mots par langue
            axios
                .get(`http://localhost:3001/api/word-to-guess`)
                .then((response) => {
                    console.log('la reponse est ');
                    console.log(response.data);
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
                    languageId: this.translations[0].languageId,
                    guess: this.guess,
                })
                .then((response) => {
                    const { correct } = response.data;
                    console.log(response);
                    if (correct) {
                        this.message = 'Correct!';
                        this.score++;
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
    mounted() {
        this.fetchLanguages();
        this.fetchWordToGuess();
        
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
