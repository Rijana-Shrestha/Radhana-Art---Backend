// product-page.js — makes product.html fetch real products from API
// Add after api.js: <script src="/js/product-page.js"></script>

(async function () {
  // ── Read URL params (same keys the frontend already uses) ──
  const params = new URLSearchParams(window.location.search);
  const apiQuery = {};

  if (params.get("type")) apiQuery.type = params.get("type");
  if (params.get("cat")) apiQuery.cat = params.get("cat");
  if (params.get("for")) apiQuery.forWho = params.get("for");
  if (params.get("festival")) apiQuery.festival = params.get("festival");
  if (params.get("occ")) apiQuery.occ = params.get("occ");
  if (params.get("maxprice")) apiQuery.maxprice = params.get("maxprice");
  if (params.get("q")) apiQuery.q = params.get("q");
  if (params.get("min")) apiQuery.min = params.get("min");
  if (params.get("max")) apiQuery.max = params.get("max");

  let allProducts = [];

  try {
    allProducts = await RA.Products.getAll(apiQuery);
  } catch (err) {
    console.error("Failed to load products:", err.message);
    RA.showToast("Could not load products. Please try again.", "error");
    return;
  }

  // ── Render ──
  renderProductGrid(allProducts);
  updateProductCount(allProducts.length);
  RA.updateCartBadges();

  // ── Sort select ──
  const sortSelect = document.getElementById("sortSelect");
  if (sortSelect) {
    sortSelect.addEventListener("change", () => {
      const sorted = sortProducts([...allProducts], sortSelect.value);
      renderProductGrid(sorted);
    });
  }

  // ── Header search (product page inline search) ──
  const headerSearch = document.getElementById("headerSearch");
  if (headerSearch && headerSearch.value) {
    apiQuery.q = headerSearch.value;
  }

  // ── Price quick-select ──
  document.querySelectorAll(".price-quick").forEach((btn) => {
    btn.addEventListener("click", () => {
      const min = btn.dataset.min || 0;
      const max = btn.dataset.max || 999999;
      const filtered = allProducts.filter(
        (p) => p.price >= Number(min) && p.price <= Number(max),
      );
      renderProductGrid(filtered);
      updateProductCount(filtered.length);
    });
  });

  // ── Category checkboxes ──
  document.querySelectorAll(".cat-check").forEach((cb) => {
    cb.addEventListener("change", () => applyCheckboxFilters(allProducts));
  });

  // ── For-whom checkboxes ──
  document.querySelectorAll(".for-check").forEach((cb) => {
    cb.addEventListener("change", () => applyCheckboxFilters(allProducts));
  });

  // ── In-stock filter ──
  const inStockCb = document.getElementById("inStock");
  if (inStockCb)
    inStockCb.addEventListener("change", () =>
      applyCheckboxFilters(allProducts),
    );

  function applyCheckboxFilters(products) {
    const selectedCats = [
      ...document.querySelectorAll(".cat-check:checked"),
    ].map((c) => c.value);
    const selectedFor = [
      ...document.querySelectorAll(".for-check:checked"),
    ].map((c) => c.value);
    const stockOnly = document.getElementById("inStock")?.checked;

    let filtered = products;
    if (selectedCats.length)
      filtered = filtered.filter((p) => selectedCats.includes(p.category));
    if (selectedFor.length)
      filtered = filtered.filter((p) =>
        selectedFor.some((w) => (p.forWho || []).includes(w)),
      );
    if (stockOnly) filtered = filtered.filter((p) => p.inStock);

    renderProductGrid(filtered);
    updateProductCount(filtered.length);
  }

  // ── Clear all filters ──
  const clearBtn = document.querySelector("[onclick='clearAllFilters()']");
  if (clearBtn) {
    clearBtn.removeAttribute("onclick");
    clearBtn.addEventListener("click", () => {
      document
        .querySelectorAll(".cat-check, .for-check")
        .forEach((c) => (c.checked = false));
      const inStockEl = document.getElementById("inStock");
      if (inStockEl) inStockEl.checked = false;
      renderProductGrid(allProducts);
      updateProductCount(allProducts.length);
    });
  }
})();

// ── Sort helper ──
function sortProducts(list, method) {
  switch (method) {
    case "popular":
      return list.sort((a, b) => (b.popular ? 1 : 0) - (a.popular ? 1 : 0));
    case "price-asc":
      return list.sort((a, b) => a.price - b.price);
    case "price-desc":
      return list.sort((a, b) => b.price - a.price);
    case "name-asc":
      return list.sort((a, b) => a.name.localeCompare(b.name));
    case "rating":
      return list.sort((a, b) => b.stars - a.stars);
    case "newest":
      return list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    default:
      return list;
  }
}

function updateProductCount(n) {
  const el = document.getElementById("productCount");
  if (el) el.textContent = n;
}

function renderProductGrid(products) {
  const grid = document.getElementById("productGrid");
  const empty = document.getElementById("emptyState");
  const lmWrap = document.getElementById("loadMoreWrap");
  if (!grid) return;

  if (!products.length) {
    grid.innerHTML = "";
    if (empty) empty.classList.remove("hidden");
    if (lmWrap) lmWrap.classList.add("hidden");
    return;
  }

  if (empty) empty.classList.add("hidden");
  if (lmWrap) lmWrap.classList.add("hidden"); // hide load more (all loaded from API)

  grid.innerHTML = products.map((p, idx) => gridCard(p, idx)).join("");
}

function gridCard(p, idx) {
  const stars = Array.from(
    { length: 5 },
    (_, i) =>
      `<i class="fas fa-star text-xs ${i < (p.stars || 5) ? "text-amber-400" : "text-gray-200"}"></i>`,
  ).join("");

  const badge = p.badge
    ? `<span class="absolute top-3 left-3 bg-green-500 text-white text-[11px] font-sub font-bold px-2.5 py-1 rounded-full shadow">${p.badge}</span>`
    : "";

  const outOfStock = !p.inStock
    ? `<span class="absolute top-3 right-3 bg-gray-500 text-white text-[10px] font-sub px-2 py-0.5 rounded-full">Out of Stock</span>`
    : "";

  const img =
    p.imageUrls && p.imageUrls[0]
      ? p.imageUrls[0]
      : "https://images.unsplash.com/photo-1582269847642-87432658c952?q=80&w=600&auto=format&fit=crop";

  return `
  <div class="prod-card bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group hover:-translate-y-1.5 flex flex-col" style="animation-delay:${idx * 50}ms">
    <div class="relative overflow-hidden flex-shrink-0">
      <img src="${img}" alt="${p.name}" class="w-full h-52 object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy"/>
      ${badge}${outOfStock}
      <button onclick="openQuickView('${p._id}')"
        class="absolute bottom-3 right-3 bg-white/90 backdrop-blur-sm text-primary hover:bg-primary hover:text-white font-sub text-xs font-medium px-3 py-1.5 rounded-xl transition-all opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 shadow">
        <i class="fas fa-eye mr-1"></i> Quick View
      </button>
    </div>
    <div class="p-5 flex flex-col flex-1">
      <h3 class="font-main text-[16px] text-primary mb-1 group-hover:text-secondary transition-colors line-clamp-1">${p.name}</h3>
      <p class="font-sub text-gray-400 text-xs leading-relaxed mb-2 line-clamp-2 flex-1">${p.description || ""}</p>
      <div class="flex items-center gap-1.5 mb-3">
        ${stars}
        <span class="font-sub text-xs text-gray-400">(${p.reviews || 0})</span>
      </div>
      <div class="flex items-end justify-between mb-3">
        <div>
          <p class="font-sub text-gray-400 text-[10px]">Starting from</p>
          <p class="font-sub text-secondary font-bold text-xl">Rs. ${(p.price || 0).toLocaleString()}</p>
          ${p.maxPrice ? `<p class="font-sub text-gray-300 text-[10px]">Up to Rs. ${p.maxPrice.toLocaleString()}</p>` : ""}
        </div>
        <span class="font-sub text-[10px] text-gray-400 bg-gray-50 border border-gray-100 px-2 py-1 rounded-lg capitalize">${p.category}</span>
      </div>
      <div class="grid grid-cols-2 gap-2">
        <button onclick="${p.inStock ? `RA.addToCart('${p._id}','${p.name.replace(/'/g, "\\'")}',${p.price},'${img}'); RA.showToast('Added to cart!')` : "RA.showToast('Out of stock','error')"}"
          class="flex items-center justify-center gap-1.5 ${p.inStock ? "bg-primary hover:bg-secondary" : "bg-gray-300 cursor-not-allowed"} text-white py-2.5 rounded-xl font-sub text-xs font-medium transition-all ${p.inStock ? "hover:shadow-lg" : ""}">
          <i class="fas fa-shopping-cart text-sm"></i> Add to Cart
        </button>
        <a href="https://wa.me/9779823939106?text=Hi! I'm interested in: ${encodeURIComponent(p.name)}" target="_blank"
           class="flex items-center justify-center gap-1.5 bg-green-600 hover:bg-green-700 text-white py-2.5 rounded-xl font-sub text-xs font-medium transition-all hover:shadow-lg">
          <i class="fa-brands fa-whatsapp text-sm"></i> WhatsApp
        </a>
      </div>
    </div>
  </div>`;
}

// Quick View — opens the existing modal and populates it from API
async function openQuickView(id) {
  try {
    const p = await RA.Products.getById(id);
    const modal = document.getElementById("quickView");
    if (!modal) return;

    document.getElementById("qvTitle").textContent = p.name;
    document.getElementById("qvDesc").textContent = p.description || "";
    document.getElementById("qvPrice").textContent =
      "Rs. " + (p.price || 0).toLocaleString();
    document.getElementById("qvCat").textContent = "📦 " + p.category;

    const img =
      p.imageUrls && p.imageUrls[0]
        ? p.imageUrls[0]
        : "https://images.unsplash.com/photo-1582269847642-87432658c952?q=80&w=800";
    document.getElementById("qvImg").src = img;

    const badgeEl = document.getElementById("qvBadge");
    if (badgeEl)
      badgeEl.innerHTML = p.badge
        ? `<span class="bg-green-500 text-white text-xs font-sub font-bold px-3 py-1 rounded-full">${p.badge}</span>`
        : "";

    const starsEl = document.getElementById("qvStars");
    if (starsEl)
      starsEl.innerHTML =
        Array.from(
          { length: 5 },
          (_, i) =>
            `<i class="fas fa-star text-sm ${i < (p.stars || 5) ? "text-amber-400" : "text-gray-200"}"></i>`,
        ).join("") +
        `<span class="font-sub text-xs text-gray-400 ml-1">(${p.reviews || 0})</span>`;

    // Wire up Add to Cart button inside modal
    const addBtn = modal.querySelector("button[onclick='addFromQV()']");
    if (addBtn) {
      addBtn.onclick = () => {
        const qty = parseInt(
          document.getElementById("qvQtyNum")?.textContent || "1",
        );
        for (let i = 0; i < qty; i++) {
          RA.addToCart(p._id, p.name, p.price, img);
        }
        RA.showToast(`"${p.name}" added to cart!`);
        // close modal
        modal.style.opacity = "0";
        setTimeout(() => {
          modal.classList.add("hidden");
          modal.classList.remove("flex");
        }, 300);
        document.body.style.overflow = "";
      };
    }

    modal.classList.remove("hidden");
    modal.classList.add("flex");
    setTimeout(() => (modal.style.opacity = "1"), 10);
    document.body.style.overflow = "hidden";
  } catch (err) {
    RA.showToast("Could not load product details.", "error");
  }
}
