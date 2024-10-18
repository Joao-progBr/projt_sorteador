document.addEventListener('DOMContentLoaded', function(evento){
    evento.preventDefault()

    document.getElementById('form-sorteador').addEventListener('submit',function(){
        let numeroMax = document.getElementById('numero-maximo').value
        numeroMax = parseInt(numeroMax)

        let numeroAleatorio = Math.random() * numeroMax;
        alert(numeroAleatorio)
    })
})