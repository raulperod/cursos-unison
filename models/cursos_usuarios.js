'use strict'

const CursosUsuariosModel = require('./conexion')

function obtenerCursosUsuariosPorIdUsuario(id, next) {
    CursosUsuariosModel
        .query(`SELECT cu.idCurso, cu.tipo
                FROM cursos_usuarios cu 
                WHERE cu.idUsuario = ? 
                ORDER BY cu.tipo DESC`, id ,(error, resultado, fields) => {
                   
            next(error, resultado)
        })
}

function obtenerintructorPorIdCurso(idCurso, next){
    CursosUsuariosModel
        .query(`SELECT u.idUsuario, u.correo, c.nombre nombreC, cu.tipo
                FROM cursos_usuarios cu
                JOIN usuarios u ON u.idUsuario = cu.idUsuario
                JOIN cursos c ON c.idCurso = cu.idCurso
                WHERE cu.idCurso = ? AND (cu.tipo = 2 OR cu.tipo = 3)
                ORDER BY cu.tipo DESC`, idCurso, (error, resultado, fields) => {
            
            next(error, resultado)
        })
}

function obtenerCursosUsuariosPorIdCurso(idsCurso, next) {
    CursosUsuariosModel
        .query(`SELECT cu.idCurso, c.nombre nombreC, concat(u.nombre, ' ', u.apellido) nombreU, c.estado, cu.tipo
                FROM cursos_usuarios cu
                JOIN usuarios u ON cu.idUsuario = u.idUsuario
                JOIN cursos c ON cu.idCurso = c.idCurso
                WHERE ( cu.tipo = 3 OR cu.tipo = 2 ) AND cu.idCurso IN (?)`, [idsCurso] ,(error, resultado, fields) => {
                   
            next(error, resultado)
        })
}

function obtenerTipoPorIdCursoYidUsuario(idCurso, idUsuario, next){
    CursosUsuariosModel
        .query(`SELECT cu.tipo
                FROM cursos_usuarios cu 
                WHERE cu.idUsuario = ? AND cu.idCurso = ? 
                ORDER BY cu.tipo DESC`, [idUsuario, idCurso] ,(error, resultado, fields) => {
                   
            try{
                next(error, resultado[0])
            }catch(error){
                next(error, null)
            }        
            
        })
}

function crearCursosUsuarios(cursosUsuarios, next){
    CursosUsuariosModel
        .query(`INSERT INTO cursos_usuarios ( idUsuario, idCurso, tipo ) 
                VALUES ?`, [cursosUsuarios], (error, resultado, fields) => {
            
            next(error)
        })
}



module.exports = {
    obtenerCursosUsuariosPorIdUsuario,
    obtenerintructorPorIdCurso,
    obtenerCursosUsuariosPorIdCurso,
    obtenerTipoPorIdCursoYidUsuario,
    crearCursosUsuarios
}