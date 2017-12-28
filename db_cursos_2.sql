USE `cursos_unison`;

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

ALTER TABLE `cursos_usuarios_evaluacion_curso`
ADD CONSTRAINT `cursos_usuarios_evaluacion_curso_ibfk_1` FOREIGN KEY (`idCurso`) REFERENCES `cursos` (`idCurso`) ON DELETE CASCADE ON UPDATE NO ACTION;

ALTER TABLE `cursos_usuarios_evaluacion_instructor`
ADD CONSTRAINT `cursos_usuarios_evaluacion_instructor_ibfk_1` FOREIGN KEY (`idCurso`) REFERENCES `cursos` (`idCurso`) ON DELETE CASCADE ON UPDATE NO ACTION;

ALTER TABLE `cursos_usuarios_evaluacion_participantes`
ADD CONSTRAINT `cursos_usuarios_evaluacion_participantes_ibfk_1` FOREIGN KEY (`idUsuario`) REFERENCES `usuarios` (`idUsuario`) ON DELETE CASCADE ON UPDATE NO ACTION,
ADD CONSTRAINT `cursos_usuarios_evaluacion_participantes_ibfk_2` FOREIGN KEY (`idCurso`) REFERENCES `cursos` (`idCurso`) ON DELETE CASCADE ON UPDATE NO ACTION;
