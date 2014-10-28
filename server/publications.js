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
  check( id, String );
  check( startDate, String );
  check( endDate, String );

  var start = moment(startDate);
  var end = moment(endDate );

  check( start.diff(end, 'months'), Match.Where( function( diff ){
    return diff <= 1;
  }));

  var publicSchedule = [];

  var boatIds = Boats.relatedPublishedIds( id );

  var mapTripLength = function(a){
    return TripLengths.findOne( a ).label;
  };

  _.each( boatIds, function( boatId ){
    var boatName = Boats.findOne( boatId ).name;
    for( var date = start.clone(); !date.isAfter(end); date.add(1,'days') ){
      console.log( date.format("MM/DD"));
      var avaliable = _.map(Bookings.avaliable(date,boatId), mapTripLength);
      var schedule = {
        boatName: boatName,
        date: date.clone(),
        avaliable: avaliable
      };
      publicSchedule.push( schedule );
    }
  });

  return publicSchedule;
});
