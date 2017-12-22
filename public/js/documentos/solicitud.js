$(function(){
	
});

//la funcion que genera la carta para solicitud de evaluacion del curso esos serian de inicio los parametros que ocupa
function generarSolicitudCurso(nombreRepresentante,nombreCurso) {
    var hoy = new Date();
    var dd = hoy.getDate();
    var mm = hoy.getMonth()+1; //hoy es 0!
    var yyyy = hoy.getFullYear();

    if(dd<10) dd='0'+dd;
    switch(mm) {
          case 1:
                mm='Enero';
                break;
          case 2:
                mm='Febrero';
                break;
          case 3:
                mm='Marzo';
                break;
          case 4:
                mm='Abril';
                break;
          case 5:
                mm='Mayo';
                break;
          case 6:
                mm='Junio';
                break;
          case 7:
                mm='Julio';
                break;
          case 8:
                mm='Agosto';
                break;
          case 9:
                mm='Septiembre';
                break;
          case 10:
                mm='Octubre';
                break;
          case 11:
                mm='Noviembre';
                break;
          case 12:
                mm='Diciembre';
                break;
    }
    var docDefinition = {
          content: [
                { text: 'Hermosillo, Son. '+dd+' de '+mm+' del '+yyyy+'\n\n\n\n\n', style: 'derecha' },
                { text: 'Dra. Rosa María Montesinos Cisneros', style: 'resaltar' },
                'Directora de la División de Ciencias Exactas y Naturales',
                'P r e s e n t e\n\n\n\n',
                'Solicito, a través de su conducto, que el proyecto de curso intitulado:',
                { text: nombreCurso, style: [ 'resaltar'],margin: [ 10, 5, 5, 5 ] },
                { text: 'sea presentado ante el H. Consejo Divisional que Usted preside para su valoración, y si es el caso, para su aprobación.\n\n\n', style: 'justificado' },
                'Agradezco su atención y estoy a sus órdenes para cualquier aclaración al respecto.\n\n\n\n\n\n',
                { text: nombreRepresentante, style: 'resaltar' },
                'MTC del Departamento de Matemáticas'
          ],
          styles: {
                justificado:{
                      alignment: 'justify'
                },
                derecha: {
                      italic: true,
                      alignment: 'right'
                },
                resaltar: {
                      bold: true
                },
                centrar: {
                      alignment: 'center'
                }
          },
          pageMargins: [ 80,80,80,60 ],
          pageSize: 'LETTER',
    };
    pdfMake.createPdf(docDefinition).open();
    //pdfMake.createPdf(docDefinition).download('Constancia.pdf');
}

function generarRegistro(curso) {
    var docDefinition = {
          content: [
                {
                      style: 'tableExample',
                      color: '#444',
                      table: {
                            widths: [75,'*'],
                            //headerRows: 1,
                            // keepWithHeaderRows: 1,
                            body: [
                                  [{text: 'Registro de curso',style:['titulo'], colSpan: 2, alignment: 'center',color: 'white'}, {}],
                                  [{text: 'Nombre del curso:',style: [ 'campo']}, curso.nombre],
                                  [{text: 'División:',style: [ 'campo']}, curso.division],
                                  [{text: 'Departamento:',style: [ 'campo']}, curso.departamento],
                                  [{text: 'Carácter:',style: [ 'campo']}, curso.caracter],
                                  [{text: 'Objetivo General:',style: [ 'campo']}, curso.objetivoGeneral],
                                  [{text: 'Objetivos Específicos:',style: [ 'campo']}, curso.objetivosEspecificos],
                                  [{text: 'Contenido sintético:',style: [ 'campo']}, curso.contenidoSintetico],
                                  [{text: 'Forma de conducción del proceso enseñanza-aprendizaje:',style: [ 'campo']}, curso.formaEnsenanza],
                                  [{text: 'Requisitos de evaluación:',style: [ 'campo']}, curso.requisitosDeEvaluacion],
                                  [{text: 'Bibliografía:',style: [ 'campo']}, curso.bibliografia],
                                  [{text: 'Perfil académico deseable del responsable de la materia:',style: [ 'campo']}, curso.perfilAcademico],
                                  [{text: 'Capacidad de autofinanciamiento:',style: [ 'campo']}, curso.capacidadAutofin],
                                  [{text: 'Utilidad y oportunidad en funcion del programa:',style: [ 'campo']}, curso.utilidad],
                                  [{text: 'Experiencia, calidad profesional y academica del instructor:',style: [ 'campo']}, 'Se adjunta'],
                                  [{text: 'Antecedentes o habilidades necesarias de los alumnos:',style: [ 'campo']}, curso.antecedentesAlumnos],
                                  [{text: 'Duración del programa:',style: [ 'campo']}, curso.duracion],
                                  [{text: 'Cupo mínimo y máximo:',style: [ 'campo']}, 'de '+curso.cupoMinimo+' a '+curso.cupoMaximo+' participantes'],
                                  [{text: 'Requisitos de idioma:',style: [ 'campo']}, curso.reqIdioma],
                                  [{text: 'Fecha de inicio y terminación:',style: [ 'campo']}, 'Iniciara el '+curso.fechaInicio+' y terminara el '+curso.fechaFinal],
                                  [{text: 'Infraestructura necesaria para ofrecer el curso:',style: [ 'campo']}, curso.infraestructuraNecesaria],
                                  [{text: 'Cargo del instructor:',style: [ 'campo']}, curso.cargoInstructor],
                                  [{text: 'Dependecia:',style: [ 'campo']}, curso.dependencia],
                                  [{text: 'Teléfono/Fax:',style: [ 'campo']}, curso.telefono],
                                  [{text: 'Correo electronico:',style: [ 'campo']}, curso.telefono],
                            ]
                      },
                      layout: {
                            fillColor: function (i, node) {
                                  //pinta el titulo de azul mas oscuro
                                  if(i==0)return '#2E64FE';
                                  //auqi pinta cebra las filas
                                  return (i % 2 === 0) ? null : '#CED8F6';
                            }
                      }
                }
          ],
          styles: {
                titulo: {
                      fontSize: 16,
                      bold: true,
                      margin: [0, 5, 0, 5]
                },
                campo: {
                      alignment: 'right',
                      bold: true
                }
          },
          defaultStyle: {
                fontSize: 10,
                alignment: 'justify'
          },
          pageMargins: [ 80,80,80,60 ],
          pageSize: 'LETTER',
    };
    pdfMake.createPdf(docDefinition).open();
    //pdfMake.createPdf(docDefinition).download('Constancia.pdf');
}