var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var room = Schema({
    roomName : {type:String,max:60,required:true},
    owner : {type:String,required:true},
    players : {type:[String],required:true},
    start : {type:String,required:true},
    
});

room.virtual('url').get(function(){return '/room/'+this.roomName})

var Room = mongoose.model('Room',room);
module.exports = Room;