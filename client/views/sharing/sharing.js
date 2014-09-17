Template.newShareRequest.editDoc = function(){
  return Boats.owned( Meteor.userId() );
}

Template.newShareRequest.events = {
  'submit': function(evt){
    evt.preventDefault();
    var boat = Boats.owned( Meteor.userId() );
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

Template.singleShare.email = function(){
  var user = Meteor.users.findOne({'_id': this.valueOf()});
  if( user !== undefined && user.registered_emails !== undefined ){
    return user.registered_emails[0].address;
  }else{
    return '';
  }
}

Template.singleShare.events({
  'click .remove': function(){
    Boats.update({'_id': Boats.owned(Meteor.userId())._id},{$pull: {'allowedBookingUsers': this.valueOf()}});
  }
});

/*
 * Pending
 */
Template.pendingShares.pendingShares = function(){
  return Notifications.find({'$and': [{notifyType: "bookingSharingRequest"},{from: Meteor.userId()},{accepted: false},{declined: false}]});
}

Template.pendingShare.email = function(){
  var user = Meteor.users.findOne({'_id': this.to});
  if( user !== undefined && user.registered_emails && user.registered_emails.length > 0 ){
    return user.registered_emails[0].address;
  }else{
    return '';
  }
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
  return Boats.bookingsSharedWith( Meteor.userId() );
}

Template.sharedWithYou.events({
  'click remove': function(){
    console.log( this );
    /*Meteor.call('removeSelfFromBoatBookings', ,function(){
    });*/
  }
});
