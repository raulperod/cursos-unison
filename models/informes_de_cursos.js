'use strict'

const InformesCursosModel = require('./conexion')

function crearInforme(informe, next){
    InformesCursosModel
        .query(`INSERT INTO informes_de_cursos
                SET ?`, informe, (error, resultado, fields) => {

            next(error)
        })
}

function obtenerInformePorIdCurso(idCurso, next){
    InformesCursosModel
        .query(`SELECT i.idCurso, c.nombre, i.participantes, i.cumplimientoObjetivos, i.participantesAprobados, i.nivelAutoFin, i.institucionesParticipantes, i.nivelVinculacion, i.evaluacionPromedioParticipantes
                FROM informes_de_cursos i
                JOIN cursos c ON c.idCurso = i.idCurso
                WHERE i.idCurso = ?`, idCurso, (error, resultado, fields) => {

            try{
                next(error, resultado[0])
            }catch(error){
                next(error, null)
            }
        })

}

function obtenerDescripcionInformePorIdCurso(idCurso, next){
    InformesCursosModel
        .query(`SELECT i.idCurso, c.nombre nombreCurso, c.departamento, CONCAT(u.nombre, ' ', u.apellido ) nombreRepresentante, i.nivelAutoFin, i.participantes, i.cumplimientoObjetivos, i.participantesAprobados, i.institucionesParticipantes, i.nivelVinculacion, i.evaluacionPromedioParticipantes
                FROM informes_de_cursos i
                JOIN cursos c ON c.idCurso = i.idCurso
                JOIN cursos_usuarios CU on CU.idCurso = i.idCurso AND cu.tipo = 3
                JOIN usuarios u ON u.idUsuario = cu.idUsuario
                WHERE i.idCurso = ?`, idCurso, (error, resultado, fields) => {
            
            try{
                next(error, resultado[0])
            }catch(error){
                next(error, null)
            }
        })
}

function actualizarInforme(informe, next){
    InformesCursosModel
        .query(`UPDATE informes_de_cursos
                SET ?
                WHERE idCurso = ?`, [informe, informe.idCurso], (error, resultado, fields) => {
            
            next(error)
        })
}

module.exports = {
    crearInforme,
    obtenerInformePorIdCurso,
    obtenerDescripcionInformePorIdCurso,
    actualizarInforme
}