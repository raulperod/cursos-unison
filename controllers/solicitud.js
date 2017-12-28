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
                                    mensaje = `<p>${usuario.nombre} ${usuario.apellido} lo a agregado como instructor para el curso ${nuevaSolicitud.nombre}.</p>`
                                enviarCorreo(correoInstructor, asunto, mensaje)
                                CursosUsuariosEvaluacionParticipantesModel.crearEvaluacion({idCurso:id, idUsuario:instructor.idUsuario}, (error) => {})
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
                    registro = acomodarFecha(registro)
                    console.log(registro)
                    res.render('./solicitud/editar_registro', {usuario, tipo, registro})
                }
            })
        }
    })
}

function acomodarFecha(registro){
    let registro2 = registro

    let fechaInicial = registro2.fechaInicial,
        fechaFinal = registro2.fechaFinal

    try{
        fechaInicial = fechaInicial.split('T')[0]
        fechaFinal = fechaFinal.split('T')[0]
    }catch(error){
        fechaInicial = '0000-00-00'
        fechaFinal = '0000-00-00'
    }
    
    registro2.fechaInicial = fechaInicial
    registro2.fechaFinal = fechaFinal

    return registro2
}

function editarRegistroPost(req, res){
    let registro = req.body
    registro.idCurso = req.params.idCurso

    CursoModel.actualizarCurso(registro, (error) => {
        if(error){
            res.json({msg:`${error}`, tipo:0})
        }else{
            res.json({msg:`Cambios correctamente`, tipo:1})
        }
    })
}

function cancelarRegistroGet(req, res){
    let idCurso = req.params.idCurso,
        usuario = req.session.user

    CursosUsuariosModel.obtenerResponsableYintructorPorIdCurso(idCurso, (error, curso) => {
        if(error || curso.length == 0 || curso == null){
            res.redirect('/usuario/mis-cursos')
        }else{
            // si el usuario actual es el representante, entonces permite borrar el curso
            if(curso[0].idUsuario == usuario.idUsuario){
                CursoModel.borrarCurso(idCurso, (error) => {
                    if(error){
                        res.redirect('/usuario/mis-cursos')
                    }else{
                        // si el representante no es el instructor se le manda un correo al instructor del cancelamiento
                        if(curso[1].idUsuario != usuario.idUsuario){ 
                            let asunto = 'Solicitud de registro de curso cancelado!',
                                mensaje = `<p>${usuario.nombre} ${usuario.apellido} ha cancelado la solicitud de registro del curso "${curso[0].nombreC}".</p>`
                            
                            enviarCorreo(curso[1].correo, asunto, mensaje)    
                        }     
                        res.redirect('/usuario/mis-cursos')
                    }
                    
                })
            }
        }
    })
} 

function enviarRegistroPost(req, res){
    let idCurso = req.params.idCurso

    CursoModel.obtenerCursoPorId(idCurso, (error, curso) => {
        if(error || curso == null || comprobarCurso(curso)){
            req.session.enviarError = true;
            res.redirect('/usuario/mis-cursos')
        }else{
            // cambio el estado del curso
            let cursoUp = {idCurso, estado:2}
            CursoModel.actualizarCurso(cursoUp, (error) => {
                if(error){
                    req.session.enviarError = true;
                    res.redirect('/usuario/mis-cursos')
                }else{
                    req.session.enviarCorrecto = true;
                    res.redirect('/usuario/mis-cursos')
                }
            })
        }    
    })    
} 

function comprobarCurso(curso){
    for(let llave in curso){
        let atributo = curso[llave]
        if( llave == 'numeroDeParticipantes') continue
        if(atributo == '' || atributo == null || atributo == '0000-00-00') return true
    }
    return false;
}

function verSolicitudesGet(req, res){
    let usuario = req.session.user

    CursosUsuariosModel.obtenerSolicitudes((error, solicitudes) => {
        if(error){
            solicitudes = []
            res.render('./solicitud/ver_solicitudes', {solicitudes, usuario})
        }else{
            solicitudes = obtenerSolicitudesOrdenadas(solicitudes)
            res.render('./solicitud/ver_solicitudes', {solicitudes, usuario})
        }
    })
}

function obtenerSolicitudesOrdenadas(solicitudes){
    let solicitudesOrdenadas = []
    
    for(let i=0 ; i<solicitudes.length ; i+=2){
        let solicitud = {}
        solicitud.idCurso = solicitudes[i].idCurso
        solicitud.nombreC = solicitudes[i].nombreC
        solicitud.nombreR = solicitudes[i].nombreU
        solicitud.nombreI = solicitudes[i+1].nombreU
        solicitudesOrdenadas.push(solicitud)
    }
    return solicitudesOrdenadas
}

function aprobarGet(req, res){
    let usuario = req.session.user,
        idCurso = req.params.idCurso

    CursosUsuariosModel.obtenerResponsableYintructorPorIdCurso(idCurso, (error, curso) => {
        if(error || curso.length == 0){
            res.redirect('/solicitud/ver-solicitudes')
        }else{ 
            // cambio el estado del curso
            let cursoUp = {idCurso, estado:3}

            CursoModel.actualizarCurso(cursoUp, (error) => {
                if(error){
                    res.redirect('/solicitud/ver-solicitudes')
                }else{
                    // mandar correo al responsable
                    let asunto = 'Se a aprobado la solicitud del curso!',
                        mensaje = `<p>El H. Consejo Divisional ha aprobado la imparticion del curso "${curso[0].nombreC}".</p>`
                    
                    enviarCorreo(curso[0].correo, asunto, mensaje)
                    res.redirect('/solicitud/ver-solicitudes')
                }
            })
        }
    })
} 

function noAprobarPost(req, res){
    let usuario = req.session.user,
        idCurso = req.params.idCurso,
        correccion = req.body.correccion

    CursosUsuariosModel.obtenerResponsableYintructorPorIdCurso(idCurso, (error, curso) => {
        if(error || curso.length == 0){
            res.redirect('/solicitud/ver-solicitudes')
        }else{ 
            // cambio el estado del curso
            let cursoUp = {idCurso, estado:1}

            CursoModel.actualizarCurso(cursoUp, (error) => {
                if(error){
                    res.redirect('/solicitud/ver-solicitudes')
                }else{
                    // mandar correo al responsable
                    let asunto = 'No se aprobo la solicitud del curso...',
                        mensaje = `<p>El H. Consejo Divisional no ha aprobado la imparticion del curso "${curso[0].nombreC}", por las siguientes razones:</p>
                                   <p>${correccion}</p> `
                    
                    enviarCorreo(curso[0].correo, asunto, mensaje)
                    res.redirect('/solicitud/ver-solicitudes')
                }
            })
        }
    })
} 

function enviarDescripcionCursoPost(req, res){
    let idCurso = req.params.idCurso

    CursosUsuariosModel.obtenerCursosUsuariosPorIdCurso(idCurso, (error, RyI) => {
        if(error){
            res.json({ curso: `${error}`})
        }else{
            CursoModel.obtenerCursoPorId(idCurso, (error, curso) => {
                if(error){
                    res.json({ curso: `${error}`})
                }else{
                    res.json({RyI, curso})
                }
            })
        }
    })
}

module.exports = {
    crearSolicitudGet,
    crearSolicitudPost,
    editarRegistroGet,
    editarRegistroPost,
    cancelarRegistroGet,
    enviarRegistroPost,
    verSolicitudesGet,
    aprobarGet,
    noAprobarPost,
    enviarDescripcionCursoPost
}