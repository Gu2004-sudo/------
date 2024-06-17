<template>
  <div>
    <div style="margin-top: 20px;">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>统计分析</el-breadcrumb-item>
        <el-breadcrumb-item>实习就业</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="shiXiAndJiuYe_main">
      <div class="shixiData_get">
                <el-form :inline="true" :model="formInline" class="demo-form-inline">
                    <el-form-item label="院校">
                        <el-select v-model="value" placeholder="请选择院校" @change="handelCollege($event)">
                            <el-option v-for="item in options" :key="item.value" :label="item.label"
                                :value="item.label">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="专业">
                        <el-select v-model="zhuanYeValue" placeholder="请选择专业">
                            <div slot="empty" style="margin: 10px;text-align: center;color: gray;">{{ value == '' ?
                    '请先选择学院' : '暂无专业' }}</div>
                            <el-option v-for="item in SpecialityOptions" :key="item.zhuanYeValue" :label="item.label"
                                :value="item.label">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="年级">
                        <el-select v-model="value2" placeholder="请选择年级">
                            <el-option v-for="item in options2" :key="item.value2" :label="item.label"
                                :value="item.label">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="班级">
                        <el-input v-model="input" placeholder="请选择班级"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" icon="el-icon-search" @click="handleSelect()" :loading="loading">{{
                    loading ==
                        true
                        ? '加载中' : '搜索' }}</el-button>
                        <el-button type="info" icon="el-icon-refresh" @click="handleRefresh()">重置</el-button>
                    </el-form-item>
                </el-form>
            </div>
      <div style="width: 100%;margin: 0 auto;display: flex;
            justify-content: center;
            align-items: center;">
        <!-- <el-switch style="margin: 10px auto;" v-model="switchValue" active-color="#13ce66" inactive-color="#409EFF"
          active-text="实习" inactive-text="就业" @change="handleChangeStatus($event)" :disabled="loading">
        </el-switch> -->

      </div>
      <el-tabs v-model="activeName" @tab-click="handleClick" class="shiXiTabs">
        <el-tab-pane label="实习" name="first" :disabled="loading">
          <el-empty :image-size="200" v-if="show" class="data"></el-empty>
          <div class="data" id="data" style="width: 100%;" v-if="show == false"></div>
        </el-tab-pane>
        <el-tab-pane label="就业" name="second" :disabled="loading">
          <el-empty :image-size="200" v-if="show" class="data"></el-empty>
          <div class="data" id="data2" style="width: 100%;" v-if="show == false"></div>
        </el-tab-pane>
      </el-tabs>
      <!-- <el-empty :image-size="200" v-if="show" class="data"></el-empty>
      <div id="dataContainer" v-if="show == false">

      </div> -->
    </div>
  </div>
</template>
<script>
import Vue from 'vue'
import * as echarts from 'echarts';
import axios from "axios";
export default {
  data() {
    return {
      activeName: 'first',

      select: true,
      options: [],
      options2: [],
      SpecialityOptions: [],
      zhuanYeValue: '',
      value: '',
      input: '',
      value2: '',
      switchValue: true,
      show: true,
      loading: false,
      TrueData: [],
      FalseData: [],
      classData: [],
      shiXiLv: [],
      JiuYeNum: [],
      jiuYeLv: [],
      shengXueLv: [],
      is: true,
      duiKou: [],
      feiDuiKou: [],
      kaoGong: [],
      canJun: [],
      chuangYe: [],
      shengXue: [],
    }
  },
  created() {

  },
  mounted() {
    this.getCollegeData();
    this.getGradeData();
    this.getSpeciality();
    this.jwt();
    //console.log(await this.getJiuYeNum('软件221'))
  },
  methods: {
    handleClick(tab, event) {
      this.select = false; // 将 select 状态设置为 false
      this.loading = true; // 将 loading 状态设置为 true
      this.$nextTick(() => { // 在下一个DOM更新周期之后执行
        this.select = true; // 将 select 状态设置为 true
        this.loading = true;
      });
      if (this.activeName == 'first') {
        this.getShiXi();
      }
      else {
        this.getJiuYe();
      }
    },
    //根据下拉列表选项进行查询
    handleSelect() {
      console.log(this.loading, 1)

      this.classData = []
      this.select = false; // 将 select 状态设置为 false
      this.loading = true; // 将 loading 状态设置为 true
      this.$nextTick(() => { // 在下一个DOM更新周期之后执行
        this.select = true; // 将 select 状态设置为 true
        this.loading = true;
      });

      if (this.activeName == 'first') {
        this.getShiXi();
      }
      else {
        this.getJiuYe();
      }

    },
    handleRefresh() {
      this.show = true
      this.value = '',
        this.value2 = ''

    },
    handelCollege(data) {
      this.SpecialityOptions = [],
        this.zhuanYeValue = ''
      this.getSpeciality(data);
    },
    //获取班级和学生数量-实习
    getShiXi() {
      console.log(this.loading, 2)
      this.loading = true
      this.classData = [];
      this.TrueData = [];
      this.FalseData = [];
      this.shiXiLv = [];
      axios.get("/main/selectClassVto", {
        params: {
          specialityName: this.zhuanYeValue,
          collegeName: this.value,
          gradeName: this.value2,
          ClassName: this.input,
        }
      }).then(async res => {
        //console.log(res, 'res')
        // this.page.total = res.data.data.total
        let data = res.data.data.rows;
        // console.log(data)
        if (res.data.data.total != 0) {
          //this.classData = res.data.data.rows
          this.show = false
          for (let i = 0; i < data.length; i++) {
            const element = data[i].className;
            this.classData.push(element)
            let True = await this.getData(element)
            this.TrueData.push(True.data.data);
            let False = await this.getContraErture(element)
            let stuNum = await this.getStuNum(element);
            this.FalseData.push(False.data.data);
            let shiXiLv = ((True.data.data + False.data.data) / stuNum.data.data) * 100
            this.shiXiLv.push(Math.round(shiXiLv))
            // const dataContainer = document.getElementById('dataContainer');
            // dataContainer.innerHTML = '<div class="data" id="data" style="width: 100%;" v-if="show == false"></div>';
          }
          //console.log(this.classData,this.stuNum)
          this.init(this.classData, this.TrueData, this.FalseData, this.shiXiLv)
          this.loading = false
        } else {
          this.show = true;
        }
        this.loading = false
        console.log(this.loading, 3)
      })

      //  this.show = true
      this.loading = false
    },
    getShiXiData(college, grade) {
      this.classData = [];
      this.TrueData = [];
      this.FalseData = [];
      this.shiXiLv = [];
      axios.get("/main/selectClass?collegeName=" + college + '&gradeName=' + grade).then(async res => {
        this.loading = true
        if (res.data.data.length != 0) {
          this.show = false
          const data = res.data.data
          for (let index = 0; index < data.length; index++) {
            const element = data[index].className;
            this.classData.push(element)
            let True = await this.getData(element)
            this.TrueData.push(True.data.data);
            let False = await this.getContraErture(element)
            let stuNum = await this.getStuNum(element);
            this.FalseData.push(False.data.data);
            let shiXiLv = ((True.data.data + False.data.data) / stuNum.data.data) * 100
            this.shiXiLv.push(Math.round(shiXiLv))
          }
          this.init(this.classData, this.TrueData, this.FalseData, this.shiXiLv)
          this.loading = false
        } else {
          this.show = true;
        }
        this.loading = false
      })
    },
    getJiuYe() {
      this.classData = [];
      this.duiKou = [];
      this.feiDuiKou = [];
      this.kaoGong = [];
      this.canJun = [];
      this.chuangYe = [];
      this.shengXueLv = [];
      this.shengXue = [];
      this.jiuYeLv = [];
      axios.get("/main/selectClassVto", {
        params: {
          specialityName: this.zhuanYeValue,
          collegeName: this.value,
          gradeName: this.value2,
          ClassName: this.input,
        }
      }).then(async res => {
        //console.log(res, 'res')
        this.loading = true
        // this.page.total = res.data.data.total
        let data = res.data.data.rows;
        // console.log(data)
        if (res.data.data.total != 0) {
          //this.classData = res.data.data.rows
          this.show = false
          for (let i = 0; i < data.length; i++) {
            const element = data[i].className;
            this.classData.push(element)
            let duiKou = await this.getDuiKou(element);
            let feiDuiKou = await this.getFeiDuiKou(element);
            let kaoGong = await this.getKaoGong(element);
            let canJun = await this.getCanJun(element);
            let chuangYe = await this.getChuangYe(element);
            let shengXue = await this.getShengXue(element);
            this.duiKou.push(duiKou.data.data)
            this.feiDuiKou.push(feiDuiKou.data.data)
            this.kaoGong.push(kaoGong.data.data)
            this.canJun.push(canJun.data.data)
            this.chuangYe.push(chuangYe.data.data)
            this.shengXue.push(shengXue.data.data)
            let stuNum = await this.getStuNum(element);
            let jiuYeLv = ((duiKou.data.data + feiDuiKou.data.data) / stuNum.data.data) * 100
            let shengXueLv = (shengXue.data.data / stuNum.data.data) * 100
            this.shengXueLv.push(Math.round(shengXueLv))
            this.jiuYeLv.push(Math.round(jiuYeLv))
          }
          //console.log(this.classData,this.stuNum)
          this.init2(this.classData, this.duiKou, this.feiDuiKou, this.kaoGong, this.canJun, this.chuangYe, this.shengXueLv, this.shengXue, this.jiuYeLv)
          this.loading = false

        } else {
          this.show = true
        }
        this.loading = false
      })

      //  this.show = true
      this.loading = false
    },
    // getJiuYeData(college, grade) {
    //   this.classData = [];
    //   this.duiKou = [];
    //   this.feiDuiKou = [];
    //   this.kaoGong = [];
    //   this.canJun = [];
    //   this.chuangYe = [];
    //   this.shengXueLv = [];
    //   this.shengXue = [];
    //   this.jiuYeLv = [];
    //   axios.get("/main/selectClass?collegeName=" + college + '&gradeName=' + grade).then(async res => {
    //     if (res.data.data.length != 0) {
    //       this.show = false
    //       const data = res.data.data
    //       for (let index = 0; index < data.length; index++) {
    //         const element = data[index].className;
    //         this.classData.push(element)
    //         let duiKou = await this.getDuiKou(element);
    //         let feiDuiKou = await this.getFeiDuiKou(element);
    //         let kaoGong = await this.getKaoGong(element);
    //         let canJun = await this.getCanJun(element);
    //         let chuangYe = await this.getChuangYe(element);
    //         let shengXue = await this.getShengXue(element);
    //         this.duiKou.push(duiKou.data.data)
    //         this.feiDuiKou.push(feiDuiKou.data.data)
    //         this.kaoGong.push(kaoGong.data.data)
    //         this.canJun.push(canJun.data.data)
    //         this.chuangYe.push(chuangYe.data.data)
    //         this.shengXue.push(shengXue.data.data)
    //         let stuNum = await this.getStuNum(element);
    //         let jiuYeLv = ((duiKou.data.data + feiDuiKou.data.data) / stuNum.data.data) * 100
    //         let shengXueLv = (shengXue.data.data / stuNum.data.data) * 100
    //         this.shengXueLv.push(Math.round(shengXueLv))
    //         this.jiuYeLv.push(Math.round(jiuYeLv))
    //         // this.shiXiLv.push(Math.round(shiXiLv))
    //         const dataContainer = document.getElementById('dataContainer');
    //         dataContainer.innerHTML = '<div class="data" id="data2" style="width: 80%;" v-if="show == false"></div>';
    //       }
    //       this.init2(this.classData, this.duiKou, this.feiDuiKou, this.kaoGong, this.canJun, this.chuangYe, this.shengXueLv, this.shengXue, this.jiuYeLv)
    //       this.loading = false
    //     } else {
    //       const dataContainer = document.getElementById('dataContainer');

    //       this.show = true;
    //     }
    //   })
    // },

    //获取对口就业学生数量
    getDuiKou(data) {
      return axios.get("/main/studentNumber?className=" + data + "&contraErture=对口就业")
    },
    getFeiDuiKou(data) {
      return axios.get("/main/studentNumber?className=" + data + "&contraErture=非对口就业")
    },
    getKaoGong(data) {
      return axios.get("/main/studentNumber?className=" + data + "&contraErture=考公")
    },
    getCanJun(data) {
      return axios.get("/main/studentNumber?className=" + data + "&contraErture=参军")
    },
    getChuangYe(data) {
      return axios.get("/main/studentNumber?className=" + data + "&contraErture=创业")
    },
    getShengXue(data) {
      return axios.get("/main/studentNumber?className=" + data + "&contraErture=升学")
    },
    //获取班级学生数量
    getStuNum(data) {
      return axios.get("/main/studentNumber?className=" + data)
    },
    //获取对口实习学生数量
    getData(data) {
      return axios.get("/main/studentNumber?className=" + data + "&contraErture=是")
    },
    //获取非对口实习学生数量
    getContraErture(data) {
      return axios.get("/main/studentNumber?className=" + data + "&contraErture=否")
    },

    //判断当前查看的是就业还是实习
    handleChangeStatus($event) {
      this.is = $event
      this.show = true
      if (this.is != false) {
        this.getShiXi();
      }
      else {
        this.getJiuYe();
      }
    },
    //获取下拉列表数据
    getCollegeData() {
      axios.get("/main/selectCollege").then(res => {
        //console.log(res)
        const data = res.data.data
        for (let index = 0; index < data.length; index++) {
          const element = data[index].collegeName;
          //console.log(element)
          this.options.push({
            value: data[index].collegeID,
            label: element
          })
        }
      })
    },
    getSpeciality(data) {
      if (data != null && data != '')
        axios.get("/main/selectSpeciality", { params: { collegeName: data } }).then(res => {

          const data = res.data.data
          //console.log(data)
          for (let index = 0; index < data.length; index++) {
            const element = data[index].specialityName;
            // console.log(element)
            this.SpecialityOptions.push({
              zhuanYeValue: data[index].specialityID,
              label: element
            })
          }
          // console.log(this.SpecialityOptions,'11')
        })
    },

    //获取下拉列表数据
    getGradeData() {
      axios.get("/main/selectGrade").then(res => {
        //console.log(res)
        const data = res.data.data
        for (let index = 0; index < data.length; index++) {
          const element = data[index].gradeName;
          // console.log(element)
          this.options2.push({
            value2: element,
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
    //实习可视化
    init(data, True, False, shiXiLv) {
      var chartDom = document.getElementById('data');
      var myChart = echarts.init(chartDom);
      var option;

      option = {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            crossStyle: {
              color: '#999'
            }
          }
        },
        toolbox: {
          feature: {
            dataView: { show: true, readOnly: false },
            magicType: { show: true, type: ['line', 'bar'] },
            restore: { show: true },
            saveAsImage: { show: true }
          }
        },
        legend: {
          data: ['对口实习', '非对口实习', '实习率']
        },
        xAxis: [
          {
            type: 'category',
            data: data,
            axisPointer: {
              type: 'shadow'
            }
          }
        ],
        yAxis: [
          {
            type: 'value',
            name: '非对口实习',
            min: 0,
            max: 50,
            interval: 10,
            axisLabel: {
              formatter: '{value} 人'
            }
          },
          {
            type: 'value',
            name: '实习率',
            min: 0,
            max: 100,
            interval: 20,
            axisLabel: {
              formatter: '{value} %'
            }
          }
        ],
        series: [
          {
            name: '对口实习',
            type: 'bar',
            barWidth: '30%',
            itemStyle: {
              normal: {
                label: {
                  show: true,
                  position: 'top', // 顶部显示
                  formatter: '{c}人', // 显示数据值
                  textStyle: {	    //数值样式
                    color: 'grad',
                    fontSize: 16
                  }
                },

              }
            },
            tooltip: {
              valueFormatter: function (value) {
                return value + ' 人';
              }
            },
            data: True
          },
          {
            name: '非对口实习',
            type: 'bar',
            barWidth: '30%',
            itemStyle: {
              normal: {
                label: {
                  show: true,
                  position: 'top', // 顶部显示
                  formatter: '{c}人', // 显示数据值
                  textStyle: {	    //数值样式
                    color: 'grad',
                    fontSize: 16
                  }
                },

              }
            },
            tooltip: {
              valueFormatter: function (value) {
                return value + ' 人';
              }
            },
            data: False
          },
          {
            name: '实习率',
            type: 'line',
            yAxisIndex: 1,
            smooth: true,
            tooltip: {
              valueFormatter: function (value) {
                return value + ' %';
              }
            },
            data: shiXiLv
          }
        ]
      };

      option && myChart.setOption(option);
    },
    //就业可视化
    init2(classData, duiKou, feiDuiKou, kaoGong, canJun, chuangYe, shengXueLv, shengXue, jiuYeLv) {
      console.log('e', chuangYe)
      var chartDom = document.getElementById('data2');
      var myChart = echarts.init(chartDom);
      var option;
      option = {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            crossStyle: {
              color: '#999'
            }
          }
        },
        toolbox: {
          feature: {
            dataView: { show: true, readOnly: false },
            magicType: { show: true, type: ['line', 'bar'] },
            restore: { show: true },
            saveAsImage: { show: true }
          }
        },
        legend: {
          data: ['对口就业', '非对口就业', '就业率', '升学', '升学率', '考公', '参军', '创业']
        },
        xAxis: [
          {
            type: 'category',
            data: classData,
            axisPointer: {
              type: 'shadow'
            }
          }
        ],
        yAxis: [
          {
            type: 'value',
            name: '就业',
            min: 0,
            max: 50,
            interval: 10,
            axisLabel: {
              formatter: '{value} 人'
            }
          },
          {
            type: 'value',
            name: '就业率&升学率',
            min: 0,
            max: 100,
            interval: 20,
            axisLabel: {
              formatter: '{value} %'
            }
          }
        ],

        series: [
          {
            name: '对口就业',
            type: 'bar',
            barWidth: '12%',
            tooltip: {
              valueFormatter: function (value) {
                return value + ' 人';
              }
            },
            data: duiKou
          },
          {
            name: '非对口就业',
            type: 'bar',
            barWidth: '12%',
            tooltip: {
              valueFormatter: function (value) {
                return value + ' 人';
              }
            },
            data: feiDuiKou
          },
          {
            name: '升学率',
            type: 'line',
            yAxisIndex: 1,
            smooth: true,
            tooltip: {
              valueFormatter: function (value) {
                return value + ' %';
              }
            },
            data: shengXueLv
          },
          {
            name: '就业率',
            type: 'line',
            yAxisIndex: 1,
            smooth: true,
            tooltip: {
              valueFormatter: function (value) {
                return value + ' %';
              }
            },
            data: jiuYeLv
          },
          {
            name: '升学',
            type: 'bar',
            barWidth: '12%',
            tooltip: {
              valueFormatter: function (value) {
                return value + ' 人';
              }
            },
            data: shengXue
          },
          {
            name: '考公',
            type: 'bar',
            barWidth: '12%',
            tooltip: {
              valueFormatter: function (value) {
                return value + ' 人';
              }
            },
            data: kaoGong
          },
          {
            name: '参军',
            type: 'bar',
            barWidth: '12%',

            tooltip: {
              valueFormatter: function (value) {
                return value + ' 人';
              }
            },
            data: canJun
          },
          {
            name: '创业',
            type: 'bar',
            barWidth: '12%',
            tooltip: {
              valueFormatter: function (value) {
                return value + ' 人';
              }
            },
            data: chuangYe
          },
        ]
      };
      option && myChart.setOption(option);
    }
  },
}
</script>
<style scoped>
.data {
  margin: 0 auto;
  width: 100%;
  height: 420px;

}
.shixiData_get{
  margin-top: 30px;
  padding: 20px 0
}

.shiXiTabs {
  width: 90%;
  margin: 0 auto;
}

.shiXiAndJiuYe_main {
  box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04);
  border-radius: 10px;
  
}
</style>