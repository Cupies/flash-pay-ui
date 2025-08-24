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
      <el-table-column align="center" label="手机号">
        <template slot-scope="scope">
          <span>{{scope.row.mobile}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="用户名">
        <template slot-scope="scope">
          <span>{{scope.row.username}}</span>
        </template>
      </el-table-column>

 
      <el-table-column align="center" label="最后一次登录时间">
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
        <el-button @click="searchClick(scope.row)" type="text" size="small">查看</el-button>
        <el-button @click="delClick(scope.row)" type="text" size="small">删除</el-button>
      </template>
    </el-table-column>

    </el-table>

     
  <memberDetail :dialogVisible.sync="dialogVisible" @refreshList="getList" :memberId="this.memberId"></memberDetail>
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
import { getMemberMsg, delMember } from '@/api/firm'
import MemberDetail from '@/views/firm/memberDetail.vue'

export default defineComponent({
  name: 'Member',
  components: {
    MemberDetail
  },
  setup() {
    const list = ref([])
    const pageNo = ref(1)
    const pageSize = ref(10)
    const dialogVisible = ref(false)
    const memberId = ref(0)

    const getList = async () => {
      try {
        const data = await getMemberMsg(pageNo.value, pageSize.value)
        list.value = data.items
      } catch (error) {
        console.error(error)
        ElMessage.error('获取成员信息失败')
      }
    }

    const searchClick = (value) => {
      dialogVisible.value = true
      memberId.value = value.id
    }

    const delClick = async (value) => {
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
          // 重新加载列表
          getList()
        }
      } catch (error) {
        console.error(error)
        ElMessage.error('删除成员失败')
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
      memberId,
      getList,
      searchClick,
      delClick
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
