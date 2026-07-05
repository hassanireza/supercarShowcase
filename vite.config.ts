import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // GitHub Pages serves project sites (github.com/<user>/<repo>) from
  // /<repo>/ rather than the domain root, so asset URLs need that prefix —
  // otherwise every image/script 404s once deployed. Set via
  // GITHUB_PAGES_BASE in CI (see .github/workflows/ci.yml); defaults to "/"
  // for local dev and `vite preview`.
  base: process.env.GITHUB_PAGES_BASE ?? '/',
})
