<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4 sm:p-6">
    <div class="mx-auto max-w-4xl">
      <!-- ヘッダー -->
      <div class="mb-8">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-3xl font-bold text-gray-900 sm:text-4xl">📝 マイタスク</h1>
            <p class="mt-1 text-sm text-gray-500">{{ formattedDate }}</p>
          </div>
          <NuxtLink
            to="/tasks/new"
            class="group flex items-center gap-2 rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 px-5 py-3 text-white shadow-lg transition-all hover:scale-105 hover:shadow-xl"
          >
            <span class="text-xl font-bold">+</span>
            <span class="font-semibold">新規作成</span>
          </NuxtLink>
        </div>

        <!-- 統計情報 -->
        <div v-if="tasks.length > 0" class="mt-6 grid grid-cols-3 gap-3">
          <div class="rounded-2xl bg-white p-4 shadow-sm">
            <div class="text-2xl font-bold text-gray-900">{{ tasks.length }}</div>
            <div class="text-xs text-gray-500">全タスク</div>
          </div>
          <div class="rounded-2xl bg-green-50 p-4 shadow-sm">
            <div class="text-2xl font-bold text-green-600">{{ completedCount }}</div>
            <div class="text-xs text-green-600">完了</div>
          </div>
          <div class="rounded-2xl bg-blue-50 p-4 shadow-sm">
            <div class="text-2xl font-bold text-blue-600">{{ pendingCount }}</div>
            <div class="text-xs text-blue-600">未完了</div>
          </div>
        </div>
      </div>

      <!-- ローディング状態 -->
      <div v-if="loading" class="flex flex-col items-center justify-center py-20">
        <div class="h-12 w-12 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600"></div>
        <p class="mt-4 text-gray-500">読み込み中...</p>
      </div>

      <!-- 空の状態 -->
      <div v-else-if="!tasks.length" class="flex flex-col items-center justify-center py-20">
        <div class="mb-6 text-8xl">📋</div>
        <h3 class="mb-2 text-2xl font-bold text-gray-900">タスクがありません</h3>
        <p class="mb-6 text-gray-500">最初のタスクを作成して始めましょう！</p>
        <NuxtLink
          to="/tasks/new"
          class="rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-4 font-semibold text-white shadow-lg transition-all hover:scale-105 hover:shadow-xl"
        >
          ✨ タスクを作成する
        </NuxtLink>
      </div>

      <!-- タスクリスト -->
      <div v-else class="space-y-4">
        <!-- フィルターボタン -->
        <div class="flex gap-2 overflow-x-auto pb-2">
          <button
            v-for="filter in filters"
            :key="filter.value"
            @click="currentFilter = filter.value"
            :class="[
              'whitespace-nowrap rounded-xl px-4 py-2 text-sm font-medium transition-all',
              currentFilter === filter.value
                ? 'bg-gray-900 text-white shadow-lg'
                : 'bg-white text-gray-600 hover:bg-gray-50'
            ]"
          >
            {{ filter.label }} ({{ getFilteredCount(filter.value) }})
          </button>
        </div>

        <!-- タスクカード -->
        <TransitionGroup name="list" tag="div" class="space-y-3">
          <TaskCard
            v-for="t in filteredTasks"
            :key="t.id"
            :task="t"
            @toggle="(next: boolean) => toggleDone(t, next)"
            class="transform transition-all hover:scale-[1.02]"
          />
        </TransitionGroup>

        <!-- 完了タスクが非表示の場合のメッセージ -->
        <div v-if="currentFilter === 'pending' && completedCount > 0" class="text-center">
          <button
            @click="currentFilter = 'all'"
            class="text-sm text-gray-500 hover:text-gray-700 hover:underline"
          >
            完了済みタスク {{ completedCount }}件を表示
          </button>
        </div>
      </div>

      <!-- エラーメッセージ -->
      <div
        v-if="error"
        class="mt-6 rounded-2xl border-2 border-red-200 bg-red-50 p-4 text-red-700"
      >
        <div class="flex items-start gap-3">
          <span class="text-xl">⚠️</span>
          <div>
            <p class="font-semibold">エラーが発生しました</p>
            <p class="mt-1 text-sm">コンソールで詳細を確認してください。</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Task } from '../types/task'

const { tasks, loading, error, fetchAll, watchAll, update } = useTasks()

// フィルター状態
const currentFilter = ref<'all' | 'pending' | 'completed'>('all')

const filters = [
  { value: 'all' as const, label: 'すべて' },
  { value: 'pending' as const, label: '未完了' },
  { value: 'completed' as const, label: '完了済み' }
]

// 日付フォーマット
const formattedDate = computed(() => {
  const now = new Date()
  return now.toLocaleDateString('ja-JP', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long'
  })
})

// 統計情報
const completedCount = computed(() => tasks.value.filter(t => t.done).length)
const pendingCount = computed(() => tasks.value.filter(t => !t.done).length)

// フィルタリングされたタスク
const filteredTasks = computed(() => {
  if (currentFilter.value === 'pending') {
    return tasks.value.filter(t => !t.done)
  }
  if (currentFilter.value === 'completed') {
    return tasks.value.filter(t => t.done)
  }
  return tasks.value
})

// フィルター別のカウント
const getFilteredCount = (filter: 'all' | 'pending' | 'completed') => {
  if (filter === 'pending') return pendingCount.value
  if (filter === 'completed') return completedCount.value
  return tasks.value.length
}

onMounted(async () => {
  try {
    await fetchAll()
  } catch (e) {
    console.error(e)
  }
  watchAll()
})

const toggleDone = async (t: Task, next: boolean) => {
  if (!t.id) return
  try {
    await update(t.id, { done: next })
  } catch (e) {
    console.error(e)
  }
}
</script>

<style scoped>
/* リストアニメーション */
.list-enter-active,
.list-leave-active {
  transition: all 0.3s ease;
}

.list-enter-from {
  opacity: 0;
  transform: translateY(-10px);
}

.list-leave-to {
  opacity: 0;
  transform: translateX(20px);
}

.list-move {
  transition: transform 0.3s ease;
}
</style>