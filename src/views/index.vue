<template>
    <div>
        <div class="index_main">
            <div class="index_get">
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
                        <el-button type="primary" icon="el-icon-search" @click="getData()" :loading="loading">{{
                    loading ==
                        true
                        ? '加载中' : '搜索' }}</el-button>
                    </el-form-item>
                </el-form>
            </div>
            <div class="index_Data">
                <el-tabs v-model="tabValue" style="height: 400px;box-shadow:none" @tab-click="handleTabClick(tabValue)">
                    <el-empty :image-size="200" v-show="show"></el-empty>
                    <el-tab-pane v-for="(item, index) in tabData" :key="index" :label=item :name=item>
                        <el-table :data="tableData" style="width: 100%">
                            <el-table-column prop="className" label="班级名称" width="180">
                            </el-table-column>
                            <el-table-column prop="gradeName" label="年级" width="180">
                            </el-table-column>
                            <el-table-column prop="specialityName" label="专业">
                            </el-table-column>
                            <el-table-column prop="cultivationCycle" label="周期">
                            </el-table-column>
                            <el-table-column label="操作">
                                <template slot-scope="scope">
                                    <el-link :underline="false" type="primary" style="margin-right: 15px;"
                                        @click="handelPractice(scope.row)">实习就业</el-link>
                                    <el-link :underline="false" type="primary"
                                        @click="handleStu(scope.row)">学生管理</el-link>
                                </template>
                            </el-table-column>
                        </el-table>

                    </el-tab-pane>
                    <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                        :current-page.sync="currentPage" :page-size="this.page.pageSize" layout=" prev, pager, next"
                        :total="page.total" v-if="show != true">
                    </el-pagination>
                </el-tabs>
            </div>
        </div>
    </div>
</template>
<script>
import axios from "axios";
export default {
    data() {
        return {
            formInline: {
                user: '',
                region: ''
            },

            tableData: [],
            SpecialityOptions: [],
            zhuanYeValue: '',
            options: [],
            options2: [],
            value: '',
            value2: '',
            loading: false,
            show: true,
            input: '',
            tabData: '',
            tabValue: '',
            tempValue: '',
            page: {
                page: 1,
                total: 0, //
                pageSize: 5,//显示的数量
            },
            currentPage: 1,
        }
    },
    mounted() {
        this.getCollegeData();
        this.getGradeData();
        this.getData();
    },
    methods: {
        onSubmit() {
            console.log('submit!');
        },

        handelPractice(row) {
            this.$router.push({ path: '/main/shiXiAndJiuYe?className=' + row.className })
        },
        handleSizeChange(val) {
            this.page.pageSize = val;
            console.log(`每页 ${val} 条`);
            this.getData()
        },
        handleCurrentChange(val) {
            this.page.page = val;
            console.log(`当前页: ${val}`);
            this.getData()
            // this.getPage();
        },
        handleStu(row) {
            console.log(row)
            this.$router.push({ path: '/main/studentManagement', query: { className: row.className, classID: row.classID, collegeID: row.collegeID, cultivationCycle: row.cultivationCycle, gradeID: row.gradeID, specialityID: row.specialityID } });
        },
        handleTabClick(data) {
            if (this.tempValue != data) {
                this.page = {
                    page: 1,
                    pageSize: 5,
                    total: 0
                }
                this.tempValue = data;
                this.tabValue = data
            }
            let temp = {
                specialityName: this.zhuanYeValue,
                collegeName: this.value,
                gradeName: data,
                //ClassName: this.input,
            }
            //console.log(temp)
            let page = {
                page: this.page.page,
                court: this.page.pageSize
            }
            axios.get("/main/selectClassVto", {
                params: {
                    specialityName: this.zhuanYeValue,
                    collegeName: this.value,
                    gradeName: data,
                    ClassName: this.input,
                    page: this.page.page,
                    court: this.page.pageSize
                }
            }).then(res => {
                this.page.total = res.data.data.total
                this.tableData = res.data.data.rows
                console.log('g', res)
            })
            // console.log('tab', data)
        },
        handelCollege(data) {
            this.SpecialityOptions = [],
                this.zhuanYeValue = ''
            this.getSpeciality(data);
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
        //重置
        handleRefresh() {
            this.tabData = [];
            this.SpecialityOptions = [];
            this.zhuanYeValue = '';
            this.value = '';
            this.value2 = '';
            this.input = '';
            this.show = true;
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
        getGradeData() {
            axios.get("/main/selectGrade").then(res => {
                // console.log(res)
                const data = res.data.data
                for (let index = 0; index < data.length; index++) {
                    const element = data[index].gradeName;
                    //console.log(element)
                    this.options2.push({
                        value2: data[index].gradeID,
                        label: element
                    })
                }
            })
        },
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
        getData() {
            let page = {
                page: this.page.page,
                court: this.page.pageSize
            }
            let data = {
                specialityName: this.zhuanYeValue,
                collegeName: this.value,
                gradeName: this.value2,
                ClassName: this.input,
            }
            // if(this.tabValue!=''){
            //     data.gradeName=this.tabValue
            // }
            if (this.value2 != '') {
                this.tabValue = this.value2
            }
            // console.log(this.tabValue)

            axios.get("/main/selectClassVto", {
                params: {
                    specialityName: this.zhuanYeValue,
                    collegeName: this.value,
                    gradeName: this.value2,
                    ClassName: this.input,
                }
            }).then(res => {
                this.tabData = [];
                console.log('get', res);
                this.page.total = res.data.data.total
                let data = res.data.data.rows
                if (this.value2 != '')
                    this.tabData.push(this.value2)
                else {
                    // this.tabData = [];
                    for (let index = 0; index < data.length; index++) {
                        const element = data[index].gradeName;
                        if (this.tabData.indexOf(element) < 0)
                            this.tabData.push(element)
                    }
                }
                if (this.tabData.length == 0) {
                    this.show = true
                } else {
                    this.handleTabClick(this.tabData[0])
                    console.log(this.tabData[0], 'tab0')
                    this.show = false
                }

            })
        },
    },
}
</script>
<style scoped>
.select_label {
    float: left;
    margin-right: 20px;
}

.index_main {
    box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04);
    padding: 20px;
    border-radius: 10px;
}
</style>