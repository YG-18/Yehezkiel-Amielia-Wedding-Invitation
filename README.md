# Yehezkiel & Amielia — Digital Wedding Invitation

A single-page invitation: cover → short intro video → childhood photos +
verse → invitation + countdown → ceremony details + maps → prewedding
gallery. Crimson, gold and cream throughout, with fade/slide reveals as guests
scroll.

## How to open it
Just open `index.html` in a browser. For fonts and the maps buttons to work
correctly, it's best to view it through a local server rather than
double-clicking the file — in VS Code, install the "Live Server" extension,
right-click `index.html`, and choose **Open with Live Server**.

## Folder structure (already set up for you)
```
wedding/
  index.html
  css/style.css
  js/script.js
  video/
    intro.mp4           ← YOU ADD: your ~10 second intro clip
  images/
    cover-bg.jpeg       ← YOU ADD: your cover photo with your bride
    logo.png            ← YOU ADD: your monogram/logo (transparent PNG looks best)
    childhood-groom-1.jpeg ← YOU ADD: Yehezkiel as a child
    childhood-groom-2.jpeg ← YOU ADD: Yehezkiel growing up
    childhood-bride-1.jpeg ← YOU ADD: Amielia as a child
    childhood-bride-2.jpeg ← YOU ADD: Amielia growing up
    invite-bg.jpeg       ← YOU ADD: background photo for the "invited" page
    details-bg.jpeg      ← YOU ADD: background photo for the wedding-details timeline page
    gallery-bg.jpeg       ← OPTIONAL: subtle atmospheric background behind the gallery page
    moment-1.jpeg  … moment-5.jpeg    ← YOU ADD: 5 static gallery photos
    carousel-1.jpeg … carousel-10.jpeg ← YOU ADD: up to 10 scrollable photos
  song/
    song.wav             ← YOU ADD: your background song
```

**Just drop your files into `video/`, `images/` and `song/` using the exact
names above** (all lowercase, `.jpeg` for photos, `.wav` for the song) and
everything will appear automatically — no code editing needed. Until a file
exists, that spot shows a soft placeholder pattern so you can see the layout
(the intro video will simply show a black screen for ~10 seconds if
`video/intro.mp4` isn't there yet).

If you'd rather use different filenames or `.jpg`/`.png`/`.mp3`, open
`js/script.js` and edit the `CONFIG` block at the top (gallery filenames),
or `index.html` (individual `src="images/…"` attributes), or the
`<source src="song/song.wav">` line in `index.html`.

## Things to personalize
- **Google Maps links** — open `js/script.js`, find `CONFIG.mapsLinks`, and
  paste your real Google Maps share links (Google Maps → Share → Copy link)
  for `ceremony` and `reception`.
- **Wedding date/time for the countdown** — `CONFIG.weddingDateISO` in
  `js/script.js` (already set to 17 July 2027, 09:00 WIB).
- **Names, parents, verse, venue text** — all live directly in `index.html`
  as plain text, so you can edit them like a Word document.
- **Intro video length** — it's set up for a ~10 second clip. If yours runs
  a different length, open `js/script.js`, find `setupVideoTransition()`,
  and change `VIDEO_DURATION_MS` to match (in milliseconds, e.g. `8000` for
  8 seconds). This is just a safety-net timer — the transition normally
  follows the video's real `ended` event, so it stays in sync either way.

## Notes on behavior
- Tapping **"Open Invitation"** fades out the cover and plays your intro
  video full-screen; once it finishes, it fades away into the invitation.
  The background song also starts at that point (browsers block audio from
  autoplaying before a tap, so waiting for this moment is intentional and
  works everywhere).
- The little disc button, bottom-right, lets guests pause/resume the song
  anytime after that.
- Every section fades/slides in as the guest scrolls to it.
- The static gallery (5 photos) is a structured mosaic; the second gallery
  (up to 10 photos) is a horizontal scroll/swipe carousel with arrow buttons
  on desktop and touch-swipe on mobile.
- Fully responsive — test on a phone, since most guests will open this from
  a WhatsApp link.

## Setting up the RSVP → Google Sheets connection
The RSVP form on the "Wishes & RSVP" section can log every response straight
into a Google Sheet, using a free Google Apps Script "Web App" as the bridge
(no paid backend needed).

1. Create a new Google Sheet. In row 1, add these headers:
   `Timestamp | Name | Attendance | Guests | Message`
2. In the Sheet, go to **Extensions → Apps Script**, delete the placeholder
   code, and paste this:
   ```javascript
   function doPost(e) {
     const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
     const data = JSON.parse(e.postData.contents);
     sheet.appendRow([
       data.timestamp, data.name, data.attendance, data.guests, data.message
     ]);
     return ContentService.createTextOutput(JSON.stringify({ status: "ok" }))
       .setMimeType(ContentService.MimeType.JSON);
   }
   ```
3. Click **Deploy → New deployment → Web app**. Set "Execute as" to **Me**
   and "Who has access" to **Anyone**. Deploy, and copy the Web App URL.
4. Paste that URL into `js/script.js`, in `CONFIG.rsvpEndpoint`.

That's it — every RSVP submitted on the site will show up as a new row in
your Sheet, and will also appear instantly in the "Wishes" wall on the page
itself for that guest's browser (remembered locally so it's still there if
they revisit).

## Wedding gift section
The three bank/e-wallet entries live directly in `index.html` under
`#page5` — search for `gift-card` and edit the bank name, account number
(both the visible text and the `data-copy` attribute, so the "Copy" button
copies the right thing), and account holder name for each.

## Decorative animated assets (birds, wayang figures, etc.)
`css/decor-animate.css` + `js/decor-animate.js` let you drop in small
ornamental images that gently **shake/flutter/float in place**, or
**circle slowly around a point** — no extra markup needed beyond a plain
`<img>` tag with a couple of `data-` attributes.

Shake / flutter / float (image stays where it is):
```html
<img src="images/decor-bird.png" class="decor-asset"
     data-animate="flutter" data-duration="2.4s"
     style="position:absolute; top:10%; right:8%; width:64px;">
```
Circling (the script builds the orbit path automatically):
```html
<img src="images/decor-wayang.png" class="decor-asset"
     data-animate="circle" data-radius="90" data-duration="16s"
     style="position:absolute; top:0; left:50%; width:50px;">
```
- `data-animate` — `shake` (quick tremor), `flutter` (softer wing-like flap),
  `float` (vertical bob), or `circle` (orbits around its own position)
- `data-duration` — how long one cycle takes, e.g. `"1.8s"` or `"14s"`
  (faster = more energetic, slower = more graceful)
- `data-radius` — circle only, how wide the orbit is in pixels
- `data-direction="reverse"` — circle only, flips orbit direction

Two working examples are already placed in `index.html` — a fluttering
bird on the cover (`images/decor-bird.png`) and a circling ornament next
to the Bible verse (`images/decor-wayang.png`). They quietly do nothing
until you add those image files (transparent PNGs work best), so it's
safe to leave them in. Add as many more as you like, anywhere on the page.

Happy wedding, Yehezkiel & Amielia! 🤎
