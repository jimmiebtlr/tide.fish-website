/*
 * Boat Menu
 */
Template.boatMenu.boats = function(){ return Boats.related( Meteor.userId() ); }

Template.boatMenu.label = function(){
  if( Boats.selected() ){return Boats.selected().name;}
  else{ return "All Boats"; }
}

Template.boatMenu.events({
  'click .deselectBoat': function(){
    Boats.setSelected(undefined);
  }
});

Template.boatMenuLineItem.events({
  'click': function(){
    Boats.setSelected(this._id);
  }
});

Template.boatMenuLineItem.canEdit = function(){
  return Boats.canEdit( this, Meteor.userId() );
}

Template.boatMenuLineItem.canRemove = function(){
  return Boats.canRemove( this, Meteor.userId() );
}
