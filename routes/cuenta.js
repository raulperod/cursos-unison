'use strict'

const express = require("express"),
      CuentaController = require('../controllers/cuenta'),
      cuenta = express.Router()

// cursos-unison/cuenta/login
cuenta
    .route("/login")
    .get(  CuentaController.loginGet )
    .post( CuentaController.loginPost )

// cursos-unison/cuenta/olvidar-contraseña
cuenta
    .route("/olvidar-contrasena")
    .get(  CuentaController.olvidarContrasenaGet )
    .post( CuentaController.olvidarContrasenaPost )

// cursos-unison/cuenta/registro
cuenta
    .route("/registrar")
    .get(  CuentaController.registrarGet )
    .post( CuentaController.registrarPost )

// cursos-unison/cuenta/verificar-codigo/:idUsuario
cuenta
    .route("/verificar-correo/:idUsuario")
    .get(  CuentaController.verificarCorreoGet )
    .post( CuentaController.verificarCorreoPost )


// cursos-unison/cuenta/logout
cuenta.get('/logout', CuentaController.logout )


module.exports = cuenta