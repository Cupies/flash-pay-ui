<template>
  <el-dialog title="选择应用" :visible.sync="syncDialogVisible" @open="opend">
    <el-form :inline="false">
      <el-form-item label="默认应用: ">
          <el-select v-model="appId" placeholder="请选择">
            <el-option
                v-for="item in list"
                :key="item.appId"
                :label="item.appName"
                :value="item.appId">
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
import { getAppList } from '@/api/pay'

export default defineComponent({
  name: 'AppDialog',
  props: {
    dialogVisible: {
      type: Boolean,
      default: false
    }
  },
  emits: ['update:dialogVisible', 'getAppId'],
  setup(props, { emit }) {
    const syncDialogVisible = ref(props.dialogVisible)
    const pageNo = ref(1)
    const pageSize = ref(10)
    const appId = ref('')
    const storeId = ref('')
    const list = ref([])
    const storeList = ref([])

    watch(() => props.dialogVisible, (newVal) => {
      syncDialogVisible.value = newVal
    })

    const opend = () => {
      getList()
    }

    const getList = async () => {
      try {
        list.value = await getAppList()
      } catch (error) {
        console.error(error)
        ElMessage.error('获取应用列表失败')
      }
    }

    const ensureDialog = () => {
      syncDialogVisible.value = false
      console.log(appId.value)
      emit('getAppId', appId.value)
    }

    return {
      syncDialogVisible,
      pageNo,
      pageSize,
      appId,
      storeId,
      list,
      storeList,
      opend,
      getList,
      ensureDialog
    }
  }
})
</script>