Template.welcome.created = function(){
  GAnalytics.pageview();
  Session.set('hideNav', true);
  Session.set('hideFooter', true);
}

Template.welcome.destroyed = function(){
  Session.set('hideNav', undefined);
  Session.set('hideFooter', undefined);
}
