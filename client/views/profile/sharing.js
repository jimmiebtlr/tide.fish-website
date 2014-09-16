Template.boatSharing.created = function(){
  if( Session.get("toBeAdded") === undefined ){
    Session.set("toBeAdded",[]);
  }
  
  if( Session.get("currentlyAllowed") === undefined ){
    Session.set("currentlyAllowed",Template.boatProfile.editDoc().allowedBookingUsers);
  }
}

Template.boatProfile.editDoc = function(){
  return Boats.findOne({'ownerId': Meteor.userId() });
}

Template.boatSharing.destroyed = function(){
  Session.set("toBeAdded",undefined);
  Session.set("currentlyAllowed",undefined);
};

Template.boatSharing.allowedUsers = function(){
  return Session.get("currentlyAllowed");
}

Template.boatSharing.toBeAdded = function(){
  return Session.get("toBeAdded");
}

Template.boatSharing.events = {
  'submit': function(evt){
    evt.preventDefault();
    var boat = Template.boatProfile.editDoc();
    Meteor.call('findUser', $('#newBookingUser').val(), function(err, resp){
      if( resp.error === undefined && err === undefined ){
        var success = Notifications.insert({from: Meteor.userId(), to: resp.userId });
        console.log( success );
        $('#newBookingUser').val("");
      }else{
        console.log( err );
        console.log( resp.error );
      }
    });
  },
  'click .removeAllowedUser': function( evt ){
    var cas = Session.get("currentlyAllowed");
    var cas = cas.filter( function(ca){
      return (evt.currentTarget.parentNode.id !== ca.userId); 
    });
    Session.set("currentlyAllowed", cas);
  },
  'blur #addAllowedBookingUser': function(){
    if( $('#addAllowedBookingUser').val() !== "" ){

    }
  }
}
