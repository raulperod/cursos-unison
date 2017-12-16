'use strict'

const express = require("express"),
      UsuarioController = require('../controllers/usuario'),
      usuario = express.Router()

// cursos-unison/usuario/:idUsuario/verificar-codigo
usuario
    .route("/:idUsuario/verificar-codigo")
    .get(  UsuarioController.verificarCorreoGet )
    .post( UsuarioController.verificarCorreoPost )

// cursos-unison/usuario/:idUsuario/mi-perfil
usuario
    .route("/:idUsuario/mi-perfil")
    .get(  UsuarioController.miPerfilGet )
    .post( UsuarioController.miPerfilPost )

// cursos-unison/usuario/:idUsuario/mis-cursos
usuario
    .route("/:idUsuario/mis-cursos")
    .get(  UsuarioController.misCursosGet )
    .post( UsuarioController.misCursosPost )

// cursos-unison/usuario/ver-cursos
usuario
    .route("/ver-cursos")
    .get(  UsuarioController.verCursosGet )
    .post( UsuarioController.verCursosPost )

// cursos-unison/usuario//ver-cursos
usuario
    .route("/ver-cursos")
    .get(  UsuarioController.verCursosGet )
    .post( UsuarioController.verCursosPost )

module.exports = usuario