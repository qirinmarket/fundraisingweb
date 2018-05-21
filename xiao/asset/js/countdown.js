//<---- Remenber to get all external js at the gear on top

var elem = $('#container');
var knobResize = function () {
  var width = Math.floor((elem.width() - 150) / 4);
  elem.find('.knob').trigger('configure', { width: width, height: width });
}

$(window).resize(function () {
  knobResize();
});

var myDate = new Date();
myDate.setDate(myDate.getDate() + 5);

elem.find('#knob-countdown').countdown({
  until: myDate,
  format: 'DHMS',
  onTick: function (e) {
    var secs = e[6], mins = e[5], hr = e[4], ds = e[3];
    elem.find("#countdown-ds").val(ds).trigger("change");
    elem.find("#countdown-hr").val(hr).trigger("change");
    elem.find("#countdown-min").val(mins).trigger("change");
    elem.find("#countdown-sec").val(secs).trigger("change");
  }
});

$('.knob').knob();
knobResize();
