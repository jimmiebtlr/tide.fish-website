describe "Schedule Form", ->
  beforeEach ->
    newFunc = Template.scheduleBookingLineItem.bookings

  it "should display new form when a single boat exists", ->
    spyOn( Session, "get" ).and.returnValue( )
    spyOn( Boats, "ambiguous" ).and.returnValue( false )
    futureSelected = -> return true;
    expect( newFunc() ).toReturn( true )
