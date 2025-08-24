<template>
  <div class="app-container">
    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
    >
      <el-table-column
        align="center"
        label="ID"
        width="95"
      >
        <template slot-scope="scope">
          {{ scope.$index }}
        </template>
      </el-table-column>
      <el-table-column label="Title">
        <template slot-scope="scope">
          {{ scope.row.title }}
        </template>
      </el-table-column>
      <el-table-column
        label="Author"
        width="180"
        align="center"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.author }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="Pageviews"
        width="110"
        align="center"
      >
        <template slot-scope="scope">
          {{ scope.row.pageviews }}
        </template>
      </el-table-column>
      <el-table-column
        class-name="status-col"
        label="Status"
        width="110"
        align="center"
      >
        <template slot-scope="scope">
          <el-tag :type="scope.row.status | statusFilter">
            {{ scope.row.status }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        prop="created_at"
        label="Created at"
        width="250"
      >
        <template slot-scope="scope">
          <i class="el-icon-time" />
          <span>{{ scope.row.timestamp | parseTime }}</span>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { ref, reactive, onMounted } from 'vue'
import { getArticles } from '@/api/articles'

export default {
  name: 'Table',
  setup() {
    // 响应式数据
    const list = ref([])
    const listLoading = ref(true)
    const listQuery = reactive({
      page: 1,
      limit: 20
    })

    // 状态过滤函数 (替代过滤器)
    const statusFilter = (status) => {
      const statusMap = {
        published: 'success',
        draft: 'gray',
        deleted: 'danger'
      }
      return statusMap[status] || ''
    }

    // 时间格式化函数 (替代过滤器)
    const parseTime = (timestamp) => {
      return new Date(timestamp).toISOString()
    }

    // 获取文章列表
    const getList = async () => {
      listLoading.value = true
      try {
        const { data } = await getArticles(listQuery)
        list.value = data.items
      } finally {
        // 模拟请求延迟
        setTimeout(() => {
          listLoading.value = false
        }, 500)
      }
    }

    // 组件挂载时获取数据
    onMounted(() => {
      getList()
    })

    return {
      list,
      listLoading,
      listQuery,
      statusFilter,
      parseTime,
      getList
    }
  }
}
</script>