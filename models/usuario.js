'use strict'

const UsuarioModel = require('./conexion')

function obtenerUsuarioPorCorreo(correo, next) {
    UsuarioModel
        .query(`SELECT u.idUsuario, u.correo, u.password, u.estado, u.nombre, u.apellido, u.tipo, u.expediente, u.institucion 
                FROM usuarios u 
                WHERE u.correo = ? `, correo ,(error, resultado, fields) => {
                   
            try{
                next(error, resultado[0])
            }catch(error){
                next(error, null)
            }        
            
        })
}

function comprobarEstadoPorId(idUsuario, next){
    UsuarioModel
        .query(`SELECT u.estado 
                FROM usuarios u 
                WHERE u.idUsuario = ? `, idUsuario ,(error, resultado, fields) => {
            
            try{
                next(error, resultado[0])
            }catch(error){
                next(error, null)
            }
        })
}

function obtenerCodigoVerificacionPorId(idUsuario, next) {
    UsuarioModel
        .query(`SELECT u.codigoVerificacion, u.estado 
                FROM usuarios u 
                WHERE u.idUsuario = ? `, idUsuario ,(error, resultado, fields) => {
                 
            try{
                next(error, resultado[0])
            }catch(error){
                next(error, null)
            }
        })
}

function cambiarPasswordPorCorreo(usuario, next){
    UsuarioModel
        .query(`UPDATE usuarios 
                SET ? 
                WHERE correo = ?`, [usuario, usuario.correo], (error, resultado, fields) => {
            
            (resultado.affectedRows == 0) ? next(error, -1) : next(error, 1)        
        })
}

function crearUsuario(usuario, next) {
    UsuarioModel
        .query(`INSERT INTO usuarios 
                SET ?`, usuario, (error, resultado, fields) => {
            
            try{
                next(error, resultado.insertId)
            }catch(error){
                next(error, null)
            }
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
    comprobarEstadoPorId,
    obtenerCodigoVerificacionPorId,
    cambiarPasswordPorCorreo,
    crearUsuario,
    actualizarUsuario
}
