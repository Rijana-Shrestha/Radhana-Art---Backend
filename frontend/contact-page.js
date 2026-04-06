// contact-page.js — wires contact.html form to the API
// Add after api.js: <script src="/js/contact-page.js"></script>

(function () {
  const form = document.getElementById("contactForm");
  if (!form) return;

  // Remove the old fake submit listener by replacing the form's submit
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = document.getElementById("cName")?.value.trim();
    const phone = document.getElementById("cPhone")?.value.trim();
    const email = document.getElementById("cEmail")?.value.trim();
    const subject = document.getElementById("cSubject")?.value;
    const message = document.getElementById("cMessage")?.value.trim();
    const fileInput = document.getElementById("contactFile");

    // Validation
    let valid = true;
    [
      { id: "cName", errId: "cNameErr", val: name },
      { id: "cPhone", errId: "cPhoneErr", val: phone },
      { id: "cSubject", errId: "cSubjectErr", val: subject },
      { id: "cMessage", errId: "cMsgErr", val: message },
    ].forEach(({ id, errId, val }) => {
      const el = document.getElementById(id);
      const err = document.getElementById(errId);
      if (!val) {
        el?.classList.add("error");
        err?.classList.remove("hidden");
        valid = false;
      } else {
        el?.classList.remove("error");
        err?.classList.add("hidden");
      }
    });
    if (!valid) return;

    const btn = document.getElementById("contactSubmit");
    const btnText = document.getElementById("submitText");
    const btnIcon = document.getElementById("submitIcon");

    if (btn) btn.disabled = true;
    if (btnText) btnText.textContent = "Sending...";
    if (btnIcon) btnIcon.className = "fas fa-spinner fa-spin";

    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("phone", phone);
      formData.append("email", email || "");
      formData.append("subject", subject);
      formData.append("message", message);
      if (fileInput?.files?.[0]) {
        formData.append("attachment", fileInput.files[0]);
      }

      await RA.Contact.send(formData);

      // Reset form
      form.reset();
      if (typeof clearContactFile === "function") clearContactFile();
      document.getElementById("charCount") &&
        (document.getElementById("charCount").textContent = "0 / 500");

      // Show success modal if it exists
      const successMsg = document.getElementById("successMsg");
      if (successMsg) {
        successMsg.classList.remove("hidden");
        document.body.style.overflow = "hidden";
      } else {
        RA.showToast("Message sent! We'll reply within 2 hours.");
      }
    } catch (err) {
      RA.showToast(err.message || "Failed to send message.", "error");
    } finally {
      if (btn) btn.disabled = false;
      if (btnText) btnText.textContent = "Send Message";
      if (btnIcon) btnIcon.className = "fas fa-paper-plane";
    }
  });
})();
