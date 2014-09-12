Meteor.publish('TripLengths', function(){
  return TripLengths.find({});
});

Meteor.publish('RelatedBoats', function(){
  if( this.userId ){
    return Boats.related( this.userId );
  }else{
    return;
  }
});

Meteor.publish('Bookings', function(){
  if( this.userId ){ 
    return Bookings.find({'boatId': {$in: Boats.relatedIds(this.userId)}});
  }else{
    return;
  }
});
