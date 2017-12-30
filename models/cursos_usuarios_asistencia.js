'use strict'

const CursosUsuariosAsistenciaModel = require('./conexion')

function obtenerAsistenciaPorIdCurso(idCurso, next){
    CursosUsuariosAsistenciaModel
        .query(`SELECT cua.idUsuario, cua.idCurso, u.nombre, u.apellido, cua.asistio
                FROM cursos_usuarios_asistencia cua
                JOIN usuarios u ON u.idUsuario = cua.idUsuario
                WHERE cua.idCurso = ? AND cua.fecha = ?`, [idCurso, obtenerDiaActual()], (error, resultado, fields) => {

            next(error, resultado)
        })
}

function obtenerInasistenciasPoridCurso(idCurso, next){
    CursosUsuariosAsistenciaModel
        .query(`SELECT cua.idUsuario, COUNT(cua.asistio) inasistencia
                FROM cursos_usuarios_asistencia cua
                WHERE cua.idCurso = ? AND cua.asistio = 0`, idCurso, (error, resultado, fields) => {
            
            next(error, resultado)
        })
}

function crearAsistencia(asistencia, next){
    CursosUsuariosAsistenciaModel
        .query(`INSERT INTO cursos_usuarios_asistencia ( idUsuario, idCurso, fecha ) 
                VALUES ?`, [asistencia], (error, resultado, fields) => {
            
            next(error)
        })
}

function actualizarAsistencia(asistencia, next){
    CursosUsuariosAsistenciaModel
        .query(`UPDATE cursos_usuarios_asistencia
                SET ?
                WHERE idCurso = ? AND idUsuario = ? AND fecha = ?`, [asistencia, asistencia.idCurso, asistencia.idUsuario, asistencia.fecha], (error, resultado, fields) => {
            
            next(error)
        })
}

function obtenerDiaActual(){
    let date = new Date(),
        day = date.getDate(),
        month = date.getMonth(),
        year = date.getFullYear()

    if (month < 10) month = "0" + month
    if (day < 10) day = "0" + day

    return year + "-" + month + "-" + day
}

module.exports = {
    obtenerAsistenciaPorIdCurso,
    obtenerInasistenciasPoridCurso,
    crearAsistencia,
    actualizarAsistencia
}