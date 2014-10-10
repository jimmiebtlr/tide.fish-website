var permSubs = new SubsManager({cacheLimit: 9999, expireIn: 9999}); 
var tmpSubs = new SubsManager({cacheLimit: 5, expireIn: 3}); 

if( Meteor.isClient ){
  IronRouterProgress.configure({
      delay : 100
  });
}

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
if( Meteor.isClient ){
  Router.onAfterAction( function(){ GAnalytics.pageview(Router.current().path); });
}

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
      permSubsList();
    },
    fastRender: true
  });
  this.route('schedule', {
    path: '/schedule',
    template: 'schedule',
    waitOn: function(){
      AccountsEntry.signInRequired(this);
      return [permSubsList(),tmpSubs.subscribe('Bookings')];
    }
  });
  this.route('sharing', {
    path: '/sharing',
    template: 'sharing',
    waitOn: function(){
      AccountsEntry.signInRequired(this);
      return permSubsList();
    }  
  });
  this.route('boats', {
    path: '/boats',
    template: 'boats',
    waitOn: function(){
      AccountsEntry.signInRequired(this);
      return permSubsList();
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
    }  
  });
  this.route('boatDetails', {
    path: '/boats/details',
    template: 'boatDetails',
    waitOn: function(){
      AccountsEntry.signInRequired(this);
      return permSubsList();
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
  this.route('newUserOrientation', { });
}); 
