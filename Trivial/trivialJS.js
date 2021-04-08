$(document).ready(inicializar());

var score;
var preguntaIndex = 0;

var respondido = false;
var finDelJuego = true;
var reiniciar = false;

var listaPreguntas = [];
var listaRespuestas = [];

var segundos;
var minutos;
var spans;

function setListaPreguntas(data){
    this.listaPreguntas = data;
}

function setListaRespuestas(data){
    this.listaRespuestas = data;
}

function inicializar(){
    limpiar();
}

//Vaciamos los campos
function limpiar(){
    score = 0;
    respondido = false;
    finDelJuego = true;
    segundos = 0;
    minutos = 0;

    $(".score").val(score);
    $(".score").html("Score: "+ score);
    $("#txtPregunta").html("");
    

    $(".boton").val("")
    $(".boton").css("background-color","#333");
    
    spans = $(".cronometro").find("span");
    spans[0].innerHTML = "00:";
    spans[1].innerHTML = "00:";
    spans[2].innerHTML = "00";
    
}


function Correr(){

    segundos = 30;
    minutos = 0;
    finDelJuego = false;
    reiniciar = false;
    
    leerJson();
    cargarPregunta();
    inicializar_tiempo();
}

//Inicializamos el cronometro y evaluamos
function inicializar_tiempo(){
    try{
        
        if((segundos == 0 && minutos == 0 || finDelJuego)){

            if(!reiniciar){
                alert("FIN DEL JUEGO! \n   PUNTAJE:" + score);
             
                limpiar();
            }
            
                
             
        }else{

            if(segundos == 0){
                segundos = 59;
                minutos--;
            }
            
            
            segundos--;
            
            if(minutos < 10){
                spans[1].innerHTML = "0" + minutos + " : ";
            }else{
                spans[1].innerHTML = minutos + " : ";
            }

            if(segundos<10){
                spans[2].innerHTML = "0" + segundos;
            }else{
                spans[2].innerHTML = segundos;
            }

            setTimeout(inicializar_tiempo, 1000);
        }
            }catch(error){
        console.log(error);
    }
}

//Obtenemos la pregunta u la imprimimos en pantalla
function cargarPregunta(){
    preguntaIndex = Math.floor(Math.random() * listaPreguntas.length);
    $("#txtPregunta").html(listaPreguntas[preguntaIndex]["pregunta"]);
    imprimirRespuestas(preguntaIndex);
}



//Imprimimos las respuestas en la pantalla
function imprimirRespuestas(){
    if(!finDelJuego){
        
        var respuesta = revolverAleatorias(listaRespuestas[preguntaIndex]);

        $("#respuesta1").val(respuesta[0]);
        ajustarTexto( $("#respuesta1"));

        $("#respuesta2").val(respuesta[1]);
        ajustarTexto( $("#respuesta2"));

        $("#respuesta3").val(respuesta[2]);
        ajustarTexto( $("#respuesta3"));

        $("#respuesta4").val(respuesta[3]);
        ajustarTexto( $("#respuesta4"));
    }
}


//Metodo para revolver las preguntas
function revolverAleatorias (lista){
    lista = lista.sort(function() {return Math.random() - 0.5});
    return lista;
}

//Evaluamos la respuesta obtenida
function Evaluar(e){
    
    if(!respondido && !finDelJuego){
        if(e.val() == listaPreguntas[preguntaIndex]["respuesta"]){
            score += 5;
            $(".score").val(score);
            $(".score").html("Score: " + score);
            
            e.attr('style','background-color: #00ff00 !important');
        
        }else{
            e.attr('style', 'background-color: #ff0000 !important');
        }

        respondido = true;

        setTimeout(function()
        {  
            if(!finDelJuego){
                respondido = false;
                e.css('background', '#333');
                cargarPregunta();
                //imprimirRespuestas();
            }
        }, 1000);

    }
    
}

//Leer preguntas y respuestas del Json
function leerJson(){
    //AJAX sincrono
    $.ajax({
        url: "preguntas.json",
        dataType: 'json',
        async: false,
        success: function (json) {
            setListaPreguntas(json[$("#asignatura").val()]);
        }
    });

    $.ajax({
        url: "respuestas.json",
        dataType: 'json',
        async: false,
        success: function (json) {
            setListaRespuestas(json[$("#asignatura").val()]);
        }
    });
    /* JQuery asincrono
    $.getJSON("preguntas.json", function (json) {
        setListaPreguntas(json[$("#asignatura").val()]);
    });
    */
}

//los texto lasrgos los ajusta
function ajustarTexto(e){
    var textLength = e.val().length;
  
    if(textLength <= 16){
        e.css('font-size', '20px');
    }else if(textLength > 16 && textLength <= 19) {
        e.css('font-size', '85%');
    }else if(textLength > 19 && textLength <= 22) {
        e.css('font-size', '70%');
    }else if(textLength > 22) {
        e.css('font-size', '65%');
    }
}


///////////////////////////////////////////////////////////////////////////////////////////////////////////
                            /* Eventos*/
///////////////////////////////////////////////////////////////////////////////////////////////////////////

//Evento cuando se le de clic al boton de iniciar
$("#btnCorrer").on("click", function(ev){
    console.log(ev.detail);
    if(ev.detail < 2){
        finDelJuego = true;
        reiniciar = true;
        setTimeout(Correr, 1000);
    }
});

//Cuando se les da click a los botonoes
$(".boton").on("click", function(){
    Evaluar( $('#'+this.id) );
});

