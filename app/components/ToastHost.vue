<template>
  <Teleport to="body">
    <div class="fixed right-4 top-4 z-[100] flex w-[min(92vw,360px)] flex-col gap-2">
      <div
        v-for="t in toasts"
        :key="t.id"
        :class="[
          'rounded-xl px-4 py-3 shadow-lg border text-sm',
          t.type === 'success' ? 'bg-green-50 border-green-200 text-green-800' :
          t.type === 'error'   ? 'bg-red-50 border-red-200 text-red-800' :
                                 'bg-gray-50 border-gray-200 text-gray-800'
        ]"
      >
        {{ t.message }}
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
const { toasts } = useToast()
</script>
