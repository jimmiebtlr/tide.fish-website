Template.calBookingForm.boatOptions = function(){
  var boatOptions = [];
  boatOptions.push({value:"", label:""});
  _.each(Boats.related(Meteor.userId()).fetch(),function(boat){
    var label = "";
    if( boat.name === undefined ){ label = boat._id; }
    else{ label=  boat.name; }
    boatOptions.push({
      value: boat._id,
      label: label 
    });
  });
  return boatOptions;
}

Template.calBookingForm.rendered = function(){
  $('#notes').wysihtml5({
    "font-styles": false,
    "emphasis":false,
    "lists":false,
    "html":false,
    "link":false,
    "image":false,
    "color":false
  });
}

Template.calBookingForm.mode = function(){
  if( Session.get("schedule-editBooking") ){
    return "update";
  }
  return "insert";
}

Template.calBookingForm.readableMode = function(){
  if( Session.get("schedule-editBooking") ){
    return "Update";
  }
  return "Insert";
}

Template.calBookingForm.editDoc = function(){
  return Bookings.findOne({'_id': Session.get("schedule-editBooking")});
}

AutoForm.addHooks(['calBookingForm'],{
  before: {
    insert: function(doc, template) {
      var boat = Boats.findOne({'ownerId': Meteor.userId()});
      if( Boats.ambiguous( Meteor.userId() ) ){
        doc.boatId = Session.get("schedule-editBoat");
      }else{
        doc.boatId = Boats.related( Meteor.userId() ).fetch()[0]._id;
      }
      doc.date = new Date(Session.get('vertiCalSelectedDate'));
      doc.ownerId = boat.ownerId;
      doc.external = true;
      return doc;
    },
    update: function(docId, modifier,template){
      return modifier;
    }
  },
  after: {
    insert: function( err ){
      if( err === undefined ){
        Notifications.success("Booking added successfully");
        Session.set("schedule-editBoat",undefined);
        Session.set("schedule-editBooking",undefined);
      }else{
        //Notify.error(err.toString() );
      }
    },
    update: function( err ){
      if( err === undefined ){
        Notifications.success("Booking updated successfully");
        Session.set("schedule-editBoat",undefined);
        Session.set("schedule-editBooking",undefined);
      }else{
        //Notify.error(err.toString() );
      }
    }
  }
});
