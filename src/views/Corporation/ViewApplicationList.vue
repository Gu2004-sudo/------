<!-- 查看申请列表 -->
<template>
  <div>
    <!-- 搜索和过滤功能 -->
    <div class="job-management" style="margin-left: 100px;">
      <div style="margin-bottom: 30px;">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item>查看申请列表</el-breadcrumb-item>
        </el-breadcrumb>
      </div>

      <el-form :inline="true" class="search-form">
        <el-form-item label="申请人姓名">
          <el-input v-model="searchForm.applicantName" placeholder="请输入姓名" style="width: 140px;"></el-input>
        </el-form-item>
        <el-form-item label="时间区间:" prop="timeRange">
          <el-date-picker v-model="searchForm.DTime" type="daterange" range-separator="至" start-placeholder="开始日期"
            end-placeholder="结束日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="职位名称">
          <el-input v-model="searchForm.positionName" placeholder="请输入职位名称" style="width: 140px;"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="searchApplications">搜索</el-button>
          <el-button @click="resetSearchForm">重置</el-button>
        </el-form-item>
      </el-form>
    </div>

    <!-- 学生信息弹窗 -->
    <el-dialog :visible.sync="StudentContent" title="查看学生信息">
      <el-form :model="currentStudent" label-width="100px">
        <el-form-item label="学号">
          <el-input v-model="currentStudent.studentNo" readonly></el-input>
        </el-form-item>
        <el-form-item label="姓名">
          <el-input v-model="currentStudent.studentName" readonly></el-input>
        </el-form-item>
        <el-form-item label="年龄">
          <el-input v-model.number="currentStudent.studentAge" type="number" readonly></el-input>
        </el-form-item>
        <el-form-item label="性别">
          <el-input v-model="currentStudent.studentSex" readonly></el-input>
        </el-form-item>
        <el-form-item label="联系电话">
          <el-input v-model="currentStudent.phone" readonly></el-input>
        </el-form-item>
        <el-form-item label="家庭住址">
          <el-input v-model="currentStudent.address" readonly></el-input>
        </el-form-item>
        <el-form-item label="入学日期">
          <el-date-picker v-model="currentStudent.enrolTime" type="date" placeholder="选择入学日期" readonly></el-date-picker>
        </el-form-item>
        <el-form-item label="毕业日期">
          <el-date-picker v-model="currentStudent.graduateTime" type="date" placeholder="选择毕业日期"
            readonly></el-date-picker>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="StudentContent = false">取消</el-button>
        <!-- <el-button type="primary" @click="saveStudent">保存</el-button> -->
      </div>
    </el-dialog>

    <!-- 显示申请列表 -->
    <div style="margin-left: 100px;">
      <div style="display: flex;">
        <!-- 职位列表 -->
        <h2>岗位申请职位列表</h2>
        <el-button type="success" style="width: 100px; height: 42px; margin-top: 10px; margin-left: 750px;"
          @click="exportToExcel">导出</el-button>
      </div>
      <el-table :data="applications" style="width: 1000px;height: 500px;">
        <el-table-column type="index" label="序号"></el-table-column>
        <el-table-column prop="studentName" label="姓名"></el-table-column>
        <el-table-column prop="postName" label="岗位"></el-table-column>
        <el-table-column label="申请时间">
          <template slot-scope="scope">
            {{ formatDate(scope.row.bengTime) }}
          </template>
        </el-table-column>
        <el-table-column label="简历">
          <template slot-scope="scope">
            <span v-if="scope.row.CurriculumVitae == ''">无</span>
            <span v-else-if="scope.row.CurriculumVitae != ''"><a @click="downloadFile(scope.row)">{{ scope.row.CurriculumVitae
            }}</a></span>

          </template>

        </el-table-column>
        <el-table-column prop="status" label="状态"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button type="text" @click="viewApplication(scope.row)">查看详情</el-button>

            <el-button v-if="scope.row.status!='面试已通过'&&scope.row.status!='待预约面试'" type="text" @click="handleApplication(scope.row, 1)">通过</el-button>
            <el-button v-if="scope.row.status=='待预约面试'||scope.row.status=='面试已通过'" type="text"  disabled title="当前申请已经通过">通过</el-button>
            <el-button v-if="scope.row.status!='面试已通过'&&scope.row.status!='待预约面试'" type="text" @click="delteApplication(scope.row)">拒绝</el-button>
            <el-button v-if="scope.row.status=='待预约面试'||scope.row.status=='面试已通过'" type="text"  disabled title="当前申请已经通过">拒绝</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页功能 -->
      <div style="">
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
          :current-page="pagination.currentPage" :page-sizes="[10, 20, 30, 40]" :page-size="pagination.pageSize"
          layout="total, sizes, prev, pager, next, jumper" :total="totalApplications">
        </el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'; // 导入 Axios 库
import * as XLSX from 'xlsx'; // 导入 xlsx 库
import { MessageBox } from 'element-ui';
export default {
  data() {
    return {
      searchForm: {
        applicantName: '',
        applicationDate: '',
        positionName: '',
        DTime: []
      },
      currentStudent: {},//弹窗的学生信息
      StudentContent: false,//弹窗的学生信息的控制
      applications: [], // 所有申请列表数据
      pagination: {
        currentPage: 1,
        pageSize: 10
      }
    };
  },
  computed: {
    paginatedApplications() {
      let startIndex = (this.pagination.currentPage - 1) * this.pagination.pageSize;
      let endIndex = this.pagination.currentPage * this.pagination.pageSize;
      return this.applications.slice(startIndex, endIndex);
    },
    totalApplications() {
      return this.applications.length;
    }
  },
  mounted() {
    // 初始化数据，从后端获取职位列表
    this.searchApplications();

  },
  methods: {

    async downloadFile(row) {

      try {
        // 请求文件数据
        const response = await fetch("/main/download?name=");
        const data = await response.blob();
        // 创建临时 URL
        const tempUrl = URL.createObjectURL(data);
        console.log(tempUrl)
        // 创建隐藏的 <a> 标签并触发点击事件
        const link = document.createElement('a');
        link.href = tempUrl;
        link.style.display = 'none';
        link.download = row.CurriculumVitae;
        document.body.appendChild(link);
        link.click();

        // 释放临时 URL
        document.body.removeChild(link);
        URL.revokeObjectURL(tempUrl);
      } catch (error) {
        console.error('下载文件失败：', error);
      }
    },
    // 列表显示数据
    searchApplications() {
      this.applications=[]
      const time1 = this.searchForm.DTime.map(date => formatDate(new Date(date)))[0];
      const time2 = this.searchForm.DTime.map(date => formatDate(new Date(date)))[1];
      const data = {
        companyID: parseInt(localStorage.getItem("userName")),
        studentName: this.searchForm.applicantName,
        time1: time1,
        time2: time2,
        postName: this.searchForm.positionName
      };
      axios.post("/target/selectByapplication2", data).then(response => {
        console.log(response.data);
        this.applications = response.data;
      });
    },
    resetSearchForm() {
      // 重置搜索条件
      this.searchForm = {
        applicantName: '',
        applicationDate: '',
        positionName: '',
        DTime: []
      };
      this.searchApplications();
    },
    handleApplication(application, action) {
      // 处理申请，包括审核通过、拒绝等操作
      // 实现处理申请的逻辑
      MessageBox.confirm('确定执行此操作吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 确定后的处理逻辑

        var sta = '';
        if (action === 1) {
          sta = '待预约面试';
        } else {
          sta = '未通过';
        }
        console.log("账号”",application.studentID,)
        const data = { studentID: application.studentID, status2: sta,applicationID:application.applicationID }
        axios.post("/target/yesORNo", data).then(response => {
          console.log("response", response);
          this.searchApplications();
          this.$message({ message: '执行成功', type: 'success' });
          this.searchApplications()
        });
      }).catch(() => {
        // 取消后的处理逻辑
        this.$message({
          type: 'info',
          message: '操作已取消'
        });
      });

    },
    delteApplication(row){
      if(confirm("您确定要拒绝这个申请吗？")){
        console.log(row)
        var qs=require('qs')
        axios.post("/main/deleteApplication",qs.stringify({
          applicationID:row.applicationID
        })).then(res=>{
          if(res.data.data==1){
            this.$message({
              type:"success",
              message:"已成功拒绝"
            })
            this.searchApplications()
          }
        })
      }
      
    },
    handleSizeChange(size) {
      // 每页条数变化
      this.pagination.pageSize = size;
    },
    handleCurrentChange(page) {
      // 当前页码变化
      this.pagination.currentPage = page;
    },
    viewApplication(application) {
      // 查看申请详情
      // 实现查看申请详情的逻辑
      console.log("application", application)
      console.log("application2", application.studentID)
      const data = {}
      axios.post('/target/idSelectByStudent', { studentID: application.studentID }).then(response => {
        this.currentStudent = response.data
        this.StudentContent = true;
        console.log("data", response)
      })
    },
    exportToExcel() {
      const ws = XLSX.utils.json_to_sheet(this.applications);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "申请列表");
      XLSX.writeFile(wb, "申请列表.xlsx");
    },
    formatDate(date) {
      if (!date) return '';
      const d = new Date(date);
      const year = d.getFullYear();
      const month = (d.getMonth() + 1).toString().padStart(2, '0'); // 月份从0开始，需要加1
      const day = d.getDate().toString().padStart(2, '0');
      return `${year}-${month}-${day}`;
    }
  }
};

function formatDate(date) {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0'); // 月份从0开始，需要加1
  const day = date.getDate().toString().padStart(2, '0');
  return `${year}-${month}-${day}`;
}
</script>

<style scoped>
.job-management {
  max-width: 1150px;
  margin: 0 auto;
  padding: 20px;
}

.search-form {
  margin-bottom: 20px;
}
</style>
