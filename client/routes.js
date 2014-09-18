var permSubs = new SubsManager({cacheLimit: 9999, expireIn: 9999}); 
var tmpSubs = new SubsManager({cacheLimit: 5, expireIn: 3}); 

IronRouterProgress.configure({
    delay : 100
});

Router.configure({
  layoutTemplate: 'layout',
  loadingTemplate: 'loading',
});

var permSubsList = function(){
  return [
    permSubs.subscribe('Notifications'),
    permSubs.subscribe('RelatedBoats'),
    permSubs.subscribe('TripLengths')
  ];
};

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
      permSubsList();
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
      permSubsList();
    }
  });
  this.route('schedule', {
    path: '/schedule',
    template: 'schedule',
    waitOn: function(){
      AccountsEntry.signInRequired(this);
      return [permSubsList(),tmpSubs.subscribe('Bookings')];
    },
    onAfterAction: function(){
      GAnalytics.pageview("/calendar");
    }
  });
  this.route('sharing', {
    path: '/sharing',
    template: 'sharing',
    waitOn: function(){
      AccountsEntry.signInRequired(this);
      if( Boats.selected() === undefined ){ Router.go('schedule'); };
      return permSubsList();
    },
    onAfterAction: function(){
      GAnalytics.pageview("/sharing");
    }
  });
  this.route('boats', {
    path: '/boats',
    template: 'boats',
    waitOn: function(){
      AccountsEntry.signInRequired(this);
      return permSubsList();
    },
    onAfterAction: function(){
      GAnalytics.pageview("/boats");
    }
  });
  this.route('newBoat', {
    path: '/boats/new',
    template: 'boatForm',
    waitOn: function(){
      AccountsEntry.signInRequired(this);
      return permSubsList();
    },
    onAfterAction: function(){
      GAnalytics.pageview("/boats/new");
    }
  });
  this.route('editBoat', {
    path: '/boats/:_id',
    template: 'boatForm',
    waitOn: function(){
      AccountsEntry.signInRequired(this);
      return permSubsList();
    },
    onBeforeAction: function(){
      Boats.setSelected( this.params._id );
    },
    onAfterAction: function(){
      GAnalytics.pageview("/boats/edit");
    }
  });
}); 
