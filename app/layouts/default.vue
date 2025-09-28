<template>
  <div class="min-h-screen bg-gray-50">
    <header class="sticky top-0 z-10 bg-white/80 backdrop-blur border-b">
      <div class="mx-auto max-w-4xl px-4 py-4">
        <h1 class="text-xl font-bold">Nuxt TODO</h1>
      </div>
    </header>
    <main class="mx-auto max-w-4xl px-4 py-8">
      <slot />
    </main>
    <ToastHost />
  </div>
</template>
