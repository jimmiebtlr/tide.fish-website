Meteor.startup ->
  if TripLengths.find({}).count() is 0
    TripLengths.insert label: "1/2 day AM"
    TripLengths.insert label: "1/2 day PM"
    TripLengths.insert label: "3/4 day"
    TripLengths.insert label: "Full day"
    TripLengths.insert label: "Night"
  if process.env.NODE_ENV is "development"
    if Meteor.users.find().count() is 0
      tripLengths = TripLengths.find().fetch()

      console.log "Creating Seed Users"
      captainId = Accounts.createUser( email: "captain@queenanne.com",password: "password1" )
      marinaId = Accounts.createUser( email: "joe@themarina.com", password: "password1" )
      marina2Id = Accounts.createUser( email: "susey@themarina.com", password: "password1" )
      firstMateId = Accounts.createUser( email: "firstmate@queenanne.com", password: "password1" )

      console.log "Creating Seed Boat"
      boatId = Boats.insert(
        name: "Queen Anne"
        ownerId: captainId
        allowedBookingUsers: []
        publicPublish: true
      ,
        getAutoValues: false
      )
      console.log( "BoatId: " + boatId )

      console.log "Creating Seed Bookings"
      bookingDate = moment()
      for i in [0..60] by 1
        Bookings.insert(
          boatId: boatId
          startDate: bookingDate.toDate()
          endDate: bookingDate.toDate()
          tripLengthId: tripLengths[Math.floor(Math.random() * tripLengths.length)]._id
          notes: Fake.paragraph([5])
        )
        bookingDate.add( 1, 'day')
        

  return
