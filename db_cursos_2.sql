USE `cursos_unison`;

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

ALTER TABLE `informes_de_cursos`
ADD CONSTRAINT `informes_de_cursos_ibfk_1` FOREIGN KEY (`idCurso`) REFERENCES `cursos` (`idCurso`) ON DELETE CASCADE ON UPDATE NO ACTION;
