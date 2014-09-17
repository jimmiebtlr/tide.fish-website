TripLengthSchema = new SimpleSchema({
  label: {
    type: String
  }
});

TripLengths = new Meteor.Collection('TripLengths');
TripLengths.attachSchema( TripLengthSchema);

TripLengths.allow({
  'insert': function(userId, doc) {           
    return false;
  },
  'update': function(userId, docs, fields, modifier) {
    return false;
  },
  'remove': function(userId, docs) {
    return false;
  }           
});

