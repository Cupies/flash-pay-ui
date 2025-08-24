<template>
  <div class="app-container">
      <h3>我的支付</h3>
    <el-row type="flex" justify="end" class="add">
      <el-button type="primary" size="medium" @click="openTaskDialog" id="addBtn">创建应用</el-button>
    </el-row>
    <el-table
      style="width: 100%"
      :data="list"
      :header-cell-style="{color:'#5373e0',background:'#f3f6fb'}"
    >
       <el-table-column width="center" align="center" label="应用ID">
        <template slot-scope="scope">
          <span>{{ scope.row. appId}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="应用名称">
        <template slot-scope="scope">
          <span>{{ scope.row.appName }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="应用公钥">
        <template slot-scope="scope">
          <span>{{ scope.row.publicKey }}</span>
        </template>
      </el-table-column>
      <el-table-column
      fixed="right"
      label="获取支付参数"
      width="150"
      align="center">
      <template slot-scope="scope">
        <el-button @click="getDetail(scope.row)" type="text" size="small">获取</el-button>
      </template>
    </el-table-column>

     <el-table-column
      fixed="right"
      label="操作"
      width="150"
      align="center">
      <template slot-scope="scope">
        <el-button @click="handleClick(scope.row)" type="text" size="small">编辑</el-button>
        <el-button @click="setData(scope.row)" type="text" size="small">配置</el-button>
      </template>
    </el-table-column>
    </el-table>
      <getPayParams :dialogVisible.sync="dialogVisible" :appId="appIds"></getPayParams>
     <!-- <pagination
      v-show="total>0"
      :total="total"
      :page="1"
      :limit="10"
      @pagination="getList"
    /> -->
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { ElMessage } from 'element-plus';
import Pagination from "@/components/Pagination/index.vue";
import GetPayParams from '@/views/pay/getPayParams.vue';
import { getAppList } from '@/api/pay';

export default {
  name: 'manage',
  components: {
    Pagination,
    GetPayParams
  },
  setup() {
    // 响应式状态
    const total = ref(0);
    const list = ref([]);
    const dialogVisible = ref(false);
    const appIds = ref('');
    const router = useRouter();

    // 生命周期钩子
    onMounted(() => {
      getList();
    });

    // 获取应用列表
    const getList = async () => {
      try {
        list.value = await getAppList();
        total.value = list.value.length;
      } catch (error) {
        ElMessage.error('获取应用列表失败');
        console.error('API请求异常:', error);
      }
    };

    // 路由跳转方法
    const openTaskDialog = () => {
      router.push({ path: '/pay/set/0/0' });
    };

    const handleClick = (value) => {
      router.push({ path: `/pay/set/${value.appId}/0` });
    };

    const setData = (value) => {
      router.push({ path: `/pay/set/${value.appId}/1` });
    };

    // 打开详情弹窗
    const getDetail = (value) => {
      dialogVisible.value = true;
      appIds.value = value.appId;
    };

    return {
      total,
      list,
      dialogVisible,
      appIds,
      getList,
      openTaskDialog,
      handleClick,
      getDetail,
      setData
    };
  }
};
</script>

<style>
  .app-container #addBtn,#searchBtn{
    background: #5373e0;
    border-color: #5373e0;
  }

  .app-container {
       width: 1200px;
        margin: 00 auto;
        padding: 42px 44px;
        background: white;
        height: 100%;
    }
  
  .app-container #reset {
    background: #ff9540;
    border-color: #ff9540;
    color: white;
  }
  .app-container .forms {
    background: white;
    padding:20px 10px 0 10px;
  }
  .app-container .add {
    margin-bottom: 10px;
  }
</style>
