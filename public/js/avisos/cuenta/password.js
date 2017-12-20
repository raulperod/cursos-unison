var datosFormulario; //lo que se va a enviar
var correo;
$(function(){
	$("input:submit").click(function() {
		datosFormulario= $('#formValid');
		correo = document.getElementById('correo').value;
		if(correo == ""){
			mostrarAviso(1);
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
		 	+"data-dismiss='alert' aria-hidden='true'>&times;</button>Todos los campos son necesarios!</div>");
            break;
        case 2:
	        $("#aviso").html("<div class='alert alert-danger alert-dismissable'><button type='button' class='close'"
		 	+"data-dismiss='alert' aria-hidden='true'>&times;</button>Usuario inexistente!</div>");
            break;	
        case 3:
	        $("#aviso").html("<div class='alert alert-success alert-dismissable'><button type='button' class='close'"
		 	+"data-dismiss='alert' aria-hidden='true'>&times;</button>Se envio correctamente la nueva contraseña al correo!</div>");
	        break;
	}
}
function obtenerMensaje() {
	$.ajax({
        url: '/cuenta/olvidar-contrasena',
        type: 'POST',
        data: datosFormulario.serialize(),
        success : function(data) {
            var arreglo=Object.values(data);
            mostrarAviso(arreglo[1]);
        }
    });
}