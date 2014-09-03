Router.configure({
  layoutTemplate: 'layout',
  loadingTemplate: 'home',
});

Router.onBeforeAction('loading');

Router.map(function() {
  this.route('home', {
    path: '/',
    template: 'home',
    onAfterAction: function() {
      console.log( "Here" );
      SEO.set({
        title: "Tide.Fish - Cloud Booking for Charter Fishing",
        meta: {
          'description':"Tide.Fish - Cloud Booking for Charter Fishing"
        },
        og: {
          'title': "Tide.Fish - Cloud Booking for Charter Fishing",
          'description': "Tide.Fish - Cloud Booking for Charter Fishing"
        }
      });
    }
  });
  this.route('calendar', {
    path: '/calendar',
    template: 'calendar',
    waitOn: function(){
      return [Meteor.subscribe('Boats'),Meteor.subscribe('Bookings'),Meteor.subscribe('TripLengths')];
    }
  });
  this.route('newBooking', {
    path: '/bookings/new',
    template: 'bookingForm',
    waitOn: function(){
      return [Meteor.subscribe('Boats'),Meteor.subscribe('TripLengths')];
    }
  });
  this.route('profile', {
    path: '/profile',
    template: 'profile',
    waitOn: function(){
      return [Meteor.subscribe('Boats')];
    }
  });
}); 
