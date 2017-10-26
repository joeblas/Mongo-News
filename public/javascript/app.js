$(document).ready(function(){

   
    $("#addComment").on('click', function(){
       
        var thisId = $('.card-body').attr('data-id');
       
        $.ajax({
            method: "GET",
            url: `/articles/${thisId}`
        })

        .done(function(data){
            console.log(data)

            $('').children('.card-body').append(`<textarea class='form-control' rows='3'></textarea>`)
        })

        // cardBody.append(`<textarea id='notebody' name='body'></textarea>`)


    })

})