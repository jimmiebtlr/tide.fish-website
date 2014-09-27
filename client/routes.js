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
    permSubs.subscribe('RelatedBoats'),
    permSubs.subscribe('TripLengths'),
    permSubs.subscribe('User')
  ];
};

Router.onBeforeAction('loading');

Router.onRun(function(){
  Session.set("wrapLayout",true);
}, {except:['home','entrySignUp','entrySignIn']});
Router.onRun(function(){
  Session.set("wrapLayout",false);
}, {only:['home','entrySignUp','entrySignIn']});

Router.map(function(){
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
    onBeforeAction: function(){
      Session.set('selectedBoat',undefined);
    },
    onAfterAction: function(){
      GAnalytics.pageview("/boats/new");
    }
  });
  this.route('boatDetails', {
    path: '/boats/edit',
    template: 'boatDetails',
    waitOn: function(){
      AccountsEntry.signInRequired(this);
      return permSubsList();
    },
    onAfterAction: function(){
      GAnalytics.pageview("/boats/edit");
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
      Session.set('selectedBoat',this.params._id);
    },
    onAfterAction: function(){
      GAnalytics.pageview("/boats/edit");
    }
  });
  this.route('loginRouting', {
    onBeforeAction: function(pause){
      if( Boats.related().count() > 0 ){
        pause();
        Router.go('schedule');
      }else{
        pause();
        Router.go('newUserOrientation');
      }
    }
  });
  this.route('newUserOrientation', {

  });
}); 
