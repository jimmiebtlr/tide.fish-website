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
      GAnalytics.pageview("/");
    },
    cache: true
  });
  this.route('welcome', {
    path: 'welcome',
    onAfterAction: function() {
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
      GAnalytics.pageview("/");
    }
  });
  this.route('calendar', {
    path: '/calendar',
    template: 'calendar',
    waitOn: function(){
      return [Meteor.subscribe('Boats'),Meteor.subscribe('Bookings'),Meteor.subscribe('TripLengths')];
    },
    onAfterAction: function(){
      GAnalytics.pageview("/calendar");
    },
    cache: 5,
    expire: 10
  });
  this.route('newBooking', {
    path: '/bookings/new',
    template: 'bookingForm',
    waitOn: function(){
      return [Meteor.subscribe('Boats'),Meteor.subscribe('TripLengths')];
    },
    cache: true
  });
  this.route('profile', {
    path: '/profile',
    template: 'profile',
    waitOn: function(){
      return [Meteor.subscribe('Boats')];
    },
    onAfterAction: function(){
      GAnalytics.pageview("/profile");
    },
    cache: true
  });
}); 
