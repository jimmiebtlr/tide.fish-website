Template.boats.boats = function(){ return Boats.related( Meteor.userId() ) };

Template.boatLineItem.canEdit = function(){ Boats.canEdit( this, Meteor.userId() ); };
Template.boatLineItem.canRemove = function(){ Boats.canRemove( this, Meteor.userId() ); };

Template.boatLineItem.events({
  'click .edit': function(){
    Boats.setEditing( this._id );
    Router.go('editBoat');
  },
  'click .remove': function(){
    if( confirm("Are you sure you would like to permenantly delete \"" + this.name + "\"") ){
      Boats.remove({'_id': this._id});
    }
  }
});
