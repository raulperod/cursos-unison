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
			console.log(data)
            var arreglo=Object.values(data);
            if(arreglo[1] == 0){
				$('#editarModel').modal('show')
			}else if(arreglo[1] == 1){
				$('#error1Model').modal('show')
			}else if(arreglo[1] == 2){
				$('#error2Model').modal('show')
			} 
        }
    });
}