Template.newUserOrientation.email = function(){
  return Meteor.user().registered_emails ? Meteor.user().registered_emails[0].address : Meteor.user().emails[0].address ;
}
