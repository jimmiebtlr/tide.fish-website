Router.map(function() {
  this.route('contact_us', {
    path: '/contact_us',
    onBeforeAction: function(){
      Session.set('contactUsSubject','');
    }

  });
  this.route('feature_request', {
    path: '/feature_request',
    template: 'contact_us',
    onBeforeAction: function(){
      Session.set('contactUsSubject','Feature Request');
    }
  });
  this.route('bug_report', {
    path: '/bug_report',
    template: 'contact_us',
    onBeforeAction: function(){
      Session.set('contactUsSubject','Bug Report');
    }
  });
});

Template.contact_us.contactFormSchema = function(){
  return contactUsSchema;
}

Template.contact_us.subject = function(){
  return Session.get('contactUsSubject');
}

Template.contact_us.destroyed = function(){
  Session.set('contactUsSubject',undefined);
}

AutoForm.addHooks(['contactForm'],{
  before: {
    "sendEmail": function(doc, template) {
      doc.email = Meteor.user().emails[0].address;
      console.log( doc );
      return doc;
    }
  }
});
