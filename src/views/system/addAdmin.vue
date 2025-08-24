<template>
  <el-dialog title="新增成员" :visible.sync="syncDialogVisible">
    <el-form :inline="false">
      <el-form-item label="手机号: " :label-width="formLabelWidth" :rules="[{required:true}]">
        <el-input v-model="form.mobile"></el-input>
      </el-form-item >

      <el-form-item label="密码: " :label-width="formLabelWidth">
        <el-input v-model="form.password"></el-input>
      </el-form-item>

      <el-form-item label="用户名: " :label-width="formLabelWidth">
        <el-input v-model="form.username"></el-input>
      </el-form-item>

      <el-form-item label="用户名: " :label-width="formLabelWidth">
        <el-input v-model="form.username"></el-input>
      </el-form-item>


    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="syncDialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="ensureDialog">确 定</el-button>
    </div>
    
  </el-dialog>
</template>

<script>
import { ref } from 'vue';
import { ElMessage } from 'element-plus';
import { createAdmin } from '@/api/system';

export default {
  props: {
    dialogVisible: {
      type: Boolean,
      default: false
    }
  },
  emits: ['update:dialogVisible'],
  setup(props, { emit }) {
    // 响应式表单数据
    const form = ref({
      mobile: '',
      password: '',
      storeId: 0
    });

    // 同步 dialogVisible 状态（替代 @PropSync）
    const syncDialogVisible = ref(props.dialogVisible);
    const updateDialogVisible = (value) => {
      emit('update:dialogVisible', value);
    };

    // 确认对话框操作
    const ensureDialog = async () => {
      try {
        const res = await createAdmin(form.value);
        ElMessage({ type: 'success', message: '操作成功', duration: 2000 });
        updateDialogVisible(false); // 关闭对话框
      } catch (error) {
        ElMessage({ type: 'error', message: '操作失败', duration: 2000 });
      }
    };

    return {
      form,
      syncDialogVisible,
      ensureDialog,
      updateDialogVisible
    };
  }
};
</script>
