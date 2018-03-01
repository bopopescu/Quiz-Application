$(document).ready(function(event) {
    console.log("game room working");
    $('#video').hide();
    var socket = io();
    //var game = localStorage.getItem('roomDetails');
    //pase the value 
    //var gamevalue = JSON.parse(game);
    //var details=gamevalue.details;
    //console.log(game);
   // Populate the user details on initial page load
   socket.emit('NewroomAdded',{});
   
  socket.emit('JoinGame',{room:'abc'})
   socket.on('startgame',function(params)
{
    $('#video').show();
    var htm = '<iframe width="420" height="345" src="https://www.youtube.com/embed/5V430M59Yn8?autoplay=1"></iframe>'
    $('#video_container').html(htm);
    console.log(params);
    
})

// $('#pri').on('click',submit);
});

function submit(event){
    socket.emit('Submit',{})
}