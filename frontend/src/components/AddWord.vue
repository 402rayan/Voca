<template>
    <div
        style="height: 80vh; overflow-y: scroll; display: flex; justify-content: center; align-items: center; flex-wrap: wrap;padding: 2%">
        <div class="boite">
            <h1>Ajouter un mot</h1>
            <div class="form-group">
                <input type="text" id="word" v-model="word" class="input-field" placeholder="Mot" />
            </div>
            <div class="form-group">
                <select id="sourceLanguage" v-model="selectedSourceLanguage" class="input-field">
                    <option v-for="language in languages" :key="language.id" :value="language.id">
                        {{ language.language_name }}
                    </option>
                </select>
            </div>
            <button @click="addWord" class="submit-btn">Ajouter le mot</button>
        </div>
        <div class="boite">
            <h1>Ajouter un caractère</h1>
            <div class="form-group">
                <input type="text" id="character" v-model="character" class="input-field" placeholder="Caractère" />
            </div>
            <div class="form-group">
                <select id="sourceLanguage" v-model="selectedAlphabet" class="input-field">
                    <option v-for="alphabet in alphabets" :key="alphabet.id" :value="alphabet.id">
                        {{ alphabet.alphabet_name }}
                    </option>
                </select>
            </div>
            <button @click="addCharacter" class="submit-btn">Ajouter le caractère</button>
        </div>
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
            selectedAlphabet: 1,
            selectedSourceLanguage: 1,
            selectedTargetLanguage: null,
            word: '',
            character: '',
            translation: '',
            alphabets: [],
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
        async fetchAlphabets() {
            try {
                const response = await axios.get('http://localhost:3001/api/alphabets');
                this.alphabets = response.data;
            } catch (error) {
                console.error('Error fetching alphabets:', error);
            }
        },

        async addWord() {
            console.log(this.selectedSourceLanguage, this.word);
            try {
                const payload = {
                    languageId: this.selectedSourceLanguage,
                    word: this.word,
                };

                const response = await axios.post('http://localhost:3001/api/add-word', payload);

                if (response.data.success) {

                    // Si la langue source est le français, ajoutez également une traduction en français
                    if (this.selectedSourceLanguage == 1) { // Assurez-vous que l'ID de la langue française est 1
                        console.log('Jajoute la traduction en francais')
                        console.log('lid du mot est', response.data.wordId);
                        const frenchTranslationPayload = {
                            wordId: response.data.wordId,
                            targetLanguageId: 1, // ID de la langue française
                            translation: this.word,
                        };
                        console.log('frenchTranslationPayload', frenchTranslationPayload)
                        const response2 = await axios.post('http://localhost:3001/api/add-translation', frenchTranslationPayload);
                        if (response2.data.success) {
                            this.translation = '';
                        } else {
                            alert("Une erreur s'est produite lors de l'ajout de la traduction.");
                        }
                    }
                    this.word = '';
                    location.reload();
                } else {
                    alert("Une erreur s'est produite lors de l'ajout du mot.");
                }
            } catch (error) {
                console.error('Error adding word:', error);
            }
        },

        async addCharacter() {
            console.log(this.selectedAlphabet, this.character);
            try {
                const payload = {
                    alphabetId: this.selectedAlphabet,
                    character: this.character,
                };

                const response = await axios.post('http://localhost:3001/api/add-character', payload);

                if (response.data.success) {

                    // Si la langue source est le français, ajoutez également une traduction en français
                    if (this.selectedAlphabet == 1) { // Assurez-vous que l'ID de la langue française est 1
                        console.log('Jajoute la traduction en latin')
                        console.log('lid du mot est', response.data.characterId);
                        const frenchTranslationPayload = {
                            characterId: response.data.characterId,
                            targetAlphabetId: 1, // ID de la langue française
                            translation_cha: this.character,
                        };
                        console.log('frenchTranslationPayload', frenchTranslationPayload)
                        const response2 = await axios.post('http://localhost:3001/api/add-translation_cha', frenchTranslationPayload);
                        if (response2.data.success) {
                            this.translation_cha = '';
                        } else {
                            alert("Une erreur s'est produite lors de l'ajout de la traduction.");
                        }
                    }
                    this.character = '';
                    location.reload();
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
        this.fetchAlphabets();

    }

};
</script>

<style scoped>
.container {
    font-family: "Whyte Medium";
    display: flex;
    justify-content: center;
    align-items: center;
    flex-wrap: wrap;
    height: 80vh;
    padding: 2%;
    overflow-y: scroll;
}

input::placeholder {
    color: rgb(168, 168, 168);
    font-family: "Whyte Medium"
}
.boite {
    width: 40%;
    padding: 20px;
    border-radius: 15px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    margin: 1%;
}


h1 {
    margin-bottom: 20px;
}

.form-group {
    margin-bottom: 15px;
    width: 100%;
}
.label {
    font-size: 14px;
    font-weight: bold;
}

.input-field {
    padding: 10px;
    border: none;
    border-radius: 25px;
    width: 100%;
    background-color: #e8e8e8;
    font-size: 16px;
    outline: none;
}


input:focus,
select:focus {
    border-color: #4CAF50;
}

select {
    appearance: none;
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
    border-radius: 25px;
    transition-duration: 0.4s;
}

.submit-btn:hover {
    background-color: #45a049;
}
</style>