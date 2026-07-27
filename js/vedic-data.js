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

  global.VedicData = {
    RASHIS: RASHIS,
    NAKSHATRAS: NAKSHATRAS,
    PLANET_ORDER: PLANET_ORDER,
    PLANET_META: PLANET_META,
    rashiIndexFromLongitude: rashiIndexFromLongitude,
    degreeWithinSign: degreeWithinSign,
    nakshatraInfo: nakshatraInfo,
    formatDegree: formatDegree
  };
})(window);
