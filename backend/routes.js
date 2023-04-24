const express = require('express');
const router = express.Router();
const db = require('./db');
const { getRandomWordWithTranslations, getTranslationsForWord } = require('./queries');
const bodyParser = require('body-parser');
router.use(bodyParser.json());
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const secret = process.env.JWT_SECRET; // Assurez-vous de définir cette variable d'environnement


router.get('/api/word-to-guess', (req, res) => {
    const sourceLanguageId = req.query.sourceLanguageId;
    const targetLanguageId = req.query.targetLanguageId;

    if (!sourceLanguageId || !targetLanguageId) {
        res.status(400).send('Les paramètres sourceLanguageId et targetLanguageId sont requis.');
        return;
    }

    const getRandomWordQuery = `
    SELECT * FROM words
    ORDER BY RAND()
    LIMIT 1;
  `;

    db.query(getRandomWordQuery, [sourceLanguageId], (err, randomWordRows) => {
        if (err) {
            console.error('Erreur lors de la récupération d\'un mot aléatoire:', err);
            res.status(500).send('Erreur lors de la récupération d\'un mot aléatoire.');
            return;
        }

        if (randomWordRows.length === 0) {
            res.status(404).send('Aucun mot trouvé.');
            return;
        }

        const randomWord = randomWordRows[0];

        const getTranslationsQuery = `
      SELECT * FROM translations
      WHERE word_id = ? AND (language_id = ? OR language_id = ?);
    `;

        db.query(getTranslationsQuery, [randomWord.id, sourceLanguageId, targetLanguageId], (err, translationRows) => {
            if (err) {
                console.error('Erreur lors de la récupération des traductions:', err);
                res.status(500).send('Erreur lors de la récupération des traductions.');
                return;
            }

            if (translationRows.length > 0) {
                const translations = translationRows.reduce((acc, row) => {
                    acc[row.language_id] = row.translation;
                    return acc;
                }, {});

                res.json({
                    word: {"word" : randomWord.word , "id" : randomWord.id},
                    translations: translations,
                });
            } else {
                res.status(404).send('Aucune traduction trouvée.');
            }
        });
    });
});

router.post('/api/check-guess', (req, res) => {
    const { wordId, targetLanguageId, guess } = req.body;

    if (!wordId || !targetLanguageId || !guess) {
        res.status(400).send('Les paramètres wordId, targetLanguageId et guess sont requis.');
        return;
    }

    const getCorrectTranslationQuery = `
    SELECT * FROM translations
    WHERE word_id = ? AND language_id = ?;
  `;

    db.query(getCorrectTranslationQuery, [wordId, targetLanguageId], (err, correctTranslationRows) => {
        if (err) {
            console.error('Erreur lors de la récupération de la traduction correcte:', err);
            res.status(500).send('Erreur lors de la récupération de la traduction correcte.');
            return;
        }

        if (correctTranslationRows.length === 0) {
            res.status(404).send('Aucune traduction trouvée.');
            return;
        }

        const correctTranslation = correctTranslationRows[0].translation;
        const isCorrect = guess.trim().toLowerCase() === correctTranslation.trim().toLowerCase();
        res.json({ correct: isCorrect });
    });
});


router.post('/api/register', (req, res) => {
    const { username, email, password } = req.body;
    /* Contraintes */

    if (!username || !email || !password) {
        res.status(400).json({ error: 'Tous les champs (nom d\'utilisateur, email et mot de passe) sont obligatoires.' });
        return;
    }
    if (password.length < 8) {
        res.status(400).json({ error: 'Le mot de passe doit comporter au moins 8 caractères.' });
        return;
    }
    const checkUsernameAndEmailQuery = `
  SELECT * FROM users WHERE username = ? OR user_email = ?;
`;

    db.query(checkUsernameAndEmailQuery, [username, email], (err, results) => {
        if (err) {
            console.error('Erreur lors de la vérification du nom d\'utilisateur et de l\'email:', err);
            res.status(500).json({ error: 'Erreur lors de la vérification du nom d\'utilisateur et de l\'email.' });
            return;
        }

        if (results.length > 0) {
            res.status(400).json({ error: 'Le nom d\'utilisateur ou l\'email est déjà utilisé.' });
            return;
        }

        // Ajoutez ici la logique d'insertion de l'utilisateur.

        

    });

    (async () => {
        try {
            // Hachez le mot de passe
            const saltRounds = 10;
            const hashedPassword = await bcrypt.hash(password, saltRounds);

            const query = `
                INSERT INTO users (username, user_email, password)
                VALUES (?, ?, ?);
            `;

            db.query(query, [username, email, hashedPassword], (err, result) => {
                if (err) {
                    console.error('Erreur lors de l\'inscription:', err);
                    res.status(500).json({ error: 'Erreur lors de l\'inscription' });
                    return;
                }

                // Créez un JWT pour l'utilisateur nouvellement inscrit
                const payload = {
                    userId: result.insertId,
                    username,
                    email
                };

                const token = jwt.sign(payload, process.env.JWT_SECRET, {
                    expiresIn: '1h'
                });

                res.status(201).json({ message: 'Inscription réussie', token });
            });
        } catch (err) {
            console.error('Erreur lors du hachage du mot de passe:', err);
            res.status(500).json({ error: 'Erreur lors du hachage du mot de passe' });
        }
    })();
});

router.post('/api/login', async (req, res) => {
    const { username, password } = req.body;

    // TODO: Valider les identifiants et générer un JWT
    const userQuery = 'SELECT * FROM users WHERE username = ?';
    db.query(userQuery, [username], async (err, results) => {
        if (err) {
            console.error('Error fetching user:', err);
            res.status(500).json({ error: 'Error fetching user' });
            return;
        }

        if (results.length === 0) {
            res.status(401).json({ error: 'Invalid credentials' });
            return;
        }

        const user = results[0];
        const passwordMatch = bcrypt.compare(password, user.password);

        if (!passwordMatch) {
            res.status(401).json({ error: 'Invalid credentials' });
            return;
        }

        // TODO: Générer un JWT
        const token = jwt.sign(
            { userId: user.id, username: user.username },
            process.env.JWT_SECRET,
            { expiresIn: '1h' } // Durée de vie du token, à ajuster selon vos besoins
        );

        res.json({ token });
    });

});


router.get('/api/languages', (req, res) => {
    const query = 'SELECT id, language_code, language_name FROM languages';

    db.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching languages:', err);
            res.status(500).json({ error: 'Error fetching languages' });
            return;
        }

        res.json(results);
    });
});

router.get('/api/words', (req, res) => {
    const query = 'SELECT id, language_id, word FROM words';

    db.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching words:', err);
            res.status(500).json({ error: 'Error fetching words' });
            return;
        }

        res.json(results);
    });
});

router.post('/api/add-word', async (req, res) => {
    const { word, languageId } = req.body;

    if (!word || !languageId) {
        res.status(400).json({ error: "Les champs 'word' et 'languageId' sont obligatoires." });
        return;
    }

    const query = 'INSERT INTO words (language_id, word) VALUES (?, ?)';

    db.query(query, [languageId, word], (err) => {
        if (err) {
            console.error('Error adding word:', err);
            res.status(500).json({ success: false });
            return;
        }

        res.json({ success: true });
    });
});

router.post('/api/add-translation', async (req, res) => {
    const { wordId, targetLanguageId, translation } = req.body;

    if (!wordId || !targetLanguageId || !translation) {
        res.status(400).json({ error: "Les champs 'wordId', 'targetLanguageId' et 'translation' sont obligatoires." });
        return;
    }

    const query = 'INSERT INTO translations (word_id, language_id, translation, difficulty_level) VALUES (?, ?, ?, ?)';

    db.query(query, [wordId, targetLanguageId, translation, 0], (err) => {
        if (err) {
            console.error('Error adding translation:', err);
            res.status(500).json({ success: false });
            return;
        }

        res.json({ success: true });
    });
});

module.exports = router;


