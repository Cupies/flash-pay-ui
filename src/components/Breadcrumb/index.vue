<template>
  <el-breadcrumb
    class="app-breadcrumb"
    separator="/"
  >
    <transition-group name="breadcrumb">
      <el-breadcrumb-item
        v-for="(item, index) in breadcrumbs"
        :key="item.path"
      >
        <span
          v-if="item.redirect === 'noredirect' || index === breadcrumbs.length-1"
          class="no-redirect"
        >{{ item.meta.title }}</span>
        <a
          v-else
          @click.prevent="handleLink(item)"
          class="titles"
        >{{ item.meta.title }}</a>
      </el-breadcrumb-item>
    </transition-group>
  </el-breadcrumb>
</template>

<script>
import { defineComponent, ref, watch, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import pathToRegexp from 'path-to-regexp'

export default defineComponent({
  name: 'Breadcrumb',
  setup() {
    const route = useRoute()
    const router = useRouter()
    const breadcrumbs = ref([])
    
    // 获取面包屑导航
    const getBreadcrumb = () => {
      let matched = route.matched.filter(
        item => item.meta && item.meta.title
      )
      const first = matched[0]
      if (!isDashboard(first)) {
        matched = [
          { path: '/', meta: { title: '闪聚支付' } }
        ].concat(matched)
      }
      breadcrumbs.value = matched.filter(item => {
        return item.meta && item.meta.title && item.meta.breadcrumb !== false
      })
    }
    
    // 检查是否是仪表盘
    const isDashboard = (route) => {
      const name = route && route.meta && route.meta.title
      return name === 'Dashboard'
    }
    
    // 路径编译
    const pathCompile = (path) => {
      const toPath = pathToRegexp.compile(path)
      return toPath(route.params)
    }
    
    // 处理链接点击
    const handleLink = (item) => {
      const { redirect, path } = item
      if (redirect) {
        router.push(redirect)
        return
      }
      router.push(pathCompile(path))
    }
    
    // 监听路由变化
    watch(() => route.path, (newPath) => {
      // 如果跳转到重定向页面，不更新面包屑
      if (newPath.startsWith('/redirect/')) {
        return
      }
      getBreadcrumb()
    })
    
    // 组件挂载时获取面包屑
    onMounted(() => {
      getBreadcrumb()
    })
    
    return {
      breadcrumbs,
      handleLink
    }
  }
})
</script>

<style lang="scss" scoped>
.el-breadcrumb__inner,
.el-breadcrumb__inner a {
  font-weight: 400 !important;
}

.app-breadcrumb.el-breadcrumb {
  display: inline-block;
  font-size: 14px;
  line-height: 50px;
  margin-left: 8px;

  .no-redirect {
    color: rgb(17, 16, 16);
    cursor: text;
  }
  .titles {
    color: rgb(22, 20, 20);
  }
}
</style>
