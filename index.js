var express = require('express');
var passport = require('passport');
var router = express.Router();
var User_auth = require('./controllers/userauth');
var gameroom=require('./controllers/room');

router.get('/', User_auth.index);
router.get('/profile', isLoggedIn, User_auth.home);
router.get('/logout', User_auth.logout);

// router.get('/auth/facebook', User_auth.fb);
// router.get('/auth/facebook/callback', User_auth.fbcb);

router.get('/auth/google', User_auth.g);
router.get('/auth/google/callback', User_auth.gcb);

router.get('/creategame',isLoggedIn,gameroom.createroom)
router.post('/creategame',isLoggedIn,gameroom.generateroom);
router.get('/creategame/:name',isLoggedIn,gameroom.room)
router.get('/creategame/client/:name',isLoggedIn,gameroom.roomCli)
//router.get('/viewRoom/:name',isLoggedIn,gameroom.roomdetails)
router.post('/creategame/:name',isLoggedIn,gameroom.submit)
router.get('/result/:name',gameroom.results);
router.get('/check/:name',gameroom.check);
module.exports = router;

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated())
      return next();
  res.redirect('/');
  console.log('got logged out');
}
