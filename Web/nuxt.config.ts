import { defineNuxtConfig } from 'nuxt'

// https://v3.nuxtjs.org/api/configuration/nuxt.config
export default defineNuxtConfig({
    // build: {
    //     transpile: ['@headless-ui/vue']
    // },
    ssr: false,
    modules: ['@nuxtjs/tailwindcss'],
    components: true,
    buildModules: [
        '@pinia/nuxt',
    ],
});