'use strict'

const UsuarioModel = require('../models/usuario'),
    CursoModel = require('../models/curso'),
    CursosUsuariosModel = require('../models/cursos_usuarios'),
    CursosUsuariosEvaluacionParticipantesModel = require('../models/cursos_usuarios_evaluacion_participantes'),
    InformesCursosModel = require('../models/informes_de_cursos'),
    EvaluacionCursoModel = require('../models/cursos_usuarios_evaluacion_curso'),
    EvaluacionInstructorModel = require('../models/cursos_usuarios_evaluacion_instructor'),
    enviarCorreo = require('./correo')


function editarInformeGet(req, res){
    let usuario = req.session.user,
        idCurso = req.params.idCurso

    if(usuario.tipo == 2){
        res.redirect('/solicitud/ver-solicitudes')
        return;
    }

    CursosUsuariosModel.obtenerResponsableYintructorPorIdCurso(idCurso, (error, curso) => {
        if(error || curso.length < 2 || curso[0].idUsuario != usuario.idUsuario){
            // si no es el responsable o hubo algun error
            res.redirect('/usuario/mis-cursos')
        }else{
            InformesCursosModel.obtenerInformePorIdCurso(idCurso, (error, informe) => {
                if(error || typeof informe == 'undefined'){
                    // creo el informe
                    CursosUsuariosEvaluacionParticipantesModel
                    .obtenerAprobadosPoridCurso(idCurso, (error, aprobados) => {
                        if(error){
                            res.redirect('/usuario/mis-cursos')
                        }else{
                            // creo el informe
                            let nuevo_informe = {
                                idCurso,
                                participantes: aprobados.numeroDeParticipantes,
                                participantesAprobados: aprobados.num_aprobados
                            }
                            InformesCursosModel
                            .crearInforme(nuevo_informe, (error) => { 
                                if(error) console.log(error)
                                res.redirect('/informe/editar-informe/'+idCurso)
                            })
                        }
                    })
                }else{
                    res.render('./informe/editar_informe', {usuario, informe})
                }
            })
        }
    })
}

function editarInformePost(req, res){
    let usuario = req.session.user,
        idCurso = req.params.idCurso,
        informe = req.body

    informe.idCurso = idCurso

    InformesCursosModel.actualizarInforme(informe, (error) => {
        if(error) console.log(error)
        res.redirect('/usuario/mis-cursos')
    })
}

function enviarInformePost(req, res){
    let usuario = req.session.user,
        idCurso = req.params.idCurso

    InformesCursosModel.obtenerInformePorIdCurso(idCurso, (error, informe) => {
        if(error || typeof informe == 'undefined' || comprobarInforme(informe)){
            req.session.enviarInformeError = true;
            res.redirect('/usuario/mis-cursos')
        }else{
            // cambio el estado del curso
            let cursoUp = {idCurso, estado:5}
            CursoModel.actualizarCurso(cursoUp, (error) => {
                if(error){
                    req.session.enviarInformeError = true;
                    res.redirect('/usuario/mis-cursos')
                }else{
                    req.session.enviarInformeCorrecto = true;
                    res.redirect('/usuario/mis-cursos')
                }
            })
        }
    })
}

function comprobarInforme(informe){
    for(let llave in informe){
        let atributo = informe[llave]
        if(atributo == '' || atributo == null) return true
    }
    return false;
}

function enviarDescripcionInformePost(req, res){
    // carta // nombre del representante y el nombre del curso
    // informe // nombre del curso y informe
    // evaluaciones // evaluaciones curso, evaluaciones instructor 
    let idCurso = req.params.idCurso
    // obtengo el informe
    InformesCursosModel
    .obtenerDescripcionInformePorIdCurso(idCurso, (error, informe) => {
        if(error){
            console.log(error)
            res.json({error: 1})
        }else{
            // obtengo las evaluaciones del curso
            EvaluacionCursoModel.obtenerEvaluacionesPorIdCurso(idCurso, (error, evaluacionesCurso) =>{
                if(error){
                    console.log(error)
                    res.json({error: 1})
                }else{
                    // obtengo las evaluaciones del instructor
                    EvaluacionInstructorModel.obtenerEvaluacionesPorIdCurso(idCurso, (error, evaluacionesInstructor) => {
                        if(error){
                            console.log(error)
                            res.json({error: 1})
                        }else{
                            res.json({informe, evaluacionesCurso, evaluacionesInstructor, error: 0})
                        }
                    })
                }
            })
        }
    })
}

function verInformesGet(req, res){
    let usuario = req.session.user

    if(usuario.tipo < 2){
        res.redirect('/usuario/mis-cursos')
        return;
    }

    CursosUsuariosModel.obtenerInformes((error, informes) => {
        if(error){
            informes = []
            res.render('./informe/ver_informes', {informes, usuario})
        }else{
            informes = obtenerInformesOrdenados(informes)
            res.render('./informe/ver_informes', {informes, usuario})
        }
    })
}

function obtenerInformesOrdenados(informes){
    let informesOrdenados = []
    
    for(let i=0 ; i<informes.length ; i+=2){
        let informe = {}
        informe.idCurso = informes[i].idCurso
        informe.nombreC = informes[i].nombreC
        informe.nombreR = informes[i].nombreU
        informe.nombreI = informes[i+1].nombreU
        informesOrdenados.push(informe)
    }
    return informesOrdenados
}

function aprobarGet(req, res){
    let usuario = req.session.user,
        idCurso = req.params.idCurso

    if(usuario.tipo < 2){
        res.redirect('/usuario/mis-cursos')
        return;
    }

    CursosUsuariosModel.obtenerResponsableYintructorPorIdCurso(idCurso, (error, curso) => {
        if(error || curso.length < 2){
            res.redirect('/informe/ver-informes')
        }else{ 
            // cambio el estado del curso
            let cursoUp = {idCurso, estado:6}

            CursoModel.actualizarCurso(cursoUp, (error) => {
                if(error){
                    res.redirect('/informe/ver-informes')
                }else{
                    // mandar correo al responsable
                    let asunto = 'Se a aprobado el informe del curso!',
                        mensaje = `<p>El H. Consejo Divisional ha aprobado el informe del curso "${curso[0].nombreC}".</p>`
                    
                    enviarCorreo(curso[0].correo, asunto, mensaje)
                    res.redirect('/informe/ver-informes')
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
            res.redirect('/informe/ver-informes')
        }else{ 
            // cambio el estado del curso
            let cursoUp = {idCurso, estado:5}

            CursoModel.actualizarCurso(cursoUp, (error) => {
                if(error){
                    res.redirect('/informe/ver-informes')
                }else{
                    // mandar correo al responsable
                    let asunto = 'No se aprobo el informe del curso...',
                        mensaje = `<p>El H. Consejo Divisional no ha aprobado el informe del curso "${curso[0].nombreC}", por las siguientes razones:</p>
                                   <p>${correccion}</p> `
                    
                    enviarCorreo(curso[0].correo, asunto, mensaje)
                    res.redirect('/informe/ver-informes')
                }
            })
        }
    })
}

module.exports = {
    editarInformeGet,
    editarInformePost,
    enviarInformePost,
    enviarDescripcionInformePost,
    verInformesGet,
    aprobarGet,
    noAprobarPost
}