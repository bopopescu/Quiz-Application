/*global $*/
$(document).ready(function() {
    var error = localStorage.getItem('errormsg');
    //pase the value 
    var finalvalue = JSON.parse(error);
    console.log(finalvalue);
    $('h1').append(finalvalue.err);
 });
