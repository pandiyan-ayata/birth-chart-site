/* Vedic astrology reference data (Tamil): rashis, nakshatras, graha metadata */
(function (global) {
  "use strict";

  var RASHIS = [
    { ta: "மேஷம்" },
    { ta: "ரிஷபம்" },
    { ta: "மிதுனம்" },
    { ta: "கடகம்" },
    { ta: "சிம்மம்" },
    { ta: "கன்னி" },
    { ta: "துலாம்" },
    { ta: "விருச்சிகம்" },
    { ta: "தனுசு" },
    { ta: "மகரம்" },
    { ta: "கும்பம்" },
    { ta: "மீனம்" }
  ];

  var NAKSHATRAS = [
    { ta: "அசுவினி" },
    { ta: "பரணி" },
    { ta: "கார்த்திகை" },
    { ta: "ரோகிணி" },
    { ta: "மிருகசீரிடம்" },
    { ta: "திருவாதிரை" },
    { ta: "புனர்பூசம்" },
    { ta: "பூசம்" },
    { ta: "ஆயில்யம்" },
    { ta: "மகம்" },
    { ta: "பூரம்" },
    { ta: "உத்திரம்" },
    { ta: "அஸ்தம்" },
    { ta: "சித்திரை" },
    { ta: "சுவாதி" },
    { ta: "விசாகம்" },
    { ta: "அனுஷம்" },
    { ta: "கேட்டை" },
    { ta: "மூலம்" },
    { ta: "பூராடம்" },
    { ta: "உத்திராடம்" },
    { ta: "திருவோணம்" },
    { ta: "அவிட்டம்" },
    { ta: "சதயம்" },
    { ta: "பூரட்டாதி" },
    { ta: "உத்திரட்டாதி" },
    { ta: "ரேவதி" }
  ];

  // Order in which grahas are computed / listed
  var PLANET_ORDER = ["Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn", "Rahu", "Ketu"];

  var PLANET_META = {
    Sun:     { abbr: "சூ", ta: "சூரியன்" },
    Moon:    { abbr: "சந்", ta: "சந்திரன்" },
    Mars:    { abbr: "செ", ta: "செவ்வாய்" },
    Mercury: { abbr: "பு",  ta: "புதன்" },
    Jupiter: { abbr: "கு",  ta: "குரு" },
    Venus:   { abbr: "சுக்", ta: "சுக்கிரன்" },
    Saturn:  { abbr: "சனி", ta: "சனி" },
    Rahu:    { abbr: "ரா", ta: "ராகு" },
    Ketu:    { abbr: "கே", ta: "கேது" },
    Asc:     { abbr: "ல", ta: "லக்னம்" }
  };

  function rashiIndexFromLongitude(siderealLon) {
    return Math.floor(((siderealLon % 360) + 360) % 360 / 30);
  }

  function degreeWithinSign(siderealLon) {
    return ((siderealLon % 360) + 360) % 360 % 30;
  }

  function nakshatraInfo(siderealLon) {
    var lon = ((siderealLon % 360) + 360) % 360;
    var span = 360 / 27; // 13.3333
    var idx = Math.floor(lon / span);
    var posInNak = lon - idx * span;
    var pada = Math.floor(posInNak / (span / 4)) + 1;
    return {
      index: idx,
      name: NAKSHATRAS[idx].ta,
      pada: pada
    };
  }

  // Vimshottari dasha lord sequence, one per nakshatra (repeats 3x over 27)
  var DASHA_LORD_SEQUENCE = ["Ketu", "Venus", "Sun", "Moon", "Mars", "Rahu", "Jupiter", "Saturn", "Mercury"];
  var DASHA_YEARS = {
    Ketu: 7, Venus: 20, Sun: 6, Moon: 10, Mars: 7,
    Rahu: 18, Jupiter: 16, Saturn: 19, Mercury: 17
  };

  // 15 tithi names; paksha (waxing/waning) determines which half of the
  // cycle (1-15 Shukla, 16-30 Krishna, sharing the same 14 names + the
  // special 15th: Pournami for Shukla, Amavasai for Krishna).
  var TITHI_NAMES = [
    "பிரதமை", "துவிதியை", "திரிதியை", "சதுர்த்தி", "பஞ்சமி",
    "சஷ்டி", "சப்தமி", "அஷ்டமி", "நவமி", "தசமி",
    "ஏகாதசி", "துவாதசி", "திரயோதசி", "சதுர்த்தசி"
  ];

  var KARANA_MOVABLE = ["பவம்", "பாலவம்", "கௌலவம்", "தைதுலம்", "கரம்", "வணிசை", "விஷ்டி"];
  var KARANA_FIXED = { 1: "கிம்ஸ்துக்னா", 58: "சகுனி", 59: "சதுஷ்பாதம்", 60: "நாகவம்" };

  var YOGA_NAMES = [
    "விஷ்கம்பம்", "பிரீதி", "ஆயுஷ்மான்", "சௌபாக்கியம்", "சோபனம்",
    "அதிகண்டம்", "சுகர்மா", "திருதி", "சூலம்", "கண்டம்",
    "விருத்தி", "துருவம்", "வியாகாதம்", "ஹர்ஷணம்", "வஜ்ரம்",
    "சித்தி", "வியதீபாதம்", "வரீயான்", "பரிகம்", "சிவம்",
    "சித்தம்", "சாத்தியம்", "சுபம்", "சுக்லம்", "பிரம்மம்",
    "ஐந்திரம்", "வைதிருதி"
  ];

  function navamsaIndexFromLongitude(siderealLon) {
    var lon = ((siderealLon % 360) + 360) % 360;
    return Math.floor(lon / (10 / 3)) % 12;
  }

  function formatDegree(siderealLon) {
    var d = degreeWithinSign(siderealLon);
    var deg = Math.floor(d);
    var minFloat = (d - deg) * 60;
    var min = Math.floor(minFloat);
    var sec = Math.round((minFloat - min) * 60);
    if (sec === 60) { sec = 0; min += 1; }
    if (min === 60) { min = 0; deg += 1; }
    return deg + "\u00B0 " + (min < 10 ? "0" + min : min) + "' " + (sec < 10 ? "0" + sec : sec) + "\"";
  }

  // "D:M:S" of the total sidereal longitude (0-360), e.g. "106:26:8"
  function formatLongitudeColon(siderealLon) {
    var lon = ((siderealLon % 360) + 360) % 360;
    var deg = Math.floor(lon);
    var minFloat = (lon - deg) * 60;
    var min = Math.floor(minFloat);
    var sec = Math.round((minFloat - min) * 60);
    if (sec === 60) { sec = 0; min += 1; }
    if (min === 60) { min = 0; deg += 1; }
    return deg + ":" + min + ":" + sec;
  }

  // "D:M" + direction letter, e.g. "79:6E" / "12:56N"
  function formatDegMinDirection(value, positiveLetter, negativeLetter) {
    var letter = value >= 0 ? positiveLetter : negativeLetter;
    var abs = Math.abs(value);
    var deg = Math.floor(abs);
    var min = Math.round((abs - deg) * 60);
    if (min === 60) { min = 0; deg += 1; }
    return deg + ":" + min + letter;
  }

  function tithiInfo(sunLong, moonLong) {
    var diff = ((moonLong - sunLong) % 360 + 360) % 360;
    var index = Math.floor(diff / 12); // 0-29
    var isShukla = index < 15;
    var withinPaksha = isShukla ? index : index - 15; // 0-14
    var name = withinPaksha === 14
      ? (isShukla ? "பௌர்ணமி" : "அமாவாசை")
      : TITHI_NAMES[withinPaksha];
    return {
      index: index + 1,
      name: name,
      paksha: isShukla ? "சுக்லபக்ஷம் (வளர்பிறை)" : "கிருஷ்ணபக்ஷம் (தேய்பிறை)"
    };
  }

  function karanaInfo(sunLong, moonLong) {
    var diff = ((moonLong - sunLong) % 360 + 360) % 360;
    var num = Math.floor(diff / 6) + 1; // 1-60
    if (KARANA_FIXED[num]) return { name: KARANA_FIXED[num] };
    var idx = (num - 2) % 7;
    return { name: KARANA_MOVABLE[idx] };
  }

  function yogaInfo(sunLong, moonLong) {
    var sum = ((sunLong + moonLong) % 360 + 360) % 360;
    var span = 360 / 27;
    var idx = Math.floor(sum / span);
    return { name: YOGA_NAMES[idx] };
  }

  function dashaBalance(moonLong) {
    var lon = ((moonLong % 360) + 360) % 360;
    var span = 360 / 27;
    var nakIndex = Math.floor(lon / span);
    var posInNak = lon - nakIndex * span;
    var fractionElapsed = posInNak / span;
    var lord = DASHA_LORD_SEQUENCE[nakIndex % 9];
    var totalYears = DASHA_YEARS[lord];
    var balanceYears = (1 - fractionElapsed) * totalYears;

    var totalDays = balanceYears * 360; // 12 x 30-day months, standard dasha convention
    var years = Math.floor(totalDays / 360);
    var remAfterYears = totalDays - years * 360;
    var months = Math.floor(remAfterYears / 30);
    var days = Math.round(remAfterYears - months * 30);
    if (days === 30) { days = 0; months += 1; }
    if (months === 12) { months = 0; years += 1; }

    return { lord: lord, years: years, months: months, days: days };
  }

  global.VedicData = {
    RASHIS: RASHIS,
    NAKSHATRAS: NAKSHATRAS,
    PLANET_ORDER: PLANET_ORDER,
    PLANET_META: PLANET_META,
    rashiIndexFromLongitude: rashiIndexFromLongitude,
    navamsaIndexFromLongitude: navamsaIndexFromLongitude,
    degreeWithinSign: degreeWithinSign,
    nakshatraInfo: nakshatraInfo,
    formatDegree: formatDegree,
    formatLongitudeColon: formatLongitudeColon,
    formatDegMinDirection: formatDegMinDirection,
    tithiInfo: tithiInfo,
    karanaInfo: karanaInfo,
    yogaInfo: yogaInfo,
    dashaBalance: dashaBalance
  };
})(window);
