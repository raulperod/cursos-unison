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
    pdfMake.createPdf(docDefinition).open();
    //pdfMake.createPdf(docDefinition).download('Constancia.pdf');
}