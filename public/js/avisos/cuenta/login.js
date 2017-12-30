var datosFormulario, //lo que se va a enviar
    correo,
    pass;
$(function(){

    correo = document.getElementById('correo');
    pass = document.getElementById('password');
    datosFormulario= $('#formLogin');

    $("input:submit").click(function() {
        if(correo.value == "" || pass.value == ""){
            mostrarAviso(5);
            return false;
        }
        if(!correo.value.match('[a-z0-9._%+-]+@[a-z0-9.-]+\.+[a-z]{2,3}$')) {
            mostrarAviso(6);
            return false;
        }
        obtenerMensaje();
        return false;
    });

});
function mostrarAviso(error){
switch(error) {
    case 1:
        $("#aviso").html("<div class='alert alert-danger alert-dismissable'><button type='button' class='close'"
            +"data-dismiss='alert' aria-hidden='true'>&times;</button>Usuario no existe!</div>");
        break;
    case 2:
        $("#aviso").html("<div class='alert alert-danger alert-dismissable'><button type='button' class='close'"
            +"data-dismiss='alert' aria-hidden='true'>&times;</button>Usuario inactivo.</div>");
        break;
    case 3:
        $("#aviso").html("<div class='alert alert-danger alert-dismissable'><button type='button' class='close'"
            +"data-dismiss='alert' aria-hidden='true'>&times;</button>Contraseña incorrecta!</div>");
        break;
    case 5:
        $("#aviso").html("<div class='alert alert-danger alert-dismissable'><button type='button' class='close'"
            +"data-dismiss='alert' aria-hidden='true'>&times;</button>Ambos campos son requeridos!</div>");
        break;
    case 6:
        $("#aviso").html("<div class='alert alert-danger alert-dismissable'><button type='button' class='close'"
            +"data-dismiss='alert' aria-hidden='true'>&times;</button>Ingrese el correo electronico valido!</div>");
        break;     
    default:
        break;
}
}
function obtenerMensaje() {
$.ajax({
    url: '/cuenta/login',
    type: 'POST',
    data: datosFormulario.serialize(),
    success : function(data) {
        if(data.tipo==4){
            window.location.replace("/usuario/mis-cursos");
        }else if(data.tipo==4.5){
            window.location.replace("/solicitud/ver-solicitudes");
        }
        mostrarAviso(data.tipo);
    }
});
}