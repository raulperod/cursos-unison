'use strict'

const UsuarioModel = require('../models/usuario'),
    CursosUsuariosModel = require('../models/cursos_usuarios'),
    CursoModel = require('../models/curso'),
    bcrypt = require('bcrypt-nodejs')

function miPerfilGet(req, res) {
    res.render('./usuario/mi_perfil', {usuario: req.session.user})
}

function miPerfilPost(req, res) {
    const password_old = req.body.password_old,
          password_new = req.body.password_new
    
    // compruebo la contraseña actual
    if(bcrypt.compareSync(password_old, req.session.user.password)){
        // actualizo la contraseña
        req.session.user.password = bcrypt.hashSync(password_new)
        const usuario = {
            idUsuario: req.session.user.idUsuario,
            password: req.session.user.password
        }
        UsuarioModel.actualizarUsuario(usuario, (error) => {
            (error) ? res.json({msg:'Error de la base de datos', tipo: 0}) : res.json({msg:'Se cambio la contraseña', tipo: 4}) 
        })
    }else{
        res.json({msg:'contraseña actual incorrecta', tipo:2})
    }
}

function misCursosGet(req, res) {
    const usuario = req.session.user
    // consigue los cursos del usuario
    CursosUsuariosModel.obtenerCursosUsuariosPorIdUsuario(usuario.idUsuario, (error, cursosUsuario) => {
        if(error || cursosUsuario.length == 0){
            res.render('./usuario/mis_cursos', {usuario, misCursos: [] })
        }else{ // idCurso, nombre del curso, Representante, Instructor, estado, tipo 
            if(cursosUsuario.length > 0){
                cursosUsuario = eliminarDeMas(cursosUsuario)
                let idsCursos = []
                // obtengo los ids de los cursos del usuario
                for(let i=0 ; i<cursosUsuario.length ; i++){
                    idsCursos.push(cursosUsuario[i].idCurso)
                }
                CursosUsuariosModel.obtenerCursosUsuariosPorIdCurso(idsCursos, (error, misCursos) => {
                    if(error){
                        console.log(error)
                        res.render('./usuario/mis_cursos' , {usuario, misCursos: [] })
                    }else{
                        misCursos = acomodarMisCursos(cursosUsuario, misCursos)
                        let enviarError = req.session.enviarError,
                            enviarCorrecto = req.session.enviarCorrecto

                        req.session.enviarError = false;
                        req.session.enviarCorrecto = false;
                        res.render('./usuario/mis_cursos' , {usuario, misCursos, enviarError, enviarCorrecto})
                    }  
                })
            }else{
                res.render('./usuario/mis_cursos')
            }
        }
    })
}

function eliminarDeMas(cursosUsuario){
    let cursosUsuarioAux = cursosUsuario

    for(let i=0 ; i<cursosUsuarioAux.length ; i++){
        let idCurso = cursosUsuarioAux[i].idCurso,
            tipoMax = cursosUsuarioAux[i].tipo

        for(let j=0 ; j<cursosUsuarioAux.length ; j++){
            let tipoMin = cursosUsuarioAux[j].tipo
            // elimino si tipoMin es menor a tipoMax
            if(cursosUsuarioAux[j].idCurso == idCurso && tipoMax > tipoMin){
                cursosUsuarioAux.splice(j, 1)
            } 
        }
    }
    return cursosUsuarioAux;
}

function acomodarMisCursos(cursosUsuario, misCursos){
    let misCursosAux = misCursos,
        misCursosVista = []

    for(let i=0 ;i<cursosUsuario.length ; i++){
        let cursoVista = {
            idCurso: cursosUsuario[i].idCurso,
            tipo: cursosUsuario[i].tipo
        }
        for(let j=0 ; j<misCursosAux.length; j++){
            if(cursoVista.idCurso == misCursosAux[j].idCurso){
                if(misCursosAux[j].tipo == 3){
                    cursoVista.nombreC = misCursosAux[j].nombreC
                    cursoVista.nombreR = misCursosAux[j].nombreU
                    cursoVista.estado = misCursosAux[j].estado
                }else if(misCursosAux[j].tipo == 2){
                    cursoVista.nombreI = misCursosAux[j].nombreU
                }
            }
        }
        misCursosVista.push(cursoVista)
    }    
    return misCursosVista
}

function verCursosGet(req, res) {
    res.render('./usuario/ver_cursos')
}

module.exports = {
    miPerfilGet,
    miPerfilPost,
    misCursosGet,
    verCursosGet,
    
}