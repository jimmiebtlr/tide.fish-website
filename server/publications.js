Meteor.publish('TripLengths', function(){
  return TripLengths.find({});
});

Meteor.publish('RelatedBoats', function(){
  if( !this.userId ){ return null; }
  var userIds = [];
  _.each(Boats.owned(this.userId).fetch(), function(b){
    userIds = userIds.concat( b.allowedBookingUsers );
  });
  if( userIds.length > 0 ){
    return [
      Meteor.users.find({'_id': {$in: userIds}}),
      Boats.related( this.userId )
    ];
  }else{
    return Boats.related( this.userId );
  }
});

Meteor.publish('Bookings', function(){
  if( !this.userId ){ return null; }
  return Bookings.find({'boatId': {$in: Boats.relatedIds(this.userId)}});
});

Meteor.publish('User', function(){
  return Meteor.users.find({'_id': this.userId });
});

Meteor.publish('PublicSchedule',function(id, startDate, endDate){
  var self = this;
  check( id, String );
  check( startDate, String );
  check( endDate, String );
  
  var start = moment(startDate);
  var end = moment(endDate );

  check( start.diff(end, 'months'), Match.Where( function( diff ){
    console.log( diff );
    return diff <= 1;
  }));
  
  var initializing = true;
  var collectionName = "Schedule";
  
  var boatIds = Boats.relatedPublishedIds( id );
  var mapTripLength = function(a){
    return TripLengths.findOne( a ).label;
  };
  var calcId = function( date, boatId ){
    return boatId + date.format("MMDDYYYY");
  }

  var handle = Bookings.find({'boatId': {$in: boatIds}}).observeChanges({
    added: function ( id, doc) {
      if( !initializing ){
        self.changed( collectionName, calcId(date,boatId), rec );
      }
    },
    changed: function( id, doc){
      if( !initializing ){
        console.log( Bookings.findOne(id) );
        console.log( doc );
        // send change for both old date and new date if not the same
        var avaliable = _.map(Bookings.avaliable(date,boatId), mapTripLength);
        self.changed( collectionName, calcId(date,boatId), rec );
      }
    },
    removed: function( id ){
      if( !initializing ){
        self.changed( collectionName, calcId(date,boatId), rec );
      }
    }
  });
  
  _.each( boatIds, function( boatId ){
    var boatName = Boats.findOne( boatId ).name;
    for( var date = start.clone(); !date.isAfter(end); date.add(1,'days') ){
      var avaliable = _.map(Bookings.avaliable(date,boatId), mapTripLength);
      var schedule = {
        boatId: boatId,
        boatName: boatName,
        date: date.toDate(),
        avaliable: avaliable
      };
      self.added(collectionName, calcId(date,boatId), schedule );
    }
  });

  initializing = false;
  self.ready();
  
  self.onStop(function () {
    handle.stop();
  });
});
