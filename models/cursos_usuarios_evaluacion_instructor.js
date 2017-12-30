'use strict'

const EvaluacionInstructorModel = require('./conexion')

function crearEvaluacionInstructor(evauacion, next){
    EvaluacionInstructorModel
        .query(`INSERT INTO cursos_usuarios_evaluacion_instructor
                SET ?`, evauacion, (error, resultado, fields) => {
            
            next(error)
        })
}

function obtenerEvaluacionesPorIdCurso(idCurso, next){
    EvaluacionInstructorModel
        .query(`SELECT * 
                FROM cursos_usuarios_evaluacion_instructor
                WHERE idCurso = ?`, idCurso, (error, resultado, fields) => {
            
            next(error, resultado)
        })
}

module.exports = {
    crearEvaluacionInstructor,
    obtenerEvaluacionesPorIdCurso
}