/* Place-of-birth search: a plain text field + a "தேடு" (Search) button.
   Looks the typed name up against CITY_LIST (English or Tamil spelling,
   exact match first, then prefix, then contains) and fills the hidden
   latitude/longitude/timezone fields. Shows an error message if nothing
   in the list matches what was typed. */
(function (global) {
  "use strict";

  function norm(s) {
    return (s || "").trim().toLowerCase();
  }

  function findCity(query) {
    var CITY_LIST = global.CITY_LIST || [];
    var q = norm(query);
    var qTa = (query || "").trim();
    if (!q) return null;

    var i, c;

    for (i = 0; i < CITY_LIST.length; i++) {
      c = CITY_LIST[i];
      if (norm(c.en) === q || c.ta === qTa) return c;
    }

    var startsEn = CITY_LIST.filter(function (c) { return norm(c.en).indexOf(q) === 0; });
    var startsTa = CITY_LIST.filter(function (c) { return c.ta.indexOf(qTa) === 0; });
    var starts = startsEn.concat(startsTa);
    if (starts.length) {
      starts.sort(function (a, b) { return a.en.localeCompare(b.en, "en", { sensitivity: "base" }); });
      return starts[0];
    }

    var containsEn = CITY_LIST.filter(function (c) { return norm(c.en).indexOf(q) > -1; });
    var containsTa = CITY_LIST.filter(function (c) { return c.ta.indexOf(qTa) > -1; });
    var contains = containsEn.concat(containsTa);
    if (contains.length) {
      contains.sort(function (a, b) { return a.en.localeCompare(b.en, "en", { sensitivity: "base" }); });
      return contains[0];
    }

    return null;
  }

  function initPlacePicker(opts) {
    var input = opts.input;
    var searchBtn = opts.searchBtn;
    var latInput = opts.latInput;
    var lonInput = opts.lonInput;
    var tzInput = opts.tzInput;
    var resolvedCaption = opts.resolvedCaption;
    var errorCaption = opts.errorCaption;

    function showError(msg) {
      errorCaption.textContent = msg;
      errorCaption.hidden = !msg;
    }

    function clearResolved() {
      latInput.value = "";
      lonInput.value = "";
      tzInput.value = "";
      resolvedCaption.hidden = true;
      resolvedCaption.textContent = "";
    }

    function runSearch() {
      showError("");
      clearResolved();
      var query = input.value.trim();
      if (!query) {
        showError("தேட ஒரு ஊர் பெயரை உள்ளிடவும்.");
        return;
      }
      var city = findCity(query);
      if (!city) {
        showError("\u201C" + query + "\u201D என்ற ஊர் பெயர் எங்கள் பட்டியலில் இல்லை. எழுத்துப்பிழை இல்லாமல் சரிபார்க்கவும், அல்லது அருகிலுள்ள பெரிய ஊரின் பெயரை முயற்சிக்கவும்.");
        return;
      }
      input.value = city.ta;
      latInput.value = city.lat.toFixed(4);
      lonInput.value = city.lon.toFixed(4);
      tzInput.value = city.tz;
      resolvedCaption.textContent =
        "\u2713 " + city.ta + " (" + city.en + ") \u2014 " +
        "அட்சரேகை " + city.lat.toFixed(2) + "\u00B0, தீர்க்கரேகை " + city.lon.toFixed(2) + "\u00B0, UTC+" + city.tz;
      resolvedCaption.hidden = false;
    }

    searchBtn.addEventListener("click", runSearch);

    input.addEventListener("keydown", function (e) {
      if (e.key === "Enter") {
        e.preventDefault();
        runSearch();
      }
    });

    // Editing the field after a successful match invalidates it, since a
    // stale lat/lon must never be submitted for a name the user changed.
    input.addEventListener("input", function () {
      if (!resolvedCaption.hidden) clearResolved();
      showError("");
    });
  }

  global.PlacePicker = { init: initPlacePicker, findCity: findCity };
})(window);
