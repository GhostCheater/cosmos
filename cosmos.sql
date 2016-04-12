-- phpMyAdmin SQL Dump
-- version 4.1.4
-- http://www.phpmyadmin.net
--
-- Client :  127.0.0.1
-- Généré le :  Mar 12 Avril 2016 à 16:13
-- Version du serveur :  5.6.15-log
-- Version de PHP :  5.4.24

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- Base de données :  `cosmos`
--

-- --------------------------------------------------------

--
-- Structure de la table `elements`
--

CREATE TABLE IF NOT EXISTS `elements` (
  `id` int(16) NOT NULL AUTO_INCREMENT,
  `name` varchar(64) COLLATE utf8_bin NOT NULL,
  `hash` varchar(64) COLLATE utf8_bin NOT NULL,
  `user` varchar(64) COLLATE utf8_bin NOT NULL,
  `type` varchar(8) COLLATE utf8_bin NOT NULL,
  `extension` varchar(16) COLLATE utf8_bin NOT NULL,
  `location` text COLLATE utf8_bin NOT NULL,
  `date` date NOT NULL,
  `lastDate` date NOT NULL,
  `favorite` tinyint(1) NOT NULL DEFAULT '0',
  `private` tinyint(1) NOT NULL DEFAULT '1',
  `count` int(16) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  UNIQUE KEY `hash` (`hash`)
) ENGINE=MyISAM  DEFAULT CHARSET=utf8 COLLATE=utf8_bin AUTO_INCREMENT=29 ;

--
-- Contenu de la table `elements`
--

INSERT INTO `elements` (`id`, `name`, `hash`, `user`, `type`, `extension`, `location`, `date`, `lastDate`, `favorite`, `private`, `count`) VALUES
(24, 'test', '65de99f0590c3407f34e2d938e363810856ecfabe09f9891b9f484b494e81a1b', '0a041b9462caa4a31bac3567e0b6e6fd9100787db2ab433d96f6d178cabfce90', 'doc', 'doc', '/', '2016-04-12', '2016-04-12', 0, 1, 0),
(23, 'app', 'd3f37f9cab5c5f085434f89df6d3c6273b7756a91c06c9104a84176517682a2e', '0a041b9462caa4a31bac3567e0b6e6fd9100787db2ab433d96f6d178cabfce90', 'code', 'html', '/', '2016-04-12', '2016-04-12', 0, 1, 0),
(22, 'test', '2cefc350b25db9dbc27f5aa6587aabaa022ea7b8f48b9b072c8cd68ed1f9e68a', '0a041b9462caa4a31bac3567e0b6e6fd9100787db2ab433d96f6d178cabfce90', 'archive', 'zip', '/', '2016-04-12', '2016-04-12', 0, 1, 0),
(7, 'test', 'ed9dc83510b54faea906871803f24afb377e3bee55235c88c7f1f1f60a333491', '0a041b9462caa4a31bac3567e0b6e6fd9100787db2ab433d96f6d178cabfce90', 'folder', '', '/', '2016-04-03', '2016-04-03', 0, 1, 0),
(21, 'test', 'c57c5e412eca9f49ea85824aae6dcf680e2ea48efd9e254e82eef3b2d42eddc3', '0a041b9462caa4a31bac3567e0b6e6fd9100787db2ab433d96f6d178cabfce90', 'doc', 'doc', '/test/test/', '2016-04-12', '2016-04-12', 0, 1, 0),
(20, 'test', '45a5ee72ba5d0d01257d1d6f4eca89836a19d056879246e06e92f2e7cfa896a6', '0a041b9462caa4a31bac3567e0b6e6fd9100787db2ab433d96f6d178cabfce90', 'folder', '', '/test/', '2016-04-12', '2016-04-12', 0, 1, 0),
(19, 'test', 'dd08dc9b7613c023e87f590f2fec3f5ad1ab43109f9e1acb91102e5d58abcd66', '0a041b9462caa4a31bac3567e0b6e6fd9100787db2ab433d96f6d178cabfce90', 'text', 'txt', '/test/', '2016-04-12', '2016-04-12', 0, 1, 0),
(18, 'test2', '5bf113736959dcd40b9fbc7fef631e80eb4c524d2cfcd0ca50ea8343c1b8b3d0', '0a041b9462caa4a31bac3567e0b6e6fd9100787db2ab433d96f6d178cabfce90', 'folder', '', '/', '2016-04-12', '2016-04-12', 0, 1, 0),
(17, 'test', '010c787c78aa901dac1c0eacf2efb934f9852d78bfe09d14199fceb13fbbb212', '0a041b9462caa4a31bac3567e0b6e6fd9100787db2ab433d96f6d178cabfce90', 'code', 'css', '/', '2016-04-11', '2016-04-11', 0, 1, 0),
(16, 'coucou', 'fb5a735863081a95cdaca94f8a6fb084a9a322731c705ec0bf7f5428082151e1', '0a041b9462caa4a31bac3567e0b6e6fd9100787db2ab433d96f6d178cabfce90', 'code', 'cpp', '/', '2016-04-11', '2016-04-11', 0, 1, 0),
(15, 'test', '3b6c20036d6623bedcff79902989d1c4d85cf4f991e327d5e857c2bf5ac5d63f', '0a041b9462caa4a31bac3567e0b6e6fd9100787db2ab433d96f6d178cabfce90', 'text', 'txt', '/', '2016-04-11', '2016-04-11', 0, 1, 0),
(25, 'test', '1e07208a86a1ef52bab36156ea53bfdc0e7e8368c6225f3c8ba24313ff78c906', '0a041b9462caa4a31bac3567e0b6e6fd9100787db2ab433d96f6d178cabfce90', 'image', 'png', '/', '2016-04-12', '2016-04-12', 0, 1, 0),
(26, 'test', '3c9f64c25a1ad0613a0c699eeaeb8601b26fb5e53e0eabfbe4ac9e8bfe7adb84', '0a041b9462caa4a31bac3567e0b6e6fd9100787db2ab433d96f6d178cabfce90', 'video', 'mp4', '/', '2016-04-12', '2016-04-12', 0, 1, 0),
(27, 'test', '4063c743e5feffeec0f7e4acd6102be0741c2bb0c2e2d0f2cdc270e4a29a6e1c', '0a041b9462caa4a31bac3567e0b6e6fd9100787db2ab433d96f6d178cabfce90', 'pdf', 'pdf', '/', '2016-04-12', '2016-04-12', 0, 1, 0),
(28, 'test3', 'efdd41f682679c224e38789a5eb26f7eb86cc26cd8b6f2dcf62de3ab4463e524', '0a041b9462caa4a31bac3567e0b6e6fd9100787db2ab433d96f6d178cabfce90', 'folder', '', '/', '2016-04-12', '2016-04-12', 0, 1, 0);

-- --------------------------------------------------------

--
-- Structure de la table `session`
--

CREATE TABLE IF NOT EXISTS `session` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(32) COLLATE utf8_bin NOT NULL,
  `token` varchar(128) COLLATE utf8_bin NOT NULL,
  `user` varchar(64) COLLATE utf8_bin NOT NULL,
  `ip` varchar(32) COLLATE utf8_bin NOT NULL,
  `time` int(16) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM  DEFAULT CHARSET=utf8 COLLATE=utf8_bin AUTO_INCREMENT=2 ;

--
-- Contenu de la table `session`
--

INSERT INTO `session` (`id`, `name`, `token`, `user`, `ip`, `time`) VALUES
(1, 'Romain', 'd9e6762dd1c8eaf6d61b3c6192fc408d4d6d5f1176d0c29169bc24e71c3f274ad27fcd5811b313d681f7e55ec02d73d499c95455b6b5bb503acf574fba8ffe85', '0a041b9462caa4a31bac3567e0b6e6fd9100787db2ab433d96f6d178cabfce90', '127.0.0.1', 1457690825);

-- --------------------------------------------------------

--
-- Structure de la table `users`
--

CREATE TABLE IF NOT EXISTS `users` (
  `id` int(16) NOT NULL AUTO_INCREMENT,
  `hash` varchar(64) COLLATE utf8_bin NOT NULL,
  `name` varchar(32) COLLATE utf8_bin NOT NULL,
  `mail` varchar(64) COLLATE utf8_bin NOT NULL,
  `mdp_login` varchar(128) COLLATE utf8_bin NOT NULL,
  `mdp_decrypt` varchar(128) COLLATE utf8_bin NOT NULL,
  `creation_date` date NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `hash` (`hash`)
) ENGINE=MyISAM  DEFAULT CHARSET=utf8 COLLATE=utf8_bin AUTO_INCREMENT=2 ;

--
-- Contenu de la table `users`
--

INSERT INTO `users` (`id`, `hash`, `name`, `mail`, `mdp_login`, `mdp_decrypt`, `creation_date`) VALUES
(1, '0a041b9462caa4a31bac3567e0b6e6fd9100787db2ab433d96f6d178cabfce90', 'Romain', 'romain.claveau@protonmail.ch', 'e05af1399f4f4beb7934c9f12ba5a9c88f7ee1e8ef3fe7a167be4b979c515d24102ad90d3a0754d48fc5930f6369a3087e686e9732ef3460e6439a95089b4800', 'e05af1399f4f4beb7934c9f12ba5a9c88f7ee1e8ef3fe7a167be4b979c515d24102ad90d3a0754d48fc5930f6369a3087e686e9732ef3460e6439a95089b4800', '2016-03-17');

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
