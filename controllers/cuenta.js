'use strict'

function loginGet(req, res) {
    res.render('./cuenta/login')
}

function loginPost(req, res) {
    res.render('./cuenta/login')
}

function olvidarContrasenaGet(req, res) {
    res.render('./cuenta/olvidar_contraseña')
}

function olvidarContrasenaPost(req, res) {
    res.render('./cuenta/olvidar_contraseña')
}

function registrarGet(req, res) {
    res.render('./cuenta/registro')
}

function registrarPost(req, res) {
    res.render('./cuenta/registro')
}

function logout(req, res) {
    // cierra la sesion del usuario
    req.session = null
    // te redirecciona al inicio
    res.redirect("/login")
}

function verificarCorreoGet(req, res) {
    res.render('./cuenta/verificar_correo')
}

function verificarCorreoPost(req, res) {
    res.render('./cuenta/verificar_correo')
}

module.exports = {
    loginGet,
    loginPost,
    olvidarContrasenaGet,
    olvidarContrasenaPost,
    registrarGet,
    registrarPost,
    logout,
    verificarCorreoGet,
    verificarCorreoPost
}