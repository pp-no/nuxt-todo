<template>
  <div class="flex items-start justify-between rounded-2xl border bg-white p-4 shadow-sm">
    <div class="flex items-start gap-3">
      <input
        type="checkbox"
        :checked="task.done"
        class="mt-1 h-5 w-5 rounded border-gray-300"
        @change="$emit('toggle', !task.done)"
      />
      <div>
        <p :class="['font-medium', task.done ? 'line-through text-gray-400' : 'text-gray-900']">
          {{ task.title }}
        </p>
        <p v-if="task.description" class="text-sm text-gray-500 mt-0.5">{{ task.description }}</p>
      </div>
    </div>
    <div class="flex items-center gap-2">
      <NuxtLink :to="`/tasks/${task.id}/edit`" class="p-2 rounded-lg hover:bg-gray-100" title="編集">
        ✏️
      </NuxtLink>
      <NuxtLink :to="`/tasks/${task.id}/delete`" class="p-2 rounded-lg hover:bg-red-50 text-red-600" title="削除">
        🗑️
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Task } from '../types/task'
defineProps<{ task: Task }>()
defineEmits<{ (e: 'toggle', next: boolean): void }>()
</script>
