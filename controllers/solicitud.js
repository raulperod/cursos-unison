'use strict'

const UsuarioModel = require('../models/usuario'),
    CursoModel = require('../models/curso'),
    CursosUsuariosModel = require('../models/cursos_usuarios'),
    enviarCorreo = require('./correo'),
    bcrypt = require('bcrypt-nodejs')

function crearSolicitudGet(req, res) {
    res.render('./solicitud/crear_solicitud', {usuario: req.session.user})
}

function crearSolicitudPost(req, res) {
    const   correoInstructor = req.body.correo,
            nombreDelCurso = req.body.nombre,
            usuario = req.session.user,
            nuevaSolicitud = {
                nombre: nombreDelCurso
            }  

    // si el representante del curso es el instructor
    if(usuario.correo == correoInstructor){
        CursoModel.crearCurso(nuevaSolicitud, (error, id) => {
            if(error){
                res.json({msg:'Error base de datos', tipo: 0})
            }else{
                let nuevoCursosUsuarios = [
                    [usuario.idUsuario, id, 3],// representante del curso
                    [usuario.idUsuario, id, 2]// instructor
                ]
                
                CursosUsuariosModel.crearCursosUsuarios(nuevoCursosUsuarios, (error) => {
                    (error) ? res.json({msg:'Error base de datos', tipo: 2}) : res.json({msg:'se agrego correctamente', tipo: 3})
                })
            }
        })
    }else{
        // verifico que el correo del instructor exista
        UsuarioModel.obtenerUsuarioPorCorreo(correoInstructor, (error, instructor) => {
            if(error || instructor == null){
                res.json({msg:'Error base de datos', tipo: 2})
            }else{
                CursoModel.crearCurso(nuevaSolicitud, (error, id) => {
                    if(error){
                        res.json({msg:'Error base de datos', tipo: 0})
                    }else{
                        let nuevoCursosUsuarios = [
                            [usuario.idUsuario, id, 3], // representante
                            [instructor.idUsuario, id ,2] // instructor
                        ]
                        
                        CursosUsuariosModel.crearCursosUsuarios(nuevoCursosUsuarios, (error) => {
                            if(error){
                                res.json({msg:'Error base de datos', tipo: 2})
                            }else{
                                let asunto = 'Creacion de nuevo curso',
                                    mensaje = `${usuario.nombre} ${usuario.apellido} lo a agregado como instructor para el curso ${nuevaSolicitud.nombre}`
                                enviarCorreo(correoInstructor, asunto, mensaje)
                                res.json({msg:'se agrego correctamente', tipo: 3})
                            }
                        })
                    }
                })
            }
        })
    }     
}

function editarRegistroGet(req, res){
    let idCurso = req.params.idCurso,
        usuario = req.session.user
    // obtener tipo
    CursosUsuariosModel.obtenerTipoPorIdCursoYidUsuario(idCurso, usuario.idUsuario, (error, tipo) => {
        if(error || tipo == null || tipo < 2){
            res.redirect('/usuario/mis-cursos')
        }else{
            CursoModel.obtenerCursoPorId(idCurso, (error, registro) => {
                if(error || registro == null){
                    res.redirect('/usuario/mis-cursos')
                }else{
                    res.render('./solicitud/editar_registro', {usuario:req.session.user, tipo:tipo.tipo, registro})
                }
            })
        }
    })
}

function editarRegistroPost(req, res){
    let registro = req.body
    registro.idCurso = req.params.idCurso

    CursoModel.actualizarCurso(registro, (error) => {
        if(error){
            console.log(error)
        }
        res.redirect('/usuario/mis-cursos')
    })
}

module.exports = {
    crearSolicitudGet,
    crearSolicitudPost,
    editarRegistroGet,
    editarRegistroPost
}