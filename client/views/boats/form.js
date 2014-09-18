Template.boatForm.editDoc = Boats.editBoat;

Template.boatForm.formMode = function(){ return Boats.editBoat() ? "update" : "insert"; };

AutoForm.addHooks(['boatForm'],{
  after: {
    insert: function(err, result, template){
      if( err === undefined ){
        console.log( result );
        Boats.setEditBoat( result );
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
