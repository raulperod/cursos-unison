'use strict'

const UsuarioModel = require('../models/usuario'),
    CursoModel = require('../models/curso'),
    CursosUsuariosModel = require('../models/cursos_usuarios'),
    CursosUsuariosAsistenciaModel = require('../models/cursos_usuarios_asistencia'),
    CursosUsuariosEvaluacionParticipantesModel = require('../models/cursos_usuarios_evaluacion_participantes'),
    EvaluacionCursoModel = require('../models/cursos_usuarios_evaluacion_curso'),
    EvaluacionInstructorModel = require('../models/cursos_usuarios_evaluacion_instructor'),
    InformesCursosModel = require('../models/informes_de_cursos'),
    enviarCorreo = require('./correo')
    

function inscribirseGet(req, res) {
    let idCurso = req.params.idCurso,
        usuario = req.session.user

    if(usuario.tipo == 2){
        res.redirect('/solicitud/ver-solicitudes')
        return;
    }

    CursosUsuariosModel.obtenerDescripcionCursoPorId(idCurso, (error, curso) => {
        if(error || curso == null){
            res.redirect('/usuario/ver-cursos')
        }else{
            curso.horario = obtenerHorario(curso)
            res.render('./curso/inscribirse', {usuario, curso})
        }
    })
}

function obtenerHorario(curso){
    let fechaInicio = obtenerFecha(curso.fechaInicio),
        fechaFinal = obtenerFecha(curso.fechaFinal),
        duracion = curso.duracion

    return `El curso tiene una duración de ${duracion} horas. Iniciará ${fechaInicio} y terminará ${fechaFinal}.`
}

function obtenerFecha(fecha){
    let dia = fecha.getDate(),
        mes = fecha.getMonth()+1,
        ano = fecha.getFullYear()
    
    switch(mes) {
          case 1:
                mes='enero';
                break;
          case 2:
                mes='febrero';
                break;
          case 3:
                mes='marzo';
                break;
          case 4:
                mes='abril';
                break;
          case 5:
                mes='mayo';
                break;
          case 6:
                mes='junio';
                break;
          case 7:
                mes='julio';
                break;
          case 8:
                mes='agosto';
                break;
          case 9:
                mes='septiembre';
                break;
          case 10:
                mes='octubre';
                break;
          case 11:
                mes='noviembre';
                break;
          case 12:
                mes='diciembre';
                break;
    }
    
    return `el ${dia} de ${mes} del ${ano}`
}

function inscribirsePost(req, res) {
    let idCurso = req.params.idCurso,
        usuario = req.session.user

    // comprueba si esta inscrito en el curso
    CursosUsuariosModel.siCurso(usuario.idUsuario, idCurso, (error, len) => {
        if(error || len == 1){
            req.session.errorInscripcion = true
            res.redirect('/usuario/ver-cursos')
        }else{
            CursoModel.obtenerCursoPorId(idCurso, (error, curso) => {
                if(error || typeof curso == 'undefined' || curso == null){
                    res.redirect('/usuario/ver-cursos')
                }else if(curso.numeroDeParticipantes < curso.cupoMaximo){ // hay cupo
                    curso.numeroDeParticipantes += 1
                    let cursoUsuario = [
                        [usuario.idUsuario, idCurso, 1] // participante
                    ]         
                    CursosUsuariosModel.crearCursosUsuarios(cursoUsuario, (error) => {})
                    CursoModel.actualizarCurso({idCurso, numeroDeParticipantes: curso.numeroDeParticipantes}, (error) => {})
                    CursosUsuariosEvaluacionParticipantesModel.crearEvaluacion({idCurso, idUsuario:usuario.idUsuario}, (error) => {})
                    CursosUsuariosAsistenciaModel.obtenerAsistenciaPorIdCurso(idCurso, (error, asistencia) => {
                        if(!error && asistencia.length > 0){
                            let asistenciaUsuario = [ [usuario.idUsuario, idCurso, obtenerDiaActual()] ]
                            CursosUsuariosAsistenciaModel.crearAsistencia(asistenciaUsuario, (error) => {})
                        }
                    })
                    res.redirect('/usuario/mis-cursos')
                }else{ // no hay cupo
                    req.session.errorCupo = true
                    res.redirect('/usuario/ver-cursos')
                }
            }) 
        }
    })   
}

function cancelarPost(req, res){
    let idCurso = req.params.idCurso,
        razones = req.body.razones

    CursoModel.actualizarCurso({idCurso, estado: 0}, (error) => {
        if(!error){
            CursosUsuariosModel.obtenerParticipantesPorIdCurso(idCurso, (error, participantes) => {
                if(!error && participantes.length > 0){
                    for(let i=0 ; i < participantes.length ; i++){
                        let asunto = `Se ha cancelado el curso "${participantes[i].nombreC}"`,
                            mensaje = `<p>El curso "${participantes[i].nombreC}" ha sido cancelado por las siguientes razones:</p>
                                        <p>${razones}.</p>`
                        enviarCorreo(participantes[i].correo, asunto, mensaje)
                    }
                    res.redirect('/usuario/mis-cursos')
                }
            })
        }
    })
}

function asistenciaGet(req, res){
    let usuario = req.session.user,
        idCurso = req.params.idCurso

    if(usuario.tipo == 2){
        res.redirect('/solicitud/ver-solicitudes')
        return;
    }

    CursosUsuariosAsistenciaModel.obtenerAsistenciaPorIdCurso(idCurso, (error, asistencias) => {
        if(error){
            console.log(error)
            res.redirect('/usuario/mis-cursos')
        }else if(asistencias.length == 0){
            // busco los participantes
            CursosUsuariosModel.obtenerParticipantesPorIdCurso(idCurso, (error, participantes) => {
                if(error || participantes.length == 0  || participantes.length < participantes[0].cupoMinimo){
                    console.log(error)
                    req.session.errorParticipantes = true
                    res.redirect('/usuario/mis-cursos')
                }else{
                    // creas la lista de asistencia
                    let asistencias = [],
                        fecha = obtenerDiaActual()
                    // le meto los participantes del curso
                    for(let i=0 ; i < participantes.length ; i++){
                        asistencias.push([participantes[i].idUsuario, idCurso, fecha])
                    }
                    CursosUsuariosAsistenciaModel.crearAsistencia(asistencias, (error) => {
                        res.redirect('/curso/asistencia/'+idCurso)
                    })
                }
            })
        }else if(asistencias.length < asistencias[0].cupoMinimo){
            req.session.errorParticipantes = true
            res.redirect('/usuario/mis-cursos')
        }else{
            res.render('./curso/pasar_asistencia', {usuario, asistencias})
        }
    })
}

function obtenerDiaActual(){
    let date = new Date(),
        day = date.getDate(),
        month = date.getMonth()+1,
        year = date.getFullYear()

    if (month < 10) month = "0" + month
    if (day < 10) day = "0" + day

    return year + "-" + month + "-" + day
}

function asistenciaPost(req, res){
    let idCurso = req.params.idCurso,
        idUsuario = req.params.idUsuario,
        asistio = req.body.asistio,
        fecha = obtenerDiaActual()

    let asistencia = {
        idUsuario,
        idCurso,
        fecha,
        asistio
    }

    let mensaje = {
        msg: `El usuario ${idUsuario} ${asistio}`
    }
    
    CursosUsuariosAsistenciaModel.actualizarAsistencia(asistencia, (error) => {
        if(error) mensaje.msg = `${error}`
        res.json(mensaje)
    })
}

function evaluacionCursoGet(req, res){
    let idCurso = req.params.idCurso,
        usuario = req.session.user

    if(usuario.tipo == 2){
        res.redirect('/solicitud/ver-solicitudes')
        return;
    }

    // verifico si ya evaluo
    CursosUsuariosEvaluacionParticipantesModel
        .obtenerSiEvaluo(idCurso, usuario.idUsuario, (error, evaluaciones) => {
            if(error || typeof evaluaciones == 'undefined'){
                res.redirect('/usuario/mis-cursos')
            }else if(evaluaciones.evaluacion_curso == 1){
                req.session.errorEvaluacion = true
                res.redirect('/usuario/mis-cursos')
            }else{
                res.render('./curso/evaluar_curso',{usuario, idCurso})
            }
        })
}

function evaluacionCursoPost(req, res){
    let usuario = req.session.user,
        idCurso = req.params.idCurso,
        evaluacion = req.body

    evaluacion.idCurso = idCurso

    EvaluacionCursoModel.crearEvaluacionCurso(evaluacion, (error) => {})
    CursosUsuariosEvaluacionParticipantesModel.actualizarEvaluacion({idUsuario:usuario.idUsuario, idCurso, evaluacion_curso: 1}, (error) => {})

    res.redirect('/usuario/mis-cursos')
}

function evaluacionInstructorGet(req, res){
    let idCurso = req.params.idCurso,
        usuario = req.session.user

    if(usuario.tipo == 2){
        res.redirect('/solicitud/ver-solicitudes')
        return;
    }

    // verifico si ya evaluo
    CursosUsuariosEvaluacionParticipantesModel
        .obtenerSiEvaluo(idCurso, usuario.idUsuario, (error, evaluaciones) => {
            if(error || typeof evaluaciones == 'undefined'){
                res.redirect('/usuario/mis-cursos')
            }else if(evaluaciones.evaluacion_instructor == 1){
                req.session.errorEvaluacion = true
                res.redirect('/usuario/mis-cursos')
            }else{
                res.render('./curso/evaluar_instructor',{usuario, idCurso})
            }
        })
}

function evaluacionInstructorPost(req, res){
    let usuario = req.session.user,
        idCurso = req.params.idCurso,
        evaluacion = req.body

    evaluacion.idCurso = idCurso

    EvaluacionInstructorModel.crearEvaluacionInstructor(evaluacion, (error) => {})
    CursosUsuariosEvaluacionParticipantesModel.actualizarEvaluacion({idUsuario:usuario.idUsuario, idCurso, evaluacion_instructor: 1}, (error) => {})

    res.redirect('/usuario/mis-cursos')
}

function evaluacionParticipantesGet(req, res){
    let usuario = req.session.user,
        idCurso = req.params.idCurso

    if(usuario.tipo == 2){
        res.redirect('/solicitud/ver-solicitudes')
        return;
    }

    CursosUsuariosModel.obtenerResponsableYintructorPorIdCurso(idCurso, (error, curso) => {
        if(error || curso.length < 2 || curso[1].idUsuario != usuario.idUsuario){
            // si no es el instructor o hubo algun error
            res.redirect('/usuario/mis-cursos')
        }else{
            // idUsuario, idCurso, nombre, apellido, inasistencias, aprobo
            CursosUsuariosModel.obtenerParticipantesPorIdCurso(idCurso, (error, participantes) => {
                if(error || participantes.length == 0){
                    console.log(error)
                    res.redirect('/usuario/mis-cursos')
                }else if(participantes.length < participantes[0].cupoMinimo){
                    req.session.errorParticipantes = true
                    res.redirect('/usuario/mis-cursos')
                }else{
                    // obtengo los ids de los participantes
                    let idsUsuario = []
                    for(let i=0 ; i < participantes.length ; i++){
                        idsUsuario.push(participantes[i].idUsuario)
                    }
                    // obtengo las evaluaciones
                    CursosUsuariosEvaluacionParticipantesModel
                    .obtenerEvaluacion(idCurso, idsUsuario, (error, evaluaciones) => {
                        if(error){
                            console.log(error)
                            res.redirect('/usuario/mis-cursos')
                        }else{
                            // obtengo las inasistencias
                            CursosUsuariosAsistenciaModel.obtenerInasistenciasPoridCurso(idCurso, (error, inasistencias) => {
                                if(error){
                                    console.log(error)
                                    res.redirect('/usuario/mis-cursos')
                                }else{
                                    evaluaciones = ponerInasistencia(evaluaciones, inasistencias)
                                    res.render('./curso/evaluar_participantes', {usuario, evaluaciones})
                                }
                            })
                        }
                    })

                }
            })
        }
    })
}

function ponerInasistencia(evaluaciones, inasistencias){
    let evaluacionesAux = evaluaciones,
        inasistenciasAux = inasistencias

    for(let i=0; i<evaluacionesAux.length ; i++){
        evaluacionesAux[i].inasistencia = 0
        for(let j=0;j<inasistenciasAux.length;j++){
            if(inasistenciasAux[j].idUsuario == evaluacionesAux[i].idUsuario){
                evaluacionesAux[i].inasistencia = inasistenciasAux[j].inasistencia
                break;
            }
        }      
    }

    return evaluacionesAux
}

function evaluacionParticipantesPost(req, res){
    let idUsuario = req.params.idUsuario,
        idCurso = req.params.idCurso,
        aprobo = req.body.aprobo,
        evaluacion = {
            idUsuario,
            idCurso,
            aprobo,
            calificado: 1
        }

    CursosUsuariosEvaluacionParticipantesModel
    .actualizarEvaluacion(evaluacion, (error) =>{
        // verifico si hay participantes que no han sido evaluados
        CursosUsuariosModel
        .obtenerParticipantesPorIdCurso(idCurso, (error, participantes) => {
            // obtengo los ids de los participantes
            let idsUsuario = []
            for(let i=0 ; i < participantes.length ; i++){
                idsUsuario.push(participantes[i].idUsuario)
            }
            // obtengo las evaluaciones
            CursosUsuariosEvaluacionParticipantesModel
            .obtenerCursoCalificado(idCurso, idsUsuario, (error, calificado) => {
                if(!error && calificado == 0){
                    // se cambia el estado del curso
                    CursoModel.actualizarCurso({idCurso, estado:4}, (error) => {})
                    res.json({msg:`${idUsuario}, ${idCurso}, ${aprobo}`, termino:1})
                }else{
                    res.json({msg:`${idUsuario}, ${idCurso}, ${aprobo}`, termino:0})
                }
            })
        })
    })
}

function enviarAprobadosPost(req, res){
    // curso { duracion, nombre, fechaInicial, fechaFinal }
    // aprobados { nombre }
    let idCurso = req.params.idCurso

    CursoModel.obtenerCursoPorId(idCurso, (error, curso) => {
        if(error){
            console.log(error)
            res.json({error:1})
        }else{
            CursosUsuariosEvaluacionParticipantesModel
            .obtenerNombreAprobadosPoridCurso(idCurso, (error, aprobados) => {
                if(error){
                    console.log(error)
                    res.json({error:1})
                }else{
                    res.json({curso, aprobados, error:0})
                }
            })
        }
    })
}

module.exports = {
    inscribirseGet,
    inscribirsePost,
    cancelarPost,
    asistenciaGet,
    asistenciaPost,
    evaluacionCursoGet,
    evaluacionCursoPost,
    evaluacionInstructorGet,
    evaluacionInstructorPost,
    evaluacionParticipantesGet,
    evaluacionParticipantesPost,
    enviarAprobadosPost
}