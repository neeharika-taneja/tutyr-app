



-- ---
-- Globals
-- ---

-- SET SQL_MODE="NO_AUTO_VALUE_ON_ZERO";
-- SET FOREIGN_KEY_CHECKS=0;

-- ---
-- Table 'users'
-- 
-- ---

DROP TABLE IF EXISTS `users`;
		
CREATE TABLE `users` (
  `id` INTEGER NULL AUTO_INCREMENT DEFAULT NULL,
  `facebook_id` CHAR NULL DEFAULT NULL,
  `email` VARCHAR NULL DEFAULT NULL,
  `realname` VARCHAR NULL DEFAULT NULL,
  `profileimage` BLOB NULL DEFAULT NULL,
  `registration_date` TIMESTAMP NULL DEFAULT NULL,
  `is_tutor` INTEGER NULL DEFAULT NULL,
  `tutor_mode` INTEGER NULL DEFAULT NULL,
  `bio1` MEDIUMTEXT NULL DEFAULT NULL,
  `bio2` MEDIUMTEXT NULL DEFAULT NULL,
  `bio3` MEDIUMTEXT NULL DEFAULT NULL,
  `rating` INTEGER NULL DEFAULT NULL,
  `location` MEDIUMTEXT NULL DEFAULT NULL,
  `hourlyrate` DECIMAL NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
);

-- ---
-- Table 'tutor_requests'
-- 
-- ---

DROP TABLE IF EXISTS `tutor_requests`;
		
CREATE TABLE `tutor_requests` (
  `id` INTEGER NULL AUTO_INCREMENT DEFAULT NULL,
  `requesting_user` INTEGER NULL DEFAULT NULL,
  `requested_user` INTEGER NULL DEFAULT NULL,
  `requesting_user_comments` MEDIUMTEXT NULL DEFAULT NULL,
  `status` INTEGER NULL DEFAULT NULL,
  `request_time` TIMESTAMP NULL DEFAULT NULL,
  `sessionstart_time` TIMESTAMP NULL DEFAULT NULL,
  `sessionend_time` INTEGER NULL DEFAULT NULL,
  `session_rating` INTEGER NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
);

-- ---
-- Table 'subjects'
-- 
-- ---

DROP TABLE IF EXISTS `subjects`;
		
CREATE TABLE `subjects` (
  `id` INTEGER NULL AUTO_INCREMENT DEFAULT NULL,
  `name` VARCHAR NULL DEFAULT NULL,
  `description` MEDIUMTEXT NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
);

-- ---
-- Foreign Keys 
-- ---


-- ---
-- Table Properties
-- ---

-- ALTER TABLE `users` ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;
-- ALTER TABLE `tutor_requests` ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;
-- ALTER TABLE `subjects` ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

-- ---
-- Test Data
-- ---

-- INSERT INTO `users` (`id`,`facebook_id`,`email`,`realname`,`profileimage`,`registration_date`,`is_tutor`,`tutor_mode`,`bio1`,`bio2`,`bio3`,`rating`,`location`,`hourlyrate`) VALUES
-- ('','','','','','','','','','','','','','');
-- INSERT INTO `tutor_requests` (`id`,`requesting_user`,`requested_user`,`requesting_user_comments`,`status`,`request_time`,`sessionstart_time`,`sessionend_time`,`session_rating`) VALUES
-- ('','','','','','','','','');
-- INSERT INTO `subjects` (`id`,`name`,`description`) VALUES
-- ('','','');

