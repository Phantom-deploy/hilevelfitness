/* ============================================================
   HiLevel — interactions
   Navbar blur, scroll reveal, counters, accordion,
   pricing toggle, mobile menu, form handling.
   ============================================================ */
(function () {
  "use strict";

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* -------- Sticky blurred navbar -------- */
  var nav = document.querySelector(".nav");
  function onScroll() {
    if (!nav) return;
    if (window.scrollY > 12) nav.classList.add("scrolled");
    else nav.classList.remove("scrolled");
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* -------- Mobile menu -------- */
  var toggle = document.querySelector(".nav-toggle");
  var menu = document.querySelector(".mobile-menu");
  if (toggle && menu) {
    toggle.addEventListener("click", function () {
      var open = menu.classList.toggle("open");
      toggle.classList.toggle("open", open);
      nav.classList.toggle("menu-open", open);
      document.body.style.overflow = open ? "hidden" : "";
    });
    menu.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () {
        menu.classList.remove("open");
        toggle.classList.remove("open");
        nav.classList.remove("menu-open");
        document.body.style.overflow = "";
      });
    });
  }

  /* -------- Scroll reveal + counters -------- */
  var counted = new WeakSet();

  function animateCount(el) {
    if (counted.has(el)) return;
    counted.add(el);
    var target = parseFloat(el.getAttribute("data-count"));
    var suffix = el.getAttribute("data-suffix") || "";
    var dur = 1500;
    if (reduceMotion) { el.textContent = formatNum(target) + suffix; return; }
    var start = performance.now();
    function tick(now) {
      var p = Math.min((now - start) / dur, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = formatNum(target * eased) + suffix;
      if (p < 1) requestAnimationFrame(tick);
      else el.textContent = formatNum(target) + suffix;
    }
    requestAnimationFrame(tick);
  }
  function formatNum(n) {
    return Number.isInteger(n) ? String(Math.round(n)) : String(Math.round(n));
  }

  if ("IntersectionObserver" in window) {
    var revealObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add("is-visible");
          e.target.querySelectorAll("[data-count]").forEach(animateCount);
          if (e.target.hasAttribute("data-count")) animateCount(e.target);
          revealObs.unobserve(e.target);
        }
      });
    }, { threshold: 0.15, rootMargin: "0px 0px -8% 0px" });

    document.querySelectorAll(".reveal").forEach(function (el) { revealObs.observe(el); });

    // Counters that aren't inside a .reveal
    var loose = document.querySelectorAll("[data-count]");
    loose.forEach(function (el) {
      if (!el.closest(".reveal")) revealObs.observe(el);
    });
  } else {
    document.querySelectorAll(".reveal").forEach(function (el) { el.classList.add("is-visible"); });
    document.querySelectorAll("[data-count]").forEach(function (el) {
      el.textContent = el.getAttribute("data-count") + (el.getAttribute("data-suffix") || "");
    });
  }

  /* -------- Accordion (services) -------- */
  document.querySelectorAll(".acc-head").forEach(function (head) {
    head.addEventListener("click", function () {
      var item = head.closest(".acc-item");
      var isOpen = item.classList.contains("open");
      // close others in the same accordion
      var group = item.closest(".accordion");
      if (group) group.querySelectorAll(".acc-item.open").forEach(function (o) {
        if (o !== item) o.classList.remove("open");
      });
      item.classList.toggle("open", !isOpen);
    });
  });

  /* -------- Pricing toggle -------- */
  var toggleEl = document.querySelector(".toggle");
  if (toggleEl) {
    var btns = toggleEl.querySelectorAll("button");
    var slider = toggleEl.querySelector(".slider");
    function moveSlider(btn) {
      slider.style.width = btn.offsetWidth + "px";
      slider.style.transform = "translateX(" + (btn.offsetLeft - 5) + "px)";
    }
    function setMode(mode, btn) {
      btns.forEach(function (b) { b.classList.toggle("active", b === btn); });
      moveSlider(btn);
      document.querySelectorAll(".plan").forEach(function (plan) {
        var amt = plan.querySelector(".price .amt");
        var sub = plan.querySelector(".price-sub");
        var per = plan.querySelector(".price .per");
        if (!amt) return;
        var monthly = plan.getAttribute("data-monthly");
        var annual = plan.getAttribute("data-annual");
        if (mode === "annual") {
          amt.textContent = "$" + annual;
          if (per) per.textContent = "/mo";
          if (sub) sub.textContent = "Billed upfront · save 20%";
        } else {
          amt.textContent = "$" + monthly;
          if (per) per.textContent = "/mo";
          if (sub) sub.textContent = "Billed monthly · cancel anytime";
        }
      });
    }
    btns.forEach(function (btn) {
      btn.addEventListener("click", function () { setMode(btn.getAttribute("data-mode"), btn); });
    });
    // init
    var initBtn = toggleEl.querySelector("button.active") || btns[0];
    requestAnimationFrame(function () { moveSlider(initBtn); });
    window.addEventListener("resize", function () {
      var active = toggleEl.querySelector("button.active");
      if (active) moveSlider(active);
    });
  }

  /* -------- Contact form (hands off to text or email, prefilled) -------- */
  var SMS_NUMBER = "+18582547160";
  var MAIL_TO = "bradyhiel@gmail.com";
  var MAIL_SUBJECT = "Free consultation request";

  function smsHref(body) {
    // iOS wants "&body=", everything else "?body=".
    var ua = navigator.userAgent || "";
    var isApple = /iPhone|iPad|iPod/.test(ua);
    return "sms:" + SMS_NUMBER + (isApple ? "&" : "?") + "body=" + encodeURIComponent(body);
  }

  function buildMessage(f) {
    function val(n) {
      var el = f.querySelector("[name=" + n + "]");
      return el && el.value ? el.value.trim() : "";
    }
    var lines = ["Hi HiLevel — I'd like to book my free consultation."];
    if (val("name")) lines.push("Name: " + val("name"));
    if (val("email")) lines.push("Email: " + val("email"));
    if (val("phone")) lines.push("Phone: " + val("phone"));
    if (val("goal")) lines.push("Goal: " + val("goal"));
    if (val("message")) lines.push("More: " + val("message"));
    return lines.join("\n");
  }

  function mailtoHref(body) {
    return "mailto:" + MAIL_TO +
      "?subject=" + encodeURIComponent(MAIL_SUBJECT) +
      "&body=" + encodeURIComponent(body);
  }

  var INTRO = "Hi HiLevel \u2014 I'd like to book my free consultation.";

  var smsDirect = document.querySelector("#sms-direct");
  if (smsDirect) smsDirect.setAttribute("href", smsHref(INTRO));

  var mailDirect = document.querySelector("#mail-direct");
  if (mailDirect) mailDirect.setAttribute("href", mailtoHref(INTRO));

  function gmailHref(body) {
    return "https://mail.google.com/mail/?view=cm&fs=1&to=" + encodeURIComponent(MAIL_TO) +
      "&su=" + encodeURIComponent(MAIL_SUBJECT) +
      "&body=" + encodeURIComponent(body);
  }

  // The email option shows the address and message ready to copy, since a
  // mailto: link does nothing on machines with no mail app registered.
  function fillMailPanel(scope, body) {
    var pre = scope.querySelector("#mail-body");
    if (pre) pre.textContent = body;
    var gmail = scope.querySelector("#gmail-link");
    if (gmail) gmail.setAttribute("href", gmailHref(body));
    var mailLink = scope.querySelector("#mail-fallback");
    if (mailLink) mailLink.setAttribute("href", mailtoHref(body));
  }

  var mailToggle = document.querySelector("#mail-toggle");
  var mailPanel = document.querySelector("#mail-panel");
  if (mailToggle && mailPanel) {
    mailToggle.addEventListener("click", function () {
      var open = mailPanel.hasAttribute("hidden");
      if (open) mailPanel.removeAttribute("hidden");
      else mailPanel.setAttribute("hidden", "");
      mailToggle.setAttribute("aria-expanded", String(open));
      mailToggle.textContent = open ? "Hide email details" : "Send as an email";
    });
  }

  function copyText(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      return navigator.clipboard.writeText(text);
    }
    return new Promise(function (resolve, reject) {
      var ta = document.createElement("textarea");
      ta.value = text;
      ta.setAttribute("readonly", "");
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      var ok = false;
      try { ok = document.execCommand("copy"); } catch (err) { ok = false; }
      document.body.removeChild(ta);
      ok ? resolve() : reject();
    });
  }

  document.querySelectorAll("[data-copy-target]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var target = document.querySelector(btn.getAttribute("data-copy-target"));
      if (!target) return;
      copyText(target.textContent.trim()).then(function () {
        btn.textContent = "Copied";
        btn.classList.add("copied");
        setTimeout(function () {
          btn.textContent = "Copy";
          btn.classList.remove("copied");
        }, 1800);
      }).catch(function () {
        btn.textContent = "Press Ctrl+C";
        setTimeout(function () { btn.textContent = "Copy"; }, 2200);
      });
    });
  });

  var form = document.querySelector("#consult-form");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (!form.checkValidity()) { form.reportValidity(); return; }

      var body = buildMessage(form);
      var success = document.querySelector("#form-success");
      var nameField = form.querySelector("[name=name]");
      var first = nameField && nameField.value ? nameField.value.trim().split(" ")[0] : "";
      if (first) first = first.charAt(0).toUpperCase() + first.slice(1);

      form.style.display = "none";
      if (success) {
        var h = success.querySelector("h3");
        if (h && first) h.textContent = "Thanks, " + first + ".";
        var smsLink = success.querySelector("#sms-fallback");
        if (smsLink) smsLink.setAttribute("href", smsHref(body));
        fillMailPanel(success, body);
        success.classList.add("show");
        success.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "center" });
      }
    });
  }

  /* -------- Footer year -------- */
  var yr = document.querySelector("#year");
  if (yr) yr.textContent = new Date().getFullYear();
})();
