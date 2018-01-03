var datosFormulario; //lo que se va a enviar
var nombre, correo;
$(function(){

	$("input:submit").click(function() {
		datosFormulario= $('#formCS');
		nombre = document.getElementById('nombre').value;
        correo = document.getElementById('correo').value;
		if(nombre == "" || correo ==""){
			mostrarAviso(1);
			return false;
		}
		//valida si es correo electronico
		if(!correo.match('[a-z0-9._%+-]+@[a-z0-9.-]+\.+[a-z]{2,3}$')) {
            mostrarAviso(10);
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
		 	+"data-dismiss='alert' aria-hidden='true'>&times;</button>¡Todos los campos son necesarios!</div>");
			break;
		case 2:
	        $("#aviso").html("<div class='alert alert-danger alert-dismissable'><button type='button' class='close'"
		 	+"data-dismiss='alert' aria-hidden='true'>&times;</button>¡No existe un usuario con ese correo!</div>");
			break;
		case 10:
	        $("#aviso").html("<div class='alert alert-danger alert-dismissable'><button type='button' class='close'"
		 	+"data-dismiss='alert' aria-hidden='true'>&times;</button>?Ingrese el correo electrónico valido!</div>");
	        break;					
	}
}
function obtenerMensaje() {
	$.ajax({
        url: '/solicitud/crear-solicitud',
        type: 'POST',
        data: datosFormulario.serialize(),
        success : function(data) {
            var arreglo=Object.values(data);
            if(arreglo[1] == 3){
				$('#crearSolicitudModal').modal('show')
			} 
			mostrarAviso(arreglo[1]);
        }
    });
}