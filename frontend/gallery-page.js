// gallery-page.js — makes gallery.html fetch real items from API
// Add after api.js: <script src="/js/gallery-page.js"></script>

(async function () {
  let allItems = [];
  let currentCat = "all";
  let currentIdx = 0;

  async function loadGallery(cat) {
    try {
      allItems = await RA.Gallery.getAll(cat);
    } catch (err) {
      console.error("Gallery load error:", err.message);
      RA.showToast("Could not load gallery.", "error");
      return;
    }
    renderGallery(allItems);
  }

  // ── Initial load ──
  await loadGallery("all");

  // ── Filter buttons ──
  document.querySelectorAll(".gal-filter").forEach((btn) => {
    btn.addEventListener("click", async () => {
      document.querySelectorAll(".gal-filter").forEach((b) => {
        b.classList.remove(
          "active",
          "bg-primary",
          "text-white",
          "border-primary",
        );
        b.classList.add("bg-white", "text-gray-600", "border-gray-200");
      });
      btn.classList.add("active", "bg-primary", "text-white", "border-primary");
      btn.classList.remove("bg-white", "text-gray-600", "border-gray-200");

      currentCat = btn.dataset.cat || "all";
      await loadGallery(currentCat);
    });
  });

  function renderGallery(items) {
    const grid = document.getElementById("galleryGrid");
    const empty = document.getElementById("galEmpty");
    const countEl = document.getElementById("galleryCount");

    if (countEl) countEl.textContent = items.length;

    if (!items.length) {
      if (grid) grid.innerHTML = "";
      if (empty) empty.classList.remove("hidden");
      return;
    }
    if (empty) empty.classList.add("hidden");

    if (!grid) return;

    grid.innerHTML = items
      .map((item, idx) => {
        const img = item.imageUrls?.[0] || "";
        return `
        <div class="gal-item group relative overflow-hidden rounded-2xl cursor-pointer shadow-sm hover:shadow-xl transition-all duration-300 bg-gray-100"
             onclick="openLightbox(${idx})" style="animation-delay:${idx * 50}ms;break-inside:avoid;margin-bottom:14px;">
          <img src="${img}" alt="${item.title}" class="w-full object-cover group-hover:scale-107 transition-transform duration-500"/>
          <div class="overlay absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent rounded-2xl flex flex-col justify-end p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <span class="font-sub text-[10px] text-white/70 uppercase tracking-wider mb-1 capitalize">${item.cat}</span>
            <h3 class="font-main text-white text-sm leading-tight mb-2">${item.title}</h3>
            <div class="flex items-center gap-2">
              <span class="bg-white/20 backdrop-blur-sm text-white font-sub text-xs px-2.5 py-1 rounded-lg flex items-center gap-1">
                <i class="fas fa-eye text-[9px]"></i> View
              </span>
              <a href="https://wa.me/9779823939106" onclick="event.stopPropagation()" target="_blank"
                 class="bg-green-600/90 text-white font-sub text-xs px-2.5 py-1 rounded-lg flex items-center gap-1 hover:bg-green-600 transition">
                <i class="fa-brands fa-whatsapp text-[10px]"></i> Order
              </a>
            </div>
          </div>
        </div>`;
      })
      .join("");

    // attach global lightbox openers
    window.openLightbox = (idx) => {
      currentIdx = idx;
      updateLightbox();
      const lb = document.getElementById("lightbox");
      if (!lb) return;
      lb.classList.remove("hidden");
      lb.classList.add("flex");
      setTimeout(() => (lb.style.opacity = "1"), 10);
      document.body.style.overflow = "hidden";
    };
  }

  function updateLightbox() {
    const item = allItems[currentIdx];
    if (!item) return;
    const img = item.imageUrls?.[0] || "";
    const lbImg = document.getElementById("lbImg");
    if (lbImg) {
      lbImg.style.opacity = "0";
      setTimeout(() => {
        lbImg.src = img;
        lbImg.style.opacity = "1";
        lbImg.style.transition = "opacity .3s";
      }, 150);
    }
    const t = document.getElementById("lbTitle");
    if (t) t.textContent = item.title;
    const d = document.getElementById("lbDesc");
    if (d) d.textContent = item.description || "";
    const c = document.getElementById("lbCat");
    if (c) c.textContent = "📦 " + item.cat;
    const cnt = document.getElementById("lbCounter");
    if (cnt) cnt.textContent = `${currentIdx + 1} / ${allItems.length}`;
  }

  // Wire existing lightbox next/prev/close (they call closeLB, nextLB, prevLB globally)
  window.closeLB = () => {
    const lb = document.getElementById("lightbox");
    if (!lb) return;
    lb.style.opacity = "0";
    setTimeout(() => {
      lb.classList.add("hidden");
      lb.classList.remove("flex");
    }, 300);
    document.body.style.overflow = "";
  };
  window.nextLB = () => {
    currentIdx = (currentIdx + 1) % allItems.length;
    updateLightbox();
  };
  window.prevLB = () => {
    currentIdx = (currentIdx - 1 + allItems.length) % allItems.length;
    updateLightbox();
  };

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") window.closeLB?.();
    if (e.key === "ArrowRight") window.nextLB?.();
    if (e.key === "ArrowLeft") window.prevLB?.();
  });
})();
