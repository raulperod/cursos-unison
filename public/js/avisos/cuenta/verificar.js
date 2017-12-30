var datosFormulario; //lo que se va a enviar
var codigo;
$(function(){
	$("input:submit").click(function() {
		datosFormulario= $('#formValid');
		codigo = document.getElementById('codigo').value;
		if(codigo == ""){
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
		 	+"data-dismiss='alert' aria-hidden='true'>&times;</button>Ingrese el código!</div>");
            break;
        case 2:
	        $("#aviso").html("<div class='alert alert-danger alert-dismissable'><button type='button' class='close'"
		 	+"data-dismiss='alert' aria-hidden='true'>&times;</button>Código de verificación incorrecto!</div>");
	        break;	
	}
}
function obtenerMensaje() {
	$.ajax({
        url: datosFormulario.attr("action"),
        type: 'POST',
        data: datosFormulario.serialize(),
        success : function(data) {
            var arreglo=Object.values(data);
        	if(arreglo[1]==3){
				$('#verificarModal').modal('show')
			} 
			mostrarAviso(arreglo[1]);
        }
    });
}