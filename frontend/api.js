// ═══════════════════════════════════════════════════════
//  api.js  —  Radhana Art  |  Frontend ↔ Backend bridge
//  Include this in every HTML page:
//    <script src="/js/api.js"></script>
// ═══════════════════════════════════════════════════════

const API_BASE = "http://localhost:5000/api";

// ── Generic fetch wrapper ──────────────────────────────
async function apiFetch(endpoint, options = {}) {
  const res = await fetch(`${API_BASE}${endpoint}`, {
    credentials: "include", // send cookies automatically
    headers: { "Content-Type": "application/json", ...options.headers },
    ...options,
  });

  // For FormData, do NOT set Content-Type (browser sets boundary)
  if (options.body instanceof FormData) {
    delete options.headers?.["Content-Type"];
  }

  const text = await res.text();
  let data;
  try {
    data = JSON.parse(text);
  } catch {
    data = text;
  }

  if (!res.ok) {
    const msg = data?.message || data || `Error ${res.status}`;
    throw new Error(msg);
  }
  return data;
}

// ── FormData fetch (for file uploads) ─────────────────
async function apiFetchForm(endpoint, formData, method = "POST") {
  const res = await fetch(`${API_BASE}${endpoint}`, {
    method,
    credentials: "include",
    body: formData,
    // No Content-Type header — browser sets it with boundary
  });

  const text = await res.text();
  let data;
  try {
    data = JSON.parse(text);
  } catch {
    data = text;
  }

  if (!res.ok) {
    const msg = data?.message || data || `Error ${res.status}`;
    throw new Error(msg);
  }
  return data;
}

// ═══════════════════════════════════════════════════════
//  AUTH
// ═══════════════════════════════════════════════════════
const Auth = {
  register: (body) =>
    apiFetch("/auth/register", { method: "POST", body: JSON.stringify(body) }),
  login: (body) =>
    apiFetch("/auth/login", { method: "POST", body: JSON.stringify(body) }),
  logout: () => apiFetch("/auth/logout", { method: "POST" }),
  getMe: () => apiFetch("/auth/me"),
  forgotPassword: (email) =>
    apiFetch("/auth/forgot-password", {
      method: "POST",
      body: JSON.stringify({ email }),
    }),
  resetPassword: (token, userId, password, confirmPassword) =>
    apiFetch(`/auth/reset-password?token=${token}&userId=${userId}`, {
      method: "POST",
      body: JSON.stringify({ password, confirmPassword }),
    }),
};

// ═══════════════════════════════════════════════════════
//  PRODUCTS
// ═══════════════════════════════════════════════════════
const Products = {
  getAll: (params = {}) => {
    const qs = new URLSearchParams(params).toString();
    return apiFetch(`/products${qs ? "?" + qs : ""}`);
  },
  getById: (id) => apiFetch(`/products/${id}`),
  create: (formData) => apiFetchForm("/products", formData, "POST"),
  update: (id, formData) => apiFetchForm(`/products/${id}`, formData, "PUT"),
  delete: (id) => apiFetch(`/products/${id}`, { method: "DELETE" }),
};

// ═══════════════════════════════════════════════════════
//  ORDERS
// ═══════════════════════════════════════════════════════
const Orders = {
  getAll: () => apiFetch("/orders"),
  getMyOrders: () => apiFetch("/orders/user"),
  getById: (id) => apiFetch(`/orders/${id}`),
  create: (body) =>
    apiFetch("/orders", { method: "POST", body: JSON.stringify(body) }),
  createWithFile: (formData) => apiFetchForm("/orders", formData, "POST"),
  updateStatus: (id, status) =>
    apiFetch(`/orders/${id}`, {
      method: "PUT",
      body: JSON.stringify({ status }),
    }),
  delete: (id) => apiFetch(`/orders/${id}`, { method: "DELETE" }),
  payViaKhalti: (id) =>
    apiFetch(`/orders/${id}/payment/khalti`, { method: "POST" }),
  confirmPayment: (id, status) =>
    apiFetch(`/orders/${id}/confirm-payment`, {
      method: "PUT",
      body: JSON.stringify({ status }),
    }),
};

// ═══════════════════════════════════════════════════════
//  GALLERY
// ═══════════════════════════════════════════════════════
const Gallery = {
  getAll: (cat) => {
    const qs = cat && cat !== "all" ? `?cat=${cat}` : "";
    return apiFetch(`/gallery${qs}`);
  },
  create: (formData) => apiFetchForm("/gallery", formData, "POST"),
  update: (id, formData) => apiFetchForm(`/gallery/${id}`, formData, "PUT"),
  delete: (id) => apiFetch(`/gallery/${id}`, { method: "DELETE" }),
};

// ═══════════════════════════════════════════════════════
//  CONTACT
// ═══════════════════════════════════════════════════════
const Contact = {
  send: (formData) => apiFetchForm("/contact", formData, "POST"),
  getAll: () => apiFetch("/contact"),
  markRead: (id) => apiFetch(`/contact/${id}/read`, { method: "PATCH" }),
  delete: (id) => apiFetch(`/contact/${id}`, { method: "DELETE" }),
};

// ═══════════════════════════════════════════════════════
//  USERS  (admin)
// ═══════════════════════════════════════════════════════
const Users = {
  getAll: () => apiFetch("/users"),
  getById: (id) => apiFetch(`/users/${id}`),
  update: (id, body) =>
    apiFetch(`/users/${id}`, { method: "PUT", body: JSON.stringify(body) }),
  updateProfileImage: (id, formData) =>
    apiFetchForm(`/users/${id}/profile-image`, formData, "PATCH"),
  delete: (id) => apiFetch(`/users/${id}`, { method: "DELETE" }),
};

// ═══════════════════════════════════════════════════════
//  AUTH HELPERS  (used by multiple pages)
// ═══════════════════════════════════════════════════════

// Cache current user in memory for this page session
let _currentUser = null;

async function getCurrentUser() {
  if (_currentUser) return _currentUser;
  try {
    _currentUser = await Auth.getMe();
    return _currentUser;
  } catch {
    return null;
  }
}

function clearCurrentUser() {
  _currentUser = null;
}

// Redirect to login if not authenticated
async function requireAuth(redirectTo = "/login.html") {
  const user = await getCurrentUser();
  if (!user) {
    window.location.href = redirectTo;
    return null;
  }
  return user;
}

// Redirect to login if not admin
async function requireAdmin() {
  const user = await requireAuth();
  if (user && !user.roles.includes("ADMIN")) {
    alert("Access denied. Admin only.");
    window.location.href = "/index.html";
    return null;
  }
  return user;
}

// Update nav UI based on login state (call on every page)
async function initNavAuth() {
  const user = await getCurrentUser();
  // Update cart badge from localStorage (still used for cart UX)
  updateCartBadges();

  // If page has a login/logout link, update it
  const loginLinks = document.querySelectorAll("[data-auth-link]");
  loginLinks.forEach((el) => {
    if (user) {
      el.textContent = user.name.split(" ")[0]; // first name
      el.href = "/profile.html";
    }
  });

  const logoutBtns = document.querySelectorAll("[data-logout-btn]");
  logoutBtns.forEach((btn) => {
    btn.style.display = user ? "inline-flex" : "none";
    btn.addEventListener("click", async () => {
      await Auth.logout();
      clearCurrentUser();
      window.location.href = "/login.html";
    });
  });

  return user;
}

// ═══════════════════════════════════════════════════════
//  CART HELPERS  (localStorage for UX speed)
// ═══════════════════════════════════════════════════════
function getCart() {
  return JSON.parse(localStorage.getItem("radhana_cart") || "[]");
}

function saveCart(cart) {
  localStorage.setItem("radhana_cart", JSON.stringify(cart));
  updateCartBadges();
}

function addToCart(id, name, price, image) {
  const cart = getCart();
  const existing = cart.find((i) => i.id === id);
  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ id, name, price, image, qty: 1 });
  }
  saveCart(cart);
}

function removeFromCart(id) {
  saveCart(getCart().filter((i) => i.id !== id));
}

function clearCart() {
  localStorage.removeItem("radhana_cart");
  updateCartBadges();
}

function updateCartBadges() {
  const total = getCart().reduce((s, i) => s + i.qty, 0);
  document.querySelectorAll(".cart-badge").forEach((el) => {
    el.textContent = total;
  });
}

// ═══════════════════════════════════════════════════════
//  TOAST
// ═══════════════════════════════════════════════════════
function showToast(msg, type = "success") {
  let t = document.getElementById("ra-toast");
  if (!t) {
    t = document.createElement("div");
    t.id = "ra-toast";
    t.style.cssText =
      "position:fixed;bottom:32px;left:50%;transform:translateX(-50%);z-index:9999;" +
      "background:#1f2937;color:#fff;font-family:Poppins,sans-serif;font-size:14px;" +
      "padding:12px 22px;border-radius:14px;box-shadow:0 8px 32px rgba(0,0,0,.25);" +
      "display:flex;align-items:center;gap:10px;transition:opacity .3s;";
    document.body.appendChild(t);
  }
  const icon = type === "success" ? "✅" : type === "error" ? "❌" : "ℹ️";
  t.innerHTML = `<span>${icon}</span><span>${msg}</span>`;
  t.style.opacity = "1";
  clearTimeout(window._raToastTimer);
  window._raToastTimer = setTimeout(() => {
    t.style.opacity = "0";
  }, 3000);
}

// ═══════════════════════════════════════════════════════
//  Export everything to window so any HTML page can use
// ═══════════════════════════════════════════════════════
window.RA = {
  Auth,
  Products,
  Orders,
  Gallery,
  Contact,
  Users,
  getCurrentUser,
  clearCurrentUser,
  requireAuth,
  requireAdmin,
  initNavAuth,
  getCart,
  saveCart,
  addToCart,
  removeFromCart,
  clearCart,
  updateCartBadges,
  showToast,
};
