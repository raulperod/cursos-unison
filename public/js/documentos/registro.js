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