<template>
  <div class="data-container">
      <h3>门店管理</h3>
      <el-row type="flex" justify="end" class="add">
      <el-button type="primary" size="medium" @click="checkUse" id="addBtn">选择应用</el-button>
      <el-button type="primary" size="medium" @click="openSkuDialog" id="addBtn">新增</el-button>
    </el-row>

    <!-- <el-form :inline="true" size="medium" class="forms">
      <el-form-item label="账户/用户名:">
        <el-input v-model="skuName" placeholder="请输入"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="searchSku" id="searchBtn">查询</el-button>
      </el-form-item>
    </el-form> -->


    <el-table
      :data="list"
      fit
      highlight-current-row
      :header-cell-style="{color:'#5373e0',background:'#f3f6fb'}"
      style="width: 100%"
    >
      <el-table-column align="center" label="门店编号">
        <template slot-scope="scope">
          <span>{{scope.row.storeNumber}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="门店名称">
        <template slot-scope="scope">
          <span>{{scope.row.storeName}}</span>
        </template>
      </el-table-column>

 
      <el-table-column align="center" label="地址">
        <template slot-scope="scope">
          <span>{{scope.row.storeAddress}}</span>
        </template>
      </el-table-column>

       <el-table-column
      fixed="right"
      label="二维码"
      width="150"
      align="center">
      <template slot-scope="scope">
        <el-button @click="setCode(scope.row)" type="text" size="small">生成二维码</el-button>
      </template>
    </el-table-column>


      <el-table-column
      fixed="right"
      label="操作"
      width="120"
      align="center">
      <template slot-scope="scope">
        <el-button @click="updateClick(scope.row)" type="text" size="small">编辑</el-button>
        <el-button @click="deleteClick(scope.row)" type="text" size="small">删除</el-button>
      </template>
    </el-table-column>
    </el-table>

     <addStore :dialogVisible.sync="dialogVisible" @refreshList="getList"></addStore>
     <setCode :dialogVisible.sync="dialogVisible1" @refreshList="getList" :code="codes"></setCode>
     <updateStore :dialogVisible.sync="dialogVisible2" @refreshList="getList" :storeIds="storeId"></updateStore>
     <setUse :dialogVisible.sync="dialogVisible3" @refreshList="getList" @getAppId="getAppIds"></setUse>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="pageNo"
      :limit.sync="pageSize"
      @pagination="getList"
    />
  </div>
</template>

<<script>
import { defineComponent, ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { getStoresDataCode } from '@/api/pay'
import { getStoresData, delStore } from '@/api/organization'
import AddStore from '@/views/organization/addStore.vue'
import Pagination from "@/components/Pagination/index.vue"
import SetCode from '@/views/organization/setCode.vue'
import UpdateStore from '@/views/organization/updateStore.vue'
import SetUse from '@/views/organization/setUse.vue'

export default defineComponent({
  name: 'StoreList',
  components: {
    AddStore,
    Pagination,
    SetCode,
    UpdateStore,
    SetUse
  },
  setup() {
    const list = ref([])
    const pageNo = ref(1)
    const pageSize = ref(10)
    const total = ref(0)
    const dialogVisible = ref(false)
    const dialogVisible1 = ref(false)
    const dialogVisible2 = ref(false)
    const dialogVisible3 = ref(false)
    const appId = ref('')
    const codes = ref('')
    const storeId = ref('')
    const storeForm = ref({
      storeName: '',
      storeNumber: ''
    })
    const form = ref({
      totalAmount: '',
      body: ''
    })

    onMounted(() => {
      getList()
    })

    const getList = async () => {
      try {
        const data = await getStoresData(pageNo.value, pageSize.value, storeForm.value)
        list.value = data.items
        total.value = list.value.length
      } catch (error) {
        console.error(error)
        ElMessage.error('获取门店数据失败')
      }
    }

    const checkUse = () => {
      dialogVisible3.value = true
    }

    const openSkuDialog = () => {
      dialogVisible.value = true
    }

    const getAppIds = (value) => {
      appId.value = value
    }

    const updateClick = (value) => {
      console.log(value)
      storeId.value = value.id
      dialogVisible2.value = true
    }

    const setCode = async (value) => {
      if (appId.value === '') {
        ElMessage.error('请先选择应用')
        return
      }
      
      try {
        codes.value = await getStoresDataCode(appId.value, value.id, form.value.body, form.value.totalAmount)
        dialogVisible1.value = true
      } catch (error) {
        console.error(error)
        ElMessage.error('生成支付码失败')
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
        ElMessage.error('删除门店失败')
      }
    }

    return {
      list,
      pageNo,
      pageSize,
      total,
      dialogVisible,
      dialogVisible1,
      dialogVisible2,
      dialogVisible3,
      appId,
      codes,
      storeId,
      storeForm,
      form,
      getList,
      checkUse,
      openSkuDialog,
      getAppIds,
      updateClick,
      setCode,
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
  .add {
    margin-bottom:10px;
  }
</style>

