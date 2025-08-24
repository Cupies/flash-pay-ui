<template>
  <el-dialog :visible.sync="syncDialogVisible" @open="opend">
    <h3>C扫B调用成功</h3>
    <img :src="codes" alt="">
    <div slot="footer" class="dialog-footer">
      <el-button @click="syncDialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="ensureDialog">确 定</el-button>
    </div>
    
  </el-dialog>
</template>

<script>
import { ref, reactive, computed, onMounted } from 'vue';
import { ElMessage } from 'element-plus';

export default {
  props: {
    dialogVisible: {
      type: Boolean,
      default: false
    },
    code: {
      type: String,
      required: true
    }
  },
  emits: ['update:dialogVisible', 'update:code'],
  setup(props, { emit }) {
    // 响应式状态
    const pageNo = ref(1);
    const pageSize = ref(10);
    const appId = ref(0);
    const storeId = ref(0);
    const list = ref([]);
    const storeList = ref([]);
    
    // 响应式表单
    const form = reactive({
      mobile: '',
      password: '',
      storeId: 0
    });

    // 双向绑定处理（替代 @PropSync）
    const syncDialogVisible = computed({
      get: () => props.dialogVisible,
      set: (value) => emit('update:dialogVisible', value)
    });

    const codes = computed({
      get: () => props.code,
      set: (value) => emit('update:code', value)
    });

    // 生命周期钩子
    onMounted(() => {
      getList();
    });

    // 方法定义
    const opend = () => {
      console.log(codes.value);
    };

    const getList = async () => {
      // 保留API调用占位符（根据实际需求实现）
      // 示例：list.value = await getAppList();
    };

    const ensureDialog = () => {
      syncDialogVisible.value = false;
    };

    // 返回模板使用的变量和方法
    return {
      pageNo,
      pageSize,
      appId,
      storeId,
      form,
      list,
      storeList,
      syncDialogVisible,
      codes,
      opend,
      getList,
      ensureDialog
    };
  }
};
</script>
