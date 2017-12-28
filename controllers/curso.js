'use strict'

const UsuarioModel = require('../models/usuario'),
    CursoModel = require('../models/curso'),
    CursosUsuariosModel = require('../models/cursos_usuarios'),
    CursosUsuariosAsistenciaModel = require('../models/cursos_usuarios_asistencia'),
    CursosUsuariosEvaluacionParticipantesModel = require('../models/cursos_usuarios_evaluacion_participantes'),
    EvaluacionCursoModel = require('../models/cursos_usuarios_evaluacion_curso'),
    EvaluacionInstructorModel = require('../models/cursos_usuarios_evaluacion_instructor'),
    enviarCorreo = require('./correo'),
    bcrypt = require('bcrypt-nodejs')

function inscribirseGet(req, res) {
    let idCurso = req.params.idCurso,
        usuario = req.session.user

    CursosUsuariosModel.obtenerDescripcionCursoPorId(idCurso, (error, curso) => {
        if(error || curso == null){
            res.redirect('/usuario/ver-cursos')
        }else{
            res.render('./curso/inscribirse', {usuario, curso})
        }
    })
}

function inscribirsePost(req, res) {
    let idCurso = req.params.idCurso,
        usuario = req.session.user

    // comprueba si esta inscrito en el curso
    CursosUsuariosModel.siCurso(usuario.idUsuario, idCurso, (error, len) => {
        if(error || len == 1){
            req.session.errorCupo = true
            res.redirect('/usuario/ver-cursos')
        }else{
            CursoModel.obtenerCursoPorId(idCurso, (error, curso) => {
                if(error || curso == null){
                    res.redirect('/usuario/ver-cursos')
                }else if(curso.numeroDeParticipantes < curso.cupoMaximo){ // hay cupo
                    curso.numeroDeParticipantes += 1
                    let cursoUsuario = [
                        [usuario.idUsuario, idCurso, 1] // participante
                    ]         
                    CursosUsuariosModel.crearCursosUsuarios(cursoUsuario, (error) => {})
                    CursoModel.actualizarCurso({idCurso, numeroDeParticipantes: curso.numeroDeParticipantes}, (error) => {})
                    CursosUsuariosEvaluacionParticipantesModel.crearEvaluacion({idCurso, idUsuario:usuario.idUsuario}, (error) => {})
                    res.redirect('/usuario/mis-cursos')
                }else{ // no hay cupo
                    req.session.errorInscripcion = true
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

    CursosUsuariosAsistenciaModel.obtenerAsistenciaPorIdCurso(idCurso, (error, asistencias) => {
        if(error){
            console.log(error)
            res.redirect('/usuario/mis-cursos')
        }else if(asistencias.length == 0){
            // busco los participantes
            CursosUsuariosModel.obtenerParticipantesPorIdCurso(idCurso, (error, participantes) => {
                if(error){
                    console.log(error)
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
        }else{
            res.render('./curso/pasar_asistencia', {usuario, asistencias})
        }
    })
}

function obtenerDiaActual(){
    let date = new Date(),
        day = date.getDate(),
        month = date.getMonth(),
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

    // verifico si ya evaluo
    CursosUsuariosEvaluacionParticipantesModel
        .obtenerSiEvaluo(idCurso, usuario.idUsuario, (error, evaluaciones) => {
            if(error){
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

    // verifico si ya evaluo
    CursosUsuariosEvaluacionParticipantesModel
        .obtenerSiEvaluo(idCurso, usuario.idUsuario, (error, evaluaciones) => {
            if(error){
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

module.exports = {
    inscribirseGet,
    inscribirsePost,
    cancelarPost,
    asistenciaGet,
    asistenciaPost,
    evaluacionCursoGet,
    evaluacionCursoPost,
    evaluacionInstructorGet,
    evaluacionInstructorPost
}