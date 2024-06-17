<template>
  <div class="update-password">
    <div class="breadcrumb-container">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>修改账户</el-breadcrumb-item>
      </el-breadcrumb>
    </div>

    <div class="form-container">
      <div class="form-item">
        <label for="old-password" class="form-label"><span class="required">*</span>请输入原密码:</label>
        <el-input id="old-password" placeholder="请输入密码" v-model="oldPassword" show-password class="input-field"></el-input>
      </div>
      <div class="form-item">
        <label for="new-password" class="form-label"><span class="required">*</span>请输入修改密码:</label>
        <el-input id="new-password" placeholder="请输入新密码" v-model="newPassword" show-password class="input-field"></el-input>
      </div>
      <div class="form-item">
        <label for="confirm-password" class="form-label"><span class="required">*</span>请再次输入修改密码:</label>
        <el-input id="confirm-password" placeholder="请确认新密码" v-model="confirmPassword" show-password class="input-field"></el-input>
      </div>
      <div class="button-container">
        <el-button type="primary" @click="updatePassword" class="button">确定</el-button>
        <el-button type="info" @click="clearInputs" plain class="button">取消</el-button>
      </div>
    </div>
  </div>
</template>
<script>
import axios from 'axios';

export default {
  name: 'UpdatePassword',
  data() {
    return {
      oldPassword: '',
      newPassword: '',
      confirmPassword: ''
    };
  },
  methods: {
    updatePassword() {
      if (!this.oldPassword) {
        this.$message({
          message: '请输入原密码！',
          type: 'warning'
        });
        return;
      }

      if (!this.newPassword || !this.confirmPassword) {
        this.$message({
          message: '请输入新密码和确认密码！',
          type: 'warning'
        });
        return;
      }

      if (this.newPassword !== this.confirmPassword) {
        this.$message({
          message: '两次输入的密码不一致，请重新输入！',
          type: 'warning'
        });
        this.newPassword = '';
        this.confirmPassword = '';
        return;
      }

      const userID = parseInt(localStorage.getItem('userID'));
      const data = {
        userID: userID,
        newmm: this.oldPassword,
        oldmm: this.newPassword
      };

      axios.post('/target/updateByCompent', data)
        .then(response => {
          console.log("response",response)
          if (response.data>0) {
            this.$message({
              type: 'success',
              message: '修改成功，请重新登录!'
            });
            
          } else {
            this.$message({
              type: 'error',
              message: response.data.message || '修改失败，请检查原密码是否正确!'
            });
          }
        })
        .catch(error => {
          this.$message({
            type: 'error',
            message: '修改失败，请重试！'
          });
          console.error(error);
        });
    },
    clearInputs() {
      this.$confirm('此操作将清空内容, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.oldPassword = '';
        this.newPassword = '';
        this.confirmPassword = '';
        this.$message({
          type: 'success',
          message: '清空成功!'
        });
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消清空'
        });
      });
    }
  }
};
</script>
<style scoped>
.update-password {
  width: 70%;
  margin: 20px auto;
  padding: 20px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.15);
}

.breadcrumb-container {
  margin-bottom: 20px;
}

.form-container {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 20px;
}

.form-item {
  margin-bottom: 30px;
}

.form-label {
  display: inline-block;
  width: 150px;
  margin-right: 10px;
}

.input-field {
  width: 400px;
}

.required {
  color: red;
}

.button-container {
  display: flex;
  justify-content: space-between;
  width: 400px;
}

.button {
  width: 150px;
}
</style>
