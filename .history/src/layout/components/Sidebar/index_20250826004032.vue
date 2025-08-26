<template>
  <el-menu
    :collapse="false"
    :background-color="variables.menuBg"
    :text-color="variables.menuText"
    :active-text-color="variables.menuActiveText"
    :unique-opened="false"
    :collapse-transition="false"
    mode="horizontal"
  >
    <sidebar-item
      v-for="route in routes"
      :key="route.path"
      :item="route"
      :base-path="route.path"
      :is-collapse="false"
    />
  </el-menu>
</template>

<script setup>
import { computed } from 'vue'
import { appStore } from '@/store/modules/app'
import { permissionStore } from '@/store/modules/permission'
import SidebarItem from './SidebarItem.vue'

import variables from '@/styles/variables.scss?inline'
// ... 现有代码 ...

defineOptions({
  name: 'SideBar'
})

const sidebar = computed(() => appStore.sidebar)
const routes = computed(() => permissionStore.routes)
const variablesComputed = computed(() => variables)
const isCollapse = computed(() => !sidebar.value.opened)
</script>

<style lang="scss">
.sidebar-container {
  // reset element-ui css
  .horizontal-collapse-transition {
    transition: 0s width ease-in-out, 0s padding-left ease-in-out, 0s padding-right ease-in-out;
  }

  .scrollbar-wrapper {
    overflow-x: hidden !important;
  }

  .el-scrollbar__view {
    height: 100%
  }

  .el-scrollbar__bar {
    &.is-vertical {
      right: 0px;
    }

    &.is-horizontal {
      display: none;
    }
  }
}
</style>

<style lang="scss" scoped>

.el-menu {
  border: none;
  height: 100%;
  width: 100% !important;
  div {
    float: left;
  }
}
</style>
