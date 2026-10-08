# FORMA / Reimagine your home

A working architectural WebGL demo built with Vite, React, TypeScript, Tailwind CSS, Three.js, React Three Fiber, Drei, GSAP / ScrollTrigger, and Lucide.

## Run

Requires Node.js 20.19+ or 22.12+ and npm.

```sh
npm install
npm run dev
```

Open the local URL printed by Vite (normally http://localhost:5173).

```sh
npm run build
npm run preview
```

The build performs strict TypeScript checking and emits the static site to `dist/`. Deploy that directory to any static host such as Netlify, Vercel, Cloudflare Pages, or GitHub Pages. For a subdirectory deployment, set Vite's `base` in `vite.config.ts` before building. No environment variables, API keys, or backend are required.

## Experience

- A real WebGL architectural model with a layered two-storey pavilion, timber screens, glazed rooms, furniture, landscaping, reflecting pool, and terrace.
- GSAP introductory typography, camera reveal, pointer parallax, and a pinned scroll narrative with changing exterior materials and lighting strips.
- Original-finish comparison. This compares material palettes on the same architecture; it is not an existing property's survey or a structural remodel simulation.
- Live facade, accent, and roof choices with interpolated materials, day/dusk lighting, constrained orbit / touch controls, and reset view.
- Accessible native dialog with validated enquiry inputs and automatic configuration summary. The result is prepared locally and can be copied. **No email is sent and nothing is persisted or transmitted.**
- Responsive layout, reduced-motion preference handling, limited pixel ratio, one shared canvas, scoped ScrollTrigger cleanup, WebGL fallback, and a loading state.

## Structure

- `src/App.tsx`: editorial layout, configuration state, scroll choreography.
- `src/components/Architecture.tsx`: original procedural model, reusable geometry and live materials.
- `src/components/Scene.tsx`: renderer, lighting, camera direction, orbit controls, error boundary.
- `src/components/Enquiry.tsx`: validation, local enquiry creation and clipboard interaction.
- `src/types.ts`: configuration types and material palettes.
- `src/styles.css`: responsive art direction and motion preferences.

## Assets and attribution

All house, landscape, furniture, favicon, and grain geometry/artwork are authored in this project. There are no downloaded GLB assets, third-party textures, or external model requests. Google Fonts supplies Manrope (SIL Open Font License) and DM Sans (SIL Open Font License); system sans-serif fallbacks work offline. Lucide icons are ISC licensed. Package license information is included in the installed dependencies.

## Demo limits

This is an architectural concept, not a construction specification, quote calculation, or photorealistic visualization. Google Fonts needs an internet connection; the scene itself has no external asset dependency. Clipboard access requires localhost or HTTPS and browser permission; the prepared enquiry remains selectable when clipboard access fails. Reduced-motion mode removes the introductory camera sweep, pointer parallax, and text travel, and shortens the scroll sequence while keeping the user-controlled transformation available.
