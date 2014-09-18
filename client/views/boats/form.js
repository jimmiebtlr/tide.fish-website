Template.boatForm.editDoc = Boats.editing;

Template.boatForm.formMode = function(){ return Boats.editing() ? "update" : "insert"; };

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
