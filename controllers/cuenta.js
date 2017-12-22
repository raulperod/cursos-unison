'use strict'

const UsuarioModel = require('../models/usuario'),
    bcrypt = require('bcrypt-nodejs'),
    enviarCorreo = require('./correo')

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
                    (/*password === usuario.password || */bcrypt.compareSync(password, usuario.password)) ? resolve(true) : reject({ msg: 'Error contraseña incorrecta', tipo: 3 })
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

function generarPassword(longitud){
    const caracteres = "abcdefghijkmnpqrtuvwxyzABCDEFGHIJKLMNPQRTUVWXYZ2346789"
    let pass = ""
    for (let i=0 ; i<longitud; i++){
        pass += caracteres.charAt( Math.floor( Math.random() * caracteres.length ) )
    }
    return pass;
}

function olvidarContrasenaGet(req, res) {
    res.render('./cuenta/olvidar_contraseña')
}

function olvidarContrasenaPost(req, res) {
    let usuario = {correo: req.body.correo},
        pass = generarPassword(8)
        
    usuario.password = bcrypt.hashSync(pass)

    UsuarioModel.cambiarPasswordPorCorreo(usuario, (error, id) => {
        if(error || id == -1){ 
            res.json({error: 'correo inexistente', tipo:2})  
        }else{
            let asunto = '¡Nueva contraseña!',
                mensaje = `<p>Tu nueva contraseña es <strong>${pass}</strong>.</p>`

            enviarCorreo(usuario.correo, asunto, mensaje)
            res.json({error: 'se cambio correctamente', tipo:3})   
        }
    })
}

function registrarGet(req, res) {
    res.render('./cuenta/registro')
}

function registrarPost(req, res) {
    // modifico o agrego lo faltante
    req.body.codigoVerificacion = generarPassword(10)
    req.body.tipo = (req.body.tipo == '0') ? 0 : 1
    req.body.password = bcrypt.hashSync(req.body.password)
    delete req.body.password_confirm // borro el de confirmar

    UsuarioModel.crearUsuario(req.body, (error, id) => {
        if(error){
            res.json({msg: 'error', tipo:1, id:-1})
        }else{
            let asunto = '¡Código de verificación!',
                mensaje = `<p>El código de verificación es <strong>${req.body.codigoVerificacion}</strong>.<p>
                           <p>Ingrese al siguiente <a href="http://localhost:3000/cuenta/verificar-correo/${id}">enlace</a> para introducir el código de validación</p>`

            enviarCorreo(req.body.correo, asunto, mensaje)
            res.json({msg:'correcto', tipo:3, id})
        }
    })
}

function logout(req, res) {
    // cierra la sesion del usuario
    req.session = null
    // te redirecciona al inicio
    res.redirect("/cuenta/login")
}

function verificarCorreoGet(req, res) {
    UsuarioModel.comprobarEstadoPorId(req.params.idUsuario, (error, usuario) => {
        if(error || usuario.estado > 0){
            res.redirect('/cuenta/login')
        }else{
            res.render('./cuenta/verificar_correo', {idUsuario: req.params.idUsuario})
        }
    })
}

function verificarCorreoPost(req, res) {
    let idUsuario = req.params.idUsuario,
        codigoVerificacion = req.body.codigoVerificacion

    UsuarioModel.obtenerUsuarioPorId(idUsuario, (error, usuario) => {
        if(error){
            res.json({error, tipo:0})
        }else{
            if(codigoVerificacion == usuario.codigoVerificacion){ // lo puso bien
                // cambio su estado        
                UsuarioModel.actualizarUsuario({idUsuario, estado:1}, (error) => {
                    if(error){
                        res.json({error, tipo:0})
                    }else{
                        req.session.user = usuario
                        res.json({error, tipo:3})
                    }
                })    
            }else{ // lo puso mal
                res.json({error: 'codigo incorrecto', tipo:2})
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