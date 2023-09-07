$(document).ready(function () {
  $(".pax-toggle").click(function () {
    var pax = $(this).find("[data-pax]").data("pax");
    $(".search-pax-wrapper").toggle();
    $(".stepper[data-type='" + pax + "']").trigger("focus");
  });
});

var global = (function () {

  var isMobile = function () {
    const toMatch = [
      /Android/i,
      /webOS/i,
      /iPhone/i,
      /iPad/i,
      /iPod/i,
      /BlackBerry/i,
      /Windows Phone/i
    ];

    return toMatch.some((toMatchItem) => {
      return navigator.userAgent.match(toMatchItem);
    });
  }

  return {
    isMobile: isMobile,
  };

})();

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
        isMobile: global.isMobile()
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
        dp.return.hide();
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





  var autocomplete = function () {
    const Types = Object.freeze({
      airport: 1,
      location: 7,
      hotel: 8,
    })

    var _displayHTML = function (data) {
      let html;

      switch (data.value.t) {
        case Types.airport: //Airport
          html = {
            icon: `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M10.22 7.36678C9.4332 7.92534 8.89699 8.77035 8.72668 9.72012L7.70001 7.75345L5.10668 10.3335L5.33334 12.0001L4.63334 12.7068L3.45334 10.5801L1.33334 9.40678L2.04001 8.70012L3.69334 8.93345L6.28668 6.33345L1.33334 3.74678L2.27334 2.80678L8.40668 4.22012L11 1.62678C11.0924 1.53326 11.2024 1.459 11.3237 1.40832C11.4451 1.35764 11.5752 1.33154 11.7067 1.33154C11.8381 1.33154 11.9683 1.35764 12.0896 1.40832C12.2109 1.459 12.321 1.53326 12.4133 1.62678C12.8 2.02012 12.8 2.66678 12.4133 3.04012L9.82001 5.63345L10.22 7.36678ZM14.6667 10.3335C14.6667 12.0668 12.3333 14.6668 12.3333 14.6668C12.3333 14.6668 10 12.0668 10 10.3335C10 9.06678 11.0667 8.00012 12.3333 8.00012C13.6 8.00012 14.6667 9.06678 14.6667 10.3335ZM13.1333 10.4001C13.1333 10.0001 12.7333 9.60012 12.3333 9.60012C11.9333 9.60012 11.5333 9.93345 11.5333 10.4001C11.5333 10.8001 11.8667 11.2001 12.3333 11.2001C12.8 11.2001 13.2 10.8001 13.1333 10.4001Z" fill="#B27F67"/>
            </svg>`,
            title: `${data.value.d} (${data.value.n})`,
            subtitle: data.value.d.split(" - ")[1] || "",
          }

          break;
        case Types.location: //Location
          html = {
            icon: `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M7.99999 7.99967C8.36666 7.99967 8.68066 7.86901 8.94199 7.60767C9.20288 7.34679 9.33332 7.03301 9.33332 6.66634C9.33332 6.29967 9.20288 5.98567 8.94199 5.72434C8.68066 5.46345 8.36666 5.33301 7.99999 5.33301C7.63332 5.33301 7.31955 5.46345 7.05866 5.72434C6.79732 5.98567 6.66666 6.29967 6.66666 6.66634C6.66666 7.03301 6.79732 7.34679 7.05866 7.60767C7.31955 7.86901 7.63332 7.99967 7.99999 7.99967ZM7.99999 14.6663C6.2111 13.1441 4.8751 11.7301 3.99199 10.4243C3.10843 9.11901 2.66666 7.91079 2.66666 6.79967C2.66666 5.13301 3.20288 3.80523 4.27532 2.81634C5.34732 1.82745 6.58888 1.33301 7.99999 1.33301C9.4111 1.33301 10.6527 1.82745 11.7247 2.81634C12.7971 3.80523 13.3333 5.13301 13.3333 6.79967C13.3333 7.91079 12.8918 9.11901 12.0087 10.4243C11.1251 11.7301 9.78888 13.1441 7.99999 14.6663Z" fill="#B27F67"/>
          </svg>`,
            title: data.value.n,
            subtitle: data.value.d,
          }

          break;
        case Types.hotel: //Hotel
          html = {
            icon: `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M11.3333 12.6667H12.6667V7.33333H8.66668V12.6667H10V8.66667H11.3333V12.6667ZM2.00001 12.6667V2.66667C2.00001 2.48986 2.07025 2.32029 2.19527 2.19526C2.3203 2.07024 2.48987 2 2.66668 2H12C12.1768 2 12.3464 2.07024 12.4714 2.19526C12.5964 2.32029 12.6667 2.48986 12.6667 2.66667V6H14V12.6667H14.6667V14H1.33334V12.6667H2.00001ZM4.66668 7.33333V8.66667H6.00001V7.33333H4.66668ZM4.66668 10V11.3333H6.00001V10H4.66668ZM4.66668 4.66667V6H6.00001V4.66667H4.66668Z" fill="#B27F67"/>
          </svg>`,
            title: data.value.n,
            subtitle: data.value.d,
          }

          break;

        default:
          html = {
            icon: ``,
            title: data.value.n,
            subtitle: data.value.d,
          }
          break;
      }


      return html
    }

    var _resultItem = function (item, data) {
      let html = _displayHTML(data);
      $(item).html(`<div class="rs-item"><div>${html.icon}</div><div><strong>${html.title}</strong><small>${html.subtitle}</small></div></div>`);
    }

    var _autoComplete = function (el) {
      el = new autoComplete({
        selector: "#" + el,
        data: {
          src: async (query) => {
            try {
              // Fetch Data from external Source
              const source = await fetch(`js/LocationList_TR.json`);
              // Data should be an array of `Objects` or `Strings`
              const data = await source.json();

              return data;
            } catch (error) {
              return error;
            }
          },
          cache: true,
          keys: ["d", "n", "s"]
        },
        resultsList: {
          tag: "ul",
          id: "autoComplete_list",
          class: "results_list",
          destination: "#" + el,
          position: "afterend",
          maxResults: 99,
          noResults: true,
        },
        resultItem: {
          tag: "li",
          class: "autoComplete_result",
          element: (item, data) => {
            _resultItem(item, data);
          }
        },
        events: {
          input: {
            focus() {
              if (el.input.value.length) {
                el.start();
              }
              //$(el.input).closest(".search-item").find(".badges").hide();
            },
            selection(event) {
              let selection = event.detail.selection;
              el.input.value = _displayHTML(selection).title;
              $(el.input).closest(".search-item").find(".badges").attr("data-type", selection.value.t).show()
              el.input.blur();
            },
          },
        },
      });
    }


    _autoComplete("pickup");
    _autoComplete("dropoff");
  }
  autocomplete();
});
