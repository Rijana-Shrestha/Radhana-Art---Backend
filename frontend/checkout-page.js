// checkout-page.js — wires checkout.html to submit real orders
// Add after api.js: <script src="/js/checkout-page.js"></script>

(async function () {
  // ── Check auth ──
  const user = await RA.getCurrentUser();
  if (!user) {
    window.location.href = "/login.html?redirect=/checkout.html";
    return;
  }

  // Pre-fill name, email, phone from user account
  const fill = (id, val) => {
    const el = document.getElementById(id);
    if (el && val) el.value = val;
  };
  if (user.name) {
    const parts = user.name.split(" ");
    fill("firstName", parts[0]);
    fill("lastName", parts.slice(1).join(" "));
  }
  fill("email", user.email);
  fill("phone", user.phone);
  if (user.address?.city) fill("city", user.address.city);
  if (user.address?.street) fill("address", user.address.street);

  // ── Intercept place order ──
  const placeBtn = document.getElementById("placeOrderBtn");
  if (placeBtn) {
    // Remove old inline onclick
    placeBtn.removeAttribute("onclick");
    placeBtn.addEventListener("click", submitOrder);
  }

  async function submitOrder() {
    const cart = RA.getCart();
    if (!cart.length) {
      RA.showToast("Your cart is empty.", "error");
      return;
    }

    const firstName = document.getElementById("firstName")?.value.trim();
    const lastName = document.getElementById("lastName")?.value.trim();
    const email = document.getElementById("email")?.value.trim();
    const phone = document.getElementById("phone")?.value.trim();
    const address = document.getElementById("address")?.value.trim();
    const city = document.getElementById("city")?.value;
    const landmark = document.getElementById("landmark")?.value.trim() || "";
    const notes = document.getElementById("notes")?.value.trim() || "";

    if (!firstName || !lastName || !email || !phone || !address || !city) {
      RA.showToast("Please fill in all required shipping fields.", "error");
      return;
    }

    const paymentMethod =
      document.querySelector("input[name='payment']:checked")?.value || "cod";

    // Calculate totals (matching checkout.html logic)
    const subtotal = cart.reduce((s, i) => s + i.price * i.qty, 0);
    const tax = Math.round(subtotal * 0.13);
    const total = subtotal + tax;

    const orderItems = cart.map((i) => ({
      product: i.id,
      quantity: i.qty,
      price: i.price,
    }));

    const shippingAddress = {
      firstName,
      lastName,
      email,
      phone,
      street: address,
      city,
      landmark,
      country: "Nepal",
    };

    const placeBtn = document.getElementById("placeOrderBtn");
    if (placeBtn) {
      placeBtn.disabled = true;
      placeBtn.innerHTML =
        '<i class="fas fa-spinner fa-spin"></i> Processing...';
    }

    try {
      let order;

      // If design file uploaded, use FormData
      const fileInput = document.getElementById("fileInput");
      if (fileInput?.files?.[0]) {
        const fd = new FormData();
        fd.append("orderItems", JSON.stringify(orderItems));
        fd.append("totalPrice", total);
        fd.append("shippingAddress", JSON.stringify(shippingAddress));
        fd.append("paymentMethod", paymentMethod);
        fd.append("orderNotes", notes);
        fd.append("designFile", fileInput.files[0]);
        order = await RA.Orders.createWithFile(fd);
      } else {
        order = await RA.Orders.create({
          orderItems,
          totalPrice: total,
          shippingAddress,
          paymentMethod,
          orderNotes: notes,
        });
      }

      // If Khalti selected, initiate payment
      if (paymentMethod === "khalti") {
        try {
          const khaltiData = await RA.Orders.payViaKhalti(order._id);
          if (khaltiData?.payment_url) {
            RA.clearCart();
            window.location.href = khaltiData.payment_url;
            return;
          }
        } catch (err) {
          console.error("Khalti error:", err.message);
          // Fall through to show success anyway
        }
      }

      // Clear cart and show success
      RA.clearCart();

      const overlay = document.getElementById("successOverlay");
      const orderIdEl = document.getElementById("successOrderId");
      if (overlay) {
        if (orderIdEl)
          orderIdEl.textContent = order.orderNumber || "#RA-" + Date.now();
        overlay.classList.remove("hidden");
        overlay.classList.add("flex");
        setTimeout(() => {
          overlay.style.opacity = "1";
        }, 10);
        document.body.style.overflow = "hidden";
      } else {
        RA.showToast(
          "Order placed successfully! We'll contact you on WhatsApp.",
        );
        setTimeout(() => {
          window.location.href = "/index.html";
        }, 2000);
      }
    } catch (err) {
      RA.showToast(err.message || "Failed to place order.", "error");
      if (placeBtn) {
        placeBtn.disabled = false;
        placeBtn.innerHTML = '<i class="fas fa-check-circle"></i> Place Order';
      }
    }
  }
})();
