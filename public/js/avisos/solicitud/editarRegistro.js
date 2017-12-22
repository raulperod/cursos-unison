var datosFormulario;

$(function(){

	$("input:submit").click(function() {
		datosFormulario= $('#editForm');		
		obtenerMensaje();
		return false;
	});

});

function obtenerMensaje() {
	$.ajax({
        url: datosFormulario.attr('action'),
        type: 'POST',
        data: datosFormulario.serialize(),
        success : function(data) {
            var arreglo=Object.values(data);
            if(arreglo[1] == 1){
				$('#editarModel').modal('show')
			} 
			mostrarAviso(arreglo[1]);
        }
    });
}