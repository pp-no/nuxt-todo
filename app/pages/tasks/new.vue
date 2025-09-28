<template>
  <div class="rounded-2xl border bg-white p-6 shadow-sm">
    <h2 class="mb-4 text-lg font-semibold">タスク追加</h2>

    <form class="space-y-4" @submit.prevent="handleSubmit">
      <div>
        <label class="block text-sm font-medium text-gray-700">タイトル</label>
        <input
          v-model="form.title"
          type="text"
          required
          class="mt-1 w-full rounded-xl border-gray-300 focus:border-gray-900 focus:ring-gray-900"
          placeholder="タスク名を入力"
        />
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700">詳細（任意）</label>
        <textarea
          v-model="form.description"
          rows="3"
          class="mt-1 w-full rounded-xl border-gray-300 focus:border-gray-900 focus:ring-gray-900"
          placeholder="補足メモがあれば"
        />
      </div>

      <div class="flex items-center gap-2">
        <input id="done" v-model="form.done" type="checkbox" class="h-4 w-4 rounded border-gray-300" />
        <label for="done" class="text-sm text-gray-700">完了として追加</label>
      </div>

      <div class="flex items-center justify-end gap-2 pt-2">
        <NuxtLink to="/" class="rounded-xl border px-4 py-2 text-gray-700 hover:bg-gray-50">キャンセル</NuxtLink>
        <button
          type="submit"
          class="rounded-xl bg-gray-900 px-4 py-2 text-white hover:opacity-90 disabled:opacity-50"
          :disabled="submitting || !form.title.trim()"
        >
          保存
        </button>
      </div>

      <p v-if="errorMsg" class="text-sm text-red-600">{{ errorMsg }}</p>
    </form>
  </div>
</template>

<script setup lang="ts">
const router = useRouter()
const { create } = useTasks() // composable は自動インポート

const form = reactive({
  title: '',
  description: '',
  done: false
})

const submitting = ref(false)
const errorMsg = ref('')

const handleSubmit = async () => {
  errorMsg.value = ''
  if (!form.title.trim()) {
    errorMsg.value = 'タイトルは必須です'
    return
  }
  submitting.value = true
  try {
    await create({
      title: form.title.trim(),
      description: form.description.trim(),
      done: form.done
    })
    router.push('/') // 追加後TOPへ
  } catch (e) {
    console.error(e)
    errorMsg.value = '追加に失敗しました'
  } finally {
    submitting.value = false
  }
}
</script>
