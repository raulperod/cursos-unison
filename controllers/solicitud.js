'use strict'

const UsuarioModel = require('../models/usuario'),
    CursoModel = require('../models/curso'),
    CursosUsuariosModel = require('../models/cursos_usuarios'),
    CursosUsuariosEvaluacionParticipantesModel = require('../models/cursos_usuarios_evaluacion_participantes'),
    enviarCorreo = require('./correo')

function crearSolicitudGet(req, res) {
    let usuario = req.session.user

    if(usuario.tipo == 1){
        res.render('./solicitud/crear_solicitud', {usuario})
    }else if(usuario.tipo == 0){
        res.redirect('/usuario/mis-cursos')
    }else{
        res.redirect('/solicitud/ver-solicitudes')
    }
    
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
                    if(error){
                        res.json({msg:'Error base de datos', tipo: 2})
                    }else{
                        CursosUsuariosEvaluacionParticipantesModel.crearEvaluacion({idCurso:id, idUsuario:usuario.idUsuario}, (error) => {})
                        res.json({msg:'se agrego correctamente', tipo: 3})
                    }
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
                                CursosUsuariosEvaluacionParticipantesModel.crearEvaluacion({idCurso:id, idUsuario:usuario.idUsuario}, (error) => {})
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
        if(error || tipo == null || typeof tipo == 'undefined' || tipo < 2){
            if(usuario.tipo < 2){
                res.redirect('/usuario/mis-cursos')
            }else{
                res.redirect('/solicitud/ver-solicitudes')
            }
        }else{
            CursoModel.obtenerCursoPorId(idCurso, (error, registro) => {
                if(error || registro == null){
                    res.redirect('/usuario/mis-cursos')
                }else{
                    registro = acomodarFecha(registro)
                    res.render('./solicitud/editar_registro', {usuario, tipo, registro})
                }
            })
        }
    })
}

function acomodarFecha(registro){
    let registro2 = registro,
        fechaInicio = registro2.fechaInicio,
        fechaFinal = registro2.fechaFinal
       
    try{
        fechaInicio = formatearFecha(fechaInicio)
        fechaFinal = formatearFecha(fechaFinal)
    }catch(error){
        fechaInicio = '0000-00-00'
        fechaFinal = '0000-00-00'
    }

    registro2.fechaInicio = fechaInicio
    registro2.fechaFinal = fechaFinal

    return registro2
}

function formatearFecha(fecha){
    let dia = fecha.getDate(), 
        mes = fecha.getMonth()+1, 
        año = fecha.getFullYear()
    
    if(dia < 10) dia = '0' + dia
    if(mes < 10) mes = '0' + mes
    
    return año + '-' + mes  + '-' + dia
}

function editarRegistroPost(req, res){
    let registro = req.body
    registro.idCurso = req.params.idCurso
    let tipo = comprobarFecha(registro)
    
    if(tipo > 0){
        res.json({msg:`Hubo un error en las fechas`, tipo})
        return
    }

    CursoModel.actualizarCurso(registro, (error) => {
        if(error){
            res.json({msg:`${error}`, tipo:3})
        }else{
            res.json({msg:`Cambios correctamente`, tipo:0})
        }
    })    
}

function comprobarFecha(registro){
    let fechaInicio = new Date(registro.fechaInicio),
        fechaFinal = new Date(registro.fechaFinal),
        fechaActual = new Date()
    
    let day = fechaActual.getDate(),
        month = fechaActual.getMonth()+1,
        year = fechaActual.getFullYear()

    let fecha15 = new Date(year + '-' + month + '-' + day) 
    fecha15.setDate(fecha15.getDate()+15)
    
    if(fechaFinal < fechaInicio) return 1
    if(fechaInicio < fecha15) return 2
    return 0
}

function cancelarRegistroGet(req, res){
    let idCurso = req.params.idCurso,
        usuario = req.session.user

    CursosUsuariosModel.obtenerResponsableYintructorPorIdCurso(idCurso, (error, curso) => {
        if(error || curso.length == 0 || curso == null){
            if(usuario.tipo < 2){
                res.redirect('/usuario/mis-cursos')
            }else{
                res.redirect('/solicitud/ver-solicitudes')
            }
        }else if(curso[0].idUsuario == usuario.idUsuario){
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
        }else if(usuario.tipo == 2){
            res.redirect('/solicitud/ver-solicitudes')
        }else{
            res.redirect('/usuario/mis-cursos')
        }
    })
} 

function enviarRegistroPost(req, res){
    let idCurso = req.params.idCurso

    CursoModel.obtenerCursoPorId(idCurso, (error, curso) => {
        if(error || typeof curso == 'undefined' || comprobarCurso(curso)){
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

    if(usuario.tipo < 2){
        res.redirect('/usuario/mis-cursos')
        return;
    }

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

    if(usuario.tipo < 2){
        res.redirect('/usuario/mis-cursos')
        return;
    }

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
            res.json({ error: 1})
        }else{
            CursoModel.obtenerCursoPorId(idCurso, (error, curso) => {
                if(error){
                    res.json({ error: 1})
                }else{
                    res.json({representante: RyI[0], curso, error: 0})
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