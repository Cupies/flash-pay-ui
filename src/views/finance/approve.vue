<template>
  <div class="approve-container">
      <h2>资质申请</h2>
      <el-form ref="form" :model="form" label-width="140px" class="froms">
        <h3>基础信息</h3>
        <el-form-item label="企业名称">
            <el-input  v-model="form.merchantName" placeholder="请输入企业名称"></el-input>
        </el-form-item>
        <el-form-item label="企业营业执行编号">
            <el-input v-model="form.merchantNo"  placeholder="请输入执行编号"></el-input>
        </el-form-item>
        <el-form-item label="企业地址">
            <el-input  v-model="form.merchantAddress" type="textarea" rows="5" placeholder="请输入企业地址"></el-input>
        </el-form-item>
        <hr>
        <h3>行业类型</h3>
        <el-form-item label="行业类型">
            <el-select placeholder="请选择行业类型" v-model="form.merchantType">
            <el-option label="教育" value="教育"></el-option>
            <el-option label="科学研究" value="科学研究"></el-option>
            <el-option label="零售" value="零售"></el-option>
            </el-select>
        </el-form-item>
        <hr>
        <h3>证件上传</h3>
        <el-form-item label="上传企业证明" class="files">
            <el-upload
                class="avatar-uploader"
                action="#"
                :show-file-list="false"
                :on-success="handleAvatarSuccess"
                :http-request="uploadImg">
                <img v-if="imageUrl" :src="imageUrl" class="avatar">
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
        </el-form-item>
        <el-form-item label="上传法人身份证" class="idCard">
            <el-upload
                class="avatar-uploader1"
                action="#"
                :show-file-list="false"
                :on-success="handleAvatarSuccess1"
                :http-request="uploadImg1">
                <img v-if="imageUrl1" :src="imageUrl1" class="avatar1">
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
            <el-upload
                class="avatar-uploader2"
                action="#"
                :show-file-list="false"
                :on-success="handleAvatarSuccess2"
                :http-request="uploadImg2">
                <img v-if="imageUrl2" :src="imageUrl2" class="avatar2">
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
        </el-form-item>
        <hr class="clear">
        <h3>联系人信息</h3>
         <el-form-item label="联系人">
            <el-input  v-model="form.username"  placeholder="请输入联系人"></el-input>
        </el-form-item>
        <el-form-item label="联系人地址">
            <el-input type="textarea"  rows="5" placeholder="请输入联系人地址" v-model="form.contactsAddress" ></el-input>
        </el-form-item>
        <el-form-item>
            <el-button>取消</el-button>
            <el-button @click="submit"  type="primary">提交</el-button>
        </el-form-item>
        </el-form>
  </div>
</template>

<script>
import { defineComponent, ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { setApprove, upload, getList } from '@/api/finance'

export default defineComponent({
  name: 'Login',
  setup() {
    const router = useRouter()
    
    const form = ref({
      contactsAddress: '',
      merchantAddress: '',
      merchantName: '',
      merchantNo: 0,
      merchantType: '',
      password: '',
      tenantId: null,
      idCardAfterImg: '',
      idCardFrontImg: '',
      businessLicensesImg: '',
      auditStatus: '',
      username: '',
      id: 0
    })
    
    const imageUrl = ref('')
    const imageUrl1 = ref('')
    const imageUrl2 = ref('')
    const id = ref(0)

    const getLists = async () => {
      try {
        const res = await getList()
        if (res) {
          form.value.contactsAddress = res.contactsAddress
          form.value.merchantAddress = res.merchantAddress
          form.value.merchantName = res.merchantName
          form.value.merchantNo = res.merchantNo
          form.value.merchantType = res.merchantType
          imageUrl1.value = res.idCardFrontImg
          imageUrl.value = res.businessLicensesImg
          imageUrl2.value = res.idCardAfterImg
          form.value.username = res.username
        }
        console.log(res)
      } catch (error) {
        console.error('获取数据失败:', error)
      }
    }

    const handleAvatarSuccess = (res, file) => {
      imageUrl.value = URL.createObjectURL(file.raw)
    }

    const handleAvatarSuccess1 = (res, file) => {
      imageUrl1.value = URL.createObjectURL(file.raw)
    }

    const handleAvatarSuccess2 = (res, file) => {
      imageUrl2.value = URL.createObjectURL(file.raw)
    }

    const uploadImg = async (params) => {
      try {
        const formData = new FormData()
        formData.append("file", params.file)
        const res = await upload(formData)
        form.value.businessLicensesImg = res
      } catch (error) {
        console.error('上传图片失败:', error)
      }
    }

    const uploadImg1 = async (params) => {
      try {
        const formData = new FormData()
        formData.append("file", params.file)
        const res = await upload(formData)
        form.value.idCardFrontImg = res
      } catch (error) {
        console.error('上传图片失败:', error)
      }
    }

    const uploadImg2 = async (params) => {
      try {
        const formData = new FormData()
        formData.append("file", params.file)
        const res = await upload(formData)
        form.value.idCardAfterImg = res
      } catch (error) {
        console.error('上传图片失败:', error)
      }
    }

    const submit = async () => {
      try {
        await setApprove(form.value)
        router.push('/finance/index')
      } catch (error) {
        console.error('提交失败:', error)
      }
    }

    onMounted(() => {
      getLists()
    })

    return {
      form,
      imageUrl,
      imageUrl1,
      imageUrl2,
      id,
      getLists,
      handleAvatarSuccess,
      handleAvatarSuccess1,
      handleAvatarSuccess2,
      uploadImg,
      uploadImg1,
      uploadImg2,
      submit
    }
  }
})
</script>

<style lang="scss">
    .approve-container {
        width: 1200px;
        margin: 0 auto;
        background: white;
        padding: 42px 44px;

        .clear {
            clear: both;
        }
        .froms {
            padding: 40px 40px;
            input {
                width: 250px;
            }

            .el-textarea {
                width: 400px;
            }
        }

          .avatar-uploader .el-upload {
                border: 1px dashed #d9d9d9;
                border-radius: 6px;
                cursor: pointer;
                position: relative;
                overflow: hidden;
            }
            .avatar-uploader .el-upload:hover {
                border-color: #409EFF;
            }

            .avatar-uploader {
                width: 350px;
                 .avatar-uploader-icon {
                    font-size: 28px;
                    color: #8c939d;
                    width: 178px;
                    height: 370px;
                    line-height: 370px;
                    text-align: center;
                }
            }
           
            .avatar {
                width: 178px;
                height: 370px;
                display: block;
            }
             .avatar-uploader1 .el-upload {
                border: 1px dashed #d9d9d9;
                border-radius: 6px;
                cursor: pointer;
                position: relative;
                overflow: hidden;
            }
            .avatar-uploader1 .el-upload:hover {
                border-color: #409EFF;
            }
            .avatar-uploader-icon {
                font-size: 28px;
                color: #8c939d;
                width: 178px;
                height: 178px;
                line-height: 178px;
                text-align: center;
            }
            .avatar1 {
                width: 178px;
                height: 178px;
                display: block;
            }
             .avatar-uploader2 .el-upload {
                border: 1px dashed #d9d9d9;
                border-radius: 6px;
                cursor: pointer;
                position: relative;
                overflow: hidden;
            }
            .avatar-uploader2 .el-upload:hover {
                border-color: #409EFF;
            }
            .avatar-uploader-icon {
                font-size: 28px;
                color: #8c939d;
                width: 178px;
                height: 178px;
                line-height: 178px;
                text-align: center;
            }
            .avatar2 {
                width: 178px;
                height: 178px;
                display: block;
            }
        .files {
            float: left;
        }
        .idCard {
            float: left;
            margin-left: 10px;
            .upload-demo .el-upload-dragger {
                width: 326px;
                height: 222px;
            }
        }

        hr {
            display: block;
            margin: 50px 0 50px 0;
            color: rgb(248, 242, 242);
        }
    }
</style>

<style lang="scss" scoped>

</style>
