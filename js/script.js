/* =========================================================
   EDIT THIS CONFIG BLOCK TO PERSONALIZE THE INVITATION
   ========================================================= */
const CONFIG = {
  weddingDateISO: "2027-07-17T09:00:00+07:00", // ceremony start, used for the countdown

  // Paste your real Google Maps "share" links here (Share > Copy link on Google Maps)
  mapsLinks: {
    ceremony:  "https://maps.google.com/?q=Gereja+Bethany+Community+Batam+Baloi+Polisi",
    reception: "https://maps.google.com/?q=Kayu+Merah+Panbil+Batam"
  },

  // Static "hero" photos in the gallery grid — put files at images/moment-1.jpeg ... moment-5.jpeg
  staticPhotoCount: 10,
  staticPhotoPrefix: "images/prewed/moment-",

  // Scrollable carousel photos — put files at images/carousel-1.jpeg ... carousel-10.jpeg
  carouselPhotoCount: 5,
  carouselPhotoPrefix: "images/prewed/carousel-",

  // ---- RSVP -> Google Sheets ----
  // 1. Make a Google Sheet with header row: Timestamp | Name | Attendance | Guests | Message
  // 2. In the Sheet: Extensions -> Apps Script, paste the doPost script from README.md
  // 3. Deploy -> New deployment -> Web app -> Execute as "Me", Access "Anyone"
  // 4. Paste the deployment URL below
  rsvpEndpoint: "PASTE_YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL_HERE"
};

/* ========================================================= */

document.addEventListener("DOMContentLoaded", () => {
  injectMapsLinks();
  buildStaticGallery();
  buildCarousel();
  setupCarouselNav();
  setupVideoTransition();
  setupScrollReveal();
  setupProgressRail();
  setupMusic();
  setupParallax();
  setupGiftCopy();
  setupRSVP();
});

/* ---------- Google Maps links ---------- */
function injectMapsLinks() {
  document.querySelectorAll("[data-maps]").forEach(a => {
    const key = a.getAttribute("data-maps");
    if (CONFIG.mapsLinks[key]) a.href = CONFIG.mapsLinks[key];
  });
}
function setInviteeName() {
  console.log("setInviteeName() CALLED");

  const params = new URLSearchParams(window.location.search);
  const rawName = params.get('to');

  console.log("URL:", window.location.href);
  console.log("rawName:", rawName);

  const nameEl = document.getElementById('inviteName');

  console.log("nameEl:", nameEl);

  if (!nameEl) return;

  if (rawName && rawName.trim().length > 0) {
    nameEl.textContent = rawName.trim();
  }
}

document.addEventListener('DOMContentLoaded', setInviteeName);
/* ---------- Lightbox controller ---------- */
const lightbox = {
  list: [],
  index: 0,
  el: null, imgEl: null, captionEl: null,

  init() {
    this.el = document.getElementById("lightbox");
    this.imgEl = document.getElementById("lightboxImg");
    this.captionEl = document.getElementById("lightboxCaption");
    document.getElementById("lightboxClose").addEventListener("click", () => this.close());
    document.getElementById("lightboxPrev").addEventListener("click", () => this.step(-1));
    document.getElementById("lightboxNext").addEventListener("click", () => this.step(1));
    this.el.addEventListener("click", (e) => { if (e.target === this.el) this.close(); });
    document.addEventListener("keydown", (e) => {
      if (!this.el.classList.contains("active")) return;
      if (e.key === "Escape") this.close();
      if (e.key === "ArrowRight") this.step(1);
      if (e.key === "ArrowLeft") this.step(-1);
    });
  },

  open(list, index) {
    this.list = list;
    this.index = index;
    this.render();
    this.el.classList.add("active");
    this.el.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  },

  render() {
    const item = this.list[this.index];
    this.imgEl.src = item.src;
    this.imgEl.alt = item.alt || "";
    this.captionEl.textContent = item.alt || "";
  },

  step(dir) {
    this.index = (this.index + dir + this.list.length) % this.list.length;
    this.render();
  },

  close() {
    this.el.classList.remove("active");
    this.el.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  }
};

/* ---------- Gallery: static grid ---------- */
function buildStaticGallery() {
  const grid = document.getElementById("galleryStatic");
  let html = "";
  for (let i = 1; i <= CONFIG.staticPhotoCount; i++) {
    const src = `${CONFIG.staticPhotoPrefix}${i}.jpeg`;
    html += `
      <figure data-index="${String(i).padStart(2, "0")}">
        <div class="frame-inner">
          <img src="${src}" alt="Prewedding moment ${i}"
               onerror="this.closest('.frame-inner').innerHTML='<div class=placeholder-fallback>photo ${i}<br>${src}</div>'">
        </div>
        <div class="expand-hint">
          <svg viewBox="0 0 24 24" fill="none" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
            <path d="M9 3H3v6M15 3h6v6M9 21H3v-6M15 21h6v-6"/>
          </svg>
        </div>
      </figure>`;
  }
  grid.innerHTML = html;

  grid.querySelectorAll("figure").forEach((fig, idx) => {
    fig.addEventListener("click", () => {
      const img = fig.querySelector("img");
      if (!img) return; // failed-to-load placeholder, nothing to open
      const items = Array.from(grid.querySelectorAll("figure img")).map(im => ({ src: im.src, alt: im.alt }));
      const validIdx = Array.from(grid.querySelectorAll("figure")).filter(f => f.querySelector("img")).indexOf(fig);
      lightbox.open(items, validIdx);
    });
  });
}

/* ---------- Gallery: scrollable carousel ---------- */
function buildCarousel() {
  const track = document.getElementById("carousel");
  let html = "";
  for (let i = 1; i <= CONFIG.carouselPhotoCount; i++) {
    const src = `${CONFIG.carouselPhotoPrefix}${i}.jpeg`;
    html += `
      <div class="slide">
        <img src="${src}" alt="Prewedding photo ${i}"
             onerror="this.parentElement.innerHTML='<div class=placeholder-fallback>carousel photo ${i}<br>${src}</div>'">
      </div>`;
  }
  track.innerHTML = html;

  track.querySelectorAll(".slide").forEach((slide) => {
    slide.addEventListener("click", () => {
      const img = slide.querySelector("img");
      if (!img) return;
      const items = Array.from(track.querySelectorAll(".slide img")).map(im => ({ src: im.src, alt: im.alt }));
      const validIdx = Array.from(track.querySelectorAll(".slide")).filter(s => s.querySelector("img")).indexOf(slide);
      lightbox.open(items, validIdx);
    });
  });
}

function setupCarouselNav() {
  const track = document.getElementById("carousel");
  const step = 280;
  document.getElementById("carPrev").addEventListener("click", () => {
    track.scrollBy({ left: -step, behavior: "smooth" });
  });
  document.getElementById("carNext").addEventListener("click", () => {
    track.scrollBy({ left: step, behavior: "smooth" });
  });
}

lightbox.init();

function setupVideoTransition() {
  const openBtn = document.getElementById("openBtn");
  const overlay = document.getElementById("video-overlay");
  const video = document.getElementById("introVideo");
  const cover = document.getElementById("cover");
  const main = document.getElementById("mainContent");

  // Defensive check: if any required element is missing from the page,
  // warn clearly in the console instead of silently crashing later deep
  // inside the click handler (which is what "fades but no video plays"
  // usually means — check the console for exactly which one is missing).
  if (!openBtn || !overlay || !video || !cover || !main) {
    console.warn(
      "setupVideoTransition: missing element(s) —",
      { openBtn, overlay, video, cover, main },
      "Check that index.html still has #openBtn, #video-overlay, #introVideo, #cover, and #mainContent."
    );
    return;
  }

  // Safety net in case the video's actual length differs from 10s or
  // the 'ended' event doesn't fire for some reason (e.g. file missing).
  const VIDEO_DURATION_MS = 10000;
  let finished = false;

  openBtn.addEventListener("click", () => {
    openBtn.disabled = true;

    cover.style.transition = "opacity 0.6s ease";
    cover.style.opacity = "0";
    setTimeout(() => { cover.style.display = "none"; }, 650);

    overlay.classList.add("active");

    const startPlayback = () => {
      video.currentTime = 0;
      video.play().catch((err) => {
        console.warn("Video play() failed:", err);
        finishIntro();
      });
    };

    if (video.readyState >= 3) {
      // HAVE_FUTURE_DATA or better — safe to seek+play immediately
      startPlayback();
    } else {
      video.addEventListener("canplay", startPlayback, { once: true });
      video.load(); // nudge loading in case preload didn't kick in yet
    }

    function finishIntro() {
      if (finished) return;
      finished = true;

      startMusicOnOpen();
      overlay.classList.add("fade-out");

      main.style.display = "block";
      main.style.opacity = "0";
      main.style.transition = "opacity 1.2s ease";
      requestAnimationFrame(() => { main.style.opacity = "1"; });

      setTimeout(() => {
        overlay.classList.remove("active", "fade-out");
        video.pause();
        document.getElementById("page1").scrollIntoView({ behavior: "smooth" });
        startCountdown();
        document.getElementById("music-toggle").classList.add("visible");
      }, 900);
    }

    video.addEventListener("ended", finishIntro, { once: true });
    setTimeout(finishIntro, VIDEO_DURATION_MS + 200);
  });

  video.addEventListener("error", () => {
    console.warn(
      "Intro video failed to load — check that the file exists at exactly video/intro.mp4 (case-sensitive) and is a browser-playable .mp4 (H.264 video codec)."
    );
  });
}

/* ---------- Countdown ---------- */
function startCountdown() {
  const target = new Date(CONFIG.weddingDateISO).getTime();
  const els = {
    d: document.getElementById("cd-days"),
    h: document.getElementById("cd-hours"),
    m: document.getElementById("cd-mins"),
    s: document.getElementById("cd-secs")
  };
  function tick() {
    const diff = Math.max(0, target - Date.now());
    const days = Math.floor(diff / 86400000);
    const hours = Math.floor((diff % 86400000) / 3600000);
    const mins = Math.floor((diff % 3600000) / 60000);
    const secs = Math.floor((diff % 60000) / 1000);
    els.d.textContent = String(days).padStart(2, "0");
    els.h.textContent = String(hours).padStart(2, "0");
    els.m.textContent = String(mins).padStart(2, "0");
    els.s.textContent = String(secs).padStart(2, "0");
  }
  tick();
  setInterval(tick, 1000);
}

/* ---------- Scroll reveal ---------- */
function setupScrollReveal() {
  const targets = document.querySelectorAll(".reveal, .reveal-stagger");
  const io = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("in-view");
          io.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.18 }
  );
  targets.forEach(t => io.observe(t));
}

/* ---------- Parallax on background photos ---------- */
function setupParallax() {
  const layers = [
    { el: document.querySelector("#cover .cover-bg"), factor: 0.25 },
    { el: document.querySelector("#page2-groom .bg-image"), factor: 0.18 },
    { el: document.querySelector("#page2-bride .bg-image"), factor: 0.18 }
  ].filter(l => l.el);

  if (!layers.length) return;

  let ticking = false;
  function update() {
    layers.forEach(({ el, factor }) => {
      const rect = el.parentElement.getBoundingClientRect();
      const offset = rect.top * factor;
      el.style.transform = `translate3d(0, ${offset}px, 0) scale(1.12)`;
    });
    ticking = false;
  }
  window.addEventListener("scroll", () => {
    if (!ticking) {
      requestAnimationFrame(update);
      ticking = true;
    }
  });
  update();
}

/* ---------- Scroll progress rail ---------- */
function setupProgressRail() {
  const bar = document.getElementById("progressBar");
  window.addEventListener("scroll", () => {
    const h = document.documentElement;
    const max = h.scrollHeight - h.clientHeight;
    const scrolled = max > 0 ? h.scrollTop / max : 0;   // guard divide-by-zero
    bar.style.width = `${Math.min(100, Math.max(0, scrolled * 100))}%`;
  });
}

/* ---------- Music ---------- */
function setupMusic() {
  const audio = document.getElementById("bgMusic");
  const btn = document.getElementById("music-toggle");
  btn.addEventListener("click", () => {
    if (audio.paused) {
      audio.play().catch(() => {});
      btn.classList.add("playing");
    } else {
      audio.pause();
      btn.classList.remove("playing");
    }
  });
}

function startMusicOnOpen() {
  const audio = document.getElementById("bgMusic");
  const btn = document.getElementById("music-toggle");
  audio.volume = 0.7;
  audio.play()
    .then(() => btn.classList.add("playing"))
    .catch(() => {
      // autoplay blocked — user can press the music button manually
      btn.classList.remove("playing");
    });
}

/* ---------- Gift page: copy account number to clipboard ---------- */
function setupGiftCopy() {
  document.querySelectorAll(".copy-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const card = btn.closest(".gift-card");
      const number = card.querySelector(".gift-number").dataset.copy;
      const label = btn.querySelector(".copy-label");
      const finish = ok => {
        label.textContent = ok ? "Copied!" : "Copy failed";
        btn.classList.toggle("copied", ok);
        setTimeout(() => {
          label.textContent = "Copy";
          btn.classList.remove("copied");
        }, 1800);
      };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(number).then(() => finish(true)).catch(() => finish(false));
      } else {
        // fallback for older browsers / non-HTTPS local file preview
        const temp = document.createElement("textarea");
        temp.value = number;
        temp.style.position = "fixed";
        temp.style.opacity = "0";
        document.body.appendChild(temp);
        temp.select();
        try {
          document.execCommand("copy");
          finish(true);
        } catch (e) {
          finish(false);
        }
        document.body.removeChild(temp);
      }
    });
  });
}

/* ---------- RSVP form + live wishes wall ----------
   Submissions POST to a Google Apps Script Web App tied to a Google Sheet
   (see CONFIG.rsvpEndpoint and README.md for the 4-step setup). Each wish
   is also shown instantly in this browser and remembered via localStorage,
   so a guest still sees their own wish if they revisit the page.
------------------------------------------------------------------- */
const WISHES_STORAGE_KEY = "wedding_wishes_local";

function setupRSVP() {
  const form = document.getElementById("rsvpForm");
  const attendanceSelect = document.getElementById("rsvpAttendance");
  const guestRow = document.getElementById("guestCountRow");
  const status = document.getElementById("rsvpStatus");
  const submitBtn = document.getElementById("rsvpSubmit");

  // show the guest-count field only when attending
  attendanceSelect.addEventListener("change", () => {
    guestRow.classList.toggle("show", attendanceSelect.value === "Attending");
  });

  // repaint any wishes this guest already sent in a previous visit
  loadStoredWishes();

  form.addEventListener("submit", async e => {
    e.preventDefault();
    const name = form.name.value.trim();
    const attendance = form.attendance.value;
    const guests = attendanceSelect.value === "Attending" ? form.guests.value : "0";
    const message = form.message.value.trim();

    if (!name || !attendance || !message) {
      status.textContent = "Please fill in all fields.";
      status.classList.add("error");
      return;
    }

    submitBtn.disabled = true;
    status.classList.remove("error");
    status.textContent = "Sending your RSVP…";

    const payload = { name, attendance, guests, message, timestamp: new Date().toISOString() };

    try {
      if (CONFIG.rsvpEndpoint && !CONFIG.rsvpEndpoint.startsWith("PASTE_")) {
        // no-cors: Apps Script web apps don't return CORS headers, so the
        // response is opaque — we just fire-and-forget and trust the sheet.
        await fetch(CONFIG.rsvpEndpoint, {
          method: "POST",
          mode: "no-cors",
          headers: { "Content-Type": "text/plain" },
          body: JSON.stringify(payload)
        });
      }
      status.textContent = "Thank you! Your RSVP has been received. 🤍";
      addWishToWall(payload, true);
      form.reset();
      guestRow.classList.remove("show");
    } catch (err) {
      status.textContent = "Something went wrong — please try again.";
      status.classList.add("error");
    } finally {
      submitBtn.disabled = false;
    }
  });
}

function addWishToWall(payload, persist) {
  const list = document.getElementById("wishesList");
  const empty = document.getElementById("wishesEmpty");
  if (empty) empty.remove();

  const item = document.createElement("div");
  item.className = "wish-item";
  const statusLabel = payload.attendance === "Attending"
    ? `Attending · ${payload.guests || 1} guest(s)`
    : "Can't make it";
  item.innerHTML = `
    <span class="wish-name">${escapeHtml(payload.name)}</span>
    <span class="wish-status">${escapeHtml(statusLabel)}</span>
    <p class="wish-text">${escapeHtml(payload.message)}</p>
  `;
  list.prepend(item);

  if (persist) {
    const stored = JSON.parse(localStorage.getItem(WISHES_STORAGE_KEY) || "[]");
    stored.unshift(payload);
    localStorage.setItem(WISHES_STORAGE_KEY, JSON.stringify(stored.slice(0, 20)));
  }
}

function loadStoredWishes() {
  try {
    const stored = JSON.parse(localStorage.getItem(WISHES_STORAGE_KEY) || "[]");
    stored.slice().reverse().forEach(w => addWishToWall(w, false));
  } catch (e) {
    /* ignore malformed local data */
  }
}

function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}
