<template>
    <div class="fil-arianne">home</div>
    <div class="categories" style="animation : fadeIn 1s ease">
        <div class="conteneur-category">
            <RouterLink to="/alphabets" class="category">
                <div id="image-un" class="category-image"></div>
                <h3>Alphabets</h3>
            </RouterLink>
        </div>
    <div class="conteneur-category">
        <RouterLink to="/vocabulary" class="category">
            <div id="image-deux" class="category-image"></div>
            <h3>Vocabulary</h3>
        </RouterLink>
        </div>
        <div class="conteneur-category">
        <RouterLink to="/sentences" class="category">
            <div id="image-trois" class="category-image"></div>
            <h3>Sentences</h3>
        </RouterLink>
        </div>
        <div class="conteneur-category">
            <RouterLink to="/verbs" class="category">
                <div id="image-quatre" class="category-image"></div>
                <h3>Verbs</h3>
            </RouterLink>
            </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
        };
    },
    methods: {
        learnAlphabets() {
            this.$router.push('/alphabets');
        },
        learnVocabulary() {
            this.$router.push('/vocabulary');
        },
        learnSentences() {
            this.$router.push('/sentences');
        },
    },
};
</script>

<style scoped>
@keyframes fadeIn {
    0% {
        opacity: 0;
    }

    100% {
        opacity: 1;
    }
}

.conteneur-category {
    display: flex;
    width: 430px;
    height: 400px;
    justify-content: center;
    align-items: center;
    margin : 0.75% 2.5% 0 2.5%;

}
.categories {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 2% 10%;
    margin: 0;
    max-height: 75vh;
    overflow-y: auto;
    flex-wrap: wrap;
    /* ajustez en fonction de la largeur souhaitée */
}

.category {
    position: relative;
    width: 430px;
    height: 320px;

    background-color: #fff;
    border: 8px solid #ECC9EE;
    border-radius: 23px;
    text-align: center;
    box-shadow: 0 14px 4px rgba(0, 0, 0, 0.25);
    /* Ajout de la propriété margin pour espacer les éléments */
    transition: all 0.7s cubic-bezier(.22, 1.18, .78, .99);
    /* Ajout d'une transition pour tous les changements */
}

#image-trois {
    background-image: url('../assets/images/pannel_trois.png');
    opacity: 0.43;
    transition: opacity 0.3s ease-out;
    /* Ajout d'une transition pour l'opacité */
}

#image-deux {
    background-image: url('../assets/images/pannel_deux.png');
    opacity: 0.43;
    transition: opacity 0.3s ease-out;
    /* Ajout d'une transition pour l'opacité */
}

#image-un {
    background-image: url('../assets/images/pannel_un.png');
    opacity: 0.43;
    transition: opacity 0.3s ease-out;
    /* Ajout d'une transition pour l'opacité */
}

#image-quatre {
    background-image: url('../assets/images/pannel_quatre.png');
    opacity: 0.43;
    transition: opacity 0.3s ease-out;
    /* Ajout d'une transition pour l'opacité */
}

.category h3 {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-family: "DINRoundPro-Bold";
    font-size: 51px;
    color: #505050;
    text-shadow: 0 4px 4px rgba(0, 0, 0, 0.15);
    transition: color 0.1s ease-out;
    /* Ajout d'une transition pour la couleur */
}

.category-image {
    width: 100%;
    height: 100%;
    background-position: center center;
    background-repeat: no-repeat;
    background-size: cover;
}

.category:hover h3 {
    color: rgb(52, 52, 52);
}

.category:hover {
    height: 400px;
    border: 8px solid var(--main-violet);
}

.category:hover>.category-image {
    opacity: 1 !important;
    /* Modification de l'opacité */
}

/* Personnalisation de la barre de défilement */
::-webkit-scrollbar {
    width: 8px;
    /* largeur de la barre de défilement */
    background-color: #F5F5F5;
    transition: all 1s ease-out;
    /* couleur de fond de la barre de défilement */
}

::-webkit-scrollbar-thumb {
    background-color: var(--main-violet);
    /* couleur de la poignée de la barre de défilement */
    border-radius: 8px;
    /* bord arrondi de la poignée */
}

::-webkit-scrollbar-thumb:hover {
    background-color: var(--main-violet-dark);
    /* couleur de la poignée de la barre de défilement au survol */
}

/* Personnalisation du track de la barre de défilement */
::-webkit-scrollbar-track {
    background-color: #ffffff00;
    /* couleur de fond du track de la barre de défilement */
}</style>