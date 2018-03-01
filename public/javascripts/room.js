$(document).ready(function(event) {
    console.log("room working");
    // Add User on sign up button click
   $('#btnAddRoom').on('click', addRoom);
});

 // Add User function
function addRoom(event) {
    event.preventDefault();
    console.log("in ajax");
    var errorCount = 0;
    
    if($('#createRoom form input#players').val()<2)
         errorCount=-2;
    $('#createRoom form input').each(function(index, val) {
           if($(this).val() === '') { errorCount++; }
       });
      
    

    // Check and make sure errorCount's still at zero
    if(errorCount === 0) {
    // compile all user info into one object
        var newRoom = {
            'name': $('#createRoom form input#name').val(),
            'players': $('#createRoom form input#players').val(),
            'owner': $('#createRoom form input#owner').val()
        }
        // console.log(newRoom);

        // Use AJAX to post the object to our adduser service
        $.ajax({
            type: 'POST',
            data: newRoom,
            url: '/creategame',
            dataType: 'JSON'
        }).done(function( response ) {
            
            // Check for successful (blank) response
            if (response.msg === '') {
                localStorage.setItem('roomDetails', JSON.stringify({"details":response.room}));
                window.location.href='/creategame/'+response.room.room;
                
            }
            else {

                // If something goes wrong, alert the error message that our service returned
                // console.log('Please go to error page');
                // console.log("message"+response.msg);
                localStorage.setItem('errormsg', JSON.stringify({"err":response.msg}));
                window.location.href='error.pug';
                

            }
        });}
        else {
            console.log("error"+errorCount);
            if(errorCount>0)
            {
            // If errorCount is more than 0, error out
            alert('Please fill in all fields');
            
            }
            else if(errorCount==-2)
            {
            alert('players should be more than 1');
            
            }
            
            errorCount=0;
            return;
            
        }
};