<template>
  <div>
    <!-- 对话框 -->
    <div v-show="showDialog" class="floating-dialog">
      <div class="close-button" @click="toggleDialog">×</div>
      <div class="message-container" ref="messageContainer">
        <!-- 初始显示一条消息 -->
        <div v-if="messages.length === 0" class="message">
          <p class="system-message">你好！</p>
        </div>
        <!-- 对话消息循环显示 -->
        <div v-for="(message, index) in messages" :key="index" class="message">
          <p v-if="message.sender === 'user'" class="user-message">{{ message.content }}</p>
          <p v-else class="system-message">{{ message.content }}</p>
          
        </div>
        <el-tag type="info" style="margin-top: 10px;" v-if="loading==true">正在努力回答...</el-tag>
      </div>
      <div class="input-box">
        <input type="text" v-model="inputMessage" placeholder="请输入问题...">
        <button id="btn_control" @click="luYin()">{{ record ? '录音中' : '录音' }}</button>
        <button @click="sendMessage">发送</button>
      </div>
    </div>
    <!-- 悬浮窗 -->
    <div v-show="!showDialog" class="floating-button" @click="toggleDialog">
      <span class="material-icons" style="font-size: 10px;">AI小助手</span>
    </div>
  </div>
</template>
<!-- <script>


var APPID = "b00d03bd";
var API_KEY = "ea8dbee02dc21186e1a7b3402277a5c8";
</script> -->
<!-- <script src="../assets/example/hmac-sha256.js"></script>
<script src="../assets/example/HmacSHA1.js"></script>
<script src="../assets/example/md5.js"></script>
<script src="../assets/example/enc-base64-min.js"></script>
<script src="../assets/dist/index.umd.js"></script> -->
<script src="test.js"></script>
<script>



import axios from "axios";

export default {
  data() {
    return {
      messages: [], // 用于存储对话消息
      inputMessage: '', // 用户输入的消息
      showDialog: false, // 控制对话框显示状态
     
     
      loading:false,
      record:false, // 控制录音状态
    };
  },
  mounted() {
    // 在组件加载后显示初始消息
    this.messages.push({ sender: 'system', content: '你好!我是AI小助手。有什么可以帮到您的吗?' });
  },
  methods: {
    luYin(){
      if(this.record==false){
        this.record=true;
        axios.get("/main/start").then(res => {
            console.log(res);
        })
      }
        
      else if(this.record==true){
        this.record=false;
        axios.get("/main/end").then(res => {
        this.inputMessage=res.data
        console.log(res);
      })
      }
      

    },
    async sendMessage() {
      this.loading=true;
      
      var text = this.inputMessage;
      // 清空输入框
      this.inputMessage = '';
      // 将用户输入的消息添加到对话框中
      this.scrollToBottom();
      this.messages.push({ sender: 'user', content: text });
     
      // 发送用户消息给后端处理
      
      await this.sendToBackend(text);
      this.loading=false;
      // 滚动到对话底部
    },
    async sendToBackend(message) {
      try {
        const response = await axios.get("/main/test/sendQuestion", {
          params: {
            question: message,
            id: 2
          }
        });
        console.log(response);
        const answer = response.data;
        // 将回复消息添加到对话框中
        this.messages.push({ sender: 'system', content: answer });
        // 滚动到对话底部
        this.scrollToBottom();
      } catch (error) {
        console.error('Error sending message to backend:', error);
        this.messages.push({ sender: 'system', content: '系统错误，请联系管理员' });
      }
    },
    scrollToBottom() {
      this.$nextTick(() => {
        this.$refs.messageContainer.scrollTop = this.$refs.messageContainer.scrollHeight;
      });
    },
    toggleDialog() {
      this.showDialog = !this.showDialog; // 切换对话框显示状态
    }
  }
};
</script>

<style scoped>
/* 悬浮按钮样式 */
.floating-button {
  position: fixed;
  bottom: 20px;
  right: 20px;
  width: 50px;
  height: 50px;
  background-color: #007bff;
  border-radius: 50%;
  /* 圆形 */
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
}

/* 悬浮按钮图标样式 */
.material-icons {
  color: #fff;
  font-size: 24px;
}

/* 对话框样式 */
.floating-dialog {
  position: fixed;
  bottom: 20px;
  /* 调整对话框的位置 */
  right: 20px;
  /* 调整对话框的位置 */
  width: 500px;
  height: 500px;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 5px;
  background-color: #f9f9f9;
  display: flex;
  flex-direction: column;
}

.close-button {
  position: absolute;
  top: 10px;
  right: 10px;
  cursor: pointer;
}

/* 其他样式保持不变 */
.message-container {
  flex: 1;
  overflow-y: auto;
}

.message {
  margin-bottom: 10px;
}

.user-message {
  background-color: #d3e0ea;
  padding: 8px;
  border-radius: 5px;
}

.system-message {
  background-color: #f0f0f0;
  padding: 8px;
  border-radius: 5px;
}

.input-box {
  margin-top: 10px;
  display: flex;
  justify-content: flex-end;
}

.input-box input {
  flex: 1;
  padding: 4px;
  /* 调整输入框的大小 */
  border: 1px solid #ccc;
  border-radius: 5px;
}

.input-box button {
  padding: 6px 12px;
  /* 调整按钮的大小 */
  margin-left: 10px;
  border: none;
  border-radius: 5px;
  background-color: #007bff;
  color: #fff;
  cursor: pointer;
}

.floating-button {
  z-index: 999;
}

.floating-dialog {
  z-index: 999;
}

.close-button {
  z-index: 999;
}

.message-container p {
  flex: 1;
  padding: 4px;
  /* 调整输入框的大小 */
  border: 1px solid #ccc;
  border-radius: 5px;
  text-align: left;
  /* 设置文本左对齐 */
  padding-left: 10px;
}
</style>
