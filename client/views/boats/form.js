Template.boatDetails.owned = function(){
  if( Boats.selected() && Boats.selected().ownerId === Meteor.userId() ){
    return true;
  }
  return false;
}

Template.boatForm.editDoc = Boats.selected;

Template.boatForm.disabled = function(){ 
  return Template.boatForm.formMode() === "readonly" ? "disabled" : "";
}

Template.boatForm.title = function(){
  if( Boats.selected() ){
    if( Boats.selected().ownerId !== Meteor.userId() ){
      return "Showing Boat";
    }else{
      return "Update Boat";
    }
  }else{
    return "Insert Boat";
  }
}

Template.boatForm.formMode = function(){ 
  if( Boats.selected() ){
    if( Boats.selected().ownerId !== Meteor.userId() ){
      return "readonly";
    }else{
      return "update";
    }
  }else{
    return "insert";
  }
};

AutoForm.addHooks(['boatForm'],{
  after: {
    insert: function(err, result, template){
      if( err === undefined ){
        Boats.setSelected( result );
      }else{
        console.log(err);
      }
    },
    update: function(err, result, template){
      if( err === undefined ){
      }else{
        console.log("Error: " + err);
      }
    }
  }
});

Template.boatFormRemove.events({
  'click .remove': function(){
    if( confirm("Are you sure you would like to permenantly delete this boat?") ){
      Boats.remove( Boats.selected()._id );
      Router.go( AccountsEntry.settings.dashboardRoute );
    }
  }
});
