$(document).ready(function() {
  console.log("ready");
  $(".loader").hide();
  $(".container").show();

  window.mod = "stopwatch";
  window.running = null;
  window.dt = 0;
  window.ct = 0;
});

$("#btn-mod-stopwatch").click(function() {
  this.blur();
  window.mod = "stopwatch";

  $("#btn-mod-stopwatch").removeClass('btn-dark');
  $("#btn-mod-stopwatch").removeClass('btn-secondary');
  $("#btn-mod-stopwatch").addClass('btn-dark');
    
  $("#btn-mod-countdown").removeClass('btn-dark');
  $("#btn-mod-countdown").removeClass('btn-secondary');
  $("#btn-mod-countdown").addClass('btn-secondary');

  $(".numpad").hide();

  reset();
});

$("#btn-mod-countdown").click(function() {
  this.blur();
  window.mod = "countdown";

  $("#btn-mod-stopwatch").removeClass('btn-dark');
  $("#btn-mod-stopwatch").removeClass('btn-secondary');
  $("#btn-mod-stopwatch").addClass('btn-secondary');
    
  $("#btn-mod-countdown").removeClass('btn-dark');
  $("#btn-mod-countdown").removeClass('btn-secondary');
  $("#btn-mod-countdown").addClass('btn-dark');
  
  $(".numpad").show();

  reset();
});

$(".btn-numpad").click(function() {
  var n = $(this).data('num').toString();
  console.log(n);
  // console.log(n.length);

  if (n == "C") {
    $(".time").text("00:00:00 .000");
  } else {
    var t = $(".time").text().substr(0,8).split(":").join("");
    // console.log(t);
    t = t.substr(n.length) + n;
    t = t.substr(0,2) + ":" + t.substr(2,2) + ":" + t.substr(4,2);
    console.log(t);
    $(".time").text(t + " .000");
  }
});

$("#btn-reset").click(function() {
  this.blur();
  reset();
});

$("#btn-start").click(function() {
  this.blur();
  start();
});

document.addEventListener('keydown', function(event) {
  if (event.keyCode == 32 || event.keyCode == 13) {
    start();
  } else if (event.keyCode == 27) {
    reset();
  }
});



function reset() {
  window.st = (new Date()).getTime();
  window.dt = 0;
  window.ct = 0;
  $(".time").text("00:00:00 .000");
  console.log("reset");
}

function start() {
  if (!window.running) {
    $("#btn-start").text('STOP');
    $("#btn-start").removeClass('btn-success');
    $("#btn-start").addClass('btn-danger');
    $("#btn-mod-stopwatch").prop("disabled", true);
    $("#btn-mod-countdown").prop("disabled", true);
    $("#btn-reset").prop("disabled", true);
    $(".btn-numpad").prop("disabled", true);

    if (window.mod == "stopwatch") {
      window.st = (new Date()).getTime();
      window.running = setTimeout(stopwatch, 1);
      console.log("started - " + window.mod);

    } else if (window.mod == "countdown") {
      var t = $(".time").text().substr(0,8).split(":").join("");
      var h = parseInt(t.substr(0,2), 10);
      var m = parseInt(t.substr(2,2), 10);
      var s = parseInt(t.substr(4,2), 10);
      window.ct = (h*3600 + m*60 + s) * 1000;
      console.log(h + " " + m + " " + s + " -> " + window.ct);

      window.st = (new Date()).getTime();
      window.running = setTimeout(countdown, 1);

      console.log("started - " + window.mod);
    }

  } else {
    clearTimeout(window.running);
    window.dt += (new Date()).getTime() - window.st;
    console.log("dt = " + window.dt);
    window.running = null;

    if (window.mod == "countdown") {
      $(".time").text(toTimeString(window.ct));
      window.dt = 0;
    }

    $("#btn-start").text('START');
    $("#btn-start").addClass('btn-success');
    $("#btn-start").removeClass('btn-danger');
    $("#btn-mod-stopwatch").prop("disabled", false);
    $("#btn-mod-countdown").prop("disabled", false);
    $("#btn-reset").prop("disabled", false);
    $(".btn-numpad").prop("disabled", false);
    console.log("stopped.");
  }
}

function stopwatch() {
  var dt = (new Date()).getTime() - window.st + window.dt;
  var t = toTimeString(dt);
  $(".time").text(t);

  window.running = setTimeout(stopwatch, 1);
}

function countdown() {
  var dt = (new Date()).getTime() - window.st + window.dt;
  if (window.ct - dt <= 0) {
    clearTimeout(window.running);
    $(".time").text("00:00:00 .000");
    window.dt = 0;
    window.running = null;

    $("#btn-start").text('START');
    $("#btn-start").addClass('btn-success');
    $("#btn-start").removeClass('btn-danger');
    $("#btn-mod-stopwatch").prop("disabled", false);
    $("#btn-mod-countdown").prop("disabled", false);
    $("#btn-reset").prop("disabled", false);
    $(".btn-numpad").prop("disabled", false);
    console.log("finished.");
    $(".blink").fadeIn(250).fadeOut(250).fadeIn(250).fadeOut(250);
    return;
  }
  var t = toTimeString(window.ct - dt);
  $(".time").text(t);

  window.running = setTimeout(countdown, 1);
}





function toTimeString(dt) {
  var hours = Math.floor(dt / 3600000);
  var minutes = Math.floor((dt % 3600000) / 60000);
  var seconds = Math.floor((dt % 60000) / 1000);
  var millis = (dt % 1000);
  return hours.toString().padStart(2, "0") + ":" + minutes.toString().padStart(2, "0") + ":" + seconds.toString().padStart(2, "0") + " ." + millis.toString().padStart(3, "0");
}