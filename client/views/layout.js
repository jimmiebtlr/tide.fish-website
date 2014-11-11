/*
 * Layout
 */
Template.layout.hideNav = function(){
  return Session.get('hideNav');
}

Template.layout.withoutWrapper = function(){
  return !Session.get("wrapLayout");
}

Template.layout.hideFooter = function(){
  return Session.get('hideFooter');
}

/*
 *  Footer
 */
Template.footer.rendered = function(){
  if( Session.get('hideFooter') === undefined ){
    var footerHeight = $("#footer").outerHeight();
    $("body").css("padding-bottom", footerHeight);
  }
}
