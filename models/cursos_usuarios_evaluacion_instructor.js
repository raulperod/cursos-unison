'use strict'

const EvaluacionInstructorModel = require('./conexion')

function crearEvaluacionInstructor(evauacion, next){
    EvaluacionInstructorModel
        .query(`INSERT INTO cursos_usuarios_evaluacion_instructor
                SET ?`, evauacion, (error, resultado, fields) => {
            
            next(error)
        })
}

module.exports = {
    crearEvaluacionInstructor
}