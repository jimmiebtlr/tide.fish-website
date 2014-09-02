BookingSchema = new SimpleSchema({
  date: {
    type: Date,
    min: moment().toDate()
  },
  boatId: {
    type: String
  },
  ownerId: {
    type: String
  },
  notes: {
    type: String,
    optional: true
  },
  external: {
    type: Boolean,
    defaultValue: false
  },
  tripLengthId: {
    type: String 
  }
});

Bookings = new Meteor.Collection('Bookings', {
  schema: BookingSchema
});

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
