'use strict'

const nodemailer = require('nodemailer'),
    emisor = 'cursosunisonnoreply@gmail.com',
    transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            type: 'OAuth2',
            user: emisor,
            clientId: '389431071357-kg8djnh907es5grtr8ra0lrgaked3b2k.apps.googleusercontent.com',
            clientSecret: 'vMsRfvu7XiJy5PG0r5xqabKv',
            refreshToken: '1/2ifn6aAkfXMQIip0PheQGDRUGufW6mXNRN-G-Vn6zpU'
          }
    })

function enviarCorreo (res, receptor, asunto, mensajeHTML) {  
    let mailOptions = {
        from: `"Cursos Extracurriculares UNISON" <${emisor}>`,
        to: receptor,
        subject: asunto,
        html: mensajeHTML
    }

    transporter.sendMail(mailOptions, (err, info) => {
        if (err){
            console.log(`Error al enviar correo: ${err}`)
        }else{
            console.log(`Se envio correctamente el correo a ${receptor}`)
        }
    })  
}

module.exports = enviarCorreo