Meteor.startup(function(){
  if( TripLengths.find({}).count() == 0 ){
    TripLengths.insert({label: "1/2 day AM"});
    TripLengths.insert({label: "1/2 day PM"});
    TripLengths.insert({label: "3/4 day"});
    TripLengths.insert({label: "Full day"});
    TripLengths.insert({label: "Night"});
  }
});  
