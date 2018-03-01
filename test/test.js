var sinon = require('sinon'); 
var assert = require('assert');
var chai = require('chai');
var expect = chai.expect;
var mongoose = require('mongoose');
require('sinon-mongoose');

//var Browser = require('zombie'); 

var  User = require('../models/user');
var  Room = require('../models/room');
var controller_room =require('../controllers/room');


// Create Room function

function createRoom(info, callback) {
  var room = {
    roomName: info.roomName,
    playerNum: info.playerNum
  };

  try {
    Room.create(room, callback);
  }
  catch(err) {
    callback(err);
  }
}

describe('creatingRoom',function(){
it('should save the created room only once', function() {
  var create = sinon.spy(Room, 'create');

  createRoom({ roomName: 'Room1',playerNum:'2' }, function() { });

  create.restore();
  sinon.assert.calledOnce(create);
});

it('Should create the room with correct input of user',function(){
  var create = sinon.spy(Room, 'create');
  var info = { roomName: 'Room1',playerNum: '2' };
  var expectedRoom = {
    roomName: info.roomName,
    playerNum: info.playerNum
  };

  createRoom(info, function() { });

  create.restore();
  sinon.assert.calledWith(create,expectedRoom);
});

it('should pass any error to the callback if create room fails', function() {
  var expectedError = new Error('oops');
  var create = sinon.stub(Room, 'create');
  create.throws(expectedError);
  var callback = sinon.spy();

  createRoom({ roomName: '',playerNum: '' }, callback);

  create.restore();
  sinon.assert.calledWith(callback, expectedError);
});
});

function joinRoom(info, callback) {
  var room = {
    roomName: info.roomName,
    start: info.start
  };

  try {
    Room.call(room, callback);
  }
    catch(err) {
    callback(err);
  }
}

describe('joiningRoom',function(){
  it('should join the created room and fetch only once', function() {
    var join = sinon.spy(Room, 'call');
  
    joinRoom({ roomName: 'Room1',start:'Yes' }, function() { });
  
    join.restore();
    sinon.assert.calledOnce(join);
  });
  
  it('Should join the room with correct data of user',function(){
    var join = sinon.spy(Room, 'call');
    var info = { roomName: 'Room1',start: 'Yes' };
    var expectedRoom = {
      roomName: info.roomName,
      start: info.start
    };
  
    joinRoom( info, function() { });
  
    join.restore();
    sinon.assert.calledWith(join,expectedRoom);
  });
});
