/*
 * Layout
 */
Template.layout.hideNav = function(){
  return Session.get('hideNav');
}

Template.layout.withoutWrapper = function(){
  return !Session.get("wrapLayout");
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

Template.nav.events({
  'click .editBoat': function(){ 
    if( Boats.selected() ){
      Router.go('editBoat',{'_id': Boats.selected()._id});
    }else{
      var boat = Boats.related().fetch()[0];
      Boats.setSelected( boat._id );
      Router.go('editBoat',{'_id': boat._id});
    }
  }
});

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

/*
 *  Footer
 */
Template.footer.rendered = function(){
  if( Session.get('hideFooter') === undefined ){
    var footerHeight = $("#footer").outerHeight();
    $("body").css("padding-bottom", footerHeight);
  }
}
