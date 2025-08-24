<template>
  <div
    :class="{'hidden': hidden}"
    class="pagination-container"
  >
    <el-pagination
      :background="background"
      :current-page.sync="currentPage"
      :page-size.sync="pageSize"
      :layout="layout"
      :page-sizes="pageSizes"
      :total="total"
      v-bind="$attrs"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </div>
</template>

<script>
import { defineComponent, computed } from 'vue'
import { scrollTo } from '@/utils/scroll-to'

export default defineComponent({
  name: 'Pagination',
  props: {
    total: {
      type: Number,
      required: true
    },
    page: {
      type: Number,
      default: 1
    },
    limit: {
      type: Number,
      default: 20
    },
    pageSizes: {
      type: Array,
      default: () => [10, 20, 30, 50]
    },
    layout: {
      type: String,
      default: 'total, sizes, prev, pager, next, jumper'
    },
    background: {
      type: Boolean,
      default: true
    },
    autoScroll: {
      type: Boolean,
      default: true
    },
    hidden: {
      type: Boolean,
      default: false
    }
  },
  emits: ['update:page', 'update:limit', 'pagination'],
  setup(props, { emit }) {
    // 当前页码（计算属性）
    const currentPage = computed({
      get: () => props.page,
      set: (value) => emit('update:page', value)
    })
    
    // 每页显示数量（计算属性）
    const pageSize = computed({
      get: () => props.limit,
      set: (value) => emit('update:limit', value)
    })
    
    // 处理每页显示数量变化
    const handleSizeChange = (value) => {
      emit('pagination', { page: currentPage.value, limit: value })
      if (props.autoScroll) {
        scrollTo(0, 800)
      }
    }
    
    // 处理当前页码变化
    const handleCurrentChange = (value) => {
      emit('pagination', { page: value, limit: pageSize.value })
      if (props.autoScroll) {
        scrollTo(0, 800)
      }
    }
    
    return {
      currentPage,
      pageSize,
      handleSizeChange,
      handleCurrentChange
    }
  }
})
</script>

<style lang="scss" scoped>
.pagination-container {
  background: #fff;
  padding: 32px 16px;
}

.pagination-container.hidden {
  display: none;
}
</style>
