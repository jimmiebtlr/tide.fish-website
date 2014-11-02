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


TripLengthConstraintSchema = new SimpleSchema({
  first: {
    type: String
  },
  second: {
    type: String
  }
});

TripLengthConstraints = new Meteor.Collection('TripLengthConstraints');
TripLengthConstraints.attachSchema( TripLengthConstraintSchema);

TripLengthConstraints.allow({
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

TripLengthConstraints.constraints = function( id ){
  var constraints = [];
  TripLengthConstraints.find({$or: [{first: id}, {second: id}]}).forEach(function(tlc){
    if( tlc.first === id ){
      constraints.push(tlc.second);
    }else{
      constraints.push(tlc.first);
    }
  });
  return constraints;
};
