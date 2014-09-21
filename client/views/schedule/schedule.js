var futureSelected = function(){ return moment(Session.get('vertiCalSelectedDate'), "MM/DD/YYYY") > moment().utc().endOf("day")};

Template.scheduleDetails.dateString = function(){
  return Session.get('vertiCalSelectedDate');
}

Template.scheduleDetails.boatData = function(){
  return Boats.selected() ? [Boats.selected()] : Boats.related(Meteor.userId()).fetch();
}

Template.scheduleDetails.dateFuture = futureSelected;


/*
 * Boat Line Item
 */
Template.scheduleBoatLineItem.newForm = function(){ 
  return ((Session.get("schedule-editBoat") === this._id && !Session.get("schedule-editBooking")) || !Boats.ambiguous()) && futureSelected(); 
}

Template.scheduleBoatLineItem.dateFuture = futureSelected;

Template.scheduleBoatLineItem.bookings = function(){ 
  var date = moment(Session.get('vertiCalSelectedDate'), "MM/DD/YYYY");
  var dateStart = date.clone().startOf("day").utc();
  var dateEnd = date.clone().endOf("day").utc();
  return Bookings.find({'date': {$gte: dateStart.toDate(), $lte: dateEnd.toDate()}, 'boatId': this._id}).fetch();
}

Template.scheduleBoatLineItem.events = {
  'click .new-btn': function( evt ){
    if( this._id !== Session.get("schedule-editBoat") || Session.get("schedule-editBooking") !== undefined ){
      Session.set("schedule-editBooking",undefined);
      Session.set("schedule-editBoat",this._id);
    }else{
      Session.set("schedule-editBooking",undefined);
      Session.set("schedule-editBoat",undefined);
    }
    $('#notes').val("");
  }
}

/*
 * Booking Line Item
 */
Template.scheduleBookingLineItem.tripLength = function(){
  return TripLengths.findOne({'_id': this.tripLengthId}).label;
}

Template.scheduleBookingLineItem.dateFuture = futureSelected;

Template.scheduleBookingLineItem.editing = function(){
  return Session.get("schedule-editBooking") === this._id;
}

Template.scheduleBookingLineItem.events = {
  'click .delete-btn': function( event ){
    if( confirm("Are you sure you would like to cancel this booking?") ){
      Bookings.remove({'_id': event.currentTarget.id.replace("delete-","")});
      //Notify.success("Booking removed successfully");
    }
  },
  'click .edit-btn': function( evt ){
    if( this.boatId !== Session.get("schedule-editBoat") || this.boatId !== Session.get("schedule-editBooking") ){ 
      Session.set("schedule-editBoat",this.boatId);
      Session.set("schedule-editBooking",this._id);
    }else{
      Session.set("schedule-editBooking",undefined);
      Session.set("schedule-editBoat",undefined);
    }
  }
}
