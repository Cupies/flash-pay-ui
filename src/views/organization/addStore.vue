<template>
  <el-dialog title="新增门店" :visible.sync="syncDialogVisible" @open="opend">
    <el-form :inline="false">
      <el-form-item label="门店名称: " :label-width="formLabelWidth" :rules="[{required:true}]">
        <el-input v-model="form.storeName"></el-input>
      </el-form-item >

      <el-form-item label="门店地址: " :label-width="formLabelWidth"  :rules="[{required:true}]">
        <el-input v-model="form.storeAddress"></el-input>
      </el-form-item>

      <el-form-item label="门店编号: " :label-width="formLabelWidth"  :rules="[{required:true}]">
        <el-input v-model="form.storeNumber"></el-input>
      </el-form-item>
          <el-form-item label="管理员: " :rules="[{required:true}]">
          <el-select v-model="list" multiple placeholder="请选择">
                <el-option
                v-for="item in memberList"
                :key="item.id"
                :label="item.username"
                :value="item.id">
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
import { defineComponent, ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { createStore, getMemberData } from '@/api/organization'
import { getAdminList } from '@/api/system'

export default defineComponent({
  name: 'CreateTasks',
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
      storeAddress: '',
      storeName: '',
      storeNumber: 0,
      parentId: 0,
      storeStatus: '',
      merchantId: 0
    })
    
    const storeFrom = ref({
      storeName: '',
      storeNumber: ''
    })
    
    const memberList = ref([])
    const list = ref([])

    watch(() => props.dialogVisible, (newVal) => {
      syncDialogVisible.value = newVal
    })

    const opend = () => {
      getList()
    }

    const getList = async () => {
      try {
        const data = await getMemberData(1, 10, storeFrom.value)
        memberList.value = data.items
      } catch (error) {
        console.error(error)
        ElMessage.error('获取成员数据失败')
      }
    }

    const ensureDialog = async () => {
      if (form.value.storeAddress === '' || form.value.storeName === '' || list.value.length === 0) {
        ElMessage.error('必填项不能为空')
        return
      }
      
      try {
        await createStore(form.value, list.value)
        emit('update:dialogVisible', false)
        ElMessage.success('创建成功')
      } catch (error) {
        console.error(error)
        ElMessage.error('创建失败')
      }
    }

    return {
      syncDialogVisible,
      form,
      storeFrom,
      memberList,
      list,
      opend,
      getList,
      ensureDialog
    }
  }
})
</script>
