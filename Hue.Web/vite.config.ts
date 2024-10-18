import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), VitePWA({
    includeAssets: ['favicon.ico', 'icon180.png'],
    manifest: {
      name: 'Hue',
      short_name: 'Hue',
      description: "Hue is your new home for commission management, planning, and tracking. See where your commissions stand in one easy board. Track the artists you've worked with, their works, and their prices. See your characters and how much you've commissioned for them. All in one place!",
      theme_color: '#5BA56A',
      background_color: "#000000",
      icons: [
        {
          src: 'icon192.png',
          sizes: '192x192',
          type: 'image/png'
        },
        {
          src: 'icon512.png',
          sizes: '512x512',
          type: 'image/png'
        }
      ]
    }
  })],
})
