<!-- 职位发布 -->
<template>
  <div class="job-publish">
    <div style="margin-bottom: 30px;">
            <el-breadcrumb separator-class="el-icon-arrow-right">
              <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
              <el-breadcrumb-item>职位发布</el-breadcrumb-item>
            </el-breadcrumb>
          </div>
    <div style="margin-bottom: 30px;">
      <span style="font-weight: bold;margin-right: 30px;">已发布岗位</span> <el-button type="primary" @click="gwxs">发布岗位</el-button>
    </div>
    <!-- 已发布岗位表格 -->
    
    <el-table :data="publishedJobs" style="width: 1000px;height: 300px;">
      <el-table-column prop="name" label="公司名称"></el-table-column>
      <el-table-column prop="title" label="职位名称"></el-table-column>
      <el-table-column prop="type" label="职位类型"></el-table-column>
      <el-table-column prop="salary" label="薪资待遇"></el-table-column>
      <el-table-column prop="expiryDate" label="有效期"></el-table-column>
      <el-table-column prop="sum" label="招聘人数"></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button size="mini" >编辑</el-button>
          <el-button size="mini" type="danger" >删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 发布岗位弹窗 -->
    <el-dialog :visible.sync="dialogVisible"  title="发布岗位">
      <el-form ref="jobForm" :model="job" label-width="100px" class="job-form">
      <!-- 职位基本信息 -->
      <el-form-item label="职位名称" required>
        <el-input v-model="job.title" placeholder="请输入职位名称"></el-input>
      </el-form-item>
      <el-form-item label="职位描述" required>
        <el-input type="textarea" v-model="job.description" placeholder="请输入职位描述"></el-input>
      </el-form-item>
      <el-form-item label="职位要求" required>
        <el-input type="textarea" v-model="job.requirements" placeholder="请输入职位要求"></el-input>
      </el-form-item>
      <el-form-item label="薪资待遇" required>
        <el-input v-model="job.salary" placeholder="请输入薪资待遇"></el-input>
      </el-form-item>
      <el-form-item label="招聘人数" required>
        <el-input v-model="job.sum" placeholder="请输入招聘人数"></el-input>
      </el-form-item>
      <el-form-item label="职位类型" required>
        <el-select v-model="job.type" placeholder="请选择职位类型">
          <el-option label="全职" value="fulltime"></el-option>
          <el-option label="兼职" value="parttime"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="公司Logo">
        <!-- <el-upload
          class="upload-demo"
          action="/upload"
          :show-file-list="false"
          :on-success="handleUploadSuccess"
          :before-upload="beforeUpload">
          <el-button slot="trigger" size="small" type="primary">点击上传</el-button>
        </el-upload> -->
      </el-form-item>
      <el-form-item>
        <el-button >发布岗位</el-button>
        <el-button>重置</el-button>
      </el-form-item>
    </el-form>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      dialogVisible: false, // 发布岗位弹窗是否可见
      job: {
        title: '',
        description: '',
        requirements: '',
        salary: '',
        type: '',
        logoUrl: '' // 上传的公司Logo地址
      },
      publishedJobs: [], // 已发布的岗位数据
      
      publishJob: { // 发布岗位的数据
        company: '',
        job: ''
      },
      companies: [], // 公司列表
      jobs: [] // 岗位列表
    };
  },
  methods: {
    //发布岗位弹窗--显示
    gwxs(){
      this.dialogVisible = true;
    }
  }
};
</script>

<style scoped>
.job-publish {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.job-form {
  margin-bottom: 20px;
}

.upload-demo {
  display: inline-block;
  margin-left: 10px;
}
</style>
