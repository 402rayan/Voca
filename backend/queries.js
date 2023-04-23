const getRandomWordWithTranslations = `
  SELECT
    words.id AS word_id,
    words.word,
    words.language_id
  FROM words
  WHERE words.language_id = ?  -- Filtrez les mots français
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
