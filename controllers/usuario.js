'use strict'

function miPerfilGet(req, res) {
    res.render('./usuario/mi_perfil', {usuario: req.session.user})
}

function miPerfilPost(req, res) {
    res.render('./usuario/mi_perfil')
}

function misCursosGet(req, res) {
    res.render('./usuario/mis_cursos')
}

function misCursosPost(req, res) {
    res.render('./usuario/mis_cursos')
}

function verCursosGet(req, res) {
    res.render('./usuario/ver_cursos')
}

function verCursosPost(req, res) {
    res.render('./usuario/ver_cursos')
}

module.exports = {
    miPerfilGet,
    miPerfilPost,
    misCursosGet,
    misCursosPost,
    verCursosGet,
    verCursosPost
}