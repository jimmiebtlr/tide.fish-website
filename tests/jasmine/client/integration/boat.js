describe("Boat", function(){
  beforeEach( function(){
    MeteorStubs.install();
    mock(window, 'Accounts');
    valid = {name: "test"};
  });

  afterEach(function(){
    MeteorStubs.uninstall();
    valid = undefined;
  });

  describe("insert", function(){
    it("should be allowed for a valid boat",function(){
      Meteor.loginWithPassword('test@test.com', 'test',function(){
        var context = BoatSchema.newContext();
        var validClean = BoatSchema.clean(valid);
        context.validate(validClean);
        expect( context.invalidKeys() ).toBe(true);
        check(null, String);
        done();
      });
    });
    it("should not be allowed for a boat without a name",function(){
      spyOn(Meteor, "userId").and.returnValue(Random.id());
      expect( Boats.insert({}) ).toThrow();
    });
  });
/*
  describe("update", function(){
    beforeEach( function(){
      Boats.insert({name: "Test"});
    });
    it("should fail when changing ownerId",function(){
      check( {name: "test"}, BoatSchema );
      expect(false).toBeFalsy();
    });
    //it("should not allow another user to change it");
    //it("should allow a user to remove themself from allowedBookingUsers");
  });
  describe("remove", function(){
    beforeEach( function(){
      Boats.insert({name: "Test"});
    });
  });*/
});
