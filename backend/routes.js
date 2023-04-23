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
    const frenchLanguageId = 1; // Assurez-vous que c'est l'ID correct pour le français dans votre base de données

    db.query(getRandomWordWithTranslations, [frenchLanguageId], (err, results) => {
        if (err) {
            console.error('Error fetching word:', err);
            res.status(500).json({ error: 'Error fetching word' });
            return;
        }

        const wordData = results[0];
        if (!wordData) {
            res.status(404).json({ error: 'No words found' });
            return;
        }

        const word = {
            id: wordData.word_id,
            word: wordData.word,
            languageId: wordData.language_id,
        };

        // Récupérez les traductions pour le mot français
        db.query(getTranslationsForWord, [word.id], (err, translationsResults) => {
            if (err) {
                console.error('Error fetching translations:', err);
                res.status(500).json({ error: 'Error fetching translations' });
                return;
            }

            const translations = translationsResults.map((row) => ({
                id: row.id,
                translation: row.translation,
                languageId: row.language_id,
            }));

            res.json({ word, translations });
        });
    });
});


router.post('/api/check-guess', (req, res) => {
    const { wordId, languageId, guess } = req.body;
    const query = 'SELECT * FROM translations WHERE word_id = ? AND language_id = ?';
    db.query(query, [wordId, languageId], (err, result) => {
        if (err) {
            console.error(err);
            res.status(500).json({ error: 'Error checking guess in database' });
            return;
        }
        const translation = result[0];
        const correct = translation && translation.translation.toLowerCase() === guess.toLowerCase();
        res.json({ correct });
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

module.exports = router;
