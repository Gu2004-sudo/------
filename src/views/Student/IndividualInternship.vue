<template>
  <div class="box">
    <div class="box-content">

      <div class="lndivt" style="margin-bottom: 15px;">
        <el-breadcrumb separator="/">
          <el-breadcrumb-item>首页</el-breadcrumb-item>
          <el-breadcrumb-item>个人实习</el-breadcrumb-item>
        </el-breadcrumb>
      </div>

      <div class="box1" style="
          height: 70px;
          box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
          background-color: white;
        ">
        <label for="" style="">请输入公司名：</label>
        <el-input v-model="input" placeholder="请输入内容"
          style="width: 200px; margin-left: 10px; margin-right: 10px"></el-input>
        <label for="" style="width: 200px; margin-left: -30px">请选择状态：</label>
        <el-select v-model="value" placeholder="请选择状态" style="width: 200px; margin-left: -50px; margin-right: 10px"
          clearable>
          <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.label">
          </el-option>
        </el-select>
        <el-button type="primary" icon="el-icon-search" style="width: 80px;height: 40px;"
          @click="handleSelect()">搜索</el-button>
      </div>
      <div class="box2" style="height: 300px;">
        <el-table :data="tableData" :header-cell-style="{ background: '#eee', color: '#606266' }" height="300"
          style="width: 100%;" bac max-height="300">
          <el-table-column fixed prop="entryTime" label="入职时间" width="150">
          </el-table-column>
          <el-table-column prop="companyName" label="公司名称" width="180">
          </el-table-column>
          <el-table-column prop="postName" label="实习岗位名称" width="180">
          </el-table-column>
          <el-table-column label="岗位简介" width="180">
            <template slot-scope="scope">
                <span style="white-space: nowrap;">{{ scope.row.postResponsibility }}</span>
            </template>
           
          </el-table-column>
          <el-table-column prop="statu" label="状态" width="120">
          </el-table-column>
          <el-table-column prop="endTime" label="离职时间" width="120">
          </el-table-column>
          <el-table-column prop="postNature" label="性质" width="120">
          </el-table-column>
          <el-table-column prop="postSalary" label="实习薪资">
          </el-table-column>

        </el-table>
      </div>
      <div class="box3" style="height: 60px; background-color: white">
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
          :current-page.sync="currentPage" :page-sizes="[5, 10, 15, 20]" :page-size="this.page.pageSize"
          layout="sizes, prev, pager, next" :total="page.total">
        </el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
export default {
  mounted() {
    this.getID();
    // this.getData();
    this.jwt();
  },

  methods: {
    jwt() {
      this.jwt = localStorage.getItem('jwt')
      //console.log(this.jwt)
      axios.get("/login/isLogin", {
        headers: {
          token: `${this.jwt}`
        }
      }).then((res) => {
        if (res.data.code != 1) {
          this.$router.push({
            path: '/'
          })
        }
        //console.log(res.data.code)
      })
    },
    handleSizeChange(val) {
      this.page.pageSize = val;
      console.log(`每页 ${val} 条`);
      this.getData();
    },
    handleCurrentChange(val) {
      this.page.page = val;
      console.log(`当前页: ${val}`);
      this.getData();
      // this.getPage();
    },
    handleSelect() {
      if (this.value == '全部') {
        this.value = ''
      }
      axios.get("/main/selectPracticePost", { params: { studentID: this.studentID, page: this.page.page, court: this.page.pageSize, companyName: this.input, statu: this.value } }).then(res => {
        console.log(res, 'get')
        this.tableData = res.data.data.rows
        this.page.total = res.data.data.total
        for (let index = 0; index < this.tableData.length; index++) {
          const element = this.tableData[index];
          const et = element.entryTime.indexOf('T')
          const liZhi = element.endTime.indexOf('T')
          // = this.postList[index].entryTime;
          if (liZhi>= 0) {
            let date = new Date(element.endTime)
            date.setDate(date.getDate() + 1)
            let newDateStr = date.toISOString().slice(0, liZhi);
            this.tableData[index].endTime = newDateStr
          }
          if (et != -1) {
            let date = new Date(element.entryTime)
            date.setDate(date.getDate() + 1)
            let newDateStr = date.toISOString().slice(0, et);
            this.tableData[index].entryTime = newDateStr
          }
        }
      })
    },
    deleteRow(id) {
      var qs = require('qs')
      axios.post("/main/deletePracticePost", qs.stringify({ practicePostID: id })).then(res => {
        console.log(res, 'del')
        // this.studentID = res.data.data.rows[0].studentID
        this.getData();
      })
    },
    getID() {
      axios.get("/main/selectStudent", { params: { studentNo: localStorage.getItem('userName') } }).then(res => {
        console.log(res, 'stu')
        this.studentID = res.data.data.rows[0].studentID
        this.getData()
      })
    },
    getData() {
      console.log(this.studentID)
      axios.get("/main/selectPracticePost", { params: { studentID: this.studentID, page: this.page.page, court: this.page.pageSize } }).then(res => {
        console.log(res, 'p')
        this.tableData = res.data.data.rows
        this.page.total = res.data.data.total
        for (let index = 0; index < this.tableData.length; index++) {
          const element = this.tableData[index];
          const et = element.entryTime.indexOf('T');
          if(element.endTime!="" && element.endTime!=null ){
            const liZhi = element.endTime.indexOf('T')
            if (liZhi != -1) {
              let date = new Date(element.endTime)
              date.setDate(date.getDate() + 1)
              let newDateStr = date.toISOString().slice(0, liZhi);
              this.tableData[index].endTime = newDateStr
            }
          }
         
          // = this.postList[index].entryTime;
          if (et != -1) {
            let date = new Date(element.entryTime)
            date.setDate(date.getDate() + 1)
            let newDateStr = date.toISOString().slice(0, et);
            this.tableData[index].entryTime = newDateStr
          }
        }
      })
    },
    handleClick(row) {
      console.log(row);
    },
  },

  data() {

    return {
      page: {
        page: 1,
        total: 0, //
        pageSize: 5,//显示的数量
      },
      currentPage: 1,
      studentID: '',
      input: "", // 定义 input 属性并初始化为空字符串
      tableData: [], // 定义 tableData 属性并初始化为空数组
      // tableData: [{
      //   date: '2016-05-02',
      //   name: '王小虎',
      //   province: '上海',
      //   city: '普陀区',
      //   address: '上海市普陀区金沙江路 1518 弄',
      //   zip: 200333
      // }, {
      //   date: '2016-05-04',
      //   name: '王小虎',
      //   province: '上海',
      //   city: '普陀区',
      //   address: '上海市普陀区金沙江路 1517 弄',
      //   zip: 200333
      // }, {
      //   date: '2016-05-01',
      //   name: '王小虎',
      //   province: '上海',
      //   city: '普陀区',
      //   address: '上海市普陀区金沙江路 1519 弄',
      //   zip: 200333
      // }, {
      //   date: '2016-05-01',
      //   name: '王小虎',
      //   province: '上海',
      //   city: '普陀区',
      //   address: '上海市普陀区金沙江路 1519 弄',
      //   zip: 200333
      // }, {
      //   date: '2016-05-03',
      //   name: '王小虎',
      //   province: '上海',
      //   city: '普陀区',
      //   address: '上海市普陀区金沙江路 1516 弄',
      //   zip: 200333
      // }],
      options: [
        {
          value: "选项2",
          label: "实习",
        },
        {
          value: "选项3",
          label: "就业",
        },
        {
          value: "选项4",
          label: "离职",
        },
        {
          value: "选项5",
          label: "待通过",
        }
      ],

      value: "", // 默认选择 "全部"
    };
  },
};
</script>
<style scoped>
* {
  margin: 0;
  padding: 0;
}

.box {
  display: flex;
  justify-content: center;
  /* 水平居中 */
  align-items: center;
  /* 垂直居中 */
  height: 100%;
  /* 使父元素高度占满视口 */
}

.box-content {
  max-width: 1200px;
  /* 设置内容最大宽度 */
  width: 100%;
  /* 使内容在父元素内居中 */
  padding: 20px;
  /* 添加内边距 */
  box-sizing: border-box;
  /* 让 padding 不会影响内容宽度 */
}

.box1 {
  margin-bottom: 10px;
  /* 为各个子元素添加间距 */
  text-align: center;
}

.box1 {
  display: flex;
  justify-content: center;
  /* 垂直居中 */
  align-items: center;
  /* 水平居中 */
  height: 70px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  background-color: white;
}

.box2 {
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  /* 为 box2 和 box3 设置阴影效果 */
}

.box3 {
  display: flex;
  justify-content: center;
  /* 垂直居中 */
  align-items: center;
  /* 水平居中 */
  height: 60px;
  background-color: white;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  /* 为 box2 和 box3 设置阴影效果 */
}
</style>