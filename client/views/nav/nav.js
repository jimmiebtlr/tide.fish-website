/*
 *  Nav
 */
Template.nav.rendered = function(){
  if( Session.get('hideNav') === undefined ){
    var navHeight = $("#nav").innerHeight();
    $("body").css("margin-top", navHeight);
  }
}

Router.onAfterAction( function(){
  $('.navbar-collapse.in').collapse('hide');
});
