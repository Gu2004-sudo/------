<template>
  <div class="edit-company">
    <div class="company-card">
      <div slot="header" style="margin-bottom: 20px;">
        <el-breadcrumb separator="/">
          <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item>公司信息</el-breadcrumb-item>
        </el-breadcrumb>
      </div>

      <el-card>
        <div slot="header" class="header">编辑公司信息</div>
        <div class="form-content">
          <el-form :model="companyForm" :rules="rules" ref="companyForm" label-width="120px">
            <!-- 公司名称 -->
            <el-form-item label="公司名称" prop="companyName">
              <el-input v-model="companyForm.companyName" placeholder="请输入公司名称"></el-input>
            </el-form-item>
            <!-- 公司地址 -->
            <el-form-item label="公司地址" prop="address">
              <el-input v-model="companyForm.address" placeholder="请输入公司地址"></el-input>
            </el-form-item>
            <!-- 联系电话 -->
            <el-form-item label="联系电话" prop="phone">
              <el-input v-model="companyForm.phone" placeholder="请输入联系电话"></el-input>
            </el-form-item>
            <!-- 注册日期 -->
            <el-form-item label="注册日期" prop="registrationDate">
              <el-date-picker
                v-model="companyForm.registrationDate"
                type="date"
                placeholder="选择注册日期">
              </el-date-picker>
            </el-form-item>
            <!-- 官网地址 -->
            <el-form-item label="官网地址" prop="webSite">
              <el-input v-model="companyForm.webSite" placeholder="请输入官网地址"></el-input>
            </el-form-item>
            <!-- 邮箱地址 -->
            <el-form-item label="邮箱地址" prop="email">
              <el-input v-model="companyForm.email" placeholder="请输入邮箱地址"></el-input>
            </el-form-item>
            <!-- 提交按钮 -->
            <el-form-item class="submit-btn">
              <el-button @click="resetForm" style="margin-right: 100px;">恢复原样</el-button>
              <el-button type="primary" @click="submitForm">确定修改</el-button>
            </el-form-item>
          </el-form>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      companyForm: {
        companyName: '', // 公司名称
        address: '', // 公司地址
        phone: '', // 联系电话
        registrationDate: new Date(), // 确保是 Date 对象
        webSite: '', // 官网地址
        email: '' // 邮箱地址
      },
      originalForm: {}, // 保存原始表单数据以便重置
      rules: { // 验证规则
        companyName: [{ required: true, message: '请输入公司名称', trigger: 'blur' }],
        address: [{ required: true, message: '请输入公司地址', trigger: 'blur' }],
        phone: [{ required: true, message: '请输入联系电话', trigger: 'blur' }],
        registrationDate: [
          {
            type: 'date',
            required: true,
            message: '请选择注册日期',
            trigger: 'change'
          }
        ],
        webSite: [{ required: true, message: '请输入官网地址', trigger: 'blur' }],
        email: [
          {
           
            required: true,
            message: '请输入正确的邮箱地址',
            trigger: 'blur'
          }
        ]
      }
    };
  },
  mounted() {
    this.fetchCompanyInfo();
    this.resetForm();
  },
  methods: {
    // 从后端获取公司信息并显示在表单中
    fetchCompanyInfo() {
      const userId = parseInt(localStorage.getItem("userName")); // 从 localStorage 中获取用户ID
      const data = { BH: userId };
      
      axios.post('/target/selectByGS', data)
        .then(response => {
          const companyInfo = response.data;
          companyInfo.registrationDate = new Date(companyInfo.registrationDate); // 确保是 Date 对象
          this.companyForm = companyInfo;
          this.originalForm = { ...companyInfo }; // 保存原始数据
        })
        .catch(error => {
          console.error('获取公司信息失败:', error);
          this.$message.error('获取公司信息失败');
        });
    },
    // 提交表单
    submitForm() {
  this.$refs.companyForm.validate(valid => {
    if (valid) {
      const userId = parseInt(localStorage.getItem("userName"));
      const formattedDate = this.companyForm.registrationDate.toISOString().split('T')[0]; // 格式化日期
      const email = this.companyForm.email.trim(); // 去除多余空格

      const data = {
        companyID: userId,
        companyName: this.companyForm.companyName,
        address: this.companyForm.address,
        phone: this.companyForm.phone,
        registrationDate: formattedDate,
        webSite: this.companyForm.webSite,
        email: email
      };
      console.log(data)
      axios.post('/target/updateByApplicationNR', data)
        .then(response => {
          if (response.data > 0) {
            this.$message.success('公司信息更新成功');
          } else {
            this.$message.error('更新失败，请重试');
          }
        })
        .catch(error => {
          console.error('更新公司信息失败:', error);
          this.$message.error('更新公司信息失败');
        });
    } else {
      this.$message.warning('请填写完整的公司信息');
    }
  });
},

    // 恢复原样
    resetForm() {
      this.$refs.companyForm.resetFields();
      this.companyForm = { ...this.originalForm }; // 重置为原始数据
    }
  }
};
</script>

<style scoped>
.edit-company {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}

.company-card {
  width: 70%;
  max-width: 600px;
  margin: auto;
}

.header {
  font-size: 20px;
  font-weight: bold;
}

.form-content {
  padding: 20px;
}

.submit-btn {
  margin-top: 20px;
  text-align: center;
}
</style>
