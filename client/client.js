Meteor.startup(function () {
  AccountsEntry.config({
    logo: 'https://fish-booking-core.s3-us-west-2.amazonaws.com/logo.png',    
    //privacyUrl: '/privacy-policy'     // if set adds link to privacy policy and 'you agree to ...' on sign-up page
    //termsUrl: '/terms-of-use'         // if set adds link to terms  'you agree to ...' on sign-up page
    homeRoute: '/',                    // mandatory - path to redirect to after sign-out
    dashboardRoute: '/schedule',      // mandatory - path to redirect to after successful sign-in
    profileRoute: '/profile',
    passwordSignupFields: 'EMAIL_ONLY',
    //showSignupCode: true
    showOtherLoginServices: true,      // Set to false to hide oauth login buttons on the signin/signup pages. Useful if you are using something like accounts-meld or want to oauth for api access
    /*extraSignUpFields: [{             // Add extra signup fields on the signup page
      field: "name",                           // The database property you want to store the data in
      name: "This Will Be The Initial Value",  // An initial value for the field, if you want one
      label: "Full Name",                      // The html lable for the field
      placeholder: "John Doe",                 // A placeholder for the field
      type: "text",                            // The type of field you want
      required: true                           // Adds html 5 required property if true
     }]*/
  });

  UI.registerHelper("tripLengthOptions", function(){
    var options = [];
    options.push( {label: "", value: ""});
    _.each(TripLengths.find().fetch(),function(tl){
      options.push( {label: tl.label, value: tl._id} );
    });
    return options;
  });
  
  UI.registerHelper("isDisconnected", function(){
    return !Meteor.status().connected;
  });
  
  UI.registerHelper("ambiguousBoat", function(){
    return Boats.ambiguous( Meteor.userId() );
  });

  NotificationSettings.bookingSharingRequest = {
    template: Template.sharingNotification
  };
});
