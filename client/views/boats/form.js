Template.boatForm.editDoc = Boats.selected;

Template.boatForm.disabled = function(){ 
  return Template.boatForm.formMode() === "readonly" ? "disabled" : "";
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
        Boats.setEditing( result );
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
