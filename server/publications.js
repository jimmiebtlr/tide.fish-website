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

Meteor.publish('PublicSchedule',function(id, week, year){
  var self = this;
  check( id, String );

  check( week, Number );
  check( year, Number );
  
  self.week = moment().year( year ).isoWeek( week );
  self.start = self.week.clone().startOf('isoWeek').isBefore(moment(),'day') ? moment() : self.week.clone().startOf('isoWeek');
  self.end = self.week.clone().endOf('isoWeek');

  check( self.end.isBefore(moment()), Match.Where( function( past ){
    return !past;
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


  var sendChanges = function ( doc ) {
    if( !initializing ){
      for( date = self.start.clone(); !date.isAfter( self.end, 'day' ); date.add(1,'days')){
        self.changed( 
          collectionName, 
          calcId(date.clone(),doc.boatId), {
          avaliable: _.map(Bookings.avaliable(date.clone(),doc.boatId), mapTripLength) 
        });
      };
    }
  };

  var handle = Bookings.find({'boatId': {$in: boatIds}}, {'startDate': {$gte: self.start}}, {'endDate': {$lte: self.end}}).observe({
    added: sendChanges,
    changed: function( old, current ){
      sendChanges( current );
      if( old.startDate !== current.startDate || old.endDate !== current.endDate ){
        sendChanges( old );
      }
    },
    removed: sendChanges
  });
  
  _.each( boatIds, function( boatId ){
    var boatName = Boats.findOne( boatId ).name;
    for( var date = self.start.clone(); !date.isAfter(self.end,'day'); date.add(1,'days') ){
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
