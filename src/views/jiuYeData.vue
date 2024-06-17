<template>
    <div>
        <div style="margin-top: 20px;">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>统计分析</el-breadcrumb-item>
                <el-breadcrumb-item>学生数据</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div style="float: left;width: 83%; margin: 30px auto;">
            <span style="font-size: 16px;font-weight: bold;margin-right: 10px;">学院</span><el-select v-model="value"
                placeholder="请选择院校" style="width: 300px;height: 15px;margin-right: 10px;">
                <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
            </el-select>
            <span style="font-size: 16px;font-weight: bold;margin-right: 10px;">年级</span><el-select v-model="value2"
                placeholder="请选择年级" style="width: 300px;height: 15px;margin-right: 10px;">
                <el-option v-for="item in options2" :key="item.value2" :label="item.label" :value="item.value2">
                </el-option>
            </el-select>
            <el-button type="primary" icon="el-icon-search">搜索</el-button>
            <el-button type="info" icon="el-icon-refresh">重置</el-button>
        </div>
        <div class="data" id="data" style="width: 80%;">

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
            value: '',
            value2: '',
        }
    },

    mounted() {
        this.init();
        this.getCollegeData();
        this.getGradeData();
        this.jwt()
    },
    methods: {
        getCollegeData() {
            axios.get("/main/selectCollege").then(res => {
                //console.log(res)
                const data = res.data.data
                for (let index = 0; index < data.length; index++) {
                    const element = data[index].collegeName;
                    //console.log(element)
                    this.options.push({
                        value: '选项' + (index + 1),
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
        getGradeData() {
            axios.get("/main/selectGrade").then(res => {
                //console.log(res)
                const data = res.data.data
                for (let index = 0; index < data.length; index++) {
                    const element = data[index].gradeName;
                    // console.log(element)
                    this.options2.push({
                        value2: '选项' + (index + 1),
                        label: element
                    })
                }
            })
        },
        init() {
            var chartDom = document.getElementById('data');
            var myChart = echarts.init(chartDom);
            var option;

            option = {
                legend: {},
                tooltip: {},
                dataset: {
                    source: [
                        ['product', '2015', '2016', '2017', '2018', '2019'],
                        ['Matcha Latte', 43.3, 85.8, 93.7, 66, 77],
                        ['Milk Tea', 83.1, 73.4, 55.1],
                        ['Cheese Cocoa', 86.4, 65.2, 82.5],
                        ['Walnut Brownie', 72.4, 53.9, 39.1]
                    ]
                },
                xAxis: { type: 'category' },
                yAxis: {},
                // Declare several bar series, each will be mapped
                // to a column of dataset.source by default.
                series: [{
                    type: 'bar', barWidth: '10%', itemStyle: {
                        normal: {
                            barBorderRadius: [50, 50, 0, 0]
                        }
                    },
                }, {
                    type: 'bar', barWidth: '10%', itemStyle: {
                        normal: {
                            barBorderRadius: [50, 50, 0, 0]
                        }
                    },
                }, {
                    type: 'bar', barWidth: '10%', itemStyle: {
                        normal: {
                            barBorderRadius: [50, 50, 0, 0]
                        }
                    },
                }, {
                    type: 'bar', barWidth: '10%', itemStyle: {
                        normal: {
                            barBorderRadius: [50, 50, 0, 0]
                        }
                    },
                }, {
                    type: 'bar', barWidth: '10%', itemStyle: {
                        normal: {
                            barBorderRadius: [50, 50, 0, 0]
                        }
                    },
                }]
            };
            option && myChart.setOption(option);
        }
    },
}
</script>
<style scoped>
.data {

    margin: 120px auto;
    width: 80%;
    height: 420px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04)
}
</style>