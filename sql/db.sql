-- --------------------------------------------------------
-- Host:                         127.0.0.1
-- Server version:               8.0.25 - MySQL Community Server - GPL
-- Server OS:                    Win64
-- HeidiSQL Version:             11.2.0.6213
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


-- Dumping database structure for radventure
CREATE DATABASE IF NOT EXISTS `radventure` /*!40100 DEFAULT CHARACTER SET utf8 */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `radventure`;

-- Dumping structure for table radventure.character
CREATE TABLE IF NOT EXISTS `character` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL DEFAULT 'John Doe',
  `owner_id` int NOT NULL DEFAULT '0',
  `unit_class` varchar(50) NOT NULL DEFAULT '0',
  `strength` int NOT NULL DEFAULT '0',
  `stamina` int NOT NULL DEFAULT '0',
  `intellect` int NOT NULL DEFAULT '0',
  `wisdom` int NOT NULL DEFAULT '0',
  `alacrity` int NOT NULL DEFAULT '0',
  `luck` int NOT NULL DEFAULT '0',
  `max_health` int NOT NULL DEFAULT '0',
  `max_mana` int NOT NULL DEFAULT '0',
  `health` int NOT NULL DEFAULT '0',
  `mana` int NOT NULL DEFAULT '0',
  `health_regen` int NOT NULL DEFAULT '0',
  `mana_regen` int NOT NULL DEFAULT '0',
  `armor` int NOT NULL DEFAULT '0',
  `min_damage` int NOT NULL DEFAULT '0',
  `max_damage` int NOT NULL DEFAULT '0',
  `head` int NOT NULL DEFAULT '0',
  `shoulders` int NOT NULL DEFAULT '0',
  `chest` int NOT NULL DEFAULT '0',
  `pants` int NOT NULL DEFAULT '0',
  `gloves` int NOT NULL DEFAULT '0',
  `feet` int NOT NULL DEFAULT '0',
  `ring1` int NOT NULL DEFAULT '0',
  `ring2` int NOT NULL DEFAULT '0',
  `mainhand` int NOT NULL DEFAULT '0',
  `offhand` int NOT NULL DEFAULT '0',
  `neck` int NOT NULL DEFAULT '0',
  `extra_slot0` int NOT NULL DEFAULT '0',
  `extra_slot1` int NOT NULL DEFAULT '0',
  `experience` int NOT NULL DEFAULT '0',
  `level` int NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `FK_character_player` (`owner_id`),
  CONSTRAINT `FK_character_player` FOREIGN KEY (`owner_id`) REFERENCES `player` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb3;

-- Dumping data for table radventure.character: ~0 rows (approximately)
/*!40000 ALTER TABLE `character` DISABLE KEYS */;
INSERT INTO `character` (`id`, `name`, `owner_id`, `unit_class`, `strength`, `stamina`, `intellect`, `wisdom`, `alacrity`, `luck`, `max_health`, `max_mana`, `health`, `mana`, `health_regen`, `mana_regen`, `armor`, `min_damage`, `max_damage`, `head`, `shoulders`, `chest`, `pants`, `gloves`, `feet`, `ring1`, `ring2`, `mainhand`, `offhand`, `neck`, `extra_slot0`, `extra_slot1`, `experience`, `level`) VALUES
	(1, 'fantasmo', 1, 'Knight', 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 5, 5, 10, 5, 7, 0, 0, 0, 0, 0, 0, 0, 0, 6, 0, 0, 0, 0, 0, 1);
/*!40000 ALTER TABLE `character` ENABLE KEYS */;

-- Dumping structure for table radventure.character_traits
CREATE TABLE IF NOT EXISTS `character_traits` (
  `character_id` int DEFAULT NULL,
  `trait_id` int DEFAULT NULL,
  KEY `FK_character_traits_character` (`character_id`),
  CONSTRAINT `FK_character_traits_character` FOREIGN KEY (`character_id`) REFERENCES `character` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

-- Dumping data for table radventure.character_traits: ~0 rows (approximately)
/*!40000 ALTER TABLE `character_traits` DISABLE KEYS */;
/*!40000 ALTER TABLE `character_traits` ENABLE KEYS */;

-- Dumping structure for table radventure.enchant_base
CREATE TABLE IF NOT EXISTS `enchant_base` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(50) DEFAULT NULL,
  `isPrefix` bit(1) DEFAULT NULL,
  `effect_class` varchar(50) DEFAULT NULL,
  `identifier` varchar(50) DEFAULT NULL,
  `type` varchar(50) DEFAULT NULL,
  `amt_min` varchar(50) DEFAULT NULL,
  `amt_max` varchar(50) DEFAULT NULL,
  `level` int DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb3;

-- Dumping data for table radventure.enchant_base: ~2 rows (approximately)
/*!40000 ALTER TABLE `enchant_base` DISABLE KEYS */;
INSERT INTO `enchant_base` (`id`, `name`, `isPrefix`, `effect_class`, `identifier`, `type`, `amt_min`, `amt_max`, `level`) VALUES
	(1, 'of Striking', b'1', 'statEffect', 'weapon_damage', 'flat', NULL, '3', NULL),
	(2, 'of the Leech', b'1', 'statEffect', 'life_on_hit', 'flat', NULL, '3', NULL);
/*!40000 ALTER TABLE `enchant_base` ENABLE KEYS */;

-- Dumping structure for table radventure.enchant_instances
CREATE TABLE IF NOT EXISTS `enchant_instances` (
  `enchant_key` int DEFAULT NULL,
  `enchant_base_id` int DEFAULT NULL,
  KEY `enchant_key` (`enchant_key`),
  KEY `enchant_base_id` (`enchant_base_id`),
  CONSTRAINT `FK_enchant_instances_enchant_base` FOREIGN KEY (`enchant_base_id`) REFERENCES `enchant_base` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

-- Dumping data for table radventure.enchant_instances: ~0 rows (approximately)
/*!40000 ALTER TABLE `enchant_instances` DISABLE KEYS */;
INSERT INTO `enchant_instances` (`enchant_key`, `enchant_base_id`) VALUES
	(1, 1),
	(1, 2);
/*!40000 ALTER TABLE `enchant_instances` ENABLE KEYS */;

-- Dumping structure for table radventure.enemies
CREATE TABLE IF NOT EXISTS `enemies` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL DEFAULT '0',
  `level` int NOT NULL DEFAULT '0',
  `health` int NOT NULL DEFAULT '0',
  `mana` int NOT NULL DEFAULT '0',
  `min_dmg` int NOT NULL DEFAULT '0',
  `max_dmg` int NOT NULL DEFAULT '0',
  `armor` int NOT NULL DEFAULT '0',
  `spell_resistance` int NOT NULL DEFAULT '0',
  `dodge` int NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb3;

-- Dumping data for table radventure.enemies: ~0 rows (approximately)
/*!40000 ALTER TABLE `enemies` DISABLE KEYS */;
INSERT INTO `enemies` (`id`, `name`, `level`, `health`, `mana`, `min_dmg`, `max_dmg`, `armor`, `spell_resistance`, `dodge`) VALUES
	(1, 'Moblin', 1, 10, 0, 1, 2, 5, 0, 0);
/*!40000 ALTER TABLE `enemies` ENABLE KEYS */;

-- Dumping structure for table radventure.enemy_drop_table
CREATE TABLE IF NOT EXISTS `enemy_drop_table` (
  `enemy_id` int DEFAULT NULL,
  `item_base_id` int DEFAULT NULL,
  `chance` int DEFAULT NULL,
  `amt_min` int DEFAULT NULL,
  `amt_max` int DEFAULT NULL,
  KEY `enemy_id` (`enemy_id`),
  KEY `item_base_id` (`item_base_id`),
  CONSTRAINT `FK_enemy_drop_table_enemies` FOREIGN KEY (`enemy_id`) REFERENCES `enemies` (`id`),
  CONSTRAINT `FK_enemy_drop_table_item_base` FOREIGN KEY (`item_base_id`) REFERENCES `item_base` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

-- Dumping data for table radventure.enemy_drop_table: ~0 rows (approximately)
/*!40000 ALTER TABLE `enemy_drop_table` DISABLE KEYS */;
INSERT INTO `enemy_drop_table` (`enemy_id`, `item_base_id`, `chance`, `amt_min`, `amt_max`) VALUES
	(1, 2, 75, 1, 2);
/*!40000 ALTER TABLE `enemy_drop_table` ENABLE KEYS */;

-- Dumping structure for table radventure.item_base
CREATE TABLE IF NOT EXISTS `item_base` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL DEFAULT '0',
  `type` varchar(50) NOT NULL DEFAULT '0',
  `subtype` varchar(50) NOT NULL DEFAULT '0',
  `slot` varchar(50) NOT NULL DEFAULT '0',
  `level` int NOT NULL DEFAULT '0',
  `armor` int NOT NULL DEFAULT '0',
  `min_dmg` int NOT NULL DEFAULT '0',
  `max_dmg` int NOT NULL DEFAULT '0',
  `enchant0` int NOT NULL DEFAULT '0',
  `enchant1` int NOT NULL DEFAULT '0',
  `enchant2` int NOT NULL DEFAULT '0',
  `stack_amount` int DEFAULT '1',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb3;

-- Dumping data for table radventure.item_base: ~2 rows (approximately)
/*!40000 ALTER TABLE `item_base` DISABLE KEYS */;
INSERT INTO `item_base` (`id`, `name`, `type`, `subtype`, `slot`, `level`, `armor`, `min_dmg`, `max_dmg`, `enchant0`, `enchant1`, `enchant2`, `stack_amount`) VALUES
	(1, 'Worn Shortsword', 'one_handed', 'sword', 'one_hand', 1, 0, 3, 5, 0, 0, 0, 1),
	(2, 'Moblin Eye', 'misc', 'none', 'none', 0, 0, 0, 0, 0, 0, 0, 20);
/*!40000 ALTER TABLE `item_base` ENABLE KEYS */;

-- Dumping structure for table radventure.item_instances
CREATE TABLE IF NOT EXISTS `item_instances` (
  `id` int NOT NULL AUTO_INCREMENT,
  `base_id` int DEFAULT '0',
  `enchant_key` int DEFAULT NULL,
  `owner_id` int DEFAULT '0',
  `amount` int DEFAULT '0',
  `isInBank` bit(1) DEFAULT b'0',
  PRIMARY KEY (`id`),
  KEY `FK_item_instances_player` (`owner_id`),
  KEY `base_id` (`base_id`),
  KEY `enchant_key` (`enchant_key`),
  CONSTRAINT `FK_item_instances_enchant_instances` FOREIGN KEY (`enchant_key`) REFERENCES `enchant_instances` (`enchant_key`),
  CONSTRAINT `FK_item_instances_player` FOREIGN KEY (`owner_id`) REFERENCES `player` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb3;

-- Dumping data for table radventure.item_instances: ~0 rows (approximately)
/*!40000 ALTER TABLE `item_instances` DISABLE KEYS */;
INSERT INTO `item_instances` (`id`, `base_id`, `enchant_key`, `owner_id`, `amount`, `isInBank`) VALUES
	(5, 2, NULL, 1, 3, b'0'),
	(6, 1, 1, 1, 1, b'0');
/*!40000 ALTER TABLE `item_instances` ENABLE KEYS */;

-- Dumping structure for table radventure.maps
CREATE TABLE IF NOT EXISTS `maps` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb3;

-- Dumping data for table radventure.maps: ~0 rows (approximately)
/*!40000 ALTER TABLE `maps` DISABLE KEYS */;
INSERT INTO `maps` (`id`, `name`) VALUES
	(1, 'spawn'),
	(2, 'gm_land');
/*!40000 ALTER TABLE `maps` ENABLE KEYS */;

-- Dumping structure for table radventure.map_spawns
CREATE TABLE IF NOT EXISTS `map_spawns` (
  `map_id` int DEFAULT NULL,
  `enemy_id` int DEFAULT NULL,
  `weight` int DEFAULT NULL,
  KEY `enemy_id` (`enemy_id`),
  CONSTRAINT `FK_map_spawns_enemies` FOREIGN KEY (`enemy_id`) REFERENCES `enemies` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

-- Dumping data for table radventure.map_spawns: ~0 rows (approximately)
/*!40000 ALTER TABLE `map_spawns` DISABLE KEYS */;
/*!40000 ALTER TABLE `map_spawns` ENABLE KEYS */;

-- Dumping structure for table radventure.player
CREATE TABLE IF NOT EXISTS `player` (
  `id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(50) DEFAULT NULL,
  `password` varchar(50) DEFAULT NULL,
  `email` varchar(50) DEFAULT NULL,
  `gold` varchar(50) DEFAULT NULL,
  `character0` int DEFAULT NULL,
  `character1` int DEFAULT NULL,
  `character2` int DEFAULT NULL,
  `character3` int DEFAULT NULL,
  `character4` int DEFAULT NULL,
  `map_id` int DEFAULT NULL,
  `x` int DEFAULT NULL,
  `y` int DEFAULT NULL,
  `acl_level` int DEFAULT '0' COMMENT '0 = f2p, 1 = vip, 2 = mod, 3 = gm, 4 = admin',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb3;

-- Dumping data for table radventure.player: ~1 rows (approximately)
/*!40000 ALTER TABLE `player` DISABLE KEYS */;
INSERT INTO `player` (`id`, `username`, `password`, `email`, `gold`, `character0`, `character1`, `character2`, `character3`, `character4`, `map_id`, `x`, `y`, `acl_level`) VALUES
	(1, 'test', 'test', 'test@test.test', '99999999', 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0);
/*!40000 ALTER TABLE `player` ENABLE KEYS */;

/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
