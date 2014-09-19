Template.boats.boats = function(){ return Boats.related( Meteor.userId() ) };

Template.boatLineItem.canEdit = function(){ return Boats.canEdit( this, Meteor.userId() ); };
Template.boatLineItem.canRemove = function(){ return Boats.canRemove( this, Meteor.userId() ); };

Template.boatLineItem.events({
  'click .edit': function(){
    Router.go('editBoat', {'_id': this._id});
  },
  'click .remove': function(){
    if( confirm("Are you sure you would like to permenantly delete \"" + this.name + "\"") ){
      Boats.remove({'_id': this._id});
    }
  }
});
