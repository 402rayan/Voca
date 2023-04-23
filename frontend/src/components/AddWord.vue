<template>
    <div class="add-word">
        <h2>Ajouter un mot et ses traductions</h2>
        <form @submit.prevent="addWordAndTranslations">
            <label for="word">Mot :</label>
            <input type="text" id="word" v-model="word" required />

            <label for="sourceLanguage">Langue source :</label>
            <select id="sourceLanguage" v-model="selectedSourceLanguage" required>
                <option v-for="language in languages" :key="language.id" :value="language.id">
                    {{ language.language_name }}
                </option>
            </select>

            <label for="targetLanguage">Langue cible :</label>
            <select id="targetLanguage" v-model="selectedTargetLanguage" required>
                <option v-for="language in languages" :key="language.id" :value="language.id">
                    {{ language.language_name }}
                </option>
            </select>

            <label for="translation">Traduction :</label>
            <input type="text" id="translation" v-model="translation" required />

            <button type="submit">Ajouter</button>
        </form>
    </div>
</template>


<script>
import axios from 'axios';

export default {
    data() {
        return {
            languages: [],
            selectedSourceLanguage: null,
            selectedTargetLanguage: null,
            word: '',
            translation: '',
        };
    },
    methods: {
        async fetchLanguages() {
            try {
                const response = await axios.get('http://localhost:3001/api/languages');
                this.languages = response.data;
            } catch (error) {
                console.error('Error fetching languages:', error);
            }
        },

        async addWordAndTranslations() {
            try {
                if (this.selectedSourceLanguage === this.selectedTargetLanguage) {
                    alert("La langue source et la langue cible ne peuvent pas être les mêmes.");
                    return;
                }

                const payload = {
                    sourceLanguageId: this.selectedSourceLanguage,
                    targetLanguageId: this.selectedTargetLanguage,
                    word: this.word,
                    translation: this.translation
                };

                const response = await axios.post('http://localhost:3001/api/add-word', payload);

                if (response.data.success) {
                    alert("Le mot et ses traductions ont été ajoutés avec succès.");
                    this.word = '';
                    this.translation = '';
                } else {
                    alert("Une erreur s'est produite lors de l'ajout du mot et de ses traductions.");
                }
            } catch (error) {
                console.error('Error adding word and translations:', error);
            }
        },
    },
    mounted() {
        this.fetchLanguages();
    }

};
</script>

<style scoped>
/* Les styles pour ce composant vont ici */
</style>

