/*jshint asi: true */
/*global app:true Config:true */

// ===== WIDGETS =====

function MsisdnInput(input) {
  this.input = input
}

MsisdnInput.prototype.bindEvents = function() {
  var msisdn = this
  this.input.on("input", function() {
    msisdn.trigger("change")
  })
  this.input.on("propertychange", function() {
    msisdn.trigger("change")
  })
}

MsisdnInput.prototype.number = function(value) {
  if (value || value === '') {
    this.input.val(value);
  }
  return this.input.val();
}

MsisdnInput.prototype.isValid = function() {
  return !!this.number().match(/^\D*(\d\D*){7,}\D*$/)
}

MsisdnInput.prototype.hide = function() {
  this.input.hide()
}

MsisdnInput.prototype.focus = function() {
  this.input.focus()
}

Eventer(MsisdnInput.prototype)

function MsisdnInputBrazil(inputDDD, inputNumber) {
  this.inputDDD = inputDDD
  this.inputNumber = inputNumber
}

MsisdnInputBrazil.prototype.bindEvents = function() {
  var msisdn = this
  this.inputDDD.on("input", function() { msisdn.trigger("change") })
  this.inputDDD.on("propertychange", function() { msisdn.trigger("change") })
  this.inputNumber.on("input", function() { msisdn.trigger("change") })
  this.inputNumber.on("propertychange", function() { msisdn.trigger("change") })
}

MsisdnInputBrazil.prototype.number = function(value) {
  if (value || value === '') { 
    var ddd = value.substring(0, 2)
    var number = value.substring(2)
    this.inputDDD.val(ddd)
    this.inputNumber.val(number)
  }
  return this.inputDDD.val() + this.inputNumber.val()
}

MsisdnInputBrazil.prototype.isValid = function() {
  var ddd = this.inputDDD.val() || ""
  var number = this.inputNumber.val() || ""
  return !!ddd.match(/^\D*(\d){2,}\D*$/) &&
    number.match(/^\D*(\d\D*){8,}\D*$/)
}

MsisdnInputBrazil.prototype.hide = function() {
  this.inputDDD.hide()
  this.inputNumber.hide()
}

MsisdnInputBrazil.prototype.focus = function() {
  this.inputDDD.focus()
}

Eventer(MsisdnInputBrazil.prototype)


function Eventer(object) {
  object = object || {}

  object.on = function (event, callback) {
    if (!this._events) { this._events = {} }
    if (!this._events[event]) { this._events[event] = [] }
    this._events[event].push(callback)
  }
  object.trigger = function (event, payload) {
    if (this._events && this._events[event]) {
      this._events[event].forEach(function(callback) {
        callback(payload)
      })
    }
  }

  return object
}


function Countdowner(startValue, direction, endValue) {
  this.startValue = startValue || 60 // 60 seconds
  this.direction = direction || "down"
  this.endValue = endValue || 0 
  this._id = parseInt((Math.random() * 1000000))

  // widget state
  this.$parent = null
  this.runner = null
  this.count = this.startValue
}

Countdowner.prototype.init = function ($anchor,callback) {

  this.$parent = $anchor
  this.$parent.hide()

  var markup = String()
  +'<div id="'+this._id+'" class="countdown-pie countdown-degree">'
  +'  <span class="countdown-block"/>'
  +'  <span class="countdown-time" id="countdown-time_'+this._id+'">'+this.startValue+'</span>'
  +'</div>'

  $(markup).appendTo(this.$parent)

  return this
}

Countdowner.prototype.show = function () {
  this.$parent.show()
  return this
}

Countdowner.prototype.hide = function () {
  this.$parent.hide()
  return this
}

// just stop the clock - need a reset to get back to startValue
Countdowner.prototype.stop = function () {
  clearInterval(this.runner)
  this.runner = null
  return this
}

 // back to startValue & (if not stopped) keep ticking
Countdowner.prototype.reset = function () {
  this.count = this.startValue
  if (this.$parent) {this.updateMarkup();}
  return this
}

Countdowner.prototype.start = function (atTheEnd,interval) {
  var self = this,
  _interval = interval || 1000
  ;

  this.runner = setInterval(function () {

    if (self.direction === 'down') { self.count -= 1; } else { self.count += 1; }

    if (self.$parent) {self.updateMarkup();}

    if(self.count === self.endValue) 
      if (atTheEnd) {
        atTheEnd.apply(self) // e.g. () -> clearInterval(this.runner)
      } else {
        self.reset()
      }
  }, _interval);
  return this
}

Countdowner.prototype.updateMarkup = function() {

  var $textContainer, totaltime, count, deg
  ;

  $textContainer = $('.countdown-time',this.$parent);
  totaltime = this.startValue;
  count = this.count

  $textContainer.html(count);

  if(count < (totaltime / 2)){
    deg = 90 + (360 * count / totaltime);
    $('.countdown-pie',this.$parent).css('background-image',
                                         'linear-gradient('+deg+'deg, transparent 50%, white 50%),linear-gradient(90deg, white 50%, transparent 50%)'
                                        );
  } else if(count >= (totaltime / 2)){
    deg = -90 + (360 * count / totaltime);
    $('.countdown-pie',this.$parent).css('background-image',
                                         'linear-gradient('+deg+'deg, transparent 50%, #9ecb3d 50%),linear-gradient(90deg, white 50%, transparent 50%)'
                                        );
  }

  if(count < 10) {
    $textContainer.css({'margin-left':'11px'});
  } else {
    $textContainer.css({'margin-left':'4px'});
  } 

  return this
}

// sample callback for this.start(atTheEnd)
Countdowner.prototype.twiceThenStop = function(callback) {
  // will be applied in the context of the countdowner
  return (function() {
    var ii = 0
    return function() {
      var SOFT = true
      this.reset(SOFT)
      ii++
        if (ii === 2) { 
        this.reset()
        if (callback) { callback() }
      }
    }
  })()
}


function Eventer(object) {
  object = object || {}

  object.on = function (event, callback) {
    if (!this._events) { this._events = {} }
    if (!this._events[event]) { this._events[event] = [] }
    this._events[event].push(callback)
  }
  object.trigger = function (event, payload) {
    if (this._events && this._events[event]) {
      this._events[event].forEach(function(callback) {
        callback(payload)
      })
    }
  }

  return object
}

if (typeof module === "object" && typeof module.exports !== "undefined") {
  module.exports = {
    MsisdnInput: MsisdnInput,
    MsisdnInputBrazil: MsisdnInputBrazil,
    Countdowner: Countdowner,
    Eventer: Eventer
  }
};
