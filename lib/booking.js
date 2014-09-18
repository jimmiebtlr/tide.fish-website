BookingSchema = new SimpleSchema({
  date: {
    type: Date,
    min: moment().toDate()
  },
  boatId: {
    type: String
  },
  notes: {
    type: String
  },
  external: {
    type: Boolean,
    defaultValue: false
  },
  tripLengthId: {
    type: String 
  }
});

Bookings = new Meteor.Collection('Bookings');
Bookings.attachSchema(BookingSchema );

Bookings.allow({
  'insert': function(userId, doc) { 
    return allowed(doc.boatId, userId);
  },
  'update': function(userId, doc, fields, modifier) {
    return allowed(doc.boatId, userId );
  },
  'remove': function(userId, doc) {
    return allowed(doc.boatId, userId );
  }           
});


function allowed(boatId, userId){
  if( userId === null || boatId === null ){ return false; }
  var boat = Boats.findOne( boatId );
  if( boat.ownerId === userId ){ return true;}
  _.each( boat.allowedBookingUsers, function( allowedUserId ){
    if( allowedUserId === userId ){ return true; }
  });
  return false;
}
