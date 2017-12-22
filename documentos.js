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
    pdfMake.createPdf(docDefinition).download('SolicitudCurso.pdf');
}
//la funcion que genera la carta para solicitud de evaluacion del informe del curso esos serian de inicio los parametros que ocupa
function generarSolicitudInforme(nombreRepresentante,nombreCurso) {
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
    pdfMake.createPdf(docDefinition).download('SolicitudInforme.pdf');
}

//el registro del curso tiene muchos parametros, no se si se podria pasar algo como el objeto curso y de ahi agarrar todo
function generarRegistro() {
    var nombreCurso='Elaboración de revisiones sistemáticas de literatura en el área de calidad del software';
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
                                  [{text: 'Nombre del curso:',style: [ 'campo']}, nombreCurso],
                                  [{text: 'División:',style: [ 'campo']}, nombreCurso],
                                  [{text: 'Departamento:',style: [ 'campo']}, nombreCurso],
                                  [{text: 'Carácter:',style: [ 'campo']}, nombreCurso],
                                  [{text: 'Objetivo General:',style: [ 'campo']}, nombreCurso],
                                  [{text: 'Objetivos Específicos:',style: [ 'campo']}, nombreCurso],
                                  [{text: 'Contenido sintético:',style: [ 'campo']}, nombreCurso],
                                  [{text: 'Forma de conducción del proceso enseñanza-aprendizaje:',style: [ 'campo']}, nombreCurso],
                                  [{text: 'Requisitos de evaluación:',style: [ 'campo']}, nombreCurso],
                                  [{text: 'Bibliografía:',style: [ 'campo']}, nombreCurso],
                                  [{text: 'Perfil académico deseable del responsable de la materia:',style: [ 'campo']}, nombreCurso],
                                  [{text: 'Capacidad de autofinanciamiento:',style: [ 'campo']}, nombreCurso],
                                  [{text: 'Utilidad y oportunidad en funcion del programa:',style: [ 'campo']}, nombreCurso],
                                  [{text: 'Experiencia, calidad profesional y academica del instructor:',style: [ 'campo']}, nombreCurso],
                                  [{text: 'Antecedentes o habilidades necesarias de los alumnos:',style: [ 'campo']}, nombreCurso],
                                  [{text: 'Duración del programa:',style: [ 'campo']}, nombreCurso],
                                  [{text: 'Cupo mínimo y máximo:',style: [ 'campo']}, nombreCurso],
                                  [{text: 'Requisitos de idioma:',style: [ 'campo']}, nombreCurso],
                                  [{text: 'Fecha de inicio y terminación:',style: [ 'campo']}, nombreCurso],
                                  [{text: 'Infraestructura necesaria para ofrecer el curso:',style: [ 'campo']}, nombreCurso],
                                  [{text: 'Cargo del instructor:',style: [ 'campo']}, nombreCurso],
                                  [{text: 'Dependecia:',style: [ 'campo']}, nombreCurso],
                                  [{text: 'Teléfono/Fax:',style: [ 'campo']}, nombreCurso],
                                  [{text: 'Correo electronico:',style: [ 'campo']}, nombreCurso],
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
    
    pdfMake.createPdf(docDefinition).download('RegistroCurso.pdf');
}
//lo mismo que el de registro casi
function generarInforme() {
    var nombreCurso='Elaboración de revisiones sistemáticas de literatura en el área de calidad del software';
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
                                  [{text: 'I. Nivel de autofinanciamiento',style: [ 'campo']}, nombreCurso],
                                  [{text: 'II. Número de participantes',style: [ 'campo']}, nombreCurso],
                                  [{text: 'III. Número de asistentes que cubrieron los requisitos de egreso',style: [ 'campo']}, nombreCurso],
                                  [{text: 'IV. Cumplimineto de los objetivos del programa',style: [ 'campo']}, nombreCurso],
                                  [{text: 'V. Número y tipo de instituciones participantes',style: [ 'campo']}, nombreCurso],
                                  [{text: 'VI. Evaluación del desempeño de los instructores por los participantes y el responsable',style: [ 'campo']}, nombreCurso],
                                  [{text: 'VII. Evaluación del desempeño de los participantes por los instructores y el responsable',style: [ 'campo']}, nombreCurso],
                                  [{text: 'VIII. Evaluación del programa por los participantes',style: [ 'campo']}, nombreCurso],
                                  [{text: 'IX. Autoevaluación de los participantes en relación al cumplimiento de los objetivos propuestos',style: [ 'campo']}, nombreCurso],
                                  [{text: 'X. Nivel de vinculación del programa con las necesidades del mercado laboral o de formación profesional',style: [ 'campo']}, nombreCurso],
                                  [{text: 'Nombre del curso:',style: [ 'campo']}, nombreCurso],
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
    
    pdfMake.createPdf(docDefinition).download('RegistroCurso.pdf');
}
//constancias
function generarInforme() {
      //esta parte saca la fecha que se imprime
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
      var duracion=32;
      var fechaI='3 de septiembre';
      var fechaF='15 de octubre';
      var nombreAlumno='Edelmira Rodríguez Alcántar'
      var nombreCurso='Elaboración de revisiones sistemáticas de literatura en el área de calidad del software';
      var docDefinition = {
            content: [
                  { text: 'Universidad de Sonora',style:'centrar',bold: true,fontSize: 24 },
                  { text: 'División de Ciencias Exactas y Naturales',style:'centrar',fontSize: 20 },
                  { text: 'Departamento de Matemáticas\n\n\n',style:'centrar',fontSize: 16 },
                  { text: 'Otorga la presente\n\n',style:'centrar',fontSize: 12 },
                  { text: 'CONSTANCIA\n\n',style:'centrar',fontSize: 16 },
                  { text: 'a\n\n',style:'centrar',fontSize: 12 },
                  { text: ''+nombreAlumno+'\n\n\n',style:'centrar',fontSize: 14,bold:true },
                  { text: 'por su asistencia y acreditación del curso intitulado '+nombreCurso+'. El curso, con una duración de '+duracion+' horas, se impartió del '+fechaI+' al '+fechaF+'.\n\n\n\n'},
                  { text: 'Hermosillo, Sonora, México '+dd+' de '+mm+' del '+yyyy+'\n\n\n\n\n\n', style: 'centrar' },
                  {
                        alignment: 'center',
                        columns: [
                              {
                                    decoration: 'overline',
                                    text: '   Dr. Martín Gildardo García Alvarado   '
                              },
                              {
                                    decoration: 'overline',
                                    text: '   Dra. Rosa María Montesinos Cisneros   '
                              }
                        ]
                  },
                  {
                        alignment: 'center',
                        columns: [
                              {
                                    text: 'Jefe del Departamento de Matemáticas'
                              },
                              {
                                    text: 'Directora de la División de Ciencias Exactas y Naturales'
                              }
                        ]
                  }
            ],
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
      
      pdfMake.createPdf(docDefinition).download('Constancia.pdf');
}