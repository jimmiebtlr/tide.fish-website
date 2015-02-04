Migrations.add
  version: 1,
  up: ->
    defaults = []
    TripLengths.find({label: {$nin: ["Night"]}}).forEach (tl) ->
      defaults.push( tl._id )

    Boats.find().forEach (boat) ->
      Boats.update({_id: boat._id},{$set: {allowedTimeSlots: defaults}})
      
Migrations.migrateTo(1)


