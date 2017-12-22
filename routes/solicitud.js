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

module.exports = solicitud