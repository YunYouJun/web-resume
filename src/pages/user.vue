<script lang="ts" setup>
const user = useUserStore()
</script>

<template>
  <div px="4" max-w-xl m-auto text-center>
    <h2 text-4xl mt="8" my="4">
      用户设置
    </h2>
    <small>
      用户敏感信息（只保留在本地）
    </small>

    <div>
      <button class="resume-btn" rounded-full p="2" border="2px solid black" mt="6" text-2xl @click="user.settings.overrideInfo = !user.settings.overrideInfo">
        <div v-if="user.settings.overrideInfo" i-ri-eye-line />
        <div v-else i-ri-eye-off-line />
      </button>

      <div class="ylf-input-container">
        <label class="ylf-input-label" for="name">姓名</label>
        <input v-model="user.userInfo.name" class="ylf-input">
      </div>
      <div class="ylf-input-container">
        <label class="ylf-input-label" for="phone">电话</label>
        <input v-model="user.userInfo.phone" class="ylf-input">
      </div>
      <div class="ylf-input-container">
        <label class="ylf-input-label" for="email">邮箱</label>
        <input v-model="user.userInfo.email" class="ylf-input">
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.ylf-input {
  border: 1px solid #ccc;
  border-radius: 4px;
  padding: 4px 8px;
  outline: none;
  width: 100%;
  background-color: transparent;

  &-container {
    margin: 2rem 0;
  }

  &-label {
    display: block;
    text-align: left;
    margin-bottom: 8px;
    opacity: 0.8;
  }

  &:focus {
    border-color: #000;
  }
}
</style>
