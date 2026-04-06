(async function () {
  // ── Guard: admin only ──
  const user = await RA.requireAdmin();
  if (!user) return;

  // ── Show admin name in sidebar ──
  document
    .querySelectorAll(".admin-name")
    .forEach((el) => (el.textContent = user.name));

  // ── Load dashboard data on init ──
  await loadDashboardStats();
  await loadRecentOrders();
  await loadAllOrders();
  await loadAdminProducts();
  await loadCustomers();
  await loadContacts();

  // ─────────────────────────────────────────────────────
  //  DASHBOARD STATS
  // ─────────────────────────────────────────────────────
  async function loadDashboardStats() {
    try {
      const [orders, customers, products] = await Promise.all([
        RA.Orders.getAll(),
        RA.Users.getAll(),
        RA.Products.getAll(),
      ]);

      const totalRevenue = orders.reduce((s, o) => s + (o.totalPrice || 0), 0);

      setText("stat-orders", orders.length);
      setText("stat-revenue", "Rs. " + totalRevenue.toLocaleString());
      setText("stat-customers", customers.length);
      setText("stat-products", products.length);
    } catch (err) {
      console.error("Stats error:", err.message);
    }
  }

  // ─────────────────────────────────────────────────────
  //  RECENT ORDERS (dashboard tab)
  // ─────────────────────────────────────────────────────
  async function loadRecentOrders() {
    try {
      const orders = await RA.Orders.getAll();
      const tbody = document.getElementById("dashRecentOrders");
      if (!tbody) return;

      tbody.innerHTML = orders
        .slice(0, 5)
        .map(
          (o) => `
        <tr>
          <td class="font-semibold text-primary">${o.orderNumber || o._id}</td>
          <td>${o.user?.name || "Guest"}</td>
          <td class="font-semibold text-gray-800">Rs. ${(o.totalPrice || 0).toLocaleString()}</td>
          <td>${statusBadge(o.status)}</td>
          <td>
            <button onclick="viewOrderModal('${o._id}')" class="font-sub text-xs text-primary hover:text-secondary transition font-medium">View</button>
          </td>
        </tr>`,
        )
        .join("");
    } catch (err) {
      console.error("Recent orders error:", err.message);
    }
  }

  // ─────────────────────────────────────────────────────
  //  ALL ORDERS (orders tab)
  // ─────────────────────────────────────────────────────
  async function loadAllOrders(filter = "") {
    try {
      const orders = await RA.Orders.getAll();
      const filtered = filter
        ? orders.filter(
            (o) =>
              o.status === filter ||
              (o.user?.name || "")
                .toLowerCase()
                .includes(filter.toLowerCase()) ||
              (o.orderNumber || "").includes(filter),
          )
        : orders;

      setText("orderShowing", filtered.length);
      setText("orderTotal", orders.length);

      const tbody = document.getElementById("allOrdersTable");
      if (!tbody) return;

      tbody.innerHTML = filtered
        .map(
          (o) => `
        <tr>
          <td class="font-semibold text-primary">${o.orderNumber || o._id}</td>
          <td>
            <div class="font-medium text-gray-800">${o.user?.name || "Guest"}</div>
            <div class="text-xs text-gray-400">${o.user?.phone || ""}</div>
          </td>
          <td class="text-gray-600 text-xs">${(o.orderItems || []).map((i) => i.product?.name || "Item").join(", ")}</td>
          <td class="text-gray-500 text-xs">${new Date(o.createdAt).toLocaleDateString()}</td>
          <td class="font-semibold text-gray-800">Rs. ${(o.totalPrice || 0).toLocaleString()}</td>
          <td>${statusBadge(o.status)}</td>
          <td>
            <div class="flex gap-2">
              <button onclick="viewOrderModal('${o._id}')" class="p-1.5 text-primary hover:bg-blue-50 rounded-lg transition" title="View"><i class="fas fa-eye text-sm"></i></button>
              <select onchange="updateOrderStatus('${o._id}', this.value)" class="text-xs border border-gray-200 rounded-lg px-1 py-1 focus:outline-none focus:border-primary">
                <option value="">Change Status</option>
                <option value="PENDING">Pending</option>
                <option value="CONFIRMED">Confirmed</option>
                <option value="SHIPPED">Shipped</option>
                <option value="DELIVERED">Delivered</option>
              </select>
              <button onclick="deleteOrderAdmin('${o._id}')" class="p-1.5 text-red-400 hover:bg-red-50 rounded-lg transition" title="Delete"><i class="fas fa-trash text-sm"></i></button>
            </div>
          </td>
        </tr>`,
        )
        .join("");
    } catch (err) {
      console.error("All orders error:", err.message);
    }
  }

  window.updateOrderStatus = async (id, status) => {
    if (!status) return;
    try {
      await RA.Orders.updateStatus(id, status);
      RA.showToast("Order status updated!");
      await loadAllOrders();
      await loadRecentOrders();
    } catch (err) {
      RA.showToast(err.message, "error");
    }
  };

  window.deleteOrderAdmin = async (id) => {
    if (!confirm("Delete this order?")) return;
    try {
      await RA.Orders.delete(id);
      RA.showToast("Order deleted.");
      await loadAllOrders();
    } catch (err) {
      RA.showToast(err.message, "error");
    }
  };

  window.viewOrderModal = async (id) => {
    try {
      const o = await RA.Orders.getById(id);
      const modal = document.getElementById("orderModal");
      const title = document.getElementById("orderModalTitle");
      const body = document.getElementById("orderModalBody");
      if (!modal || !body) return;
      if (title) title.textContent = `Order ${o.orderNumber || o._id}`;
      body.innerHTML = `
        <div class="space-y-3 font-sub text-sm">
          <div class="flex justify-between"><span class="text-gray-500">Customer:</span><strong>${o.user?.name || "Guest"}</strong></div>
          <div class="flex justify-between"><span class="text-gray-500">Phone:</span><span>${o.user?.phone || o.shippingAddress?.phone || ""}</span></div>
          <div class="flex justify-between"><span class="text-gray-500">Date:</span><span>${new Date(o.createdAt).toLocaleDateString()}</span></div>
          <div class="flex justify-between"><span class="text-gray-500">Amount:</span><strong class="text-secondary">Rs. ${(o.totalPrice || 0).toLocaleString()}</strong></div>
          <div class="flex justify-between"><span class="text-gray-500">Payment:</span><span>${o.paymentMethod || "COD"}</span></div>
          <div class="flex justify-between items-center"><span class="text-gray-500">Status:</span>${statusBadge(o.status)}</div>
          ${o.orderNotes ? `<div class="flex justify-between"><span class="text-gray-500">Notes:</span><span>${o.orderNotes}</span></div>` : ""}
          ${o.designFileUrl ? `<div class="flex justify-between"><span class="text-gray-500">Design:</span><a href="${o.designFileUrl}" target="_blank" class="text-primary hover:underline">View File</a></div>` : ""}
        </div>
        <div class="mt-4">
          <p class="font-sub text-xs text-gray-500 font-semibold mb-2">Items:</p>
          ${(o.orderItems || [])
            .map(
              (i) => `
            <div class="flex items-center gap-3 bg-gray-50 rounded-xl p-2 mb-2">
              <img src="${i.product?.imageUrls?.[0] || ""}" class="w-10 h-10 rounded-lg object-cover"/>
              <div class="flex-1"><p class="font-sub text-xs font-medium">${i.product?.name || "Item"}</p><p class="font-sub text-xs text-gray-400">Qty: ${i.quantity}</p></div>
              <p class="font-sub text-xs font-semibold text-secondary">Rs. ${((i.price || 0) * i.quantity).toLocaleString()}</p>
            </div>`,
            )
            .join("")}
        </div>
        <button onclick="closeOrderModal()" class="mt-4 w-full border-2 border-gray-100 text-gray-600 font-sub font-semibold py-2.5 rounded-xl hover:bg-gray-50 transition text-sm">Close</button>`;
      modal.classList.remove("hidden");
    } catch (err) {
      RA.showToast(err.message, "error");
    }
  };

  window.closeOrderModal = () => {
    document.getElementById("orderModal")?.classList.add("hidden");
  };

  // Search filter for orders
  const orderSearch = document.getElementById("orderSearch");
  const orderStatusFilter = document.getElementById("orderStatusFilter");
  if (orderSearch)
    orderSearch.addEventListener("input", () =>
      loadAllOrders(orderSearch.value),
    );
  if (orderStatusFilter)
    orderStatusFilter.addEventListener("change", () =>
      loadAllOrders(orderStatusFilter.value),
    );

  // ─────────────────────────────────────────────────────
  //  PRODUCTS (admin tab)
  // ─────────────────────────────────────────────────────
  let adminProducts = [];

  async function loadAdminProducts(cat = "all") {
    try {
      adminProducts = await RA.Products.getAll(
        cat !== "all" ? { type: cat } : {},
      );
      renderAdminProductGrid(adminProducts);
    } catch (err) {
      console.error("Products error:", err.message);
    }
  }

  function renderAdminProductGrid(products) {
    const grid = document.getElementById("adminProductGrid");
    if (!grid) return;
    grid.innerHTML = products
      .map((p) => {
        const img =
          p.imageUrls?.[0] ||
          "https://images.unsplash.com/photo-1582269847642-87432658c952?q=80&w=300";
        return `
      <div class="bg-gray-50 rounded-xl overflow-hidden border border-gray-100 hover:shadow-md transition group">
        <div class="relative overflow-hidden">
          <img src="${img}" class="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-500" alt="${p.name}"/>
          ${p.badge ? `<span class="absolute top-2 right-2 bg-primary text-white text-[10px] font-sub font-bold px-2 py-0.5 rounded-full">${p.badge}</span>` : ""}
          <span class="absolute top-2 left-2 font-sub text-[10px] ${p.isActive !== false ? "bg-green-500" : "bg-gray-400"} text-white px-2 py-0.5 rounded-full">${p.isActive !== false ? "Active" : "Inactive"}</span>
        </div>
        <div class="p-4">
          <p class="font-main text-sm text-gray-800 truncate mb-0.5">${p.name}</p>
          <p class="font-sub text-xs text-gray-400 capitalize mb-1">${p.category}</p>
          <p class="font-sub text-secondary font-bold text-sm">Rs. ${(p.price || 0).toLocaleString()}${p.maxPrice ? " – " + p.maxPrice.toLocaleString() : ""}</p>
          <div class="flex gap-2 mt-3">
            <button onclick="openEditProductModal('${p._id}')" class="flex-1 bg-primary/8 text-primary hover:bg-primary hover:text-white font-sub text-xs font-semibold py-2 rounded-xl transition"><i class="fas fa-edit mr-1"></i>Edit</button>
            <button onclick="deleteAdminProduct('${p._id}')" class="flex-1 bg-red-50 text-red-400 hover:bg-red-500 hover:text-white font-sub text-xs font-semibold py-2 rounded-xl transition"><i class="fas fa-trash-alt mr-1"></i>Delete</button>
          </div>
        </div>
      </div>`;
      })
      .join("");
  }

  // Product category filter buttons
  document.querySelectorAll(".prod-filter").forEach((btn) => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".prod-filter").forEach((b) => {
        b.className =
          "prod-filter font-sub text-xs px-4 py-2 rounded-xl bg-white border border-gray-200 text-gray-600 hover:border-primary hover:text-primary transition";
      });
      btn.className =
        "prod-filter font-sub text-xs px-4 py-2 rounded-xl bg-primary text-white transition";
      loadAdminProducts(btn.dataset.cat || "all");
    });
  });

  window.deleteAdminProduct = async (id) => {
    if (!confirm("Delete this product?")) return;
    try {
      await RA.Products.delete(id);
      RA.showToast("Product deleted.");
      await loadAdminProducts();
    } catch (err) {
      RA.showToast(err.message, "error");
    }
  };

  window.openEditProductModal = async (id) => {
    const p = adminProducts.find((x) => x._id === id);
    if (!p) return;
    document.getElementById("productModalTitle").textContent = "Edit Product";
    document.getElementById("pName").value = p.name || "";
    document.getElementById("pPrice").value = p.price || "";
    document.getElementById("pMaxPrice").value = p.maxPrice || "";
    document.getElementById("pStock").value = p.stock || "";
    document.getElementById("pDesc").value = p.description || "";
    document.getElementById("pBadge").value = p.badge || "";
    document.getElementById("pStatus").value =
      p.isActive !== false ? "active" : "inactive";
    if (document.getElementById("pCategory"))
      document.getElementById("pCategory").value = p.category || "wooden";
    document.getElementById("productModal").dataset.editId = id;
    document.getElementById("productModal").classList.remove("hidden");
  };

  window.openProductModal = () => {
    document.getElementById("productModalTitle").textContent =
      "Add New Product";
    document.getElementById("productModal").dataset.editId = "";
    ["pName", "pPrice", "pMaxPrice", "pStock", "pDesc", "pImage"].forEach(
      (id) => {
        const el = document.getElementById(id);
        if (el) el.value = "";
      },
    );
    document.getElementById("productModal").classList.remove("hidden");
  };

  window.closeProductModal = () =>
    document.getElementById("productModal").classList.add("hidden");

  window.saveProduct = async () => {
    const editId = document.getElementById("productModal").dataset.editId;
    const fd = new FormData();
    fd.append("name", document.getElementById("pName").value);
    fd.append("price", document.getElementById("pPrice").value);
    fd.append("maxPrice", document.getElementById("pMaxPrice").value || 0);
    fd.append("stock", document.getElementById("pStock").value || 99);
    fd.append("description", document.getElementById("pDesc").value || "");
    fd.append(
      "category",
      document.getElementById("pCategory")?.value || "wooden",
    );
    fd.append("badge", document.getElementById("pBadge").value || "");
    fd.append(
      "isActive",
      document.getElementById("pStatus").value === "active",
    );
    const imgFile = document.getElementById("pImageFile");
    if (imgFile?.files?.[0]) fd.append("images", imgFile.files[0]);

    try {
      if (editId) {
        await RA.Products.update(editId, fd);
        RA.showToast("Product updated!");
      } else {
        await RA.Products.create(fd);
        RA.showToast("Product created!");
      }
      window.closeProductModal();
      await loadAdminProducts();
    } catch (err) {
      RA.showToast(err.message, "error");
    }
  };

  // ─────────────────────────────────────────────────────
  //  CUSTOMERS
  // ─────────────────────────────────────────────────────
  async function loadCustomers() {
    try {
      const users = await RA.Users.getAll();
      const tbody = document.getElementById("customersTable");
      if (!tbody) return;
      tbody.innerHTML = users
        .map(
          (c) => `
        <tr>
          <td>
            <div class="flex items-center gap-3">
              <div class="w-9 h-9 bg-primary/10 rounded-full flex items-center justify-center font-sub font-bold text-primary text-sm">${(c.name || "?").charAt(0)}</div>
              <div><p class="font-medium text-gray-800 text-sm">${c.name}</p><p class="text-xs text-gray-400">${c.email}</p></div>
            </div>
          </td>
          <td>${c.phone || ""}</td>
          <td class="text-gray-500 text-xs">${new Date(c.createdAt).toLocaleDateString()}</td>
          <td><button onclick="deleteCustomer('${c._id}')" class="font-sub text-xs text-red-400 hover:text-red-600 transition">Delete</button></td>
        </tr>`,
        )
        .join("");
    } catch (err) {
      console.error("Customers error:", err.message);
    }
  }

  window.deleteCustomer = async (id) => {
    if (!confirm("Delete this user?")) return;
    try {
      await RA.Users.delete(id);
      RA.showToast("User deleted.");
      await loadCustomers();
    } catch (err) {
      RA.showToast(err.message, "error");
    }
  };

  // ─────────────────────────────────────────────────────
  //  CONTACT MESSAGES
  // ─────────────────────────────────────────────────────
  async function loadContacts() {
    try {
      const msgs = await RA.Contact.getAll();
      // Update badge if exists
      const badge = document.querySelector("[data-contact-badge]");
      if (badge) badge.textContent = msgs.filter((m) => !m.isRead).length;
    } catch (err) {
      /* silently fail if not on contacts tab */
    }
  }

  // ── Gallery admin ──
  window.saveGalleryItem = async () => {
    const title = document.getElementById("gTitle")?.value.trim();
    const cat = document.getElementById("gCat")?.value;
    const desc = document.getElementById("gDesc")?.value.trim();
    const files = document.getElementById("gImages")?.files;
    if (!title || !cat) {
      RA.showToast("Title and category are required.", "error");
      return;
    }
    if (!files || !files.length) {
      RA.showToast("Please select at least one image.", "error");
      return;
    }
    const fd = new FormData();
    fd.append("title", title);
    fd.append("cat", cat);
    fd.append("description", desc || "");
    Array.from(files).forEach((f) => fd.append("images", f));
    try {
      await RA.Gallery.create(fd);
      RA.showToast("Gallery item added!");
    } catch (err) {
      RA.showToast(err.message, "error");
    }
  };

  // ─────────────────────────────────────────────────────
  //  HELPERS
  // ─────────────────────────────────────────────────────
  function setText(id, val) {
    const el = document.getElementById(id);
    if (el) el.textContent = val;
  }

  function statusBadge(s) {
    const map = {
      PENDING: "badge-pending",
      CONFIRMED: "badge-processing",
      SHIPPED: "badge-processing",
      DELIVERED: "badge-completed",
    };
    return `<span class="font-sub text-xs font-semibold px-2.5 py-1 rounded-full ${map[s] || "bg-gray-100 text-gray-600"}">${s || "PENDING"}</span>`;
  }
})();
