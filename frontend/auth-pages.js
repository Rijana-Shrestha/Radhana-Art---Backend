(function () {
  // ── LOGIN FORM ──
  const loginForm = document.getElementById("loginForm");
  if (loginForm) {
    loginForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const email = document.getElementById("loginEmail")?.value.trim();
      const password = document.getElementById("loginPwd")?.value;
      const btn = document.getElementById("loginBtn");
      const btnText = document.getElementById("loginBtnText");
      const btnIcon = document.getElementById("loginBtnIcon");

      // Validation
      const emailErr = document.getElementById("emailErr");
      const pwdErr = document.getElementById("pwdErr");

      let valid = true;
      if (!email || !/\S+@\S+\.\S+/.test(email)) {
        if (emailErr) emailErr.classList.remove("hidden");
        document.getElementById("loginEmail")?.classList.add("error");
        valid = false;
      } else {
        if (emailErr) emailErr.classList.add("hidden");
        document.getElementById("loginEmail")?.classList.remove("error");
      }
      if (!password) {
        if (pwdErr) pwdErr.classList.remove("hidden");
        document.getElementById("loginPwd")?.classList.add("error");
        valid = false;
      } else {
        if (pwdErr) pwdErr.classList.add("hidden");
        document.getElementById("loginPwd")?.classList.remove("error");
      }
      if (!valid) return;

      // Loading state
      if (btn) btn.disabled = true;
      if (btnText) btnText.textContent = "Signing in...";
      if (btnIcon) btnIcon.className = "fas fa-spinner fa-spin text-sm";

      try {
        const user = await RA.Auth.login({ email, password });
        RA.showToast(`Welcome back, ${user.name}!`);

        // Redirect: admin → admin dashboard, user → home
        setTimeout(() => {
          if (user.roles.includes("ADMIN")) {
            window.location.href = "/admin.html";
          } else {
            const redirect =
              new URLSearchParams(window.location.search).get("redirect") ||
              "/index.html";
            window.location.href = redirect;
          }
        }, 800);
      } catch (err) {
        if (btn) btn.disabled = false;
        if (btnText) btnText.textContent = "Sign In";
        if (btnIcon) btnIcon.className = "fas fa-arrow-right text-sm";
        RA.showToast(err.message || "Login failed.", "error");
      }
    });
  }

  // ── REGISTER FORM ──
  const registerForm = document.getElementById("registerForm");
  if (registerForm) {
    registerForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const firstName = document.getElementById("regFirst")?.value.trim();
      const lastName = document.getElementById("regLast")?.value.trim();
      const email = document.getElementById("regEmail")?.value.trim();
      const phone = document.getElementById("regPhone")?.value.trim();
      const password = document.getElementById("regPwd")?.value;
      const confirm = document.getElementById("regConfirm")?.value;
      const terms = document.getElementById("termsCheck")?.checked;

      const nameErr = document.getElementById("nameErr");
      const emailErr = document.getElementById("regEmailErr");
      const confirmErr = document.getElementById("confirmErr");

      let valid = true;

      if (!firstName || !lastName) {
        if (nameErr) nameErr.classList.remove("hidden");
        valid = false;
      } else {
        if (nameErr) nameErr.classList.add("hidden");
      }

      if (!email || !/\S+@\S+\.\S+/.test(email)) {
        if (emailErr) emailErr.classList.remove("hidden");
        valid = false;
      } else {
        if (emailErr) emailErr.classList.add("hidden");
      }

      if (!password || password !== confirm) {
        if (confirmErr) confirmErr.classList.remove("hidden");
        valid = false;
      } else {
        if (confirmErr) confirmErr.classList.add("hidden");
      }

      if (!terms) {
        RA.showToast("Please accept the Terms of Service.", "error");
        valid = false;
      }

      if (!valid) return;

      const btn = document.getElementById("regBtn");
      const btnText = document.getElementById("regBtnText");
      const btnIcon = document.getElementById("regBtnIcon");

      if (btn) btn.disabled = true;
      if (btnText) btnText.textContent = "Creating account...";
      if (btnIcon) btnIcon.className = "fas fa-spinner fa-spin text-sm";

      try {
        await RA.Auth.register({
          name: `${firstName} ${lastName}`,
          email,
          phone,
          password,
          confirmPassword: confirm,
        });
        RA.showToast("Account created! Redirecting...");
        setTimeout(() => {
          window.location.href = "/index.html";
        }, 1000);
      } catch (err) {
        if (btn) btn.disabled = false;
        if (btnText) btnText.textContent = "Create Account";
        if (btnIcon) btnIcon.className = "fas fa-arrow-right text-sm";
        RA.showToast(err.message || "Registration failed.", "error");
      }
    });
  }
})();
