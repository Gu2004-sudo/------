<template>
    <div>
        <div style="margin-top: 20px;">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>业务管理</el-breadcrumb-item>
                <el-breadcrumb-item>学生管理</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div style="float: left;margin-top: 40px;">
            <el-form :inline="true" class="demo-form-inline">

                <el-form-item label="学生姓名">
                    <el-input v-model="key" placeholder="学生姓名"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="onSubmit">查询</el-button>
                    <el-button type="success" icon="el-icon-edit" @click="dialogFormVisible = true">新增</el-button>
                    <el-button type="primary" @click="exportTableData()">导出<i class="el-icon-top"></i></el-button>
                    <el-upload action="/main/beforeUpload" style="display: inline-block;padding-left: 10px;"
                        :show-file-list="false" :on-success="beforeUpload">
                        <el-button type="warning">导入<i class="el-icon-download"></i></el-button>
                    </el-upload>
                </el-form-item>
            </el-form>
        </div>
        <div class="tab">
            <template>
                <el-table :data="tableData" style="width: 100%">
                    <el-table-column type="index" label="序号" width="100">
                    </el-table-column>
                    <el-table-column prop="studentName" label="姓名" width="120">
                    </el-table-column>
                    <el-table-column prop="studentAge" label="年龄" width="120">
                    </el-table-column>
                    <el-table-column prop="studentSex" label="性别" width="120">
                    </el-table-column>
                    <el-table-column prop="idcard" label="身份证号" width="180">
                    </el-table-column>
                    <el-table-column prop="address" label="地址" width="180">
                    </el-table-column>
                    <el-table-column prop="phone" label="联系方式" width="180">
                    </el-table-column>
                    <el-table-column label="操作">
                        <template slot-scope="scope">
                            <el-link type="primary" :underline="false" style="margin-right: 10px;"
                                @click="showUpdate(scope.row.studentNo)">修改</el-link>

                            <el-popconfirm title="确定要删除该学生吗？该操作无法撤销" @confirm="handleRemove(scope.row.studentNo)">
                                <el-link type="primary" :underline="false" slot="reference">删除</el-link>
                            </el-popconfirm>
                        </template>
                    </el-table-column>
                </el-table>
            </template>
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                :current-page.sync="currentPage" :page-sizes="[5, 10, 15, 20]" :page-size="this.page.pageSize"
                layout="sizes, prev, pager, next" :total="page.total">
            </el-pagination>
        </div>
        <el-dialog title="添加学生信息" :visible.sync="dialogFormVisible" width="400px">
            <el-form :model="form" label-width="80px">
                <el-form-item label="学号" style="width: 350px;">
                    <el-input v-model="form.studentNo"></el-input>
                </el-form-item>
                <el-form-item label="姓名" style="width: 350px;">
                    <el-input v-model="form.studentName"></el-input>
                </el-form-item>
                <el-form-item label="年龄" style="width: 350px;">
                    <el-input v-model="form.studentAge"></el-input>
                </el-form-item>
                <el-form-item label="性别" style="width: 350px;">
                    <el-radio v-model="form.studentSex" label="男">男</el-radio>
                    <el-radio v-model="form.studentSex" label="女">女</el-radio>
                </el-form-item>
                <el-form-item label="身份证号" style="width: 350px;">
                    <el-input v-model="form.idcard"></el-input>
                </el-form-item>
                <el-form-item label="地址" style="width: 350px;">
                    <el-input v-model="form.address"></el-input>
                </el-form-item>
                <el-form-item label="入学日期" style="width: 350px;">
                    <el-date-picker v-model="form.enrolTime" type="date" placeholder="选择入学日期" style="width: 100%;"
                        format="yyyy-MM-dd" value-format="yyyy-MM-dd">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="毕业日期" style="width: 350px;">
                    <el-date-picker v-model="form.graduateTime" type="date" placeholder="选择毕业日期" style="width: 100%;"
                        format="yyyy-MM-dd" value-format="yyyy-MM-dd">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="联系方式" style="width: 350px;">
                    <el-input v-model="form.phone"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="handleAdd()">确 定</el-button>
            </div>
        </el-dialog>
        <el-dialog title="修改学生信息" :visible.sync="dialogFormVisibleUpdate" width="400px">
            <el-form :model="updateForm" label-width="80px">
                <el-form-item label="姓名" style="width: 350px;">
                    <el-input v-model="updateForm.studentName"></el-input>
                </el-form-item>
                <el-form-item label="年龄" style="width: 350px;">
                    <el-input v-model="updateForm.studentAge"></el-input>
                </el-form-item>
                <el-form-item label="性别" style="width: 350px;">
                    <el-input v-model="updateForm.studentSex"></el-input>
                </el-form-item>
                <el-form-item label="身份证号" style="width: 350px;">
                    <el-input v-model="updateForm.idcard"></el-input>
                </el-form-item>
                <el-form-item label="地址" style="width: 350px;">
                    <el-input v-model="updateForm.address"></el-input>
                </el-form-item>
                <el-form-item label="联系方式" style="width: 350px;">
                    <el-input v-model="updateForm.phone"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="handleUpdate()">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import axios from "axios";
import * as XLSX from 'xlsx';
export default {
    data() {
        return {
            dialogFormVisible: false,
            dialogFormVisibleUpdate: false,
            updateForm: [],
            // 数据属性
            form: {
                studentNo: '',
                studentName: '',
                studentAge: '',
                studentSex: '男',
                idcard: '',
                address: '',
                phone: '',
                enrolTime: '',
                graduateTime: '',
                classID: '',
                collegeID: '',
                gradeID: '',
                specialityID: '',
            },
            page: {
                page: 1,
                total: 0, //
                pageSize: 5,//显示的数量
            },
            currentPage: 1,
            key: '',
            className: '',
            tableData: [],
        }
    },
    mounted() {
        this.className = this.$route.query.className
        this.form.classID = this.$route.query.classID
        this.form.collegeID = this.$route.query.collegeID
        this.form.gradeID = this.$route.query.gradeID
        this.form.specialityID = this.$route.query.specialityID
        this.getStuData(this.page);
        this.jwt()
    },
    methods: {
        beforeUpload(res) {
            console.log(res.data)
            this.getStuData(this.page);
        },
        exportTableData() {
            axios.get("/main/selectStudentByClassName", { params: { className: this.className } }).then(res => {
                // 创建一个工作簿对象
                const workbook = XLSX.utils.book_new();
                // 将表格数据转换为工作表对象
                const worksheet1 = XLSX.utils.json_to_sheet(res.data.data.rows);
                // 将工作表添加到工作簿中
                XLSX.utils.book_append_sheet(workbook, worksheet1, 'Sheet1');
                // 导出工作簿为二进制数据
                const wbout = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
                // 创建一个Blob对象
                const blob = new Blob([wbout], { type: 'application/octet-stream' });
                // 创建一个下载链接
                const link = document.createElement('a');
                link.href = URL.createObjectURL(blob);
                link.download = 'Test.xls';
                // 触发下载
                link.click();

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
        handleAdd() {
            console.log(this.form)
            axios.post("/main/insertStudent", this.form).then(res => {
                this.$notify({
                    title: '成功',
                    message: '添加成功',
                    type: 'success',
                    offset: 100
                });
                this.form = {
                    ...this.form,
                    studentNo: '',
                    studentName: '',
                    studentAge: '',
                    studentSex: '男',
                    idcard: '',
                    address: '',
                    phone: '',
                    enrolTime: '',
                    graduateTime: '',

                }
                this.dialogFormVisible = false
            }).catch(err => {
                this.$notify.error({
                    title: '失败',
                    message: '添加失败,请检查学号是否重复',
                    type: 'error',
                    offset: 100
                });
            });

        },
        handleSizeChange(val) {
            this.page.pageSize = val;
            console.log(`每页 ${val} 条`);
            if (this.key == '')
                this.getStuData(this.page);
            else
                this.getStuBykey();
        },
        handleCurrentChange(val) {
            this.page.page = val;
            console.log(`当前页: ${val}`);
            if (this.key == '')
                this.getStuData(this.page);
            else
                this.getStuBykey();
        },
        showUpdate(id) {
            // console.log(id)
            axios.get("/main/selectStudent?studentNo=" + id).then(res => {
                console.log(res)
                this.updateForm = res.data.data.rows[0];
                this.dialogFormVisibleUpdate = true;
            })
        },
        handleUpdate() {
            console.log(this.updateForm)
            axios.put("/main/updateStudent", this.updateForm).then(res => {
                this.$notify({
                    title: '成功',
                    message: '更新成功',
                    type: 'success',
                    offset: 100
                });
                this.dialogFormVisibleUpdate = false;
                this.getStuData(this.page)
            })
        },
        handleRemove(id) {
            axios.delete("/main/deleteStudent/" + id).then(res => {
                this.$notify({
                    title: '成功',
                    message: '删除成功',
                    type: 'success',
                    offset: 100
                });
                this.getStuData(this.page)
                //console.log(res)
            })

        },
        onSubmit() {
            // console.log('submit!');
            this.page = {
                page: 1,
                total: 0, //
                pageSize: 5,//显示的数量
            }
            this.getStuBykey();
        },
        getStuBykey() {
            axios.get("/main/selectStudent?studentName=" + this.key + "&page=" + this.page.page + "&court=" + this.page.pageSize + "&className=" + this.className).then(res => {
                console.log(res)
                this.page.total = res.data.data.total
                this.tableData = res.data.data.rows;

            })
        },
        getStuData(page) {
            console.log(page)
            axios.get("/main/selectStudentByClassName?className=" + this.className + "&page=" + this.page.page + "&court=" + this.page.pageSize).then(res => {
                console.log(this.className, 'className')
                this.tableData = res.data.data.rows;
                console.log(res)
                this.page.total = res.data.data.total
                // let data = res.data.data
                // for (let i = 0; i < data.length; i++) {
                //     const element = data[i];
                // }
            })
        }
    },

}
</script>