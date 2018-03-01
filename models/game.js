var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var game = Schema({
    gameName : {type:String,max:60,required:true},
    player : {type:String,required:true},
    score : {type:String,required:true},
    date: {type : Date}
    
});


var Game = mongoose.model('Game',game);
module.exports = Game;