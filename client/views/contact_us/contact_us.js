Template.contact_us.contactFormSchema = function(){
  return new SimpleSchema({
    name: {
      type: String,
      optional: true
    },
    email: {
      type: String,
      regEx: SimpleSchema.RegEx.Email
    },
    subject: {
      type: String,
      allowedValues: ['','Feature Request','Bug Report','Other']
    },
    details: {
      type: String,
      label: "Details",
      max: 1000
    }
  });
}
