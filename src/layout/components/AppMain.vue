<template>
  <section class="app-main">
    <transition
      name="fade-transform"
      mode="out-in"
    >
      <router-view />
    </transition>
  </section>
</template>

<script setup>
defineOptions({
  name: 'AppMain'
})
</script>

<style lang="scss" scoped>
.app-main {
  overflow: hidden;
}
</style>
