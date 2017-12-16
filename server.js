'use strict'

const app = require('./app')
// servidor ejecutandose
app.listen(app.get('port'), () => {
    console.log(`Aplicacion corriendo en el puerto ${app.get('port')}`)
})