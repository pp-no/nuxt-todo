<template>
  <div
    :class="[
      'group relative overflow-hidden rounded-2xl border-2 bg-white p-5 shadow-sm transition-all duration-300',
      task.done 
        ? 'border-green-200 bg-green-50/30' 
        : 'border-gray-200 hover:border-blue-300 hover:shadow-md'
    ]"
  >
    <!-- 完了時の背景エフェクト -->
    <div
      v-if="task.done"
      class="absolute inset-0 bg-gradient-to-r from-green-50 to-emerald-50 opacity-50"
    ></div>

    <div class="relative flex items-start gap-4">
      <!-- カスタムチェックボックス -->
      <label class="relative flex cursor-pointer items-center">
        <input
          type="checkbox"
          :checked="task.done"
          class="peer sr-only"
          @change="handleToggle"
        />
        <div
          :class="[
            'flex h-6 w-6 items-center justify-center rounded-lg border-2 transition-all duration-300',
            task.done
              ? 'border-green-500 bg-green-500 shadow-sm'
              : 'border-gray-300 bg-white group-hover:border-blue-400'
          ]"
        >
          <svg
            v-if="task.done"
            class="h-4 w-4 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="3"
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
      </label>

      <!-- タスク内容 -->
      <div class="flex-1 min-w-0">
        <h3
          :class="[
            'text-base font-semibold transition-all duration-300',
            task.done 
              ? 'text-gray-400 line-through' 
              : 'text-gray-900'
          ]"
        >
          {{ task.title }}
        </h3>
        
        <p
          v-if="task.description"
          :class="[
            'mt-1 text-sm transition-all duration-300',
            task.done ? 'text-gray-400' : 'text-gray-600'
          ]"
        >
          {{ task.description }}
        </p>

        <!-- タスクのメタ情報（オプション） -->
        <div v-if="task.done" class="mt-2 flex items-center gap-2 text-xs text-green-600">
          <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span class="font-medium">完了済み</span>
        </div>
      </div>

      <!-- アクションボタン -->
      <div class="flex items-center gap-1">
        <NuxtLink
          :to="`/tasks/${task.id}/edit`"
          class="flex h-9 w-9 items-center justify-center rounded-lg text-gray-600 transition-all hover:bg-blue-100 hover:text-blue-600"
          title="編集"
        >
          <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
            />
          </svg>
        </NuxtLink>

        <NuxtLink
          :to="`/tasks/${task.id}/delete`"
          class="flex h-9 w-9 items-center justify-center rounded-lg text-gray-600 transition-all hover:bg-red-100 hover:text-red-600"
          title="削除"
        >
          <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
            />
          </svg>
        </NuxtLink>
      </div>
    </div>

    <!-- 完了時のアニメーション用オーバーレイ -->
    <div
      v-if="showCompleteEffect"
      class="pointer-events-none absolute inset-0 animate-pulse bg-green-400 opacity-20"
    ></div>
  </div>
</template>

<script setup lang="ts">
import type { Task } from '../types/task'

defineProps<{ task: Task }>()
const emit = defineEmits<{ (e: 'toggle', next: boolean): void }>()

const showCompleteEffect = ref(false)

const handleToggle = (event: Event) => {
  const target = event.target as HTMLInputElement
  const isDone = target.checked
  
  // 完了時にエフェクトを表示
  if (isDone) {
    showCompleteEffect.value = true
    setTimeout(() => {
      showCompleteEffect.value = false
    }, 600)
  }
  
  emit('toggle', isDone)
}
</script>

<style scoped>
/* カスタムアニメーション */
@keyframes checkmark {
  0% {
    transform: scale(0) rotate(0deg);
  }
  50% {
    transform: scale(1.2) rotate(180deg);
  }
  100% {
    transform: scale(1) rotate(360deg);
  }
}

.peer:checked + div svg {
  animation: checkmark 0.3s ease-in-out;
}
</style>