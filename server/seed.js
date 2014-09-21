Meteor.startup(function(){
  if( TripLengths.find({}).count() == 0 ){
    TripLengths.insert({label: "1/2 day AM"});
    TripLengths.insert({label: "1/2 day PM"});
    TripLengths.insert({label: "3/4 day"});
    TripLengths.insert({label: "Full day"});
    TripLengths.insert({label: "Night"});
  }
  if( process.env.NODE_ENV === "development" ){
    if( Meteor.users.find().count() === 0 ){
      console.log( "Creating Seed Users" );
      var captain = Accounts.createUser({email: "captain@queenanne.com", password: "password1"});
      var marina = Accounts.createUser({email: "joe@themarina.com", password: "password1"});
      var marina2 = Accounts.createUser({email: "susey@themarina.com", password: "password1"});
      var firstMate = Accounts.createUser({email: "firstmate@queenanne.com", password: "password1"});

      console.log( "Creating Seed Boat" );
      console.log( {name: "Queen Anne", ownerId: captain, allowedBookingUsers: [marina, marina2, firstMate]},{autoConvert: false, filter: false, } );
      //var boatId = Boats.insert({name: "Queen Anne", ownerId: captain, allowedBookingUsers: [marina, marina2, firstMate]},{autoConvert: false, filter: false, });
    }
  }
});  
