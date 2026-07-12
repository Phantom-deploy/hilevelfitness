# HiLevel — Fitness Coaching Website

A clean, modern, premium redesign of the HiLevel personal-fitness website.
Dark, minimal, and fast — inspired by the design language of Apple, Stripe,
Vercel, and Linear.

**Live pages**

- `index.html` — home (hero, method, why, results, gallery, free-consultation form)
- `services.html` — services, 8-week timeline, and pricing plans

---

## ✨ Features

- **Deep-black theme** (`#0A0A0A`) with white text, subtle gray accents, and a
  single electric-blue highlight color used only for buttons and accents.
- **Fully responsive** — desktop, tablet, and mobile, with a slide-down mobile menu.
- **Smooth, tasteful motion**
  - Fade-up on scroll (IntersectionObserver)
  - Sticky blurred navbar
  - Hover-lift on buttons and cards
  - Gentle image zoom
  - Animated counters
  - Subtle glowing backgrounds and smooth scrolling
- **Interactive**
  - Services accordion
  - Monthly ⇄ 10-month pricing toggle (auto-calculates the 20% upfront discount)
  - Working contact form with an inline success state
- **Accessible** — honors `prefers-reduced-motion`, semantic HTML, keyboard-friendly.
- **No build step, no framework, no dependencies.** Just HTML, CSS, and a little vanilla JS.

---

## 📁 Structure

```
.
├── index.html            # Home page
├── services.html         # Services & pricing page
├── css/
│   └── styles.css        # Design system + all styles
├── js/
│   └── main.js           # Nav, scroll reveal, counters, accordion, pricing, form
├── assets/
│   ├── favicon.svg       # HiLevel monogram favicon
│   └── img/              # Web-optimized photos (.jpg)
├── optimize_images.py    # One-off script used to compress the source photos
└── README.md
```

The only external resource is **Inter + Space Grotesk** from Google Fonts
(loaded via `<link>`). Everything else is self-contained. The site falls back
to system fonts gracefully if the web fonts don't load.

---

## 🚀 Deploy to GitHub Pages

1. Create a new repository on GitHub and push this folder:
   ```bash
   git init
   git add .
   git commit -m "HiLevel website"
   git branch -M main
   git remote add origin https://github.com/<you>/<repo>.git
   git push -u origin main
   ```
2. On GitHub: **Settings → Pages → Build and deployment**.
3. Set **Source** to `Deploy from a branch`, branch `main`, folder `/ (root)`, and **Save**.
4. Your site goes live at `https://<you>.github.io/<repo>/` in a minute or two.

That's it — no build required.

### Run locally

Open `index.html` directly, or serve the folder (recommended, so paths resolve cleanly):

```bash
python -m http.server 8000
# then open http://localhost:8000
```

---

## 🖼️ Images

The photos in `assets/img/` are web-optimized JPGs (≈15–80 KB each, ~700 KB total).
They were generated from the original high-resolution PNGs with `optimize_images.py`.

The original PNGs are intentionally **not committed** (see `.gitignore`) to keep the
repo lean — the optimized JPGs are all the site needs. To regenerate them, drop the
source `2.png … 10.png` back in the project root and run:

```bash
python optimize_images.py
```

---

## 🔌 Wiring up the contact form

The form is front-end only and shows a success message on submit. To actually
receive submissions on a static host like GitHub Pages, point it at a form
backend such as [Formspree](https://formspree.io):

```html
<!-- in index.html -->
<form id="consult-form" action="https://formspree.io/f/your-id" method="POST">
```

…and remove the `e.preventDefault()` handler in `js/main.js` (or keep it and POST
via `fetch`).

---

## 🎨 Customizing

All design tokens live at the top of `css/styles.css` under `:root` — change the
accent color, radii, or spacing in one place:

```css
--blue: #2F6DFF;      /* the one accent color */
--bg:   #0A0A0A;      /* page background */
--text: #F5F5F7;      /* primary text */
```

---

*Content and services adapted from the original HiLevel site. Redesigned with a
clean, premium aesthetic.*
