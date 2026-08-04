/* =========================================================
   DECORATIVE ASSET ANIMATOR
   Scans the page for any <img class="decor-asset" data-animate="...">
   and wires it up — no manual wrapper markup needed, even for orbit.

   Attributes you can set on the <img> tag:
     data-animate   "shake" | "flutter" | "float" | "circle"   (required)
     data-duration  e.g. "1.8s", "12s"                          (optional)
     data-radius    orbit radius in px, e.g. "70"  (circle only)(optional)
     data-direction "reverse"                       (circle only)(optional)

   Example:
     <img src="images/decor-bird.png" class="decor-asset"
          data-animate="circle" data-radius="80" data-duration="14s">
   ========================================================= */

document.addEventListener("DOMContentLoaded", initDecorAnimations);

function initDecorAnimations() {
  document.querySelectorAll(".decor-asset[data-animate]").forEach(img => {
    const type = img.dataset.animate;
    const duration = img.dataset.duration;

    if (type === "circle") {
      setupOrbit(img, duration, img.dataset.radius, img.dataset.direction);
    } else if (type === "shake" || type === "flutter" || type === "float") {
      if (duration) img.style.setProperty("--decor-duration", duration);
    }
  });
}

function setupOrbit(img, duration, radius, direction) {
  const r = radius ? `${parseFloat(radius)}px` : null;

  // build: anchor > spin > img   (anchor takes the img's original spot)
  const anchor = document.createElement("div");
  anchor.className = "decor-orbit-anchor";

  const spin = document.createElement("div");
  spin.className = "decor-orbit-spin" + (direction === "reverse" ? " reverse" : "");
  if (duration) spin.style.setProperty("--decor-duration", duration);
  if (r) spin.style.setProperty("--decor-radius", r);

  img.parentNode.insertBefore(anchor, img);
  anchor.appendChild(spin);
  spin.appendChild(img);
}
