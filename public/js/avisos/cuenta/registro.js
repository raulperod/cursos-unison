var datosFormulario; //lo que se va a enviar
var correo,name,last,pass,pass2,ocupacion, institucion;
$(function(){

	$("input:submit").click(function() {
		datosFormulario= $('#formNew');
		correo = document.getElementById('correo').value;
		name = document.getElementById('nombre').value;
		last = document.getElementById('apellido').value;
		pass = document.getElementById('pass').value;
		pass2 = document.getElementById('pass2').value;
		institucion = document.getElementById('seleccion').value;
		ocupacion = document.getElementById('ocupacion').value;
		exp = document.getElementById('exp').value;
		//validan si hay campos vacios
		if(correo== "" || name=="" || last=="" || pass=="" || pass2==""){
			mostrarAviso(2);
			return false;
		}
		//valida si es correo electronico
		if(!correo.match('[a-z0-9._%+-]+@[a-z0-9.-]+\.+[a-z]{2,3}$')) {
            mostrarAviso(11);
            return false;
		}
		if(pass!=pass2){
			mostrarAviso(10);
			return false;
		}
		//validar lo de si es maestro de la uni sea con el correo de la uni
		if(institucion=='Universidad de Sonora'){
			if(exp=="") {
				mostrarAviso(14);
				return false;
			}
			if(!exp.match(/^(\d+)$/)) {
				mostrarAviso(12);
				return false;
			}
			if(ocupacion==1){
				if(!correo.match('[a-z0-9._%+-]+@(mat|fisica|geologia)+\.uson\.mx$')) {
					mostrarAviso(13);
					return false;
				}
			}
		}
		obtenerMensaje();
		return false;
	});

});
function mostrarAviso(error){
	switch(error) {
	    case 1:
	        $("#aviso").html("<div class='alert alert-danger alert-dismissable'><button type='button' class='close'"
		 	+"data-dismiss='alert' aria-hidden='true'>&times;</button>¡Usuario repetido!</div>");
	        break;
	    case 2:
	        $("#aviso").html("<div class='alert alert-danger alert-dismissable'><button type='button' class='close'"
		 	+"data-dismiss='alert' aria-hidden='true'>&times;</button>¡Faltan datos por llenar!</div>");
	        break;
	    case 10:
	        $("#aviso").html("<div class='alert alert-danger alert-dismissable'><button type='button' class='close'"
		 	+"data-dismiss='alert' aria-hidden='true'>&times;</button>¡Las contraseñas deben coincidir!</div>");
			break;
		case 11:
	        $("#aviso").html("<div class='alert alert-danger alert-dismissable'><button type='button' class='close'"
		 	+"data-dismiss='alert' aria-hidden='true'>&times;</button>¡Ingrese el correo electronico valido!</div>");
			break;
		case 12:
	        $("#aviso").html("<div class='alert alert-danger alert-dismissable'><button type='button' class='close'"
		 	+"data-dismiss='alert' aria-hidden='true'>&times;</button>¡El expediente es numerico!</div>");
			break;
		case 13:
	        $("#aviso").html("<div class='alert alert-danger alert-dismissable'><button type='button' class='close'"
		 	+"data-dismiss='alert' aria-hidden='true'>&times;</button>¡Se requiere correo institucional si se es Profesor de la UNISON!</div>");
			break;
		case 14:
	        $("#aviso").html("<div class='alert alert-danger alert-dismissable'><button type='button' class='close'"
		 	+"data-dismiss='alert' aria-hidden='true'>&times;</button>¡Se requiere expediente si se pertenece a la UNISON!</div>");
			 break;						
	}
}
function obtenerMensaje() {
	$.ajax({
        url: '/cuenta/registrar',
        type: 'POST',
        data: datosFormulario.serialize(),
        success : function(data) {
            var arreglo=Object.values(data);
        	if(arreglo[1]==3){
				$('#registroModal').modal('show')
			} 
            mostrarAviso(arreglo[1]);
        }
    });
}