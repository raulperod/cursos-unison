'use strict'

const UsuarioModel = require('../models/usuario'),
    CursoModel = require('../models/curso'),
    CursosUsuariosModel = require('../models/cursos_usuarios'),
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

}

function asistenciaPost(req, res){
    
}

module.exports = {
    inscribirseGet,
    inscribirsePost,
    cancelarPost,
    asistenciaGet,
    asistenciaPost
}