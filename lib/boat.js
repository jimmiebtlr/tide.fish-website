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
    denyUpdate: true,
    index: true
  },
  allowedBookingUsers: {
    type: [SimpleSchema.RegEx.Id],
    defaultValue: []
  },
  publicPublish: {
    type: Boolean,
    defaultValue: false
  },
  allowedTimeSlots: {
    type: [String],
    autoValue: function(){
      if (this.isInsert) {
        var defaults = [];
        TripLengths.find({label: {$nin: ["Night"]}}).forEach( function(tl){
          defaults.push( tl._id );
        });
        return defaults;
      } else if (this.isUpsert) {
        var defaults = [];
        TripLengths.find({label: {$nin: ["Night"]}}).forEach( function(tl){
          defaults.push( tl._id );
        });
        return {$setOnInsert: new Date};
      }
    }
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
  var userId = userId ? userId : Meteor.userId();
  return Boats.find({'ownerId':userId});
}

Boats.bookingsSharedWith = function( userId ){
  var userId = userId ? userId : Meteor.userId();
  return Boats.find({'allowedBookingUsers': userId});
}

Boats.related = function(userId ){
  var userId = userId ? userId : Meteor.userId();
  return Boats.find({$or: [{'ownerId': userId},{'allowedBookingUsers': userId}] });
}

Boats.relatedPublished = function(userId ){
  var userId = userId ? userId : Meteor.userId();
  return Boats.find({$and: [{$or: [{'ownerId': userId},{'allowedBookingUsers': userId}]},{publicPublish: true}]});
}

Boats.relatedIds = function(userId ){
  var userId = userId ? userId : Meteor.userId();
  return Boats.related(userId).map(function(b){return b._id});
}

Boats.relatedPublishedIds = function(userId ){
  var userId = userId ? userId : Meteor.userId();
  return Boats.relatedPublished(userId).map(function(b){return b._id});
}

Boats.selected = function(){
  if( Session.get("selectedBoat") ){
    return Boats.findOne( Session.get("selectedBoat") );
  }else if( Boats.related().count() === 1 ){
    return Boats.related().fetch()[0];
  }
}
Boats.setSelected = function(id){ 
  Session.set("selectedBoat", id); 
  if( Meteor.isClient ){
    Router.go( AccountsEntry.settings.dashboardRoute );
  }
}
Boats.editing = function(){
  if( Session.get("editingBoat") ){
    return Boats.findOne( Session.get("selectedBoat") );
  }
}
Boats.setEditing = function(id){ 
  Session.set("editingBoat", id); 
}

Boats.ambiguous = function( userId ){ 
  var userId = userId ? userId : Meteor.userId();
  return Boats.related(userId).count() > 1 && !Session.get("selectedBoat"); 
}
