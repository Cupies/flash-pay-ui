<template>
  <div class="bill-container">
      <h3>应用财务对账</h3>
    <el-table
      v-loading="listLoading"
      :data="list"
      fit
      highlight-current-row
      :header-cell-style="{color:'#5373e0',background:'#f3f6fb'}"
      style="width: 100%"
    >
      <el-table-column align="center" label="日期">
        <template slot-scope="scope">
          <span></span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="收入(元)">
        <template slot-scope="scope">
          <span></span>
        </template>
      </el-table-column>

 
      <el-table-column align="center" label="笔数">
        <template slot-scope="scope">
          <span></span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="支出(元)">
        <template slot-scope="scope">
          <span></span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="笔数">
        <template slot-scope="scope">
          <span></span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="应结金额">
        <template slot-scope="scope">
          <span></span>
        </template>
      </el-table-column>


      <el-table-column
      fixed="right"
      label="操作"
      width="100"
      align="center">
      <template slot-scope="scope">
        <el-button @click="updateClick(scope.row)" type="text" size="small">查看明细</el-button>
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

<script setup>
import { onMounted } from 'vue'
import { useUserStore } from '@/store/modules/user'



onMounted(() => {
  console.log(userStore.tenantId)
})

defineOptions({
  name: 'bill'
})
</script>

<style lang="scss">
  .bill-container {
    width: 1200px;
    margin: 00 auto;
    padding: 42px 44px;
    background: white;
    height: 100%;
  }
</style>

<style lang="scss" scoped>

</style>
