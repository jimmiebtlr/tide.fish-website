Template.profile.helpers({
  htmlSnippet: function(){
    return '<div id="tideFishSchedule" data-accountId="' + Meteor.userId() + '"></div>';
  },
  jsSnippet: function(){
    return '<script src="https://s3.amazonaws.com/tidefish-widget/widget.js"></script>';
  }
});
