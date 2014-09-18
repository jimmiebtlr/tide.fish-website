/*
 * Layout
 */
Template.layout.hideNav = function(){
  return Session.get('hideNav');
}

Template.layout.hideFooter = function(){
  return Session.get('hideFooter');
}

/*
 *  Nav
 */
Template.nav.rendered = function(){
  if( Session.get('hideNav') === undefined ){
    var navHeight = $("#nav").innerHeight();
    $("body").css("margin-top", navHeight);
  }
}

Router.onAfterAction( function(){
  $('.navbar-collapse.in').collapse('hide');
});

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
    Boats.setEditing(undefined);
  }
});

Template.boatMenuLineItem.events({
  'click': function(){
    Boats.setSelected(this._id);
    Boats.setEditing(this._id);
  }
});

/*
 *  Footer
 */
Template.footer.rendered = function(){
  if( Session.get('hideFooter') === undefined ){
    var footerHeight = $("#footer").outerHeight();
    $("body").css("margin-bottom", footerHeight);
  }
}
