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
    if(usuario.tipo == 2){
        res.redirect('/solicitud/ver-solicitudes')
        return;
    } 
    // consigue los cursos del usuario
    CursosUsuariosModel.obtenerCursosUsuariosPorIdUsuario(usuario.idUsuario, (error, cursosUsuario) => {
        if(error || cursosUsuario.length == 0){
            res.render('./usuario/mis_cursos', {usuario, misCursos: [] })
        }else{ // idCurso, nombre del curso, Representante, Instructor, estado, tipo 
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
                        enviarCorrecto = req.session.enviarCorrecto,
                        errorEvaluacion = req.session.errorEvaluacion,
                        enviarInformeError = req.session.enviarInformeError,
                        enviarInformeCorrecto = req.session.enviarInformeCorrecto

                    req.session.enviarError = false
                    req.session.enviarCorrecto = false
                    req.session.errorEvaluacion = false
                    req.session.enviarInformeError = false
                    req.session.enviarInformeCorrecto = false

                    res.render('./usuario/mis_cursos', {usuario, misCursos, enviarError, enviarCorrecto, errorEvaluacion, enviarInformeError, enviarInformeCorrecto})
                }  
            })
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
    const usuario = req.session.user
    if(usuario.tipo == 2){
        res.redirect('/solicitud/ver-solicitudes')
        return;
    } 
    // consigue los cursos del usuario
    CursoModel.obtenerCursosDisponibles( (error, cursosDisponibles) => {
        let errorInscripcion = req.session.errorInscripcion,
            errorCupo = req.session.errorCupo

        req.session.errorInscripcion = false
        req.session.errorCupo = false

        if(error || cursosDisponibles.length == 0){
            res.render('./usuario/ver_cursos', {usuario, verCursos: [], errorInscripcion, errorCupo })
        }else{ // idCurso, nombre del curso, Representante, Instructor
            let idsCursos = []
            // obtengo los ids de los cursos del usuario
            for(let i=0 ; i<cursosDisponibles.length ; i++){
                idsCursos.push(cursosDisponibles[i].idCurso)
            }
            CursosUsuariosModel.obtenerCursosUsuariosPorIdCurso(idsCursos, (error, verCursos) => {
                if(error){
                    console.log(error)
                    res.render('./usuario/ver_cursos' , {usuario, verCursos: [], errorInscripcion, errorCupo })
                }else{
                    verCursos = acomodarVerCursos(cursosDisponibles, verCursos)
                    res.render('./usuario/ver_cursos' , {usuario, verCursos, errorInscripcion, errorCupo})
                }  
            })
        }
    })
}

function acomodarVerCursos(cursosDisponibles, verCursos){
    let verCursosAux = verCursos,
        verCursosVista = []

    for(let i=0 ;i<cursosDisponibles.length ; i++){
        let cursoVista = {
            idCurso: cursosDisponibles[i].idCurso
        }
        for(let j=0 ; j<verCursosAux.length; j++){
            if(cursoVista.idCurso == verCursosAux[j].idCurso){
                if(verCursosAux[j].tipo == 3){
                    cursoVista.nombreC = verCursosAux[j].nombreC
                    cursoVista.nombreR = verCursosAux[j].nombreU
                }else if(verCursosAux[j].tipo == 2){
                    cursoVista.nombreI = verCursosAux[j].nombreU
                }
            }
        }
        verCursosVista.push(cursoVista)
    }    
    return verCursosVista
}

module.exports = {
    miPerfilGet,
    miPerfilPost,
    misCursosGet,
    verCursosGet
}