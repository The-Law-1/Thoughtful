<template>
    <main class="grid min-h-main px-4 bg-white place-content-center">
      <div class="text-center">
        <h1 class="font-black text-gunmetal text-9xl">404</h1>
        <p class="text-2xl font-bold tracking-tight text-gunmetal sm:text-4xl">
          Uh-oh!
        </p>
        <p class="mt-4 text-gunmetal">Page not found</p>
        <button
          @click="() => router.back()"
          class="mt-8 flex items-center w-auto transition-all hover:text-snow hover:bg-gunmetal border-2 border-gunmetal text-gunmetal rounded-lg text-center leading-5 px-5 py-1 m-auto"
        >
          Retourner à la page précedente
        </button>
      </div>
    </main>
  </template>
  <script setup lang="ts">
  import { useRouter } from "vue-router";
  
  const router = useRouter();
  </script>
  