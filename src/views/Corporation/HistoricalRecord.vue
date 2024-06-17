<!-- 历史记录 -->

<template>
    <div>

      <!-- 搜索和过滤功能 -->
        <div class="job-management" style="margin-left: 100px;">
          <div style="margin-bottom: 30px;">
            <el-breadcrumb separator-class="el-icon-arrow-right">
              <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
              <el-breadcrumb-item>历史记录</el-breadcrumb-item>
            </el-breadcrumb>
          </div>
          
            <el-form :inline="true" class="search-form">
                <el-form-item label="申请人姓名">
                <el-input v-model="searchForm.applicantName" placeholder="请输入姓名"></el-input>
                </el-form-item>
                <el-form-item label="申请时间">
                <el-date-picker v-model="searchForm.applicationDate" type="date" placeholder="选择日期"></el-date-picker>
                </el-form-item>
                <el-form-item label="职位名称">
                <el-input v-model="searchForm.positionName" placeholder="请输入职位名称"></el-input>
                </el-form-item>
                <el-form-item>
                <el-button type="primary" @click="searchApplications">搜索</el-button>
                <el-button @click="resetSearchForm">重置</el-button>
                </el-form-item>
            </el-form>
           
        </div>

       
  
      <!-- 显示申请列表 -->
        <div style="margin-left: 100px;">
          <div style="display: flex;">
            <!-- 职位列表 -->
            <h2>申请人历史记录</h2>

            <el-button type="success" style="width: 100px; height: 42px; margin-top: 10px;margin-left: 800px;">导出</el-button>
        </div>
            <el-table :data="filteredApplications" style="width: 1000px;height: 300px;">
                <el-table-column prop="applicantName" label="申请人姓名"></el-table-column>
                <el-table-column prop="applicationDate" label="申请时间"></el-table-column>
                <el-table-column prop="positionName" label="职位名称"></el-table-column>
                <el-table-column prop="status" label="状态"></el-table-column>
                <el-table-column label="操作">
                <template slot-scope="scope">
                    <el-button type="text" @click="viewApplication(scope.row)">查看详情</el-button>
                    <el-button type="text" @click="handleApplication(scope.row, 'approve')">通过</el-button>
                    <el-button type="text" @click="handleApplication(scope.row, 'reject')">拒绝</el-button>
                </template>
                </el-table-column>
            </el-table>
        
            <!-- 分页功能 -->
          <div style="margin-left: 300px;">
            <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="pagination.currentPage"
                :page-sizes="[10, 20, 30, 40]"
                :page-size="pagination.pageSize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="totalApplications">
            </el-pagination>
          </div>
        </div>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        searchForm: {
          applicantName: '',
          applicationDate: '',
          positionName: ''
        },
        applications: [], // 所有申请列表数据
        filteredApplications: [], // 根据搜索条件过滤后的申请列表数据
        pagination: {
          currentPage: 1,
          pageSize: 10
        }
      };
    },
    computed: {
      totalApplications() {
        return this.filteredApplications.length;
      }
    },
    methods: {
      searchApplications() {
        // 根据搜索条件过滤申请列表数据
        // 实现搜索逻辑，将符合条件的申请数据赋值给 filteredApplications
      },
      resetSearchForm() {
        // 重置搜索条件
        this.searchForm = {
          applicantName: '',
          applicationDate: '',
          positionName: ''
        };
        this.searchApplications();
      },
      handleApplication(application, action) {
        // 处理申请，包括审核通过、拒绝等操作
        // 实现处理申请的逻辑
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
      }
    }
  };
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
  