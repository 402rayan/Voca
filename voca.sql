-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Hôte : 127.0.0.1:3306
-- Généré le : lun. 01 mai 2023 à 21:11
-- Version du serveur : 8.0.31
-- Version de PHP : 8.0.26

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données : `voca`
--

-- --------------------------------------------------------

--
-- Structure de la table `alphabets`
--

DROP TABLE IF EXISTS `alphabets`;
CREATE TABLE IF NOT EXISTS `alphabets` (
  `id` int NOT NULL AUTO_INCREMENT,
  `alphabet_name` varchar(60) DEFAULT NULL,
  `alphabet_code` varchar(10) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `alphabet_name` (`alphabet_name`)
) ENGINE=MyISAM AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Déchargement des données de la table `alphabets`
--

INSERT INTO `alphabets` (`id`, `alphabet_name`, `alphabet_code`) VALUES
(1, 'latin', 'eu'),
(2, 'عربية', 'sa'),
(3, '仮名', 'jp'),
(4, '한국어', 'kr');

-- --------------------------------------------------------

--
-- Structure de la table `characters`
--

DROP TABLE IF EXISTS `characters`;
CREATE TABLE IF NOT EXISTS `characters` (
  `id` int NOT NULL AUTO_INCREMENT,
  `alphabet_id` int DEFAULT NULL,
  `character` varchar(30) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `alphabets_id` (`alphabet_id`)
) ENGINE=MyISAM AUTO_INCREMENT=30 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Déchargement des données de la table `characters`
--

INSERT INTO `characters` (`id`, `alphabet_id`, `character`) VALUES
(1, 1, 'a'),
(2, 1, 'b'),
(7, 1, 'c'),
(9, 1, 'd'),
(10, 1, 'e'),
(12, 1, 'g'),
(13, 1, 'k'),
(14, 1, 'ka'),
(15, 1, 'ma'),
(16, 1, 'sa'),
(17, 1, 'ta'),
(18, 1, 'na'),
(19, 1, 'ha'),
(20, 1, 'ya'),
(21, 1, 'ra'),
(22, 1, 'wa'),
(23, 1, 'ga'),
(24, 1, 'da'),
(25, 1, 'ba'),
(26, 1, 'pa'),
(27, 1, 'ja'),
(28, 1, 'cha'),
(29, 1, 'sha');

-- --------------------------------------------------------

--
-- Structure de la table `languages`
--

DROP TABLE IF EXISTS `languages`;
CREATE TABLE IF NOT EXISTS `languages` (
  `id` int NOT NULL AUTO_INCREMENT,
  `language_name` varchar(60) DEFAULT NULL,
  `language_code` varchar(10) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `language_name` (`language_name`)
) ENGINE=MyISAM AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Déchargement des données de la table `languages`
--

INSERT INTO `languages` (`id`, `language_name`, `language_code`) VALUES
(1, 'français', 'fr'),
(2, 'english', 'gb'),
(3, '한국어', 'kr'),
(4, 'español', 'es'),
(5, 'عربية', 'sa'),
(6, 'arabe', 'sa'),
(7, '日本', 'jp'),
(8, 'japanese', 'jp');

-- --------------------------------------------------------

--
-- Structure de la table `translations`
--

DROP TABLE IF EXISTS `translations`;
CREATE TABLE IF NOT EXISTS `translations` (
  `id` int NOT NULL AUTO_INCREMENT,
  `word_id` int DEFAULT NULL,
  `language_id` int DEFAULT NULL,
  `translation` varchar(255) DEFAULT NULL,
  `difficulty_level` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `word_id` (`word_id`),
  KEY `language_id` (`language_id`)
) ENGINE=MyISAM AUTO_INCREMENT=288 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Déchargement des données de la table `translations`
--

INSERT INTO `translations` (`id`, `word_id`, `language_id`, `translation`, `difficulty_level`) VALUES
(1, 1, 2, 'dog', 0),
(2, 1, 3, '개', 0),
(3, 2, 2, 'cat', 0),
(4, 3, 2, 'hello', 0),
(5, 3, 3, '안녕하세요', 0),
(6, 1, 1, 'chien', 0),
(7, 2, 1, 'chat', 0),
(8, 3, 1, 'bonjour', 0),
(9, 2, 3, '고양이', 0),
(10, 5, 1, 'merci', 0),
(12, 5, 4, 'gracias', 0),
(13, 5, 3, '감사합니다', 0),
(14, 5, 5, 'شكرًا', 0),
(15, 5, 6, 'shukran', 0),
(16, 1, 5, 'كلب', 0),
(17, 1, 6, 'kalb', 0),
(19, 5, 2, 'thank you', 0),
(20, 13, 1, 'garçon', 0),
(21, 14, 1, 'fille', 0),
(22, 14, 2, 'girl', 0),
(23, 14, 4, 'chica', 0),
(24, 1, 4, 'perro', 0),
(26, 2, 4, 'gato', 0),
(27, 2, 5, 'قط', 0),
(28, 2, 6, 'qit', 0),
(29, 3, 4, 'hola', 0),
(30, 3, 5, 'أهلا', 0),
(31, 3, 6, 'ahlan', 0),
(32, 13, 2, 'boy', 0),
(33, 14, 3, '소녀', 0),
(34, 14, 5, 'بنت', 0),
(35, 14, 6, 'bint', 0),
(36, 13, 3, '소년', 0),
(37, 13, 4, 'niño', 0),
(38, 13, 5, 'ولد', 0),
(39, 13, 6, 'walad', 0),
(40, 15, 1, 'au revoir', 0),
(41, 15, 2, 'goodbye', 0),
(42, 15, 3, '안녕히 가세요', 0),
(43, 15, 4, 'adiós', 0),
(44, 15, 5, 'مع السلامة', 0),
(45, 15, 6, 'ma\'a salama', 0),
(46, 15, 7, 'さようなら', 0),
(47, 15, 8, 'sayonara', 0),
(48, 16, 1, 'frère', 0),
(49, 16, 2, 'brother', 0),
(50, 16, 3, '형제', 0),
(51, 16, 4, 'hermano', 0),
(52, 16, 5, 'أخ ', 0),
(53, 16, 6, 'akh', 0),
(54, 16, 7, '兄弟', 0),
(55, 16, 8, 'kyoudai', 0),
(56, 17, 1, 'sœur', 0),
(57, 17, 2, 'sister', 0),
(58, 17, 3, '여자 형제', 0),
(59, 17, 4, 'hermana', 0),
(60, 17, 5, 'أخت', 0),
(61, 17, 6, 'ukht', 0),
(62, 17, 7, 'いもうと', 0),
(63, 17, 8, 'imouto', 0),
(64, 18, 1, 'fils', 0),
(65, 18, 2, 'son', 0),
(66, 18, 3, '아들', 0),
(67, 18, 4, 'hijo', 0),
(68, 18, 5, 'ابن', 0),
(69, 18, 6, 'ibn', 0),
(70, 18, 7, '息子', 0),
(71, 18, 8, 'musuko', 0),
(72, 19, 1, 'demain', 0),
(97, 1, 7, '犬', 0),
(74, 19, 2, 'tomorrow', 0),
(75, 19, 3, '내일', 0),
(76, 19, 4, 'mañana', 0),
(77, 19, 5, 'غداً', 0),
(78, 19, 6, 'ghadan', 0),
(79, 19, 7, 'あした', 0),
(80, 19, 8, 'ashita', 0),
(81, 20, 1, 'manger', 0),
(82, 20, 2, 'to eat', 0),
(83, 20, 3, '먹다', 0),
(84, 20, 4, 'comer', 0),
(85, 20, 5, 'يأكل', 0),
(86, 20, 6, 'ya\'kul', 0),
(87, 20, 7, '食べる', 0),
(88, 20, 8, 'taberu', 0),
(89, 21, 1, 'boire', 0),
(90, 21, 2, 'drink', 0),
(91, 21, 7, 'のむ', 0),
(92, 21, 8, 'nomu', 0),
(93, 21, 4, 'beber', 0),
(94, 21, 3, '마시다', 0),
(95, 21, 5, 'شرب', 0),
(96, 21, 6, 'shariba', 0),
(98, 1, 7, 'いぬ', 0),
(99, 1, 8, 'inu', 0),
(100, 2, 7, 'ねこ', 0),
(101, 2, 8, 'neko', 0),
(102, 3, 7, 'こんにちは', 0),
(103, 3, 8, 'konnichiwa', 0),
(104, 5, 7, 'ありがとう', 0),
(105, 5, 8, 'arigatou', 0),
(106, 14, 7, '女の子', 0),
(107, 14, 8, 'onna no ko', 0),
(189, 29, 2, 'yes', NULL),
(110, 22, 1, 'moi', 0),
(111, 23, 1, 'donner', 0),
(112, 23, 2, 'to give', NULL),
(113, 23, 3, '주다', NULL),
(114, 23, 4, 'dar', NULL),
(115, 23, 5, 'يعطي', NULL),
(116, 23, 6, 'i\'ta', NULL),
(117, 23, 7, 'あげる', NULL),
(118, 23, 7, 'アゲル', NULL),
(119, 23, 8, 'ageru', NULL),
(120, 22, 2, 'me', NULL),
(121, 22, 3, '나', NULL),
(122, 22, 4, 'yo', NULL),
(123, 22, 5, 'أنا', NULL),
(124, 22, 6, 'ana', NULL),
(125, 22, 7, '私', NULL),
(126, 22, 7, 'わたし', NULL),
(127, 22, 8, 'watashi', NULL),
(128, 24, 1, 's\'il te plaît', 0),
(190, 29, 3, '네', NULL),
(130, 24, 2, 'please', NULL),
(131, 24, 3, '제발', NULL),
(132, 24, 4, 'por favor', NULL),
(133, 24, 5, 'من فضلك', NULL),
(134, 24, 6, 'min fadlek', NULL),
(135, 24, 7, 'お願いします', NULL),
(136, 24, 8, 'Onegaishimasu', NULL),
(137, 25, 1, 'excusez-moi', 0),
(138, 26, 1, 'Comment allez-vous?', 0),
(139, 27, 1, 'Je vais bien', 0),
(140, 28, 1, 'Et toi?', 0),
(141, 29, 1, 'Oui', 0),
(142, 30, 1, 'Non', 0),
(143, 31, 1, 'Peut-être', 0),
(144, 32, 1, 'Aujourd\'hui', 0),
(145, 33, 1, 'Hier', 0),
(146, 34, 1, 'Maintenant', 0),
(147, 35, 1, 'Plus tard', 0),
(148, 36, 1, 'Matin', 0),
(149, 37, 1, 'Après-midi', 0),
(150, 38, 1, 'Soir', 0),
(151, 39, 1, 'Nuit', 0),
(152, 40, 1, 'Semaine', 0),
(153, 41, 1, 'Mois', 0),
(161, 25, 2, 'excuse me', NULL),
(165, 25, 6, 'ʿafwan', NULL),
(164, 25, 5, 'عفوا', NULL),
(163, 25, 4, 'disculpe', NULL),
(162, 25, 3, '실례합니다', NULL),
(166, 25, 7, 'すみません', NULL),
(167, 25, 8, 'sumimasen', NULL),
(168, 26, 2, 'how are you?', NULL),
(169, 26, 3, '어떻게 지내세요?', NULL),
(170, 26, 4, '¿Cómo estás?', NULL),
(171, 26, 5, 'كيف حالك؟', NULL),
(172, 26, 6, 'kayf halk?', NULL),
(173, 26, 7, 'お元気ですか？', NULL),
(174, 26, 8, 'ogenki desu ka?', NULL),
(175, 27, 2, 'I am doing well', NULL),
(176, 27, 3, '괜찮아요', NULL),
(177, 27, 4, 'Estoy bien', NULL),
(178, 27, 5, 'أنا بخير', NULL),
(179, 27, 6, 'ana bekhair', NULL),
(180, 27, 7, '元気です', NULL),
(181, 27, 8, 'genki desu', NULL),
(182, 28, 2, 'And you?', NULL),
(183, 28, 3, '그리고 당신은?', NULL),
(184, 28, 4, '¿Y tú?', NULL),
(185, 28, 5, 'وأنت؟', NULL),
(186, 28, 6, 'Wa anta?', NULL),
(187, 28, 7, 'そしてあなたは？', NULL),
(188, 28, 8, 'Soshite anata wa?', NULL),
(191, 29, 4, 'sí', NULL),
(192, 29, 5, 'نعم', NULL),
(193, 29, 6, 'nạm', NULL),
(194, 29, 7, 'はい', NULL),
(195, 29, 8, 'hai', NULL),
(196, 30, 2, 'no', NULL),
(197, 30, 3, '아니요', NULL),
(198, 30, 4, 'no', NULL),
(199, 30, 5, 'لا', NULL),
(200, 30, 6, 'la', NULL),
(201, 30, 7, 'いいえ', NULL),
(202, 30, 8, 'iie', NULL),
(216, 31, 7, 'かもしれません', NULL),
(215, 31, 6, 'rubamaan', NULL),
(214, 31, 5, 'ربما', NULL),
(213, 31, 4, 'quizá', NULL),
(212, 31, 3, '어쩌면', NULL),
(211, 31, 2, 'maybe', NULL),
(217, 31, 8, 'kamoshiremasen', NULL),
(218, 32, 2, 'today', NULL),
(219, 32, 3, '오늘', NULL),
(220, 32, 4, 'hoy', NULL),
(221, 32, 5, 'اليوم', NULL),
(222, 32, 6, 'al-yawm', NULL),
(223, 32, 7, '今日', NULL),
(224, 32, 8, 'kyou', NULL),
(225, 33, 2, 'yesterday', NULL),
(226, 33, 3, '어제', NULL),
(227, 33, 4, 'ayer', NULL),
(228, 33, 5, 'الأمس', NULL),
(229, 33, 6, 'ams', NULL),
(230, 33, 7, '昨日', NULL),
(231, 33, 8, 'kinou', NULL),
(232, 34, 2, 'now', NULL),
(233, 34, 3, '지금', NULL),
(234, 34, 4, 'ahora', NULL),
(235, 34, 5, 'الآن', NULL),
(236, 34, 6, 'al\'an', NULL),
(237, 34, 7, '今', NULL),
(238, 34, 8, 'ima', NULL),
(239, 35, 2, 'later', NULL),
(240, 35, 3, '나중에', NULL),
(241, 35, 4, 'más tarde', NULL),
(242, 35, 5, 'فيما بعد', NULL),
(243, 35, 6, 'fima ba\'d', NULL),
(244, 35, 7, '後で', NULL),
(245, 35, 8, 'ato de', NULL),
(246, 36, 2, 'morning', NULL),
(247, 36, 3, '아침', NULL),
(248, 36, 4, 'mañana', NULL),
(249, 36, 5, 'صباح', NULL),
(250, 36, 6, 'ṣabāḥ', NULL),
(251, 36, 7, 'あさ', NULL),
(252, 36, 8, 'asa', NULL),
(253, 37, 2, 'afternoon', NULL),
(254, 37, 3, '오후', NULL),
(255, 37, 4, 'tarde', NULL),
(256, 37, 5, 'بعد الظهر', NULL),
(257, 37, 6, 'baed aldhohr', NULL),
(258, 37, 7, 'ごご', NULL),
(259, 37, 8, 'gogo', NULL),
(260, 38, 2, 'evening', NULL),
(261, 38, 3, '저녁', NULL),
(262, 38, 4, 'tarde', NULL),
(263, 38, 5, 'مساء', NULL),
(264, 38, 6, 'masa', NULL),
(265, 38, 7, 'よる', NULL),
(266, 38, 8, 'yoru', NULL),
(267, 39, 2, 'night', NULL),
(268, 39, 3, '밤', NULL),
(269, 39, 4, 'noche', NULL),
(270, 39, 5, 'ليل', NULL),
(271, 39, 6, 'layl', NULL),
(272, 39, 7, 'よる', NULL),
(273, 39, 8, 'yoru', NULL),
(274, 40, 2, 'week', NULL),
(275, 40, 3, '주', NULL),
(276, 40, 4, 'semana', NULL),
(277, 40, 5, 'أسبوع', NULL),
(278, 40, 6, 'asbu', NULL),
(279, 40, 7, 'しゅうかん', NULL),
(280, 40, 8, 'shūkan', NULL),
(281, 41, 2, 'month', NULL),
(282, 41, 3, '달', NULL),
(283, 41, 4, 'mes', NULL),
(284, 41, 5, 'شهر', NULL),
(285, 41, 6, 'shahr', NULL),
(286, 41, 7, '月', NULL),
(287, 41, 8, 'tsuki', NULL);

-- --------------------------------------------------------

--
-- Structure de la table `translations_cha`
--

DROP TABLE IF EXISTS `translations_cha`;
CREATE TABLE IF NOT EXISTS `translations_cha` (
  `id` int NOT NULL AUTO_INCREMENT,
  `character_id` int DEFAULT NULL,
  `alphabet_id` int DEFAULT NULL,
  `translation_cha` varchar(255) DEFAULT NULL,
  `difficulty_level` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `character_id` (`character_id`),
  KEY `alphabet_id` (`alphabet_id`)
) ENGINE=MyISAM AUTO_INCREMENT=84 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Déchargement des données de la table `translations_cha`
--

INSERT INTO `translations_cha` (`id`, `character_id`, `alphabet_id`, `translation_cha`, `difficulty_level`) VALUES
(1, 1, 1, 'a', 0),
(2, 2, 1, 'b', 0),
(3, 1, 2, 'أ', 0),
(4, 2, 2, 'ب', 0),
(5, 1, 3, 'あ', 0),
(6, 1, 3, 'ア', 0),
(7, 2, 3, 'ぶ', 0),
(8, 2, 3, 'ブ', 0),
(10, 8, 1, 'c', 0),
(11, 7, 1, 'c', 0),
(12, 9, 1, 'd', 0),
(13, 10, 1, 'e', 0),
(15, 12, 1, 'g', 0),
(16, 13, 1, 'k', 0),
(17, 14, 1, 'ka', 0),
(18, 15, 1, 'ma', 0),
(19, 16, 1, 'sa', 0),
(20, 17, 1, 'ta', 0),
(21, 18, 1, 'na', 0),
(22, 19, 1, 'ha', 0),
(23, 20, 1, 'ya', 0),
(24, 21, 1, 'ra', 0),
(25, 22, 1, 'wa', 0),
(26, 23, 1, 'ga', 0),
(27, 24, 1, 'da', 0),
(28, 25, 1, 'ba', 0),
(29, 26, 1, 'pa', 0),
(30, 27, 1, 'ja', 0),
(31, 28, 1, 'cha', 0),
(32, 15, 2, 'ما', 0),
(33, 15, 3, 'マ', 0),
(34, 15, 4, '마', 0),
(35, 14, 3, 'カ', 0),
(36, 14, 2, 'كَ', 0),
(37, 14, 4, '가', 0),
(38, 16, 3, 'サ', 0),
(39, 16, 2, 'سا', 0),
(40, 16, 4, '사', 0),
(41, 17, 3, 'タ', 0),
(42, 17, 2, 'تا', 0),
(43, 17, 4, '타', 0),
(45, 18, 3, 'ナ', 0),
(46, 18, 2, 'نا', 0),
(47, 18, 4, '나', 0),
(48, 19, 3, 'ハ', 0),
(49, 19, 2, 'ها', 0),
(50, 19, 4, '하', 0),
(51, 20, 3, 'ヤ', 0),
(52, 20, 2, 'يا', 0),
(53, 20, 4, '야', 0),
(54, 21, 3, 'ラ', 0),
(55, 21, 2, 'را', 0),
(56, 21, 4, '라', 0),
(57, 22, 3, 'ワ', 0),
(58, 22, 2, 'وا', 0),
(59, 22, 4, '와', 0),
(60, 23, 3, 'ガ', 0),
(61, 23, 2, 'كَ', 0),
(62, 23, 4, '가', 0),
(63, 24, 3, 'ダ', 0),
(64, 24, 2, 'دَ', 0),
(65, 24, 4, '다', 0),
(66, 25, 3, 'バ', 0),
(67, 25, 2, 'بَ', 0),
(68, 25, 4, '바', 0),
(69, 26, 3, 'パ', 0),
(70, 26, 2, 'بَ', 0),
(71, 26, 4, '파', 0),
(72, 27, 2, 'جَ', 0),
(73, 27, 4, '자', 0),
(74, 27, 3, 'ジャ', 0),
(75, 28, 3, 'チャ', 0),
(76, 28, 2, 'تشا', 0),
(77, 28, 4, '차', 0),
(78, 29, 1, 'sha', 0),
(79, 29, 3, 'シャ', 0),
(80, 29, 2, 'شا', 0),
(81, 29, 4, '차', 0);

-- --------------------------------------------------------

--
-- Structure de la table `users`
--

DROP TABLE IF EXISTS `users`;
CREATE TABLE IF NOT EXISTS `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(50) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `user_email` varchar(60) DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `user_source_language` int UNSIGNED DEFAULT NULL,
  `user_target_language` int UNSIGNED DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`),
  UNIQUE KEY `user_email` (`user_email`),
  KEY `fk_user_latest_language` (`user_source_language`),
  KEY `fk_user_latest_language_two` (`user_target_language`)
) ENGINE=MyISAM AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Déchargement des données de la table `users`
--

INSERT INTO `users` (`id`, `username`, `password`, `user_email`, `created_at`, `user_source_language`, `user_target_language`) VALUES
(12, 'caramel3', '$2b$10$H1rlJnwf8mLaXpU5DiwoEuwmmoKgck1U0m36o6MaOD9Re5Uo7T2pe', 'caramel3@caramel3.caramel3', NULL, 2, 2),
(9, 'moshi9', '$2b$10$28bykMrBTVHX/8pBOWf30uqCuW7/rzyvT1zRwe8rAUEAql2Ti7JDG', 'moshimoshi2@moshi.moshi', NULL, 1, 2),
(10, 'caramel', '$2b$10$lSuKeZj0aE5/CQqhVzgZL.COXA1u2qOr3HiTz05B8J08TU0D/MJ1K', 'caramel@caramel.caramel', NULL, 1, 2),
(11, 'caramel2', '$2b$10$gJVPfxUOcHYqsXnk7E4Qmux43/hkqaNUzorwLN3hDnpY9G72PRcl.', 'caramel2@caramel2.caramel2', NULL, 1, 2),
(8, 'moshi', '$2b$10$ng1rMTxIPDC0Qa6GrW.9De2mUa5PYsJpyoOMD/tEiSvjij59rvDJ6', 'moshimoshi@moshi.moshi', NULL, 1, 2),
(13, 'cacabodin', '$2b$10$k8rr.LmZgAacH6wyeAvG8ufmil2BdXh.6EeApAzzarmtO9r0Kq5OS', 'prout@dddfd', NULL, 1, 2);

-- --------------------------------------------------------

--
-- Structure de la table `user_progress`
--

DROP TABLE IF EXISTS `user_progress`;
CREATE TABLE IF NOT EXISTS `user_progress` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int DEFAULT NULL,
  `score` float DEFAULT NULL,
  `language_id` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  KEY `word_id` (`score`),
  KEY `language_id` (`language_id`)
) ENGINE=MyISAM AUTO_INCREMENT=87 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Déchargement des données de la table `user_progress`
--

INSERT INTO `user_progress` (`id`, `user_id`, `score`, `language_id`) VALUES
(59, 10, 2, 1),
(56, 9, 100, 2),
(55, 9, 83, 1),
(51, 9, 40, 3),
(52, 9, 100, 4),
(53, 9, 100, 5),
(54, 9, 100, 6),
(60, 10, 5.5, 2),
(61, 10, 0, 3),
(62, 10, 0, 6),
(63, 10, 0, 4),
(64, 10, 0, 5),
(65, 11, 4.75, 1),
(66, 11, 52, 2),
(67, 11, 3.125, 3),
(68, 11, 30, 4),
(69, 11, 73.625, 5),
(70, 11, 1.75, 6),
(71, 12, 16.25, 1),
(72, 12, 44.625, 2),
(73, 12, 5001.88, 3),
(74, 12, 2.125, 4),
(75, 12, 0.75, 5),
(76, 12, 0, 6),
(77, 13, 2.75, 1),
(78, 13, 1.875, 2),
(79, 13, 0, 3),
(80, 13, 0.75, 4),
(81, 13, 0, 5),
(82, 13, 0, 6),
(83, 13, 0.125, 7),
(84, 13, 0, 8),
(85, 12, 0.375, 7),
(86, 12, 1.25, 8);

-- --------------------------------------------------------

--
-- Structure de la table `words`
--

DROP TABLE IF EXISTS `words`;
CREATE TABLE IF NOT EXISTS `words` (
  `id` int NOT NULL AUTO_INCREMENT,
  `language_id` int DEFAULT NULL,
  `word` varchar(255) DEFAULT NULL,
  `specialization` varchar(30) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `language_id` (`language_id`)
) ENGINE=MyISAM AUTO_INCREMENT=42 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Déchargement des données de la table `words`
--

INSERT INTO `words` (`id`, `language_id`, `word`, `specialization`) VALUES
(1, 1, 'chien', NULL),
(2, 1, 'chat', NULL),
(3, 1, 'bonjour', NULL),
(5, 1, 'merci', NULL),
(14, 1, 'fille', NULL),
(13, 1, 'garçon', NULL),
(15, 1, 'au revoir', NULL),
(16, 1, 'frère', NULL),
(17, 1, 'sœur', NULL),
(18, 1, 'fils', NULL),
(19, 1, 'demain', NULL),
(20, 1, 'manger', 'isVerb'),
(21, 1, 'boire', 'isVerb'),
(22, 1, 'moi', NULL),
(23, 1, 'donner', 'isVerb'),
(24, 1, 's\'il te plaît', NULL),
(25, 1, 'excusez-moi', NULL),
(26, 1, 'Comment allez-vous?', 'isSentence'),
(27, 1, 'Je vais bien', 'isSentence'),
(28, 1, 'Et toi?', NULL),
(29, 1, 'Oui', NULL),
(30, 1, 'Non', NULL),
(31, 1, 'Peut-être', NULL),
(32, 1, 'Aujourd\'hui', NULL),
(33, 1, 'Hier', NULL),
(34, 1, 'Maintenant', NULL),
(35, 1, 'Plus tard', NULL),
(36, 1, 'Matin', NULL),
(37, 1, 'Après-midi', NULL),
(38, 1, 'Soir', NULL),
(39, 1, 'Nuit', NULL),
(40, 1, 'Semaine', NULL),
(41, 1, 'Mois', NULL);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
