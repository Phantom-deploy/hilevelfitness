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

  /* -------- Contact form (front-end only) -------- */
  var form = document.querySelector("#consult-form");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (!form.checkValidity()) { form.reportValidity(); return; }
      var success = document.querySelector("#form-success");
      var nameField = form.querySelector("[name=name]");
      var first = nameField && nameField.value ? nameField.value.trim().split(" ")[0] : "";
      form.style.display = "none";
      if (success) {
        var h = success.querySelector("h3");
        if (h && first) h.textContent = "Thanks, " + first + ".";
        success.classList.add("show");
        success.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "center" });
      }
    });
  }

  /* -------- Footer year -------- */
  var yr = document.querySelector("#year");
  if (yr) yr.textContent = new Date().getFullYear();
})();
