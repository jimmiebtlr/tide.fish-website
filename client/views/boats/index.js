Template.boats.boats = function(){ return Boats.related( Meteor.userId() ) };

Template.boatLineItem.events({
  'click': function(){
    Boats.setSelectedBoat( this._id );
  }
});
