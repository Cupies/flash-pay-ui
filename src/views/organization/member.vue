<template>
  <div class="data-container">
      <h3>成员管理</h3>
      <el-row type="flex" justify="end" class="add">
      <el-button type="primary" size="medium" @click="openSkuDialog" id="addBtn">新增</el-button>
    </el-row>

    <el-form :inline="true" size="medium" class="forms">
      <el-form-item label="账户/用户名:">
        <el-input placeholder="请输入" v-model="memberForm.username"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" id="searchBtn">查询</el-button>
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
      <el-table-column align="center" label="成员序号">
        <template slot-scope="scope">
          <span>{{scope.$index + 1}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="账号">
        <template slot-scope="scope">
          <span>{{scope.row.mobile}}</span>
        </template>
      </el-table-column>

 
      <el-table-column align="center" label="用户名">
        <template slot-scope="scope">
          <div v-if="scope.row.username">
            <span>{{scope.row.username}}</span>
          </div> 
        </template>
      </el-table-column>

      <el-table-column align="center" label="所属门店">
        <template slot-scope="scope">
          <span>{{scope.row.storeId}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="角色">
        <template slot-scope="scope">
          <span>{{scope.row.position}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="最后一次访问时间">
        <template slot-scope="scope">
          <span>{{scope.row.lastLoginTime}}</span>
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

     <addMember :dialogVisible.sync="dialogVisible" @refreshList="getList"></addMember>
     <updateMember :dialogVisible.sync="dialogVisible1" @refreshList="getList" :memberIds="memberId"></updateMember>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="pageNo"
      :limit.sync="pageSize"
      @pagination="getList"
    />
  </div>
</template>

<script>
import { defineComponent, ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { getMemberData, delMember } from '@/api/organization'
import AddMember from '@/views/organization/addMember.vue'
import Pagination from "@/components/Pagination/index.vue"
import UpdateMember from '@/views/organization/updateMember.vue'

export default defineComponent({
  name: 'MemberList',
  components: {
    AddMember,
    Pagination,
    UpdateMember
  },
  setup() {
    const list = ref([])
    const pageNo = ref(1)
    const pageSize = ref(10)
    const dialogVisible = ref(false)
    const dialogVisible1 = ref(false)
    const total = ref(0)
    const memberId = ref('')
    const memberForm = ref({
      username: ''
    })

    onMounted(() => {
      getList()
    })

    const getList = async () => {
      try {
        const data = await getMemberData(pageNo.value, pageSize.value, memberForm.value)
        list.value = data.items
        total.value = list.value.length
        console.log(list.value)
      } catch (error) {
        console.error(error)
        ElMessage.error('获取成员数据失败')
      }
    }

    const updateClick = (value) => {
      console.log(value)
      memberId.value = value.id
      dialogVisible1.value = true
    }

    const openSkuDialog = () => {
      dialogVisible.value = true
    }

    const deleteClick = async (value) => {
      try {
        const data = await delMember(value.id)
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
        ElMessage.error('删除成员失败')
      }
    }

    return {
      list,
      pageNo,
      pageSize,
      dialogVisible,
      dialogVisible1,
      total,
      memberId,
      memberForm,
      getList,
      updateClick,
      openSkuDialog,
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
