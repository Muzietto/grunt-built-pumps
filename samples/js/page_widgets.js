/*jshint asi: true, expr: true */

var assert = require("assert")
var sinon = require("sinon")
var chai = require("chai")
var expect = chai.expect
chai.use(require("sinon-chai"))

// NEXT FRAMEWORK
// not needed anymore (this code will be loaded by <script> tags in page)
var MsisdnInput = require(__dirname + "/../../public/js/versionB/widgets").MsisdnInput
var MsisdnInputBrazil = require(__dirname + "/../../public/js/versionB/widgets").MsisdnInputBrazil
var Eventer = require(__dirname + "/../../public/js/versionB/widgets").Eventer
var Countdowner = require(__dirname + "/../../public/js/versionB/widgets").Countdowner

describe("Countdowner",function(){
  before(function(){
    var myWindow = require("jsdom").jsdom("<html><head></head><body></body></html>",{url:"http://www.example.com"}).parentWindow;
    global.window = myWindow;
    global.$ = jquery(myWindow);
  });

  after(function(){
    global.window = undefined;
  });


  it("should be instantiable with default values",function(){
    var cd = new Countdowner()
    expect(cd.startValue).to.be.equal(60)
  })

  it("should create the right markup at init", function(){
    var cd = new Countdowner();
    var $parent = $('<div/>');
    cd.init($parent);

    var $cdSpan = $('#countdown-time_'+cd._id,$parent);
    expect($cdSpan.length).to.be.equal(1);
    expect($cdSpan.text()).to.be.equal('' + cd.startValue);
    
  })

  it('should start by creating a runner',function(){
    var cd = new Countdowner();
    cd.start();

    expect(cd.runner).not.to.be.null
  })

  it('should invoke callback after countdown in the context of the countdowner',function(done){
    // zero-second countdown 
    var cd = new Countdowner(1);
    var atTheEnd = function() { 
      expect(this).to.be.equal(cd); 
      done() 
    } 

    cd.start(atTheEnd,5);
  })

  it('should reinitialize count in case of reset',function(done){
    var cd = new Countdowner(5);
    expect(cd.count).to.be.equal(5);
    cd.start();
    setTimeout(function(){
      expect(cd.count).to.be.below(5);
      cd.reset();
      expect(cd.count).to.be.equal(5);
      done();
    },1100);
  });
  
  it('should receive meaningful support by twiceThenStop', function(){
    var cd = new Countdowner();
    var resetMethod = sinon.spy(cd,'reset')
    var callback = function(){
      expect(resetMethod).to.have.been.calledOnce
      expect(resetMethod).to.have.been.calledWith(true)
    }
    var twiceThenStop = cd.twiceThenStop(callback) 
    // TODO - complete me!
  })
})

describe("Eventer", function() {
  beforeEach(function() {
    this.eventer = new Eventer()
  })

  it("should listen a triggered event", function(done) {
    this.eventer.on("event", function() {
      done()
    })
    this.eventer.trigger("event")
  })

  it("should listen a triggered event with payload", function(done) {
    var dummy = {}
    this.eventer.on("event", function(payload) {
      expect(payload).to.be.equal(dummy)
      done()
    })
    this.eventer.trigger("event", dummy)
  })
  
  it("should do nothing if triggered event has no listener", function() {
    this.eventer.trigger("event")
  })

  it("should listen with multiple callbacks", function(done) {
    var check = function() {
      var ok = 0
      return function() {
        ok += 1
        if (ok === 2) { done() }
      }
    }()
    this.eventer.on("event", function() {
      check()
    })
    this.eventer.on("event", function() {
      check()
    })

    this.eventer.trigger("event")
  })

  describe("on an existing object", function() {
    it("should work", function(done) {
      var object = {}
      Eventer(object)
      object.on("event", function() { done() })
      object.trigger("event")
    })
    it("should work on prototype", function(done) {
      var Dummy = function() {}
      var dummy = new Dummy()
      Eventer(Dummy.prototype)
      dummy.on("event", function() { done() })
      dummy.trigger("event")
    })
    it("should setup each object from prototype as a different event bus", function() {
      var Dummy = function() {}
      var dummy1 = new Dummy()
      var dummy2 = new Dummy()
      var dummy1Triggered = false
      Eventer(Dummy.prototype)
      dummy1.on("event", function() { dummy1Triggered = true })
      dummy2.trigger("event")
      expect(dummy1Triggered).to.be.not.ok
    })
  })

})

describe("MsisdnInput", function() {
  it("should be instantiable with a jquery input element", function() {
    var input = $('<input type="text"></input>');
    var msisdn = new MsisdnInput(input)
  })

  describe("method", function() {
    beforeEach(function() {
      this.input = $('<input type="text" value="3456789"></input>');
      this.msisdn = new MsisdnInput(this.input)
    })

    describe("number", function() {
      it("should return the number in the input using val()", function() {
        expect(this.msisdn.number()).to.be.equal("3456789")
      })

      it("should set the number in the input if a value is passed", function() {
        this.msisdn.number("123123123")
        expect(this.msisdn.number()).to.be.equal("123123123")
      })

      it("should set the number in the input if a value is passed-2", function() {
        this.msisdn.number("")
        expect(this.msisdn.number()).to.be.equal("")
      })
    })

    describe("isValid", function() {
      it("should return true if msisdn is at least 7 digits", function() {
        this.input.val = sinon.stub().returns("1234567")
        expect(this.msisdn.isValid()).to.be.ok
      })
      it("should return false if msisdn is less than 7 digits", function() {
        this.input.val = sinon.stub().returns("123456")
        expect(this.msisdn.isValid()).to.be.not.ok
      })
      it("should even with non digits mixed in", function() {
        this.input.val = sinon.stub().returns("adfddl1!!23xc~45 67 zzz")
        expect(this.msisdn.isValid()).to.be.ok
      })
    })

    describe("hide", function() {
      it("should hide the input", function() {
        this.input.hide = sinon.spy()
        this.msisdn.hide()
        expect(this.input.hide).to.have.been.called
      })
    })
  })

  describe("event", function() {
    beforeEach(function() {
      this.input = new Eventer()
      this.msisdn = new MsisdnInput(this.input)
      this.msisdn.bindEvents()
    })
    describe("change", function() {
      ;["input", "propertychange"].forEach(function(event) {
        it("should be triggered when input triggers " + event + " event", function(done) {
          this.msisdn.on("change", function() { done() })
          this.input.trigger(event, "3456789")
        })
      })
    })
  })
})

describe("MsisdnInputBrazil", function() {
  it("should be instantiable with two jquery input element", function() {
    var inputDDD = $('<input type="text" value="345"></input>');
    var inputNumber = $('<input type="text" value="67890"></input>');
    var msisdn = new MsisdnInputBrazil(inputDDD, inputNumber)
  })

  describe("method", function() {
    beforeEach(function() {
      this.inputDDD = $('<input type="text" value="345"></input>');
      this.inputNumber = $('<input type="text" value="67890"></input>');
      this.msisdn = new MsisdnInputBrazil(this.inputDDD, this.inputNumber)
    })

    describe("number", function() {
      it("should return the number from the two inputs using val()", function() {
        expect(this.msisdn.number()).to.be.equal("34567890")
      })

      it("should insert a number by splitting the first two digits as the DDD", function() {
        var msisdn = this.msisdn.number("99123456789")

        expect(this.inputDDD.val()).to.be.equal("99")
        expect(this.inputNumber.val()).to.be.equal("123456789")
        expect(msisdn).to.be.equal("99123456789")
      })

      it("should insert a number by splitting the first two digits as the DDD-2", function() {
        var msisdn = this.msisdn.number("")

        expect(this.inputDDD.val()).to.be.equal("")
        expect(this.inputNumber.val()).to.be.equal("")
        expect(msisdn).to.be.equal("")
      })
    })

    describe("isValid", function() {
      it("should return true if number is at least 8 digits and ddd 2", function() {
        this.inputDDD.val = sinon.stub().returns("53")
        this.inputNumber.val = sinon.stub().returns("12345678")
        expect(this.msisdn.isValid()).to.be.ok
      })
      it("should return false if number is less than 8 digits", function() {
        this.inputDDD.val = sinon.stub().returns("53")
        this.inputNumber.val = sinon.stub().returns("1234567")
        expect(this.msisdn.isValid()).to.be.not.ok
      })
      it("should return false if ddd is less than 2 digits", function() {
        this.inputDDD.val = sinon.stub().returns("5")
        this.inputNumber.val = sinon.stub().returns("12345678")
        expect(this.msisdn.isValid()).to.be.not.ok
      })
      it("should return true if non digit are mixed in number or are at the ends of ddd", function() {
        this.inputDDD.val = sinon.stub().returns("   53!")
        this.inputNumber.val = sinon.stub().returns("xxx123!456@@78   ")
        expect(this.msisdn.isValid()).to.be.ok
      })
    })

    describe("hide", function() {
      it("should hide both inputs", function() {
        this.inputDDD.hide = sinon.spy()
        this.inputNumber.hide = sinon.spy()
        this.msisdn.hide()
        expect(this.inputDDD.hide).to.have.been.called
        expect(this.inputNumber.hide).to.have.been.called
      })
    })
  })

  describe("event", function() {
    beforeEach(function() {
      this.inputDDD = new Eventer()
      this.inputNumber = new Eventer()
      this.msisdn = new MsisdnInputBrazil(this.inputDDD, this.inputNumber)
      this.msisdn.bindEvents()
    })
    describe("change", function() {
      ;["inputDDD", "inputNumber"].forEach(function(input) {
        ;["input", "propertychange"].forEach(function(event) {
          it("should be triggered when " + input + " triggers " + event + " event", function(done) {
            this.msisdn.on("change", function() { done() })
            this[input].trigger(event, "42")
          })
        })
      })
    })
  })

})
