<template>
  <div class="pay-container">
    <h3>应用设置</h3>
    <el-steps :active="step" simple style="margin-top: 20px">
      <el-step title="基础信息" @click="goOne"></el-step>
      <el-step title="服务类型" @click="goTwo"></el-step>
      <el-step title="配置参数" @click="goThree"></el-step>
    </el-steps>
    
    <!-- 第一步：基础信息 -->
    <div class="oneStep" v-show="step === 0">
      <el-form ref="form" :model="forms" label-width="120px">
        <el-form-item label="应用名称:">
          <el-input placeholder="请输入应用名称" v-model="forms.appName"></el-input>
        </el-form-item>
        <el-form-item label="应用公钥:">
          <el-input placeholder="请输入应用公钥" v-model="forms.publicKey"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="save" round>保存</el-button>
        </el-form-item>
      </el-form>
    </div>
    
    <!-- 第二步：服务类型 -->
    <div v-show="step === 1 && godeploy === true" class="twoStep">
      <el-table
        :data="serveList"
        fit
        border
        stripe
        highlight-current-row
        :header-cell-style="{color:'#5373e0',background:'#f3f6fb'}"
        style="width: 100%"
      >
        <el-table-column align="center" label="支付ID">
          <template #default="{ row }">
            <span>{{ row.id }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="支付名称">
          <template #default="{ row }">
            <span>{{ row.channelName }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="支付编码">
          <template #default="{ row }">
            <span>{{ row.channelCode }}</span>
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="300" align="center">
          <template #default="{ row }">
            <el-button @click="startService(row)" type="text" size="small" :disabled="row.state">
              开启服务
            </el-button>
            <el-button @click="setRealParams(row)" type="text" size="small" :disabled="!row.state">
              配置实际支付渠道
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    
    <!-- 第三步：配置参数 -->
    <div class="threeStep" v-show="step === 2">
      <el-table
        :data="realList"
        fit
        border
        stripe
        highlight-current-row
        :header-cell-style="{color:'#5373e0',background:'#f3f6fb'}"
        style="width: 100%"
      >
        <el-table-column align="center" label="支付ID">
          <template #default="{ row }">
            <span>{{ row.id }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="支付名称">
          <template #default="{ row }">
            <span>{{ row.channelName }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="支付编码">
          <template #default="{ row }">
            <span>{{ row.channelCode }}</span>
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="150" align="center">
          <template #default="{ row }">
            <el-button @click="setParam(row)" type="text" size="small">配置参数</el-button>
          </template>
        </el-table-column>
      </el-table>
      
      <div class="setParams">
        <!-- 支付宝配置表单 -->
        <el-form ref="form" :model="form" label-width="140px" v-show="!isWx && showParam">
          <el-form-item label="配置名称:" class="firstItem">
            <el-input placeholder="请输入配置名称" v-model="setName"></el-input>
            <el-select v-model="values" placeholder="调用配置" class="elSelect">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="支付宝公钥:">
            <el-input placeholder="请输入支付宝公钥" v-model="form.alipayPublicKey"></el-input>
          </el-form-item>
          <el-form-item label="APP私钥:">
            <el-input placeholder="请输入APP私钥" v-model="form.rsaPrivateKey"></el-input>
          </el-form-item>
          <el-form-item label="支付宝APPID:">
            <el-input placeholder="请输入支付宝APPID" v-model="form.appId"></el-input>
          </el-form-item>
          <el-form-item label="同步通知地址:">
            <el-input placeholder="请输入同步通知地址" v-model="form.returnUrl"></el-input>
          </el-form-item>
          <el-form-item label="异步通知地址:">
            <el-input placeholder="请输入异步通知地址" v-model="form.notifyUrl"></el-input>
          </el-form-item>
          <el-form-item class="btnParent">
            <el-button type="primary" @click="onSubmit" round class="btn">保存</el-button>
          </el-form-item>
        </el-form>
        
        <!-- 微信配置表单 -->
        <el-form ref="form" :model="wxform" label-width="140px" v-show="isWx && showParam">
          <el-form-item label="配置名称:" class="firstItem">
            <el-input placeholder="请输入配置名称" v-model="setNames"></el-input>
            <el-select v-model="values" placeholder="调用配置" class="elSelect">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="微信appId:">
            <el-input placeholder="请输入appId" v-model="wxform.appID"></el-input>
          </el-form-item>
          <el-form-item label="应用秘钥:">
            <el-input placeholder="请输入应用秘钥" v-model="wxform.appSecret"></el-input>
          </el-form-item>
          <el-form-item label="微信安全码Key:">
            <el-input placeholder="请输入安全码" v-model="wxform.key"></el-input>
          </el-form-item>
          <el-form-item label="异步通知地址:">
            <el-input placeholder="请输入同步通知地址" v-model="wxform.returnUrl"></el-input>
          </el-form-item>
          <el-form-item label="商户ID:">
            <el-input placeholder="请输入合作者PID" v-model="wxform.mchID"></el-input>
          </el-form-item>
          <el-form-item label="支付秘钥:">
            <el-input placeholder="请输入支付秘钥" v-model="wxform.payKey"></el-input>
          </el-form-item>
          <el-form-item class="btnParent">
            <el-button type="primary" @click="wxSubmit" round class="btn">保存</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
    
    <!-- 开启服务确认 -->
    <div v-show="step === 3 && !open" class="openBox">
      <el-button @click="opens" type="danger">确认开启</el-button>
    </div>
  </div>
</template>

<script>
import { ref, reactive, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { ElMessage } from 'element-plus';
import Setparams from "@/views/pay/setParams.vue";

// API 导入
import {
  createApp,
  getServiceType,
  getAllDealFromChannel,
  boundRoad,
  getAppList,
  updateApp,
  searchIsBindService
} from "@/api/pay";
import {
  setParams,
  getAllPayChannel,
  getPayChannelFromPayCode,
  getPayChannelIncludeOnlyPayParams,
  updateRealPayParam
} from "@/api/channel";

export default {
  name: "set",
  components: {
    Setparams
  },
  setup() {
    const route = useRoute();
    const router = useRouter();
    
    // 响应式状态
    const step = ref(0);
    const open = ref(false);
    const setName = ref("");
    const setNames = ref("");
    const godeploy = ref(true);
    const godeploys = ref(false);
    const serveList = ref([]);
    const filterData = ref([]);
    const values = ref("");
    const dialogVisible = ref(false);
    const realParam = ref(false);
    const isWx = ref(false);
    const showParam = ref(false);
    const isB2c = ref(false);
    const isC2b = ref(false);
    const AllData = ref([]);
    const filterDatas = ref([]);
    const paramId = ref(route.params.id || "0");
    const paramStep = ref(route.params.step || "0");
    const appIds = ref("");
    const payCodes = ref([]);
    const code = ref("");
    const realList = ref([]);
    const realParams = ref({});
    
    // 表单数据
    const form = reactive({
      appId: "",
      rsaPrivateKey: "",
      notifyUrl: "",
      returnUrl: "",
      url: "https://openapi.alipaydev.com/gateway.do",
      chareset: "UTF-8",
      format: "json",
      alipayPublicKey: "",
      signtype: "RSA2"
    });
    
    const wxform = reactive({
      appID: "",
      appSecret: "",
      key: "",
      mchID: "",
      payKey: "",
      returnUrl: ""
    });
    
    const forms = reactive({
      appName: "",
      publicKey: "",
      merchantId: "",
      notifyUrl: "",
      appId: ""
    });
    
    const realForm = reactive({
      appId: "",
      platformChannel: "",
      payChannel: ""
    });
    
    const setParasData = reactive({
      channelName: "",
      param: "",
      payChannel: "",
      platformChannelCode: "",
      appId: "",
      id: null
    });
    
    // 选项数据
    const options = ref([
      { value: "选项1", label: "支付宝web" },
      { value: "选项2", label: "微信移动端" }
    ]);

    // 生命周期钩子
    onMounted(() => {
      step.value = Number(paramStep.value);
      if (paramId.value !== "0") {
        getAppLists();
        appIds.value = paramId.value;
        getHigh();
      }
    });

    // 方法定义
    const getHigh = async () => {
      try {
        const ret = await searchIsBindService(paramId.value, "shanju_b2c");
        isB2c.value = ret !== 0;
        
        const rets = await searchIsBindService(paramId.value, "shanju_c2b");
        isC2b.value = rets !== 0;
        
        serveList.value = await getAllPayChannel();
        serveList.value.forEach(item => {
          item.state = item.channelCode === "shanju_b2c" ? isB2c.value : isC2b.value;
        });
      } catch (error) {
        ElMessage.error("获取服务状态失败");
      }
    };

    const getAppLists = async () => {
      try {
        AllData.value = await getAppList();
        filterDatas.value = AllData.value.filter(item => item.appId === paramId.value);
        
        if (filterDatas.value.length > 0) {
          const data = filterDatas.value[0];
          forms.appName = data.appName;
          forms.publicKey = data.publicKey;
          forms.appId = data.appId;
          forms.notifyUrl = data.notifyUrl;
          forms.merchantId = data.merchantId;
        }
      } catch (error) {
        ElMessage.error("获取应用列表失败");
      }
    };

    const onSubmit = async () => {
      try {
        setParasData.channelName = setName.value;
        setParasData.appId = appIds.value;
        setParasData.payChannel = code.value;
        setParasData.param = JSON.stringify(form);
        
        // 表单验证
        if (!form.appId || !form.rsaPrivateKey || !form.notifyUrl || !form.returnUrl || !form.alipayPublicKey) {
          ElMessage.error("必填项不能为空!");
          return;
        }
        
        if (paramId.value === "0") {
          await setParams(setParasData);
          ElMessage.success("添加成功!");
          router.push("/pay/index");
        } else {
          if (Object.keys(realParams.value).length === 0) {
            await setParams(setParasData);
            ElMessage.success("添加成功!");
            router.push("/pay/index");
          } else {
            setParasData.id = realParams.value.id;
            await updateRealPayParam(setParasData);
            ElMessage.success("修改成功!");
            router.push("/pay/index");
          }
        }
      } catch (error) {
        ElMessage.error("操作失败");
      }
    };

    const wxSubmit = async () => {
      try {
        setParasData.channelName = setNames.value;
        setParasData.appId = appIds.value;
        setParasData.payChannel = code.value;
        setParasData.param = JSON.stringify(wxform);
        
        // 表单验证
        if (!wxform.appID || !wxform.appSecret || !wxform.key || !wxform.mchID || !wxform.payKey || !wxform.returnUrl) {
          ElMessage.error("必填项不能为空!");
          return;
        }
        
        if (paramId.value === "0") {
          await setParams(setParasData);
          ElMessage.success("添加成功!");
          router.push("/pay/index");
        } else {
          if (Object.keys(realParams.value).length === 0) {
            await setParams(setParasData);
            ElMessage.success("添加成功!");
            router.push("/pay/index");
          } else {
            setParasData.id = realParams.value.id;
            await updateRealPayParam(setParasData);
            ElMessage.success("修改成功!");
            router.push("/pay/index");
          }
        }
      } catch (error) {
        ElMessage.error("操作失败");
      }
    };

    const startService = async (value) => {
      try {
        value.state = true;
        payCodes.value = [value.channelCode];
        await boundRoad(appIds.value, payCodes.value);
      } catch (error) {
        ElMessage.error("开启服务失败");
      }
    };

    const setParam = async (value) => {
      try {
        showParam.value = true;
        code.value = value.channelCode;
        
        if (paramId.value !== "0") {
          realForm.appId = appIds.value;
          realForm.payChannel = code.value;
          realParams.value = await getPayChannelIncludeOnlyPayParams(
            realForm.appId,
            realForm.platformChannel,
            realForm.payChannel
          );
        }
        
        // 使用nextTick代替setTimeout
        await nextTick();
        
        if (value.channelCode === "WX_JSAPI" || value.channelCode === "WX_MICROPAY") {
          if (Object.keys(realParams.value).length !== 0) {
            if (value.channelCode === realParams.value.payChannel) {
              setNames.value = realParams.value.channelName;
              Object.assign(wxform, JSON.parse(realParams.value.param));
            }
          }
          isWx.value = true;
        } else {
          if (Object.keys(realParams.value).length !== 0 && value.channelCode === realParams.value.payChannel) {
            setName.value = realParams.value.channelName;
            Object.assign(form, JSON.parse(realParams.value.param));
          }
          isWx.value = false;
        }
      } catch (error) {
        ElMessage.error("设置参数失败");
      }
    };

    const opens = () => {
      open.value = true;
    };

    const save = async () => {
      try {
        if (paramId.value === "0") {
          const res = await createApp(forms);
          appIds.value = res.appId;
          getServeType();
        } else {
          const res = await updateApp(forms);
          appIds.value = res.appId;
          await getHigh();
        }
        step.value = 1;
      } catch (error) {
        ElMessage.error("保存失败");
      }
    };

    const handleClicks = () => {
      step.value = 2;
    };

    const goOne = () => {
      step.value = 0;
    };

    const goTwo = async () => {
      step.value = 1;
      godeploy.value = true;
      showParam.value = false;
      
      if (paramId.value !== "0") {
        await getHigh();
      }
    };

    const goThree = () => {
      step.value = 2;
      godeploy.value = false;
    };

    const getServeType = async () => {
      try {
        serveList.value = await getAllPayChannel();
        serveList.value.forEach(item => {
          item.state = false;
        });
      } catch (error) {
        ElMessage.error("获取服务类型失败");
      }
    };

    const setRealParams = async (value) => {
      try {
        setParasData.platformChannelCode = value.channelCode;
        realForm.platformChannel = value.channelCode;
        step.value = 2;
        
        realList.value = await getPayChannelFromPayCode(value.channelCode);
        realParam.value = value.channelCode === "shanju_c2b";
      } catch (error) {
        ElMessage.error("设置真实参数失败");
      }
    };

    // 返回模板使用的变量和方法
    return {
      step,
      open,
      setName,
      setNames,
      godeploy,
      godeploys,
      options,
      serveList,
      filterData,
      values,
      dialogVisible,
      realParam,
      form,
      wxform,
      realList,
      code,
      appIds,
      payCodes,
      setParasData,
      forms,
      realForm,
      realParams,
      isWx,
      showParam,
      isB2c,
      isC2b,
      AllData,
      filterDatas,
      onSubmit,
      wxSubmit,
      startService,
      setParam,
      opens,
      save,
      handleClicks,
      goOne,
      goTwo,
      goThree,
      getServeType,
      setRealParams
    };
  }
};
</script>

<style lang="scss">
.pay-container {
  width: 1200px;
  margin: 0 auto;
  padding: 42px 44px;
  background: white;
  height: auto;

  .oneStep {
    width: 330px;
    margin: 0 auto;
    margin-top: 125px;

    button {
      width: 120px;
      margin-top: 50px;
    }
  }

  .twoStep {
    margin-top: 30px;
  }

  .threeStep {
    width: 100%;
    margin: 0 auto;
    margin-top: 30px;
    input {
      width: 340px;
    }
    h3 {
      text-align: center;
      margin: 50px 0 60px 0;
    }
    .firstItem {
      position: relative;
      .elSelect {
        position: absolute;
        right: 60px;
        top: 0px;
        input {
          width: 100px;
        }
      }
    }
  }

  .fourStep {
    width: 700px;
    margin: 0 auto;
    margin-top: 40px;
    h3 {
      text-align: center;
      margin-bottom: 60px;
    }

    p {
      text-align: center;
      margin-top: 35px;
    }
    .first {
      margin-left: 50px;
      position: relative;
      button {
        position: absolute;
        right: 200px;
        top: 0;
      }
    }

    .second {
      position: relative;
      margin-left: 50px;
      button {
        position: absolute;
        right: 200px;
        top: 0;
      }
    }

    .third {
      margin-left: 120px;
      margin-top: 60px;
      button {
        width: 150px;
      }
    }

    input {
      width: 260px;
    }

    .elForm {
      margin-left: 50px;
    }
  }

  .openBox {
    button {
      width: 150px;
      height: 50px;
      display: block;
      margin: 0 auto;
      margin-top: 200px;
    }
  }
}

.setParams {
  width: 650px;
  margin: 0 auto;
  margin-top: 35px;
}

.btnParent {
  .btn {
    margin-left: 100px;
  }
}
</style>

<style lang="scss" scoped>
</style>
