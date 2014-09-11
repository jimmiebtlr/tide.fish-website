Template.layout.hideNav = function(){
  return Session.get('hideNav');
}

Template.layout.hideFooter = function(){
  return Session.get('hideFooter');
}

Template.nav.rendered = function(){
  if( Session.get('hideNav') === undefined ){
    var navHeight = $("#nav").innerHeight();
    $("body").css("margin-top", navHeight);
  }
}
Template.footer.rendered = function(){
  if( Session.get('hideFooter') === undefined ){
    var footerHeight = $("#footer").innerHeight();
    $("body").css("margin-bottom", footerHeight);
  }
}
