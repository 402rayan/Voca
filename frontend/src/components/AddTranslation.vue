<template>
    <div class="container">
        <div class="translation-section">
            <h1>Ajouter une traduction (mot)</h1>
            <div class="form-group">
                <label for="word">Mot :</label>
                <select id="word" v-model="selectedWord">
                    <option v-for="mot in words" :key="mot.id" :value="mot.id">
                        {{ mot.word }}
                    </option>
                </select>
            </div>
            <div class="form-group">
                <label for="translation">Traduction :</label>
                <input type="text" id="translation" v-model="translation" />
            </div>
            <div class="form-group">
                <label for="targetLanguage">Langue :</label>
                <select id="targetLanguage" v-model="selectedTargetLanguage">
                    <option v-for="language in languages" :key="language.id" :value="language.id">
                        {{ language.language_name }}
                    </option>
                </select>
            </div>
            <button @click="addTranslation" class="submit-btn">Ajouter la traduction</button>
            <ul class="translations-list">
                <li v-for="translation in translations" :key="translation.id">
                    {{ translation.translation }} <span class="flag-icon"
                        :class="`flag-icon-${getLanguageCode(translation.language_id)}`"></span>
                </li>
            </ul>
        </div>
        <div class="translation-section">
            <h1>Ajouter une traduction (caractère)</h1>
            <div class="form-group">
                <label for="character">Caractère :</label>
                <select id="character" v-model="selectedCharacter">
                    <option v-for="character in characters" :key="character.id" :value="character.id">
                        {{ character.character }}
                    </option>
                </select>
            </div>
            <div class="form-group">
                <label for="translation_cha">Traduction :</label>
                <input type="text" id="translation_cha" v-model="translation_cha" />
            </div>
            <div class="form-group">
                <label for="targetAlphabet">Langue :</label>
                <select id="targetAlphabet" v-model="selectedTargetAlphabet">
                    <option v-for="alphabet in alphabets" :key="alphabet.id" :value="alphabet.id">
                        {{ alphabet.alphabet_name }}
                    </option>
                </select>
            </div>
            <button @click="addTranslationCha" class="submit-btn">Ajouter la traduction</button>
            <ul class="translations-list">
                <li v-for="translation in translations_cha" :key="translation.id">
                    {{ translation.translation_cha }} <span class="flag-icon"
                        :class="`flag-icon-${getAlphabetCode(translation.alphabet_id)}`"></span>
                </li>
            </ul>
        </div>
    </div>
</template>
<script>
import axios from 'axios';
export default {
    data() {
        return {
            words: [],
            characters: [],
            languages: [],
            alphabets: [],
            selectedWord: 1,
            selectedCharacter: 1,
            translation: '',
            translation_cha: '',
            selectedTargetLanguage: 2,
            selectedTargetAlphabet: 1,
            translations: [],
            translations_cha: [],
        };
    },
    async created() {
        await this.getWords();
        await this.getLanguages();
        await this.getCharacters();
        await this.getAlphabets();
    },
    methods: {
        async getWords() {
            try {
                const response = await axios.get('http://localhost:3001/api/words');
                this.words = response.data;
                // je veux que le selected word soit le dernier mot 
                this.selectedWord = this.words[this.words.length - 1].id;
            } catch (error) {
                console.error('Error fetching words:', error);
            }
        },
        async getCharacters() {
            try {
                const response = await axios.get('http://localhost:3001/api/characters');
                this.characters = response.data;
            } catch (error) {
                console.error('Error fetching characters:', error);
            }
        },
        async getLanguages() {
            try {
                const response = await axios.get('http://localhost:3001/api/languages');
                this.languages = response.data;
            } catch (error) {
                console.error('Error fetching languages:', error);
            }
        },
        async getAlphabets() {
            try {
                const response = await axios.get('http://localhost:3001/api/alphabets');
                this.alphabets = response.data;
            } catch (error) {
                console.error('Error fetching alphabets:', error);
            }
        },
        async fetchTranslations() {
            try {
                const response = await axios.get(`http://localhost:3001/api/translations?wordId=${this.selectedWord}`);
                this.translations = response.data;
            } catch (error) {
                console.error('Error fetching translations:', error);
            }
        },
        async fetchTranslationsCha() {
            try {
                const response = await axios.get(`http://localhost:3001/api/translations_cha?characterId=${this.selectedCharacter}`);
                this.translations_cha = response.data;
                console.log(response.data);
            } catch (error) {
                console.error('Error fetching translations:', error);
            }
        },
        getLanguageCode(languageId) {
            const language = this.languages.find(lang => lang.id == languageId);
            return language ? language.language_code.toLowerCase() : '';
        },
        getAlphabetCode(alphabetId) {
            const alphabet = this.alphabets.find(alph => alph.id == alphabetId);
            return alphabet ? alphabet.alphabet_code.toLowerCase() : '';
        },
        async addTranslation() {
            try {
                const payload = {
                    wordId: this.selectedWord,
                    targetLanguageId: this.selectedTargetLanguage,
                    translation: this.translation
                };

                const response = await axios.post('http://localhost:3001/api/add-translation', payload);
                if (response.data.success) {
                    this.translation = '';
                    try {
                        // passe à la langue suivante dans la liste;
                        this.selectedTargetLanguage = this.languages.find(lang => lang.id == this.selectedTargetLanguage).id + 1;
                    } catch (error) {
                        console.error('Error fetching translations:', error);
                    }
                    await this.fetchTranslations(); // Rafraîchir la liste des traductions après l'ajout
                } else {
                    alert("Une erreur s'est produite lors de l'ajout de la traduction.");
                }
            } catch (error) {
                console.error('Error adding translation:', error);
            }
        },
        async addTranslationCha() {
            try {
                const payload = {
                    characterId: this.selectedCharacter,
                    targetAlphabetId: this.selectedTargetAlphabet,
                    translation_cha: this.translation_cha
                };

                const response = await axios.post('http://localhost:3001/api/add-translation_cha', payload);
                if (response.data.success) {
                    this.translation_cha = '';
                    await this.fetchTranslationsCha(); // Rafraîchir la liste des traductions après l'ajout
                } else {
                    alert("Une erreur s'est produite lors de l'ajout de la traduction.");
                }
            } catch (error) {
                console.error('Error adding translation:', error);
            }
        }
    },
    watch: {
        selectedWord: {
            handler() {
                this.fetchTranslations();
            },
            immediate: true,
        },
        selectedCharacter: {
            handler() {
                this.fetchTranslationsCha();
            },
            immediate: true,
        }
    }
};
</script>

<style scoped>
.container {
    display: flex;
    justify-content: space-around;
    padding: 20px;
}

.translation-section {
    width: 45%;
    background-color: #ffffff;
    padding: 20px;
    border-radius: 5px;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.form-group {
    margin-bottom: 20px;
}

.submit-btn {
    background-color: #4CAF50;
    color: #ffffff;
    border: none;
    padding: 10px 20px;
    text-align: center;
    text-decoration: none;
    display: inline-block;
    font-size: 16px;
    margin: 10px 2px;
    cursor: pointer;
    border-radius: 5px;
    transition-duration: 0.4s;
}

.submit-btn:hover {
    background-color: #45a049;
}

.translations-list {
    list-style-type: none;
    padding: 0;
}

.translations-list li {
    padding: 10px;
    background-color: #f1f1f1;
    margin-bottom: 5px;
    border-radius: 5px;
}

.flag-icon {
    margin-left: 5px;
}
</style>
