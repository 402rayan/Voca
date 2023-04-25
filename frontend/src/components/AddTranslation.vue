<template>
    <div>
        <h1>Ajouter une traduction</h1>
        <label for="word">Mot :</label>
        <select id="word" v-model="selectedWord">
            <option v-for="mot in words" :key="mot.id" :value="mot.id">
                {{ mot.word }}
            </option>
        </select>
        <label for="translation">Traduction :</label>
        <input type="text" id="translation" v-model="translation" />
        <label for="targetLanguage">Langue :</label>
        <select id="targetLanguage" v-model="selectedTargetLanguage">
            <option v-for="language in languages" :key="language.id" :value="language.id">
                {{ language.language_name }}
            </option>
        </select>
        <button @click="addTranslation">Ajouter la traduction</button>
        <ul>
            <li v-for="translation in translations" :key="translation.id">
                {{ translation.translation }} <span class="flag-icon" :class="`flag-icon-${getLanguageCode(translation.language_id)}`"></span>
            </li>
            {{  }}
        </ul>
    </div>
</template>

<script>
import axios from 'axios';
export default {
    data() {
        return {
            words: [],
            languages: [],
            selectedWord: 1,
            translation: '',
            selectedTargetLanguage: 1,
            translations: [],
        };
    },
    async created() {
        await this.getWords();
        await this.getLanguages();
    },
    methods: {
        async getWords() {
            try {
                const response = await axios.get('http://localhost:3001/api/words');
                this.words = response.data;
            } catch (error) {
                console.error('Error fetching words:', error);
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
        async fetchTranslations() {
            try {
                const response = await axios.get(`http://localhost:3001/api/translations?wordId=${this.selectedWord}`);
                this.translations = response.data;
            } catch (error) {
                console.error('Error fetching translations:', error);
            }
        },
        getLanguageCode(languageId) {
            const language = this.languages.find(lang => lang.id == languageId);
            return language ? language.language_code.toLowerCase() : '';
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
                    alert("La traduction a été ajoutée avec succès.");
                    this.translation = '';
                    await this.fetchTranslations(); // Rafraîchir la liste des traductions après l'ajout
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
    }
};
</script>
