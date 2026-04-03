const btn = document.getElementById('hemburgerbtn');
const menu = document.querySelector('.menu');
btn.addEventListener("click", () => {
    menu.classList.toggle("active")
})

const btnaboutme = document.getElementById('btnaboutme');
const paragraph = document.querySelector('.paragraph-footer');
btnaboutme.addEventListener("click", () => {
    paragraph.classList.toggle("active")
})


// ─────────────────────────────────────────────
//  Portfolio Search — script.js
//  Searches sections: Projects, Skills, Education
// ─────────────────────────────────────────────

document.addEventListener("DOMContentLoaded", () => {

  // ── Hamburger Menu ──────────────────────────
  const hamburgerBtn = document.getElementById("hemburgerbtn");
  const menu = document.querySelector(".menu");

  if (hamburgerBtn && menu) {
    hamburgerBtn.addEventListener("click", () => {
      menu.classList.toggle("open");
      hamburgerBtn.classList.toggle("active");
    });

    // Close menu when a link is clicked
    menu.querySelectorAll("a").forEach(link => {
      link.addEventListener("click", () => {
        menu.classList.remove("open");
        hamburgerBtn.classList.remove("active");
      });
    });
  }

  // ── About Me Footer Toggle ───────────────────
  const aboutBtn = document.getElementById("btnaboutme");
  const footerPara = document.querySelector(".paragraph-footer");

  if (aboutBtn && footerPara) {
    footerPara.style.display = "none";
    aboutBtn.addEventListener("click", () => {
      const isOpen = footerPara.style.display !== "none";
      footerPara.style.display = isOpen ? "none" : "block";
      aboutBtn.textContent = isOpen ? "About me" : "Close";
    });
  }

  // ── Search ───────────────────────────────────
  const searchInput  = document.getElementById("search");
  const searchButton = document.querySelector(".search-submit");

  // Sections and their searchable cards
  const SEARCH_TARGETS = [
    { section: "#Projects",  cards: ".proj-card"  },
    { section: "#Skills",    cards: ".skill-card"  },
    { section: "#education", cards: ".edu-card"    },
  ];

  // Inject result-overlay styles once
  injectSearchStyles();

  // ── Result Overlay ───────────────────────────
  let overlay = null;

  function buildOverlay() {
    if (overlay) overlay.remove();
    overlay = document.createElement("div");
    overlay.id = "search-overlay";
    document.body.appendChild(overlay);

    // Close on backdrop click
    overlay.addEventListener("click", e => {
      if (e.target === overlay) closeOverlay();
    });
  }

  function closeOverlay() {
    if (overlay) {
      overlay.classList.remove("visible");
      setTimeout(() => overlay && overlay.remove(), 300);
      overlay = null;
    }
  }

  // ── Core Search Logic ────────────────────────
  function runSearch() {
    const query = searchInput.value.trim().toLowerCase();
    if (!query) return;

    const results = [];

    SEARCH_TARGETS.forEach(({ section, cards }) => {
      const sectionEl = document.querySelector(section);
      if (!sectionEl) return;

      sectionEl.querySelectorAll(cards).forEach(card => {
        const text = card.innerText.toLowerCase();
        if (text.includes(query)) {
          results.push({ card, section: sectionEl, text: card.innerHTML });
        }
      });
    });

    showResults(query, results);
  }

  function showResults(query, results) {
    buildOverlay();

    const panel = document.createElement("div");
    panel.className = "search-panel";

    const header = document.createElement("div");
    header.className = "search-panel-header";
    header.innerHTML = `
      <span class="search-query">Results for "<em>${escapeHtml(query)}</em>"</span>
      <span class="search-count">${results.length} found</span>
      <button class="search-close" aria-label="Close">✕</button>
    `;
    header.querySelector(".search-close").addEventListener("click", closeOverlay);
    panel.appendChild(header);

    if (results.length === 0) {
      const empty = document.createElement("div");
      empty.className = "search-empty";
      empty.innerHTML = `<span>No results found for "<strong>${escapeHtml(query)}</strong>"</span>`;
      panel.appendChild(empty);
    } else {
      const list = document.createElement("ul");
      list.className = "search-results-list";

      results.forEach(({ card, section }) => {
        const li = document.createElement("li");
        li.className = "search-result-item";

        // Title: first heading or first line
        const heading  = card.querySelector("h2, h3, span.skill-name, span.proj-num");
        const subline  = card.querySelector("p");
        const sectionLabel = section.querySelector("h1")?.textContent || "";

        li.innerHTML = `
          <div class="result-section-tag">${escapeHtml(sectionLabel)}</div>
          <div class="result-title">${heading ? highlight(heading.innerText, query) : "—"}</div>
          ${subline ? `<div class="result-sub">${highlight(subline.innerText.slice(0, 100), query)}…</div>` : ""}
        `;

        li.addEventListener("click", () => {
          closeOverlay();
          setTimeout(() => {
            card.scrollIntoView({ behavior: "smooth", block: "center" });
            card.classList.add("search-highlight-pulse");
            setTimeout(() => card.classList.remove("search-highlight-pulse"), 1800);
          }, 320);
        });

        list.appendChild(li);
      });

      panel.appendChild(list);
    }

    overlay.appendChild(panel);
    requestAnimationFrame(() => overlay.classList.add("visible"));
  }

  // ── Highlight matched text ───────────────────
  function highlight(text, query) {
    const safe  = escapeHtml(text);
    const regex = new RegExp(`(${escapeRegex(query)})`, "gi");
    return safe.replace(regex, `<mark class="search-mark">$1</mark>`);
  }

  function escapeHtml(str) {
    return str
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  }

  function escapeRegex(str) {
    return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  }

  // ── Event Listeners ──────────────────────────
  searchButton?.addEventListener("click", runSearch);

  searchInput?.addEventListener("keydown", e => {
    if (e.key === "Enter") runSearch();
    if (e.key === "Escape") closeOverlay();
  });

  // ── Injected Styles ──────────────────────────
  function injectSearchStyles() {
    const style = document.createElement("style");
    style.textContent = `
      /* Overlay backdrop */
      #search-overlay {
        position: fixed;
        inset: 0;
        background: rgba(0, 0, 0, 0.65);
        backdrop-filter: blur(4px);
        z-index: 9999;
        display: flex;
        align-items: flex-start;
        justify-content: center;
        padding-top: 80px;
        opacity: 0;
        transition: opacity 0.3s ease;
      }
      #search-overlay.visible { opacity: 1; }

      /* Panel */
      .search-panel {
        background: #0f1a16;
        border: 1px solid #1D9E75;
        border-radius: 12px;
        width: min(560px, 92vw);
        max-height: 75vh;
        display: flex;
        flex-direction: column;
        overflow: hidden;
        box-shadow: 0 0 40px rgba(29, 158, 117, 0.2);
        transform: translateY(-12px);
        transition: transform 0.3s ease;
        font-family: inherit;
      }
      #search-overlay.visible .search-panel { transform: translateY(0); }

      /* Panel header */
      .search-panel-header {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 16px 20px;
        border-bottom: 1px solid rgba(29, 158, 117, 0.25);
      }
      .search-query {
        flex: 1;
        color: #cce9df;
        font-size: 0.9rem;
      }
      .search-query em { color: #1D9E75; font-style: normal; font-weight: 600; }
      .search-count {
        background: rgba(29, 158, 117, 0.15);
        color: #1D9E75;
        font-size: 0.75rem;
        padding: 3px 10px;
        border-radius: 20px;
        border: 1px solid rgba(29, 158, 117, 0.4);
      }
      .search-close {
        background: none;
        border: none;
        color: #6aaa90;
        font-size: 1rem;
        cursor: pointer;
        padding: 4px 8px;
        border-radius: 6px;
        transition: color 0.2s, background 0.2s;
      }
      .search-close:hover { color: #fff; background: rgba(255,255,255,0.08); }

      /* Results list */
      .search-results-list {
        list-style: none;
        margin: 0;
        padding: 8px 0;
        overflow-y: auto;
        scrollbar-width: thin;
        scrollbar-color: #1D9E75 transparent;
      }
      .search-result-item {
        padding: 14px 20px;
        cursor: pointer;
        border-left: 3px solid transparent;
        transition: background 0.2s, border-color 0.2s;
      }
      .search-result-item:hover {
        background: rgba(29, 158, 117, 0.08);
        border-left-color: #1D9E75;
      }
      .result-section-tag {
        font-size: 0.68rem;
        text-transform: uppercase;
        letter-spacing: 0.12em;
        color: #1D9E75;
        margin-bottom: 4px;
      }
      .result-title {
        color: #e8f5ef;
        font-size: 0.95rem;
        font-weight: 600;
        margin-bottom: 4px;
      }
      .result-sub {
        color: #7aa899;
        font-size: 0.82rem;
        line-height: 1.5;
      }

      /* Empty state */
      .search-empty {
        padding: 40px 20px;
        text-align: center;
        color: #6aaa90;
        font-size: 0.9rem;
      }

      /* Highlight mark */
      .search-mark {
        background: rgba(29, 158, 117, 0.3);
        color: #1D9E75;
        border-radius: 3px;
        padding: 0 2px;
        font-weight: 600;
      }

      /* Pulse animation on matched card */
      @keyframes searchPulse {
        0%   { outline: 2px solid transparent; }
        30%  { outline: 2px solid #1D9E75; box-shadow: 0 0 16px rgba(29,158,117,0.4); }
        100% { outline: 2px solid transparent; box-shadow: none; }
      }
      .search-highlight-pulse {
        animation: searchPulse 1.8s ease forwards;
        border-radius: 8px;
      }
    `;
    document.head.appendChild(style);
  }

});


// ── Smooth Scroll for Anchor Links ──────────────
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener("click", function (e) {
    const href = this.getAttribute("href");

    // Ignore empty or just "#" links
    if (!href || href === "#") return;

    const target = document.querySelector(href);
    if (!target) return;

    e.preventDefault();

    target.scrollIntoView({
      behavior: "smooth",
      block: "start"
    });
  });
});