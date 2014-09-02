Router.configure({
  layoutTemplate: 'layout',
  loadingTemplate: 'home',
});

Router.onBeforeAction('loading');

Router.map(function() {
  this.route('home', {
    path: '/',
    template: 'home'
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
