/* Renders South Indian and North Indian style Rasi (birth) charts as SVG */
(function (global) {
  "use strict";

  var VD = global.VedicData;

  function svgEl(tag, attrs, children) {
    var ns = "http://www.w3.org/2000/svg";
    var el = document.createElementNS(ns, tag);
    Object.keys(attrs || {}).forEach(function (k) {
      el.setAttribute(k, attrs[k]);
    });
    (children || []).forEach(function (c) { el.appendChild(c); });
    return el;
  }

  function text(x, y, str, cls, attrs) {
    var t = svgEl("text", Object.assign({ x: x, y: y, class: cls || "" }, attrs || {}));
    t.textContent = str;
    return t;
  }

  // Group planets (+ ascendant) by rashi index (0-11).
  function groupByRashi(chart) {
    var groups = [[], [], [], [], [], [], [], [], [], [], [], []];
    VD.PLANET_ORDER.forEach(function (name) {
      var p = chart.planets[name];
      var idx = VD.rashiIndexFromLongitude(p.longitude);
      groups[idx].push({ key: name, retro: p.retrograde, longitude: p.longitude });
    });
    var ascIdx = VD.rashiIndexFromLongitude(chart.ascendant);
    groups[ascIdx].push({ key: "Asc", retro: false, longitude: chart.ascendant });
    return groups;
  }

  function planetLabel(item) {
    var meta = VD.PLANET_META[item.key];
    return meta.abbr + (item.retro ? "\u1D3F" : ""); // superscript R marker
  }

  /* ---------------- South Indian chart (fixed 4x4 grid) ---------------- */
  // Grid cell -> rashi index (0=Aries...11=Pisces), reading order matches
  // the classic clockwise loop starting at Pisces (top-left corner).
  var SOUTH_GRID = [
    [11, 0, 1, 2],
    [10, -1, -1, 3],
    [9, -1, -1, 4],
    [8, 7, 6, 5]
  ];

  function renderSouthIndian(chart, opts) {
    opts = opts || {};
    var size = 400;
    var cell = size / 4;
    var groups = groupByRashi(chart);
    var ascRashi = VD.rashiIndexFromLongitude(chart.ascendant);

    var svg = svgEl("svg", {
      viewBox: "0 0 " + size + " " + size,
      class: "chart-svg south-chart",
      role: "img",
      "aria-label": "South Indian style birth chart"
    });

    // outer + grid lines
    svg.appendChild(svgEl("rect", { x: 0, y: 0, width: size, height: size, class: "chart-bg" }));
    for (var i = 0; i <= 4; i++) {
      svg.appendChild(svgEl("line", { x1: i * cell, y1: 0, x2: i * cell, y2: size, class: "chart-line" }));
      svg.appendChild(svgEl("line", { x1: 0, y1: i * cell, x2: size, y2: i * cell, class: "chart-line" }));
    }
    // clear the inner 2x2 (drawn over by bg + center ornament)
    svg.appendChild(svgEl("rect", { x: cell, y: cell, width: cell * 2, height: cell * 2, class: "chart-center" }));

    for (var r = 0; r < 4; r++) {
      for (var c = 0; c < 4; c++) {
        var rashiIdx = SOUTH_GRID[r][c];
        if (rashiIdx === -1) continue;
        var x0 = c * cell, y0 = r * cell;
        var isAsc = rashiIdx === ascRashi;
        if (isAsc) {
          svg.appendChild(svgEl("rect", {
            x: x0 + 3, y: y0 + 3, width: cell - 6, height: cell - 6, class: "chart-asc-box"
          }));
        }
        // rashi name, small, top-left of cell
        svg.appendChild(text(x0 + 6, y0 + 15, VD.RASHIS[rashiIdx].ta, "chart-rashi-label"));

        var items = groups[rashiIdx];
        var maxPerRow = 3;
        items.forEach(function (item, idx) {
          var row = Math.floor(idx / maxPerRow);
          var col = idx % maxPerRow;
          var px = x0 + 12 + col * 26;
          var py = y0 + 40 + row * 18;
          var cls = "chart-planet" + (item.key === "Asc" ? " chart-asc" : "");
          svg.appendChild(text(px, py, planetLabel(item), cls));
        });
      }
    }

    // center ornament: title
    svg.appendChild(text(size / 2, size / 2 - 6, "\u0950", "chart-center-glyph"));
    svg.appendChild(text(size / 2, size / 2 + 18, opts.centerLabel || "ராசி", "chart-center-label"));

    return svg;
  }

  /* ---------------- North Indian chart (diamond, fixed house slots) ---------------- */
  // House-slot polygons in a 400x400 box (house 1 = top kite, going clockwise).
  var NORTH_HOUSES = [
    { poly: [[100, 100], [200, 200], [300, 100], [200, 0]], center: [190, 78] },   // 1
    { poly: [[0, 0], [100, 100], [200, 0]], center: [100, 34] },                    // 2
    { poly: [[0, 0], [0, 200], [100, 100]], center: [34, 100] },                    // 3
    { poly: [[0, 200], [100, 300], [200, 200], [100, 100]], center: [90, 200] },    // 4
    { poly: [[0, 200], [0, 400], [100, 300]], center: [34, 300] },                  // 5
    { poly: [[100, 300], [0, 400], [200, 400]], center: [100, 366] },               // 6
    { poly: [[100, 300], [200, 400], [300, 300], [200, 200]], center: [190, 322] }, // 7
    { poly: [[300, 300], [200, 400], [400, 400]], center: [290, 366] },             // 8
    { poly: [[300, 300], [400, 400], [400, 200]], center: [366, 300] },             // 9
    { poly: [[300, 100], [200, 200], [300, 300], [400, 200]], center: [290, 200] }, // 10
    { poly: [[300, 100], [400, 200], [400, 0]], center: [366, 100] },               // 11
    { poly: [[200, 0], [300, 100], [400, 0]], center: [290, 34] }                   // 12
  ];

  function renderNorthIndian(chart, opts) {
    opts = opts || {};
    var size = 400;
    var ascRashi = VD.rashiIndexFromLongitude(chart.ascendant);
    var groups = groupByRashi(chart);

    var svg = svgEl("svg", {
      viewBox: "0 0 " + size + " " + size,
      class: "chart-svg north-chart",
      role: "img",
      "aria-label": "North Indian style birth chart"
    });

    svg.appendChild(svgEl("rect", { x: 0, y: 0, width: size, height: size, class: "chart-bg" }));
    // outer square
    svg.appendChild(svgEl("rect", { x: 0, y: 0, width: size, height: size, class: "chart-outline" }));
    // both diagonals
    svg.appendChild(svgEl("line", { x1: 0, y1: 0, x2: size, y2: size, class: "chart-line" }));
    svg.appendChild(svgEl("line", { x1: size, y1: 0, x2: 0, y2: size, class: "chart-line" }));
    // inner diamond (side midpoints)
    var mid = size / 2;
    svg.appendChild(svgEl("polygon", {
      points: [mid + ",0", size + "," + mid, mid + "," + size, "0," + mid].join(" "),
      class: "chart-line chart-diamond"
    }));

    for (var houseNum = 1; houseNum <= 12; houseNum++) {
      var slot = NORTH_HOUSES[houseNum - 1];
      var rashiIdx = (ascRashi + houseNum - 1) % 12;
      var isAsc = houseNum === 1;

      if (isAsc) {
        var pts = slot.poly.map(function (p) { return p.join(","); }).join(" ");
        svg.appendChild(svgEl("polygon", { points: pts, class: "chart-asc-box-fill" }));
      }

      // rashi number label (small)
      svg.appendChild(text(slot.center[0], slot.center[1], String(rashiIdx + 1), "chart-rashi-number"));

      var items = groups[rashiIdx];
      var baseY = slot.center[1] + 16;
      items.forEach(function (item, idx) {
        var py = baseY + idx * 16;
        var cls = "chart-planet" + (item.key === "Asc" ? " chart-asc" : "");
        svg.appendChild(text(slot.center[0], py, planetLabel(item), cls));
      });
    }

    return svg;
  }

  global.ChartRender = {
    renderSouthIndian: renderSouthIndian,
    renderNorthIndian: renderNorthIndian,
    groupByRashi: groupByRashi
  };
})(window);
