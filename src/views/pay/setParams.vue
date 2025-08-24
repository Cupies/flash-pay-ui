<template>
  <el-dialog title="新增工单" :visible.sync="syncDialogVisible">
    <el-form ref="form" :model="form" label-width="140px">
        <el-form-item label="合作者身份PID: " class="firstItem">
            <el-input placeholder="请输入合作者身份PID"></el-input>
            <el-select v-model="value" placeholder="调用配置" class="elSelect">
                <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value">
                </el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="支付宝卖家账号: ">
            <el-input placeholder="请输入支付宝卖家账号"></el-input>
        </el-form-item>
        <el-form-item label="安全校验码KEY: ">
            <el-input placeholder="请输入安全校验码KEY"></el-input>
        </el-form-item>
        <el-form-item label="PSA私钥: ">
            <el-input placeholder="请输入PSA私钥"></el-input>
        </el-form-item>
        <el-form-item label="支付宝APPID: ">
            <el-input placeholder="请输入支付宝APPID"></el-input>
        </el-form-item>
            <el-form-item>
            <el-button @click="onSubmit" round>测试</el-button>
            <el-button type="primary" @click="onSubmit" round>保存</el-button>
            </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="syncDialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="ensureDialog">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { computed } from 'vue';

export default {
  name: 'setParams',
  props: {
    dialogVisible: {
      type: Boolean,
      default: false
    }
  },
  emits: ['update:dialogVisible'], // 声明自定义事件
  setup(props, { emit }) {
    // 替代 @PropSync 的双向绑定实现
    const syncDialogVisible = computed({
      get: () => props.dialogVisible,
      set: (value) => {
        emit('update:dialogVisible', value);
      }
    });

    return {
      syncDialogVisible
    };
  }
};
</script>