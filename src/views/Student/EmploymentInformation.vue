<template>
  <div class="box">
    <div class="box-content">
      <div class="lndivt" style="margin-bottom: 15px">
        <el-breadcrumb separator="/">
          <el-breadcrumb-item >首页</el-breadcrumb-item>
          <el-breadcrumb-item>就业管理</el-breadcrumb-item>
        </el-breadcrumb>
      </div>

      <div class="box1" style=" height: 70px;box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);background-color: white;">
        <label for="" style="">请输入公司名：</label>
        <el-input
          v-model="companyName"
          placeholder="请输入内容"
          style="width: 200px; margin-left: 10px"
        ></el-input>
        <label for="" style="width: 80px; margin-left: 40px">请选择：</label>

        <div class="block" style="margin-right: 20px">
          <el-date-picker
            v-model="time"
            type="datetimerange"
            :picker-options="pickerOptions"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            align="right"
          >
          </el-date-picker>
        </div>

        <el-button
          type="primary"
          icon="el-icon-search"
          style="width: 80px; height: 40px"
          @click="selectPostAndTime()"
          >搜索</el-button
        >
      </div>
      <div class="box2" style="height: 300px">
        <el-table
          :data="tableData"
          :header-cell-style="{ background: '#eee', color: '#606266' }"
          height="300"
          style="width: 100%"
          bac
          max-height="300"
        >
          <el-table-column fixed prop="entryTime" label="日期" width="140">
          </el-table-column>
          <el-table-column prop="companyName" label="公司名" width="110">
          </el-table-column>
          <el-table-column label="地址" width="110">
            <template slot-scope="scope">
              <span style="white-space: nowrap">{{ scope.row.address }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="postName" label="招聘岗位" width="110">
          </el-table-column>
          <el-table-column
            prop="postResponsibility"
            label="岗位职责(要求)"
            width="280"
          >
          </el-table-column>
          <el-table-column prop="postNature" label="性质" width="110">
          </el-table-column>
          <el-table-column prop="postSalary" label="岗位薪资" width="110">
          </el-table-column>
          <el-table-column prop="numberPeople" label="招聘人数" width="110">
          </el-table-column>
          <el-table-column fixed="right" label="操作" width="110">
            <template slot-scope="scope">
              <!-- <el-button
                @click.native.prevent="deleteRow(scope.$index, tableData)"
                type="text"
                size="small"
              > -->
              <el-button
                type="primary"
                size="mini"
                style="font-size: 15px; margin-right: 4px"
                @click="application(scope.row)"
                ><i class="el-icon-document-add"></i>申请</el-button
              >
              <!-- </el-button> -->
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="box3" style="height: 60px; background-color: white">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page.sync="currentPage"
          :page-sizes="[10, 20, 30, 40]"
          :page-size="this.page.court"
          layout="sizes, prev, pager, next"
          :total="total"
        >
        </el-pagination>
      </div>
      <el-dialog title="简历上传" :visible.sync="dialogFormVisible">
        <el-upload
          class="upload-demo"
          drag
          action="/main/upload"
          multiple
          :on-success="handlePreview"
          :before-remove="beforeRemove"
          :on-remove="handleRemove"
        >
          <i class="el-icon-upload"></i>
          <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
        </el-upload>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="uploadFile()">确 定</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import moment from "moment";
export default {
  mounted() {
    this.getData();
  },
  methods: {
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
      this.page.court = val;
      this.getData();
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      this.page.page = val;
      this.getData();
    },
    handleClick(row) {
      console.log(row);
    },
    getData() {
      axios.get("/main/selectPostByCompanyName", this.page).then((res) => {
        // console.log(res)
        this.tableData = res.data.data.rows;
        this.total = res.data.data.total;
        for (let index = 0; index < this.tableData.length; index++) {
          const element = this.tableData[index];
          if (element.entryTime != null && element.entryTime != "") {
            const et = element.entryTime.indexOf("T");
            // = this.postList[index].entryTime;
            if (et != -1) {
              let date = new Date(element.entryTime);
              date.setDate(date.getDate() + 1);
              let newDateStr = date.toISOString().slice(0, et);
              this.tableData[index].entryTime = newDateStr;
            }
            this.ge;
          }
          this.getCompanyNameAndAddress(index, element.companyID);
        }
      });
    },
    //获取公司名和地址
    getCompanyNameAndAddress(index, id) {
      axios
        .get("/main/selectCompany", { params: { companyID: id } })
        .then((res) => {
          //console.log(res)
          this.$set(
            this.tableData[index],
            "companyName",
            res.data.data.rows[0].companyName
          );
          this.$set(
            this.tableData[index],
            "address",
            res.data.data.rows[0].address
          );
        });
    },

    selectPostAndTime() {
      console.log(this.time[0]);
      if (this.time != []) {
        this.beginTime = moment(this.time[0]).format("YYYY-MM-DD");
        this.endTime = moment(this.time[1]).format("YYYY-MM-DD");
      }

      axios
        .get("/main/selectPostByCompanyName", {
          params: {
            companyName: this.companyName,
            beginTime: this.beginTime,
            endTime: this.endTime,
          },
        })
        .then((res) => {
          this.tableData = res.data.data.rows;
          this.total = res.data.data.total;
          for (let index = 0; index < this.tableData.length; index++) {
            const element = this.tableData[index];
            const et = element.entryTime.indexOf("T");
            // = this.postList[index].entryTime;
            if (et != -1) {
              let date = new Date(element.entryTime);
              date.setDate(date.getDate() + 1);
              let newDateStr = date.toISOString().slice(0, et);
              this.tableData[index].entryTime = newDateStr;
            }
            this.getCompanyNameAndAddress(index, element.companyID);
          }
        });
    },
    selectStudent(){
      axios.get("/main/selectAll",{
        params:{
          studentID:this.studentID
        }
      }).then(res=>{

      })
    },
    application(row) {
      
      const isConfirmed = window.confirm("确定要申请这个岗位吗？");
      if (isConfirmed) {
        this.form.companyID=row.companyID;
        this.form.postName=row.postName;
        this.form.postID=row.postID;
        this.dialogFormVisible = true;
        console.log(localStorage.getItem("userName"));
        axios
          .get("/main/selectStudent", {
            params: { studentNo: localStorage.getItem("userName") },
          })
          .then((res) => {
            this.student = res.data.data.rows;
            console.log(this.student);
          });
      }
    },
    uploadFile() {
      this.dialogFormVisible = false;
     
      this.student[0].fileSrc = this.fileName;
      this.form.curriculumVitae=this.fileName;
      this.form.studentName=this.student[0].studentName;
      this.form.studentID=this.student[0].studentID
    
      axios
        .put("/main/updateStudent", JSON.stringify(this.student[0]), {
          headers: {
            "Content-Type": "application/json",
          },
        })
        .then((res) => {
          if (res.data.code == 1) {
            console.log(res.data.code)

          }
        });
        axios.post("/main/insertApplication",JSON.stringify(this.form),{
          headers:{
            "Content-Type": "application/json",
          }
        }).then(res=>{
          if(res.data.data==1){
            this.$message({
              type:"success",
              message:"申请成功"
            })
          }
        })
    },
    handlePreview: function (file, fileList) {
      console.log(file);
      console.log(fileList);
      this.fileName = file.data;
      this.form.CurriculumVitae=file.data
      console.log(this.fileName);
      
      // this.fileSrc = file.data
      // console.log(this.fileSrc)
      // let fname = fileList.response.data.lastIndexOf('/')
      // if (fname != -1) {
      //   console.log(fname)
      //   this.fileName = fileList.response.data.substring(fname + 1)
      //   console.log(this.fileName)
      // }

      // this.fileList.name = file.name
      // this.fileList.url = file.response

      // this.fileList.push[{ name: file.name, url: file.response }]
      // console.log(this.fileList)
      // this.selectPostWC();
    },
    beforeRemove(file) {
      console.log(4444);
      this.student.fileSrc = null;
      return this.$confirm(`确定移除 ${file.name}?`);
    },
    handleRemove(file, fileList) {
      console.log(file, fileList);
      console.log(1111);
    },
  },

  data() {
    return {
      fileName: "",
      student: "",
      beginTime: "",
      endTime: "",
      companyName: "",
      currentPage: 1,
      total: 0,
      dialogFormVisible: false,

      formLabelWidth: "120px",
      page: {
        page: 1,
        court: 5,
      },
      input: "", // 定义 input 属性并初始化为空字符串
      tableData: [], // 定义 tableData 属性并初始化为空数组

      pickerOptions: {
        shortcuts: [
          {
            text: "最近一周",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit("pick", [start, end]);
            },
          },
          {
            text: "最近一个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit("pick", [start, end]);
            },
          },
          {
            text: "最近三个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit("pick", [start, end]);
            },
          },
        ],
      },
      time: [],
      form:{
        studentName:'',
        postName:'',
        curriculumVitae:'',
        studentID:this.studentID,
        companyID:'',
        postID:'',
      },
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