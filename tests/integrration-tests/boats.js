var assert = require("assert");

suite('Boats ', function() {
  test('add allowed user to book', function( done, server, client ){
    server.eval( function(){
      Accounts.createUser({ email: "user1@test.com", password: "tehsau5321"});
      Accounts.createUser({email: "test2@test.com",password: "tehsau5321"});
      Boats.find().observe({
        changed: docEdited
      });
      function docEdited(doc){
        emit("relatedUsersCount", doc.allowedBookingUsers.length);
      }
    });
    server.once( "relatedUsersCount",function(val){
      assert.equal( 1, val );
      done();
    });

    client.evalSync(function() {
      Meteor.loginWithPassword("test2@test.com", "tehsau5321", function(err){
        if( err ){ console.log( err ); }
        var boatId = Boats.findOne({'ownerId': Meteor.userId()})._id;
        Meteor.call('addAllowedUser', boatId, "user1@test.com" );
        emit("return","");
      });
    });
  });
  
  test('new user should have one boat subscription', function( done, server, client ){
    server.eval( function(){
      Accounts.createUser({ email: "user1@test.com", password: "tehsau5321"});
    });

    client.eval(function() {
      Meteor.loginWithPassword("user1@test.com", "tehsau5321", function(err){
        if( err ){ console.log( err ); }
        emit("boatCount", Boats.find().count());
      });
    }).once("boatCount",function(val){
      assert.equal( 1, val );
      done();
    });
  });
  
  test('user added to boat should be subscribed to it', function( done, server, client, client2){
    server.evalSync( function(){
      var user1 = Accounts.createUser({ email: "user1@test.com", password: "tehsau5321"});
      var boat = Boats.findOne({'ownerId': user1 }); 
      Accounts.createUser({ email: "user2@test.com", password: "tehsau5321"});
      emit("return","");
    });

    client2.evalSync(function(){
      Meteor.loginWithPassword("user1@test.com", "tehsau5321", function(err){
        if( err ){ console.log( err ); }
        Meteor.call('addAllowedUser', Boats.findOne(), "user2@test.com", function(){
          emit("return","");
        });
      });
    });

    var boatCount = client.evalSync(function() {
      Meteor.loginWithPassword("user2@test.com", "tehsau5321", function(err){
        if( err ){ console.log( err ); }
        emit("return", Boats.find().count());
      });
    }); 
    
    assert.equal( 2, boatCount );
    done();
  });
});
