<template>
  <el-dialog :visible.sync="syncDialogVisible" @open="opend">
    <el-form :inline="false">
      <el-form-item label="客户ID: " >
        <span>{{data.clientId}}</span>
      </el-form-item >

      <el-form-item label="客户端秘钥: " >
        <span>{{data.clientSecret}}</span>
      </el-form-item>

      <el-form-item label="闪聚平台公钥: " >
        <span>{{data.platformPublickey}}</span>
      </el-form-item>

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
import { getPayParams } from '@/api/pay';

export default {
  props: {
    dialogVisible: {
      type: Boolean,
      default: false
    },
    appId: {
      type: String,
      required: true
    }
  },
  emits: ['update:dialogVisible', 'update:appId'],
  setup(props, { emit }) {
    // 响应式状态
    const pageNo = ref(1);
    const pageSize = ref(10);
    const storeId = ref(0);
    const data = ref({});

    // 双向绑定处理（替代 @PropSync）
    const syncDialogVisible = computed({
      get: () => props.dialogVisible,
      set: (value) => emit('update:dialogVisible', value)
    });

    const appIds = computed({
      get: () => props.appId,
      set: (value) => emit('update:appId', value)
    });

    // 生命周期钩子
    onMounted(() => {
      getList();
    });

    // 方法定义
    const getList = async () => {
      try {
        // 保留空方法（根据实际需求补充）
      } catch (error) {
        ElMessage.error('数据获取失败');
      }
    };

    const opend = async () => {
      try {
        const res = await getPayParams(props.appId);
        data.value = res;
      } catch (error) {
        ElMessage.error('参数获取失败');
      }
    };

    const ensureDialog = () => {
      syncDialogVisible.value = false;
    };

    return {
      pageNo,
      pageSize,
      storeId,
      data,
      syncDialogVisible,
      appIds,
      opend,
      ensureDialog
    };
  }
};
</script>
