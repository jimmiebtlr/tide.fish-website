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

var validateEmail = function( email ){
  emailPattern = /^([\w.-]+)@([\w.-]+)\.([a-zA-Z.]{2,6})$/i;
  if( email.match(emailPattern ) ){
    return;
  }else{
    return "Email is not valid.  ";
  }
}

Template.signUpForm.hasErrors = function(){
  return Session.get("passwordErrors") || Session.get("emailErrors");
}

Template.signUpForm.errors = function(){
  var msg = "";
  if( Session.get("emailErrors") ){
    msg += Session.get("emailErrors");
  }
  if( Session.get("passwordErrors") ){
    msg += Session.get("passwordErrors");
  }
  return msg;
}

Template.signUpForm.destroyed = function(){
  Session.set("passwordErrors", undefined);
}

Template.signUpForm.events({
  'click #submit': function(e, template) {
    e.preventDefault();
    var emailErrors = validateEmail( $('#email').val() );
    Session.set("emailErrors", emailErrors);
    var passwordErrors = validatePassword( $('#password').val() );
    Session.set("passwordErrors", passwordErrors);
    if( !emailErrors && !passwordErrors ){
      Accounts.createUser({
        email: $('#email').val(),
        password: $('#password').val()
      });
      Meteor.loginWithPassword($('#email').val(), $('#password').val());
      Router.go('/calendar');
    }
  }
});
