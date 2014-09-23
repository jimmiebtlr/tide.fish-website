Template.sharing.owned = function(){ 
  return Boats.selected() && Meteor.userId() === Boats.selected().ownerId;
}

Template.newShareRequest.editDoc = function(){
  return Boats.owned( Meteor.userId() );
}

Template.newShareRequest.events = {
  'submit': function(evt){
    evt.preventDefault();
    Meteor.call('findUser', $('#newBookingUser').val(), function(err, resp){
      if( resp.error === undefined && err === undefined ){
        var n = {
          from: Meteor.userId(), 
          to: resp.userId, 
          notifyType: "bookingSharingRequest", 
          regarding: Boats.selected()._id, 
          fromMsg: "Sent to " + $('#newBookingUser').val()
        };
        Notifications.insert(n);
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
  return Boats.selected().allowedBookingUsers;
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
    Boats.update({'_id': Boats.selected()._id},{$pull: {'allowedBookingUsers': this.valueOf()}});
  }
});

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
