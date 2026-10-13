# 3D Avatar Portfolio

Three.js + Vite. Scroll-driven 3D avatar, timeline, work grid, physics tech stack and contact section.

## Run locally
    npm install
    npm run dev          # opens http://localhost:5173

## Production build
    npm run build        # output in dist/
    npm run preview

## Deploy
    npx vercel           # or drag the dist/ folder to Netlify

## Customize
- Text, name, projects, links: `index.html` (search "Your Name", "you@example.com", "your-username")
- Tech stack bubbles: the `L` array in `src/main.js`
- Avatar colors: `skin`, `hood`, `white` materials in `src/main.js`
- Theme colors: CSS variables at top of `src/style.css`
