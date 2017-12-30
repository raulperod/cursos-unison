'use strict'

const express = require('express'),
    bodyParser = require('body-parser'),
    pug = require('pug'),
    restFul = require('method-override')('_method'),
    config = require('./config'),
    cookieSession = require("cookie-session"),
    CuentaRouter = require('./routes/cuenta'),
    UsuarioRouter = require('./routes/usuario'),
    SolicitudRouter = require('./routes/solicitud'),
    CursoRouter = require('./routes/curso'),
    InformeRouter = require('./routes/informe'),
    session_active = require('./middlewares/session-active'),
    app = express()

app
    // configuracion app
    .set("view engine","pug")
    .set('views', config.VIEWS)
    .set('port',config.PORT)
    // ejecutando middleware
    .use( config.PUBLIC, express.static('public') )
    // parse application/json
    .use( bodyParser.json())
    // parse applicaction/x-www-form-urlencoded
    .use( bodyParser.urlencoded({extended:false}) )
    // para put y delete
    .use( restFul )
    .use(cookieSession({
        name: "session",
        keys: ["cursos","ADO"]
    }))

// cursos-unison/cuenta
app
    .use("/cuenta",CuentaRouter)
// cursos-unison/usuario
app
    .use("/usuario",session_active)  
    .use("/usuario",UsuarioRouter)
// cursos-unison/solicitud
app
    .use("/solicitud",session_active)
    .use("/solicitud",SolicitudRouter)
// cursos-unison/curso
app
    .use("/curso",session_active)
    .use("/curso",CursoRouter)
// cursos-unison/informe
app
    .use("/informe",session_active)
    .use("/informe",InformeRouter)
module.exports = app