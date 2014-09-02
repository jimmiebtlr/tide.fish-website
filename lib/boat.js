AllowedUserSchema = new SimpleSchema({
  name: {
    type: String,
    optional: true
  },
  email: {
    type: String
  },
  userId: {
    type: String
  }
});

BoatSchema = new SimpleSchema({
  name: {
    type: String,
    label: 'Boat Name',
    optional: true
  },
  length: {
    type: String,
    label: 'Length',
    optional: true
  },
  capacity: {
    type: Number,
    label: 'Capacity',
    optional: true,
    min: 0
  },
  marinaAddress: {
    type: AddressSchema,
    optional: true
  },
  ownerId: {
    type: String,
    autoValue: function(){ Meteor.userId }
  },
  allowedBookingUsers: {
    type: [AllowedUserSchema],
    optional: true
  }
});

Boats = new Meteor.Collection('Boats', {
  schema: BoatSchema
});

Boats.allow({
  'insert': function(userId, doc) {           
    return (doc.ownerId === Meteor.userId());
  },
  'update': function(userId, docs, fields, modifier) {
    return (docs.ownerId === Meteor.userId());
  },
  'remove': function(userId, docs) {
    return Meteor.userId() === docs.ownerId;
  }           
});

Boats.related = function(userId ){
  return Boats.find({$or: [{'ownerId': userId},{'allowedBookingUsers.userId': userId}] })
}

Boats.relatedIds = function(userId ){
  var boats = Boats.related(userId);  
  var boatIds = [];
  _.each( boats.fetch(), function(boat ){
    boatIds.push( boat._id );
  });
  return boatIds;
}
