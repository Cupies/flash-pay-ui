<template>
  <div class="data-container">
      <h3>管理员管理</h3>
      <el-row type="flex" justify="end" class="add">
      <el-button type="primary" size="medium" @click="openSkuDialog" id="addBtn">新增</el-button>
    </el-row>

    <el-form :inline="true" size="medium" class="forms">
      <el-form-item label="账户/用户名:">
        <el-input v-model="skuName" placeholder="请输入"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="searchSku" id="searchBtn">查询</el-button>
      </el-form-item>
    </el-form>


    <el-table
      v-loading="listLoading"
      :data="list"
      fit
      highlight-current-row
      :header-cell-style="{color:'#5373e0',background:'#f3f6fb'}"
      style="width: 100%"
    >
      <el-table-column align="center" label="账号名称">
        <template slot-scope="scope">
          <span>{{scope.row.username}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="角色名称">
        <template slot-scope="scope">
          <span>{{scope.row.roleName}}</span>
        </template>
      </el-table-column>

 
      <el-table-column align="center" label="租户id">
        <template slot-scope="scope">
          <span>{{scope.row.tenantId}}</span>
        </template>
      </el-table-column>

       <el-table-column
      fixed="right"
      label="操作"
      width="120"
      align="center">
      <template slot-scope="scope">
        <el-button @click="updateClick(scope.row)" type="text" size="small">编辑</el-button>
        <el-button @click="delClick(scope.row)" type="text" size="small">删除</el-button>
      </template>
    </el-table-column>

    </el-table>

     <addAdmin :dialogVisible.sync="dialogVisible" @refreshList="getList"></addAdmin>

    <!-- <pagination
      v-show="total>0"
      :total="total"
      :page.sync="listQuery.pageIndex"
      :limit.sync="listQuery.pageSize"
      @pagination="getList"
    /> -->
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { ElMessage } from 'element-plus';
import { getAdminList } from '@/api/system';
import addAdmin from '@/views/system/addAdmin.vue';

export default {
  name: 'index',
  components: {
    addAdmin
  },
  setup() {
    // 响应式数据
    const list = ref([]);
    const pageNo = ref(1);
    const pageSize = ref(10);
    const dialogVisible = ref(false);

    // 获取管理员列表
    const getList = async () => {
      const data = await getAdminList(pageNo.value, pageSize.value);
      list.value = data.items;
    };

    // 打开对话框
    const openSkuDialog = () => {
      dialogVisible.value = true;
    };

    // 删除操作
    const deleteClick = async (value) => {
      try {
        // 实际项目中这里会有删除API调用
        // await delAdmin(value.id)
        
        ElMessage({
          message: "删除成功",
          type: 'info',
          duration: 2000
        });
      } catch (error) {
        ElMessage({
          message: "删除失败",
          type: 'error',
          duration: 2000
        });
      }
    };

    // 组件挂载时获取数据
    onMounted(() => {
      getList();
    });

    return {
      list,
      pageNo,
      pageSize,
      dialogVisible,
      getList,
      openSkuDialog,
      deleteClick
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
