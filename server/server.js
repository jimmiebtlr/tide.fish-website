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
  },
  'sendEmail': function( formVals ){
    check( formVals, contactUsSchema );
    
    if( Meteor.user() !== undefined ){
      formVals.email = Meteor.user().emails[0].address;
    }
    
    Email.send({
      to: "support@elevatedevdesign.com",
      from: formVals.email,
      subject: "Tide.Fish - " + formVals.subject,
      text: "Name: " + formVals.name + "\n\r" + "Id: " + Meteor.userId() + "\n\r" + formVals.details
    });
  }
});
