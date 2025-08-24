<template>
  <div class="app-container">
    <el-input
      v-model="filterText"
      placeholder="Filter keyword"
      style="margin-bottom:30px;"
    />
    <el-tree
      ref="tree2"
      :data="data2"
      :props="defaultProps"
      :filter-node-method="filterNode"
      class="filter-tree"
      default-expand-all
    />
  </div>
</template>

<script>
import { ref, watch } from 'vue';
import { ElTree } from 'element-plus';

export default {
  name: 'Tree',
  setup() {
    const filterText = ref('');
    const treeRef = ref(null); // 用于引用Tree组件实例

    // 树形数据
    const data2 = ref([
      {
        id: 1,
        label: 'Level one 1',
        children: [{
          id: 4,
          label: 'Level two 1-1',
          children: [{
            id: 9,
            label: 'Level three 1-1-1'
          }, {
            id: 10,
            label: 'Level three 1-1-2'
          }]
        }]
      }, {
        id: 2,
        label: 'Level one 2',
        children: [{
          id: 5,
          label: 'Level two 2-1'
        }, {
          id: 6,
          label: 'Level two 2-2'
        }]
      }, {
        id: 3,
        label: 'Level one 3',
        children: [{
          id: 7,
          label: 'Level two 3-1'
        }, {
          id: 8,
          label: 'Level two 3-2'
        }]
      }
    ]);

    // 树组件属性配置
    const defaultProps = {
      children: 'children',
      label: 'label'
    };

    // 监听filterText变化
    watch(filterText, (newValue) => {
      if (treeRef.value) {
        treeRef.value.filter(newValue);
      }
    });

    // 节点过滤方法
    const filterNode = (value, data) => {
      if (!value) return true;
      return data.label && data.label.includes(value);
    };

    return {
      filterText,
      data2,
      defaultProps,
      filterNode,
      treeRef
    };
  },
  components: {
    ElTree
  }
};
</script>
