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

Meteor.publish('PublicSchedule',function(id){
  check( id, String );
  
  var boatFilter = {name: 1};
  var bookingFilter = {startDate: 1, endDate: 1, boatId: 1, tripLengthId: 1};

  var boatIds = Boats.relatedIds( id );
  
  return [
    Boats.find({'_id': id, 'publicPublish': true},{fields: boatFilter}),
    Bookings.find({'boatId': {$in: boatIds}},{fields: bookingFilter}),
    TripLengths.find()
  ];
});
