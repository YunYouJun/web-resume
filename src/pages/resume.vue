<script setup lang="ts">
const route = useRoute()
const router = useRouter()
onMounted(() => {
  setTimeout(() => {
    router.push({
      path: '/',
      query: route.query,
    })
  }, 1000)
})
</script>

<template>
  <div class="w-full h-50 justify-center items-center" flex="~ col gap-4">
    <div class="op-80">
      重定向至首页
    </div>

    <div>
      Redirecting...
    </div>
  </div>
</template>
