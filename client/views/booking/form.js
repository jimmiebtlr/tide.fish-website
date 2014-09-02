Template.bookingForm.mode = function(){
  if( editing() ){
    return 'update';
  }
  return 'insert';
}

Template.bookingForm.rendered = function(){
  $('#notes').wysihtml5({
    "image":false
  });
}

Template.bookingForm.modeLabel = function(){
  if( editing() ){
    return 'Edit';
  }
  return 'New';
}

Template.bookingForm.editDoc = function(){
  return Bookings.findOne(Session.get("id"));
}

function editing(){
  if( Session.get("id") != null ){
    return true;
  }
  return false;
}

AutoForm.addHooks(['bookingForm'],{
  before: {
    insert: function(doc, template) {
      var boat = Boats.findOne({'ownerId': Meteor.userId()});
      doc.boatId = boat._id;
      doc.ownerId = boat.ownerId;
      doc.external = true;
      console.log( doc );
      return doc;
    }, 
    update: function(docId, modifier, template) {
      return modifier;
    }
  },
  after: {
    insert: function(error, result, template) {
      handleErr( error );
    },
    update: function(error, result, template) {
      handleErr( error );
    },
  }
});

function handleErr(err ){
  if( err != null ){
    console.log( err );
  }else{
    Router.go('calendar');
  }
}
