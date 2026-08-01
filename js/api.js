/**
 * Stats, reviews, and portfolio are never hardcoded here, they're fetched
 * from the backend (api/*.js -> api/_data.js) at runtime so the raw data
 * never ships inside index.html/js source.
 */
const API_BASE = "/api";

const STAT_ICONS = [
  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M7 5v14M17 5v14M3 9.5h4M3 14.5h4M17 9.5h4M17 14.5h4"/></svg>',
  '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l2.9 6.6 7.1.6-5.4 4.7 1.6 7-6.2-3.8L6 21l1.6-7L2.2 9.2l7.1-.6L12 2z"/></svg>',
  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg>',
  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 3"/></svg>',
  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M17 2l4 4-4 4M3 11V9a4 4 0 0 1 4-4h14M7 22l-4-4 4-4M21 13v2a4 4 0 0 1-4 4H3"/></svg>',
];

const PORTFOLIO_BATCH_SIZE = 6;
let portfolioItems = [];
let portfolioRenderedCount = 0;
let portfolioVideoObserver = null;
let activePortfolioVideo = null;

document.addEventListener("DOMContentLoaded", () => {
  loadStats();
  loadReviews();
  loadPortfolio();
});

async function loadStats() {
  const grid = document.getElementById("statsGrid");
  try {
    const res = await fetch(`${API_BASE}/stats`);
    if (!res.ok) throw new Error("Failed to load stats");
    const stats = await res.json();
    renderStats(grid, stats);
  } catch (err) {
    grid.dataset.state = "error";
    grid.innerHTML = `<p style="color:#fff;opacity:.7;grid-column:1/-1;">Stats are temporarily unavailable.</p>`;
  }
}

function renderStats(grid, stats) {
  grid.dataset.state = "ready";
  grid.innerHTML = stats
    .map(
      (stat, i) => `
      <div data-aos="zoom-in" data-aos-delay="${i * 80}">
        <div class="stat-icon">${STAT_ICONS[i % STAT_ICONS.length]}</div>
        <div class="stat-value" data-value="${stat.value}" data-suffix="${stat.suffix || ""}">0</div>
        <div class="stat-label">${escapeHTML(stat.label)}</div>
      </div>`
    )
    .join("");

  animateStatValues(grid);
  refreshAOS();
}

function animateStatValues(grid) {
  const values = grid.querySelectorAll(".stat-value");
  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        countUp(entry.target);
        obs.unobserve(entry.target);
      });
    },
    { threshold: 0.4 }
  );
  values.forEach((el) => observer.observe(el));
}

function countUp(el) {
  const target = parseFloat(el.dataset.value);
  const suffix = el.dataset.suffix || "";
  const isDecimal = target % 1 !== 0;
  const duration = 1200;
  const start = performance.now();

  function tick(now) {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = target * eased;
    el.textContent = (isDecimal ? current.toFixed(1) : Math.round(current)) + suffix;
    if (progress < 1) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}

async function loadReviews() {
  const grid = document.getElementById("testimonialsGrid");
  try {
    const res = await fetch(`${API_BASE}/reviews`);
    if (!res.ok) throw new Error("Failed to load reviews");
    const reviews = await res.json();
    renderReviews(grid, reviews);
  } catch (err) {
    grid.dataset.state = "error";
    grid.innerHTML = `<p style="color:var(--color-text-muted);grid-column:1/-1;">Reviews are temporarily unavailable.</p>`;
  }
}

function renderReviews(grid, reviews) {
  grid.dataset.state = "ready";
  grid.innerHTML = reviews
    .map(
      (review, i) => `
      <div class="card testimonial-card" data-aos="fade-up" data-aos-delay="${i * 80}">
        ${starRating(review.rating)}
        <p class="testimonial-quote">"${escapeHTML(review.quote)}"</p>
        ${review.result ? `<div class="testimonial-result">↑ ${escapeHTML(review.result)}</div>` : ""}
        <div class="testimonial-person">
          <div class="testimonial-avatar">
            ${initials(review.name)}
            ${review.avatar ? `<img src="assets/images/${encodeURIComponent(review.avatar)}" alt="${escapeHTML(review.name)}" onerror="this.remove()" />` : ""}
          </div>
          <div>
            <div class="testimonial-name">${escapeHTML(review.name)}</div>
            <div class="testimonial-role">${escapeHTML(review.role)}</div>
          </div>
        </div>
      </div>`
    )
    .join("");

  refreshAOS();
}

async function loadPortfolio() {
  const grid = document.getElementById("portfolioGrid");
  const moreBtn = document.getElementById("portfolioMoreBtn");
  try {
    // Fetched fresh (no-store) on every page load; the backend shuffles the
    // order each time, so the first batch shown isn't always the same clips.
    const res = await fetch(`${API_BASE}/portfolio`, { cache: "no-store" });
    if (!res.ok) throw new Error("Failed to load portfolio");
    portfolioItems = await res.json();

    grid.dataset.state = "ready";
    grid.innerHTML = "";
    portfolioRenderedCount = 0;
    initPortfolioInteractions();
    renderNextPortfolioBatch();
    moreBtn.addEventListener("click", renderNextPortfolioBatch);
  } catch (err) {
    grid.dataset.state = "error";
    grid.innerHTML = `<p style="color:var(--color-text-muted);grid-column:1/-1;">Portfolio is temporarily unavailable.</p>`;
  }
}

function renderNextPortfolioBatch() {
  const grid = document.getElementById("portfolioGrid");
  const moreWrap = document.getElementById("portfolioMoreWrap");
  const nextItems = portfolioItems.slice(portfolioRenderedCount, portfolioRenderedCount + PORTFOLIO_BATCH_SIZE);

  nextItems.forEach((item, i) => {
    const el = document.createElement("div");
    el.className = "portfolio-item";
    el.setAttribute("data-aos", "fade-up");
    el.setAttribute("data-aos-delay", String((i % 3) * 60));
    el.innerHTML = `
      <video muted loop playsinline preload="metadata">
        <source src="assets/videos/${encodeURIComponent(item.src)}" type="video/mp4" />
      </video>
      <div class="portfolio-overlay"></div>
      <div class="portfolio-caption">
        <div class="badge">${escapeHTML(item.category)}</div>
        <div>${escapeHTML(item.caption)}</div>
      </div>`;
    grid.appendChild(el);
    observePortfolioVideo(el.querySelector("video"), el);
  });

  portfolioRenderedCount += nextItems.length;
  moreWrap.style.display = portfolioRenderedCount < portfolioItems.length ? "flex" : "none";
  refreshAOS();
}

function initPortfolioInteractions() {
  // Auto-pause a playing clip once it's scrolled mostly out of view.
  portfolioVideoObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting && !entry.target.paused) {
          pausePortfolioVideo(entry.target);
        }
      });
    },
    { threshold: 0.25 }
  );
}

function observePortfolioVideo(video, item) {
  portfolioVideoObserver.observe(video);

  item.addEventListener("click", () => {
    if (video.paused) {
      if (activePortfolioVideo && activePortfolioVideo !== video) {
        pausePortfolioVideo(activePortfolioVideo);
      }
      video.muted = false;
      video.play();
      item.classList.add("is-playing");
      activePortfolioVideo = video;
    } else {
      pausePortfolioVideo(video);
    }
  });

  video.addEventListener("ended", () => pausePortfolioVideo(video));
}

function pausePortfolioVideo(video) {
  video.pause();
  video.muted = true;
  const item = video.closest(".portfolio-item");
  if (item) item.classList.remove("is-playing");
  if (activePortfolioVideo === video) activePortfolioVideo = null;
}

function starRating(rating) {
  const full = Math.round(rating);
  let out = '<div class="stars" aria-label="' + rating + ' out of 5 stars">';
  for (let i = 0; i < 5; i++) {
    out += `<span class="${i < full ? "" : "star-empty"}">★</span>`;
  }
  out += "</div>";
  return out;
}

function initials(name) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function escapeHTML(str) {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}

function refreshAOS() {
  if (window.AOS) AOS.refreshHard();
}
