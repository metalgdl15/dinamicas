var consultOrden = true;
var listQuery = new Set();
var finalizado = false;

$(document).ready(function(){
    $('.box').prop('checked', false);
});


//Consulta prolog    
async function runProlog (query){

    return new Promise((resolve, reject) => {
        var session = pl.create();

        session.consult("prolog.pl",{
            success: function(){
                console.log('Leyo el archivo');
                
                session.query(`${query} nl.`,{
                    success: function(){
                        console.log('Entendio el query');
                        session.answers(show(resolve));        
                    },
                    error: function(err){console.log("No pudo leer bien el query");}
                });
            },
            error: function(err){console.log("No se encontro el archivo");}
        });

    });
    
}


//Obtiene las respuestas con un callback y las imprime
function show(resolve){
    console.log("Buscando respuestas");

    return function(answer){
        if(pl.type.is_substitution(answer)){
            var data = answer.lookup("X");
            if(consultOrden && data != null){
                $("#ordenTbody").append(`<tr class="ordenData"> <td> ${data} </td> </tr>`);
            }else if(!consultOrden && data != null)
                $("#familiaTbody").append(`<tr class="familiaData"> <td> ${data} </td> </tr>`);
        }else{
            resolve();
        }
    };
}



/////////////////////////////////////////////////////////////////////////////////////////////////
                                        /* EVENTOS*/
/////////////////////////////////////////////////////////////////////////////////////////////////

//Evento para obtener el valor del checkbox seleccionados
$(".box").click(function(event){
    this.disabled = true;
      
    var value = this.value;
    var query = "";
    
    consultOrden = true;
    finalizado = false;

    $("#ordenTbody").empty();
    $('#familiaTbody').empty();

    this.checked ? listQuery.add(`caracteristica(X,${value}),`) : listQuery.delete(`caracteristica(X,${value}),`);

    listQuery.forEach(data => {
        query += data; 
    });  

    runProlog(query).then((response) => {
        console.log(response);
            this.disabled = false;
    });
    
});

//Creamos un evento para los rows de la tabla ordenes
$('#tablaOrdenes').on('click', '.ordenData > td', function(){
    var orden = this.innerHTML;
    consultOrden = false;

    $('#familiaTbody').empty();
    query = `pertenece(X, ${orden}),`;

    runProlog(query);
});