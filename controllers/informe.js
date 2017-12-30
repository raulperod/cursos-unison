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
    
}

function aprobarGet(req, res){

}

function noAprobarPost(req, res){
    
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