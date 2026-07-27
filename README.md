# ஜாதகம் / Birth Chart Generator (Tamil)

A fully static, Tamil-language website that generates a Vedic (sidereal)
birth chart from a date, time and place of birth — rendered as a South
Indian or North Indian style Rasi chart, with all labels, form fields and
results in Tamil. Everything runs client-side in the browser; no server,
build step, database, or API key is required (the page does load Google
Fonts and the PDF-export libraries from public CDNs at runtime, same as any
static site — nothing to configure or pay for).

## What it computes

- **அயனாம்சம் (Ayanamsa)**: Lahiri (Chitrapaksha), from precession theory.
- **கிரகங்கள் (Grahas)**: சூரியன், சந்திரன், செவ்வாய், புதன், குரு, சுக்கிரன்,
  சனி (apparent geocentric sidereal longitudes), plus ராகு/கேது (mean lunar
  node).
- **லக்னம் (Ascendant)**: computed from local sidereal time, obliquity of
  the ecliptic, and the birth latitude.
- **ராசி (D1) & நவாம்சம் (D9) charts** for every graha and the ascendant, in
  both South Indian and North Indian style.
- **ராசி, நட்சத்திரம் & பாதம்** (Rasi, Nakshatra & Pada) for every graha and
  the ascendant, retrograde (வக்ரம்) flag included.
- **திதி, கரணம், யோகம்** (Tithi, Karana, Nithya Yoga) from the Sun-Moon
  angular relationship, and **தசை இருப்பு** (Vimshottari dasha balance at
  birth) from the Moon's nakshatra position.

This was cross-checked against a real reference Tamil jathagam printout and
matches it closely — graha longitudes agree to within about a minute of arc,
and every derived field (Lagna rasi, Moon rasi, nakshatra/pada, tithi,
karana, yoga) matches exactly.

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
manual latitude/longitude entry is intentionally not offered (see
"Place-of-birth search" below), so a place name must be found via the search
button to generate a chart.

## Files

```
index.html            Page markup / form / results (Tamil)
css/style.css          Styling (Noto Serif/Sans Tamil typefaces)
js/astronomy.min.js    Third-party ephemeris library (MIT license)
js/cities.js           Tamil Nadu + South India city -> lat/lon/timezone table
js/vedic-data.js       Rasi/Nakshatra/Tithi/Karana/Yoga tables, dasha balance,
                        Navamsa sign math, formatting helpers
js/vedic-calc.js       Ayanamsa, planetary longitude & ascendant calculations
js/chart-render.js     SVG drawing for South/North Indian Rasi & Navamsa charts
js/place-picker.js     Place-name search (button-triggered, exact/fuzzy match)
js/app.js              Form handling / wiring calculations to the results
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

## Branding & contact footer

- The page header now reads **நந்தினி ஜோதிட நிலையம்** (Nandhini Jodhida
  Nilayam) instead of a generic tool title.
- The footer has two columns: **தொடர்பு** (contact details — Kalyana
  Sundaram, Dhandapani Kovil Street, Thirupattur - 635601, phone as a
  tappable `tel:` link) and **சேவைகள்** (the three services offered:
  marriage horoscope matching, horoscope/life predictions, and auspicious
  date/time selection for events).

## PDF download

Once a chart is generated, a "PDF ஆக பதிவிறக்கம் செய்ய" button appears below
it. Clicking it (`js/pdf-export.js`):

1. Builds an off-screen copy of the page **header + full results (details
   table, graha table, dasha line, both Rasi/Navamsa charts) + footer**.
2. Renders that to an image with [html2canvas](https://html2canvas.hertzen.com/)
   and lays it into an A4 PDF with [jsPDF](https://github.com/parallax/jsPDF)
   (paginating automatically if the content is taller than one page).
3. Triggers a normal browser download of the finished file (named after the
   person, e.g. `Monica-jathagam.pdf`) straight to the device — no server
   round-trip.

Both libraries are loaded from a CDN (jsDelivr) in `index.html`; if the
device is offline when the button is pressed, a Tamil error message explains
that the PDF tool couldn't load rather than failing silently.

## Place-of-birth search

The city field (`js/place-picker.js`) is a plain text box plus a "தேடு"
(Search) button — no dropdown, no autocomplete-as-you-type:

- Type a place name (English or Tamil spelling) and press "தேடு" (or Enter).
- It first looks for an **exact** match, then a name that **starts with**
  what you typed, then a **looser match** anywhere in the name — so
  "Vellore", "vellore", or "வேலூர்" all resolve to the same place.
- If nothing in the list matches, an error message appears and no chart can
  be generated until a valid place is found.
- A successful match fills in the hidden latitude/longitude fields and the
  read-only time-zone field automatically, and shows a small green
  confirmation line under the search box.
- Editing the text after a match clears the resolved coordinates, so a
  stale lat/lon can never be silently submitted for a different name.

## Results layout

After submitting, the results panel mirrors a traditional printed jathagam:

- A details table (பெயர், பிறந்த நாள், பிறந்த நேரம், பிறந்த இடம்,
  நெட்டாங்கு, அகலாங்கு, உதய லக்னம், ராசி, விண்மீன், திதி, கரணம், யோகம்).
- A graha-position table (லக்னம் + 9 grahas) with total sidereal longitude
  in `D:M:S` form, rasi, and nakshatra-pada — in the traditional
  Lagna/Sun/Moon/Mercury/Venus/Mars/Jupiter/Saturn/Rahu/Ketu order.
- The Vimshottari dasha balance running at birth.
- **Both the ராசி (D1/Rasi) and நவாம்சம் (D9/Navamsa) charts side by side**,
  redrawn together whenever the South/North Indian style toggle changes.

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

