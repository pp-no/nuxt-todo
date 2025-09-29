<template>
  <Teleport to="body">
    <transition name="fade">
      <div v-if="open" class="fixed inset-0 z-50 flex items-center justify-center">
        <div class="absolute inset-0 bg-black/30" @click="$emit('cancel')"></div>
        <div class="relative z-10 w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
          <h3 class="text-lg font-semibold text-gray-900">{{ title }}</h3>
          <p v-if="message" class="mt-2 text-sm text-gray-600">{{ message }}</p>
          <div class="mt-6 flex justify-end gap-2">
            <button class="rounded-xl border px-4 py-2 text-gray-700 hover:bg-gray-50" @click="$emit('cancel')">
              キャンセル
            </button>
            <button class="rounded-xl bg-red-600 px-4 py-2 text-white hover:opacity-90" @click="$emit('confirm')">
              OK
            </button>
          </div>
        </div>
      </div>
    </transition>
  </Teleport>
</template>

<script setup lang="ts">
defineProps<{
  open: boolean
  title: string
  message?: string
}>()
defineEmits<{ (e: 'confirm'): void; (e: 'cancel'): void }>()
</script>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity .15s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
