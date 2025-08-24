<template>
  <el-dialog title="支付设置" :visible.sync="syncDialogVisible" @open="opend">
    <h3>B扫C调用成功</h3>
    <p>调用摄像头/采集设备成功</p>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="ensureDialog">开始扫描</el-button>
    </div>
    <Scan :visible.sync="dialogVisibles"></Scan>
  </el-dialog>
</template>

<script>
import { ref, reactive, computed, onMounted } from 'vue';
import { ElMessage } from 'element-plus';
import Scan from '@/views/pay/scan.vue';

export default {
  components: { Scan },
  props: {
    dialogVisible: {
      type: Boolean,
      default: false
    }
  },
  emits: ['update:dialogVisible'],
  setup(props, { emit }) {
    // 响应式状态管理
    const pageNo = ref(1);
    const pageSize = ref(10);
    const appId = ref(0);
    const storeId = ref(0);
    const dialogVisibles = ref(false);
    
    // 表单数据（使用 reactive 处理对象）
    const form = reactive({
      appId: '',
      authCode: '',
      subject: '',
      totalAmount: 0
    });

    const list = ref([]);
    const storeList = ref([]);

    // PropSync 替代方案（Vue 3 双向绑定）
    const syncDialogVisible = computed({
      get: () => props.dialogVisible,
      set: (value) => emit('update:dialogVisible', value)
    });

    // 生命周期钩子（替代 created）
    onMounted(() => {
      getList();
    });

    // 方法定义
    const opend = async () => {
      try {
        // 实际调用示例（需取消注释）
        // const res = await BscanC(form);
        // console.log(res);
      } catch (error) {
        ElMessage.error('请求失败: ' + error.message);
      }
    };

    const getList = async () => {
      // 保留API调用占位符
      // 示例：list.value = await getStoresData();
    };

    const ensureDialog = () => {
      dialogVisibles.value = true;
      syncDialogVisible.value = false;
    };

    // 暴露给模板的变量和方法
    return {
      pageNo,
      pageSize,
      appId,
      storeId,
      dialogVisibles,
      form,
      list,
      storeList,
      syncDialogVisible,
      opend,
      getList,
      ensureDialog
    };
  }
};
</script>