Template.home.created = function(){
  Session.set('buttonText', "up");
}

Template.home.destroyed = function(){
  Session.set('buttonText', undefined);
}
