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
  `correo` varchar(50) NOT NULL,
  `password` varchar(255) NOT NULL,
  `expediente` varchar(50) NOT NULL,
  `codigoVerificacion` varchar(20) NOT NULL,
  `institucion` varchar(255) NOT NULL,
  `tipo` int(10) unsigned NOT NULL,
  `estado` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`idUsuario`),
  UNIQUE KEY `correo` (`correo`)

) ENGINE=InnoDB DEFAULT CHARSET=latin1;

CREATE TABLE `cursos` (
  `idCurso` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `nombre` varchar(255) NULL,
  `division` varchar(50) NOT NULL DEFAULT 'División de Ciencias Exactas y Naturales',
  `departamento` varchar(50) NULL,
  `caracter` varchar(80) NULL,
  `objetivoGeneral` TEXT NULL,
  `objetivosEspecificos` TEXT NULL,
  `contenidoSintetico` TEXT NULL,
  `formaEnsenanza` TEXT NULL,
  `requisitosDeEvaluacion` TEXT NULL,
  `bibliografia` TEXT NULL,
  `perfilAcademico` TEXT NULL,
  `capacidadAutoFin` TEXT NULL,
  `utilidad` TEXT NULL,
  `antecedentesAlumnos` TEXT NULL,
  `duracion` int(10) unsigned,
  `cupoMaximo` int(10) unsigned NULL,
  `cupoMinimo` int(10) unsigned NULL,
  `numeroDeParticipantes` int(10) unsigned NULL,
  `reqIdioma` varchar(70) NULL,
  `infraestructuraNecesaria` TEXT NULL,
  `cargoInstructor` TEXT NULL,
  `dependencia` varchar(50) NULL,
  `telefono` varchar(20) NULL,
  `fechaInicio` date NULL,
  `fechaFinal` date NULL,
  `estado` int(10) unsigned NOT NULL DEFAULT '1',
  PRIMARY KEY (`idCurso`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

CREATE TABLE `informes_de_cursos`(
  `idCurso` int(10) unsigned NOT NULL,
  `nivelAutoFin` TEXT NULL,
  `participantes` int(10) unsigned NULL,
  `participantesAprobados` int(10) unsigned NULL,
  `cumplimientoObjetivos` TEXT NULL,
  `institucionesParticipantes` TEXT NULL,
  `evaluacionPromedioParticipantes` TEXT NULL,
  `nivelVinculacion` TEXT NULL, 
  KEY `idCurso` (`idCurso`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

CREATE TABLE `cursos_usuarios` (
  `idUsuario` int(10) unsigned NOT NULL,
  `idCurso` int(10) unsigned NOT NULL,
  `tipo` int(10) unsigned NOT NULL,
  KEY `idUsuario` (`idUsuario`),
  KEY `idCurso` (`idCurso`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

CREATE TABLE `cursos_usuarios_asistencia` (
  `idUsuario` int(10) unsigned NOT NULL,
  `idCurso` int(10) unsigned NOT NULL,
  `fecha` date NULL,
  `asistio` tinyint(1) NOT NULL DEFAULT '0',
  KEY `idUsuario` (`idUsuario`),
  KEY `idCurso` (`idCurso`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

CREATE TABLE `cursos_usuarios_evaluacion_curso` (
  `idCurso` int(10) unsigned NOT NULL,
  `expectativas` int(3) unsigned NOT NULL,
  `pertinencia` int(3) unsigned NOT NULL,
  `topicos` int(3) unsigned NOT NULL,
  `tiempos` int(3) unsigned NOT NULL,
  `objetivos` int(3) unsigned NOT NULL,
  `materiales` int(3) unsigned NOT NULL,
  `aplicacion` int(3) unsigned NOT NULL,
  `medios` int(3) unsigned NOT NULL,
  `informacion` int(3) unsigned NOT NULL,
  `programa` int(3) unsigned NOT NULL,
  `sugerencias` TEXT NULL,
  KEY `idCurso` (`idCurso`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

CREATE TABLE `cursos_usuarios_evaluacion_instructor` (
  `idCurso` int(10) unsigned NOT NULL,
  `dominio` int(3) unsigned NOT NULL,
  `presentacionDeConceptos` int(3) unsigned NOT NULL,
  `interaccionYmotivacion` int(3) unsigned NOT NULL,
  `usoDeRecursosDidacticos` int(3) unsigned NOT NULL,
  `comunicacionConElGrupo` int(3) unsigned NOT NULL,
  `tutoria` int(3) unsigned NOT NULL,
  `laExtensionDeLaInformacion` int(3) unsigned NOT NULL,
  `estrategias` int(3) unsigned NOT NULL,
  `desempeno` int(3) unsigned NOT NULL,
  `sugerencias` TEXT NULL,
  KEY `idCurso` (`idCurso`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

CREATE TABLE `cursos_usuarios_evaluacion_participantes` (
  `idUsuario` int(10) unsigned NOT NULL,
  `idCurso` int(10) unsigned NOT NULL,
  `aprobo` tinyint(1) NOT NULL DEFAULT '0',
  `calificado` tinyint(1) NOT NULL DEFAULT '0',
  `evaluacion_curso` tinyint(1) NOT NULL DEFAULT '0',
  `evaluacion_instructor` tinyint(1) NOT NULL DEFAULT '0',
  KEY `idUsuario` (`idUsuario`),
  KEY `idCurso` (`idCurso`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

ALTER TABLE `informes_de_cursos`
ADD CONSTRAINT `informes_de_cursos_ibfk_1` FOREIGN KEY (`idCurso`) REFERENCES `cursos` (`idCurso`) ON DELETE CASCADE ON UPDATE NO ACTION;

ALTER TABLE `cursos_usuarios`
ADD CONSTRAINT `cursos_usuarios_ibfk_1` FOREIGN KEY (`idUsuario`) REFERENCES `usuarios` (`idUsuario`) ON DELETE CASCADE ON UPDATE NO ACTION,
ADD CONSTRAINT `cursos_usuarios_ibfk_2` FOREIGN KEY (`idCurso`) REFERENCES `cursos` (`idCurso`) ON DELETE CASCADE ON UPDATE NO ACTION;

ALTER TABLE `cursos_usuarios_asistencia`
ADD CONSTRAINT `cursos_usuarios_asistencia_ibfk_1` FOREIGN KEY (`idUsuario`) REFERENCES `usuarios` (`idUsuario`) ON DELETE CASCADE ON UPDATE NO ACTION,
ADD CONSTRAINT `cursos_usuarios_asistencia_ibfk_2` FOREIGN KEY (`idCurso`) REFERENCES `cursos` (`idCurso`) ON DELETE CASCADE ON UPDATE NO ACTION;

ALTER TABLE `cursos_usuarios_evaluacion_curso`
ADD CONSTRAINT `cursos_usuarios_evaluacion_curso_ibfk_1` FOREIGN KEY (`idCurso`) REFERENCES `cursos` (`idCurso`) ON DELETE CASCADE ON UPDATE NO ACTION;

ALTER TABLE `cursos_usuarios_evaluacion_instructor`
ADD CONSTRAINT `cursos_usuarios_evaluacion_instructor_ibfk_1` FOREIGN KEY (`idCurso`) REFERENCES `cursos` (`idCurso`) ON DELETE CASCADE ON UPDATE NO ACTION;

ALTER TABLE `cursos_usuarios_evaluacion_participantes`
ADD CONSTRAINT `cursos_usuarios_evaluacion_participantes_ibfk_1` FOREIGN KEY (`idUsuario`) REFERENCES `usuarios` (`idUsuario`) ON DELETE CASCADE ON UPDATE NO ACTION,
ADD CONSTRAINT `cursos_usuarios_evaluacion_participantes_ibfk_2` FOREIGN KEY (`idCurso`) REFERENCES `cursos` (`idCurso`) ON DELETE CASCADE ON UPDATE NO ACTION;
