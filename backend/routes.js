const express = require('express');
const router = express.Router();
const db = require('./db');
const { getRandomWordWithTranslations, getTranslationsForWord } = require('./queries');
const bodyParser = require('body-parser');
router.use(bodyParser.json());
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const secret = process.env.JWT_SECRET; // Assurez-vous de définir cette variable d'environnement

const winston = require('winston');

const logger = winston.createLogger({
    level: 'info',
    format: winston.format.json(),
    defaultMeta: { service: 'user-service' },
    transports: [
        new winston.transports.File({ filename: 'error.log', level: 'error' }),
        new winston.transports.File({ filename: 'combined.log' })
    ]
});

router.get('/api/word-to-guess', (req, res) => {
    const sourceLanguageId = req.query.sourceLanguageId;
    const targetLanguageId = req.query.targetLanguageId;
    var typeMot = req.query.typeMot;

    if (!typeMot) {
        typeMot = 'isVocabulary';
    }

    if (!sourceLanguageId || !targetLanguageId) {
        res.status(400).send('Les paramètres sourceLanguageId et targetLanguageId sont requis.');
        return;
    }

    const getRandomWordQuery = `
    SELECT * FROM words WHERE specialization = ?
    ORDER BY RAND()
    LIMIT 1;
  `;

    db.query(getRandomWordQuery, [typeMot], (err, randomWordRows) => {
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
                    word: { "word": randomWord.word, "id": randomWord.id },
                    translations: translations,
                });
            } else {
                res.status(404).send('Aucune traduction trouvée.');
            }
        });
    });
});

router.post('/api/check-guess', (req, res) => {
    const { wordId, targetLanguageId, guess, userId, secondeLangue } = req.body;
    logger.info('le user est : ' + userId + ' et la seconde langue est : ' + secondeLangue);
    // affiche dans les logs le user et la seconde langue

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

        if (userId) {
            logger.info('le user est bien géré');
            const getUserProgressQuery = `
            SELECT * FROM user_progress
            WHERE user_id = ? AND language_id = ?;
            `;

            db.query(getUserProgressQuery, [userId, targetLanguageId], (err, userProgressRows) => {
                if (err) {
                    console.error('Erreur lors de la récupération du score de l\'utilisateur:', err);
                    res.status(500).send('Erreur lors de la récupération du score de l\'utilisateur.');
                    return;
                }

                let score = userProgressRows.length === 0 ? 0 : userProgressRows[0].score;
                score += isCorrect ? 0.125 : 0;


                const updateUserProgressQuery = `
                UPDATE user_progress SET score = ? WHERE user_id = ? AND language_id = ?;
                `;
                db.query(updateUserProgressQuery, [score, userId, targetLanguageId], (err) => {
                    if (err) {
                        console.error('Erreur lors de la mise à jour du score de l\'utilisateur:', err);
                        res.status(500).send('Erreur lors de la mise à jour du score de l\'utilisateur.');
                        return;
                    }

                    if (secondeLangue) {
                        const getUserProgressQuery = `
        SELECT * FROM user_progress
        WHERE user_id = ? AND language_id = ?;
    `;

                        db.query(getUserProgressQuery, [userId, secondeLangue], (err, userProgressRows) => {
                            if (err) {
                                console.error('Erreur lors de la récupération du score de l\'utilisateur:', err);
                                res.status(500).send('Erreur lors de la récupération du score de l\'utilisateur.');
                                return;
                            }

                            let scoreSecondeLangue = userProgressRows.length === 0 ? 0 : userProgressRows[0].score;
                            scoreSecondeLangue += isCorrect ? 0.125 : 0;

                            const updateUserProgressQuerySecondeLangue = `
            UPDATE user_progress SET score = ? WHERE user_id = ? AND language_id = ?;
        `;
                            db.query(updateUserProgressQuerySecondeLangue, [scoreSecondeLangue, userId, secondeLangue], (err) => {
                                if (err) {
                                    console.error('Erreur lors de la mise à jour du score de l\'utilisateur pour la seconde langue:', err);
                                    res.status(500).send('Erreur lors de la mise à jour du score de l\'utilisateur pour la seconde langue.');
                                    return;
                                }

                                res.json({ correct: isCorrect });
                            });
                        });
                    } else {
                        res.json({ correct: isCorrect });
                    }
                });
            });
        } else {
            res.json({ correct: isCorrect });
        }
    });
});


router.post('/api/register', async (req, res) => {
    const { username, email, password } = req.body;
    // Contraintes

    if (!username || !email || !password) {
        res.status(400).json({ error: "Tous les champs (nom d'utilisateur, email et mot de passe) sont obligatoires." });
        return;
    }
    if (password.length < 8) {
        res.status(400).json({ error: 'Le mot de passe doit comporter au moins 8 caractères.' });
        return;
    }
    const checkUsernameAndEmailQuery = `
        SELECT * FROM users WHERE username = ? OR user_email = ?;
    `;

    try {
        const [results] = await db.promise().query(checkUsernameAndEmailQuery, [username, email]);

        if (results.length > 0) {
            res.status(400).json({ error: "Le nom d'utilisateur ou l'email est déjà utilisé." });
            return;
        }

        // Hachez le mot de passe
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        const query = `
            INSERT INTO users (username, user_email, password,user_source_language, user_target_language)
            VALUES (?, ?, ?, 1 , 2);
        `;

        const [result] = await db.promise().query(query, [username, email, hashedPassword]);

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
    } catch (err) {
        console.error('Erreur lors de l\'inscription:', err);
        res.status(500).json({ error: 'Erreur lors de l\'inscription' });
    }
});

router.post('/api/login', async (req, res) => {
    const { username, password } = req.body;

    // TODO: Valider les identifiants et générer un JWT
    const userQuery = 'SELECT * FROM users WHERE username = ? OR user_email = ?;';
    db.query(userQuery, [username, username], async (err, results) => {
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
        const passwordMatch = await bcrypt.compare(password, user.password);

        if (!passwordMatch) {
            res.status(401).json({ error: 'Invalid credentials' });
            return;
        }

        // TODO: Générer un JWT
        const token = jwt.sign(
            { userId: user.id, username: user.username },
            process.env.JWT_SECRET,
            { expiresIn: '3h' } // Durée de vie du token, à ajuster selon vos besoins
        );

        const userResponse = {
            id: user.id,
            username: user.username,
            // ajoutez d'autres propriétés si nécessaire
        };

        // Store the token in a cookie with a 3 hour expiration time
        res.cookie('token', token, { maxAge: 3 * 60 * 60 * 1000, httpOnly: true });

        res.json({ token, user: userResponse });
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
    // Récupérer le paramètre de requête "search" (ou utiliser une chaîne vide s'il est absent)
    const searchQuery = req.query.search || '';

    // Modifier la requête SQL pour inclure la condition de recherche si searchQuery n'est pas vide
    const query = searchQuery
        ? 'SELECT id, language_id, word FROM words WHERE word LIKE ?'
        : 'SELECT id, language_id, word FROM words';

    // Préparer les paramètres SQL pour éviter les injections SQL
    const sqlParams = searchQuery ? [`%${searchQuery}%`] : [];

    db.query(query, sqlParams, (err, results) => {
        if (err) {
            console.error('Error fetching words:', err);
            res.status(500).json({ error: 'Error fetching words' });
            return;
        }

        res.json(results);
    });
});

router.get('/api/user-progress', async (req, res) => {
    const { userId } = req.query;

    if (!userId) {
        return res.status(400).json({ error: 'Le paramètre userId est requis.' });
    }

    const getUserQuery = `
    SELECT * FROM users
    WHERE id = ?
  `;

    const getUserProgressQuery = `
    SELECT * FROM user_progress
    WHERE user_id = ?
  `;

    const getLanguagesQuery = `
    SELECT id FROM languages
  `;

    let user, userProgressRows, languageRows;

    try {
        const [userRows] = await db.promise().query(getUserQuery, [userId]);

        if (userRows.length === 0) {
            return res.status(404).json({ error: `L'utilisateur avec l'ID ${userId} n'existe pas.` });
        }

        user = userRows[0];
        const [userProgressRows] = await db.promise().query(getUserProgressQuery, [userId]);
        this.userProgressRows = userProgressRows;
        const [languageRows] = await db.promise().query(getLanguagesQuery);
        this.languageRows = languageRows;

        const userProgressLanguageIds = this.userProgressRows.map((row) => row.language_id);
        const languageIds = this.languageRows.map((row) => row.id);

        const missingLanguageIds = languageIds.filter((id) => !userProgressLanguageIds.includes(id));
        const existingUserProgressRows = this.userProgressRows.filter((row) => languageIds.includes(row.language_id));

        if (missingLanguageIds.length > 0) {
            const insertUserProgressQueries = missingLanguageIds.map((languageId) => {
                const insertUserProgressQuery = `
          INSERT INTO user_progress (user_id, language_id, score)
          VALUES (?, ?, 0)
        `;
                return db.promise().query(insertUserProgressQuery, [userId, languageId]);
            });

            await Promise.all(insertUserProgressQueries);
            const [newUserProgressRows] = await db.promise().query(getUserProgressQuery, [userId]);
            this.userProgressRows = newUserProgressRows;
            res.json(newUserProgressRows);
        } else if (existingUserProgressRows.length < languageIds.length) {
            const insertUserProgressQueries = missingLanguageIds.map((languageId) => {
                const insertUserProgressQuery = `
          INSERT INTO user_progress (user_id, language_id, score)
          VALUES (?, ?, 0)
        `;
                return db.promise().query(insertUserProgressQuery, [userId, languageId]);
            });
            await Promise.all(insertUserProgressQueries);
            const [newUserProgressRows] = await db.promise().query(getUserProgressQuery, [userId]);
            this.userProgressRows = newUserProgressRows;
            res.json(newUserProgressRows);
        } else {
            res.json(this.userProgressRows);
        }
    } catch (err) {
        console.error('Erreur lors de la récupération de la progression de l\'utilisateur: ', err);
        res.status(500).json({
            error: 'Erreur lors de la récupération de la progression de l\'utilisateur.'
        });
    }
});


router.post('/api/add-word', async (req, res) => {
    const { word, languageId } = req.body;

    if (!word || !languageId) {
        res.status(400).json({ error: "Les champs 'word' et 'languageId' sont obligatoires." });
        return;
    }

    const query = 'INSERT INTO words (language_id, word) VALUES (?, ?)';

    db.query(query, [languageId, word], (err, result) => {
        if (err) {
            console.error('Error adding word:', err);
            res.status(500).json({ success: false });
            return;
        }

        // Renvoyer l'ID du mot ajouté dans la réponse
        res.json({ success: true, wordId: result.insertId });
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

router.get('/api/random-words', (req, res) => {
    const languageId = req.query.languageId;
    const count = parseInt(req.query.count, 10) || 3;
    var typeMot = req.query.typeMot;

    if (!typeMot) {
        typeMot = 'isVocabulary';
    }

    const query = `
    SELECT t.translation
    FROM translations t
    JOIN words w ON t.word_id = w.id
    WHERE t.language_id = ?
    AND w.specialization = ?
    ORDER BY RAND()
    LIMIT ?
  `;

    db.query(query, [languageId,typeMot, count], (err, results) => {
        if (err) {
            console.error('Error fetching random words:', err);
            res.status(500).json({ error: 'Error fetching random words' });
            return;
        }

        res.json(results);
    });
});


function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    logger.info('ADDITIONNEL : Authorization header: ' + authHeader);


    const token = authHeader && authHeader.split(' ')[1];
    logger.info('Authorization header: ' + token);


    if (token == null) {
        logger.info('Pas de token');
        return res.status(401).json({ error: 'Unauthorized' });

    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            logger.info('Token invalide');
            return res.status(403).json({ error: 'Invalid token' });
        }
        logger.info('On continue à la suite');
        req.user = user;
        next();
    });
}
router.get('/api/user', authenticateToken, async (req, res) => {
    const userId = req.user.userId;


    // Retrieve the user information from the database
    const userQuery = 'SELECT * FROM users WHERE id = ?';
    db.query(userQuery, [userId], async (err, results) => {
        if (err) {
            console.error('Error fetching user:', err);
            res.status(500).json({ error: 'Error fetching user' });
            return;
        }

        if (results.length === 0) {
            res.status(404).json({ error: 'User not found' });
            return;
        }

        const user = results[0];
        const userResponse = {
            id: user.id,
            username: user.username,
            user_source_language: user.user_source_language,
            user_target_language: user.user_target_language
            // add other properties as needed
        };

        res.json(userResponse);
    });
});

router.post('/api/user_languages', authenticateToken, async (req, res) => {
    const { userId, user_source_language, user_target_language } = req.body;

    if (!user_source_language || !user_target_language) {
        res.status(400).json({ error: "Les champs 'user_source_language' et 'user_target_language' sont obligatoires." });
        return;
    }
    const query = 'UPDATE users SET user_source_language = ?, user_target_language = ? WHERE id = ?';

    db.query(query, [user_source_language, user_target_language, userId], (err) => {
        if (err) {
            console.error('Error updating user languages:', err);
            res.status(500).json({ success: false });
            return;
        }

        res.json({ success: true });
    });
});


router.get('/api/translations', async (req, res) => {
    const wordId = req.query.wordId;

    if (!wordId) {
        res.status(400).json({ error: "Le paramètre 'wordId' est obligatoire." });
        return;
    }

    const query = `
      SELECT * FROM translations WHERE word_id = ?
    `;

    db.query(query, [wordId], (err, results) => {
        if (err) {
            console.error('Error fetching translations:', err);
            res.status(500).json({ error: 'Error fetching translations' });
            return;
        }

        res.json(results);
    });
});

// CHARACTERS


router.get('/api/translations_cha', async (req, res) => {
    const characterId = req.query.characterId;

    if (!characterId) {
        res.status(400).json({ error: "Le paramètre 'characterId' est obligatoire." });
        return;
    }

    const query = `
      SELECT * FROM translations_cha WHERE character_id = ?
    `;

    db.query(query, [characterId], (err, results) => {
        if (err) {
            console.error('Error fetching translations:', err);
            res.status(500).json({ error: 'Error fetching translations' });
            return;
        }

        res.json(results);
    });
});

router.get('/api/random-characters', (req, res) => {
    const alphabetId = req.query.alphabetId;
    const count = parseInt(req.query.count, 10) || 3;

    const query = `
    SELECT translation_cha
    FROM translations_cha
    WHERE alphabet_id = ?
    ORDER BY RAND()
    LIMIT ?
  `;

    db.query(query, [alphabetId, count], (err, results) => {
        if (err) {
            console.error('Error fetching random characters:', err);
            res.status(500).json({ error: 'Error fetching random characters' });
            return;
        }

        res.json(results);
    });
});

router.post('/api/add-translation_cha', async (req, res) => {
    const { characterId, targetAlphabetId, translation_cha } = req.body;

    if (!characterId || !targetAlphabetId || !translation_cha) {
        res.status(400).json({ error: "Les champs 'characterId', 'targetAlphabetId' et 'translation_cha' sont obligatoires." });
        return;
    }

    const query = 'INSERT INTO translations_cha (character_id, alphabet_id, translation_cha, difficulty_level) VALUES (?, ?, ?, 0)';

    db.query(query, [characterId, targetAlphabetId, translation_cha, 0], (err) => {
        if (err) {
            logger.info('Error adding translation:', err);
            res.status(500).json({ success: false });
            return;
        }

        res.json({ success: true });
    });
});

router.post('/api/add-character', async (req, res) => {
    const { character, alphabetId } = req.body;

    if (!character || !alphabetId) {
        res.status(400).json({ error: "Les champs 'character' et 'alphabetId' sont obligatoires." });
        return;
    }

    const query = 'INSERT INTO characters (alphabet_id, `character`) VALUES (?, ?)';

    db.query(query, [alphabetId, character], (err, result) => {
        if (err) {
            logger.info('Error adding character:', err);
            res.status(500).json({ success: false });
            return;
        }

        // Renvoyer l'ID du mot ajouté dans la réponse
        res.json({ success: true, characterId: result.insertId });
    });
});

router.get('/api/characters', (req, res) => {
    const query = 'SELECT id, alphabet_id, `character` FROM characters';

    db.query(query, (err, results) => {
        if (err) {
            logger.info('Error fetching characters:', err);
            res.status(500).json({ error: 'Error fetching characters' });
            return;
        }

        res.json(results);
    });
});

router.get('/api/alphabets', (req, res) => {
    const query = 'SELECT id, alphabet_code, alphabet_name FROM alphabets';

    db.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching alphabets:', err);
            res.status(500).json({ error: 'Error fetching alphabets' });
            return;
        }

        res.json(results);
    });
});

router.post('/api/check-guess_cha', (req, res) => {
    const { characterId, targetAlphabetId, guess } = req.body;
    // affiche dans les logs le user et la seconde langue

    if (!characterId || !targetAlphabetId || !guess) {
        res.status(400).send('Les paramètres characterId, targetAlphabetId et guess sont requis.');
        return;
    }

    const getCorrectTranslationQuery = `
    SELECT * FROM translations_cha
    WHERE character_id = ? AND alphabet_id = ?;
    `;

    db.query(getCorrectTranslationQuery, [characterId, targetAlphabetId], (err, correctTranslationRows) => {
        if (err) {
            console.error('Erreur lors de la récupération de la traduction correcte:', err);
            res.status(500).send('Erreur lors de la récupération de la traduction correcte.');
            return;
        }

        if (correctTranslationRows.length === 0) {
            res.status(404).send('Aucune traduction trouvée.');
            return;
        }

        const correctTranslation = correctTranslationRows[0].translation_cha;
        const isCorrect = guess.trim().toLowerCase() === correctTranslation.trim().toLowerCase();

        res.json({ correct: isCorrect });

    });
});

router.get('/api/character-to-guess', (req, res) => {
    const sourceAlphabetId = req.query.sourceAlphabetId;
    const targetAlphabetId = req.query.targetAlphabetId;

    if (!sourceAlphabetId || !targetAlphabetId) {
        res.status(400).send('Les paramètres sourceAlphabetId et targetAlphabetId sont requis.');
        return;
    }

    const getRandomCharacterQuery = `
    SELECT * FROM characters
    ORDER BY RAND()
    LIMIT 1;
  `;

    db.query(getRandomCharacterQuery, [sourceAlphabetId], (err, randomCharacterRows) => {
        if (err) {
            console.error('Erreur lors de la récupération d\'un mot aléatoire:', err);
            res.status(500).send('Erreur lors de la récupération d\'un mot aléatoire.');
            return;
        }

        if (randomCharacterRows.length === 0) {
            res.status(404).send('Aucun mot trouvé.');
            return;
        }

        const randomCharacter = randomCharacterRows[0];

        const getTranslationsQuery = `
      SELECT * FROM translations_cha
      WHERE character_id = ? AND (alphabet_id = ? OR alphabet_id = ?);
    `;

        db.query(getTranslationsQuery, [randomCharacter.id, sourceAlphabetId, targetAlphabetId], (err, translationRows) => {
            if (err) {
                console.error('Erreur lors de la récupération des traductions:', err);
                res.status(500).send('Erreur lors de la récupération des traductions.');
                return;
            }

            if (translationRows.length > 0) {
                const translations = translationRows.reduce((acc, row) => {
                    acc[row.alphabet_id] = row.translation_cha;
                    return acc;
                }, {});

                res.json({
                    character: { "character": randomCharacter.character, "id": randomCharacter.id },
                    translations_cha: translations,
                });
            } else {
                res.status(404).send('Aucune traduction trouvée.');
            }
        });
    });
});


module.exports = router;


