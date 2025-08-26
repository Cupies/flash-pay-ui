<template>
  <div class="navbar">
    <breadcrumb
      id="breadcrumb-container"
      class="breadcrumb-container"
    />
 
  </div>
</template>

<script setup>
import { appStore } from '@/store/modules/app'
import { useUserStore } from '@/store/modules/user'
import Breadcrumb from '@/components/Breadcrumb/index.vue'
const userStore = useUserStore()

defineOptions({
  name: 'Navbar'
})
</script>

<style lang="scss" scoped>
.navbar {
  height: 60px;
  padding: 10px 0 0 10px;
  box-sizing: border-box;
  background: #f3f6fb;
  font-size: 20px;
  margin-top: 50px;
  width: 1200px;
  margin: 0 auto;
  margin-top: 60px;

  .breadcrumb-container {
    float: left;
  }

}
</style>
