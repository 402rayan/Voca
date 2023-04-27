<template>
    <div class="wrapper">
        <div class="wrapper-word">
            <div class="espace-langage">
                <div class="language-selector" @click="toggleLanguageList">

                    <div class="language-flag">
                        <img v-if="currentLanguage.language_code" :src="getFlagImageUrl(currentLanguage.language_code)"
                            alt="Language flag" />
                    </div>

                    <div class="language-name">{{ currentLanguage.language_name }}</div>

                    <ul v-if="showLanguageList" class="language-list" @click.stop>
                        <li v-for="(language, index) in languages" :key="index" @click="selectLanguage(language)">
                            <img :src="getFlagImageUrl(language.language_code)" alt="Language flag" />
                            <div class="language-name">{{ language.language_name }}</div>
                        </li>
                    </ul>
                </div>
            </div>

            <div id="word">{{ translations[this.currentLanguage.id]}}</div>
        </div>
    </div>
</template>

<script>
import axios from 'axios';
export default {
    name: 'VocabularyVue',
    data() {
        return {
            currentLanguage: {
                name: "English",
                flag: "https://www.countryflags.io/gb/flat/32.png",
            },
            languages: [],
            showLanguageList: false,
            wordToGuess: '',
            translations: [],
        };
    },
    mounted() {

        //trouve les languages grâce à fetch languages puis mets le premier language de la liste en currentLanguage
        this.fetchLanguages().then(() => {
            this.currentLanguage = this.languages[1];
            console.log('Current language:', this.currentLanguage);
            this.fetchWordToGuess(this.currentLanguage.id, this.currentLanguage.id);
        });
    },
    methods: {
        toggleLanguageList() {
            this.showLanguageList = !this.showLanguageList;
        },
        hideLanguageList() {
            this.showLanguageList = false;
        },
        selectLanguage(language) {
            this.currentLanguage = language;
            this.showLanguageList = false;
            console.log('ShowLanguageList:', this.showLanguageList);
        },
        getFlagImageUrl(languageCode) {
            return `https://flagcdn.com/16x12/${languageCode.toLowerCase()}.png`;
        },
        async fetchLanguages() {
            try {
                const response = await axios.get('http://localhost:3001/api/languages');
                this.languages = response.data;
                console.log('Languages:', this.languages);
            } catch (error) {
                console.error('Error fetching languages:', error);
            }
        },
        async fetchWordToGuess(langue1,langue2) {
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
    },

};
</script>

<style scoped>
.espace-langage {
    display : flex;
    justify-content: center;
    align-items: center;
    background-color :rgba(255, 0, 0, 0);
    width: 100%;
    height: 20%;
}

#word {
    font-family: "DINPro-MediumItalic";
    font-size: 96px;
    color: #262626;

    display: flex;
    justify-content: center;
    align-items: center;

    height: 55%;
    background-color : rgba(255, 255, 0, 0);
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
    justify-self: flex-start;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    width: 250px;
    height: 50px;
    border-radius: 27px;
    background-color: #ffffff;
    cursor: pointer;
}

.language-selector .language-flag {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    margin-right: 10px;
}

.language-selector .language-name {
    font-size: 18px;
}

.language-selector .language-list {
    position: absolute;
    top: 60px;
    left: 0;
    width: 100%;
    padding: 0;
    margin: 0;
    list-style-type: none;
    background-color: #ffffff;
    border: 1px solid #cccccc;
    border-radius: 5px;
    box-shadow: 0px 2px 5px 0px rgba(0, 0, 0, 0.5);
}

.language-selector .language-list li {
    display: flex;
    align-items: center;
    padding: 5px;
    cursor: pointer;
}

.language-selector .language-list li:hover {
    background-color: #f2f2f2;
}

.language-selector .language-list li img {
    width: 32px;
    height: 32px;
    margin-right: 10px;
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