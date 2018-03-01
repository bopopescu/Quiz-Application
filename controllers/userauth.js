var passport = require('passport');
var Room =require('../models/room');

exports.index= function(req, res, next) {
  res.render('index');
};

exports.home= function(req, res) {
  Room.find({'start':'No'}).exec(function (err, list_rooms) {
    if (err) { return (err); }
    //console.log(list_rooms);
    res.render('profile',{ user: req.user, rooms: list_rooms });
  });
}

exports.logout=function(req, res) {
  req.logout();
  res.redirect('/');
};

exports.g= passport.authenticate('google', { scope: ['profile', 'email'] })

exports.gcb=passport.authenticate('google', {
    successRedirect: '/profile',
    failureRedirect: '/',
  });

// exports.fb= passport.authenticate('facebook', { scope: ['email'] });

// exports.fbcb= passport.authenticate('facebook', {
//   successRedirect: '/profile',
//   failureRedirect: '/',
// });