/*
 * Shared with you
 */
Template.sharedWithYou.created = function(){
  this.data = Boats.selected();
}

Template.sharedWithYou.sharedWithYou = function(){
  return Boats.bookingsSharedWith( Meteor.userId() );
}

Template.sharedWithYou.events({
  'click .remove': function(){
    if( confirm("Are you sure you would like to be removed from this boat?") ){
      console.log( Boats.selected()._id );
      console.log( Meteor.userId() );
      Boats.update({'_id': Boats.selected()._id},{$pull: Meteor.userId()});
    }
  }
});
