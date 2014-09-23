var assert = require("assert");

suite('Users', function() {
  test('starts empty', function( done, server, client ){
    server.eval( function(){
      emit("userCount",Meteor.users.find().count()); 
    });
    server.once( "userCount",function(val){
      assert.equal( 0, val );
      done();
    });
  });
  test('afterCreateUser', function( done, server, client ){
    server.eval( function(){
      Meteor.users.find().observe({
        added: tmp
      });
      function tmp(){
        emit("boatCount", Boats.find().count());
      }
    });
    server.once( "boatCount",function(val){
      assert.equal( 1, val );
      done();
    });
    client.eval(function() {
      Accounts.createUser({
        email: "test@test.com",
        password: "tehsau5321"
      });
    });
  });
});
