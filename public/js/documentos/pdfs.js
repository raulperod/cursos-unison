document.write("<"+"script type='text/javascript' src='../../public/js/documentos/imagen.js'><"+"/script>")
$(function(){
	$('.pdf').click(function(){
      var clases = $(this).attr("class");
      var listaDeClases = clases.split(' ');
      var idCurso = listaDeClases[3]
      obtenerMensaje(idCurso)
   });
   $('.pdf2').click(function(){
      var clases = $(this).attr("class");
      var listaDeClases = clases.split(' ');
      var idCurso = listaDeClases[3]
      obtenerMensaje2(idCurso)
   });
   $('.pdf3').click(function(){
      var clases = $(this).attr("class");
      var listaDeClases = clases.split(' ');
      var idCurso = listaDeClases[3]
      obtenerMensaje3(idCurso)
   });
});

function obtenerMensaje(idCurso) {
	$.ajax({
        url: '/solicitud/enviar-descripcion/'+idCurso,
        type: 'POST',
        success : function(data) {
            var curso = data.curso
            var representante = data.representante
            
            generarRegistro(curso, representante.correo)
            generarSolicitudCurso(representante.nombreU, curso.nombre, curso.departamento)
        }
    });
}

function obtenerMensaje2(idCurso) {
	$.ajax({
        url: '/informe/enviar-descripcion/'+idCurso,
        type: 'POST',
        success : function(data) {
            if(data.error != 1){
               var informe = data.informe
               var evaluacionesCurso = data.evaluacionesCurso
               var evaluacionesInstructor = data.evaluacionesInstructor
               var participantes = data.participantes // nombreU
               var aprobados = data.aprobados // nombreCompleto
               
               generarEvaluacionInstructor(informe.nombreCurso, evaluacionesInstructor)
               generarEvaluacionCurso(informe.nombreCurso, evaluacionesCurso)
               generarInforme(informe)
               generarSolicitudInforme(informe.nombreRepresentante, informe.nombreCurso,informe.departamento)
            }
        }
    });
}

function obtenerMensaje3(idCurso) {
	$.ajax({
        url: '/curso/enviar-aprobados/'+idCurso,
        type: 'POST',
        success : function(data) {
            if(data.error != 1){
               var curso = data.curso
               var aprobados = data.aprobados
               
               // curso { nombre, duracion, fechaInicial, fechaFinal  }
               // aprobados { [{nombreCompleto},{nombreCompleto}, .....]}
               generarConstancia(curso, aprobados)
            }
        }
    });
}

//la funcion que genera la carta para solicitud de evaluacion del curso esos serian de inicio los parametros que ocupa
function generarSolicitudCurso(nombreRepresentante,nombreCurso,departamento) {
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
                'MTC del '+departamento
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

function generarRegistro(curso, correo) {
      //obtener en formato bien la fecha inicial y la fecha final del curso
      var fechaI=curso.fechaInicio;
      var fechaF=curso.fechaFinal;
      var elem = fechaI.split('-');
      anoI = elem[0];
      mesI = obtenerMes(elem[1]);
      aux=elem[2].split('T');
      diaI = aux[0];
      var elem = fechaF.split('-');
      anoF = elem[0];
      mesF = obtenerMes(elem[1]);
      console.log(mesF);
      aux=elem[2].split('T');
      diaF = aux[0];
      //Aqui ya tengo las fechas
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
                        [{text: 'Nombre del curso:',style: [ 'campo']}, {text: curso.nombre,style:['texto']}],
                        [{text: 'División:',style: [ 'campo']}, {text: curso.division,style:['texto']}],
                        [{text: 'Departamento:',style: [ 'campo']}, {text: curso.departamento,style:['texto']}],
                        [{text: 'Carácter:',style: [ 'campo']}, {text: curso.caracter,style:['texto']}],
                        [{text: 'Objetivo General:',style: [ 'campo']}, {text: curso.objetivoGeneral,style:['texto']}],
                        [{text: 'Objetivos Específicos:',style: [ 'campo']}, {text: curso.objetivosEspecificos,style:['texto']}],
                        [{text: 'Contenido sintético:',style: [ 'campo']}, {text: curso.contenidoSintetico,style:['texto']}],
                        [{text: 'Forma de conducción del proceso enseñanza-aprendizaje:',style: [ 'campo']}, {text: curso.formaEnsenanza,style:['texto']}],
                        [{text: 'Requisitos de evaluación:',style: [ 'campo']}, {text: curso.requisitosDeEvaluacion,style:['texto']}],
                        [{text: 'Bibliografía:',style: [ 'campo']}, {text: curso.bibliografia,style:['texto']}],
                        [{text: 'Perfil académico deseable del responsable de la materia:',style: [ 'campo']}, {text: curso.perfilAcademico,style:['texto']}],
                        [{text: 'Capacidad de autofinanciamiento:',style: [ 'campo']}, {text: curso.capacidadAutoFin,style:['texto']}],
                        [{text: 'Utilidad y oportunidad en funcion del programa:',style: [ 'campo']}, {text: curso.utilidad,style:['texto']}],
                        [{text: 'Experiencia, calidad profesional y academica del instructor:',style: [ 'campo']}, {text: 'Se adjunta',style:['texto']}],
                        [{text: 'Antecedentes o habilidades necesarias de los alumnos:',style: [ 'campo']}, {text: curso.antecedentesAlumnos,style:['texto']}],
                        [{text: 'Duración del programa:',style: [ 'campo']}, {text: curso.duracion,style:['texto']}],
                        [{text: 'Cupo mínimo y máximo:',style: [ 'campo']}, {text: 'de '+curso.cupoMinimo+' a '+curso.cupoMaximo+' participantes',style:['texto']}],
                        [{text: 'Requisitos de idioma:',style: [ 'campo']}, {text: curso.reqIdioma,style:['texto']}],
                        [{text: 'Fecha de inicio y terminación:',style: [ 'campo']}, {text: 'Iniciará el '+diaI+' de '+mesI+ ' del '+anoI+' y terminará el '+diaF+' de '+mesF+ ' del '+anoF,style:['texto']}],
                        [{text: 'Infraestructura necesaria para ofrecer el curso:',style: [ 'campo']}, {text: curso.infraestructuraNecesaria,style:['texto']}],
                        [{text: 'Cargo del instructor:',style: [ 'campo']}, {text: curso.cargoInstructor,style:['texto']}],
                        [{text: 'Dependecia:',style: [ 'campo']}, {text: curso.dependencia,style:['texto']}],
                        [{text: 'Teléfono/Fax:',style: [ 'campo']}, {text: curso.telefono,style:['texto']}],
                        [{text: 'Correo electronico:',style: [ 'campo']}, {text: correo,style:['texto']}],
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
            },
            texto: {
                  margin: [0, 8, 0, 8]
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
//funcion para obtener en letra el mes obtenido
function obtenerMes(mes){
      switch(mes) {
            case '01':
                  mes='Enero';
                  break;
            case '02':
                  mes='Febrero';
                  break;
            case '03':
                  mes='Marzo';
                  break;
            case '04':
                  mes='Abril';
                  break;
            case '05':
                  mes='Mayo';
                  break;
            case '06':
                  mes='Junio';
                  break;
            case '07':
                  mes='Julio';
                  break;
            case '08':
                  mes='Agosto';
                  break;
            case '09':
                  mes='Septiembre';
                  break;
            case '10':
                  mes='Octubre';
                  break;
            case '11':
                  mes='Noviembre';
                  break;
            case '12':
                  mes='Diciembre';
                  break;
      }
      return mes;
}

//la funcion que genera la carta para solicitud de evaluacion del informe del curso esos serian de inicio los parametros que ocupa
function generarSolicitudInforme(nombreRepresentante,nombreCurso,departamento) {
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
               'Solicito, a través de su conducto, que el informe del curso intitulado:',
               { text: nombreCurso, style: [ 'resaltar'],margin: [ 10, 5, 5, 5 ] },
               { text: 'sea presentado ante el H. Consejo Divisional que Usted preside para su valoración, y si es el caso, para su aprobación.\n\n\n', style: 'justificado' },
               'Agradezco su atención y estoy a sus órdenes para cualquier aclaración al respecto.\n\n\n\n\n\n',
               { text: nombreRepresentante, style: 'resaltar' },
               'MTC del '+departamento
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
}

function generarInforme(informe) {
   var docDefinition = {
         content: [
               {
                     style: 'tableExample',
                     color: '#444',
                     table: {
                           widths: [150,'*'],
                           //headerRows: 1,
                           // keepWithHeaderRows: 1,
                           body: [
                                 [{text: 'Informe de curso',style:['titulo'], colSpan: 2, alignment: 'center',color: 'white'}, {}],
                                 [{text: 'Nombre del curso:',style: [ 'campo']}, {text: informe.nombreCurso,style:['texto']}],
                                 [{text: 'I. Nivel de autofinanciamiento',style: [ 'campo']}, {text: informe.nivelAutoFin,style:['texto']}],
                                 [{text: 'II. Número de participantes',style: [ 'campo']}, {text: informe.participantes,style:['texto']}],
                                 [{text: 'III. Número de asistentes que cubrieron los requisitos de egreso',style: [ 'campo']}, {text: informe.participantesAprobados,style:['texto']}],
                                 [{text: 'IV. Cumplimineto de los objetivos del programa',style: [ 'campo']}, {text: informe.cumplimientoObjetivos,style:['texto']}],
                                 [{text: 'V. Número y tipo de instituciones participantes',style: [ 'campo']}, {text: informe.institucionesParticipantes,style:['texto']}],
                                 [{text: 'VI. Evaluación del desempeño de los instructores por los participantes y el responsable',style: [ 'campo']}, {text: 'Se adjunta',style:['texto']}],
                                 [{text: 'VII. Evaluación del desempeño promedio de los participantes por los instructores y el responsable',style: [ 'campo']}, {text: informe.evaluacionPromedioParticipantes,style:['texto']}],
                                 [{text: 'VIII. Evaluación del programa por los participantes',style: [ 'campo']}, {text: 'Se adjunta',style:['texto']}],
                                 [{text: 'IX. Autoevaluación de los participantes en relación al cumplimiento de los objetivos propuestos',style: [ 'campo']}, {text: 'Se adjunta',style:['texto']}],
                                 [{text: 'X. Nivel de vinculación del programa con las necesidades del mercado laboral o de formación profesional',style: [ 'campo']}, {text: informe.nivelVinculacion,style:['texto']}],
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
               },
               texto: {
                     margin: [0, 8, 0, 8]
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
}

function generarEvaluacionCurso(nombreCurso, evaluacion){
   //var nombreCurso='Elaboración de revisiones sistemáticas de literatura en el área de calidad del software';
   //var sugerencias='el final que pedo';      
   var contenido=[];
   for (var i=0; i < evaluacion.length; i++) {
         //GENERAR UNA PAGINA
         contenido.push({ text: '*EVALUACIÓN Y AUTOEVALUACIÓN de los participantes.', style: 'titulo'});
         contenido.push({text:'CURSO/TALLER/ NOMBRE: '+nombreCurso+'\n\n',fontSize: 13});
         contenido.push({
               style: 'tableExample',
               color: '#444',
               table: {
               widths: ['*',100],
               //headerRows: 1,
               // keepWithHeaderRows: 1,
               body: [
                     //[{text: 'Registro de curso',style:['titulo'], colSpan: 2, alignment: 'center',color: 'white'}, {}],
                     [{text: 'El curso',bold: true}, {text:'Calificación',alignment: 'center'}],
                     [{text: '1. De acuerdo a sus expectativas'}, getCalif(evaluacion[i].expectativas)],
                     [{text: '2. La pertinencia de los contenidos fue'}, getCalif(evaluacion[i].pertinencia)],
                     [{text: '3. Los topicos tratados'}, getCalif(evaluacion[i].topicos)],
                     [{text: '4. Los tiempos de presentación'}, getCalif(evaluacion[i].tiempos)],
                     [{text: '5. El logro de los objetivos planteados fue'}, getCalif(evaluacion[i].objetivos)],
                     [{text: '6. Los materiales de apoyo fueron'}, getCalif(evaluacion[i].materiales)],
                     [{text: '7. La aplicación de los conocimientos adquiridos es'}, getCalif(evaluacion[i].aplicacion)],
                     [{text: '8. Los medios tecnológicos usados fueron'}, getCalif(evaluacion[i].medios)],
                     [{text: '9. La cantidad de información fue'}, getCalif(evaluacion[i].informacion)],
                     [{text: '10. En general el programa fue'}, getCalif(evaluacion[i].programa)],
                     [{text: 'Sugerencias para mejorar:\n'+evaluacion[i].sugerencias, colSpan: 2}, {}],
               ]
               }
         });
         if(i<evaluacion.length-1)contenido.push({ text: '', pageBreak:'after'});
         //HASTA AQUi GENERE UNA PAGINA 
   }
   var docDefinition = { 
      content: contenido,   
      styles: {
         titulo: {
               fontSize: 16,
               bold: true,
               margin: [0, 5, 0, 5]
         }
      },
      resaltar: {
         bold: true
      },
      defaultStyle: {
         fontSize: 14,
         alignment: 'left'
      },
      pageMargins: [ 80,80,80,60 ],
      pageSize: 'LETTER',
   };
   pdfMake.createPdf(docDefinition).open();
}

function generarEvaluacionInstructor(nombreCurso, evaluacion) {
   //var nombreCurso='Elaboración de revisiones sistemáticas de literatura en el área de calidad del software';
   //var sugerencias='el final que pedo';      
   var contenido=[];
   for (var i = 0; i < evaluacion.length; i++) {
         //GENERAR UNA PAGINA
         contenido.push({ text: '*EVALUACIÓN Y AUTOEVALUACIÓN de los participantes.', style: 'titulo'});
         contenido.push({text:'CURSO/TALLER/ NOMBRE: '+nombreCurso+'\n\n',fontSize: 13});
         contenido.push({
               style: 'tableExample',
               color: '#444',
               table: {
               widths: ['*',100],
               //headerRows: 1,
               // keepWithHeaderRows: 1,
               body: [
                     //[{text: 'Registro de curso',style:['titulo'], colSpan: 2, alignment: 'center',color: 'white'}, {}],
                     [{text: 'El instructor',bold: true}, {text:'Calificación',alignment: 'center'}],
                     [{text: '1. Dominio del tema'}, getCalif(evaluacion[i].dominio)],
                     [{text: '2. Presentación de conceptos'}, getCalif(evaluacion[i].presentacionDeConceptos)],
                     [{text: '3. Interacción y motivación'}, getCalif(evaluacion[i].interaccionYmotivacion)],
                     [{text: '4. Uso de recursos didácticos y tecnológicos'}, getCalif(evaluacion[i].usoDeRecursosDidacticos)],
                     [{text: '5. Comunicación con el grupo'}, getCalif(evaluacion[i].comunicacionConElGrupo)],
                     [{text: '6. Tutoria'}, getCalif(evaluacion[i].tutoria)],
                     [{text: '7. La extensión de la información (otras fuentes: libros,www,revistas,etc.)'}, getCalif(evaluacion[i].laExtensionDeLaInformacion)],
                     [{text: '8. Estrategias para facilitar el aprendizaje'}, getCalif(evaluacion[i].estrategias)],
                     [{text: '9. En general el desempeño del instructor fue'}, getCalif(evaluacion[i].desempeno)],
                     [{text: 'Sugerencias para mejorar:\n'+evaluacion[i].sugerencias, colSpan: 2}, {}],
               ]
               }
         });
         if(i<evaluacion.length-1)contenido.push({ text: '', pageBreak:'after'});
         //HASTA AQUi GENERE UNA PAGINA 
   }
   var docDefinition = {     
      content: contenido,   
      styles: {
         titulo: {
               fontSize: 16,
               bold: true,
               margin: [0, 5, 0, 5]
         }
      },
      resaltar: {
         bold: true
      },
      defaultStyle: {
         fontSize: 14,
         alignment: 'left'
      },
      pageMargins: [ 80,80,80,60 ],
      pageSize: 'LETTER',
   };
   pdfMake.createPdf(docDefinition).open();
   //pdfMake.createPdf(docDefinition).download('Constancia.pdf');
}

function getCalif(calificacion){
   switch(calificacion) {
         case 0:
               calificacion='Malo';
               break;
         case 1:
               calificacion='Regular';
               break;
         case 2:
               calificacion='Bueno';
               break;
         case 3:
               calificacion='Excelente';
               break;
   }
   return calificacion;
}

//constancias
function generarConstancia(curso, aprobados) {
      //obtener en formato bien la fecha inicial y la fecha final del curso
      var fechaI=curso.fechaInicio;
      var fechaF=curso.fechaFinal;
      var elem = fechaI.split('-');
      anoI = elem[0];
      mesI = obtenerMes(elem[1]);
      aux=elem[2].split('T');
      diaI = aux[0];
      var elem = fechaF.split('-');
      anoF = elem[0];
      mesF = obtenerMes(elem[1]);
      console.log(mesF);
      aux=elem[2].split('T');
      diaF = aux[0];
      //Aqui ya tengo las fechas
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
   //var url;
   var url=regresarImagen();
   var jefeDepartamento=obtenerJefe(curso.departamento);
   var contenido=[];
      for (i = 0; i < aprobados.length; i++) {
            //GENERAR UNA PAGINA
            contenido.push({ text: 'Universidad de Sonora',margin: [ 80,0,0,0 ],bold: true,fontSize: 28});
            contenido.push({ text: 'División de Ciencias Exactas y Naturales',margin: [ 80,0,0,0 ],fontSize: 20 });
            contenido.push({ text: curso.departamento+'\n\n\n',margin: [ 80,0,0,0 ],fontSize: 16 });
            contenido.push({ text: 'Otorga la presente\n\n',style:'centrar',fontSize: 12 });
            contenido.push({ text: 'CONSTANCIA\n\n',style:'centrar',fontSize: 16 });
            contenido.push({ text: 'a\n\n',style:'centrar',fontSize: 12 });
            contenido.push({ text: ''+aprobados[i].nombreCompleto+'\n\n\n',style:'centrar',fontSize: 14,bold:true });
            contenido.push({ text: 'por su asistencia y acreditación del curso intitulado '+curso.nombre+'. El curso, con una duración de '+curso.duracion+' horas, se impartió del '+diaI+' de '+mesI+ ' del '+anoI+' al '+diaF+' de '+mesF+ ' del '+anoF+'.\n\n\n\n'});
            contenido.push({ text: 'Hermosillo, Sonora, México '+dd+' de '+mm+' del '+yyyy+'\n\n\n\n\n\n', style: 'centrar' });
            contenido.push({
                  alignment: 'center',
                  columns: [
                        {
                              decoration: 'overline',
                              text: '   '+jefeDepartamento+'   '
                        },
                        {
                              decoration: 'overline',
                              text: '   Dra. Rosa María Montesinos Cisneros   '
                        }
                  ]
            });
            contenido.push({
                  alignment: 'center',
                  columns: [
                        {
                              text: 'Jefe del '+curso.departamento
                        },
                        {
                              text: 'Directora de la División de Ciencias Exactas y Naturales'
                        }
                  ]
            });
            if(i<aprobados.length-1)contenido.push({ text: '', pageBreak:'after'});
            //HASTA AQUi GENERE UNA PAGINA 
      }
   var docDefinition = {
         header: {
               margin: [ 40,70,10,70 ],
               columns: [
                     {
                        // usually you would use a dataUri instead of the name for client-side printing
                        // sampleImage.jpg however works inside playground so you can play with it
                        image: url,
                        width: 100,
                        height: 100
                     },
                     {
                     }
               ]
         },
         content: contenido, 
         styles: {
               centrar: {
                     alignment: 'center'
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
function obtenerJefe(departamento){
      console.log(departamento);
      switch(departamento) {
            case 'Departamento de Matemáticas':
                  departamento='Dr. Martín Gildardo García Alvarado';
                  break;
            case 'Departamento de Física':
                  departamento='Dr. Ezequiel Rodríguez Jáuregui';
                  break;
            case 'Departamento de Geología':
                  departamento='Dr. Inocente Guadalupe Espinoza Maldonado';
                  break;
      }
      return departamento;
}