var disabledReason = function(){
  if( Boats.related().count() === 0 ){ return "You currently have no boats" };
  if( !Boats.selected() ){ return "You havn't selected a specific boat" };
}

var disabled = function(){ return disabledReason() ? true : false;}

Template.navSharingLink.disabled = disabled;
Template.navSharingLink.disabledReason = disabledReason;
Template.navBoatDetailsLink.disabled = disabled;
Template.navBoatDetailsLink.disabledReason = disabledReason;

Template.navScheduleLink.disabledReason = function(){
  if( Boats.related().count() === 0 ){ return "You currently don't have access to any boats";}
  return;
}

Template.navScheduleLink.disabled = function(){
  return Boats.related().count() === 0;
}
