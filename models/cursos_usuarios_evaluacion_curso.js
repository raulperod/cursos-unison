'use strict'

const EvaluacionCursoModel = require('./conexion')

function crearEvaluacionCurso(evaluacion, next){
    EvaluacionCursoModel
        .query(`INSERT INTO cursos_usuarios_evaluacion_curso
                SET ?`, evaluacion, (error, resultado, fields) => {
            
            next(error)
        })
}

function obtenerEvaluacionesPorIdCurso(idCurso, next){
    EvaluacionCursoModel
        .query(`SELECT * 
                FROM cursos_usuarios_evaluacion_curso
                WHERE idCurso = ?`, idCurso, (error, resultado, fields) => {
            
            next(error, resultado)
        })
}

module.exports = {
    crearEvaluacionCurso,
    obtenerEvaluacionesPorIdCurso
}