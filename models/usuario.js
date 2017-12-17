'use strict'

const UsuarioModel = require('./conexion')

function obtenerUsuarioPorCorreo(correo, next) {
    UsuarioModel
        .query(`SELECT u.idUsuario, u.correo, u.password, u.status 
                FROM usuarios u 
                WHERE u.correo = ? `, correo ,(error, resultado, fields) => {
            

            next(error, resultado[0])
        })
}

function obtenerCodigoVerificacionPorId(idUsuario, next) {
    UsuarioModel
        .query(`SELECT u.codigoVerificacion, u.estado 
                FROM usuarios u 
                WHERE u.idUsuario = ? `, idUsuario ,(error, resultado, fields) => {
                 
            next(error, resultado[0])
        })
}

function crearUsuario(usuario, next) {
    UsuarioModel
        .query(`INSERT INTO usuarios 
                SET ?`, usuario, (error, resultado, fields) => {
            
            (error) ? next(error, -1) : next(error, resultado.insertId)
        })
}

function actualizarUsuario(usuario, next) {
    UsuarioModel
        .query(`UPDATE usuarios 
                SET ? 
                WHERE idUsuario = ?`, [usuario, usuario.idUsuario], (error, resultado, fields) => {

            next(error)
        })
}

module.exports = {
    obtenerUsuarioPorCorreo,
    obtenerCodigoVerificacionPorId,
    crearUsuario,
    actualizarUsuario
}
