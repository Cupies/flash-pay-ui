<template>
  <div class="data-container">
      <h3>审核管理</h3>
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
      <el-table-column align="center" label="企业编号">
        <template slot-scope="scope">
          <span>{{scope.row.merchantNo}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="企业名称">
        <template slot-scope="scope">
          <span>{{scope.row.merchantName}}</span>
        </template>
      </el-table-column>

 
      <el-table-column align="center" label="企业营业执照号">
        <template slot-scope="scope">
          <span>{{scope.row.merchantNo}}</span>
        </template>
      </el-table-column>

       <el-table-column
      fixed="right"
      label="操作"
      width="120"
      align="center">
      <template slot-scope="scope">
        <el-button @click="searchDetail(scope.row)" type="text" size="small">查看</el-button>
      </template>
    </el-table-column>


      <el-table-column
      fixed="right"
      label="操作"
      width="120"
      align="center">
      <template slot-scope="scope">
        <el-button @click="itPass(scope.row)" type="text" size="small">通过</el-button>
        <el-button @click="itReject(scope.row)" type="text" size="small">驳回</el-button>
      </template>
    </el-table-column>
    </el-table>

    <detail :dialogVisible.sync="dialogVisible" @refreshList="getList" :tenantId="this.tenantId"></detail>

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
import { defineComponent, ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { getStoresData, delStore } from '@/api/organization'
import { OneApprove, storeList } from '@/api/firm'
import Detail from '@/views/firm/detail.vue'

export default defineComponent({
  name: 'Audit',
  components: {
    Detail
  },
  setup() {
    const list = ref([])
    const pageNo = ref(1)
    const pageSize = ref(10)
    const dialogVisible = ref(false)
    const tenantId = ref(0)
    
    const form = ref({
      auditStatus: false,
      merchantName: '',
      merchantType: '',
      mobile: ''
    })

    const getList = async () => {
      try {
        const data = await storeList(form.value, pageNo.value, pageSize.value)
        list.value = data.items
      } catch (error) {
        console.error(error)
        ElMessage.error('获取审核列表失败')
      }
    }

    const searchDetail = (value) => {
      tenantId.value = value.id
      dialogVisible.value = true
    }

    const itPass = async (value) => {
      try {
        const res = await OneApprove(2, value.id)
        if (!res) {
          ElMessage({
            message: "通过失败",
            type: 'error',
            duration: 2 * 1000
          })
        } else {
          ElMessage({
            message: "通过成功",
            type: 'success',
            duration: 2 * 1000
          })
          dialogVisible.value = false
          getList()
        }
      } catch (error) {
        console.error(error)
        ElMessage.error('审核操作失败')
      }
    }

    const itReject = async (value) => {
      try {
        const res = await OneApprove(3, value.id)
        if (!res) {
          ElMessage({
            message: "驳回失败",
            type: 'error',
            duration: 2 * 1000
          })
        } else {
          ElMessage({
            message: "驳回成功",
            type: 'success',
            duration: 2 * 1000
          })
          dialogVisible.value = false
          getList()
        }
      } catch (error) {
        console.error(error)
        ElMessage.error('审核操作失败')
      }
    }

    const deleteClick = async (value) => {
      try {
        const data = await delStore(value.id)
        if (!data) {
          ElMessage({
            message: "删除失败",
            type: 'error',
            duration: 2 * 1000
          })
        } else {
          ElMessage({
            message: "删除成功",
            type: 'success',
            duration: 2 * 1000
          })
          getList()
        }
      } catch (error) {
        console.error(error)
        ElMessage.error('删除失败')
      }
    }

    onMounted(() => {
      getList()
    })

    return {
      list,
      pageNo,
      pageSize,
      dialogVisible,
      tenantId,
      form,
      getList,
      searchDetail,
      itPass,
      itReject,
      deleteClick
    }
  }
})
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
