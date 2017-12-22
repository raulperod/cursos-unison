var datosFormulario; //lo que se va a enviar
var correo,name,last,pass,pass2;
$(function(){

	$("input:submit").click(function() {
		datosFormulario= $('#formNew');
		correo = document.getElementById('correo').value;
		name = document.getElementById('nombre').value;
		last = document.getElementById('apellido').value;
		pass = document.getElementById('pass').value;
        pass2 = document.getElementById('pass2').value;
        exp = document.getElementById('exp').value;
		if(correo== "" || name=="" || last=="" || pass=="" || pass2=="" || exp==""){
			mostrarAviso(2);
			return false;
		}
		if(pass!=pass2){
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
		 	+"data-dismiss='alert' aria-hidden='true'>&times;</button>Usuario repetido!.</div>");
	        break;
	    case 2:
	        $("#aviso").html("<div class='alert alert-danger alert-dismissable'><button type='button' class='close'"
		 	+"data-dismiss='alert' aria-hidden='true'>&times;</button>Todos los campos son necesarios!</div>");
	        break;
	    case 10:
	        $("#aviso").html("<div class='alert alert-danger alert-dismissable'><button type='button' class='close'"
		 	+"data-dismiss='alert' aria-hidden='true'>&times;</button>Las contraseñas deben coincidir!</div>");
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