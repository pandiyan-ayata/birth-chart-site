(function () {
  "use strict";

  var form = document.getElementById("birth-form");
  var resultSection = document.getElementById("result");
  var chartHostRasi = document.getElementById("chart-host-rasi");
  var chartHostNavamsa = document.getElementById("chart-host-navamsa");
  var planetTableBody = document.querySelector("#planet-table tbody");
  var detailsTableBody = document.getElementById("details-table-body");
  var dashaSummary = document.getElementById("dasha-summary");
  var rashiNote = document.getElementById("rashi-note");
  var resultName = document.getElementById("result-name");
  var errorBox = document.getElementById("form-error");
  var styleToggle = document.querySelectorAll('input[name="chart-style"]');
  var cityInput = document.getElementById("place");
  var latInput = document.getElementById("latitude");
  var lonInput = document.getElementById("longitude");
  var tzInput = document.getElementById("timezone");
  var downloadPdfBtn = document.getElementById("download-pdf-btn");
  var pdfStatus = document.getElementById("pdf-status");
  var lastName = "நபர்";

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

  // Place-of-birth search (name + button, fills hidden lat/lon/tz)
  window.PlacePicker.init({
    input: cityInput,
    searchBtn: document.getElementById("place-search-btn"),
    latInput: latInput,
    lonInput: lonInput,
    tzInput: tzInput,
    resolvedCaption: document.getElementById("place-resolved"),
    errorCaption: document.getElementById("place-error")
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
      showError("பிறந்த ஊரை உள்ளிட்டு \u201Cதேடு\u201D பொத்தானை அழுத்தி, சரியான ஊரைக் கண்டறியவும்.");
      return;
    }

    var hour24 = hour12 % 12;
    if (ampm === "PM") hour24 += 12;

    var utcDate = window.VedicCalc.toUTCDate(year, month, day, hour24, minute, tz);

    if (isNaN(utcDate.getTime())) {
      showError("உள்ளிட்ட தேதி/நேரத்தைப் புரிந்துகொள்ள முடியவில்லை. மதிப்புகளைச் சரிபார்க்கவும்.");
      return;
    }

    var chart;
    try {
      chart = window.VedicCalc.computeChart(utcDate, lat, lon);
    } catch (err) {
      showError("ஜாதகத்தைக் கணக்கிட முடியவில்லை: " + err.message);
      return;
    }

    lastChart = chart;
    renderResult(name, {
      day: day, month: month, year: year, hour12: hour12, minute: minute, ampm: ampm,
      place: cityInput.value, lat: lat, lon: lon, tz: tz
    }, chart);
  });

  function currentStyle() {
    var checked = document.querySelector('input[name="chart-style"]:checked');
    return checked ? checked.value : "south";
  }

  function drawCharts() {
    if (!lastChart) return;
    var north = currentStyle() === "north";
    chartHostRasi.innerHTML = "";
    chartHostNavamsa.innerHTML = "";
    chartHostRasi.appendChild(north
      ? window.ChartRender.renderNorthIndian(lastChart)
      : window.ChartRender.renderSouthIndian(lastChart));
    chartHostNavamsa.appendChild(north
      ? window.ChartRender.renderNorthIndianNavamsa(lastChart)
      : window.ChartRender.renderSouthIndianNavamsa(lastChart));
  }

  styleToggle.forEach(function (r) {
    r.addEventListener("change", drawCharts);
  });

  downloadPdfBtn.addEventListener("click", function () {
    if (!lastChart) return;
    downloadPdfBtn.disabled = true;
    var safeName = (lastName || "jathagam").replace(/[^a-zA-Z0-9\u0B80-\u0BFF]+/g, "-");
    window.PdfExport.exportResultToPdf({
      resultSection: resultSection,
      fileName: safeName + "-jathagam.pdf",
      statusEl: pdfStatus
    }).then(function () {
      downloadPdfBtn.disabled = false;
    });
  });

  function addDetailRow(label, value) {
    var row = document.createElement("tr");
    row.innerHTML = "<th>" + label + "</th><td>" + value + "</td>";
    detailsTableBody.appendChild(row);
  }

  function renderResult(name, birth, chart) {
    resultName.textContent = name;
    lastName = name;
    var VD = window.VedicData;

    var monthName = monthNames[birth.month - 1];
    var ampmLabel = birth.ampm === "AM" ? "முற்பகல்" : "பிற்பகல்";
    var dobText = birth.day + "-" + birth.month + "-" + birth.year;
    var timeText = birth.hour12 + ":" + (birth.minute < 10 ? "0" + birth.minute : birth.minute) + " " + ampmLabel;
    var lonText = VD.formatDegMinDirection(birth.lon, "E", "W");
    var latText = VD.formatDegMinDirection(birth.lat, "N", "S");

    var ascRashiIdx = VD.rashiIndexFromLongitude(chart.ascendant);
    var moon = chart.planets.Moon;
    var moonRashiIdx = VD.rashiIndexFromLongitude(moon.longitude);
    var moonNak = VD.nakshatraInfo(moon.longitude);
    var sunLong = chart.planets.Sun.longitude;
    var tithi = VD.tithiInfo(sunLong, moon.longitude);
    var karana = VD.karanaInfo(sunLong, moon.longitude);
    var yoga = VD.yogaInfo(sunLong, moon.longitude);
    var dasha = VD.dashaBalance(moon.longitude);

    detailsTableBody.innerHTML = "";
    addDetailRow("பெயர்", name);
    addDetailRow("பிறந்த நாள்", dobText);
    addDetailRow("பிறந்த நேரம்", timeText);
    addDetailRow("பிறந்த இடம்", birth.place);
    addDetailRow("நெட்டாங்கு", lonText);
    addDetailRow("அகலாங்கு", latText);
    addDetailRow("உதய லக்னம்", VD.RASHIS[ascRashiIdx].ta);
    addDetailRow("ராசி", VD.RASHIS[moonRashiIdx].ta);
    addDetailRow("விண்மீன்", moonNak.name + ", பாதம் " + moonNak.pada);
    addDetailRow("நிலவு நாள் (திதி)", tithi.name + ", " + tithi.paksha);
    addDetailRow("கரணம்", karana.name);
    addDetailRow("யோகம்", yoga.name);

    // Graha table, in the traditional display order: Lagna, Sun, Moon,
    // Mercury, Venus, Mars, Jupiter, Saturn, Rahu, Ketu.
    var rows = [
      { key: "Asc", longitude: chart.ascendant, retro: false }
    ].concat(["Sun", "Moon", "Mercury", "Venus", "Mars", "Jupiter", "Saturn", "Rahu", "Ketu"].map(function (key) {
      return { key: key, longitude: chart.planets[key].longitude, retro: chart.planets[key].retrograde };
    }));

    planetTableBody.innerHTML = "";
    rows.forEach(function (r) {
      var rashiIdx = VD.rashiIndexFromLongitude(r.longitude);
      var nak = VD.nakshatraInfo(r.longitude);
      var row = document.createElement("tr");
      row.innerHTML =
        "<td>" + VD.PLANET_META[r.key].ta + (r.retro ? " (வக்ரம்)" : "") + "</td>" +
        "<td>" + VD.formatLongitudeColon(r.longitude) + "</td>" +
        "<td>" + VD.RASHIS[rashiIdx].ta + "</td>" +
        "<td>" + nak.name + " - " + nak.pada + "</td>";
      planetTableBody.appendChild(row);
    });

    dashaSummary.textContent = "தசை இருப்பு: " + VD.PLANET_META[dasha.lord].ta + " " +
      dasha.years + " வருடம், " + dasha.months + " மாதம், " + dasha.days + " நாள்";

    rashiNote.textContent = "இந்த ஜாதகரின் ராசி: " + VD.RASHIS[moonRashiIdx].ta;

    drawCharts();

    resultSection.hidden = false;
    resultSection.scrollIntoView({ behavior: "smooth", block: "start" });
  }
})();
