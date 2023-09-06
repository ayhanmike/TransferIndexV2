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
    let lang = "tr";
    let locale = {
      tr: {
        days: ['Pazar', 'Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi'],
        daysShort: ['Pzr', 'Pts', 'Sl', 'Çar', 'Per', 'Cum', 'Cts'],
        daysMin: ['Pa', 'Pt', 'Sl', 'Ça', 'Pe', 'Cu', 'Ct'],
        months: ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran', 'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'],
        monthsShort: ['Oca', 'Şbt', 'Mrt', 'Nsn', 'Mys', 'Hzr', 'Tmz', 'Ağt', 'Eyl', 'Ekm', 'Ksm', 'Arl'],
        today: 'Bugün',
        clear: 'Temizle',
        done: 'Tamam',
        dateFormat: 'dd.MM.yyyy',
        timeFormat: 'hh:mm aa',
        firstDay: 1
      },
      en: {
        days: ['Pazar', 'Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi'],
        daysShort: ['Pzr', 'Pts', 'Sl', 'Çar', 'Per', 'Cum', 'Cts'],
        daysMin: ['Pa', 'Pt', 'Sl', 'Ça', 'Pe', 'Cu', 'Ct'],
        months: ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran', 'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'],
        monthsShort: ['Oca', 'Şbt', 'Mrt', 'Nsn', 'Mys', 'Hzr', 'Tmz', 'Ağt', 'Eyl', 'Ekm', 'Ksm', 'Arl'],
        today: 'Bugün',
        clear: 'Temizle',
        done: 'Done',
        dateFormat: 'dd.MM.yyyy',
        timeFormat: 'hh:mm aa',
        firstDay: 1
      }
    }

    let dp = {
      outbound: {},
      return: {},
      options: {
        locale: locale[lang],
        timeFormat: "H:mm",
        minHours: 0,
        maxHours: 24,
        minutesStep: 1,
        timepicker: true,
        minDate: new Date(),
      },
    }

    var init = function () {
      _bindEvents();
    }

    var _bindEvents = function () {
      routeType(searchVars.routeType);
      routeSwitcher();
      runDatepicker();
    }

    var routeType = function (route) {
      $("[data-route-type]").attr("data-route-type", route);
    }

    var routeSwitcher = function () {
      $(".btn-roundtrip").click(function () {
        if (dp.outbound.visible) dp.outbound.hide();
        dp.return.clear();
        routeType("RoundTrip");
      });
      $(".btn-oneway").click(function () {
        if (dp.outbound.visible) dp.outbound.hide();
        dp.return.clear();
        routeType("OneWay");
      });
    }

    var runDatepicker = function () {
      dp.outbound = new AirDatepicker('.air-outbound', {
        ...dp.options,
        ...{
          buttons: ['clear', {
            content: locale[lang].done,
            onClick: (el) => {
              el.hide();
              if ($(".air-return").is(":visible"))
                dp.return.show();
            }
          }],
          onSelect: ({ date }) => {
            dp.return.update({
              minDate: date
            });
            dp.return.clear();
          },
        }
      });

      dp.return = new AirDatepicker('.air-return', {
        ...dp.options,
        ...{
          buttons: ['clear', {
            content: locale[lang].done,
            onClick: (el) => {
              el.hide();
            }
          }],
        }
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
