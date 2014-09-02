var ambiguousBoat = function(){
  if( Boats.related(Meteor.userId() ).count() > 1 ){
    return true;
  }
  return false;
}

Template.calendar.created = function(){
  if( Session.get('calDate') == null ){
    Session.set('calDate',moment().format("MM/DD/YYYY"));
  }
}

Template.calendar.rendered = function(){
  $('#calendar').fullCalendar({
    dayClick: function(d,evt,view){
      var date = new Date( d );
      Session.set('calDate',(moment(date)).format("MM/DD/YYYY"));
      Session.set("schedule-editBooking",undefined);
      Session.set("schedule-editBoat",undefined);
      $('#calendar').fullCalendar('gotoDate',date);
      $('#calendar').fullCalendar('select',date);
    }
  });
  $('#calendar').fullCalendar('select', new Date( Session.get('calDate')));
}

Template.calendar.destroy = function(){
  Session.set("schedule-editBooking",undefined);
  Session.set("schedule-editBoat",undefined);
}

Template.schedule.dateString = function(){
  return Session.get('calDate');
}

Template.schedule.boatData = function(){
  var date = moment(Session.get('calDate'), "MM/DD/YYYY");
  var dateStart = date.clone().startOf("day").utc();
  var dateEnd = date.clone().endOf("day").utc();
  var boats = Boats.related(Meteor.userId()).fetch();
  _.each(boats,function(boat){
    if( boat.name === undefined ){ boat.name = boat._id; }
    var bookings = Bookings.find({'date': {$gte: dateStart.toDate(), $lte: dateEnd.toDate()}, 'boatId': boat._id}).fetch();
    if( bookings.length > 0 ){ 
      boat.hasBookings = true; 
    }else{
      boat.hasBookings = false;
    }
    _.each(bookings,function(booking){
      booking.tripLength = TripLengths.findOne(booking.tripLengthId).label; 
    });
    boat.bookings = bookings;
    if( Session.get("schedule-editBoat") === boat._id ){
      boat.bookingForm = true;
    }
  });
  return boats;
}

Template.schedule.events = {
  'click .delete-btn': function( event ){
    if( confirm("Are you sure you would like to cancel this booking?") ){
      Bookings.remove({'_id': event.currentTarget.id.replace("delete-","")});
      Notifications.success("Booking removed successfully");
    }
  },
  'click .edit-btn': function( evt ){
    var boatId = evt.target.parentElement.parentElement.parentElement.id.replace("boat-","");
    if( boatId !== Session.get("schedule-editBoat") || evt.currentTarget.id.replace("edit-","") !== Session.get("schedule-editBooking") ){ 
      Session.set("schedule-editBoat",boatId);
      Session.set("schedule-editBooking",evt.currentTarget.id.replace("edit-",""));
    }else{
      Session.set("schedule-editBooking",undefined);
      Session.set("schedule-editBoat",undefined);
    }
  },
  'click .new-btn': function( evt ){
    var boatId = evt.target.parentElement.parentElement.id.replace("boat-","");
    if( boatId !== Session.get("schedule-editBoat") || Session.get("schedule-editBooking") !== undefined ){
      Session.set("schedule-editBooking",undefined);
      Session.set("schedule-editBoat",boatId);
    }else{
      Session.set("schedule-editBooking",undefined);
      Session.set("schedule-editBoat",undefined);
    }
    $('#notes').val("");
  }
}

Template.schedule.dateFuture = function(){
  return moment(Session.get('calDate'), "MM/DD/YYYY") > moment().utc().endOf("day");
}

var ambiguousBoat = function(){
  if( Boats.related(Meteor.userId()).count() > 1 ){
    return true;
  }
  return false;
}

Template.schedule.ambiguousBoat = ambiguousBoat;
