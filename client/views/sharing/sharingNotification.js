Template.sharingNotification.email = function(){
  return Meteor.users.findOne({'_id': this.from}).registered_emails[0].address;
};
