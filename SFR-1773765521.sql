CREATE TABLE IF NOT EXISTS `questions` (
	`id` int AUTO_INCREMENT NOT NULL UNIQUE,
	`title` varchar(1000) NOT NULL,
	`content` text NOT NULL,
	`level_id` int NOT NULL,
	PRIMARY KEY (`id`)
);

CREATE TABLE IF NOT EXISTS `q_level` (
	`id` int AUTO_INCREMENT NOT NULL UNIQUE,
	`name` varchar(100) NOT NULL,
	PRIMARY KEY (`id`)
);

CREATE TABLE IF NOT EXISTS `language` (
	`id` int AUTO_INCREMENT NOT NULL UNIQUE,
	`name` varchar(100) NOT NULL,
	PRIMARY KEY (`id`)
);

CREATE TABLE IF NOT EXISTS `topics` (
	`id` int AUTO_INCREMENT NOT NULL UNIQUE,
	`name` varchar(100) NOT NULL,
	PRIMARY KEY (`id`)
);

CREATE TABLE IF NOT EXISTS `lang_2_question` (
	`q_id` int NOT NULL,
	`lang_id` int NOT NULL
);

CREATE TABLE IF NOT EXISTS `topic_2_question` (
	`q_id` int NOT NULL,
	`topic_id` int NOT NULL
);

