<template>
    <div>
        <h2>Apprenez une nouvelle langue avec Voca</h2>
        <div v-if="!loggedIn">
            <p>Connectez-vous avec Google pour suivre vos progrès :</p>
            
            <a href="/auth/google">Se connecter avec Google</a>
        </div>
        <div v-else>
            <p>Bienvenue, {{ user.displayName }} !</p>
            <p>Choisissez une option pour commencer :</p>
            <button @click="learnAlphabets">Apprendre des alphabets</button>
            <button @click="learnVocabulary">Apprendre du vocabulaire</button>
            <button @click="learnLudicWords">Apprendre des mots ludiques</button>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            loggedIn: false,
            user: {},
        };
    },
    created() {
        this.checkLoggedIn();
    },
    methods: {
        async checkLoggedIn() {
            // Vérifie si l'utilisateur est connecté (vous devrez implémenter cette route côté back-end)
            const response = await fetch('/api/user');
            console.log("la reponse est : ");
            console.log(response);
            if (response.ok) {
                this.user = await response.json();
                this.loggedIn = true;
            }
        },
        learnAlphabets() {
            this.$router.push('/alphabets');
        },
        learnVocabulary() {
            this.$router.push('/vocabulary');
        },
        learnLudicWords() {
            this.$router.push('/ludic-words');
        },
    },
};
</script>
