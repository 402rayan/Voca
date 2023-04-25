-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Hôte : 127.0.0.1:3306
-- Généré le : mar. 25 avr. 2023 à 14:59
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
-- Structure de la table `languages`
--

DROP TABLE IF EXISTS `languages`;
CREATE TABLE IF NOT EXISTS `languages` (
  `id` int NOT NULL AUTO_INCREMENT,
  `language_name` varchar(60) DEFAULT NULL,
  `language_code` varchar(10) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `language_name` (`language_name`)
) ENGINE=MyISAM AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Déchargement des données de la table `languages`
--

INSERT INTO `languages` (`id`, `language_name`, `language_code`) VALUES
(1, 'français', 'fr'),
(2, 'english', 'gb'),
(3, '한국어', 'kr'),
(4, 'español', 'es'),
(5, 'العربية', 'sa'),
(6, 'arabe', 'sa');

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
) ENGINE=MyISAM AUTO_INCREMENT=33 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

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
(32, 13, 2, 'boy', 0);

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
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`),
  UNIQUE KEY `user_email` (`user_email`)
) ENGINE=MyISAM AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Déchargement des données de la table `users`
--

INSERT INTO `users` (`id`, `username`, `password`, `user_email`, `created_at`) VALUES
(1, 'rayan', 'rayan', 'hamadacherayan2@gmail.com', NULL),
(3, 'rayan213', 'cacaboudin', 'cacaboudin@gmail.com', NULL),
(4, 'rayanito', 'rayanito', 'rayanito@gmail.com', NULL),
(5, 'gims', '$2b$10$S8VCZRvo77gWMYKSPVOPw.QHAMsRbi8wMpOZtxtilLYoqcBnrxWX2', 'gimsgims@gmail.com', NULL),
(6, 'miaousse213', '$2b$10$ozLIRKizZMWbMQXsqT9bDeQexormI8fUUDtBWwGxTrm.opd1EnIoe', 'miaousse213@miaousse213.com', NULL),
(7, 'moshimoshi', '$2b$10$zkL8GL/rqxoYVMleXtnTz.pE6i8F.DoHUEjPRuipaDX.6caUYi4DO', 'moshimoshi@moshimoshi.com', NULL);

-- --------------------------------------------------------

--
-- Structure de la table `user_progress`
--

DROP TABLE IF EXISTS `user_progress`;
CREATE TABLE IF NOT EXISTS `user_progress` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int DEFAULT NULL,
  `word_id` int DEFAULT NULL,
  `language_id` int DEFAULT NULL,
  `correct_attempts` int DEFAULT NULL,
  `wrong_attempts` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  KEY `word_id` (`word_id`),
  KEY `language_id` (`language_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Structure de la table `words`
--

DROP TABLE IF EXISTS `words`;
CREATE TABLE IF NOT EXISTS `words` (
  `id` int NOT NULL AUTO_INCREMENT,
  `language_id` int DEFAULT NULL,
  `word` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `language_id` (`language_id`)
) ENGINE=MyISAM AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Déchargement des données de la table `words`
--

INSERT INTO `words` (`id`, `language_id`, `word`) VALUES
(1, 1, 'chien'),
(2, 1, 'chat'),
(3, 1, 'bonjour'),
(5, 1, 'merci'),
(14, 1, 'fille'),
(13, 1, 'garçon');
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
