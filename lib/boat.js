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
    type: [String],
    defaultValue: []
  }
});

Boats = new Meteor.Collection('Boats');
Boats.attachSchema( BoatSchema );

Boats.before.insert(function( userId, doc ){
  if( Meteor.isServer ){
    doc.notes = sanitizeHtml( doc.notes );
  }
});

Boats.before.update(function( userId, doc, fieldNames, modifier, options ){
  if( Meteor.isServer ){
    modifier.$set = modifier.$set || {};
    modifier.$set.notes = sanitizeHtml( modifier.$set.notes );
  }
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

Boats.owned = function( userId ){
  return Boats.findOne({'ownerId':userId});
}

Boats.bookingsSharedWith = function( userId ){
  return Boats.find({'allowedBookingUsers': userId});
}

Boats.related = function(userId ){
  return Boats.find({$or: [{'ownerId': userId},{'allowedBookingUsers': userId}] });
}

Boats.relatedIds = function(userId ){
  var boats = Boats.related(userId);  
  var boatIds = [];
  _.each( boats.fetch(), function(boat ){
    boatIds.push( boat._id );
  });
  return boatIds;
}

Boats.ambiguous = function( userId ){
  if( Boats.related(Meteor.userId() ).count() > 1 ){
    return true;
  }
  return false;
}
