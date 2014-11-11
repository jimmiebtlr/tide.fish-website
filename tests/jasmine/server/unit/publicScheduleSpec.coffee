describe "Aggregate Publication", ->
  beforeEach ->
    MeteorStubs.install()
    mock global, "Bookings"
    spyOn(Bookings, "find").and.returnValue observe: ->
      return
    obj =
      publish: Publications.PublicSchedule
      added: ->

      changed: ->

      ready: ->

      onStop: ->

    console.log obj
    return

  afterEach ->
    MeteorStubs.uninstall()
    return

  it "should add the correct number of initial records", ->
    spyOn obj, "added"
    spyOn obj, "ready"
    obj.publish 42, 2014
    expect(obj.added.calls.count()).toBe 7 # one week
    expect(obj.ready.calls.count()).toBe 1 # one week
    return

  it "should update the correct record when a collection record is inserted", ->
    spyOn obj, "changed"
    obj.publish 42, 2014
    date = moment().year(2014).isoWeek(42)
    obj.observeFuncs.added date: date
    expect(obj.changed.calls.count()).toBe 1
    expect(obj.changed).toHaveBeenCalledWith "aggregateCollectionName", date.format("MM/DD/YYYY"),
      aggregate: date.day

    return

  it "should update 2 records when a collection record changes date", ->
    spyOn obj, "changed"
    obj.publish 42, 2014
    date = moment().year(2014).isoWeek(42)
    obj.observeFuncs.changed
      date: date
    ,
      date: date.clone().add(2, "days")

    expect(obj.changed.calls.count()).toBe 2
    return

  it "should update the correct record when a collection record is removed", ->
    spyOn obj, "changed"
    obj.publish 42, 2014
    date = moment().year(2014).isoWeek(42)
    obj.observeFuncs.removed date: date
    expect(obj.changed.calls.count()).toBe 1
    expect(obj.changed).toHaveBeenCalledWith "aggregateCollectionName", date.format("MM/DD/YYYY"),
      aggregate: date.day

    return

  return

