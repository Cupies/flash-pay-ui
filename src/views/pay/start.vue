<template>
  <div class="start-container">
      <h2>开启支付</h2>
      <el-row type="flex" justify="end" class="add">
    </el-row>
      <p>您好，如果您已正确配置支付参数，可以使用以下服务类型开启支付，请选择: </p>
      <el-button type="primary" size="medium" @click="openSkuDialog" id="addBtn">设置默认支付方式</el-button>
      <div class="content">
        <el-form ref="form" :model="form" label-width="140px">
        <el-form-item label="商品详情">
            <el-input placeholder="请输入商品详情" v-model="form.body"></el-input>
        </el-form-item>
        <el-form-item label="商品金额">
            <el-input placeholder="请输入金额" v-model="form.totalAmount" type="number" @input="BlurText"></el-input>
        </el-form-item>
    </el-form>
        <div class="stepOne">
            <p class="center">
              <img src="../../../public/img/ctob.png" alt="" v-if="!isCode"  class="imgs">
              <img :src="codes " alt="" v-if="isCode" class="imgs2">
            </p>
            <p>C扫B</p>
            <el-button type="primary" @click="cTob">生成门店二维码</el-button>
        </div>
        <div class="stepOne">
            <p class="center">
              <img src="../../../public/img/btoc.png" alt="" class="imgs">
            </p>
            <p>B扫C</p>
            <el-button type="primary" @click="bToc">下单开启扫码</el-button>
        </div>
      </div>
              
      <setMo :dialogVisible.sync="dialogVisible" @getAppId="getAppIds" @getStoreId="getStoreIds"></setMo>
      <cTob :dialogVisible.sync="dialogVisible1"  :code="codes"></cTob>
      <!-- <bToc :dialogVisible.sync="dialogVisible2"></bToc> -->
      <Scan :visible.sync="dialogVisible2"  @close-dialogStatus="Close_dialog"></Scan>
  </div>
</template>

<script>
import { ref, reactive } from 'vue';
import { ElMessage } from 'element-plus';
import SetMo from '@/views/pay/setMo.vue';
import BToc from '@/views/pay/bToc.vue';
import CTob from '@/views/pay/cTob.vue';
import Scan from '@/views/pay/scan.vue';
import { getStoresDataCode } from '@/api/pay';

export default {
  components: {
    SetMo,
    CTob,
    BToc,
    Scan
  },
  setup() {
    // 响应式状态管理
    const dialogVisible = ref(false);
    const dialogVisible1 = ref(false);
    const dialogVisible2 = ref(false);
    const isCode = ref(false);
    const appId = ref('');
    const storeId = ref('');
    const codes = ref('');
    
    // 响应式表单
    const form = reactive({
      totalAmount: '',
      body: ''
    });

    // 弹窗控制方法
    const openSkuDialog = () => {
      dialogVisible.value = true;
    };

    const Close_dialog = () => {
      dialogVisible2.value = false;
    };

    // 输入验证
    const BlurText = (e) => {
      if (Number(e) < 0) {
        ElMessage.warning('不能输入负数');
        form.totalAmount = '';
      }
    };

    // C端到B端支付
    const cTob = async () => {
      appId.value = localStorage.getItem('appId') || '';
      storeId.value = localStorage.getItem('storeId') || '';
      
      if (!appId.value || !storeId.value) {
        ElMessage.error('请设置默认支付方式');
        return;
      }
      
      if (!form.body || !form.totalAmount) {
        ElMessage.error('必填项不能为空!');
        return;
      }
      
      isCode.value = true;
      try {
        codes.value = await getStoresDataCode(
          appId.value,
          storeId.value,
          form.body,
          form.totalAmount
        );
      } catch (error) {
        ElMessage.error('获取支付码失败');
        isCode.value = false;
      }
    };

    // B端到C端支付
    const bToc = () => {
      dialogVisible2.value = true;
    };

    // 获取应用和店铺ID
    const getAppIds = (value) => {
      appId.value = value;
    };

    const getStoreIds = (value) => {
      storeId.value = value;
    };

    return {
      dialogVisible,
      dialogVisible1,
      dialogVisible2,
      isCode,
      appId,
      storeId,
      codes,
      form,
      openSkuDialog,
      Close_dialog,
      BlurText,
      cTob,
      bToc,
      getAppIds,
      getStoreIds
    };
  }
};
</script>

<style lang="scss">
  .start-container {
    width: 1200px;
    margin: 00 auto;
    padding: 42px 44px;
    background: white;
    height: 1000px;
  }

  .content {
    margin-top: 20px;
    &>p {
      font-size: 14px;
      color: #303133;
      line-height: 40px;
    }
    input {
      width: 100%;
    }
    .el-form {
      width: 35%;
      margin: 0 auto;
    }
    .stepOne {
      float: left;
      width: 250px;                                                                                                                                                                      
      text-align: center;
      margin-left: 240px;
      margin-top: 50px;

      p {
        font-size: 14px;
        color: #909399;
        margin-top: 70px;
      }

      h4 {
        margin-top: 20px;
      }

      .center {
          margin-top: 20px;
          margin-left: 40px;
          width: 182px;
          height: 191px;
          background: #ECF5FF;
          .imgs {
            margin-top: 40px;
          }
      }
    }
  }
</style>

<style lang="scss" scoped>

</style>
