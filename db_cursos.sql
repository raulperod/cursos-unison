/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE */;
/*!40101 SET SQL_MODE='NO_ENGINE_SUBSTITUTION' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES */;
/*!40103 SET SQL_NOTES='ON' */;

DROP DATABASE IF EXISTS `cursos_unison`;

CREATE DATABASE `cursos_unison` /*!40100 DEFAULT CHARACTER SET latin1 */;

USE `cursos_unison`;

CREATE TABLE `usuarios` (
  `idUsuario` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `nombre` varchar(50) NOT NULL,
  `apellido` varchar(50) NOT NULL,
  `correo` varchar(20) NOT NULL,
  `password` varchar(255) NOT NULL,
  `expediente` varchar(20) NOT NULL,
  `codigoVerificacion` varchar(20) NOT NULL,
  `institucion` varchar(255) NOT NULL,
  `tipo` int(10) unsigned NOT NULL,
  `estado` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`idUsuario`),
  UNIQUE KEY `correo` (`correo`)

) ENGINE=InnoDB DEFAULT CHARSET=latin1;