PackageSchema = new SimpleSchema({
  target: {
    type: "String",
    label: "Target Fish"
  },
  tripLengths: {
    type: [String]
  }
});

Packages = new Meteor.Collection('Packages', {
  schema: PackageSchema
});

Packages.allow({
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

