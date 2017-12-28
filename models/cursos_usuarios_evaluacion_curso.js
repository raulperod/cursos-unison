'use strict'

const EvaluacionCursoModel = require('./conexion')

function crearEvaluacionCurso(evauacion, next){
    EvaluacionCursoModel
        .query(`INSERT INTO cursos_usuarios_evaluacion_curso
                SET ?`, evauacion, (error, resultado, fields) => {
            
            next(error)
        })
}

module.exports = {
    crearEvaluacionCurso
}