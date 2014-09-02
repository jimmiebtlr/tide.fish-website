var validatePassword = function(password){
  msg = "";
  if( password.length < 7 ){
    msg += t9n('error.minChar') + "\r\n";
  }
  if( password.search(/[a-z]/i) < 0){
    msg += t9n('error.pwOneLetter') + "\r\n";
  }
  if( password.search(/[0-9]/) < 0 ){
    msg += t9n('error.pwOneDigit') + "\r\n";
  }
  if( msg !== "" ){ return msg; }
  return;
}

Template.signUpForm.hasErrors = function(){
  return Session.get("passwordErrors") !== undefined;
}

Template.signUpForm.errors = function(){
  return Session.get("passwordErrors");
}

Template.signUpForm.destroyed = function(){
  Session.set("passwordErrors", undefined);
}

Template.signUpForm.events({
  'click #submit': function(e, template) {
    e.preventDefault();
    var passwordErrors = validatePassword( $('#password').val() );
    Session.set("passwordErrors", validatePassword( $('#password').val()));
    /*
    Accounts.createUser({
      email: $('#email').val(),
      password: $('#password').val()
    });
    Meteor.loginWithPassword($('#email').val(), $('#password').val());
    Router.go('/calendar');*/
  }
});
