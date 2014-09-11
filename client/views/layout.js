Template.layout.hideNav = function(){
  return Session.get('hideNav');
}

Template.layout.hideFooter = function(){
  return Session.get('hideFooter');
}

Template.footer.rendered = function(){ 
  var footerHeight = $("#footer").innerHeight();
  $("body").css("margin-bottom", footerHeight);
}
