'use strict'

const CursoModel = require('./conexion')

function obtenerCursoPorId(id, next) {
    CursoModel
        .query(`SELECT *
                FROM cursos c 
                WHERE c.idCurso = ? `, id ,(error, resultado, fields) => {
                   
            try{
                next(error, resultado[0])
            }catch(error){
                next(error, null)
            }        
            
        })
}

function obtenerDescripcionCursoPorId(id, next) {
    CursoModel
        .query(`SELECT c.idCurso, 
                FROM cursos c 
                WHERE c.idCurso = ? `, id ,(error, resultado, fields) => {
                   
            try{
                next(error, resultado[0])
            }catch(error){
                next(error, null)
            }        
            
        })
}

function crearCurso(curso, next){
    CursoModel
        .query(`INSERT INTO cursos 
                SET ?`, curso, (error, resultado, fields) => {
            
            try{
                next(error, resultado.insertId)
            }catch(error){
                next(error, null)
            }
        })
}

function actualizarCurso(curso, next){
    CursoModel
        .query(`UPDATE cursos 
                SET ? 
                WHERE idCurso = ?`, [curso, curso.idCurso], (error, resultado, fields) => {

            next(error)
        })
}

function borrarCurso(idCurso, next) {
    CursoModel
        .query(`DELETE FROM cursos 
                WHERE idCurso = ?`, idCurso , (error, resultado, fields) => {

            next(error)
        })
}

module.exports = {
    obtenerCursoPorId,
    crearCurso,
    actualizarCurso,
    borrarCurso
}