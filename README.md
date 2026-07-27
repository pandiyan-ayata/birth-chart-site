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

If a birth place isn't in the list, the form lets you enter its latitude,
longitude and standard UTC offset directly.

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

## Notes on accuracy

- Positions use apparent geocentric coordinates (true equinox of date) minus
  the Lahiri ayanamsa, matching the convention used by most Vedic
  panchangam software. This was checked against known Sankranti dates
  (e.g. the Sun's transit into sidereal Capricorn/Makara around January 14–15
  and into Gemini/Mithuna around June 14–15).
- Rahu/Ketu use the **mean** lunar node (the convention most commonly used in
  traditional Vedic astrology), not the oscillating "true" node.
- The Ascendant formula assumes a birth time already converted to standard
  (non-daylight-saving) local time, matched with the correct UTC offset —
  this is why the form asks for the offset explicitly rather than relying on
  a browser locale.
- City coordinates are curated to a few decimal degrees (roughly ±1 km),
  which is more than sufficient for chart accuracy. For a place not listed,
  enter its latitude, longitude and standard UTC offset directly (look these
  up from any map/geocoding service).

