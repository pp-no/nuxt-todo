<template>
  <div class="rounded-2xl border bg-white p-6 shadow-sm">
    <h2 class="mb-4 text-lg font-semibold">タスク編集</h2>

    <div v-if="pending" class="text-gray-500">読み込み中...</div>
    <div v-else-if="!task" class="text-red-600">タスクが見つかりません。</div>

    <TaskForm v-else :key="task?.id" :initial="task" @submit="handleSubmit" />

    <div class="mt-4">
      <NuxtLink to="/" class="text-sm text-gray-600 underline"
        >一覧に戻る</NuxtLink
      >
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Task } from "../../../types/task";

const route = useRoute();
const router = useRouter();
const { getById, update } = useTasks();

const task = ref<Task | null>(null);
const pending = ref(true);

onMounted(async () => {
  const id = String(route.params.id);
  task.value = await getById(id);
  pending.value = false;
});

const handleSubmit = async (payload: Task) => {
  if (!route.params.id) return;
  try {
    await update(String(route.params.id), {
      title: payload.title,
      description: payload.description,
      done: payload.done,
    });
    router.push("/");
  } catch (e) {
    console.error(e);
    alert("更新に失敗しました");
  }
};
</script>
