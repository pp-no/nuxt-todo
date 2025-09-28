<template>
  <form class="space-y-4" @submit.prevent="onSubmit">
    <div>
      <label class="block text-sm font-medium text-gray-700">タイトル</label>
      <input
        v-model="model.title"
        type="text"
        required
        class="mt-1 w-full rounded-xl border-gray-300 focus:border-gray-900 focus:ring-gray-900"
      />
    </div>

    <div>
      <label class="block text-sm font-medium text-gray-700">詳細（任意）</label>
      <textarea
        v-model="model.description"
        rows="3"
        class="mt-1 w-full rounded-xl border-gray-300 focus:border-gray-900 focus:ring-gray-900"
      />
    </div>

    <div class="flex items-center gap-2">
      <input id="done" v-model="model.done" type="checkbox" class="h-4 w-4 rounded border-gray-300" />
      <label for="done" class="text-sm text-gray-700">完了</label>
    </div>

    <div class="flex items-center justify-end gap-2 pt-2">
      <NuxtLink to="/" class="rounded-xl border px-4 py-2 text-gray-700 hover:bg-gray-50">
        キャンセル
      </NuxtLink>
      <button type="submit" class="rounded-xl bg-gray-900 px-4 py-2 text-white hover:opacity-90">
        保存
      </button>
    </div>
  </form>
</template>

<script setup lang="ts">
import type { Task } from '../types/task'
const model = reactive<Task>({ title: '', description: '', done: false })
const emit = defineEmits<{ (e: 'submit', value: Task): void }>()

const onSubmit = () => {
  if (!model.title.trim()) return
  emit('submit', {
    title: model.title.trim(),
    description: model.description?.trim(),
    done: model.done
  })
}
</script>
