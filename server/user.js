Meteor.users.after.insert(function(userId, doc){
  Boats.insert({'ownerId': doc._id});
});
