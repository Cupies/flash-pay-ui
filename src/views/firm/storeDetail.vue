<template>
  <el-dialog title="基本信息" :visible.sync="syncDialogVisible" @open="open">
    <el-form :inline="false">
      <el-form-item label="企业名称: " :label-width="formLabelWidth">
        <span>{{list.merchantName}}</span>
      </el-form-item >

      <el-form-item label="企业编号" :label-width="formLabelWidth">
        <span>{{list.merchantNo}}</span>
      </el-form-item>

      <el-form-item label="企业地址: " :label-width="formLabelWidth">
        <span>{{list.merchantAddress}}</span>
      </el-form-item>
      <el-form-item label="行业类型	: " :label-width="formLabelWidth">
        <span>{{list.merchantType}}</span>
      </el-form-item>
      <el-form-item label="联系人:" :label-width="formLabelWidth">
        <span>{{list.username}}</span>
      </el-form-item>
      <el-form-item label="联系人地址: " :label-width="formLabelWidth">
        <span>{{list.contactsAddress}}</span>
      </el-form-item>
      <el-form-item label="手机号:" :label-width="formLabelWidth">
        <span>{{list.mobile}}</span>
      </el-form-item>

    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="ensureDialog">确 定</el-button>
    </div>
    
  </el-dialog>
</template>

<script>
import { defineComponent, ref, watch, computed } from 'vue'
import { ElMessage } from 'element-plus'
import { getMsgFromMer } from '@/api/firm'

export default defineComponent({
  name: 'CreateTasks',
  props: {
    dialogVisible: {
      type: Boolean,
      default: false
    },
    tenantId: {
      type: Number,
      required: true
    }
  },
  emits: ['update:dialogVisible', 'update:tenantId'],
  setup(props, { emit }) {
    const syncDialogVisible = computed({
      get: () => props.dialogVisible,
      set: (value) => emit('update:dialogVisible', value)
    })
    
    const tenantIds = computed({
      get: () => props.tenantId,
      set: (value) => emit('update:tenantId', value)
    })
    
    const form = ref({
      storeAddress: '',
      storeName: '',
      storeNumber: 0,
      parentId: 0,
      storeStatus: '',
      merchantId: 0
    })
    
    const list = ref({})

    const open = () => {
      getMsgFromMers()
    }

    const getMsgFromMers = async () => {
      try {
        list.value = await getMsgFromMer(tenantIds.value)
      } catch (error) {
        console.error(error)
        ElMessage.error('获取商户信息失败')
      }
    }

    const ensureDialog = () => {
      syncDialogVisible.value = false
    }

    // 监听对话框打开状态
    watch(() => props.dialogVisible, (newVal) => {
      if (newVal) {
        getMsgFromMers()
      }
    })

    return {
      syncDialogVisible,
      tenantIds,
      form,
      list,
      open,
      getMsgFromMers,
      ensureDialog
    }
  }
})
</script>
