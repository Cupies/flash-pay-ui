<template>
  <el-dialog title="基本信息" :visible.sync="syncDialogVisible" @open="open">
    <el-form :inline="false">
      <el-form-item label="姓名: " :label-width="formLabelWidth">
        <span>{{list.fullName}}</span>
      </el-form-item >

      <el-form-item label="最后一次登录时间" :label-width="formLabelWidth">
        <span>{{list.lastLoginTime}}</span>
      </el-form-item>

      <el-form-item label="手机号: " :label-width="formLabelWidth">
        <span>{{list.mobile}}</span>
      </el-form-item>
      <el-form-item label="职位	: " :label-width="formLabelWidth">
        <span>{{list.position}}</span>
      </el-form-item>
      <el-form-item label="用户名:" :label-width="formLabelWidth">
        <span>{{list.username}}</span>
      </el-form-item>
      <el-form-item label="联系人地址: " :label-width="formLabelWidth">
        <span v-if="list.staffStatus">启用</span>
        <span v-if="!list.staffStatus">禁用</span>
      </el-form-item>
      <el-form-item label="密码: :" :label-width="formLabelWidth">
        <span>{{list.password}}</span>
      </el-form-item>

    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="ensureDialog">确 定</el-button>
    </div>
    
  </el-dialog>
</template>

<script>
import { defineComponent, ref, computed, watch } from 'vue'
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
    // 使用计算属性实现双向绑定
    const syncDialogVisible = computed({
      get: () => props.dialogVisible,
      set: (value) => emit('update:dialogVisible', value)
    })
    
    // 使用计算属性实现双向绑定
    const tenantIds = computed({
      get: () => props.tenantId,
      set: (value) => emit('update:tenantId', value)
    })
    
    // 表单数据
    const form = ref({
      storeAddress: '',
      storeName: '',
      storeNumber: 0,
      parentId: 0,
      storeStatus: '',
      merchantId: 0
    })
    
    // 商户信息列表
    const list = ref({})

    // 监听对话框打开状态
    watch(() => props.dialogVisible, (newVal) => {
      if (newVal) {
        getMsgFromMers()
      }
    })

    // 获取商户信息
    const getMsgFromMers = async () => {
      try {
        list.value = await getMsgFromMer(tenantIds.value)
      } catch (error) {
        console.error(error)
        ElMessage.error('获取商户信息失败')
      }
    }

    // 确认对话框
    const ensureDialog = () => {
      syncDialogVisible.value = false
    }

    return {
      syncDialogVisible,
      tenantIds,
      form,
      list,
      getMsgFromMers,
      ensureDialog
    }
  }
})
</script>