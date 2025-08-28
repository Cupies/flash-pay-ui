<template>
  <div class="data-container">
      <h3>门店管理</h3>
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
      <el-table-column align="center" label="角色编号">
        <template slot-scope="scope">
          <span>{{scope.row.code}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="角色名称">
        <template slot-scope="scope">
          <span>{{scope.row.name}}</span>
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
import { getRolesList, delRoles } from '@/api/system';

export default {
  name: 'index',
  setup() {
    // 响应式数据
    const list = ref([]);
    const pageNo = ref(1);
    const pageSize = ref(10);

    // 获取角色列表
    const getList = async () => {
      const data = await getRolesList(pageNo.value, pageSize.value);
      list.value = data.items;
    };

    // 删除操作
    const delClick = async (value) => {
      try {
        const res = await delRoles(value.id);
        if (!res) {
          ElMessage({
            message: "删除失败",
            type: 'error',
            duration: 2000
          });
        } else {
          ElMessage({
            message: "删除成功",
            type: 'success',
            duration: 2000
          });
          await getList(); // 刷新列表
        }
      } catch (error) {
        ElMessage({
          message: "删除操作异常",
          type: 'error',
          duration: 2000
        });
        console.error('删除失败:', error);
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
      delClick,
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
