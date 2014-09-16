Kadira.connect('3Jqsd2Qz6QFaBPC34', '155571df-d574-4d14-aa34-a7a5c8dfff40');

Meteor.methods({
  'findUser': function(email){
    check( email, String);//SimpleSchema.RegEx.Email);
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
