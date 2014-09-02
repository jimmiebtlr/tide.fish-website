Meteor.startup(function () {
});

Meteor.methods({
  'addAllowedUser': function(boatId, emails){
    check( boatId, String );
    check( emails, [String]);
    console.log( emails );
    var boat = Boats.findOne( boatId );
    var resp = {};
    resp.success = [];
    resp.errors = [];
    if( !boat || boat.ownerId !== Meteor.userId() ){ console.log( "user boat mismatch"); return; }
   
    _.each(emails, function(email){
      var user = Meteor.users.findOne({'emails.address': email });
      if( !user ){ 
        resp.errors.push(email);
      }else{
        resp.success.push({userId: user._id, email: email });
      }
    });
    return resp;
  }
});
