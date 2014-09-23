Template.home.created = function(){
  GAnalytics.pageview();
  Session.set('buttonText', "up");
}

Template.home.destroyed = function(){
  Session.set('buttonText', undefined);
}
