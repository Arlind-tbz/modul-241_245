<template>
  <div
    ref="cursor"
    class="fixed top-0 left-0 w-6 h-6 rounded-full border border-neon pointer-events-none z-[10000] mix-blend-difference"
    style="transform: translate(-50%, -50%);"
  ></div>
  <div
    ref="dot"
    class="fixed top-0 left-0 w-2 h-2 bg-neon rounded-full pointer-events-none z-[10000] mix-blend-difference"
    style="transform: translate(-50%, -50%);"
  ></div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useMouse } from '@vueuse/core'
import gsap from 'gsap'

const { x, y } = useMouse({ type: 'client' })
const cursor = ref<HTMLElement | null>(null)
const dot = ref<HTMLElement | null>(null)

onMounted(() => {
  watch([x, y], ([newX, newY]) => {
    if (dot.value) {
      gsap.to(dot.value, {
        x: newX,
        y: newY,
        duration: 0.1,
        ease: 'power2.out'
      })
    }
    if (cursor.value) {
      gsap.to(cursor.value, {
        x: newX,
        y: newY,
        duration: 0.6,
        ease: 'power3.out'
      })
    }
  }, { immediate: true })
})
</script>
