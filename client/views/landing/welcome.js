Template.welcome.created = function(){
  GAnalytics.pageview();
  Session.set('hideNav', true);
}

Template.welcome.destroyed = function(){
  Session.set('hideNav', undefined);
}
