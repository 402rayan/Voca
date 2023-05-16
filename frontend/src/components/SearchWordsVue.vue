<template>
    <div>
        <input type="text" v-model="searchQuery" @input="searchWords" placeholder="Recherchez un mot"
            class="search-input" />
        <ul v-if="searchResults.length > 0" class="search-results">
            <li v-for="(word, index) in searchResults" :key="index">
                {{ word.word }}
            </li>
        </ul>
    </div>
</template>

<script>
import axios from 'axios';

export default {
    name: 'SearchWordsVue',
    data() {
        
        return {
            searchQuery: '',
            searchResults: [],
        };
    },
    methods: {
        async searchWords() {
            if (this.searchQuery.length > 0) {
                try {
                    const response = await axios.get(
                        `http://localhost:3001/api/words?search=${this.searchQuery}`
                    );
                    this.searchResults = response.data;
                } catch (error) {
                    console.error('Error searching words:', error);
                }
            } else {
                this.searchResults = [];
            }
        },
    },
};
</script>

<style scoped>

</style>
