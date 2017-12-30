'use strict'

const express = require("express"),
      InformeController = require('../controllers/informe'),
      informe = express.Router()

// cursos-unison/informe/editar-informe/:idCurso
informe
    .route("/editar-informe/:idCurso")
    .get(  InformeController.editarInformeGet )
    .post( InformeController.editarInformePost )
// cursos-unison/informe/enviar-informe/:idCurso
informe
    .route("/enviar-informe/:idCurso")
    .post( InformeController.enviarInformePost )
// cursos-unison/informe/enviar-descripcion/:idCurso
informe
    .route("/enviar-descripcion/:idCurso")
    .post( InformeController.enviarDescripcionInformePost )
// cursos-unison/informe/ver-informes/:idCurso
informe
    .route("/ver-informes")
    .get( InformeController.verInformesGet )
// cursos-unison/informe/aprobar/:idCurso
informe
    .route("/aprobar/:idCurso")
    .get( InformeController.aprobarGet )

// cursos-unison/informe/no-aprobar/:idCurso
informe
    .route("/no-aprobar/:idCurso")
    .post( InformeController.noAprobarPost )

module.exports = informe