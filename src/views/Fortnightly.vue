<template>
  <div>
    <div class="MonthlyBox1">
      <div class="forth2" style="
          width: 1200px;
          height: 70px;
          background-color: f2f6fc;
          margin: 0 auto;
          margin-top: 20px;
        ">
        <div class="lndivt" style="background-color: #f2f6fc">
          <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/main' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item :to="{ path: '/main/shiXiAndJiuYe?className='+this.className }">实习就业</el-breadcrumb-item>
            <el-breadcrumb-item>半月报</el-breadcrumb-item>
          </el-breadcrumb>
        </div>

        <div class="Monthly1" style="margin-bottom: 20px">
          <label for="" style="">请输入标题:</label>
          <el-input v-model="input" placeholder="请输入内容" style="width: 200px; margin-left: 20px"></el-input>

          <label for="" style="width: 100px; margin-left: 50px">请选择日期:</label>
          <el-select v-model="value" placeholder="请选择" style="width: 200px; ">
            <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.label">
            </el-option>
          </el-select>

          <el-button type="primary" icon="el-icon-search" style="width: 80px; height: 40px; margin-left: 20px"
            @click="search()">搜索</el-button>
        </div>

      </div>

      <div class="Monthly2" style="width: 1200px;
            
            background-color: white;
            margin: 0 auto;
            margin-top: 90px;
          ">
        <el-row :gutter="20">
          <el-col :span="8" v-for="(item, index) in searchData" :key="index"
            style="width: 200px;height: 270px;margin-left: 30px;margin-top: 20px;">
            <el-card :body-style="{ padding: '0px' }" style="margin-bottom: 20px">
              <img src="../assets/月报.jpg"  class="image" />
              <div style="padding: 14px">
                <span v-if="item" style="float: left;">{{ item.halfTitle }}</span><br>
                <div class="bottom clearfix">
                  <time class="time">{{ item.createTime }}</time>

                </div>

                <el-button type="text" style="float: left;  font-size: 14px;"
                  @click="handleScore(item.halfMonthID, 'score')">半月报评分</el-button>
                <el-button type="text" style="float: right;  font-size: 14px;"
                  @click="handleScore(item.halfMonthID, 'data')">查看详细</el-button>

                <!-- <el-button type="text" style="float: left; font-size: 14px;"
                  @click="handleScore(item.halfMonthID, 'score')">半月报评分</el-button>
                <el-button type="text" style="float: right;  font-size: 14px;"
                  @click="handleScore(item.halfMonthID, 'data')">查看详细</el-button> -->

              </div>
            </el-card>
          </el-col>

        </el-row>
        <el-empty v-if="searchData.length === 0" description="暂无数据"
          style="width: 100%; height: 600px; margin-top: 20px"></el-empty>

      </div>
      <div style="margin-top: 50px;" v-if="searchData.length !== 0">
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
          :current-page.sync="currentPage" :page-sizes="[10, 20, 30, 40]" :page-size="page.court"
          layout="sizes, prev, pager, next" :total="total">
        </el-pagination>
      </div>
      <div class="Monthly3"></div>

      <!-- el-dialog 元素，根据 showDialogData 控制显示与隐藏 -->
      <el-dialog :visible.sync="showDialogData" title="添加半月报" width="50%">
        <!-- 弹窗内容 -->
        <el-form :model="form" ref="form" label-width="80px">
          <el-form-item label="标题">
            <el-input v-model="form.title"></el-input>
          </el-form-item>
          <el-form-item label="内容">
            <el-input type="textarea" v-model="form.content"></el-input>
          </el-form-item>
          <el-form-item label="上传">
            <!-- 这里是上传组件，具体可以使用 element-ui 的 el-upload 组件 -->
            <el-upload action="/upload" :show-file-list="false" :on-success="handleUploadSuccess">
              <el-button slot="trigger" size="small" type="primary">点击上传</el-button>
            </el-upload>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="showDialogData = false">取 消</el-button>
          <el-button type="primary" @click="saveMonthly">确 定</el-button>
        </span>
      </el-dialog>
    </div>
    <el-dialog :title="dialogData.halfTitle" :visible.sync="centerDialogVisible" width="30%" center>
      <span>{{ dialogData.halfMonthDetails }}</span><br>

      <label  v-if="dialogData.score<0" >打分：<el-input v-model="score" value="0" placeholder="暂未评分" style="width: 100px;"></el-input></label>
      <label v-else>打分：<el-input  v-model="dialogData.score" placeholder="分数" style="width: 80px;"></el-input></label>

      <!-- <label>打分：<el-input v-model="dialogData.score" placeholder="分数"
          style="width: 80px;margin-top: 20px;"></el-input></label> -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="centerDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="updateScore()">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog :title="dialogData.halfTitle" :visible.sync="DialogVisible" width="30%" center>
      <p>{{ dialogData.halfMonthDetails }}</p><br>
      <el-tag type="success">分数：{{ dialogData.score >= 0 ? dialogData.score : '暂未评分' }}</el-tag>
      <span slot="footer" class="dialog-footer">
        <el-button @click="DialogVisible = false">关 闭</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      DialogVisible: false,
      dialogData:
      {
      },
      page: {
        page: 1,
        court: 10,
      },
      currentPage: 1,
      total: 0,
      centerDialogVisible: false,
      input: "",
      value: [],
      className:'',
      options: [{
        value: "选项1",
        label: "全部"
      },
      {
        value: "选项2",
        label: "2024"
      },
      {
        value: "选项3",
        label: "2023"
      },
      {
        value: "选项4",
        label: "2022"
      },
      ],
      searchData: [],
      currentDate: new Date(),
      showDialogData: false, // 控制弹窗显示与隐藏的数据属性
      form: {
        title: '',
        content: '',
        // 其他上传所需的字段
      },
      studentNo: '',
    };
  },

  mounted() {
    this.className= this.$route.query.className
    this.studentNo = this.$route.query.studentNo
    this.search();
    this.jwt()
  },

  methods: {
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
      this.page.court = val;
      this.search();
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      this.page.page = val;
      this.search();
    },
   
    updateScore() {
      if (this.score > 100 || this.score < 0) {
        this.$message({
          type: 'error',
          message: '分数必须在0-100之间'
        })
      } else {
        axios.post("/main/updateHalf", JSON.stringify(this.dialogData), {
          headers: {
            'Content-Type': 'application/json',
          }
        }).then(res => {
          this.$message({
            showClose: true,
            message: '打分成功',
            type: 'success'
          });
          this.centerDialogVisible = false
        })
      }
    },
    handleScore(id, key) {
      //selectMonthlyReport

      axios.get("/main/selectHalf", { params: { halfMonthID: id } }).then(res => {
        console.log(res, '月报')
        this.dialogData = res.data.data.rows[0];
      })
      if (key == 'score')
        this.centerDialogVisible = true;
      else {
        this.DialogVisible = true
        console.log(1)
      }

    },
    search() {
      // 查询逻辑...
      let data = this.value;
      if (this.value == '全部') {
        data = ''
      }
      axios.get("/main/selectHalf", { params: { studentNo: this.studentNo, page: this.page.page, court: this.page.court, halfTitle: this.input, createTime: data } }).then(res => {
        console.log(res, 'f')
        this.total = res.data.data.total
        console.log(this.total)
        this.searchData = res.data.data.rows
        for (let index = 0; index < this.searchData.length; index++) {
          const element = this.searchData[index];
          const et = element.createTime.indexOf('T')
          // = this.postList[index].entryTime;
          if (et != -1) {
            let date = new Date(element.createTime)
            date.setDate(date.getDate() + 1)
            let newDateStr = date.toISOString().slice(0, et);
            this.searchData[index].createTime = newDateStr

          }
        }
      })
    },
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
    showDialog() {
      this.showDialogData = true; // 显示弹窗
    },

    saveMonthly() {
      // 保存月报逻辑...
      this.showDialogData = false; // 关闭弹窗
    },

    handleUploadSuccess(response, file, fileList) {
      // 处理上传成功逻辑...
    }
  },

  filters: {
    formatDate(date) {
      // 格式化日期过滤器...
    }
  }
};
</script>

<style scoped>
.Monthly1 {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100px;
  margin-top: 20px;
  background-color: white;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

.Monthly1 .content {
  display: flex;
  align-items: center;
}

.button-container {
  display: flex;
  justify-content: center;
  /* 水平居中 */
  align-items: center;
}

.time {
  font-size: 13px;
  float: left;
  color: #999;
}

.bottom {
  line-height: 12px;
}

.button {
  padding: 0;
  float: right;
}

.image {
  width: 100%;
  display: block;
}

.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}

.clearfix:after {
  clear: both;
}
</style>
