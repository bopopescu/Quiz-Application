var Room = require('../models/room');
var Game= require('../models/game');
exports.createroom = function(req, res) {
    res.render('room',{ user: req.user });
  };

  exports.generateroom= function(req,res){
    //console.log("in here");
    req.checkBody('name','Name cannnot be empty').notEmpty();
    req.sanitize('name').escape();
    // req.checkBody('players','Name cannnot be empty').notEmpty();
    // req.sanitize('players').escape();
    // req.checkBody('players','Players should be more than 1').isGreater(1);
    
// run the validators
var errors = req.validationErrors();
if (errors) {
  res.send({ msg: 'Input Error. Try creating room again.'});  
  //res.render('error', { message:'Input Error. Try creating room again'});
    console.log(errors)
return;}
    else{

    var room = new Room(
        { roomName: req.body.name,
          owner: req.body.owner,
          players: [req.body.owner],
          start: "No",
        });
     //console.log(room);
    // console.log("in create part");
    Room.findOne({ 'roomName': req.body.name })
    .exec( function(err, found_room) {
        // console.log('found room: ' + found_room);
         if (err) { return err; }
         
         if (found_room) { 
             //User exists, error page
             res.send({ msg: 'Room already exists.'});
             
         }
         else {              
                Room.create(room,function (err,roomdetails) {
                      if (err) {console.log(err); return err; }
                         var room= {
                           room: roomdetails.roomName,
                           initial_create: 1
                         }
                         //console.log(req.session);
                         // console.log("room"+room)
                        //  console.log("Post is successful.");
                         //res.redirect('/creategame/'+room.roomName);
                         res.send({msg:'',room: room});
                         
                        });
                      }

                    });
                  }
                }

exports.room= function(req,res){
  id=req.originalUrl.split("/");
  Room.findOne({roomName:id[2]})
  .exec( function(err, found_room) 
  {
    if (err) { return err; }
    console.log("here");
    res.render('game',{room:found_room});
  })
}

exports.roomCli = function(req,res){
  id=req.originalUrl.split("/");

  //console.log("in here"+ req.user.google.name+"\t"+id[3]);
  // find by some conditions and update
Room.findOneAndUpdate(
  {roomName:id[3]},
  {$push: {players: req.user.google.name}},
  {safe: true, upsert: true},
  function(err, model) {
      console.log(err);
  }
);
Room.findOne({roomName:id[3]}, function(err, edit) {  
  // Handle any possible database errors
  if (err) {
      res.status(500).send(err);
  } else {
       edit.start = "yes";
     // Save the updated document back to the database
      edit.save(function(err, edit) {
          if (err) {
              res.status(500).send(err)
          }
          
      });
  }
});

res.redirect('/creategame/'+id[3]);
}

exports.submit = function(req,res){
  id=req.originalUrl.split("/");
  var date= new Date();
  var game = new Game(
    { gameName: id[2],
      player: req.user.google.name,
      score: req.body.song,
      date: date.getDate()
    });

    console.log(game)
    Game.create(game,function (err) {
      if (err) {console.log(err); return err; }
         
})

res.redirect('/check/'+id[2]);

}
exports.check = function(req,res){
  id=req.originalUrl.split("/");
  res.render('check',{name:id[2]})
  
}

exports.results = function(req,res){
  id=req.originalUrl.split("/");
  Game.find({gameName: id[2],score:'correct'}).exec( function(err, found_winner) 
  {
    if (err) { return err; }
    console.log(found_winner)
  res.render('data',{winner: found_winner})
  })
}