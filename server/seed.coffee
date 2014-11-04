Meteor.startup ->
  if TripLengths.find({}).count() is 0
    firstHalf    = TripLengths.insert label: "1/2 day AM"
    secondHalf   = TripLengths.insert label: "1/2 day PM"
    threeQuarter = TripLengths.insert label: "3/4 day"
    full         = TripLengths.insert label: "Full day"
    night        = TripLengths.insert label: "Night"
  else
    firstHalf    = TripLengths.findOne( label: "1/2 day AM" )._id
    secondHalf   = TripLengths.findOne( label: "1/2 day PM" )._id
    threeQuarter = TripLengths.findOne( label: "3/4 day" )._id
    full         = TripLengths.findOne( label: "Full day" )._id
    night        = TripLengths.findOne( label: "Night" )._id
  if TripLengthConstraints.find().count() is 0
    TripLengthConstraints.insert( first: firstHalf, second: threeQuarter )
    TripLengthConstraints.insert( first: firstHalf, second: full )
    TripLengthConstraints.insert( first: secondHalf, second: threeQuarter)
    TripLengthConstraints.insert( first: secondHalf, second: full)
    TripLengthConstraints.insert( first: threeQuarter, second: full)
  if process.env.NODE_ENV is "development"
    if Meteor.users.find().count() is 0
      tripLengths = TripLengths.find().fetch()

      console.log "Creating Seed Users"
      captainId = Accounts.createUser( email: "captain@queenanne.com",password: "password1" )
      console.log( "CaptainId: " + captainId )
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
