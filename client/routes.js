var permSubs = new SubsManager({cacheLimit: 9999, expireIn: 9999}); 
var tmpSubs = new SubsManager({cacheLimit: 5, expireIn: 3}); 

IronRouterProgress.configure({
    delay : 100
});

Router.configure({
  layoutTemplate: 'layout',
  loadingTemplate: 'loading',
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
    }
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
  this.route('schedule', {
    path: '/schedule',
    template: 'schedule',
    waitOn: function(){
      AccountsEntry.signInRequired(this);
      return [permSubs.subscribe('TripLengths'),permSubs.subscribe('RelatedBoats'),tmpSubs.subscribe('Bookings')];
    },
    onAfterAction: function(){
      GAnalytics.pageview("/calendar");
    }
  });
  this.route('newBooking', {
    path: '/bookings/new',
    template: 'bookingForm',
    waitOn: function(){
      AccountsEntry.signInRequired(this);
      return [Meteor.subscribe('Boats')];
    },
    cache: true
  });
  this.route('profile', {
    path: '/profile',
    template: 'profile',
    waitOn: function(){
      AccountsEntry.signInRequired(this);
      return [permSubs.subscribe('RelatedBoats'),permSubs.subscribe('TripLengths')];
    },
    onAfterAction: function(){
      GAnalytics.pageview("/profile");
    },
    cache: true
  });
}); 
