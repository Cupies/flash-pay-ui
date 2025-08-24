<template>
  <el-dialog title="支付设置" :visible.sync="syncDialogVisible" @open="opend">
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

    <el-form-item label="默认门店: " >
          <el-select v-model="storeId" placeholder="请选择">
                <el-option
                v-for="item in storeList"
                :key="item.id"
                :label="item.storeName"
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
import { ref, reactive, computed, onMounted } from 'vue';
import { ElMessage } from 'element-plus';
import { getAppList } from '@/api/pay';
import { getStoresData } from '@/api/organization';

export default {
  props: {
    dialogVisible: {
      type: Boolean,
      default: false
    }
  },
  emits: ['update:dialogVisible', 'getAppId', 'getStoreId'],
  setup(props, { emit }) {
    // 响应式状态管理
    const pageNo = ref(1);
    const pageSize = ref(10);
    const appId = ref('');
    const storeId = ref('');
    const list = ref([]);
    const storeList = ref([]);
    
    // 响应式表单
    const storeForm = reactive({
      storeName: '',
      storeNumber: ''
    });

    // 替代 @PropSync 的双向绑定
    const syncDialogVisible = computed({
      get: () => props.dialogVisible,
      set: (value) => emit('update:dialogVisible', value)
    });

    // 获取应用列表和店铺数据
    const getList = async () => {
      try {
        list.value = await getAppList();
        const data = await getStoresData(pageNo.value, pageSize.value, storeForm);
        storeList.value = data.items;
      } catch (error) {
        ElMessage.error('数据加载失败');
        console.error('API请求错误:', error);
      }
    };

    // 确认对话框操作
    const ensureDialog = () => {
      if (!appId.value || !storeId.value) {
        ElMessage.warning('请选择应用和店铺');
        return;
      }
      
      localStorage.setItem('appId', appId.value);
      localStorage.setItem('storeId', storeId.value);
      
      emit('getAppId', appId.value);
      emit('getStoreId', storeId.value);
      
      syncDialogVisible.value = false;
    };

    // 暴露方法给父组件调用
    const opend = () => {
      getList();
    };

    // 返回模板使用的变量和方法
    return {
      pageNo,
      pageSize,
      appId,
      storeId,
      list,
      storeList,
      storeForm,
      syncDialogVisible,
      getList,
      ensureDialog,
      opend
    };
  }
};
</script>
