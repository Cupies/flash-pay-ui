<template>
  <div class="data-container">
      <h3>支付渠道管理</h3>
 
    <el-table
      v-loading="listLoading"
      :data="list"
      fit
      highlight-current-row
      :header-cell-style="{color:'#5373e0',background:'#f3f6fb'}"
      style="width: 100%"
    >
      <el-table-column align="center" label="支付ID">
        <template slot-scope="scope">
          <span>{{scope.row.id}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="支付名称">
        <template slot-scope="scope">
          <span>{{scope.row.channelName}}</span>
        </template>
      </el-table-column>

 
      <el-table-column align="center" label="支付编码">
        <template slot-scope="scope">
          <span>{{scope.row.channelCode}}</span>
        </template>
      </el-table-column>

    </el-table>

     

  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { ElMessage } from 'element-plus';
import { channelList } from '@/api/serve';

export default {
  name: 'audit',
  setup() {
    // 响应式数据（替代 data 属性）
    const list = ref([]);
    const pageNo = ref(1);
    const pageSize = ref(10);

    // 获取频道列表数据（替代 methods）
    const getList = async () => {
      try {
        const data = await channelList();
        list.value = data; // 注意：Vue 3 需通过 .value 更新响应式数据 [1,3](@ref)
      } catch (error) {
        ElMessage({
          type: 'error',
          message: '数据加载失败',
          duration: 2000
        });
        console.error('API 请求异常:', error);
      }
    };

    // 生命周期钩子（替代 created）
    onMounted(() => {
      getList(); // 组件挂载时自动加载数据 [2](@ref)
    });

    return {
      list,
      pageNo,
      pageSize,
      getList
    };
  }
};
</script>

<style lang="scss">
  .data-container {
    width: 1200px;
    margin: 00 auto;
    padding: 42px 44px;
    background: white;
    height: 100%;
  }
</style>

<style lang="scss" scoped>

</style>
