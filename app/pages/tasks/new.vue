<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4 sm:p-6">
    <div class="mx-auto max-w-3xl">
      <!-- ヘッダー -->
      <div class="mb-8">
        <NuxtLink
          to="/"
          class="group mb-4 inline-flex items-center gap-2 text-sm font-medium text-gray-600 transition-colors hover:text-gray-900"
        >
          <svg
            class="h-5 w-5 transition-transform group-hover:-translate-x-1"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M15 19l-7-7 7-7"
            />
          </svg>
          タスク一覧に戻る
        </NuxtLink>

        <div class="flex items-center gap-4">
          <div class="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-purple-500 shadow-lg">
            <svg class="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 4v16m8-8H4"
              />
            </svg>
          </div>
          <div>
            <h1 class="text-3xl font-bold text-gray-900">新しいタスクを追加</h1>
            <p class="mt-1 text-sm text-gray-500">タスクの情報を入力してください</p>
          </div>
        </div>
      </div>

      <!-- メインコンテンツカード -->
      <div class="rounded-3xl border-2 border-gray-200 bg-white p-6 shadow-xl sm:p-8">
        <!-- 成功メッセージ -->
        <Transition name="fade">
          <div
            v-if="showSuccess"
            class="mb-6 flex items-start gap-3 rounded-2xl border-2 border-green-200 bg-green-50 p-4"
          >
            <div class="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-green-500">
              <svg class="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <div>
              <p class="font-semibold text-green-900">タスクを作成しました！</p>
              <p class="mt-1 text-sm text-green-700">一覧ページに移動します...</p>
            </div>
          </div>
        </Transition>

        <!-- エラーメッセージ -->
        <Transition name="fade">
          <div
            v-if="errorMsg"
            class="mb-6 flex items-start gap-3 rounded-2xl border-2 border-red-200 bg-red-50 p-4"
          >
            <svg
              class="h-6 w-6 flex-shrink-0 text-red-500"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fill-rule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clip-rule="evenodd"
              />
            </svg>
            <div>
              <p class="font-semibold text-red-900">エラーが発生しました</p>
              <p class="mt-1 text-sm text-red-700">{{ errorMsg }}</p>
            </div>
          </div>
        </Transition>

        <!-- フォーム -->
        <TaskForm :submitting="submitting" @submit="handleSubmit" />
      </div>

      <!-- クイックヒントカード -->
      <div class="mt-6 grid gap-4 sm:grid-cols-2">
        <div class="rounded-2xl border border-blue-200 bg-blue-50 p-4">
          <div class="mb-2 flex items-center gap-2">
            <svg class="h-5 w-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M13 10V3L4 14h7v7l9-11h-7z"
              />
            </svg>
            <span class="font-semibold text-blue-900">クイックアクセス</span>
          </div>
          <p class="text-sm text-blue-700">
            タスクは後からいつでも編集・削除できます
          </p>
        </div>

        <div class="rounded-2xl border border-purple-200 bg-purple-50 p-4">
          <div class="mb-2 flex items-center gap-2">
            <svg class="h-5 w-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
              />
            </svg>
            <span class="font-semibold text-purple-900">ヒント</span>
          </div>
          <p class="text-sm text-purple-700">
            詳細は任意です。まずは気軽に追加しましょう
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const router = useRouter()
const { create } = useTasks()

const submitting = ref(false)
const errorMsg = ref('')
const showSuccess = ref(false)

const handleSubmit = async (task: any) => {
  errorMsg.value = ''
  submitting.value = true

  try {
    await create({
      title: task.title,
      description: task.description,
      done: task.done
    })

    // 成功メッセージを表示
    showSuccess.value = true

    // 少し待ってからリダイレクト
    setTimeout(() => {
      router.push('/')
    }, 1500)
  } catch (e) {
    console.error(e)
    errorMsg.value = 'タスクの追加に失敗しました。もう一度お試しください。'
    submitting.value = false
  }
}
</script>

<style scoped>
/* フェードアニメーション */
.fade-enter-active,
.fade-leave-active {
  transition: all 0.3s ease;
}

.fade-enter-from {
  opacity: 0;
  transform: translateY(-10px);
}

.fade-leave-to {
  opacity: 0;
  transform: translateY(10px);
}
</style>