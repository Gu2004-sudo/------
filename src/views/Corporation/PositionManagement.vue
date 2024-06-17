<template>
  <div class="job-management">
    <div>
      <div style="margin-bottom: 30px;">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item style="font-weight: bold;color: black;">首页</el-breadcrumb-item>
          <el-breadcrumb-item>职位管理</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <!-- 搜索和过滤功能 -->
      <el-form :inline="true" class="search-form" style="padding-top: 20px;padding-left: 20px;">
        <el-form-item label="职位名称:">
          <el-input v-model="ZhiWeiname" placeholder="请选择职位名称" style="width: 150px;"></el-input>
        </el-form-item>
        <el-form-item label="时间区间:">
          <el-date-picker v-model="value1" type="daterange" range-separator="至" start-placeholder="开始日期"
            end-placeholder="结束日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="status" placeholder="请选择状态" style="width: 150px;">
            <el-option label="全部" value="全部"></el-option>
            <el-option label="审核通过" value="通过"></el-option>
            <el-option label="审核未通过" value="未通过"></el-option>
            <el-option label="待审核" value="待审核"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="postSearch">搜索</el-button>
          <el-button @click="resetSearch">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div style="display: flex;">
      <!-- 职位列表 -->
      <h2>职位列表</h2>
      <el-button type="success" style="width: 100px; height: 42px; margin-top: 10px; margin-left: auto;"
        @click="exportToExcel">导出</el-button>
      <!-- 新增职位按钮 -->
      <el-button type="primary" style="height: 42px; margin-top: 10px; margin-left: 20px;"
        @click="postInsert">新增职位</el-button>
    </div>
    <div>
      <el-table :data="filteredJobs.slice((currentPage - 1) * PageSize, currentPage * PageSize)" height="400px">
        <el-table-column type="index" label="序号" min-width="70"></el-table-column>
        <el-table-column prop="entryTime" label="招聘日期" min-width="100"></el-table-column>
        <el-table-column prop="endTime" label="截止日期" min-width="100"></el-table-column>
        <el-table-column prop="postName" label="岗位名称" min-width="100"></el-table-column>
        <el-table-column prop="postResponsibility" label="岗位职责(要求)" min-width="150"></el-table-column>
        <el-table-column prop="postNature" label="(性质)"></el-table-column>
        <el-table-column prop="address" label="地点"></el-table-column>
        <el-table-column prop="postContactInformation" label="联系方式" min-width="110"></el-table-column>
        <el-table-column prop="numberPeople" label="招聘人数" min-width="80"></el-table-column>
        <el-table-column prop="postSalary" label="岗位薪资"></el-table-column>
        <el-table-column prop="statu" label="状态"></el-table-column>
        <el-table-column label="操作" width="150">
          <template slot-scope="scope">
            <el-button size="mini" @click="editJob(scope.row)">编辑</el-button>
            <el-button size="mini" type="danger" @click="deleteJob(scope.row)">撤回</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <div style="">
      <!-- 分页 -->
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage"
        :page-sizes="pageSizes" :page-size="PageSize" layout="total, sizes, prev, pager, next, jumper"
        :total="totalCount">
      </el-pagination>
    </div>

    <!-- 新增/编辑职位表单 -->
    <el-dialog :visible.sync="dialogVisible" :title="dialogTitle" width="850px">
      <el-form :model="currentJob" :rules="rules" ref="currentJobForm" label-width="100px" class="job-form">
        <h1 class="dialog-title">新增职位</h1>
        <el-form-item label="岗位名称" prop="postName" required>
          <el-input v-model="currentJob.postName" placeholder="请输入岗位名称"></el-input>
        </el-form-item>
        <el-form-item label="时间区间:" prop="timeRange" required>
          <el-date-picker v-model="currentJob.timeRange" type="daterange" range-separator="至" start-placeholder="开始日期"
            end-placeholder="结束日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="招聘公司名" prop="postCompany" required>
          <el-input v-model="currentJob.postCompany" placeholder="请输入招聘公司名"></el-input>
        </el-form-item>
        <el-form-item label="岗位职责(要求)" prop="postResponsibility" required>
          <el-input v-model="currentJob.postResponsibility" type="textarea" placeholder="请输入岗位职责(要求)"
            class="custom-input"></el-input>
        </el-form-item>
        <el-form-item label="岗位性质" prop="postNature" required>
          <el-input v-model="currentJob.postNature" placeholder="请输入岗位性质"></el-input>
        </el-form-item>
        <el-form-item label="地点" prop="address" required>
          <el-input v-model="currentJob.address" placeholder="请输入地点"></el-input>
        </el-form-item>
        <el-form-item label="联系方式" prop="postContactInformation" required>
          <el-input v-model="currentJob.postContactInformation" placeholder="请输入联系方式"></el-input>
        </el-form-item>
        <el-form-item label="招聘人数" prop="numberPeople" required>
          <el-input v-model.number="currentJob.numberPeople" placeholder="请输入招聘人数" type="number"></el-input>
        </el-form-item>
        <el-form-item label="岗位薪资" prop="postSalary" required>
          <el-input v-model.number="currentJob.postSalary" placeholder="请输入岗位薪资" type="number"></el-input>
        </el-form-item>
        <el-form-item label="状态" prop="statu" required>
          <el-select v-model="currentJob.statu" placeholder="请选择状态">
            <el-option label="待审核" value="待审核"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="postSubmitPost">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import axios from 'axios'; // 导入 Axios 库
import * as XLSX from 'xlsx'; // 导入 xlsx 库

export default {
  data() {
    return {
      jobs: [], // 职位列表数据
      filteredJobs: [], // 过滤后的职位列表数据
      dialogVisible: false, // 新增/编辑职位对话框可见性
      dialogTitle: '', // 新增/编辑职位对话框标题
      currentJob: {
        timeRange: [], // 弹窗时间区间
        statu: '待审核'
      }, // 当前正在编辑的职位信息
      ZhiWeiname: "", // 职位名称
      value1: [], // 输入框选中时间
      status: "", // 审核状态
      rules: {
        postName: [
          { required: true, message: '请输入岗位名称', trigger: 'blur' }
        ],
        timeRange: [
          { type: 'array', required: true, message: '请选择时间区间', trigger: 'change' }
        ],
        postCompany: [
          { required: true, message: '请输入招聘公司名', trigger: 'blur' }
        ],
        postResponsibility: [
          { required: true, message: '请输入岗位职责(要求)', trigger: 'blur' }
        ],
        postNature: [
          { required: true, message: '请输入岗位性质', trigger: 'blur' }
        ],
        address: [
          { required: true, message: '请输入地点', trigger: 'blur' }
        ],
        postContactInformation: [
          { required: true, message: '请输入联系方式', trigger: 'blur' }
        ],
        numberPeople: [
          { required: true, type: 'number', message: '请输入招聘人数', trigger: 'blur' }
        ],
        postSalary: [
          { required: true, type: 'number', message: '请输入岗位薪资', trigger: 'blur' }
        ],
        statu: [
          { required: true, message: '请选择状态', trigger: 'change' }
        ]
      },
      // 默认显示第几页
      currentPage: 1,
      // 总条数，根据接口获取数据长度(注意：这里不能为空)
      totalCount: 1, // 默认为1，具体要获取后端数据
      // 个数选择器（可修改）
      pageSizes: [1, 2, 3, 4, 5],
      // 默认每页显示的条数（可修改）
      PageSize: 5,
    };
  },
  mounted() {
    // 初始化数据，从后端获取职位列表
    this.fetchJobs();
  },
  methods: {
    // 搜索按钮
    postSearch() {
      this.fetchJobs();
    },
    fetchJobs() {
      const time1 = this.value1.map(date => formatDate(new Date(date)))[0];
      const time2 = this.value1.map(date => formatDate(new Date(date)))[1];
      const data = { companyID: parseInt(localStorage.getItem("userName")), name: this.ZhiWeiname, time1: time1, time2: time2, status: this.status };
      console.log("data2", data);
      axios.post('/target/selectPostBycoID', data).then(response => {
        console.log(response);
        this.filteredJobs = response.data;
        this.totalCount = response.data.length;
      });
    },
    // 分页
    handleSizeChange(val) {
      this.PageSize = val;
      this.currentPage = 1; // 注意：在改变每页显示的条数时，要将页码显示到第一页
    },
    handleCurrentChange(val) {
      this.currentPage = val; // 改变默认的页数
    },
    // 新增职位触发弹窗
    postInsert() {
      this.dialogVisible = true;
    },

    //撤回功能
    deleteJob(row) {
      const data = { postID: row.postID }
      axios.post('/target/deletePostsBypostID', data).then(data2 => {
        console.log("添加", data2.data)
        if (data2.data === 1) {
          this.fetchJobs();
          this.$message({ message: '撤回成功', type: 'success' });

        } else {
          this.$message({ message: '撤回失败', type: 'error' });
        }
      })

    },

    // 新增提交
    postSubmitPost() {
      this.$refs.currentJobForm.validate((valid) => {
        if (valid) {
          this.$confirm('确定要添加这个职位吗?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            const time1 = this.currentJob.timeRange.map(date => formatDate(new Date(date)))[0];
            const time2 = this.currentJob.timeRange.map(date => formatDate(new Date(date)))[1];

            console.log(time1, time2, this.currentJob.statu, this.currentJob)
            const data = { entryTime: time1, endTime: time2, postCompany: this.currentJob.postCompany, postName: this.currentJob.postName, postResponsibility: this.currentJob.postResponsibility, postNature: this.currentJob.postNature, address: this.currentJob.address, postContactInformation: this.currentJob.postContactInformation, numberPeople: this.currentJob.numberPeople, postSalary: this.currentJob.postSalary, statu: this.currentJob.statu, companyID: parseInt(localStorage.getItem("userName")) }
            axios.post('/target/inertPost', data).then(response => {
              console.log("添加", response.data)
              if (response.data === 1) {
                this.$message({ message: '添加成功', type: 'success' });
                this.postSearch()
                this.dialogVisible=false
              } else {
                this.$message({ message: '添加失败', type: 'error' });
              }
            })

          }).catch(() => {
            this.$message({
              type: 'info',
              message: '你点击了取消'
            });
          });
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    resetSearch() {
      this.ZhiWeiname = '';
      this.value1 = [];
      this.status = '';
      this.fetchJobs();
    },
    // 导出功能
    exportToExcel() {
      const ws = XLSX.utils.json_to_sheet(this.filteredJobs);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Jobs");
      XLSX.writeFile(wb, "岗位表.xlsx");
    }
  },

};

function formatDate(date) {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0'); // 月份从0开始，需要加1
  const day = date.getDate().toString().padStart(2, '0');
  return `${year}-${month}-${day}`;
}
</script>

<style >
.custom-input::placeholder {
  width: 300px;
  /* 设置 placeholder 的宽度 */
}

.job-management {
  max-width: 1150px;
  margin: 0 auto;
  padding: 20px;
}

.search-form {
  margin-bottom: 20px;
}

.el-form-item__content {
  display: flex;
}

.el-dialog__header {
  background-color: #f5f7fa;
  border-bottom: 1px solid #ebeef5;
}

.el-dialog__title {
  font-size: 18px;
  font-weight: bold;
}

.el-dialog {
  border-radius: 8px;
}

.el-button--primary {
  background-color: #409eff;
  border-color: #409eff;
  color: #fff;
}

.el-button--primary:hover {
  background-color: #66b1ff;
  border-color: #66b1ff;
}

.el-button {
  border-radius: 4px;
}

.dialog-footer {
  text-align: right;
  padding: 10px 20px;
  background-color: #f5f7fa;
  border-top: 1px solid #ebeef5;
}

.dialog-footer .el-button {
  margin-left: 10px;
}

[class~="el-form-item"][class~="is-required"] .el-form-item__label {
  width: 120px !important;
}</style>
