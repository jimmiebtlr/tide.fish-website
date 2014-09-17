Template.sharingNotification.email = function(){
  console.log( Meteor.users.findOne({'_id': this.from}).registered_emails );
  return Meteor.users.findOne({'_id': this.from}).registered_emails[0].address;
};
