<template>
    <div class="fil-arianne">
        <RouterLink to="/">home</RouterLink> > alphabets
    </div>

    <div class="wrapper">

        <div class="wrapper-character">
            <div class="espace-langage">
                <div class="alphabet-selector" @click="togglesourceAlphabetList">

                    <div class="alphabet-flag">
                        <div :class="'fi fi-' + sourceAlphabet.alphabet_code"></div>
                    </div>

                    <div class="alphabet-name">{{ sourceAlphabet.alphabet_name }}</div>

                    <ul v-if="showSourceAlphabetList" class="alphabet-list animate__animated animate__fadeInDown "
                        @click.stop>

                        <li v-for="(alphabet, index) in alphabets" :key="index" @click="selectsourceAlphabet(alphabet)">
                            <div :class="'fi fi-' + alphabet.alphabet_code"></div>
                            <div class="alphabet-name">{{ alphabet.alphabet_name }}
                            </div>
                            <div class="petite-ligne"></div>
                        </li>

                    </ul>
                </div>
            </div>

            <div id="character">{{ translations_cha[this.sourceAlphabet.id] }}</div>
        </div>

        <div class="wrapper-guess">
            <div v-if="mode === 'text'" class="wrapper-guess-one">
                <div class="targetAlphabet" @click="toggletargetAlphabetList">
                    <div class="espace-drapeau">

                        <div :class="'fi fi-' + targetAlphabet.alphabet_code"></div>
                    </div>
                    <div class="espace-nom">
                        {{ targetAlphabet.alphabet_name }}
                    </div>
                    <ul style="top : -50px; left :-75px; border : 0px" v-if="showTargetAlphabetList"
                        class="alphabet-list  animate__animated animate__zoomIn" @click.stop>
                        <li v-for="(alphabet, index) in alphabets" :key="index" @click="selecttargetAlphabet(alphabet)">
                            <div :class="'fi fi-' + alphabet.alphabet_code"></div>
                            <div class="alphabet-name">{{ alphabet.alphabet_name }}
                            </div>
                            <div class="petite-ligne"></div>
                        </li>

                    </ul>
                </div>

                <div class="wrapper-input">
                    <input id="inputGuess" type="text" v-bind:disabled="!peut_ecrire" v-model="guess"
                        @keydown.enter="checkGuess" placeholder="Guess the character" />
                </div>
                <div class="send-button">&rarr;</div>
            </div>
            <div v-else-if="mode === 'choices'" class="wrapper-guess-one">
                <div class="targetAlphabet" @click="toggletargetAlphabetList">
                    <div class="espace-drapeau">

                        <div :class="'fi fi-' + targetAlphabet.alphabet_code"></div>
                    </div>
                    <div class="espace-nom">
                        {{ targetAlphabet.alphabet_name }}
                    </div>
                    <ul style="top : -50px; left :-95px; border : 0px" v-if="showTargetAlphabetList"
                        class="alphabet-list animate__animated animate__zoomIn" @click.stop>
                        <li v-for="(alphabet, index) in alphabets" :key="index" @click="selecttargetAlphabet(alphabet)">
                            <div :class="'fi fi-' + alphabet.alphabet_code"></div>
                            <div class="alphabet-name">{{ alphabet.alphabet_name }}
                            </div>
                            <div class="petite-ligne"></div>
                        </li>

                    </ul>
                </div>
                <div class="bouton-container">
                    <button v-for="(choice, index) in choices" v-bind:disabled="!bouton_cliquable" :key="index"
                        @click="checkChoice(choice, index)" class="bouton-proposition"
                        :class="{ 'animate__animated animate__pulse animate__shakeX animate__flash incorrect': index === incorrectButtonIndex, 'animate__animated animate__bounce correct': index === correctButtonIndex }">
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
            peut_ecrire: true,
            bouton_cliquable: true,
            sourceAlphabet: {
            },
            targetAlphabet: {
            },
            alphabets: [],
            showSourceAlphabetList: false,
            showTargetAlphabetList: false,
            characterToGuess: '',
            translations_cha: [],
            guess: '',
            mode: 'choices',
            choices: [],
            incorrectButtonIndex: -1,
            correctButtonIndex: -1,
        };
    },
    async mounted() {

        //trouve les alphabets grâce à fetch alphabets puis mets le premier alphabet de la liste en sourceAlphabet
        this.fetchAlphabets().then(() => {
            this.sourceAlphabet = this.alphabets[1];
            this.targetAlphabet = this.alphabets[0];
            this.fetchcharacterToGuess(this.alphabets[1].id, this.alphabets[0].id);
        });
    },
    methods: {
        changeColor() {
            // Ajouter la classe d'animation pour changer la couleur
            const button = document.querySelector('.btn');
            button.classList.add('animate__heartBeat');

            // Changer la couleur de fond du bouton
            button.style.backgroundColor = '#FF5733';

            // Supprimer la classe d'animation après un délai pour réinitialiser le bouton
            setTimeout(() => {
                button.classList.remove('animate__heartBeat');
                button.style.backgroundColor = '';
            }, 1000);
        },
        togglesourceAlphabetList() {
            this.showSourceAlphabetList = !this.showSourceAlphabetList;
        },
        toggletargetAlphabetList() {
            this.showTargetAlphabetList = !this.showTargetAlphabetList;
        },
        hidesourceAlphabetList() {
            this.showSourceAlphabetList = false;
        },
        hidetargetAlphabetList() {
            this.showTargetAlphabetList = false;
        },
        selectsourceAlphabet(alphabet) {
            this.sourceAlphabet = alphabet;
            this.showSourceAlphabetList = false;
            if (this.user) {
                this.updateUseralphabet(this.user.id, alphabet.id);
            }


        },
        // Fais moi une fonction qui effectue une requête pour dire que l'utilisateur a changé de langue, la route est /api/user/:id/alphabet
        async updateUseralphabets(userId, alphabetId) {
            try {
                const response = await axios.put(`/api/users/${userId}/alphabets`, { alphabetId });
                return response.data;
            } catch (error) {
                console.error(error);
                throw new Error('Error updating user alphabets');
            }
        },
        selecttargetAlphabet(alphabet) {
            this.targetAlphabet = alphabet;
            this.showTargetAlphabetList = false;
        },
        getFlagImageUrl(alphabetCode) {
            return `https://flagcdn.com/16x12/${alphabetCode.toLowerCase()}.png`;
        },
        async fetchAlphabets() {
            try {
                const response = await axios.get('http://localhost:3001/api/alphabets');
                this.alphabets = response.data;
            } catch (error) {
                console.error('Error fetching alphabets:', error);
            }
        },
        async generateChoices() {
            const othersCharactersCount = 3;

            const otherCharacters = await this.fetchRandomCharacters(this.targetAlphabet.id, othersCharactersCount);
            // Extraire les mots de chaque objet de traduction
            const extractedCharacters = otherCharacters.map(obj => obj.translation_cha);
            console.log(extractedCharacters);
            // Ajoutez la bonne réponse et mélangez les choix
            this.choices = [this.translations_cha[this.targetAlphabet.id], ...extractedCharacters].sort(() => Math.random() - 0.5);
            console.log(this.choices);
        },
        async checkGuess() {
            if (this.guess.length < 1 || !this.peut_ecrire) {
                console.log("Vous navez rien marqué!");
                return;
            }


            try {
                const response = await axios.post('http://localhost:3001/api/check-guess_cha', {
                    characterId: this.characterToGuess.id,
                    targetAlphabetId: this.targetAlphabet.id,
                    guess: this.guess,
                    userId: localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')).id : null,
                    secondeLangue: this.sourceAlphabet.id,
                });
                const { correct } = response.data;
                const input_guess = document.getElementById("inputGuess");
                if (correct) {
                    this.peut_ecrire = false;
                    input_guess.classList.add('animate__animated', 'animate__bounce', 'correct');
                    setTimeout(() => {
                        this.fetchcharacterToGuess(this.sourceAlphabet.id, this.targetAlphabet.id);
                        input_guess.classList.remove('animate__animated', 'animate__bounce', 'correct');
                    }, 1000);
                    this.peut_ecrire = true;
                } else {
                    input_guess.classList.add('animate__animated', 'animate__pulse', 'animate__shakeX', 'animate__flash', 'incorrect');
                    setTimeout(() => {
                        input_guess.classList.remove('animate__animated', 'animate__pulse', 'animate__shakeX', 'animate__flash', 'incorrect');
                    }, 1000);
                }
            } catch (error) {
                console.error('Error checking guess:', error);
            }
        },


        checkChoice(choice, index) {

            this.showSourceAlphabetList = false;
            this.showTargetAlphabetList = false;
            const bonne_reponse = this.translations_cha[this.targetAlphabet.id];
            if (choice === bonne_reponse) {
                this.bouton_cliquable = false;
                console.log(this.translations_cha[this.targetAlphabet.id]);
                
                axios.post('http://localhost:3001/api/check-guess_cha', {
                    characterId: this.characterToGuess.id,
                    targetAlphabetId: this.targetAlphabet.id,
                    guess: this.translations_cha[this.targetAlphabet.id],
                });
                this.incorrectButtonIndex = -1;
                this.correctButtonIndex = index;
                setTimeout(() => {
                    this.correctButtonIndex = -1;
                    this.fetchcharacterToGuess(this.sourceAlphabet.id, this.targetAlphabet.id);
                    this.bouton_cliquable = true;
                }, 1000);

            } else {
                this.incorrectButtonIndex = index;
                this.correctButtonIndex = -1;
                setTimeout(() => {
                    this.incorrectButtonIndex = -1;
                }, 1000);
            }

        },

        async fetchRandomCharacters(alphabetId, count) {
            try {
                const response = await axios.get(`http://localhost:3001/api/random-characters?alphabetId=${alphabetId}&count=${count}`);
                return response.data;
            } catch (error) {
                console.error('Error fetching random characters:', error);
                return [];
            }
        },
        async fetchcharacterToGuess(langue1, langue2) {
            axios
                .get(`http://localhost:3001/api/character-to-guess`, {
                    params: {
                        sourceAlphabetId: langue1,
                        targetAlphabetId: langue2,
                    },
                })
                .then((response) => {
                    const { character, translations_cha } = response.data;
                    this.characterToGuess = character;
                    this.translations_cha = translations_cha;
                    this.guess = '';


                })
                .catch((error) => {
                    console.error('Error fetching character to guess:', error);
                    this.characterToGuess = 'Error fetching character';
                    this.translations_cha = [];
                });
        },


        toggleMode() {
            this.mode = this.mode === 'text' ? 'choices' : 'text';
            this.showSourceAlphabetList = false;
            this.showTargetAlphabetList = false;
        },
    },
    watch: {
        sourceAlphabet() {
            this.fetchcharacterToGuess(this.sourceAlphabet.id, this.targetAlphabet.id);
            console.log(this.sourceAlphabet)
            //this.fetchUserProgress(); // Ajoutez cette ligne
        },
        targetAlphabet() {
            this.fetchcharacterToGuess(this.sourceAlphabet.id, this.targetAlphabet.id);
        },
        mode() {
            if (this.mode === 'choices') {
                this.generateChoices();
            }
        },
        translations_cha: {
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
.animate__fadeInDown {
    --animate-duration: 400ms;
    animation-name: fadeInDown;
    transform-origin: top;
    animation-timing-function: cubic-bezier(.22, 1.18, .78, .99);
    animation-fill-mode: both;
}

@keyframes fadeInDown {
    0% {
        opacity: 0;
        transform: translateY(-10%);
    }

    100% {
        opacity: 1;
        transform: translateY(0%);
    }
}

.animate__zoomIn {
    --animate-duration: 400ms;
    animation-name: zoomIn;
    animation-timing-function: cubic-bezier(.22, 1.18, .78, .99);
    animation-fill-mode: both;
}

@keyframes zoomIn {
    0% {
        opacity: 0;
        transform: scale(0.2);
    }

    100% {
        opacity: 1;
        transform: scale(1);
    }
}



@keyframes appear {
    0% {
        opacity: 0;
        transform: translateY(10px);
    }

    100% {
        opacity: 1;
        transform: translateY(0);
    }
}

.correct {
    background-color: rgba(20, 255, 59, 0.676) !important;
    transition: background-color 0.3s ease;
}

.incorrect {
    background-color: rgba(255, 36, 20, 0.769) !important;
}

.fade-enter-active,
.fade-leave-active {
    transition: opacity .5s;
}

.fade-enter,
.fade-leave-to {
    opacity: 0;
}

.slide-fade-enter-active,
.slide-fade-leave-active {
    transition: all 0.3s ease;
}

.slide-fade-enter,
.slide-fade-leave-to {
    transform: translateY(-10px);
    opacity: 0;
}

.bouton-proposition:hover,
.ecriture-propositions:hover {
    background-color: #f0f0f0;
    transform: scale(1.05);
    transition: all 0.1s ease;
}

.bouton-proposition:active,
.ecriture-propositions:active {
    background-color: #e0e0e0;
    transform: scale(1);
}

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
    transition: background-color 0.3s ease;

}

.targetAlphabet {
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

.targetAlphabet,
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

#character {
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

.wrapper-character {

    height: 400px;
    width: 680px;
    border-radius: 75px;
    background-color: var(--light-beige);
    box-shadow: 0px 4px 4px 0px rgba(0, 0, 0, 0.25);
}

.alphabet-selector {
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

.alphabet-flag {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 32px;

    height: 100%;
    margin-right: 10px;
}

.alphabet-flag .fi {
    width: 100%;
    height: 60%;
    border-radius: 12px;
}

.alphabet-name {
    font-size: 22px;
    font-family: "DINPro-Light";
    text-transform: capitalize;
    font-weight: 600;
    color: #484848;

}

.liste_alphabet {
    top: 0;
}

.alphabet-list {
    z-index: 300;
    position: absolute;
    width: 100%;
    padding: 0;
    top: 0;
    margin: 0;
    list-style-type: none;
    background-color: #ffffff;
    border-radius: 5px;
    border-radius: 30px;
}

.alphabet-list li {
    list-style: none;
    text-align: center;
    padding: 5px;
    cursor: pointer;
    margin-bottom: 2px;
    padding-right: 32px;
}

.alphabet-list li div {
    transition: all 0.1s ease-in-out;
}


.alphabet-list li:hover div {

    transform: scale(1.01);
}

.alphabet-list li .fi {
    float: left;
    width: 32px;
    height: 32px;
    transform: translateX(120%);
    border-radius: 9px;
}

.character-input-box {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 300px;
    height: 50px;
    border-radius: 25px;
    background-color: #eeeeee;
    margin-bottom: 20px;
}

.character-input-box .alphabet-flag {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    margin-right: 10px;
}

.character-input-box .alphabet-name {
    font-size: 18px;
    margin-right: 10px;
}

.character-input-box input {
    border: none;
    outline: none;
    font-size: 18px;
    width: 100%;
    height: 100%;
    padding: 0 10px;
    background-color: transparent;
}

.character-input-box input::placeholder {
    color: #c3c3c3;
}

.character-input-box input:focus {
    border: none;
    outline: none;
}</style>