BookingSchema = new SimpleSchema({
  startDate: {
    type: Date,
    min: moment().toDate(),
    index: true
  },
  endDate: {
    type: Date,
    min: moment().toDate(),
    index: true
  },
  boatId: {
    type: SimpleSchema.RegEx.Id,
    index: true
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
    type: SimpleSchema.RegEx.Id
  }
});

Bookings = new Meteor.Collection('Bookings');
Bookings.attachSchema(BookingSchema );

Bookings.allow({
  'insert': function(userId, doc) { 
    return Bookings.allowed(doc.boatId, userId);
  },
  'update': function(userId, doc, fields, modifier) {
    return Bookings.allowed(doc.boatId, userId );
  },
  'remove': function(userId, doc) {
    return Bookings.allowed(doc.boatId, userId );
  }           
});

Bookings.byDateAndBoat = function( date, boatId ){
  var dateStart = date.clone().startOf("day").utc();
  var dateEnd = date.clone().endOf("day").utc();
  return Bookings.find({'startDate': {$lte: dateEnd.toDate()}, 'endDate': {$gte: dateStart.toDate()}, 'boatId': boatId});
};

Bookings.avaliable = function( date, boatId ){
  var avaliable = TripLengths.find().fetch();
  Bookings.byDateAndBoat( date, boatId ).forEach(function(booking){
    var constraints = TripLengthConstraints.constraints( booking.TripLengthId );
    avaliable = _.filter(avaliable, function(element){
      _.each( constraints, function( c ){
        if( c === element ){
          return false;
        }
      });
      return true;
    });
  });
  return avaliable;
};


Bookings.allowed = function(boatId, userId){
  if( userId === null || boatId === null ){ return false; }
  var boat = Boats.findOne( boatId );
  if( boat.ownerId === userId ){ return true;}
  var bookingUser = false;
  _.each( boat.allowedBookingUsers, function( allowedUserId ){
    if( allowedUserId === userId ){ bookingUser = true; }
  });
  return bookingUser;
};
