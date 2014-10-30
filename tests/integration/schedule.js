assert = require('assert');

suite('PublicSchedule - Publish Function',function(){
  test(" - Number of schedule records sent down the wire is correct", function(done, server, c1,c2) {
    c1.eval( function(){
      Accounts.createUser({email: Random.id() + "@queenanne.com",password: "password1" }, function(){
        var schedule = new Mongo.Collection("Schedule");
        Boats.insert({ name: Random.id(), publicPublish: true });
        Boats.find().observeChanges({
          changed: function(){
            Meteor.subscribe("PublicSchedule", Meteor.userId(), moment().toString(), moment().add(2,'days').toString(), function(){
              emit('recordCount', schedule.find().count());
            });
          }
        });
      });
    }).once('recordCount', function(docs){
      assert.equal(docs, 3);  // 16 since we  add 15 to the start to to calculate end date
      done();
    });
  });
  test(" - Two boats with 2 days requested should yield 4 records", function(done, server, c1,c2) {
    c1.eval( function(){
      Accounts.createUser({email: Random.id() + "@queenanne.com",password: "password1" }, function(){
        var schedule = new Mongo.Collection("Schedule");
        var id1 = Boats.insert({ name: Random.id(), publicPublish: true });
        var id2 = Boats.insert({ name: Random.id(), publicPublish: true });
        var oneUpdated = false;
        Boats.find().observeChanges({
          changed: function(){
            Meteor.subscribe("PublicSchedule", Meteor.userId(), moment().toString(), moment().add(1,'days').toString(), function(){
              emit('scheduleChanged', true);
            });
          }
        });
      });
    }).once('recordCount', function(docs){
      assert.equal(docs, true);  // 16 since we  add 15 to the start to to calculate end date
      done();
    });
  });
  test(" - An inserted booking date should send schedule changes", function(done, server, c1,c2) {
    c1.eval( function(){
      var schedule = new Mongo.Collection("Schedule");
      TripLengths.find().observeChanges({
        added: function(id,doc){
          console.log( Boats.findOne()._id );
          console.log( moment().add(1,'days').toDate() );
          console.log( id );
          console.log( "Adding Booking" );
          Bookings.insert({ 
            boatId: Boats.findOne()._id, 
            startDate: moment().add(1, 'days').toDate(), 
            endDate: moment().add(1,'days').toDate(),
            tripLengthId: id
          });
        }
      });
      Boats.find().observeChanges({
        changed: function(id,doc){
          Meteor.subscribe("PublicSchedule", Meteor.userId(), moment().toString(), moment().add(2,'days').toString() );
          console.log( "Adding Trip Length" );
          TripLengths.insert({label: 'Full day'});
        }
      });
      schedule.find().observeChanges({
        changed: function(){
          emit('recordCount', schedule.find().count());
        }
      });
      Accounts.createUser({email: Random.id() + "@queenanne.com",password: "password1" }, function(){
        console.log( "Adding boat" );
        var boatId = Boats.insert({ name: Random.id(), publicPublish: true });
      });
    }).once('recordCount', function(docs){
      assert.equal(docs, 3);  // 16 since we  add 15 to the start to to calculate end date
      done();
    });
  });
});

suite('Schedule - Avaliable Slots',function(){
  test("All trip lengths avaliable", function(done, server) {
    server.eval( function(){
      var captainId = Accounts.createUser({email: Random.id() + "@queenanne.com",password: "password1" }); 
      var boatId = Boats.insert({
        name: Random.id(),
        ownerId: captainId,
        allowedBookingUsers: [],
        publicPublish: true
      },{
        getAutoValues: false
      });
      emit('avaliableCount', Bookings.avaliable( moment().add(2, 'days'), boatId ).length);
    });

    server.on('avaliableCount', function(docs){
      assert.equal(docs, 5);
      done();
    });
  });
  test(" - Full Day scheduled Expect avaliable to only be night", function(done, server) {
    server.eval( function(){
      var captainId = Accounts.createUser({email: Random.id() + "@queenanne.com",password: "password1" }); 
      var boatId = Boats.insert({
        name: Random.id(),
        ownerId: captainId,
        allowedBookingUsers: [],
        publicPublish: true
      },{
        getAutoValues: false
      });
      var date = moment().add(2, 'days');
      Bookings.insert({startDate: date.toDate(), endDate: date.toDate(), boatId: boatId, tripLengthId: TripLengths.findOne({'label': 'Full day'})._id });
      emit('avaliable', Bookings.avaliable( date, boatId ));
    });

    server.on('avaliable', function(docs){
      assert.equal(docs.length, 1);
      assert.equal(docs[0].label, 'Night');
      done();
    });
  });
});
