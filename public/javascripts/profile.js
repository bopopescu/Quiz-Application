$(document).ready(function(event) {
    console.log("profile working");
    var socket = io();
    socket.on('AddRow',function(params){
        console.log(params.roomName)
        // $('h4').append(params.roomName);
        location.reload();
})
});