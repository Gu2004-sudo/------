<template>
    <div>
        <div style="margin-top: 20px;">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>基础数据</el-breadcrumb-item>
                <el-breadcrumb-item>班级管理</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="classManagement_main">
            <div
                style="display: flex;justify-content: center;align-items: center;line-height: 80px;padding-left: 20px; height: 80px;">
                <label class="select_label"><span
                        style="font-size: 16px;font-weight: bold;margin-right: 10px;">学院</span><el-select
                        v-model="value" filterable placeholder="请选择院校" clearable style="width: 200px;height: 15px;"
                        @change="handelCollege($event)">
                        <!-- <div slot="empty" style="text-align: left;">请先选择学院</div> -->
                        <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.label">
                        </el-option>
                    </el-select>
                </label>
                <label class="select_label">
                    <span style="font-size: 16px;font-weight: bold;margin-right: 10px;">专业</span><el-select
                        v-model="zhuanYeValue" filterable placeholder="请选择专业" clearable
                        style="width: 200px;height: 15px;margin-right: 10px;">
                        <div slot="empty" style="margin: 10px;text-align: center;color: gray;">{{ value == '' ?
                            '请先选择学院' : '暂无专业' }}</div>
                        <el-option v-for="item in SpecialityOptions" :key="item.zhuanYeValue" :label="item.label"
                            :value="item.label">
                        </el-option>
                    </el-select>
                </label>
                <label class="select_label">
                    <span style="font-size: 16px;font-weight: bold;margin-right: 10px;">年级</span><el-select
                        v-model="value2" filterable placeholder="请选择年级" clearable
                        style="width: 200px;height: 15px;margin-right: 10px;">
                        <el-option v-for="item in options2" :key="item.value2" :label="item.label" :value="item.label">
                        </el-option>
                    </el-select>
                </label>
                <label class="select_label">
                    <span style="font-size: 16px;font-weight: bold;margin-right: 10px;">班级</span>
                    <el-input placeholder="请输入班级" v-model="input" clearable style="width: 200px;"></el-input>
                </label>
                <div class="select_label">
                    <el-button type="primary" icon="el-icon-search" @click="handleSelect()" :loading="loading">{{
                            loading ==
                                true
                                ? '加载中' : '搜索' }}</el-button>
                    <el-button type="info" icon="el-icon-refresh" @click="handleRefresh()">重置</el-button>
                </div>

            </div>
            <div>

            </div>
            <div style="margin-top: 10px;height: 40px;margin-bottom: 10px;">
                <el-button type="success" icon="el-icon-edit" @click="dialogFormVisible = true"
                    style="float: left;margin-left: 60px;">新增</el-button>
            </div>

            <div class="tab" v-show=show>
                <el-empty :image-size="200" style="width: 100%;"></el-empty>
            </div>
            <div class="tab" v-if="show == false">
                <el-table :data="classData" style="width: 100%">
                    <el-table-column prop="className" label="班级名称" width="180">
                    </el-table-column>
                    <el-table-column prop="cultivationCycle" label="培养周期" width="180">
                    </el-table-column>
                    <el-table-column prop="specialityName" label="专业名称">
                    </el-table-column>
                    <el-table-column prop="count" label="学生人数">
                    </el-table-column>
                    <el-table-column label="操作">
                        <template slot-scope="scope">
                            <el-link type="primary" :underline="false" style="margin-right: 10px;"
                                @click="showDialog(scope.row.classID)">修改</el-link>

                            <el-popconfirm title="确定要删除该班级吗？该操作无法撤销" @confirm="handleRemove(scope.row.classID)">
                                <el-link type="primary" :underline="false" style="margin-right: 10px;"
                                    slot="reference">删除</el-link>
                            </el-popconfirm>
                            <el-link type="primary" v-if="scope.row.teacherNO == null" :underline="false"
                                slot="reference" @click="showTeacher(scope.row.classID)">添加辅导员</el-link>
                        </template>

                    </el-table-column>
                </el-table>
                <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                    :current-page.sync="currentPage" :page-sizes="[5, 10, 15, 20]" :page-size="this.page.pageSize"
                    layout="sizes, prev, pager, next" :total="page.total">
                </el-pagination>
            </div>
        </div>
        <el-dialog title="修改班级" :visible.sync="dialogFormVisibleUpdate">
            <el-form :model="updateForm" label-position="right">
                <label>
                    <span
                        style="font-size: 16px;font-weight: bold;margin-left: 40px;margin-right: 10px;">学院</span><el-select
                        v-model="updateForm.collegeID" placeholder="请选择院校"
                        style="width: 300px;height: 15px;margin-right: 10px;margin-bottom: 40px;">
                        <el-option v-for="item in options" :key="item.label" :label="item.label" :value="item.value">
                        </el-option>
                    </el-select>
                </label>
                <br>
                <label>
                    <span
                        style="font-size: 16px;font-weight: bold;margin-left: 40px;margin-right: 10px;">年级</span><el-select
                        v-model="updateForm.gradeID" placeholder="请选择年级"
                        style="width: 300px;height: 15px;margin-right: 10px;margin-bottom: 40px;">
                        <el-option v-for="item in options2" :key="item.value2" :label="item.label" :value="item.value2">
                        </el-option>
                    </el-select>
                </label>
                <br>
                <label>
                    <span
                        style="font-size: 16px;font-weight: bold;margin-left: 40px;margin-right: 10px;">专业</span><el-select
                        v-model="updateForm.specialityID" placeholder="请选择专业"
                        style="width: 300px;height: 15px;margin-right: 10px;margin-bottom: 40px;">
                        <el-option v-for="item in SpecialityOptions" :key="item.zhuanYeValue" :label="item.label"
                            :value="item.zhuanYeValue">
                        </el-option>
                    </el-select>
                </label>
                <br>
                <label>
                    <span
                        style="font-size: 16px;font-weight: bold;margin-left: 40px;margin-right: 10px;">周期</span><el-select
                        v-model="updateForm.cultivationCycle" placeholder="请选择周期"
                        style="width: 300px;height: 15px;margin-right: 10px;margin-bottom: 40px;">
                        <el-option value="2年">
                            2年
                        </el-option>
                        <el-option value="3年">
                            3年
                        </el-option>
                        <el-option value="4年">
                            4年
                        </el-option>
                    </el-select>
                </label>
                <br>

                <label style="margin-left: 35px;"><span
                        style="font-size: 16px;font-weight: bold;margin-right: 10px;">班级名称</span><el-input
                        v-model="updateForm.className" style="width: 300px;margin-right: 40px;"></el-input></label>

            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisibleUpdate = false">取 消</el-button>
                <el-button type="primary" @click="handleUpdate(updateForm.classID)">确 定</el-button>
            </div>
        </el-dialog>
        <el-dialog title="新增班级" :visible.sync="dialogFormVisible">
            <el-form :model="form">
                <span style="font-size: 16px;font-weight: bold;margin-right: 10px;">学院</span><el-select
                    v-model="form.value" placeholder="请选择院校"
                    style="width: 300px;height: 15px;margin-right: 10px;margin-bottom: 40px;">
                    <el-option v-for="item in options" :key="item.label" :label="item.label" :value="item.value">
                    </el-option>
                </el-select><br>
                <span style="font-size: 16px;font-weight: bold;margin-right: 10px;">年级</span><el-select
                    v-model="form.value2" placeholder="请选择年级"
                    style="width: 300px;height: 15px;margin-right: 10px;margin-bottom: 40px;">
                    <el-option v-for="item in options2" :key="item.value2" :label="item.label" :value="item.value2">
                    </el-option>
                </el-select><br>
                <span style="font-size: 16px;font-weight: bold;margin-right: 10px;">专业</span><el-select
                    v-model="form.zhuanYeValue" placeholder="请选择专业"
                    style="width: 300px;height: 15px;margin-right: 10px;margin-bottom: 40px;">
                    <el-option v-for="item in SpecialityOptions" :key="item.zhuanYeValue" :label="item.label"
                        :value="item.zhuanYeValue">
                    </el-option>
                </el-select><br>
                <span style="font-size: 16px;font-weight: bold;margin-right: 10px;">周期</span><el-select
                    v-model="form.peiYangValue" placeholder="请选择周期"
                    style="width: 300px;height: 15px;margin-right: 10px;margin-bottom: 40px;">
                    <el-option value="2年">
                        2年
                    </el-option>
                    <el-option value="3年">
                        3年
                    </el-option>
                    <el-option value="4年">
                        4年
                    </el-option>
                </el-select><br>
                <span style="font-size: 16px;font-weight: bold;margin-right: 10px;">班级名称</span>
                <el-input v-model="form.className" style="width: 300px;margin-right: 40px;"></el-input>

            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="handleAdd()">确 定</el-button>
            </div>
        </el-dialog>
        <el-dialog title="提示" :visible.sync="dialogVisible" width="30%" :before-close="handleClose">
            <span>请选择辅导员：</span>
            <el-select v-model="teacherValue" filterable placeholder="请选择">
                <el-option v-for="item in teacherList" :key="item.teacherID" :label="item.teacherName"
                    :value="item.teacherID">
                </el-option>
            </el-select>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="addTeacher">确 定</el-button>
            </span>
        </el-dialog>

    </div>
</template>
<script>
import axios from "axios";
export default {
    data() {
        return {
            teacherValue: '',
            dialogVisible: false,
            dialogFormVisible: false,
            dialogFormVisibleUpdate: false,
            options: [],
            options2: [],
            SpecialityOptions: [],
            zhuanYeValue: '',
            value: '',
            input: '',
            value2: '',
            form: {
                value: '',
                value2: '',
                className: '',
                zhuanYeValue: '',
                peiYangValue: '',
            },
            updateForm: {
                classID: '',
                className: '',
                collegeID: '',
                cultivationCycle: '',
                gradeID: '',
                specialityID: '',
            },
            loading: false,
            page: {
                page: 1,
                total: 0, //
                pageSize: 5,//显示的数量
            },
            formLabelWidth: '120px',
            show: true,
            currentPage: 1,
            classData: [],
            teacherList: [],
            classID: '',
        }
    },
    mounted() {
        this.getCollegeData()
        this.getGradeData()
        // this.getSpeciality()
        this.jwt()
    },
    created() {
        this.getTeacher();
    },
    methods: {
        addTeacher() {
            this.dialogVisible = false;
            const data = {
                teacherID: parseInt(this.teacherValue),
                classID: parseInt(this.classID)
            }
            console.log(data,"up")
            axios.post("/main/editTeacher", JSON.stringify(data), {
                headers: {
                    'Content-Type': 'application/json',
                }
            }).then(res => {
                this.$message({
                    message: '操作成功',
                    type: 'success'
                });
            })
            this.teacherValue='',
            this.teacherList=[];
            this.getTeacher();
            this.getClassName()
        },
        showTeacher(id) {
            this.dialogVisible = true;
            this.classID = id;
        },
        getTeacher() {
            axios.get("/main/getTeacher").then(res => {
                this.teacherList = res.data.data;

            })
        },
        handelCollege(data) {
            this.SpecialityOptions = [],
                this.zhuanYeValue = ''
            this.getSpeciality(data);
        },
        handleUpdate(id) {
            axios.put("/main/updateClass", JSON.stringify(this.updateForm),
                { headers: { 'Content-Type': 'application/json' } }).then(res => {
                    this.$notify({
                        title: '成功',
                        message: '修改成功',
                        type: 'success',
                        offset: 100
                    });
                    this.loading = true;
                    this.getClassName();
                    this.dialogFormVisibleUpdate = false

                })
        },
        showDialog(id) {
            // axios.get("/main/selectClassByID?classID=" + id).then(res => {
            axios.get("/main/selectClassByID", {
                params: {
                    classID: id
                }
            }).then(res => {
                console.log(res)
                this.updateForm = res.data.data
                this.dialogFormVisibleUpdate = true
            })
        },
        handleRemove(id) {
            axios.get("/main/selectClassByID", {
                params: {
                    classID: id
                }
            }).then(res => {
                this.$notify({
                    title: '成功',
                    message: '删除成功',
                    type: 'success',
                    offset: 100
                });
                this.getClassName()
                //console.log(res)
            })

        },
        handleAdd() {
            console.log(this.form)
            var add = {
                collegeID: this.form.value,
                specialityID: this.form.zhuanYeValue,
                gradeID: this.form.value2,
                cultivationCycle: this.form.peiYangValue,
                className: this.form.className,
            }
            axios.post("/main/insertClass", JSON.stringify(add),
                { headers: { 'Content-Type': 'application/json' } }).then(res => {
                    if (res.data.data) {
                        this.$notify({
                            title: '成功',
                            message: '添加成功',
                            type: 'success',
                            offset: 100
                        });
                        this.dialogFormVisible = false
                        this.form = {
                            value: '',
                            value2: '',
                            className: '',
                            zhuanYeValue: '',
                            peiYangValue: '',
                        }
                        this.getClassName()
                    } else {
                        this.$notify.error({
                            title: '错误',
                            message: '添加失败',
                            offset: 100
                        });
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
        handleSizeChange(val) {
            this.page.pageSize = val;
            console.log(`每页 ${val} 条`);
            this.getClassName();
        },
        handleCurrentChange(val) {
            this.page.page = val;
            console.log(`当前页: ${val}`);
            this.getClassName();
            // this.getPage();
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
        //查询班级信息
        getClassName() {
            let data = {
                specialityName: this.zhuanYeValue,
                collegeName: this.value,
                gradeName: this.value2,
                ClassName: this.input,
            }

            // axios.get("/main/selectClassVto?specialityName=" + this.zhuanYeValue + "&collegeName=" + this.value + "&gradeName=" + this.value2 + "&ClassName=" + this.input + "&page=" + this.page.page + "&court=" + this.page.pageSize).then(async res => {
            axios.get("/main/selectClassVto", {
                params: {
                    specialityName: this.zhuanYeValue,
                    collegeName: this.value,
                    gradeName: this.value2,
                    ClassName: this.input,
                    page: this.page.page,
                    court: this.page.pageSize
                }
            }).then(async res => {
                // console.log(res)
                this.page.total = res.data.data.total
                let data = res.data.data.rows;
                console.log(data, "res")
                if (res.data.data.total != 0) {
                    this.classData = res.data.data.rows
                    for (let i = 0; i < data.length; i++) {
                        const element = data[i].className;
                        let stuNum = await this.getStuNum(element)
                        //console.log(stuNum.data.data)
                        this.classData[i].count = stuNum.data.data
                    }
                    this.show = false

                } else {
                    this.show = true
                }

            })

            //  this.show = true
            this.loading = false
        },
        //获取学生人数
        getStuNum(className) {
            return axios.get("/main/selectStudentCount", { params: { className: className } })

        },
        //查询按钮
        handleSelect() {
            this.loading = true
            this.page = {
                page: 1,
                total: 0, //
                pageSize: 5,//显示的数量
            }
            this.getClassName();

        },
        handleRefresh() {
            this.show = true
            this.value = '',
                this.value2 = ''
            this.page = {
                page: 1,
                total: 0, //
                pageSize: 5,//显示的数量
            }
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
.classManagement_main {
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    border-radius: 10px;
    margin-top: 30px;
    padding: 20px;
}

.tab {

    padding: 10px 20px 20px 20px
}

.demo-table-expand {
    font-size: 0;
}

.demo-table-expand label {
    width: 90px;
    color: #99a9bf;
}

.demo-table-expand .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    width: 50%;
}
</style>