<template>
    <div>
        <h1>Ajouter un mot</h1>
        <label for="word">Mot :</label>
        <input type="text" id="word" v-model="word" />
        <label for="sourceLanguage">Langue :</label>
        <select id="sourceLanguage" v-model="selectedSourceLanguage">
            <option v-for="language in languages" :key="language.id" :value="language.id">
                {{ language.language_name }}
            </option>
        </select>
        <button @click="addWord">Ajouter le mot</button>
        <AddTranslation />
    </div>
</template>


<script>
import axios from 'axios';
import AddTranslation from './AddTranslation.vue';

export default {
    components: {
        AddTranslation
    },
    data() {
        return {
            languages: [],
            selectedSourceLanguage: 1,
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

        async addWord() {
            console.log(this.selectedSourceLanguage,this.word);
            try {
                const payload = {
                    languageId: this.selectedSourceLanguage, // Changez cette ligne
                    word: this.word
                };

                const response = await axios.post('http://localhost:3001/api/add-word', payload);

                if (response.data.success) {
                    alert("Le mot a été ajouté avec succès.");
                    this.word = '';
                } else {
                    alert("Une erreur s'est produite lors de l'ajout du mot.");
                }
            } catch (error) {
                console.error('Error adding word:', error);
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

