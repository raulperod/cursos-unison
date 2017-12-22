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
		 	+"data-dismiss='alert' aria-hidden='true'>&times;</button>No existe un usuario con ese correo!</div>");
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
            if(arreglo[1] == 3) window.location.replace("/usuario/mis-cursos");
            mostrarAviso(arreglo[1]);
        }
    });
}