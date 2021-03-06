var chai = require('chai');
var expect = chai.expect;
var request = require('supertest');
var app = require('../../server/server.js').app;
var server = require('../../server/server.js');
var neo4j = require('neo4j');
var fixtures = require('../test.fixtures.js');
var User = require('../../server/api/users/userModel.js');
var _ = require('lodash');

// var neo4jurl = WADDLE_GRAPHENEDB_URL || 'http://localhost:7474'
// var db = new neo4j.GraphDatabase(neo4jurl);


// describe('Get request', function() {
//   it('should return something', function (done) {
//     request(app)
//       .get('/')
//       .expect(200, done);
//   })
// });

// describe('Answer Challenges', function() {

//   it('Sends a 200 status to make Facebook happy', function (done) {
//     request(app)
//     .post('/api/checkins/realtimefacebook')
//     .send(fixtures.IGdata)
//     .expect(200)
//     .end(function(err, res){
//       if (err) throw err;
//       done();
//     })
//   });

//   it('Sends a 200 status to make Instagram happy', function (done) {
//     request(app)
//     .post('/api/checkins/realtimeinstagram')
//     .send(fixtures.IGdata)
//     .expect(200)
//     .end(function(err, res){
//       if (err) throw err;
//       done();
//     })
//   });
// });

describe('Waddle user routes GET requests', function () {
    var user;
    before(function(done){
      User.createUniqueUser(fixtures.testUser).then(function (userNode){
        // console.log(userNode);
        user = userNode.node._data.data;
        userNode.addFriends([fixtures.testUser2, fixtures.testUser3]).then(function (friends) {
          userNode.addCheckins(fixtures.testUserFootprints)
          .then(function (categoryNames) {

            _.each(friends, function(friend, index) {
              User.find({facebookID: friend.body.data[0][0].data.facebookID})
                .then(function (friendNode) {
                  friendNode.addCheckins(fixtures.testFriendFootprints[index])
                    .then(function (results) {
                      // console.log(results);
                    });
                });
            });
            done();
          });
        });
      });
    });
    it('should return the information of the specified user', function (done) {
      // console.log('hi again', user);
      request(app)
      .get('/api/users/userinfo/' + user.facebookID)
      .expect(200)
      .end(function(err, res) {
        if (err) throw err;
        console.log(res.body);
        expect(res.body.name).to.equal("Testy McTest");
        expect(res.body.facebookID).to.equal("000000000");
        done();
      })
    });
    // it('should return the first 5 footprints aggregate feed of the specified user', function(done) {
    //   request(app)
    //   .get('/aggregatefeed/000000000/0/5')
    //   .expect(200)
    //   .end(function(err, res) {
    //     if (err) throw err;
    //     console.log(res.body);
    //     expect(res.body)
    //   })

    // })
})