const getRandomWordWithTranslations = `
    SELECT w.word as source_word, t.translation as target_word
FROM words w
INNER JOIN translations t ON w.id = t.word_id
WHERE w.language_id = ? AND t.language_id = ? AND w.language_id != t.language_id
ORDER BY RAND()
LIMIT 1;

`;


const getTranslationsForWord = `
  SELECT
    translations.id,
    translations.translation,
    translations.language_id
  FROM translations
  WHERE translations.word_id = ?;
`;

module.exports = {
    getRandomWordWithTranslations,
    getTranslationsForWord
};
