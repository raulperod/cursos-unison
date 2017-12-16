'use strict'

function loginGet(req, res) {
    res.render('login')
}

function loginPost(req, res) {
    res.render('login')
}

function olvidarContrasenaGet(req, res) {
    res.render('olvidar_contraseña')
}

function olvidarContrasenaPost(req, res) {
    res.render('olvidar_contraseña')
}

function registrarGet(req, res) {
    res.render('registro')
}

function registrarPost(req, res) {
    res.render('registro')
}

function logout(req, res) {
    // cierra la sesion del usuario
    req.session = null
    // te redirecciona al inicio
    res.redirect("/login")
}

module.exports = {
    loginGet,
    loginPost,
    olvidarContrasenaGet,
    olvidarContrasenaPost,
    registrarGet,
    registrarPost,
    logout
}