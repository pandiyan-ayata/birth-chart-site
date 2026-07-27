/* Core Vedic astrology calculations built on astronomy-engine (Astronomy global) */
(function (global) {
  "use strict";

  var A = global.Astronomy;

  // Lahiri (Chitrapaksha) ayanamsa, referenced to J2000.0 and the IAU 2006
  // accumulated general precession in longitude. Accurate to within a
  // fraction of an arc-minute over the last few centuries either side of 2000.
  function ayanamsaLahiri(date) {
    var time = A.MakeTime(date);
    var T = time.tt / 36525; // Julian centuries of TT from J2000.0
    var pA = 5028.796195 * T + 1.1054348 * T * T; // arcsec
    return 23.85 + pA / 3600;
  }

  function normalize360(x) {
    return ((x % 360) + 360) % 360;
  }

  // Apparent geocentric ecliptic-of-date longitude (tropical) of a body.
  function tropicalGeoLongitude(body, date) {
    var vec = A.GeoVector(body, date, true);
    var ecl = A.Ecliptic(vec);
    return normalize360(ecl.elon);
  }

  function siderealLongitude(body, date, ayanamsa) {
    return normalize360(tropicalGeoLongitude(body, date) - ayanamsa);
  }

  // Mean lunar ascending node (Rahu), Meeus "Astronomical Algorithms" formula.
  function meanNodeTropical(date) {
    var time = A.MakeTime(date);
    var T = time.tt / 36525;
    var node = 125.0445222 - 1934.1362608 * T + 0.0020708 * T * T + (T * T * T) / 450000;
    return normalize360(node);
  }

  // Tropical ecliptic longitude of the Ascendant (rising degree) for an
  // observer at geographic latitude/longitude (degrees, east +, north +).
  function ascendantTropical(date, latitude, longitude) {
    var time = A.MakeTime(date);
    var gastHours = A.SiderealTime(time); // Greenwich Apparent Sidereal Time, hours
    var ramc = normalize360(gastHours * 15 + longitude); // Right Ascension of MC, degrees
    var et = A.e_tilt(time);
    var eps = et.tobl * A.DEG2RAD; // true obliquity of the ecliptic
    var ramcRad = ramc * A.DEG2RAD;
    var latRad = latitude * A.DEG2RAD;
    var asc = Math.atan2(
      Math.cos(ramcRad),
      -(Math.sin(eps) * Math.tan(latRad) + Math.cos(eps) * Math.sin(ramcRad))
    );
    asc = asc * A.RAD2DEG;
    return normalize360(asc);
  }

  // Is a planet retrograde? Compare longitude now vs a short time later.
  function isRetrograde(body, date) {
    if (body === A.Body.Sun || body === A.Body.Moon) return false;
    var t1 = tropicalGeoLongitude(body, date);
    var later = new Date(date.getTime() + 36 * 60 * 60 * 1000); // +36h
    var t2 = tropicalGeoLongitude(body, later);
    var delta = t2 - t1;
    if (delta > 180) delta -= 360;
    if (delta < -180) delta += 360;
    return delta < 0;
  }

  var BODY_MAP = {
    Sun: "Sun",
    Moon: "Moon",
    Mars: "Mars",
    Mercury: "Mercury",
    Jupiter: "Jupiter",
    Venus: "Venus",
    Saturn: "Saturn"
  };

  /**
   * Compute a full sidereal (nirayana) birth chart.
   * @param {Date} date - UTC JS Date of birth instant.
   * @param {number} latitude - degrees, north positive.
   * @param {number} longitude - degrees, east positive.
   * @returns {{ayanamsa:number, ascendant:number, planets:Object}}
   */
  function computeChart(date, latitude, longitude) {
    var ayanamsa = ayanamsaLahiri(date);
    var planets = {};

    Object.keys(BODY_MAP).forEach(function (name) {
      var body = A.Body[BODY_MAP[name]];
      planets[name] = {
        longitude: siderealLongitude(body, date, ayanamsa),
        retrograde: isRetrograde(body, date)
      };
    });

    var rahuTropical = meanNodeTropical(date);
    var rahuSidereal = normalize360(rahuTropical - ayanamsa);
    var ketuSidereal = normalize360(rahuSidereal + 180);
    planets.Rahu = { longitude: rahuSidereal, retrograde: true };
    planets.Ketu = { longitude: ketuSidereal, retrograde: true };

    var ascTropical = ascendantTropical(date, latitude, longitude);
    var ascSidereal = normalize360(ascTropical - ayanamsa);

    return {
      ayanamsa: ayanamsa,
      ascendant: ascSidereal,
      planets: planets
    };
  }

  // Combine a calendar date/time (already converted to true UTC) helper.
  function toUTCDate(year, month, day, hour, minute, utcOffsetHours) {
    // month is 1-12
    var utcMillis = Date.UTC(year, month - 1, day, hour, minute, 0, 0);
    utcMillis -= utcOffsetHours * 60 * 60 * 1000;
    return new Date(utcMillis);
  }

  global.VedicCalc = {
    ayanamsaLahiri: ayanamsaLahiri,
    tropicalGeoLongitude: tropicalGeoLongitude,
    siderealLongitude: siderealLongitude,
    ascendantTropical: ascendantTropical,
    computeChart: computeChart,
    toUTCDate: toUTCDate,
    normalize360: normalize360
  };
})(window);
