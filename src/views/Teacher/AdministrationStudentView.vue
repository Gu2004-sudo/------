<template>
    <div>
        <div style="box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04);width: 100%;margin-top: 50px;">
            <label style="float: left;">学生姓名: <el-input placeholder="请输入内容" style="width: 220px;margin-right: 10px;"
                    v-model="stuName" clearable>
                </el-input></label>

            <el-button style="float: left;" type="primary">添加学生</el-button>
            <el-upload action="/main/beforeUpload" style="float: left;margin-left: 10px;" :show-file-list="false"
                :on-success="beforeUpload">
                <el-button type="warning" style="float: left;">导入<i class="el-icon-download"></i></el-button>
            </el-upload>
            <el-button type="primary" style="float: left;margin-left: 10px;" @click="selectStudentClassID()"
                icon="el-icon-search">搜索</el-button>
        </div>
        <el-table :data="tableData">
            <el-table-column type="index" width="50">
            </el-table-column>
            <el-table-column prop="studentName" label="姓名" width="120">
            </el-table-column>
            <el-table-column prop="studentSex" label="性别" width="140">
            </el-table-column>
            <el-table-column prop="studentAge" label="年龄" width="140">
            </el-table-column>
            <el-table-column prop="phone" label="联系方式" width="140">
            </el-table-column>
            <el-table-column label="文件信息" width="140">
                <template slot-scope="scope">
                    <span v-if="scope.row.fileSrc == ''">无</span>
                    <span v-else-if="scope.row.fileSrc != ''"><a @click="downloadFile(scope.row)">{{ scope.row.fileSrc
                    }}</a></span>
                </template>
            </el-table-column>
            <el-table-column prop="address" label="地址" width="140">
            </el-table-column>

            <el-table-column label="操作" width="170">
                <template slot-scope="scope">
                    <el-button @click="handleClick(scope.row)" type="text" style="margin:0 1px; "
                        size="small">查看</el-button>

                    <el-popconfirm title="这是一段内容确定删除吗？" @confirm="deleteStudent(scope.row)">
                        <el-button type="text" size="small" slot="reference">删除</el-button>
                    </el-popconfirm>
                    <el-link type="primary" style="margin:0 10px; font-size: 12px;"
                        @click="handleMonthly(scope.row.studentNo)">查看月报</el-link>
                </template>
            </el-table-column>
        </el-table>

        <el-dialog title="学生信息" :visible.sync="dialogFormVisible">


            <el-dialog width="80%" title="实习信息" :visible.sync="innerVisible" append-to-body>
                    <el-table :data="stuDate" border style="width: 100%">
                        <el-table-column label="公司名称" width="180">
                        <template slot-scope="scope">
                            <div v-for="compang in companyAll">
                                <span v-if="scope.row.companyID == compang.companyID">{{ compang.companyName }}</span>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column prop="postName" label="岗位名称">
                    </el-table-column>
                    <el-table-column prop="entryTime" label="入职日期" width="180">
                    </el-table-column>
                    <el-table-column prop="endTime" label="离职日期" width="180">
                        <template slot-scope="scope">
                            <span v-if="scope.row.endTime == ''">暂未辞职</span>
                            <span v-else>{{ scope.row.endTime }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="postResponsibility" label="岗位简介" width="180">
                        <template slot-scope="scope">
                            <span style=" white-space: nowrap;overflow: hidden;text-overflow: ellipsis;">{{
                                scope.row.postResponsibility }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="postSalary1" label="薪资" width="180">
                    </el-table-column>
                    <el-table-column prop="statu" label="实习状态" width="180">
                    </el-table-column>
                        <el-table-column fixed="right" label="操作" width="100">
                            <template slot-scope="scope">
                                <el-button @click="handleClick(scope.row)" type="text" size="small">查看</el-button>
                                <el-button type="text" size="small">编辑</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                
            </el-dialog>

            <el-form :model="form">
                <el-form-item label="姓名" :label-width="formLabelWidth">
                    <el-input v-model="form.studentName" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="性别" :label-width="formLabelWidth">
                    <el-input v-model="form.studentSex" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="年龄" :label-width="formLabelWidth">
                    <el-input v-model="form.studentAge" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="联系方式" :label-width="formLabelWidth">
                    <el-input v-model="form.phone" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="家庭地址" :label-width="formLabelWidth">
                    <el-input v-model="form.address" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item :label-width="formLabelWidth">
                    <template slot-scope="scope">
                        <el-link type="primary" @click.native="selectStudent(scope.row)">查看学生实习信息</el-link>
                    </template>
                    <!-- <el-link type="primary" @click.native="selectStudent">查看学生实习信息</el-link> -->
                </el-form-item>

            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="dialogFormVisible = false">确 定</el-button>
            </div>
        </el-dialog>

        <el-pagination style="float: right; padding-top: 15px;" @size-change="handleSizeChange"
            @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="[5, 10, 15, 20]" :page-size="100"
            layout="total, sizes, prev, pager, next, jumper" :total="total">
        </el-pagination>
    </div>
</template>

<script>
import axios from "axios";
export default {
    data() {
        return {
            stuName: '',
            tableData: [],
            teacher: '',
            stuDate: [],
            total: 1,
            currentPage: 1,
            dialogFormVisible: false,
            form: {
                studentName: '',
                studentAge: '',
                studentSex: '',
                phone: '',
                address: ''
            },
            formLabelWidth: '120px',
            page: '',
            pageSize: '',
            innerVisible: false,
            companyAll: [],
        }
    },
    methods: {
        beforeUpload(res) {
            console.log(res.data)
        },
        async downloadFile(row) {

            try {
                // 请求文件数据
                const response = await fetch("/main/download?name=");
                const data = await response.blob();
                // 创建临时 URL
                const tempUrl = URL.createObjectURL(data);
                console.log(tempUrl)
                // 创建隐藏的 <a> 标签并触发点击事件
                const link = document.createElement('a');
                link.href = tempUrl;
                link.style.display = 'none';
                link.download = row.fileSrc;
                document.body.appendChild(link);
                link.click();

                // 释放临时 URL
                document.body.removeChild(link);
                URL.revokeObjectURL(tempUrl);
            } catch (error) {
                console.error('下载文件失败：', error);
            }
        },
        selectTeacher() {
            axios.get("/main/selectTeacherByTeacherNo", {
                params: {
                    teacherNo: localStorage.getItem('userName')
                }
            }).then(res => {
                this.teacher = res.data.data

                this.selectStudentClassID()
            })
        },
        selectStudent() {
            this.innerVisible = true
            console.log(this.form.studentID)
            axios.get("/main/selectStudentPractice", {
                params: {
                    studentID: this.form.studentID
                }
            }).then(res => {
                this.stuDate = res.data.data.rows
                for (let index = 0; index < this.stuDate.length; index++) {
                    const t = this.stuDate[index].entryTime.indexOf('T');
                    const e = this.stuDate[index].endTime.indexOf('T');
                    if (t != -1) {
                        let date = new Date(this.stuDate[index].entryTime)
                        let date2 = new Date(this.stuDate[index].endTime)
                        date.setDate(date.getDate() + 1)
                        date2.setDate(date2.getDate() + 1)
                        let newDateStr = date.toISOString().slice(0, t);
                        let newDateStr2 = date2.toISOString().slice(0, t);
                        this.stuDate[index].entryTime = newDateStr
                        this.stuDate[index].endTime = newDateStr2
                    }
                }
            })
        },
        selectCompanyAll() {
            axios.get("/main/selectCompanyAll").then(res => {
                this.companyAll = res.data.data
                console.log(this.companyAll)
            })
        },
        selectStudentClassID() {
            console.log(this.stuName)
            axios.get("/main/selectStudentByClassID", {
                params: {
                    page: this.page,
                    pageSize: this.pageSize,
                    classID: this.teacher.classID,
                    studentName: this.stuName,
                }
            }).then(res => {
                this.tableData = res.data.data.rows
                this.total = res.data.data.total

            })
        },
        handleClick(row) {
            this.dialogFormVisible = true
            this.form = row;

        },
        handleMonthly(sNo) {
            this.$router.push('/teacher/Monthly?studentNo=' + sNo + '&className=' + this.className)
        },
        deleteStudent(row) {

            var qs = require('qs')
            axios.post("/main/deleteStudent", qs.stringify({
                studentNo: row.studentNo
            })).then(res => {
                if (res.data.data == 1) {
                    this.$message({
                        message: '删除成功!',
                        type: 'success'
                    });
                    this.selectStudentClassID()
                }
            })
        },
        handleSizeChange(val) {
            console.log(`每页 ${val} 条`);
            this.pageSize = val;
            this.selectStudentClassID();

        },
        handleCurrentChange(val) {
            console.log('当前页: ' + val);
            this.page = val;
            this.selectStudentClassID();

        },
        tableRowClassName({ row, rowIndex }) {
            if (rowIndex === 1) {
                return 'warning-row';
            } else if (rowIndex === 3) {
                return 'success-row';
            }
            return '';
        }
    },
    created() {
        this.selectTeacher()
        this.selectCompanyAll()
    }
}
</script>

<style>
.el-table .warning-row {
    background: oldlace;
}

.el-table .success-row {
    background: #f0f9eb;
}
</style>