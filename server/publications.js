Meteor.publish('TripLengths', function(){
  return TripLengths.find({});
});

Meteor.publish('RelatedBoats', function(){
  check( this.userId, String );
  var userIds = Boats.owned(this.userId).allowedBookingUsers;
  if( userIds !== undefined && userIds.length > 0 ){
    return [
      Boats.related( this.userId ),
      Meteor.users.find({'_id': {$in: Boats.owned(this.userId).allowedBookingUsers}})
    ];
  }else{
    return Boats.related( this.userId );
  }
});

Meteor.publish('Bookings', function(){
  check( this.userId, String );
  return Bookings.find({'boatId': {$in: Boats.relatedIds(this.userId)}});
});
