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
