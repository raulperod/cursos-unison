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
    crearEvaluacion,
    actualizarEvaluacion
}