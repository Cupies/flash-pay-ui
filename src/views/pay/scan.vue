<template>
  <el-dialog
    title="支付设置"
    :model-value="visible"
    @update:modelValue="$emit('update:visible', $event)"
    @open="onOpen"
    :append-to-body="true"
    width="400px"
  >
    <div class="scan-container">
      <div class="camera-view">
        <video
          ref="videoRef"
          id="video"
          autoplay
          playsinline
          style="background: #ccc;"
          v-show="!isCaptured"
        ></video>
        
        <canvas
          ref="canvasRef"
          id="canvas"
          style="display:none;"
          width="300"
          height="300"
        ></canvas>
        
        <img
          src=""
          alt=""
          ref="imgRef"
          v-show="isCaptured"
          style="width: 300px; height: 300px; object-fit: contain; background: #f5f7fa;"
        >
        
        <!-- 扫描框效果 -->
        <div v-if="!isCaptured" class="scan-overlay">
          <div class="scan-line"></div>
          <div class="corner top-left"></div>
          <div class="corner top-right"></div>
          <div class="corner bottom-left"></div>
          <div class="corner bottom-right"></div>
        </div>
      </div>
      
      <p v-if="!isCaptured" class="scan-tips">将二维码置于框内，保持平稳</p>
      
      <div v-if="decodedResult" class="result-container">
        <p class="result-title">解码结果：</p>
        <p class="result-content">{{ decodedResult }}</p>
      </div>
    </div>
    
    <template #footer>
      <div class="dialog-footer">
        <el-button 
          v-if="!isCaptured" 
          type="primary" 
          @click="captureImage"
          :loading="isCapturing"
        >
          拍照
        </el-button>
        
        <el-button 
          v-if="isCaptured" 
          @click="resetCamera"
        >
          重新拍摄
        </el-button>
        
        <el-button 
          type="primary" 
          @click="decodeQrCode"
          :disabled="!isCaptured"
          :loading="isDecoding"
        >
          确定
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>


<script>
import { ref, onMounted, nextTick, watch } from 'vue'
import { ElMessage } from 'element-plus'
import QrcodeDecoder from 'qrcode-decoder'

export default {
  name: 'ScanDialog',
  props: {
    visible: {
      type: Boolean,
      default: false
    }
  },
  emits: ['update:visible'],
  setup(props, { emit }) {
    const videoRef = ref(null)
    const canvasRef = ref(null)
    const imgRef = ref(null)
    const isCaptured = ref(false)
    const codes = ref('')
    const mediaStream = ref(null)
    const qrDecoder = new QrcodeDecoder()
    
    // 初始化摄像头
    const initCamera = async () => {
      try {
        // 停止之前的流
        if (mediaStream.value) {
          mediaStream.value.getTracks().forEach(track => track.stop())
        }
        
        // 请求摄像头权限
        mediaStream.value = await navigator.mediaDevices.getUserMedia({ 
          video: { 
            facingMode: 'environment', // 优先使用后置摄像头
            width: { ideal: 300 },
            height: { ideal: 300 }
          } 
        })
        
        if (videoRef.value) {
          videoRef.value.srcObject = mediaStream.value
        }
      } catch (error) {
        console.error('无法访问摄像头:', error)
        ElMessage.error('无法访问摄像头，请检查权限设置')
      }
    }
    
    // 捕获图像
    const captureImage = () => {
      const video = videoRef.value
      const canvas = canvasRef.value
      
      if (video && canvas) {
        const context = canvas.getContext('2d')
        // 设置canvas尺寸与视频相同
        canvas.width = video.videoWidth
        canvas.height = video.videoHeight
        
        // 绘制当前视频帧到canvas
        context.drawImage(video, 0, 0, canvas.width, canvas.height)
        
        // 转换为图片
        const imageData = canvas.toDataURL('image/png')
        imgRef.value.src = imageData
        isCaptured.value = true
        
        // 创建文件对象
        codes.value = dataURLtoFile(imageData, 'qrcode.png')
      }
    }
    
    // 解码二维码
    const decodeQrCode = async () => {
      try {
        if (!codes.value) {
          ElMessage.warning('请先拍摄二维码图片')
          return
        }
        
        const url = getObjectURL(codes.value)
        const result = await qrDecoder.decodeFromImage(url)
        
        if (result && result.data) {
          codes.value = result.data
          ElMessage.success('二维码解码成功')
          emit('update:visible', false)
          
          // 可以在这里触发父组件的回调，传递解码结果
          // emit('decoded', codes.value)
        } else {
          ElMessage.warning('未检测到二维码，请重新拍摄')
        }
      } catch (error) {
        console.error('解码失败:', error)
        ElMessage.error('二维码解码失败，请重试')
      }
    }
    
    // 关闭对话框
    const closeDialog = () => {
      // 停止摄像头
      if (mediaStream.value) {
        mediaStream.value.getTracks().forEach(track => track.stop())
        mediaStream.value = null
      }
      emit('update:visible', false)
    }
    
    // 将DataURL转换为File对象
    const dataURLtoFile = (dataurl, filename) => {
      const arr = dataurl.split(',')
      const mime = arr[0].match(/:(.*?);/)[1]
      const bstr = atob(arr[1])
      let n = bstr.length
      const u8arr = new Uint8Array(n)
      
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n)
      }
      
      return new File([u8arr], filename, { type: mime })
    }
    
    // 获取对象URL
    const getObjectURL = (file) => {
      if (window.createObjectURL !== undefined) {
        return window.createObjectURL(file)
      } else if (window.URL !== undefined) {
        return window.URL.createObjectURL(file)
      } else if (window.webkitURL !== undefined) {
        return window.webkitURL.createObjectURL(file)
      }
      return null
    }
    
    // 监听visible变化
    watch(() => props.visible, (newVal) => {
      if (newVal) {
        nextTick(() => {
          initCamera()
        })
      } else {
        // 停止摄像头
        if (mediaStream.value) {
          mediaStream.value.getTracks().forEach(track => track.stop())
          mediaStream.value = null
        }
      }
    })
    
    onMounted(() => {
      // 初始化refs
      nextTick(() => {
        videoRef.value = document.getElementById('video')
        canvasRef.value = document.getElementById('canvas')
        imgRef.value = document.querySelector('img[ref="imgs"]')
      })
    })
    
    return {
      videoRef,
      canvasRef,
      imgRef,
      isCaptured,
      codes,
      captureImage,
      decodeQrCode,
      closeDialog
    }
  }
}
</script>

<style scoped>
.scan-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 10px;
}

.camera-view {
  position: relative;
  width: 300px;
  height: 300px;
  margin-bottom: 15px;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.scan-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.scan-line {
  position: absolute;
  height: 2px;
  width: 100%;
  background: linear-gradient(90deg, transparent, #409EFF, transparent);
  top: 50%;
  animation: scan 2s infinite linear;
}

@keyframes scan {
  0% { top: 10%; }
  100% { top: 90%; }
}

.corner {
  position: absolute;
  width: 20px;
  height: 20px;
  border-color: #409EFF;
  border-style: solid;
}

.top-left {
  top: 0;
  left: 0;
  border-width: 2px 0 0 2px;
}

.top-right {
  top: 0;
  right: 0;
  border-width: 2px 2px 0 0;
}

.bottom-left {
  bottom: 0;
  left: 0;
  border-width: 0 0 2px 2px;
}

.bottom-right {
  bottom: 0;
  right: 0;
  border-width: 0 2px 2px 0;
}

.scan-tips {
  margin: 0 0 15px 0;
  color: #606266;
  font-size: 13px;
  text-align: center;
}

.result-container {
  width: 100%;
  padding: 12px;
  background: #f5f7fa;
  border-radius: 4px;
  margin-bottom: 10px;
}

.result-title {
  font-size: 13px;
  color: #606266;
  margin: 0 0 5px 0;
}

.result-content {
  font-size: 14px;
  word-break: break-all;
  margin: 0;
  font-weight: 500;
}

.dialog-footer {
  display: flex;
  justify-content: center;
  gap: 10px;
}
</style>