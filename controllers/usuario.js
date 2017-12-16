'use strict'

function verificarCorreoGet(req, res) {
    res.render('verificar_correo')
}

function verificarCorreoPost(req, res) {
    res.render('verificar_correo')
}

function miPerfilGet(req, res) {
    res.render('mi_perfil')
}

function miPerfilPost(req, res) {
    res.render('mi_perfil')
}

function misCursosGet(req, res) {
    res.render('mis_cursos')
}

function misCursosPost(req, res) {
    res.render('mis_cursos')
}

function verCursosGet(req, res) {
    res.render('ver_cursos')
}

function verCursosPost(req, res) {
    res.render('ver_cursos')
}

module.exports = {
    verificarCorreoGet,
    verificarCorreoPost,
    miPerfilGet,
    miPerfilPost,
    misCursosGet,
    misCursosPost,
    verCursosGet,
    verCursosPost
}