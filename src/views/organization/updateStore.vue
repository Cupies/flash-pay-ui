<template>
  <el-dialog title="修改门店信息" :visible.sync="syncDialogVisible" @open="opend">
    <el-form :inline="false">
      <el-form-item label="门店名称: " :label-width="formLabelWidth" :rules="[{required:true}]">
        <el-input v-model="form.storeName"></el-input>
      </el-form-item >

      <el-form-item label="门店地址: " :label-width="formLabelWidth">
        <el-input v-model="form.storeAddress"></el-input>
      </el-form-item>

      <el-form-item label="门店编号: " :label-width="formLabelWidth">
        <el-input v-model="form.storeNumber"></el-input>
      </el-form-item>

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
import { updateStore, getStoresData } from '@/api/organization'

export default defineComponent({
  name: 'CreateTasks',
  props: {
    dialogVisible: {
      type: Boolean,
      default: false
    },
    storeIds: {
      type: String,
      default: ''
    }
  },
  emits: ['update:dialogVisible', 'update:storeIds'],
  setup(props, { emit }) {
    const syncDialogVisible = ref(props.dialogVisible)
    const storeId = ref(props.storeIds)
    
    const form = ref({
      storeAddress: '',
      storeName: '',
      storeNumber: 0,
      parentId: 0,
      storeStatus: '',
      merchantId: 0
    })
    
    const storeForm = ref({
      storeNumber: '',
      storeName: ''
    })
    
    const listData = ref([])
    const filterData = ref([])

    watch(() => props.dialogVisible, (newVal) => {
      syncDialogVisible.value = newVal
    })
    
    watch(() => props.storeIds, (newVal) => {
      storeId.value = newVal
    })

    const opend = () => {
      getList()
    }

    const getList = async () => {
      try {
        const ret = await getStoresData(1, 10, storeForm.value)
        listData.value = ret.items
        filterData.value = listData.value.filter((item) => {
          return storeId.value == item.id
        })

        form.value.storeName = filterData.value[0].storeName
        form.value.storeAddress = filterData.value[0].storeAddress
        form.value.storeNumber = filterData.value[0].storeNumber
      } catch (error) {
        console.error(error)
        ElMessage.error('获取数据失败')
      }
    }

    const ensureDialog = async () => {
      try {
        await updateStore(form.value)
        emit('update:dialogVisible', false)
        ElMessage.success('修改成功')
      } catch (error) {
        console.error(error)
        ElMessage.error('修改失败')
      }
    }

    return {
      syncDialogVisible,
      storeId,
      form,
      storeForm,
      listData,
      filterData,
      opend,
      getList,
      ensureDialog
    }
  }
})
</script>