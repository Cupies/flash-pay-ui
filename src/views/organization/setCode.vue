<template>
  <el-dialog title="" :visible.sync="syncDialogVisible" @open="opend" width="250px">
    <img :src="codes" alt="">
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="ensureDialog">确定</el-button>
    </div>
    
  </el-dialog>
</template>

<script>
import { defineComponent, ref, watch, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { getAppList, BscanC } from '@/api/pay'
import { getStoresData } from '@/api/organization'

export default defineComponent({
  name: 'PaymentDialog',
  props: {
    dialogVisible: {
      type: Boolean,
      default: false
    },
    code: {
      type: String,
      default: ''
    }
  },
  emits: ['update:dialogVisible', 'update:code'],
  setup(props, { emit }) {
    const syncDialogVisible = ref(props.dialogVisible)
    const codes = ref(props.code)
    const pageNo = ref(1)
    const pageSize = ref(10)
    const appId = ref(0)
    const storeId = ref(0)
    const form = ref({
      appId: '',
      authCode: '',
      subject: '',
      totalAmount: 0
    })
    const list = ref([])
    const storeList = ref([])

    watch(() => props.dialogVisible, (newVal) => {
      syncDialogVisible.value = newVal
    })
    
    watch(() => props.code, (newVal) => {
      codes.value = newVal
    })

    onMounted(() => {
      getList()
    })

    const opend = async () => {
      
    }

    const getList = async () => {
      
    }

    const ensureDialog = () => {
      syncDialogVisible.value = false
      
    }

    return {
      syncDialogVisible,
      codes,
      pageNo,
      pageSize,
      appId,
      storeId,
      form,
      list,
      storeList,
      opend,
      getList,
      ensureDialog
    }
  }
})
</script>