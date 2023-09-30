const DestinationTypes = Object.freeze({
  airport: 1,
  location: 7,
  hotel: 8,
  all: [1, 7, 8]
});

const AvailableDestinationTypes = Object.freeze({
  pickup: {
    oneway: DestinationTypes.all,
    roundtrip: [DestinationTypes.airport]
  },
  dropoff: {
    oneway: DestinationTypes.all,
    roundtrip: [DestinationTypes.location, DestinationTypes.hotel]
  }
});

const GridBreakpoints = Object.freeze({
  xs: 0,
  sm: 576,
  md: 768,
  lg: 992,
  xl: 1200,
  xxl: 1400
});

const global = (function () {
  const init = () => {
    const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]')
    const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl))
  }

  const isMobile = () => {
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
    init: init,
    isMobile: isMobile,
  };

})();

const home = (function () {
  const init = () => {
    $("#owlVehicle").owlCarousel({
      dots: false,
      responsive: {
        [GridBreakpoints.xs]: {
          items: 1,
          nav: false
        },
        [GridBreakpoints.sm]: {
          items: 2,
          nav: true
        },
        [GridBreakpoints.md]: {
          items: 3,
          nav: true
        },
        [GridBreakpoints.lg]: {
          items: 4,
          nav: true
        },
        [GridBreakpoints.xl]: {
          items: 5,
          nav: true
        }
      },
      autoplay: true,
      autoplayTimeout: 3000,
      autoplayHoverPause: true,
      nav: true,
      navText: [
        `<svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M13.75 6.25L5 15L13.75 23.75" stroke="#B6866F" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
          <path d="M5 15H25" stroke="#B6866F" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
        </svg>`,
        `<svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M5 15H25" stroke="#B6866F" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
          <path d="M16.25 6.25L25 15L16.25 23.75" stroke="#B6866F" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
        </svg>`
      ]
    });
  }

  return {
    init: init,
  };
})();

const search = (function () {
  let searchVars = {
    $el: $("#search"),
    destination: {
      pickup: {
        input: $("#pickup"),
        value: undefined,
      },
      dropoff: {
        input: $("#dropoff"),
        value: undefined,
      },
      all: $("#pickup, #dropoff"),
      badges: {
        pickup: $("#badgesPickup .badge"),
        dropoff: $("#badgesDropoff .badge"),
        all: $("#badgesPickup .badge, #badgesDropoff .badge")
      },
      remove: $(".btn-destination-remove")
    },
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

  const init = function () {
    _bindEvents();
  };

  const _bindEvents = function () {
    destination.init();
    dates.init();
    pax.init();
  };

  const destination = (function () {

    const _setBadges = function () {
      searchVars.destination.badges.all.removeClass("available selected");

      searchVars.destination.all.map(function () {
        let id = $(this).attr("id");
        let idx = (id == "pickup") ? "dropoff" : "pickup";
        let value = searchVars.destination[id].value;
        let valuex = searchVars.destination[idx].value;

        let available = AvailableDestinationTypes[id][searchVars.routeType.toLowerCase()];

        let relAvailable = (valuex == undefined)
          ? available
          : (valuex.t == DestinationTypes.airport)
            ? [DestinationTypes.hotel, DestinationTypes.location]
            : [DestinationTypes.airport];

        if (searchVars.destination[id].value != undefined)
          if (!available.includes(searchVars.destination[id].value?.t)) {
            searchVars.destination[id].input.val("").blur();
            return false;
          }

        searchVars.destination.badges[id].map(function () {
          let badge = $(this);
          if (badge.data("type") == value?.t) badge.addClass("selected");
          relAvailable.forEach((type) => {
            if (badge.data("type") == type) badge.addClass("available");
          });
        });
      });
    }

    const _displayHTML = function (value) {
      let html;
      let type = value?.t || 0;

      switch (type) {
        case DestinationTypes.airport: //Airport
          html = {
            icon: `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M10.22 7.36678C9.4332 7.92534 8.89699 8.77035 8.72668 9.72012L7.70001 7.75345L5.10668 10.3335L5.33334 12.0001L4.63334 12.7068L3.45334 10.5801L1.33334 9.40678L2.04001 8.70012L3.69334 8.93345L6.28668 6.33345L1.33334 3.74678L2.27334 2.80678L8.40668 4.22012L11 1.62678C11.0924 1.53326 11.2024 1.459 11.3237 1.40832C11.4451 1.35764 11.5752 1.33154 11.7067 1.33154C11.8381 1.33154 11.9683 1.35764 12.0896 1.40832C12.2109 1.459 12.321 1.53326 12.4133 1.62678C12.8 2.02012 12.8 2.66678 12.4133 3.04012L9.82001 5.63345L10.22 7.36678ZM14.6667 10.3335C14.6667 12.0668 12.3333 14.6668 12.3333 14.6668C12.3333 14.6668 10 12.0668 10 10.3335C10 9.06678 11.0667 8.00012 12.3333 8.00012C13.6 8.00012 14.6667 9.06678 14.6667 10.3335ZM13.1333 10.4001C13.1333 10.0001 12.7333 9.60012 12.3333 9.60012C11.9333 9.60012 11.5333 9.93345 11.5333 10.4001C11.5333 10.8001 11.8667 11.2001 12.3333 11.2001C12.8 11.2001 13.2 10.8001 13.1333 10.4001Z" fill="#B27F67"/>
            </svg>`,
            title: `${value.d} (${value.n})`,
            subtitle: value.d.split(" - ")[1] || "",
          }

          break;
        case DestinationTypes.location: //Location
          html = {
            icon: `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M7.99999 7.99967C8.36666 7.99967 8.68066 7.86901 8.94199 7.60767C9.20288 7.34679 9.33332 7.03301 9.33332 6.66634C9.33332 6.29967 9.20288 5.98567 8.94199 5.72434C8.68066 5.46345 8.36666 5.33301 7.99999 5.33301C7.63332 5.33301 7.31955 5.46345 7.05866 5.72434C6.79732 5.98567 6.66666 6.29967 6.66666 6.66634C6.66666 7.03301 6.79732 7.34679 7.05866 7.60767C7.31955 7.86901 7.63332 7.99967 7.99999 7.99967ZM7.99999 14.6663C6.2111 13.1441 4.8751 11.7301 3.99199 10.4243C3.10843 9.11901 2.66666 7.91079 2.66666 6.79967C2.66666 5.13301 3.20288 3.80523 4.27532 2.81634C5.34732 1.82745 6.58888 1.33301 7.99999 1.33301C9.4111 1.33301 10.6527 1.82745 11.7247 2.81634C12.7971 3.80523 13.3333 5.13301 13.3333 6.79967C13.3333 7.91079 12.8918 9.11901 12.0087 10.4243C11.1251 11.7301 9.78888 13.1441 7.99999 14.6663Z" fill="#B27F67"/>
          </svg>`,
            title: value.n,
            subtitle: value.d,
          }

          break;
        case DestinationTypes.hotel: //Hotel
          html = {
            icon: `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M11.3333 12.6667H12.6667V7.33333H8.66668V12.6667H10V8.66667H11.3333V12.6667ZM2.00001 12.6667V2.66667C2.00001 2.48986 2.07025 2.32029 2.19527 2.19526C2.3203 2.07024 2.48987 2 2.66668 2H12C12.1768 2 12.3464 2.07024 12.4714 2.19526C12.5964 2.32029 12.6667 2.48986 12.6667 2.66667V6H14V12.6667H14.6667V14H1.33334V12.6667H2.00001ZM4.66668 7.33333V8.66667H6.00001V7.33333H4.66668ZM4.66668 10V11.3333H6.00001V10H4.66668ZM4.66668 4.66667V6H6.00001V4.66667H4.66668Z" fill="#B27F67"/>
          </svg>`,
            title: value.n,
            subtitle: value.d,
          }

          break;

        default:
          html = {
            icon: "",
            title: "",
            subtitle: "",
          }
          break;
      }

      return html
    }

    const _resultItem = function (item, data) {
      let html = _displayHTML(data.value);
      $(item).html(`<div class="rs-item"><div>${html.icon}</div><div><strong>${html.title}</strong><small>${html.subtitle}</small></div></div>`);
    }

    const _selection = function (input, value) {
      let id = input.attr("id");

      searchVars.destination[id].value = value;
      input.val(_displayHTML(value).title);
      if (id == "pickup" && (searchVars.destination[id].value != undefined)) searchVars.destination.dropoff.input.focus();
      _setBadges();

    }

    const _autoComplete = function (el) {
      el = new autoComplete({
        selector: "#" + el.attr("id"),
        data: {
          src: async (query) => {
            try {
              const source = await fetch(`js/LocationList_TR.json`);
              const data = await source.json();

              return data;
            } catch (error) {
              return error;
            }
          },
          filter: (data) => {
            let id = $(el.input).attr("id");
            let idx = (id == "pickup") ? "dropoff" : "pickup";
            let valuex = searchVars.destination[idx].value;

            if (valuex) {
              data = data.filter((item) => {
                if (valuex.t == DestinationTypes.airport) {
                  return item.value.a.toString().split(",").includes(valuex.i.toString() || "0")
                } else {
                  return valuex.a.includes(item.value.i.toString() || "0")
                }
              });
            } else if (searchVars.routeType == "RoundTrip") {
              data = data.filter((item) => {
                if (id == "pickup") {
                  return item.value.t == DestinationTypes.airport
                } else {
                  return item.value.t != DestinationTypes.airport
                }
              });
            }

            return data;
          },
          cache: true,
          keys: ["d", "n", "s"]
        },
        threshold: 3,
        resultsList: {
          tag: "ul",
          id: "autoComplete_list",
          class: "results_list",
          destination: "#" + el.attr("id"),
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
            },
            selection(event) {
              _selection($(el.input), event.detail.selection.value)
            },
          },
        },
      });
    }

    const init = function () {
      _bindEvents();
    }

    const _bindEvents = function () {
      searchVars.destination.all.on("focus", function () {
        $(this).select();
      });

      searchVars.destination.all.on("keyup, blur", function () {
        if ($(this).val() == "") _selection($(this), undefined);
      });

      searchVars.destination.remove.click(function () {
        _selection($(this).closest(".search-item").find(".search-input"), undefined);
      });

      _autoComplete(searchVars.destination.pickup.input);
      _autoComplete(searchVars.destination.dropoff.input);

      document.querySelector("#pickup, #dropoff").addEventListener("close", function (event) {
        if (!event.detail.selection) {
          if (event.detail.query != _displayHTML(searchVars.destination[$(this).attr("id")]?.value).title) {
            $(this).val("").blur();
          }
        }
      });
    }

    return {
      init: init,
      setBadges: _setBadges
    };
  })();

  const dates = (function () {
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

    let dateVars = {
      $el: {
        outbound: $("#outbound"),
        return: $("#return")
      },
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
        isMobile: true //global.isMobile()
      },
    }

    const init = function () {
      _bindEvents();
    }

    const _bindEvents = function () {
      _setRouteType(searchVars.routeType);
      _switchRoute();
      _datepicker();
    }

    const _setRouteType = function (route) {
      searchVars.routeType = route;
      $("[data-route-type]").attr("data-route-type", route);
      dateVars.$el.outbound.attr("placeholder", dateVars.$el.outbound.data("text-" + route.toLowerCase()));
      dateVars.$el.outbound.prev("label").text(dateVars.$el.outbound.prev("label").data("text-" + route.toLowerCase()));

      destination.setBadges();
    }

    const _switchRoute = function () {
      $(".btn-roundtrip").click(function () {
        // if (dateVars.outbound.selectedDates?.length) {
        //   dateVars.return.show();
        // }

        _setRouteType("RoundTrip");
      });
      $(".btn-oneway").click(function () {

        _setRouteType("OneWay");
      });
    }

    const _datepicker = function () {
      dateVars.outbound = new AirDatepicker('#outbound', {
        ...dateVars.options,
        ...{
          buttons: ['clear', {
            content: locale[lang].done,
            onClick: (el) => {
              el.hide();
              if ($(".air-return").is(":visible"))
                dateVars.return.show();
            }
          }],
          onSelect: ({ date }) => {
            dateVars.return.update({
              minDate: date
            });
            dateVars.return.clear();
          },
        }
      });

      dateVars.return = new AirDatepicker('#return', {
        ...dateVars.options,
        ...{
          buttons: ['clear', {
            content: locale[lang].done,
            onClick: (el) => {
              el.hide();
            }
          }],
          onRenderCell({ date, cellType }) {
            // if (cellType === 'day') {
            //   if (date.toDateString() == dateVars.outbound.selectedDates?.[0].toDateString()) {
            //     return {
            //       disabled: true,
            //       classes: 'selected',
            //       attrs: {
            //         title: 'Outbound flight arrival date'
            //       }
            //     }
            //   }
            // }
          }
        }
      });
    }

    return {
      init: init
    };
  })();

  const pax = (function () {
    let paxVars = {
      $el: $(".stepper")
    }

    const init = function () {
      _render(searchVars.pax);
      _bindEvents();
    }

    const _bindEvents = function () {
      _toggle();
      _step();
      _onClick();
      _onKeypress();
    }

    const _toggle = function () {
      $(".pax-toggle").click(function () {
        let type = $(this).find("[data-pax]").data("pax");
        $(".search-pax-wrapper").toggle();
        $(".stepper[data-type='" + type + "']").trigger("focus");
      });
    }

    const _step = function (step, type) {
      if (step == "up") {
        if (searchVars.pax[type].value < searchVars.pax[type].max) searchVars.pax[type].value++;
      } else if (step == "down") {
        if (searchVars.pax[type].value > searchVars.pax[type].min) searchVars.pax[type].value--;
      }
      _render(searchVars.pax);
    }

    const _onClick = function () {
      paxVars.$el.find(".btn").click(function () {
        let btn = $(this);
        _step(btn.data("step"), btn.closest(".stepper").data("type"));
      });
    }

    const _onKeypress = function () {
      paxVars.$el.keydown(function (event) {
        let key = event.keyCode;
        if (key == 38 || key == 39) _step("up", $(this).data("type"));
        if (key == 37 || key == 40) _step("down", $(this).data("type"));
      });
    }

    const _render = function (pax) {
      Object.entries(pax).forEach(([key, value]) => {
        searchVars.$el.find("[data-pax=" + key + "]").attr("data-count", value.value).text(value.value);
      });
    }

    return {
      init: init,
    };
  })();

  return {
    init: init,
  };
})();

$(function () {
  global.init();
  home.init();
  search.init();
});
