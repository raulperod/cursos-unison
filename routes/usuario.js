'use strict'

const express = require("express"),
      UsuarioController = require('../controllers/usuario'),
      usuario = express.Router()

// cursos-unison/usuario/mi-perfil
usuario
    .route("/mi-perfil")
    .get(  UsuarioController.miPerfilGet )
    .post( UsuarioController.miPerfilPost )

// cursos-unison/usuario/mis-cursos
usuario
    .route("/mis-cursos")
    .get(  UsuarioController.misCursosGet )

// cursos-unison/usuario/ver-cursos
usuario
    .route("/ver-cursos")
    .get(  UsuarioController.verCursosGet )

module.exports = usuario