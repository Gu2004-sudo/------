<template>
  <div>
    <div class="MonthlyBox1">
      <div class="forth2" style="width: 1200px;height: 70px; background-color: f2f6fc; margin: 0 auto; margin-top: 20px;">
        <div class="lndivt" style="background-color: #f2f6fc">
          <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/teacher/teaStudent' }">学生信息</el-breadcrumb-item>
            
            <el-breadcrumb-item>月报</el-breadcrumb-item>
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
            @click="getData">搜索</el-button>
        </div>
      </div>

      <div class="Monthly2" style="width: 1200px;background-color: white; margin: 0 auto; margin-top: 90px;">
        <el-row :gutter="20">
          <el-col :span="8" v-for="(item, index) in cardData" :key="index"
            style="width: 200px;height: 270px;margin-left: 30px;margin-top: 20px;">
            <el-card :body-style="{ padding: '0px' }" style="margin-bottom: 20px">
              <img src="../../assets/月报.jpg" class="image" />
              <div style="padding: 14px">
                <span v-if="item" style="float: left;">{{ item.monthlyReportTitle }}</span><br>
                <div class="bottom clearfix">
                  <time class="time">{{ item.createTime }}</time>
                </div>

                <el-button type="text" style="float: left;  font-size: 14px;"
                  @click="handleScore(item.monthlyReportID, 'score')">月报评分</el-button>
                <el-button type="text" style="float: right;  font-size: 14px;"
                  @click="handleScore(item.monthlyReportID, 'data')">查看详细</el-button>
              </div>
            </el-card>
          </el-col>
        </el-row>

        <el-empty v-if="cardData.length === 0" description="暂无数据"
          style="width: 100%; height: 600px; margin-top: 20px"></el-empty>

      </div>
      <div style="margin-top: 100px;" v-if="cardData.length !== 0">
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
          :current-page.sync="currentPage" :page-sizes="[10, 20, 30, 40]" :page-size="this.page.court"
          layout="sizes, prev, pager, next" :total="this.total">
        </el-pagination>
      </div>
      <div class="Monthly3"></div>


    </div>
    <el-dialog :title="dialogData.monthlyReportTitle" :visible.sync="centerDialogVisible" width="30%" center>
      <span>{{ dialogData.monthlyReportDetails }}</span><br>
    
        <label  v-if="dialogData.score<0" >打分：<el-input  v-model="score"  placeholder="暂未评分" style="width: 100px;"></el-input></label>
      <label v-else>打分：<el-input   v-model="dialogData.score" placeholder="分数" style="width: 80px;"></el-input></label>
      
      <span slot="footer" class="dialog-footer">
        <el-button @click="centerDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="updateScore()">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog :title="dialogData.monthlyReportTitle" :visible.sync="DialogVisible" width="30%" center>
      <p>{{ dialogData.monthlyReportDetails }}</p><br>
      <el-tag type="success" v-if="dialogData.score">分数：{{ dialogData.score > 0 ? dialogData.score : '暂未评分' }}</el-tag>
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
      k:'',
      DialogVisible: false,
      centerDialogVisible: false,
      dialogData:
      {
      },
      page: {
        page: 1,
        court: 10,
      },
      total: 0,
      score: '',
      input: "",
      value: "",
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
      cardData: [],
      currentDate: new Date(),
      studentNo: '',
      currentPage: 1,
      className: '',
    };
  },

  mounted() {
    this.className = this.$route.query.className
    this.studentNo = this.$route.query.studentNo
    this.search()
    this.getData();
    this.jwt()

    // console.log(this.$route.query.studentNo)
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
    updateScore() {
      this.centerDialogVisible=false
      if (this.score > 100 || this.score < 0) {
        this.$message({
          type: 'error',
          message: '分数必须在0-100之间'
        })
      } else {
        if(this.dialogData.score<0){
          this.dialogData.score=this.score
        }
        console.log(this.dialogData.score)
        axios.post("/main/updateMonthlyReport", JSON.stringify(this.dialogData), {
          headers: {
            'Content-Type': 'application/json',
          }
        }).then(res => {
          this.$message({
            showClose: true,
            message: '打分成功',
            type: 'success'
          });
        })
      }
    },
    handleScore(id, key) {
      //selectMonthlyReport
      axios.get("/main/selectMonthlyReport", { params: { MonthlyReportID: id } }).then(res => {
        // console.log(res, '月报')
        this.dialogData = res.data.data.rows[0];

      })
      if (key == 'score')
        this.centerDialogVisible = true;
      else
        this.DialogVisible = true
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
    getData() {
      // console.log(this.studentNo)
      // 查询逻辑...
      let data = this.value;
      if (this.value == '全部') {
        data = ''
      }
      axios.get("/main/selectMonthlyReport", { params: { studentNo: this.studentNo, page: this.page.page, court: this.page.court, MonthlyReportTitle: this.input, createTime: data } }).then(res => {
        console.log(res,'y')
        this.total = res.data.data.total
        this.cardData = res.data.data.rows
        for (let index = 0; index < this.cardData.length; index++) {
          const element = this.cardData[index];
          const et = element.createTime.indexOf('T')
          // = this.postList[index].entryTime;
          if (et != -1) {
            let date = new Date(element.createTime)
            date.setDate(date.getDate() + 1)
            let newDateStr = date.toISOString().slice(0, et);
            this.cardData[index].createTime = newDateStr

          }
        }
      })

    },
    search() {
      axios
        .get("/main/selectHalf")
        .then((res) => {
          this.searchData = res.data.data;
          //console.log(res)
        })
        .catch((err) => {
          //  console.error("Error fetching data:", err);
        });
    },
  },
  // 定义过滤器
  filters: {
    // formatDate 过滤器接受一个日期对象作为参数，并返回格式化后的日期字符串
    formatDate(date) {
      // 使用 Date 对象的 get 方法获取年、月、日
      const year = date.getFullYear();
      const month = (date.getMonth() + 1).toString().padStart(2, "0"); // 月份从 0 开始，需要加 1
      const day = date.getDate().toString().padStart(2, "0");
      // 返回格式化后的日期字符串
      return `${year}-${month}-${day}`;
    },
  },
};
</script>

<style>
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

.time {
  font-size: 13px;
  color: #999;
  float: left;
}

.bottom {

  line-height: 12px;
}

.button {
  padding: 0;

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