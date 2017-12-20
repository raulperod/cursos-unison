'use strict'

const UsuarioModel = require('../models/usuario'),
    bcrypt = require('bcrypt-nodejs')

function miPerfilGet(req, res) {
    res.render('./usuario/mi_perfil', {usuario: req.session.user})
}

function miPerfilPost(req, res) {
    const password_old = req.body.password_old,
          password_new = req.body.password_new
    
    // compruebo la contraseña actual
    if(bcrypt.compareSync(password_old, req.session.user.password)){
        // actualizo la contraseña
        req.session.user.password = bcrypt.hashSync(password_new)
        const usuario = {
            idUsuario: req.session.user.idUsuario,
            password: req.session.user.password
        }
        UsuarioModel.actualizarUsuario(usuario, (error) => {
            (error) ? res.json({msg:'Error de la base de datos', tipo: 0}) : res.json({msg:'Se cambio la contraseña', tipo: 4}) 
        })
    }else{
        res.json({msg:'contraseña actual incorrecta', tipo:2})
    }
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