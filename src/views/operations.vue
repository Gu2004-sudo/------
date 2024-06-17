<template>
  <!-- 业务管理 -->
  <div>
    <el-collapse :accordion="true" v-loading="loading">
      <el-collapse-item :name="index" v-for="(item, index) in collegeList" :key="index"
        @click.native="onChange(item.label)">
        <template slot="title">
          <i style="width: 3px;background-color: #409EFF;height: 16px;margin-right: 3px;"></i>{{ item.label }}
        </template>
        <div>
          <el-row >
            <el-col :span="8" v-for="(card, index) in cardList" :key="index" v-if="card.college==item.label">
              <el-card :body-style="{ padding: '0px' }" style="width: 400px;height: 200px;background-color: #395544;">
                <div style="width: 30%;overflow: hidden;float: left;">
                  <img src="../assets/bj.jpeg" class="image">
                </div>
                <div style="padding: 14px;">
                  <h2 style="color: #fff;">{{card.speciality}}{{card.grade}}</h2>
                  <h3 style="color: #fff;">{{card.className}}</h3>
                  <div class="bottom clearfix">
                    <el-button type="primary" style="height: 30px;line-height:0;" class="operateBtn"
                      round @click="handleshiXi(card.className)">实习就业</el-button>
                    <el-button type="primary" style="height: 30px;line-height:0;" class="operateBtn" round
                      @click="handleStu(card.className)">学生管理</el-button>
                  </div>
                </div>
              </el-card>
            </el-col>
          </el-row>
        
        </div>
      </el-collapse-item>
    </el-collapse>

  </div>

</template>
<script>
import axios from "axios";
export default {
  data() {
    return {
      collegeList: [],
      gradeList: [],
      speciality: [],
      cardList: [],
      loading:false,
      specialityValue: '',
      value: '',
      value2: '',
    };
  },
  mounted() {
    this.getCollegeData();
    this.getGradeData();
    this.getSpeciality();
    this.jwt();
   // console.log(this.collegeList, this.gradeList, this.speciality)
  },
  methods: {
    onChange(name) {
      //console.log(name)
      // this.loading=true;
      // if(this.cardList.length>0)
      this.cardList=[];
      this.getData(name);
      
    },
    handleshiXi(name){
      this.$router.push({ path: '/main/stuPractice?className='+name });
    },
    getData(name) {
      for (let i = 0; i < this.speciality.length; i++) {
        const speciality = this.speciality[i].label;
        for (let j = 0; j < this.gradeList.length; j++) {
          const grade = this.gradeList[j].label;
            this.getClass(name,grade,speciality)
        }
      }
     // console.log('c',this.cardList)
    },
    getClass(college,grade,speciality){
      axios.get("/main/selectClassNameAndGradeName?collegeName="+college+"&specialityName="+speciality+"&gradeName="+grade).then(res => {
      //  console.log(res)
        const data = res.data.data
        if(data.length!=0){
            for (let i = 0; i < data.length; i++) {
              const element = data[i].className;
              this.cardList.push({college:college,speciality:speciality,grade:grade,className:element})
            }
        }
      })
      this.loading=false
    },
    handleStu(name) {
      this.$router.push({ path: '/main/studentManagement?className='+name });
    },
    getSpeciality() {
      axios.get("/main/selectSpeciality").then(res => {
       // console.log('s', res)
        const data = res.data.data
        for (let index = 0; index < data.length; index++) {
          const element = data[index].specialityName;
          //console.log(element)
          this.speciality.push({
            value: data[index].specialityID,
            label: element
          })
        }
      })

    },
    getCollegeData() {
      axios.get("/main/selectCollege").then(res => {
        //console.log('c', res)
        const data = res.data.data
        for (let index = 0; index < data.length; index++) {
          const element = data[index].collegeName;
          //console.log(element)
          this.collegeList.push({
            value: data[index].collegeID,
            label: element
          })
        }
       // console.log(this.collegeList)
      })
    },

    getGradeData() {
      axios.get("/main/selectGrade").then(res => {
        //console.log('g', res)
        const data = res.data.data
        for (let index = 0; index < data.length; index++) {
          const element = data[index].gradeName;
          //console.log(element)
          this.gradeList.push({
            value2: data[index].gradeID,
            label: element
          })
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
  },
}
</script>
<style scoped>
.time {
  font-size: 13px;
  color: #999;
}

.bottom {
  margin-top: 50px;
  line-height: 12px;
}

.button {
  padding: 0;
  float: right;
}

.image {
  height: 200px;
  display: block;
}

.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}

.clearfix:after {
  clear: both
}

.operateBtn {
  color: black;
}
</style>