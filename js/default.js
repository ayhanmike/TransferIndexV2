$(document).ready(function () {
  $(".pax-toggle").click(function () {
    var pax = $(this).find("[data-pax]").data("pax");
    $(".search-pax-wrapper").toggle();
    $(".stepper[data-type='" + pax + "']").trigger("focus");
  });
});

var search = (function () {
  var searchVars = {
    $el: $("#search"),
    routeType: "OneWay",
    pax: {
      adult: {
        value: 1,
        min: 1,
        max: 12
      },
      child: {
        value: 0,
        min: 0,
        max: 12
      },
      infant: {
        value: 0,
        min: 0,
        max: 5
      },
    }
  }

  var init = function () {
    _bindEvents();
  };

  var _bindEvents = function () {
    dates.init();
    stepper.init();
  };

  var pax = function () {
    return searchVars.pax;
  }

  var dates = (function () {
    var datesVars = {

    }

    var init = function () {
      _bindEvents();
    }

    var _bindEvents = function () {
      routeType(searchVars.routeType);
      routeSwitcher();
    }

    var routeType = function (route) {
      $("[data-route-type=" + route + "]").show().siblings("[data-route-type]").hide()
    }

    var routeSwitcher = function () {
      $(".btn-roundtrip").click(function () {
        routeType("RoundTrip");
      });
      $(".btn-oneway").click(function () {
        routeType("OneWay");
      });
    }

    return {
      init: init
    };
  })();

  var stepper = (function () {
    var stepperVars = {
      $el: $(".stepper")
    }

    var init = function () {
      render(searchVars.pax);
      _bindEvents();
    }

    var _bindEvents = function () {
      step();
      onClick();
      onKeypress();
    }

    var step = function (step, type) {
      if (step == "up") {
        if (searchVars.pax[type].value < searchVars.pax[type].max) searchVars.pax[type].value++;
      } else if (step == "down") {
        if (searchVars.pax[type].value > searchVars.pax[type].min) searchVars.pax[type].value--;
      }
      render(searchVars.pax);
    }

    var onClick = function () {
      stepperVars.$el.find(".btn").click(function () {
        var btn = $(this);
        step(btn.data("step"), btn.closest(".stepper").data("type"));
      });
    }

    var onKeypress = function () {
      stepperVars.$el.keydown(function (event) {
        var key = event.keyCode;
        if (key == 38 || key == 39) step("up", $(this).data("type"));
        if (key == 37 || key == 40) step("down", $(this).data("type"));
      });
    }

    var render = function (pax) {
      Object.entries(pax).forEach(([key, value]) => {
        searchVars.$el.find("[data-pax=" + key + "]").attr("data-count", value.value).text(value.value);
      });
    }

    return {
      init: init,
      render: function (pax) {
        return render(pax)
      }
    };
  })();

  return {
    init: init,
    stepper: stepper,
    pax: pax,
  };
})();

$(function () {
  search.init();
});
