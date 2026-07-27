(function () {
  "use strict";

  var form = document.getElementById("birth-form");
  var resultSection = document.getElementById("result");
  var chartHost = document.getElementById("chart-host");
  var planetTableBody = document.querySelector("#planet-table tbody");
  var ascSummary = document.getElementById("asc-summary");
  var moonSummary = document.getElementById("moon-summary");
  var resultName = document.getElementById("result-name");
  var resultMeta = document.getElementById("result-meta");
  var errorBox = document.getElementById("form-error");
  var styleToggle = document.querySelectorAll('input[name="chart-style"]');
  var cityInput = document.getElementById("place");
  var latInput = document.getElementById("latitude");
  var lonInput = document.getElementById("longitude");
  var tzInput = document.getElementById("timezone");

  var lastChart = null;

  // Populate day/month/year selects
  function fillSelect(sel, start, end, pad) {
    for (var i = start; i <= end; i++) {
      var opt = document.createElement("option");
      opt.value = i;
      opt.textContent = pad && i < 10 ? "0" + i : i;
      sel.appendChild(opt);
    }
  }
  var daySel = document.getElementById("dob-day");
  var monthSel = document.getElementById("dob-month");
  var yearSel = document.getElementById("dob-year");
  var monthNames = [
    "ஜனவரி", "பிப்ரவரி", "மார்ச்", "ஏப்ரல்", "மே", "ஜூன்",
    "ஜூலை", "ஆகஸ்ட்", "செப்டம்பர்", "அக்டோபர்", "நவம்பர்", "டிசம்பர்"
  ];
  fillSelect(daySel, 1, 31, true);
  monthNames.forEach(function (m, i) {
    var opt = document.createElement("option");
    opt.value = i + 1;
    opt.textContent = m;
    monthSel.appendChild(opt);
  });
  var nowYear = new Date().getFullYear();
  fillSelect(yearSel, nowYear - 100, nowYear + 1, false);
  yearSel.value = nowYear - 25;

  var hourSel = document.getElementById("dob-hour");
  var minuteSel = document.getElementById("dob-minute");
  fillSelect(hourSel, 1, 12, false);
  fillSelect(minuteSel, 0, 59, true);

  // Place-of-birth autocomplete (English-letter search, unified inline dropdown)
  window.PlacePicker.init({
    input: cityInput,
    dropdown: document.getElementById("place-dropdown"),
    latInput: latInput,
    lonInput: lonInput,
    tzInput: tzInput,
    resolvedCaption: document.getElementById("place-resolved")
  });

  function showError(msg) {
    errorBox.textContent = msg;
    errorBox.hidden = !msg;
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    showError("");

    var name = document.getElementById("name").value.trim() || "நபர்";
    var day = parseInt(daySel.value, 10);
    var month = parseInt(monthSel.value, 10);
    var year = parseInt(yearSel.value, 10);
    var hour12 = parseInt(hourSel.value, 10);
    var minute = parseInt(minuteSel.value, 10);
    var ampm = document.querySelector('input[name="ampm"]:checked').value;
    var lat = parseFloat(latInput.value);
    var lon = parseFloat(lonInput.value);
    var tz = parseFloat(tzInput.value);

    if (!cityInput.value.trim() || isNaN(lat) || isNaN(lon) || isNaN(tz)) {
      showError("பிறந்த ஊரை பட்டியலிலிருந்து தேர்ந்தெடுக்கவும் (ஆங்கில எழுத்துக்களில் தட்டச்சு செய்து தேடலாம்).");
      return;
    }

    var signedLat = lat;
    var signedLon = lon;

    var hour24 = hour12 % 12;
    if (ampm === "PM") hour24 += 12;

    var utcDate = window.VedicCalc.toUTCDate(year, month, day, hour24, minute, tz);

    if (isNaN(utcDate.getTime())) {
      showError("உள்ளிட்ட தேதி/நேரத்தைப் புரிந்துகொள்ள முடியவில்லை. மதிப்புகளைச் சரிபார்க்கவும்.");
      return;
    }

    var chart;
    try {
      chart = window.VedicCalc.computeChart(utcDate, signedLat, signedLon);
    } catch (err) {
      showError("ஜாதகத்தைக் கணக்கிட முடியவில்லை: " + err.message);
      return;
    }

    lastChart = chart;
    renderResult(name, {
      day: day, month: month, year: year, hour12: hour12, minute: minute, ampm: ampm,
      place: cityInput.value, lat: signedLat, lon: signedLon, tz: tz
    }, chart);
  });

  function currentStyle() {
    var checked = document.querySelector('input[name="chart-style"]:checked');
    return checked ? checked.value : "south";
  }

  function drawChart() {
    if (!lastChart) return;
    chartHost.innerHTML = "";
    var svg = currentStyle() === "north"
      ? window.ChartRender.renderNorthIndian(lastChart)
      : window.ChartRender.renderSouthIndian(lastChart);
    chartHost.appendChild(svg);
  }

  styleToggle.forEach(function (r) {
    r.addEventListener("change", drawChart);
  });

  function renderResult(name, birth, chart) {
    resultName.textContent = name;
    var monthName = monthNames[birth.month - 1];
    var ampmLabel = birth.ampm === "AM" ? "முற்பகல்" : "பிற்பகல்";
    resultMeta.textContent = birth.hour12 + ":" + (birth.minute < 10 ? "0" + birth.minute : birth.minute) + " " +
      ampmLabel + " \u2022 " + birth.day + " " + monthName + " " + birth.year + " \u2022 " + birth.place +
      " (" + birth.lat.toFixed(2) + "\u00B0, " + birth.lon.toFixed(2) + "\u00B0, UTC" + (birth.tz >= 0 ? "+" : "") + birth.tz + ")";

    drawChart();

    var VD = window.VedicData;
    var ascRashi = VD.rashiIndexFromLongitude(chart.ascendant);
    var ascNak = VD.nakshatraInfo(chart.ascendant);
    ascSummary.textContent = "லக்னம்: " + VD.RASHIS[ascRashi].ta + " " + VD.formatDegree(chart.ascendant) +
      " \u2014 " + ascNak.name + " பாதம் " + ascNak.pada;

    var moon = chart.planets.Moon;
    var moonRashi = VD.rashiIndexFromLongitude(moon.longitude);
    var moonNak = VD.nakshatraInfo(moon.longitude);
    moonSummary.textContent = "ராசி (சந்திரன்): " + VD.RASHIS[moonRashi].ta + " " + VD.formatDegree(moon.longitude) +
      " \u2014 " + moonNak.name + " பாதம் " + moonNak.pada;

    planetTableBody.innerHTML = "";
    VD.PLANET_ORDER.forEach(function (key) {
      var p = chart.planets[key];
      var rashiIdx = VD.rashiIndexFromLongitude(p.longitude);
      var nak = VD.nakshatraInfo(p.longitude);
      var row = document.createElement("tr");
      row.innerHTML =
        "<td>" + VD.PLANET_META[key].ta + (p.retrograde ? " (வக்கிரம்)" : "") + "</td>" +
        "<td>" + VD.RASHIS[rashiIdx].ta + "</td>" +
        "<td>" + VD.formatDegree(p.longitude) + "</td>" +
        "<td>" + nak.name + "</td>" +
        "<td>" + nak.pada + "</td>";
      planetTableBody.appendChild(row);
    });

    resultSection.hidden = false;
    resultSection.scrollIntoView({ behavior: "smooth", block: "start" });
  }
})();
