'use strict'

const mysql = require('mysql'),
    dbOptions = require('./config'),
    myConnection = mysql.createConnection(dbOptions)

myConnection.connect( err => {
    return (err) ? console.log('Error al conectarse a mysql: '+err.stack) : console.log('Conexion establecida con mysql')
})

module.exports = myConnection