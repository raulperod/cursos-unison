'use strict'

const express = require("express"),
      CursoController = require('../controllers/curso'),
      curso = express.Router()

// cursos-unison/curso/inscribirse/:idCurso
curso
    .route("/inscribirse/:idCurso")
    .get(  CursoController.inscribirseGet )
    .post( CursoController.inscribirsePost )
// cursos-unison/curso/inscribirse/:idCurso
curso
    .route("/cancelar/:idCurso")
    .post( CursoController.cancelarPost )
// cursos-unison/curso/asistencia/:idCurso
curso
    .route("/asistencia/:idCurso")
    .get( CursoController.asistenciaGet )
// cursos-unison/curso/asistencia/:idCurso/:idUsuario
curso
    .route("/asistencia/:idCurso/:idUsuario")
    .post( CursoController.asistenciaPost )
// cursos-unison/curso/evaluacion-curso/:idCurso
curso
    .route("/evaluacion-curso/:idCurso")
    .get(  CursoController.evaluacionCursoGet )
    .post( CursoController.evaluacionCursoPost )
// cursos-unison/curso/evaluacion-curso/:idCurso
curso
    .route("/evaluacion-instructor/:idCurso")
    .get(  CursoController.evaluacionInstructorGet )
    .post( CursoController.evaluacionInstructorPost )
// cursos-unison/curso/evaluacion-participantes/:idCurso
curso
    .route("/evaluacion-participantes/:idCurso")
    .get(  CursoController.evaluacionParticipantesGet )
// cursos-unison/curso/evaluacion-participantes/:idCurso/:idUsuario
curso
    .route("/evaluacion-participantes/:idCurso/:idUsuario")
    .post( CursoController.evaluacionParticipantesPost )
// cursos-unison/curso/enviar-aprobados/:idCurso
curso
    .route("/enviar-aprobados/:idCurso")
    .post( CursoController.enviarAprobadosPost )

module.exports = curso