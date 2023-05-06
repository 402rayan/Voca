<!-- Sentence.vue -->
<template>
    <VocabularyVue
        :titre="'sentences'"
        :specialization="'isSentence'"
        :taille_input="'440px'"
        :word_font_size="'72px'"
        :wrapper_guess_width="'1240px'"
        :vitesse_texte="50"
        />
</template>
<script>

import VocabularyVue from './Vocabulary.vue';
export default {
    name: 'SentencesVue',
    components: {
        VocabularyVue,
    },
};
</script>

<style scoped>
.bouton-container {
    background-color: red;
}
</style>

