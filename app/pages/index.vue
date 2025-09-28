<template>
  <div>
    <div class="mb-6 flex items-center justify-between">
      <h2 class="text-xl font-bold">タスク</h2>
      <NuxtLink
        to="/tasks/new"
        class="rounded-xl bg-gray-900 px-4 py-2 text-white hover:opacity-90"
      >
        ＋ 追加
      </NuxtLink>
    </div>

    <div v-if="loading" class="text-gray-500">読み込み中...</div>

    <div v-else-if="!tasks.length" class="rounded-2xl border bg-white p-6 text-gray-500">
      タスクはまだありません。
      <div class="mt-3">
        <NuxtLink to="/tasks/new" class="text-gray-900 underline">
          最初のタスクを作成
        </NuxtLink>
      </div>
    </div>

    <!-- ★ 素の <li> で必ず表示される最小レンダリング -->
    <ul v-else class="space-y-2">
      <li v-for="t in tasks" :key="t.id" class="rounded-xl border bg-white p-3">
        <div class="text-sm text-gray-500">{{ t.createdAt?.toLocaleString?.() || 'no date' }}</div>
        <div class="font-medium">{{ t.title }}</div>
        <div class="text-sm text-gray-600" v-if="t.description">{{ t.description }}</div>
        <div class="text-xs text-gray-500">done: {{ t.done ? 'true' : 'false' }}</div>
      </li>
    </ul>

    <p v-if="error" class="mt-4 text-sm text-red-600">
      エラーが発生しました。コンソールをご確認ください。
    </p>
  </div>
</template>

<script setup lang="ts">
import type { Task } from '~/types/task'
import { collection, getDocs } from 'firebase/firestore'

const { tasks, loading, error, fetchAll, watchAll } = useTasks()

// 直で叩いた結果（切り分け用）
const direct = ref<Task[]>([])

onMounted(async () => {
  const { $db } = useNuxtApp()

  // 直叩き（切り分け）
  try {
    const snap = await getDocs(collection($db, 'tasks'))
    direct.value = snap.docs.map(d => {
      const data: any = d.data()
      return {
        id: d.id,
        title: data.title,
        description: data.description,
        done: !!data.done,
        createdAt: data?.createdAt?.toDate?.() ?? undefined,
        updatedAt: data?.updatedAt?.toDate?.() ?? undefined
      }
    })
    console.log('[index] direct getDocs size:', direct.value.length)
  } catch (e) {
    console.error('[index] direct getDocs error:', e)
  }

  // まず一括取得 → その後購読
  try { await fetchAll() } catch (e) { console.error(e) }
  watchAll()
})

// いったん完了トグルは外しています（まずは表示を安定させる）
</script>
