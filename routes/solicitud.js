'use strict'

const express = require("express"),
      SolicitudController = require('../controllers/solicitud'),
      solicitud = express.Router()

// cursos-unison/solicitud/crear-solicitud
solicitud
    .route("/crear-solicitud")
    .get(  SolicitudController.crearSolicitudGet )
    .post( SolicitudController.crearSolicitudPost )

// cursos-unison/solicitud/editar-registro/:idCurso
solicitud
    .route("/editar-registro/:idCurso")
    .get(  SolicitudController.editarRegistroGet )
    .post( SolicitudController.editarRegistroPost )

// cursos-unison/solicitud/cancelar-registro/:idCurso
solicitud
    .route("/cancelar-registro/:idCurso")
    .get(  SolicitudController.cancelarRegistroGet )

// cursos-unison/solicitud/enviar-registro/:idCurso
solicitud
    .route("/enviar-registro/:idCurso")
    .post( SolicitudController.enviarRegistroPost )

// cursos-unison/solicitud/enviar-registro/:idCurso
solicitud
    .route("/ver-solicitudes")
    .get( SolicitudController.verSolicitudesGet )

// cursos-unison/solicitud/aprobar/:idCurso
solicitud
    .route("/aprobar/:idCurso")
    .get( SolicitudController.aprobarGet )

// cursos-unison/solicitud/no-aprobar/:idCurso
solicitud
    .route("/no-aprobar/:idCurso")
    .post( SolicitudController.noAprobarPost )

module.exports = solicitud