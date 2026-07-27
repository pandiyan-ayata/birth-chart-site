/* Place-of-birth autocomplete: a single inline dropdown that works the
   same way on desktop and mobile, always anchored directly under the
   field so search + results + selection all stay on the same screen
   (no full-page overlay, no separate scroll). Typing English letters
   filters CITY_LIST by English-name prefix (falls back to a Tamil-name
   prefix so a Tamil keyboard also works); results are alphabetical. */
(function (global) {
  "use strict";

  var DEFAULT_CITY_NAMES = [
    "Chennai", "Madurai", "Coimbatore", "Tiruchirappalli", "Salem",
    "Vellore", "Thanjavur", "Tirunelveli", "Puducherry", "Bengaluru"
  ];

  function byEnglishName(a, b) {
    return a.en.localeCompare(b.en, "en", { sensitivity: "base" });
  }

  function filterCities(query) {
    var CITY_LIST = global.CITY_LIST || [];
    var q = (query || "").trim().toLowerCase();
    if (!q) return [];

    var starts = [];
    var contains = [];
    CITY_LIST.forEach(function (c) {
      var en = c.en.toLowerCase();
      var ta = c.ta;
      if (en.indexOf(q) === 0 || ta.indexOf(query.trim()) === 0) {
        starts.push(c);
      } else if (en.indexOf(q) > -1) {
        contains.push(c);
      }
    });
    starts.sort(byEnglishName);
    contains.sort(byEnglishName);
    return starts.concat(contains).slice(0, 40);
  }

  function defaultCities() {
    var CITY_LIST = global.CITY_LIST || [];
    return DEFAULT_CITY_NAMES
      .map(function (name) {
        return CITY_LIST.filter(function (c) { return c.en === name; })[0];
      })
      .filter(Boolean)
      .sort(byEnglishName);
  }

  function initPlacePicker(opts) {
    var input = opts.input;
    var dropdown = opts.dropdown;
    var latInput = opts.latInput;
    var lonInput = opts.lonInput;
    var tzInput = opts.tzInput;
    var resolvedCaption = opts.resolvedCaption;

    var activeIndex = -1;

    function selectCity(city) {
      input.value = city.ta;
      latInput.value = city.lat.toFixed(4);
      lonInput.value = city.lon.toFixed(4);
      tzInput.value = city.tz;
      if (resolvedCaption) {
        resolvedCaption.textContent =
          "\u2713 " + city.ta + " (" + city.en + ") \u2014 " +
          "அட்சரேகை " + city.lat.toFixed(2) + "\u00B0, தீர்க்கரேகை " + city.lon.toFixed(2) + "\u00B0, UTC+" + city.tz;
        resolvedCaption.hidden = false;
      }
      closeDropdown();
    }

    function clearResolved() {
      latInput.value = "";
      lonInput.value = "";
      tzInput.value = "";
      if (resolvedCaption) {
        resolvedCaption.hidden = true;
        resolvedCaption.textContent = "";
      }
    }

    function renderItems(cities, emptyMessage) {
      dropdown.innerHTML = "";
      activeIndex = -1;
      if (!cities.length) {
        if (emptyMessage) {
          var li = document.createElement("li");
          li.className = "place-empty";
          li.textContent = emptyMessage;
          dropdown.appendChild(li);
        }
        return;
      }
      cities.forEach(function (city) {
        var li = document.createElement("li");
        li.setAttribute("role", "option");
        var btn = document.createElement("button");
        btn.type = "button";
        btn.className = "place-option";
        btn.innerHTML = '<span class="place-ta">' + city.ta + '</span>' +
          '<span class="place-en">' + city.en + "</span>";
        // Prevent the input from blurring before the click is handled -
        // this was the root cause of "can't select after search".
        btn.addEventListener("mousedown", function (e) { e.preventDefault(); });
        btn.addEventListener("click", function () { selectCity(city); });
        li.appendChild(btn);
        dropdown.appendChild(li);
      });
    }

    function openDropdown(cities, emptyMessage) {
      renderItems(cities, emptyMessage);
      dropdown.hidden = false;
      input.setAttribute("aria-expanded", "true");
    }
    function closeDropdown() {
      dropdown.hidden = true;
      input.setAttribute("aria-expanded", "false");
    }

    function runSearch() {
      var q = input.value.trim();
      if (!q) {
        openDropdown(defaultCities(), "");
        return;
      }
      openDropdown(filterCities(q), "பொருந்தும் ஊர் இல்லை");
    }

    input.addEventListener("input", function () {
      // Any manual edit invalidates a previously resolved selection,
      // since coordinates now only ever come from picking a city.
      clearResolved();
      runSearch();
    });

    input.addEventListener("focus", runSearch);

    input.addEventListener("keydown", function (e) {
      if (dropdown.hidden) return;
      var items = dropdown.querySelectorAll(".place-option");
      if (!items.length) return;
      if (e.key === "ArrowDown") {
        e.preventDefault();
        activeIndex = Math.min(activeIndex + 1, items.length - 1);
        highlight(items);
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        activeIndex = Math.max(activeIndex - 1, 0);
        highlight(items);
      } else if (e.key === "Enter") {
        if (activeIndex >= 0 && items[activeIndex]) {
          e.preventDefault();
          items[activeIndex].click();
        }
      } else if (e.key === "Escape") {
        closeDropdown();
      }
    });

    function highlight(items) {
      items.forEach(function (el, i) {
        el.classList.toggle("is-active", i === activeIndex);
        if (i === activeIndex) el.scrollIntoView({ block: "nearest" });
      });
    }

    document.addEventListener("click", function (e) {
      if (!dropdown.hidden && !input.contains(e.target) && !dropdown.contains(e.target)) {
        closeDropdown();
      }
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && !dropdown.hidden) closeDropdown();
    });
  }

  global.PlacePicker = { init: initPlacePicker };
})(window);
