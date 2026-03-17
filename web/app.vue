<template>
  <div class="min-h-screen bg-obsidian text-white font-sans selection:bg-neon selection:text-obsidian relative">
    <div class="noise-overlay"></div>
    <MagneticCursor />
    <CommandPalette />
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>

<script setup>
import '~/assets/css/main.css'
</script>
