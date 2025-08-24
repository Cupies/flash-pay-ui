<template>
  <el-dialog title="新增成员" :visible.sync="syncDialogVisible" @open="opend">
    <el-form :inline="false">
      <el-form-item label="手机号: " :label-width="formLabelWidth" :rules="[{required:true}]">
        <el-input v-model="form.mobile"></el-input>
      </el-form-item >

      <el-form-item label="密码: " :label-width="formLabelWidth" :rules="[{required:true}]">
        <el-input v-model="form.password"></el-input>
      </el-form-item>

      <el-form-item label="用户名: " :label-width="formLabelWidth" :rules="[{required:true}]">
        <el-input v-model="form.username"></el-input>
      </el-form-item>
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
import { createMember, getStoresData, getRole } from '@/api/organization'
import { getRolesList } from '@/api/system'

export default defineComponent({
  name: 'CreateMemberDialog',
  props: {
    dialogVisible: {
      type: Boolean,
      default: false
    }
  },
  emits: ['update:dialogVisible'],
  setup(props, { emit }) {
    const syncDialogVisible = ref(props.dialogVisible)
    
    const form = ref({
      mobile: '',
      password: '',
      username: '',
      storeId: '',
      fullname: '',
      position: ''
    })
    
    const memberFrom = ref({
      username: ''
    })
    
    const memberList = ref([])
    const roleList = ref([])
    const storeList = ref([])
    const rolecode = ref([])

    watch(() => props.dialogVisible, (newVal) => {
      syncDialogVisible.value = newVal
    })

    const opend = () => {
      getList()
    }

    const getList = async () => {
      try {
        roleList.value = await getRole()
        const datas = await getStoresData(1, 10, memberFrom.value)
        storeList.value = datas.items
      } catch (error) {
        console.error(error)
        ElMessage.error('获取数据失败')
      }
    }

    const ensureDialog = async () => {
      if (form.value.username === '' || form.value.mobile === '' || 
          form.value.password === '' || form.value.storeId === '' || 
          rolecode.value.length === 0) {
        ElMessage.error('必填项不能为空')
        return
      }
      
      try {
        await createMember(form.value, rolecode.value)
        emit('update:dialogVisible', false)
        ElMessage.success('添加成功')
        
        // 重置表单
        form.value.mobile = ''
        form.value.password = ''
        form.value.username = ''
        form.value.storeId = ''
        form.value.fullname = ''
        form.value.position = ''
        rolecode.value = []
      } catch (error) {
        console.error(error)
        ElMessage.error('添加失败')
      }
    }

    return {
      syncDialogVisible,
      form,
      memberFrom,
      memberList,
      roleList,
      storeList,
      rolecode,
      opend,
      getList,
      ensureDialog
    }
  }
})
</script>
