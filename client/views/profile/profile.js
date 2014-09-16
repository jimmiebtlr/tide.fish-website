Template.boatProfile.created = function(){
  if( Session.get("toBeAdded") === undefined ){
    Session.set("toBeAdded",[]);
  }
  
  if( Session.get("currentlyAllowed") === undefined ){
    Session.set("currentlyAllowed",Template.boatProfile.editDoc().allowedBookingUsers);
  }
}

Template.boatProfile.destroyed = function(){
  Session.set("toBeAdded",undefined);
  Session.set("currentlyAllowed",undefined);
};

Template.boatProfile.editDoc = function(){
  return Boats.findOne({'ownerId': Meteor.userId() });
}

Template.boatProfile.allowedUsers = function(){
  return Session.get("currentlyAllowed");
}

Template.boatProfile.toBeAdded = function(){
  return Session.get("toBeAdded");
}

Template.boatProfile.events = {
  'click .removeAllowedUser': function( evt ){
    var cas = Session.get("currentlyAllowed");
    var cas = cas.filter( function(ca){
      return (evt.currentTarget.parentNode.id !== ca.userId); 
    });
    Session.set("currentlyAllowed", cas);
  },
  'click .removeToBeAdded': function(evt){
    var tbas = Session.get("toBeAdded");
    var tbas = tbas.filter( function(tba){
      return (evt.currentTarget.parentNode.id !== tba.userId); 
    });
    Session.set("toBeAllowed", tbas);
  },
  'blur #addAllowedBookingUser': function(){
    if( $('#addAllowedBookingUser').val() !== "" ){
      Meteor.call('addAllowedUser', Template.boatProfile.editDoc()._id, [$('#addAllowedBookingUser').val()], function(err, resp){
        if( resp.errors.length === 0 ){
          _.each( resp.success, function( user ){
            var tba = Session.get("toBeAdded");
            tba.push( user );
            Session.set("toBeAdded", tba );
            $('#addAllowedBookingUser').val("");
          });
        }else{
          //Notify.error( "Could not find user " + resp.errors );
        }
      });
    }
  }
}

AutoForm.addHooks(['boatProfile'],{
  before: {
    update: function(docId, modifier, template){
      var newAllowedUsers = [];
      _.each( Session.get("currentlyAllowed"), function( user ){ newAllowedUsers.push(user)});
      _.each( Session.get("toBeAdded"), function( user ){ newAllowedUsers.push(user)});
      Session.set("toBeAdded",[]);
      Session.set("currentlyAllowed",newAllowedUsers);
      if( modifier.$set === undefined ){ modifier.$set = {}; }
      modifier.$set.allowedBookingUsers = newAllowedUsers;
      console.log( modifier );
      return modifier;
    }
  },
  after: {
    update: function(err){
      if( err === undefined ){
        //Notify.success("Saved", "Profile saved successfully");
      }
    }
  }
});
