<template>
  <div class="navbar">
    <breadcrumb
      id="breadcrumb-container"
      class="breadcrumb-container"
    />
 
  </div>
</template>

<script>
import { Component, Vue } from 'vue-property-decorator'
import { appStore } from '@/store/modules/app'
import { userStore } from '@/store/modules/userStore'
import Breadcrumb from '@/components/Breadcrumb/index.vue'


@Component({
  name: 'Navbar',
  components: {
    Breadcrumb
  }
})
export default class extends Vue {
 



}
</script>

<style lang="scss" scoped>
.navbar {
  height: 60px;
  padding: 10px 0 0 10px;
  box-sizing: border-box;
  background: #f3f6fb;
  font-size: 20px;
  margin-top: 50px;
  width: 1200px;
  margin: 0 auto;
  margin-top: 60px;

  .breadcrumb-container {
    float: left;
  }

}
</style>
