Template.boatProfile.editDoc = function(){
  return Boats.owned( Meteor.userId() );
}

Template.boatSharing.events = {
  'submit': function(evt){
    evt.preventDefault();
    var boat = Template.boatProfile.editDoc();
    Meteor.call('findUser', $('#newBookingUser').val(), function(err, resp){
      if( resp.error === undefined && err === undefined ){
        Notifications.insert({from: Meteor.userId(), to: resp.userId, notifyType: "bookingSharingRequest"});
        $('#newBookingUser').val("");
      }else{
        console.log( err );
        console.log( resp.error );
      }
    });
  }
}

/*
 * Active
 */
Template.shared.shared = function(){
  return Boats.owned(Meteor.userId()).allowedBookingUsers;
}

/*
 * Pending
 */
Template.pendingShares.pendingShares = function(){
  return Notifications.find({'$and': [{notifyType: "bookingSharingRequest"},{from: Meteor.userId()},{accepted: false},{declined: false}]});
}

Template.pendingShare.events({
  'click .remove': function(){
    Notifications.remove({'_id': this._id});
  }
});

/*
 * Shared with you
 */
Template.sharedWithYou.sharedWithYou = function(){
  console.log( Boats.bookingsSharedWith( Meteor.userId() ).fetch() );
  return Boats.bookingsSharedWith( Meteor.userId() );
}
