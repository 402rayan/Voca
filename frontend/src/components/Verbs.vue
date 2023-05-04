<template>
    <DevineurVue :titre="'verbs'" :specialization="'isVerb'" />
</template>

<script>
import DevineurVue from './Devineur.vue';
export default {
    name: 'VerbVue',
    components: {
        DevineurVue,
    },
};
</script>