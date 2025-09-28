export default defineNuxtConfig({
  // ★ app/ 配下に pages・plugins 等を置く
  srcDir: 'app',

  // Tailwind（モジュール追加済み）
  modules: ['@nuxtjs/tailwindcss'],

  // グローバルCSS
  css: ['~/assets/css/tailwind.css'],

  // 環境変数（特に不要だが、型補完のため public を明示しておくと便利）
  runtimeConfig: {
    public: {
      firebase: {
        apiKey: process.env.NUXT_PUBLIC_FIREBASE_API_KEY,
        authDomain: process.env.NUXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
        projectId: process.env.NUXT_PUBLIC_FIREBASE_PROJECT_ID,
        storageBucket: process.env.NUXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
        messagingSenderId: process.env.NUXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
        appId: process.env.NUXT_PUBLIC_FIREBASE_APP_ID,
        measurementId: process.env.NUXT_PUBLIC_FIREBASE_MEASUREMENT_ID
      }
    }
  },

  // 便利系
  devtools: { enabled: true }
})
