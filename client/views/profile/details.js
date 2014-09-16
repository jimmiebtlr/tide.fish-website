Template.boatDetails.editDoc = function(){
  return Boats.findOne({'ownerId': Meteor.userId() });
}

AutoForm.addHooks(['boatSharing'],{
  after: {
    update: function(err){
      if( err === undefined ){
        //Notify.success("Saved", "Profile saved successfully");
      }else{
        console.log("Error: " + err);
      }
    }
  }
});
