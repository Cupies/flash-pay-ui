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
      <el-button type="primary" @click="passClick">通 过</el-button>
      <el-button type="danger" @click="rejectClick">驳 回</el-button>
    </div>
    
  </el-dialog>
</template>

<script>
import { defineComponent, ref, computed, watch } from 'vue'
import { ElMessage } from 'element-plus'
import { getMsgFromMer, OneApprove } from '@/api/firm'

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
    
    // 商户信息
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

    // 通过审核
    const passClick = async () => {
      try {
        const res = await OneApprove(2, tenantIds.value)
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
          syncDialogVisible.value = false
        }
      } catch (error) {
        console.error(error)
        ElMessage.error('审核操作失败')
      }
    }

    // 驳回审核
    const rejectClick = async () => {
      try {
        const res = await OneApprove(3, tenantIds.value)
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
          syncDialogVisible.value = false
        }
      } catch (error) {
        console.error(error)
        ElMessage.error('审核操作失败')
      }
    }

    // 关闭对话框
    const ensureDialog = () => {
      syncDialogVisible.value = false
    }

    return {
      syncDialogVisible,
      tenantIds,
      list,
      passClick,
      rejectClick,
      ensureDialog
    }
  }
})
</script>
