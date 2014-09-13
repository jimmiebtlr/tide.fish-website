Template.welcome.created = function(){
  GAnalytics.pageview();
  Session.set('hideNav', true);
  Session.set('hideFooter', true);
  Session.set('buttonText', "up");
}

Template.welcome.destroyed = function(){
  Session.set('hideNav', undefined);
  Session.set('hideFooter', undefined);
  Session.set('buttonText', undefined);
}
