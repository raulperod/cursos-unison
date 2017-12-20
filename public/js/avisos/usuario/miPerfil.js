var datosFormulario; //lo que se va a enviar
var passold,passnew,passnew2;
$(function(){

	$("input:submit").click(function() {
		datosFormulario= $('#formMP');
		passold = document.getElementById('passold').value;
        passnew = document.getElementById('passnew').value;
        passnew2 = document.getElementById('passnew2').value;
		if(passold == "" || passnew =="" || passnew2 ==""){
			mostrarAviso(1);
			return false;
		}else if(passnew!=passnew2){
			mostrarAviso(3);
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
		 	+"data-dismiss='alert' aria-hidden='true'>&times;</button>Todos los campos de contraseña son necesarios!</div>");
			break;
		case 2:
	        $("#aviso").html("<div class='alert alert-danger alert-dismissable'><button type='button' class='close'"
		 	+"data-dismiss='alert' aria-hidden='true'>&times;</button>La contraseña actual es incorrecta!</div>");
	        break;	
	    case 3:
	        $("#aviso2").html("<div class='alert alert-danger alert-dismissable'><button type='button' class='close'"
		 	+"data-dismiss='alert' aria-hidden='true'>&times;</button>Las contraseñas no coinciden!</div>");
			break;
		case 4:
	        $("#aviso2").html("<div class='alert alert-success alert-dismissable'><button type='button' class='close'"
		 	+"data-dismiss='alert' aria-hidden='true'>&times;</button>La contraseña se cambio correctamente!</div>");
	        break;			
	}
}
function obtenerMensaje() {
	$.ajax({
        url: '/usuario/mi-perfil',
        type: 'POST',
        data: datosFormulario.serialize(),
        success : function(data) {
            var arreglo=Object.values(data);
            mostrarAviso(arreglo[1]);
        }
    });
}