// Keepalive hack
process.argv = _.without(process.argv, '--keepalive');
Meteor.startup(function () { console.log("LISTENING"); });

Kadira.connect('3Jqsd2Qz6QFaBPC34', '155571df-d574-4d14-aa34-a7a5c8dfff40');

Meteor.startup(function(){
  //console.log( Meteor.users.find({}).fetch() );
  Accounts.config({sendVerificationEmail: true, forbidClientAccountCreation: false});
});

Meteor.methods({
  'findUser': function(email){
    check( email, String);
    if( Meteor.userId() === undefined ){ return; }

    var user = Meteor.users.findOne({'registered_emails.address': email });
    var resp = {};
    if( !user ){ 
      resp.error = "User not found";
    }else{
      resp.userId = user._id;
    }
    return resp;
  },
  'sendEmail': function( formVals ){
    check( formVals, contactUsSchema );
    
    if( Meteor.user() !== null ){
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

Notifications.before.insert(function(userId, doc){
  check( doc.from, String);
  check( doc.regarding, String );
  doc.msg = Meteor.users.findOne({ '_id': doc.from }).registered_emails[0].address
    + " has offered to share his/her booking schedule for the boat \""
    + Boats.findOne({'_id': doc.regarding }).name + "\"";
  return doc;
});

Notifications.after.update(function(userId, doc, fieldNames, modifier, options){
  if( doc.accepted ){
    Boats.update({'_id': doc.regarding},{$push: {'allowedBookingUsers': doc.to}});
  }
});
