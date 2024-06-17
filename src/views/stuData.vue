<template>
    <div>
        <div style="margin-top: 20px;">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>统计分析</el-breadcrumb-item>
                <el-breadcrumb-item>学生数据</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="stuData_box">
            <div class="stuData_get">
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
            <el-empty :image-size="200" v-show="show" class="data"></el-empty>
            <div class="data" id="data" style="width: 100%;" v-if="show == false">

            </div>
        </div>
    </div>
</template>
<script>
import * as echarts from 'echarts';
import axios from "axios";
export default {
    data() {
        return {
            options: [],
            options2: [],
            SpecialityOptions: [],
            zhuanYeValue: '',
            value: '',
            input: '',
            value2: '',
            classData: [],
            stuNum: [],
            show: 'ok',
            loading: false,
            page: {
                page: 1,
                total: 0, //
                pageSize: 5,//显示的数量
            },
        }
    },

    mounted() {
        //this.init();
        this.getCollegeData();
        this.getGradeData();
        this.getSpeciality();
        this.jwt();
        // this.getClassData();
        //this.getData();
    },
    methods: {

        handleRefresh() {
            this.show = true
            this.value = '',
                this.value2 = ''
        },
        handleSelect() {
            this.loading = true
            this.stuNum = [];
            this.classData = []
            this.$nextTick(() => { // 在下一个DOM更新周期之后执行
                //this.select = true; // 将 select 状态设置为 true
                this.loading = true;
            });
            this.getClassName()

        },
        handelCollege(data) {
            this.SpecialityOptions = [],
                this.zhuanYeValue = ''
            this.getSpeciality(data);
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
        //获取班级和学生数量
        getClassName() {
            axios.get("/main/selectClassVto", {
                params: {
                    specialityName: this.zhuanYeValue,
                    collegeName: this.value,
                    gradeName: this.value2,
                    ClassName: this.input,
                }
            }).then(async res => {
                //console.log(res, 'res')
                this.page.total = res.data.data.total
                let data = res.data.data.rows;
                // console.log(data)
                if (res.data.data.total != 0) {
                    //this.classData = res.data.data.rows
                    this.show = false
                    for (let i = 0; i < data.length; i++) {
                        const element = data[i].className;
                        let stuNum = await this.getData(element)
                        this.stuNum.push(stuNum.data.data)
                        //console.log(stuNum.data.data)
                        // this.classData[i].count = stuNum.data.data
                        this.classData.push(element);

                    }
                    //console.log(this.classData,this.stuNum)

                    this.init(this.classData, this.stuNum);
                    this.loading = false
                } else {
                    this.show = true
                }
                this.loading = false
            })

            //  this.show = true
            this.loading = false
        },
        // getClassData(college, grade) {

        //     console.log(college, grade)
        //     axios.get("/main/selectClass?collegeName=" + college + '&gradeName=' + grade).then(async res => {

        //         if (res.data.data.length != 0) {
        //             console.log(res)
        //             const data = res.data.data
        //             for (let index = 0; index < data.length; index++) {
        //                 const element = data[index].className;
        //                 //console.log(await this.getData(element))
        //                 let num = await this.getData(element)
        //                 console.log(num)
        //                 this.stuNum.push(num.data.data)
        //                 this.classData.push(element);
        //                 this.show = false
        //             }


        //             // console.log(this.classData)
        //             // console.log('yb', await this.getData(this.classData))
        //             this.init(this.classData, this.stuNum);
        //         } else {
        //             this.show = 'ok';
        //         }
        //     })

        // },
        //根据班级获取学生数量
        handelCollege(data) {
            this.SpecialityOptions = [],
                this.zhuanYeValue = ''
            this.getSpeciality(data);
        },
        getData(data) {
            return axios.get("/main/selectStudentCount?className=" + data)
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
        //可视化
        init(cData, sData) {
            var chartDom = document.getElementById('data');
            var myChart = echarts.init(chartDom);
            var option;
            option = {
                color: ['#c23531', '#2f4554', '#61a0a8'],
                xAxis: {
                    type: 'category',
                    data: cData
                    // ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
                },
                yAxis: {
                    type: 'value',
                    min: 0,
                    max: 50,
                    interval: 10,
                },
                tooltip: {
                    show: true,
                    formatter: '{b0}: {c0}<br />'
                },
                series: [
                    {
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
                        // [120, 200, 150, 80, 70]
                        data: sData,
                        type: 'bar',
                        barWidth: '30%',

                    }
                ]
            };

            option && myChart.setOption(option);
        }
    },
}
</script>
<style scoped>
.stuData_get {
    margin-top: 30px;
    padding: 20px;
}

.data {
    margin: 35px auto;
    width: 100%;
    height: 400px;
}
::v-deep .demo-form-inline{
    margin-left: 0;
    float: left;
}

.stuData_box {
    box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04);
    border-radius: 10px;
}
</style>