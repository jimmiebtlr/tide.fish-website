contactUsSchema = new SimpleSchema({
    name: {
      type: String,
      optional: true
    },
    email: {
      type: String,
      regEx: SimpleSchema.RegEx.Email,
      optional: true
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
