BoatSchema = new SimpleSchema({
  name: {
    type: String,
    label: 'Boat Name'
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
    type: SimpleSchema.RegEx.Id,
    autoValue: function(){ return this.userId; }
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

/*
 * Permissions
 */
Boats.canEdit = function( doc, userId ){
  return (doc.ownerId === Meteor.userId());
}

Boats.canRemove = function( doc, userId ){
  return Meteor.userId() === doc.ownerId;
}

Boats.allow({
  'insert': function(userId, doc) {           
    return (doc.ownerId === Meteor.userId());
  },
  'update': function(userId, doc, fields, modifier) {
    return Boats.canEdit(doc,userId);
  },
  'remove': function(userId, doc) {
    return Boats.canRemove( doc, userId );
  }           
});


/*
 * Helpers
 */

Boats.owned = function( userId ){
  return Boats.find({'ownerId':userId});
}

Boats.bookingsSharedWith = function( userId ){
  return Boats.find({'allowedBookingUsers': userId});
}

Boats.related = function(userId ){
  return Boats.find({$or: [{'ownerId': userId},{'allowedBookingUsers': userId}] });
}

Boats.relatedIds = function(userId ){
  return Boats.related(userId).map(function(b){return b._id}); 
}

Boats.editing = function(){ return Boats.findOne( Session.get("editBoat") ); }
Boats.setEditing = function(id){ Session.set("editBoat", id); }
Boats.selected = function(){ return Boats.findOne( Session.get("selectedBoat") ); }
Boats.setSelected = function(id){ Session.set("selectedBoat", id); }

Boats.ambiguous = function( userId ){ return Boats.related(userId).count() > 1 && !Session.get("selectedBoat"); }
