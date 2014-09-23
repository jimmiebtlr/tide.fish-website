var assert = require("assert");

suite('Bookings', function() {
  test('are not published if the user isnt allowed boat information', function( done, server, client ){
    server.evalSync( function(){
      var user1Id = Accounts.createUser({ email: "user1@test.com", password: "tehsau5321"});
      Accounts.createUser({email: "test2@test.com",password: "tehsau5321"});
      Bookings.insert({
        date: new Date(), 
        boatId: Boats.findOne({'ownerId': user1Id})._id,
        ownerId: user1Id,
        tripLengthId: TripLengths.findOne()._id
      });
      emit("return","");
    });

    var bookingCount = client.evalSync(function() {
      Meteor.loginWithPassword("test2@test.com", "tehsau5321", function(err){
        if( err ){ console.log( err ); }
        emit("return", Bookings.find({}).count());
      });
    });
    
    assert.equal(0,bookingCount);
    done();
  });
});
