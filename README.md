# ஜாதகம் / Birth Chart Generator (Tamil)

A fully static, Tamil-language website that generates a Vedic (sidereal)
birth chart from a date, time and place of birth — rendered as a South
Indian or North Indian style Rasi chart, with all labels, form fields and
results in Tamil. Everything runs client-side in the browser; no server,
build step, database, or API key is required.

## What it computes

- **அயனாம்சம் (Ayanamsa)**: Lahiri (Chitrapaksha), from precession theory.
- **கிரகங்கள் (Grahas)**: சூரியன், சந்திரன், செவ்வாய், புதன், குரு, சுக்கிரன்,
  சனி (apparent geocentric sidereal longitudes), plus ராகு/கேது (mean lunar
  node).
- **லக்னம் (Ascendant)**: computed from local sidereal time, obliquity of
  the ecliptic, and the birth latitude.
- **ராசி, நட்சத்திரம் & பாதம்** (Rasi, Nakshatra & Pada) for every graha and
  the ascendant, retrograde (வக்ரம்) flag included.

Astronomical positions are computed with the open-source
[astronomy-engine](https://github.com/cosinekitty/astronomy) library
(MIT licensed, bundled at `js/astronomy.min.js`).

## Place-of-birth coverage

`js/cities.js` ships with a built-in lookup of ~190 places, in Tamil:

- All **38 Tamil Nadu districts** (district headquarters) plus roughly 100
  additional well-known taluk/temple towns across every district.
- Puducherry, Karaikal, Mahe, Yanam (Puducherry U.T.).
- Major cities of Andhra Pradesh, Telangana, Karnataka and Kerala.

If an exact birth place isn't in the list, pick the nearest listed town —
manual latitude/longitude entry is intentionally no longer offered (see
"Place-of-birth autocomplete" below), so a place must be selected from the
search results to generate a chart.

## Files

```
index.html            Page markup / form / results (Tamil)
css/style.css          Styling (Noto Serif/Sans Tamil typefaces)
js/astronomy.min.js    Third-party ephemeris library (MIT license)
js/cities.js           Tamil Nadu + South India city -> lat/lon/timezone table
js/vedic-data.js       Rasi/Nakshatra Tamil names + formatting helpers
js/vedic-calc.js       Ayanamsa, planetary longitude & ascendant calculations
js/chart-render.js     SVG drawing for South Indian & North Indian charts
js/app.js              Form handling / wiring calculations to the chart
```

## Running locally

No build step is needed. Just serve the folder, e.g.:

```bash
python3 -m http.server 8000
```

then open `http://localhost:8000`.

(Opening `index.html` directly with a `file://` URL also works in most
browsers, since everything is plain script tags with no bundler.)

## Deploying to GitHub Pages

1. Create a new GitHub repository (public, or private with GitHub Pages
   available on your plan).
2. Push these files to the repository root (or to a `docs/` folder — either
   works, you'll pick the source folder in the next step).

   ```bash
   git init
   git add .
   git commit -m "Tamil birth chart generator"
   git branch -M main
   git remote add origin https://github.com/<your-username>/<your-repo>.git
   git push -u origin main
   ```
3. On GitHub, go to the repository's **Settings → Pages**.
4. Under **Build and deployment**, set **Source** to "Deploy from a branch",
   choose the `main` branch and the `/ (root)` folder (or `/docs` if that's
   where you put the files), then **Save**.
5. GitHub will publish the site at
   `https://<your-username>.github.io/<your-repo>/` within a minute or two.

No environment variables, secrets, or build actions are needed since it's a
plain static site.

## Place-of-birth autocomplete

The city field (`js/place-picker.js`) is a custom autocomplete, not a native
`<datalist>`, so it can search by the English spelling while still filling in
the Tamil name — and it now works identically on desktop and mobile as a
single inline dropdown anchored directly under the field, so searching and
selecting a result always stay on the same screen (no separate popup/sheet,
no page scrolling required):

- Type English letters (e.g. `che`) and it matches place names whose English
  spelling **starts with** what you typed first (Chennai, Chengalpattu,
  Cheyyar, ...), with looser "contains" matches listed after. A Tamil-script
  prefix also works for people typing on a Tamil keyboard.
- Both the default suggestions (shown when the field is focused empty) and
  every search result list are sorted alphabetically by English name.
- Focusing the field with no text shows a short list of major cities so
  there's always something to pick from immediately.
- Arrow keys + Enter navigate the list; Escape or clicking outside closes it.
- **Latitude and longitude are no longer visible form fields.** Selecting a
  place fills them in behind the scenes (as hidden inputs) and shows a small
  green confirmation line under the field instead; the time zone field
  auto-fills too and is read-only. A place must be picked from the list to
  submit the form — free-typed text alone won't compute a chart.

## Mobile support

The layout is responsive down to small phone screens (~320px wide):

- Form rows (date, time, coordinates) use a flexible grid that reflows to
  fewer columns automatically as the screen narrows, instead of a fixed
  breakpoint that could overflow with longer Tamil month/city names.
- All inputs/selects use a 16px base font size so mobile browsers (iOS
  Safari in particular) don't auto-zoom on focus, and use full available
  width with safe minimum widths so nothing overflows the viewport.
- The birth-chart SVG scales fluidly with the container (no fixed pixel
  width), so it stays crisp and fully visible from small phones up to
  desktop.
- The graha-position table scrolls horizontally on very narrow screens
  instead of squeezing/wrapping unreadably.
- The "Generate" button is full-width on phones for an easier tap target.

## Notes on accuracy

- Positions use apparent geocentric coordinates (true equinox of date) minus
  the Lahiri ayanamsa, matching the convention used by most Vedic
  panchangam software. This was checked against known Sankranti dates
  (e.g. the Sun's transit into sidereal Capricorn/Makara around January 14–15
  and into Gemini/Mithuna around June 14–15).
- Rahu/Ketu use the **mean** lunar node (the convention most commonly used in
  traditional Vedic astrology), not the oscillating "true" node.
- The Ascendant formula assumes a birth time already converted to standard
  (non-daylight-saving) local time, matched with the correct UTC offset,
  which is why the time-zone field is auto-filled from the selected city
  rather than left to a browser locale guess.
- City coordinates are curated to a few decimal degrees (roughly ±1 km),
  which is more than sufficient for chart accuracy. For a place not listed,
  pick the nearest listed town.

