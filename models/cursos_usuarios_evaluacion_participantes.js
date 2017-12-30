'use strict'

const CursosUsuariosEvaluacionParticipantesModel = require('./conexion')

function obtenerSiEvaluo(idCurso, idUsuario, next){
    CursosUsuariosEvaluacionParticipantesModel
        .query(`SELECT evaluacion_curso, evaluacion_instructor
                FROM cursos_usuarios_evaluacion_participantes
                WHERE idCurso = ? AND idUsuario = ?`, [idCurso, idUsuario], (error, resultado, fields) => {
            
            try{
                next(error, resultado[0])
            }catch(error){
                next(error, null)
            }        
        })
}

function obtenerEvaluacion(idCurso, idsUsuario, next){
    CursosUsuariosEvaluacionParticipantesModel
        .query(`SELECT cuep.idUsuario, cuep.idCurso, u.nombre, u.apellido, cuep.aprobo
                FROM cursos_usuarios_evaluacion_participantes cuep
                JOIN usuarios u ON cuep.idUsuario = u.idUsuario
                WHERE cuep.idCurso = ? AND cuep.idUsuario IN (?)`, [idCurso, idsUsuario] ,(error, resultado, fields) => {
            
            next(error, resultado)
        })
}

function obtenerCursoCalificado(idCurso, idsUsuario, next){
    CursosUsuariosEvaluacionParticipantesModel
        .query(`SELECT COUNT(cuep.calificado) calificado
                FROM cursos_usuarios_evaluacion_participantes cuep
                WHERE cuep.idCurso = ? AND cuep.idUsuario IN (?) AND cuep.calificado = 0`, [idCurso, idsUsuario] ,(error, resultado, fields) => {
            try{
                next(error, resultado[0].calificado)
            }catch(error){
                next(error, null)
            }
        })
}

function obtenerAprobadosPoridCurso(idCurso, next){
    CursosUsuariosEvaluacionParticipantesModel
        .query(`SELECT c.numeroDeParticipantes, COUNT(cuep.aprobo) num_aprobados
                FROM cursos_usuarios_evaluacion_participantes cuep
                JOIN cursos c ON c.idCurso = cuep.idCurso
                WHERE cuep.idCurso = ? AND cuep.aprobo = 1`, idCurso, (error, resultado, fields) => {
            try{
                next(error, resultado[0])
            }catch(error){
                next(error, null)
            }
            
        })
}

function crearEvaluacion(evaluacion, next){
    CursosUsuariosEvaluacionParticipantesModel
        .query(`INSERT INTO cursos_usuarios_evaluacion_participantes
                SET ?`, evaluacion, (error, resultado, fields) => {
            
            next(error)
        })
}

function actualizarEvaluacion(evaluacion, next){
    CursosUsuariosEvaluacionParticipantesModel
        .query(`UPDATE cursos_usuarios_evaluacion_participantes 
                SET ? 
                WHERE idCurso = ? AND idUsuario = ?`, [evaluacion, evaluacion.idCurso, evaluacion.idUsuario], (error, resultado, fields) => {
            
            next(error)
        })
}

module.exports = {
    obtenerSiEvaluo,
    obtenerEvaluacion,
    obtenerCursoCalificado,
    crearEvaluacion,
    actualizarEvaluacion,
    obtenerAprobadosPoridCurso
}