<template>
  <ConfirmDialog
    :open="open"
    title="本当に削除しますか？"
    message="この操作は取り消せません。"
    @confirm="doDelete"
    @cancel="onCancel"
  />
</template>

<script setup lang="ts">

const route = useRoute()
const router = useRouter()
const { remove } = useTasks()

const open = ref(false)

onMounted(() => {
  open.value = true
})

const doDelete = async () => {
  try {
    await remove(String(route.params.id))
    open.value = false
    router.push('/')
  } catch (e) {
    console.error(e)
    alert('削除に失敗しました')
  }
}

const onCancel = () => {
  open.value = false
  router.back()
}
</script>
