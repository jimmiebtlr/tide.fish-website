Router.map(function(){
  this.route('landing2', {
    path: '/landing2',
    template: 'landing2',
    onBeforeAction: function(){
      Session.set("wrapLayout", false);
    },
    onAfterAction: function() {
      SEO.set({
        title: "Tide.Fish - Cloud Booking for Fishing Charters",
        meta: {
          'description':"Tide.Fish - Cloud Booking for Fishing Charters"
        },
        og: {
          'title': "Tide.Fish - Cloud Booking for Fishing Charters",
          'description': "Tide.Fish - Cloud Booking for Fishing Charters"
        }
      });
    }
  });
});

Template.landing2.created = function(){
  Session.set('buttonText', "up");
}

Template.landing2.destroyed = function(){
  Session.set('buttonText', undefined);
}
