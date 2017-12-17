'use strict'

const express = require("express"),
      CursoController = require('../controllers/usuario'),
      curso = express.Router()

// cursos-unison/usuario/:idUsuario/mi-perfil
usuario
    .route("/inscribirse/:idCurso")
    .get(  CursoController.inscribirseGet )
    .post( CursoController.inscribirsePost )

module.exports = curso