'use strict'

const UsuarioModel = require('../models/usuario'),
    bcrypt = require('bcrypt-nodejs')

function loginGet(req, res) {
    res.render('./cuenta/login')
}

function loginPost(req, res) {
    let correo = req.body.correo.toLowerCase(),
        password = req.body.password

        UsuarioModel.obtenerUsuarioPorCorreo(correo, (error, usuario) =>{
        // declaro la promesa
        let promesa = new Promise((resolve, reject) => {
            (!error) ? resolve(true) : reject({ msg: `Error con la base de datos : ${error}`, tipo: 0 })
        })
        
        // ejecuto la promesa
        promesa
        .then(() => {
            // comprueba si se pudo obtener el usuario
            return new Promise((resolve, reject) => {
                (usuario) ? resolve(true) : reject({ msg: 'Error correo incorrecto', tipo: 1 })
            }) 
        })
        .then(() => {
            // comprueba si el usuario esta activo
            return new Promise((resolve, reject) => {
                (usuario.estado) ? resolve(true) : reject({ msg: 'Error usuario inactivo', tipo: 2 })
            }) 
        })
        .then(() => {
            // comprueba si la contraseña es correcta
            try{
                return new Promise((resolve, reject) => {
                    (password === usuario.password || bcrypt.compareSync(password, usuario.password)) ? resolve(true) : reject({ msg: 'Error contraseña incorrecta', tipo: 3 })
                }) 
            } catch (error){
                return new Promise((resolve, reject) => {
                    (false) ? resolve(true) : reject({ msg: 'Error contraseña incorrecta', tipo: 3 })
                })
            }
        })
        .then(() => {
            // inicia al usuario y sus variables a utlizar
            req.session.user = usuario
            // envia para saber que es correcto
            res.json({msg:'Datos correctos', tipo: 4})
            res.redirect('/cuenta/login')
        })
        .catch( error => {
            // si hubo erro lo manda
            try{
                console.log(error.msg)
                res.json(error)
            } catch (error){
                // no pasa nada
            }
        })
    })
}

function olvidarContrasenaGet(req, res) {
    res.render('./cuenta/olvidar_contraseña')
}

function olvidarContrasenaPost(req, res) {
    res.render('./cuenta/olvidar_contraseña')
}

function registrarGet(req, res) {
    res.render('./cuenta/registro')
}

function registrarPost(req, res) {
    // modifico o agrego lo faltante
    req.body.codigoVerificacion = '12345'
    req.body.tipo = (req.body.tipo == '0') ? 0 : 1
    req.body.password = bcrypt.hashSync(req.body.password)
    delete req.body.password_confirm // borro el de confirmar

    UsuarioModel.crearUsuario(req.body, (error, id) => {
        (error) ? res.json({error: error}) : res.redirect('/cuenta/verificar-correo/'+id)
    })
}

function logout(req, res) {
    // cierra la sesion del usuario
    req.session = null
    // te redirecciona al inicio
    res.redirect("/login")
}

function verificarCorreoGet(req, res) {
    res.render('./cuenta/verificar_correo', {idUsuario: req.params.idUsuario})
}

function verificarCorreoPost(req, res) {
    let idUsuario = req.params.idUsuario,
        codigoVerificacion = req.body.codigoVerificacion

    UsuarioModel.obtenerCodigoVerificacionPorId(idUsuario, (error, usuario) => {
        if(error){
            res.json({error: error})
        }else if(usuario.estado > 0){
            res.redirect('/cuenta/login')
        }else{
            if(codigoVerificacion == usuario.codigoVerificacion){ // lo puso bien
                // cambio su estado        
                UsuarioModel.actualizarUsuario({idUsuario, estado:1}, (error) => {
                    (error) ? res.json({error: 'error al actualizar'}) : res.redirect('/cuenta/login')
                })    
            }else{ // lo puso mal
                res.json({error: 'codigo de verificacion incorrecto'})
            }
        }
    })
}

module.exports = {
    loginGet,
    loginPost,
    olvidarContrasenaGet,
    olvidarContrasenaPost,
    registrarGet,
    registrarPost,
    logout,
    verificarCorreoGet,
    verificarCorreoPost
}