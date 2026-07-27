/* Place-of-birth autocomplete.
   - Typing English letters filters CITY_LIST by English-name prefix
     (falls back to Tamil-name prefix so a Tamil keyboard also works).
   - On desktop: an inline dropdown appears under the input.
   - On mobile (narrow screens): tapping the field opens a full-screen
     overlay ("bottom sheet") with its own search box and result list,
     which is easier to use than a cramped inline dropdown on a phone. */
(function (global) {
  "use strict";

  var MOBILE_QUERY = "(max-width: 640px)";
  var DEFAULT_CITY_NAMES = [
    "Chennai", "Madurai", "Coimbatore", "Tiruchirappalli", "Salem",
    "Vellore", "Thanjavur", "Tirunelveli", "Puducherry", "Bengaluru"
  ];

  function isMobile() {
    return global.matchMedia && global.matchMedia(MOBILE_QUERY).matches;
  }

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
    var overlay = opts.overlay;
    var overlaySearch = opts.overlaySearch;
    var overlayList = opts.overlayList;
    var overlayClose = opts.overlayClose;

    var activeIndex = -1;

    function selectCity(city) {
      input.value = city.ta;
      latInput.value = city.lat.toFixed(4);
      lonInput.value = city.lon.toFixed(4);
      tzInput.value = city.tz;
      closeDropdown();
      closeOverlay();
    }

    function renderItems(container, cities, opts2) {
      opts2 = opts2 || {};
      container.innerHTML = "";
      activeIndex = -1;
      if (!cities.length) {
        if (opts2.emptyMessage) {
          var li = document.createElement("li");
          li.className = "place-empty";
          li.textContent = opts2.emptyMessage;
          container.appendChild(li);
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
        btn.addEventListener("click", function () { selectCity(city); });
        li.appendChild(btn);
        container.appendChild(li);
      });
    }

    /* ---------- Desktop inline dropdown ---------- */
    function openDropdown() {
      dropdown.hidden = false;
      input.setAttribute("aria-expanded", "true");
    }
    function closeDropdown() {
      dropdown.hidden = true;
      input.setAttribute("aria-expanded", "false");
    }

    input.addEventListener("input", function () {
      if (isMobile()) return; // mobile uses the overlay instead
      var matches = filterCities(input.value);
      renderItems(dropdown, matches, { emptyMessage: "பொருந்தும் ஊர் இல்லை" });
      if (input.value.trim()) openDropdown(); else closeDropdown();
    });

    input.addEventListener("keydown", function (e) {
      if (isMobile() || dropdown.hidden) return;
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

    /* ---------- Mobile full-screen overlay ---------- */
    function openOverlay() {
      overlay.hidden = false;
      document.body.classList.add("place-overlay-open");
      overlaySearch.value = "";
      renderItems(overlayList, defaultCities(), { emptyMessage: "" });
      window.setTimeout(function () { overlaySearch.focus(); }, 50);
    }
    function closeOverlay() {
      overlay.hidden = true;
      document.body.classList.remove("place-overlay-open");
    }

    input.addEventListener("focus", function () {
      if (isMobile()) {
        input.blur();
        openOverlay();
      }
    });
    input.addEventListener("click", function () {
      if (isMobile() && overlay.hidden) openOverlay();
    });

    overlaySearch.addEventListener("input", function () {
      var q = overlaySearch.value.trim();
      var matches = q ? filterCities(q) : defaultCities();
      renderItems(overlayList, matches, { emptyMessage: q ? "பொருந்தும் ஊர் இல்லை" : "" });
    });

    overlayClose.addEventListener("click", closeOverlay);
    overlay.addEventListener("click", function (e) {
      if (e.target === overlay) closeOverlay();
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") {
        if (!overlay.hidden) closeOverlay();
        if (!dropdown.hidden) closeDropdown();
      }
    });
  }

  global.PlacePicker = { init: initPlacePicker };
})(window);
