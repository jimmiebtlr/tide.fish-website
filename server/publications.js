Meteor.publish('TripLengths', function(){
  return TripLengths.find({});
});

Meteor.publish('RelatedBoats', function(){
  check( this.userId, String );
  return [
    Boats.related( this.userId ),
    Meteor.users.find({'_id': {$in: Boats.owned(this.userId).allowedBookingUsers}})
  ];
});

Meteor.publish('Bookings', function(){
  check( this.userId, String );
  return Bookings.find({'boatId': {$in: Boats.relatedIds(this.userId)}});
});
