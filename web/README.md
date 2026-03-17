# ⚡️ PARKPLATZ SHARING ZÜRICH

> **Boutique parking spaces for the night. No stress, pure neon. Book your spot in 3 clicks.**

Parkplatz Sharing Zürich is a high-performance, neon-infused parking management application designed specifically for the urban landscape of Zürich. Built with a focus on speed, aesthetics, and user experience, it allows users to find and book boutique parking spaces across the city with a futuristic, "cyberpunk-inspired" interface.

---

## 🎨 THE VIBE

This isn't your average parking app. We've combined the precision of Zürich's urban planning with a bold, dark-mode aesthetic:
- **Obsidian & Neon:** High-contrast visuals for night-time clarity.
- **Kinetic Typography:** Powered by GSAP for a fluid, premium feel.
- **Magnetic Interactions:** A bespoke cursor and UI elements that feel alive.
- **Noise Overlays:** A subtle, gritty texture for that modern "boutique" look.

---

## 🚀 KEY FEATURES

- **Interactive Zürich Map:** Real-time visualization of available spots using Leaflet.
- **3-Click Booking:** Streamlined UX to secure your spot in seconds.
- **Command Palette:** `Cmd/Ctrl + K` navigation for power users.
- **Spot Management:** Comprehensive dashboard for administrators to manage parking inventory.
- **User Profiles:** Secure management of personal data and booking history.
- **Responsive Design:** Optimized for mobile users on the go in the city.

---

## 🛠 TECH STACK

- **Framework:** [Nuxt 4+](https://nuxt.com/) (Vue 3)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **Animations:** [GSAP (GreenSock Animation Platform)](https://greensock.com/gsap/)
- **Mapping:** [Leaflet](https://leafletjs.com/)
- **Icons:** [Nuxt Icon](https://nuxt.com/modules/icon)
- **Utilities:** [VueUse](https://vueuse.org/)
- **Package Manager:** [Bun](https://bun.sh/)

---

## 📦 GETTING STARTED

### Prerequisites
- [Bun](https://bun.sh/) (Recommended) or Node.js (v18+)

### Installation
```bash
# Clone the repository
git clone git@github.com:Arlind-tbz/modul-241_245.git
cd parkingappsulejundsiyad

# Install dependencies
bun install
```

### Development
```bash
# Start the dev server with hot reload
bun run dev
```

### Build
```bash
# Build for production
bun run build

# Preview production build
bun run preview
```

---

## 📂 PROJECT STRUCTURE

- `components/`: UI library including the `ZurichMap`, `CommandPalette`, and `MagneticCursor`.
- `composables/`: Business logic for authentication (`useAuth`), spot management (`useSpots`), and UI state (`useUI`).
- `pages/`: Application routes (Home, Spots, Profile, Admin, etc.).
- `assets/`: Global styles and neon theme configurations.
- `public/`: Static assets.

---

## ⚖️ LICENSE

© 2026 Parkplatz Sharing Zürich. Built for Modul 241/245.
