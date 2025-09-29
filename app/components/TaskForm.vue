<template>
  <form class="space-y-6" @submit.prevent="onSubmit">
    <!-- タイトル入力 -->
    <div class="space-y-2">
      <label for="title" class="flex items-center text-sm font-semibold text-gray-900">
        <svg class="mr-2 h-5 w-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        タイトル
        <span class="ml-1 text-red-500">*</span>
      </label>
      <div class="relative">
        <input
          id="title"
          v-model="model.title"
          type="text"
          required
          placeholder="例: プロジェクトの企画書を作成"
          maxlength="100"
          class="w-full rounded-xl border-2 border-gray-300 bg-white px-4 py-3 text-gray-900 placeholder-gray-400 transition-all focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-100"
          :class="{ 'border-red-300 focus:border-red-500 focus:ring-red-100': titleError }"
        />
        <div class="absolute right-3 top-3 text-xs text-gray-400">
          {{ model.title.length }}/100
        </div>
      </div>
      <p v-if="titleError" class="flex items-center gap-1 text-sm text-red-600">
        <svg class="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
        </svg>
        タイトルを入力してください
      </p>
    </div>

    <!-- 詳細入力 -->
    <div class="space-y-2">
      <label for="description" class="flex items-center text-sm font-semibold text-gray-900">
        <svg class="mr-2 h-5 w-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h7" />
        </svg>
        詳細
        <span class="ml-2 rounded-full bg-gray-200 px-2 py-0.5 text-xs text-gray-600">任意</span>
      </label>
      <div class="relative">
        <textarea
          id="description"
          v-model="model.description"
          rows="4"
          placeholder="タスクの詳細や補足情報を入力..."
          maxlength="500"
          class="w-full resize-none rounded-xl border-2 border-gray-300 bg-white px-4 py-3 text-gray-900 placeholder-gray-400 transition-all focus:border-purple-500 focus:outline-none focus:ring-4 focus:ring-purple-100"
        />
        <div class="absolute bottom-3 right-3 text-xs text-gray-400">
          {{ descriptionLength }}/500
        </div>
      </div>
    </div>

    <!-- 完了チェックボックス -->
    <div class="rounded-xl border-2 border-gray-200 bg-gray-50 p-4 transition-all hover:border-gray-300">
      <label class="flex cursor-pointer items-center justify-between">
        <div class="flex items-center gap-3">
          <div class="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100">
            <svg class="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <div class="font-semibold text-gray-900">完了済みとしてマーク</div>
            <div class="text-sm text-gray-500">このタスクは既に完了しています</div>
          </div>
        </div>
        <input
          id="done"
          v-model="model.done"
          type="checkbox"
          class="h-6 w-6 cursor-pointer rounded-lg border-2 border-gray-300 text-green-600 transition-all focus:ring-4 focus:ring-green-100 focus:ring-offset-0"
        />
      </label>
    </div>

    <!-- ボタングループ -->
    <div class="flex items-center justify-end gap-3 border-t pt-6">
      <NuxtLink
        to="/"
        class="flex items-center gap-2 rounded-xl border-2 border-gray-300 bg-white px-6 py-3 font-semibold text-gray-700 transition-all hover:border-gray-400 hover:bg-gray-50"
      >
        <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
        キャンセル
      </NuxtLink>
      
      <button
        type="submit"
        class="group flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-3 font-semibold text-white shadow-lg transition-all hover:scale-105 hover:shadow-xl disabled:scale-100 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:shadow-lg"
        :disabled="submitting || !model.title.trim()"
      >
        <svg
          v-if="submitting"
          class="h-5 w-5 animate-spin"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
        <svg
          v-else
          class="h-5 w-5 transition-transform group-hover:scale-110"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
        </svg>
        <span>{{ submitting ? '保存中...' : props.initial?.id ? '更新する' : '作成する' }}</span>
      </button>
    </div>

    <!-- 保存のヒント -->
    <div class="rounded-xl bg-blue-50 p-4">
      <div class="flex gap-3">
        <svg class="h-5 w-5 flex-shrink-0 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" />
        </svg>
        <div class="text-sm text-blue-800">
          <p class="font-semibold">ヒント</p>
          <p class="mt-1 text-blue-700">タスクは後からいつでも編集できます。まずは思いついたことを気軽に追加しましょう！</p>
        </div>
      </div>
    </div>
  </form>
</template>

<script setup lang="ts">
import type { Task } from "../types/task";

const props = defineProps<{ initial?: Partial<Task>; submitting?: boolean }>();
const emit = defineEmits<{ (e: "submit", value: Task): void }>();
const submitting = computed(() => !!props.submitting);

// 内部フォームモデル
const model = reactive<Task>({
  title: "",
  description: "",
  done: false,
});

// バリデーション
const titleError = computed(() => {
  return model.title.length === 0 && model.title !== props.initial?.title;
});

const descriptionLength = computed(() => {
  return model.description?.length || 0;
});

// initial の内容をフォームに流し込む（編集時に必須）
watch(
  () => props.initial,
  (v) => {
    if (!v) return;
    model.title = v.title ?? "";
    model.description = v.description ?? "";
    model.done = !!v.done;
  },
  { immediate: true, deep: true }
);

const onSubmit = () => {
  if (!model.title.trim()) return;
  emit("submit", {
    title: model.title.trim(),
    description: model.description?.trim(),
    done: model.done,
  });
};
</script>

<style scoped>
/* フォーカス時のアニメーション */
input:focus,
textarea:focus {
  transform: translateY(-1px);
}

/* チェックボックスのカスタムスタイル */
input[type="checkbox"]:checked {
  background-image: url("data:image/svg+xml,%3csvg viewBox='0 0 16 16' fill='white' xmlns='http://www.w3.org/2000/svg'%3e%3cpath d='M12.207 4.793a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0l-2-2a1 1 0 011.414-1.414L6.5 9.086l4.293-4.293a1 1 0 011.414 0z'/%3e%3c/svg%3e");
}
</style>