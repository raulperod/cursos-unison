'use strict'

const nodemailer = require('nodemailer'),
    emisor = 'elcesarin21@gmail.com',
    transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            type: 'OAuth2',
            user: emisor,
            clientId: '408648198858-gdess7ej7tjgc87m4tgocrmsjt1h4nli.apps.googleusercontent.com',
            clientSecret: '3aZm427ktnBi1-q6v4ReAHcV',
            refreshToken: '1/SaWOWB1eVDGEHkCJJgHjUkwPOeTrz9oe2RQfVjTPYVXU4RHhPqrUkp0QmrXSw0p-'
        }
    })

function enviarCorreo (res, receptor, asunto, mensajeHTML) {  
    let mailOptions = {
        from: emisor,
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