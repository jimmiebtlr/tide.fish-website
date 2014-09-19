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
    autoValue: function(){ if( this.isInsert ){ return this.userId; } },
    denyUpdate: true
  },
  allowedBookingUsers: {
    type: [SimpleSchema.RegEx.Id],
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
  return (doc.ownerId === userId);
}

Boats.canRemove = function( doc, userId ){
  return userId === doc.ownerId;
}

Boats.allow({
  'insert': function(userId, doc) {
    console.log( doc.ownerId === userId );
    return doc.ownerId === userId;
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
  if( userId ){
    return Boats.find({$or: [{'ownerId': userId},{'allowedBookingUsers': userId}] });
  }else{
    return Boats.find({$or: [{'ownerId': Meteor.userId()},{'allowedBookingUsers': Meteor.userId()}] });
  }
}

Boats.relatedIds = function(userId ){
  if( userId ){
    return Boats.related(userId).map(function(b){return b._id});
  }else{
    return Boats.related(userId).map(function(b){return b._id});
  }
}

Boats.selected = function(){ 
  if( Session.get("selectedBoat") ){
    return Boats.findOne( Session.get("selectedBoat") );
  }else if( Boats.related().count() === 1 ){
    return Boats.related().fetch()[0];
  }
}
Boats.setSelected = function(id){ Session.set("selectedBoat", id); }

Boats.ambiguous = function( userId ){ return Boats.related(userId).count() > 1 && !Session.get("selectedBoat"); }
