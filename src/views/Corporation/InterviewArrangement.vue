<template>
  <div class="interview-schedule">
    <!-- 面包屑导航 -->
    <el-breadcrumb separator="/" class="breadcrumb">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>面试安排</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 搜索栏 -->
    <div style=" margin-right: 100px;">
      <el-form :inline="true" class="search-form">
        <el-form-item label="姓名">
          <el-input v-model="searchName" placeholder="搜索姓名"></el-input>
        </el-form-item>
        <el-form-item label="申请职位">
          <el-input v-model="searchPosition" placeholder="搜索申请职位"></el-input>
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="searchStatus" placeholder="选择状态">
            <el-option label="待预约面试" value="待预约面试"></el-option>
            <el-option label="已面试" value="已面试"></el-option>
            <el-option label="待面试" value="待面试"></el-option>
            <el-option label="面试已通过" value="面试已通过"></el-option>
            <el-option label="面试未通过" value="面试未通过"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="filterList">搜索</el-button>
        </el-form-item>
      </el-form>
    </div>

    <!-- 通过人员列表 -->
    <el-table :data="paginatedCandidates" class="candidates-table" style="width: 1100px;" height="400px" stripe>
      <el-table-column type="index" label="序号"></el-table-column>
      <el-table-column prop="studentName" label="姓名" width="100" sortable></el-table-column>
      <el-table-column prop="postName" label="申请职位" width="180" sortable></el-table-column>
      <el-table-column label="申请时间" width="100">
        <template slot-scope="scope">
          {{ formatDate(scope.row.bengTime) }}
        </template>
      </el-table-column>
      <el-table-column prop="CurriculumVitae" label="简历" width="150"></el-table-column>
      <el-table-column prop="phone" label="电话" width="180"></el-table-column>
      <el-table-column prop="status" label="状态" width="100"></el-table-column>
      <el-table-column label="操作" width="300">
        <template slot-scope="scope">
          <el-button type="primary" size="mini"
            :disabled="scope.row.status === '未通过' || scope.row.status === '已面试' || scope.row.status === '待面试' || scope.row.status === '面试已通过' || scope.row.status === '面试未通过'"
            @click="scheduleInterview(scope.row)">预约面试</el-button>
          <el-button type="success" size="mini"
            :disabled="scope.row.status === '待预约面试' || scope.row.status === '未通过' || scope.row.status === '面试已通过' || scope.row.status === '面试未通过'"
            @click="showInterviewResultDialog(scope.row)">面试结果</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <div>
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage"
        :page-sizes="[1, 2, 3, 4]" :page-size="PageSize" layout="total, sizes, prev, pager, next, jumper"
        :total="totalCount">
      </el-pagination>
    </div>

    <!-- 面试安排对话框 -->
    <el-dialog title="安排面试" :visible.sync="dialogVisible">
      <el-form :model="scheduleForm" label-width="120px">
        <!-- 面试日期 -->
        <el-form-item label="最晚面试日期" prop="interviewDate">
          <el-date-picker v-model="scheduleForm.interviewDate" type="date" placeholder="选择面试日期">
          </el-date-picker>
        </el-form-item>
        <!-- 面试时间 -->
        <el-form-item label="请选择几点" prop="interviewTime">
          <el-time-picker v-model="scheduleForm.interviewTime" placeholder="选择面试时间">
          </el-time-picker>
        </el-form-item>
        <!-- 面试地点 -->
        <el-form-item label="面试地点" prop="location">
          <el-input v-model="scheduleForm.location" placeholder="请输入面试地点"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="confirmSchedule">确认</el-button>
      </div>
    </el-dialog>

    <!-- 面试结果对话框 -->
    <el-dialog title="面试结果" :visible.sync="resultDialogVisible">
      <el-form :model="interviewResultForm" label-width="120px">
        <!-- 面试结果 -->
        <el-form-item label="面试结果" prop="result">
          <el-select v-model="interviewResultForm.result" placeholder="请选择面试结果">
            <el-option label="面试已通过" value="面试已通过"></el-option>
            <el-option label="面试未通过" value="面试未通过"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="resultDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="confirmInterviewResult">确认</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import axios from 'axios'; // 导入 Axios 库
import * as XLSX from 'xlsx'; // 导入 xlsx 库
import { MessageBox } from 'element-ui';
export default {
  data() {
    return {
      searchName: "", // 输入框姓名
      searchPosition: "", // 申请职位
      searchStatus: "", // 状态
      studentID:'',

      search: '',
      dialogVisible: false,
      resultDialogVisible: false,
      scheduleForm: {
        interviewDate: '',
        interviewTime: '',
        location: ''
      },
      applicationID2: "",
      interviewResultForm: {
        result: ''
      },
      selectedCandidate: null,
      candidates: [],
      filteredCandidates: [],
      currentPage: 1,
      PageSize: 5,
      totalCount: 0, // 总条数
      postID: '',
      post: '',
      postStudent:{
        entryTime:"",
        endTime:'',
        postName:'',
        postResponsibility:'',
        statu:'',
        postNature:'',
        postSalary:'',
        studentID:'',
        companyID:'',
        can:'',
      }
    };
  },
  created() {
    this.ListShowMS()
  },
  methods: {
    // 面试结果
    showInterviewResultDialog(candidate) {

      this.resultDialogVisible = true;
      this.postID = candidate.postID
      this.can=candidate
     
      console.log(this.can)
      this.applicationID2 = parseInt(candidate.applicationID)
    },
    confirmInterviewResult() {
      // 验证面试结果是否为空
      if (!this.interviewResultForm.result) {
        this.$message({
          message: '请选择面试结果',
          type: 'error'
        });
        return;
      }
      // 提交面试结果
      console.log("parseInt(this.applicationID2)", parseInt(this.applicationID2))
      const data = {
        id: parseInt(this.applicationID2),
        jieguo: this.interviewResultForm.result
      };
      axios.post('/target/updateByApp2', data).then(response => {
        console.log("response", response.data);
        this.$message({
          message: '面试结果已提交',
          type: 'success'
        });
        this.ListShowMS();
        this.resultDialogVisible = false;
        console.log(this.postID)
        if (this.interviewResultForm.result == '面试已通过') {
          console.log(this.can)
          axios.get("/main/selectPostByPostID", {
            params: {
              postID: this.postID
            }
          }).then(res => {
            this.post = res.data.data;
            this.postStudent=res.data.data
            this.postStudent.studentID=this.can.studentID
            console.log(this.postStudent)
            axios.post("/main/insertPracticePost",JSON.stringify(this.postStudent),{
              headers: {
                'Content-Type': 'application/json',
              }
            }).then(res=>{
              console.log(res.data.data)
            })
            this.$set(this.post, ' this.post.numberPeople',  this.post.numberPeople-=1)
            console.log(this.post)
            axios.put("/main/updatePost", JSON.stringify(this.post), {
              headers: {
                'Content-Type': 'application/json',
              }
            }).then(res => {
              console.log(res.data.data)
            })
          })
          
        }
       
      }).catch(error => {
        this.$message({
          message: '提交面试结果失败',
          type: 'error'
        });
        console.error(error);
      });
    },
    // 列表显示
    ListShowMS() {
      const data = { companyID: parseInt(localStorage.getItem("userName")), name: this.searchName, zhiwei: this.searchPosition, zt: this.searchStatus }
      axios.post('/target/selectByinterview', data).then(response => {
        console.log("response", response.data);
        this.filteredCandidates = response.data;
        this.totalCount = response.data.length;
      }).catch(error => {
        console.error(error);
      });
    },

    // 搜索按钮
    filterList() {
      this.ListShowMS();
    },
    handleSizeChange(val) {
      this.PageSize = val;
      this.currentPage = 1; // 注意：在改变每页显示的条数时，要将页码显示到第一页
    },
    handleCurrentChange(val) {
      this.currentPage = val; // 改变默认的页数
    },
    scheduleInterview(candidate) {
      this.selectedCandidate = candidate;
      this.dialogVisible = true;
    },
    confirmSchedule() {
      // 验证输入项是否为空
      if (!this.scheduleForm.interviewDate || !this.scheduleForm.interviewTime || !this.scheduleForm.location) {
        this.$message({
          message: '请填写所有必填项',
          type: 'error'
        });
        return;
      }
      // 提交面试安排数据
      const data = {
        id: this.selectedCandidate.applicationID,
        // interviewDate: this.scheduleForm.interviewDate,
        // interviewTime: this.scheduleForm.interviewTime,
        // location: this.scheduleForm.location
      };
      axios.post('/target/updateByApp', data).then(response => {
        console.log("response", response.data);
        this.$message({
          message: '面试已安排',
          type: 'success'
        });
        this.ListShowMS();
        this.dialogVisible = false;
      }).catch(error => {
        this.$message({
          message: '安排面试失败',
          type: 'error'
        });
        console.error(error);
      });
    },
    formatDate(date) {
      if (!date) return '';
      const d = new Date(date);
      const year = d.getFullYear();
      const month = (d.getMonth() + 1).toString().padStart(2, '0'); // 月份从0开始，需要加1
      const day = d.getDate().toString().padStart(2, '0');
      return `${year}-${month}-${day}`;
    }
  },
  computed: {
    paginatedCandidates() {
      const start = (this.currentPage - 1) * this.PageSize;
      const end = this.currentPage * this.PageSize;
      return this.filteredCandidates.slice(start, end);
    },
  }
};
</script>

<style scoped>
.interview-schedule {
  margin-left: 100px;
  padding: 20px;
  background-color: #f9f9f9;
  min-height: 100vh;
}

.breadcrumb {
  margin-bottom: 20px;
}

.search-container {
  justify-content: center;
  margin-bottom: 20px;
}

.search-bar {
  width: 300px;
}

.candidates-table {
  background-color: #fff;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  border-radius: 4px;
}

.el-table th,
.el-table td {
  text-align: center;
}

.pagination-container {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}

.dialog-footer {
  text-align: right;
}
</style>
