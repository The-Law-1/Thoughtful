import { defineNuxtConfig } from 'nuxt'

// https://v3.nuxtjs.org/api/configuration/nuxt.config
export default defineNuxtConfig({
    // build: {
    //     transpile: ['@headless-ui/vue']
    // },
    ssr: false,
    modules: [
        '@nuxtjs/tailwindcss',
        '@nuxtjs/proxy',
        ],
    components: true,
    buildModules: [
        '@pinia/nuxt',
    ],
    proxy: {
        '/api': {
            target: process.env.BACKEND_URL || "http://localhost:8081",
            pathRewrite: { "/api": "" }, // try ^/api ?
            ws: true },

    }
});
