<template>
  <div
    v-if="!item.meta || !item.meta.hidden"
    :class="['menu-wrapper', isCollapse ? 'simple-mode' : 'full-mode', {'first-level': isFirstLevel}]"
  >
    <template v-if="theOnlyOneChild && !theOnlyOneChild.children">
      <sidebar-item-link
        v-if="theOnlyOneChild.meta"
        :to="resolvePath(theOnlyOneChild.path)"
      >
        <el-menu-item
          :index="resolvePath(theOnlyOneChild.path)"
          :class="{'submenu-title-noDropdown': isFirstLevel}"
        >
      
          <span
            v-if="theOnlyOneChild.meta.title"
            slot="title"
          >{{ theOnlyOneChild.meta.title }}</span>
        </el-menu-item>
      </sidebar-item-link>
    </template>
    <el-submenu
      v-else
      :index="resolvePath(item.path)"
      popper-append-to-body
    >
      <template slot="title">
  
        <span
          v-if="item.meta && item.meta.title"
          slot="title"
        >{{ item.meta.title }}</span>
      </template>
      <template v-if="item.children">
        <sidebar-item
          v-for="child in item.children"
          :key="child.path"
          :item="child"
          :is-collapse="isCollapse"
          :is-first-level="false"
          :base-path="resolvePath(child.path)"
          class="nest-menu"
        />
      </template>
    </el-submenu>
  </div>
</template>


<script>
import { defineComponent, computed } from 'vue'
import { isExternal } from '@/utils/validate'
import SidebarItemLink from './SidebarItemLink.vue'

export default defineComponent({
  name: 'SidebarItem',
  components: {
    SidebarItemLink
  },
  props: {
    item: {
      type: Object,
      required: true
    },
    isCollapse: {
      type: Boolean,
      default: false
    },
    isFirstLevel: {
      type: Boolean,
      default: true
    },
    basePath: {
      type: String,
      default: ''
    }
  },
  setup(props) {
    // 计算显示的子路由数量
    const showingChildNumber = computed(() => {
      if (props.item.children) {
        const showingChildren = props.item.children.filter(item => {
          return !(item.meta && item.meta.hidden)
        })
        return showingChildren.length
      }
      return 0
    })
    
    // 获取唯一的子路由
    const theOnlyOneChild = computed(() => {
      if (showingChildNumber.value > 1) {
        return null
      }
      if (props.item.children) {
        for (let child of props.item.children) {
          if (!child.meta || !child.meta.hidden) {
            return child
          }
        }
      }
      // 如果没有子路由，返回自身（去除路径）
      return { ...props.item, path: '' }
    })
    
    // 解析路径
    const resolvePath = (routePath) => {
      if (isExternal(routePath)) {
        return routePath
      }
      if (isExternal(props.basePath)) {
        return props.basePath
      }
      
      // 在浏览器环境中简单处理路径拼接
      if (routePath.startsWith('/')) {
        return routePath
      }
      
      // 处理相对路径
      const base = props.basePath.endsWith('/') ? props.basePath : props.basePath + '/'
      return base + routePath
    }
    
    return {
      showingChildNumber,
      theOnlyOneChild,
      resolvePath,
      isExternal
    }
  }
})
</script>

<style lang="scss">
@use '@/styles/variables.scss' as *;
.el-submenu.is-active > .el-submenu__title {
  color: $subMenuActiveText !important;
}

.el-submenu .el-submenu__title span{
  color: white;
}
.el-menu--horizontal {
  .el-menu {
    .el-menu-item {
      color: #000;
      background: white !important;
      &:hover {
        color:  $subMenuHover !important;
      }
    }
  }
}

.el-menu--popup {
  background: white !important;

}
 
.full-mode {
  width: 165px;
   background: white !important;
  .el-submenu>.el-submenu__title,
  .el-submenu .el-menu-item {
    height: 60px;
   text-align: center;
    background-color: $subMenuBg !important;

    &:hover {
      background-color: $subMenuHover !important;
    }

    .el-submenu__icon-arrow {
      display: none;
    }
  }

}

.simple-mode {
  width: 165px;
  &.first-level {
    width: 165px;
    .submenu-title-noDropdown {
      padding: 0 !important;
      position: relative;

      .el-tooltip {
        padding: 0 !important;
      }
    }

    .el-submenu {
      overflow: hidden;

      &>.el-submenu__title {
        padding: 0px !important;

        .el-submenu__icon-arrow {
          display: none;
        }

        &>span {
          visibility: hidden;
        }
      }
    }
  }
}
</style>

<style lang="scss" scoped>
.svg-icon {
  margin-right: 16px;
}

.simple-mode {
  .svg-icon {
    margin-left: 20px;
  }
}
</style>
