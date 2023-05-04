<!-- Sentence.vue -->
<template>
    <VocabularyVue
        :titre="'sentences'"
        :specialization="'isSentence'"
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
