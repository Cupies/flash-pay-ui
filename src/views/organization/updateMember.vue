<template>
  <el-dialog title="新增成员" :visible.sync="syncDialogVisible" @open="opend">
    <el-form :inline="false">
      <el-form-item label="姓名: " :label-width="formLabelWidth">
        <el-input v-model="form.fullname"></el-input>
      </el-form-item>
      <el-form-item label="职位: " :label-width="formLabelWidth">
        <el-input v-model="form.position"></el-input>
      </el-form-item>
      <el-form-item label="归属门店" :rules="[{required:true}]" >
          <el-select v-model="form.storeId" placeholder="请选择">
                <el-option
                v-for="item in storeList"
                :key="item.id"
                :label="item.storeName"
                :value="item.id">
                </el-option>
            </el-select>
      </el-form-item >
        <el-form-item label="角色: " :rules="[{required:true}]">
          <el-select v-model="rolecode" multiple placeholder="请选择">
                <el-option
                v-for="item in roleList"
                :key="item.id"
                :label="item.name"
                :value="item.code">
                </el-option>
            </el-select>
      </el-form-item >
      
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="syncDialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="ensureDialog">确 定</el-button>
    </div>
    
  </el-dialog>
</template>
<script>
import { defineComponent, ref, watch } from 'vue'
import { ElMessage } from 'element-plus'
import { updateMember, getMemberData, getStoresData, getRole } from '@/api/organization'

export default defineComponent({
  name: 'MemberDialog',
  props: {
    dialogVisible: {
      type: Boolean,
      default: false
    },
    memberIds: {
      type: String,
      default: ''
    }
  },
  emits: ['update:dialogVisible', 'update:memberIds'],
  setup(props, { emit }) {
    const syncDialogVisible = ref(props.dialogVisible)
    const memberId = ref(props.memberIds)
    
    const form = ref({
      fullname: '',
      position: '',
      storeId: ''
    })
    
    const rolecode = ref([])
    const listData = ref([])
    const filterData = ref([])
    const roleList = ref([])
    const storeList = ref([])
    const memberFrom = ref({
      username: ''
    })

    watch(() => props.dialogVisible, (newVal) => {
      syncDialogVisible.value = newVal
    })
    
    watch(() => props.memberIds, (newVal) => {
      memberId.value = newVal
    })

    const opend = () => {
      getList()
    }

    const getList = async () => {
      try {
        const res = await getMemberData(1, 10, memberFrom.value)
        listData.value = res.items
        filterData.value = listData.value.filter((item) => {
          return memberId.value == item.id
        })
        
        roleList.value = await getRole()
        const datas = await getStoresData(1, 10, memberFrom.value)
        storeList.value = datas.items
        
        if (filterData.value.length > 0) {
          form.value.fullname = filterData.value[0].fullname
          form.value.position = filterData.value[0].position
        }
      } catch (error) {
        console.error(error)
        ElMessage.error('获取数据失败')
      }
    }

    const ensureDialog = async () => {
      if (form.value.storeId === '' || rolecode.value.length === 0) {
        ElMessage.error('必填项不能为空')
        return
      }
      
      try {
        await updateMember(form.value, rolecode.value)
        emit('update:dialogVisible', false)
        ElMessage.success('修改成功')
      } catch (error) {
        console.error(error)
        ElMessage.error('修改失败')
      }
    }

    return {
      syncDialogVisible,
      memberId,
      form,
      rolecode,
      listData,
      filterData,
      roleList,
      storeList,
      memberFrom,
      opend,
      getList,
      ensureDialog
    }
  }
})
</script>
