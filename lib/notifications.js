NotificationsSchema = new SimpleSchema({
  from: {
    type: String
  },
  to: {
    type: String
  },
  accepted: {
    type: Boolean,
    defaultValue: false
  },
  displayed: {
    type: Boolean,
    defaultValue: false
  }
});

Notifications = new Meteor.Collection('Notifications',{
  schema: NotificationsSchema
});

Notifications.allow({
  'insert': function(userId, doc){
    console.log( Notifications.find().count() );
    console.log( doc );
    return (doc.from === Meteor.userId());
  },
  'update': function(userId, doc, fields, modifier){
    return (doc.from === Meteor.userId());
  },
  'remove': function(userId, doc){
    return (doc.from === Meteor.userId());
  }
});
