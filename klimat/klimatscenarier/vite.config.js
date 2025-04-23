/*
 * Filnamn: vite.config.js
 * Beskrivning: Konfigurationsfil för Vite byggverktyg
 */

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/program/klimatscenarier/', // Uppdaterad sökväg för webbplatsstrukturen
})
