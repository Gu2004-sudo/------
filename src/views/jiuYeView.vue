<template>
    <div style="width: 90%;margin: auto;">
        <div style="margin-top: 50px; padding-left: 75px;margin-bottom: 30px;">
            <label>学生姓名: </label>
            <el-input style="width: 220px;" type="text" placeholder="请输入学生姓名" v-model="sname" maxlength="10"
                show-word-limit>
            </el-input>
            <div style="width: 30px; display: inline-block;"></div>
            <label>是否对口: </label>
            <el-select v-model="text" placeholder="请选择">
                <el-option value="">全部</el-option>
                <el-option value="是">是</el-option>
                <el-option value="否">否</el-option>
            </el-select>
            <div style="width: 30px; display: inline-block;"></div>
            <el-button type="primary" icon="el-icon-search" @click="selectStudentByName()">搜索</el-button>

            <el-button type="primary" @click="exportTableData()">导出<i class="el-icon-top"></i></el-button>
        </div>
        <el-table :data="tableData" style="width: 100%" @expand-change="selectObtainEmployment" ref="refTable">
            <el-table-column type="expand" :visible.sync="expandedRowIndex">
                <template slot-scope="{ row }">
                    <el-table :data="ObtainEmployment" style="width: 100%" >
                        <el-table-column label="入职日期" width="180" prop="entryTime">
                            <template slot-scope="scope">
                                <div v-if="scope.row.studentID == row.studentID">
                                    {{ scope.row.entryTime }}
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column label="岗位名称" width="180">
                            <template slot-scope="scope">
                                <div v-if="scope.row.studentID == row.studentID">
                                    {{ scope.row.postName }}
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column label="岗位要求" width="180">
                            <template slot-scope="scope">
                                <div v-if="scope.row.studentID == row.studentID">
                                    {{ scope.row.postResponsibility }}
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column label="当前状态">
                            <template slot-scope="scope">
                                <div v-if="scope.row.studentID == row.studentID">
                                    {{ scope.row.statu }}
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column label="薪资">
                            <template slot-scope="scope">
                                <div v-if="scope.row.studentID == row.studentID">
                                    {{ scope.row.postSalary }}
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column label="操作">
                            <template slot-scope="scope">
                                <el-link type="primary" icon="el-icon-refresh-left" style="margin-right: 12px;"
                                    @click="updatePost(scope.row, row)">更新</el-link>
                            </template>

                        </el-table-column>

                    </el-table>
                </template>
                
            </el-table-column>

            <el-table-column width="140px" type="index" label="序号" :show-overflow-tooltip="true">
            </el-table-column>
            <el-table-column width="140px" label="学号" prop="studentNo">
            </el-table-column>
            <el-table-column width="140px" label="姓名" prop="studentName">
            </el-table-column>
            <el-table-column width="140px" label="是否对口" prop="contraErture">
                <template slot-scope="scope">
                    <div v-for="practice, index in practiceList" :key="index">
                        <!-- <span v-if="scope.row.practiceID != 1 && scope.row.practiceID != 2">{{ }}</span> -->
                        <span v-if="practice.practiceID == scope.row.practiceID">{{ practice.contraErture }}</span>
                    </div>
                </template>
            </el-table-column>

            <el-table-column width="140px" label="联系电话" prop="phone">
            </el-table-column>
            <el-table-column width="140px" label="家庭住址" prop="address">
            </el-table-column>
            <el-table-column width="140px" label="佐证材料">
                <template slot-scope="scope">
                    <span v-if="scope.row.fileSrc == ''">无</span>
                    <span v-else-if="scope.row.fileSrc != ''"><a @click="downloadFile(scope.row)">{{ scope.row.fileSrc
                            }}</a></span>
                </template>
            </el-table-column>
            <el-table-column label="操作" fixed="right" width="270">
                <template slot-scope="scope">
                    <el-link type="primary" icon="el-icon-plus" @click="insert(scope.row)">添加</el-link>
                    <el-link type="primary" style="margin:0 20px;"
                        @click="handleMonthly(scope.row.studentNo)">查看月报</el-link>
                    <el-link type="primary" @click="handleFonrtnighty(scope.row.studentNo)">查看半月报</el-link>
                </template>
            </el-table-column>
        </el-table>

        <el-dialog title="添加记录" :visible.sync="dialogFormVisible" @close="handClose" width="500px">
            <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
                <el-form-item label="岗位名称" prop="postName" style="width: 330px;">
                    <el-input v-model="ruleForm.postName" style="padding-left: 4px;"></el-input>
                </el-form-item>
                <el-form-item label="入职日期" required>
                    <el-col :span="10">
                        <el-form-item prop="entryTime">
                            <el-date-picker type="date" placeholder="入职日期" v-model="ruleForm.entryTime"
                                style="width: 225px;margin-left: 2px;"></el-date-picker>
                        </el-form-item>
                    </el-col>
                </el-form-item>

                <el-form-item label="岗位标签" prop="type">
                    <el-radio label="前端开发" name="type" v-model="ruleForm.postNature"></el-radio>
                    <el-radio label="后端开发" name="type" v-model="ruleForm.postNature"></el-radio>
                    <el-radio label="人工智能" name="type" v-model="ruleForm.postNature"></el-radio>
                    <el-radio label="大数据技术岗位" name="type" v-model="ruleForm.postNature"></el-radio>
                    <el-radio label="其他" name="type" v-model="ruleForm.postNature"></el-radio>
                </el-form-item>

                <el-form-item label="是否对口" style="width: 330px;">

                    <el-select v-model="ruleForm.practiceID" placeholder="请选择">
                        <el-option value="2" label="是"></el-option>
                        <el-option value="1" label="否"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="薪资" prop="postSalary" style="width: 330px;">
                    <el-input type="number" style="width: 220px;" v-model="ruleForm.postSalary">
                        <template slot="append">元</template>
                    </el-input>

                </el-form-item>
                <el-form-item label="岗位职责" prop="postResponsibility" style="width: 330px;">
                    <el-input type="textarea" style="width: 225px;" v-model="ruleForm.postResponsibility"></el-input>
                </el-form-item>
            </el-form>
            <el-upload class="upload-demo" drag action="/main/upload" multiple :on-success="handlePreview"
                :before-remove="beforeRemove" :on-remove="handleRemove">
                <i class="el-icon-upload"></i>
                <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
            </el-upload>

            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="insertPost(handlePreview)">确 定</el-button>
            </div>
        </el-dialog>


        <el-dialog title="修改记录" :visible.sync="dialogForm" @close="handClose">
            <el-form :model="from" :rules="rules" ref="from" label-width="100px" class="demo-ruleForm">
                <el-form-item label="岗位名称" prop="postName" style="width: 330px;">
                    <el-input v-model="from.postName"></el-input>
                </el-form-item>
                <el-form-item label="入职日期">
                    <el-col :span="10">
                        <el-form-item prop="entryTime">
                            <el-date-picker type="date" placeholder="入职日期" v-model="from.entryTime"
                                style="width: 225px;margin-left: 2px;"></el-date-picker>
                        </el-form-item>
                    </el-col>
                </el-form-item>
                <el-form-item label="薪资" prop="postSalary" style="width: 330px;">
                    <!-- <el-input type="number" style="width: 225px; padding-left: 3px;"
                        v-model="from.postSalary"></el-input> -->
                    <el-input type="number" style="width: 220px;" v-model="ruleForm.postSalary">
                        <template slot="append">元</template>
                    </el-input>
                </el-form-item>
                <el-form-item label="岗位职责" prop="postResponsibility" style="width: 330px;">
                    <el-input type="textarea" style="width: 225px;" v-model="from.postResponsibility"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogForm = false">取消</el-button>
                <el-button type="primary" @click="isUpdatePost()">确 定</el-button>
            </div>
        </el-dialog>

        <el-pagination style="float: right; padding-top: 15px;" @size-change="handleSizeChange"
            @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="[5, 10, 15, 20]"
            :page-size="100" layout="total, sizes, prev, pager, next, jumper" :total="total">
        </el-pagination>
    </div>
</template>

<script>
import * as XLSX from 'xlsx';
import axios from 'axios';
export default {
    data() {
        return {
            file: '',
            student: '',
            isPractice: '',
            expandedRowIndex: -1,
            ObtainEmployment:[],
            isEX: false,
            active: 0,
            text: '',
            sname: '',
            sid: '',
            page: '',
            court: '',
            total: 1,
            isFinite: true,
            tableData: [],
            postList: [],
            practiceList: [],
            mergedArray: [],
            currentPage: 1,
            dialogFormVisible: false,
            key: "1",
            fileList: [{ name: '', url: '' }],
            ruleForm: {
                postName: '',
                entryTime: '',
                postNature: '',
                postResponsibility: '',
                postSalary: '',
                studentID: '',
                practiceID: ''
            },
            dialogForm: false,
            from: {
                postName: '',
                entryTime: '',
                postNature: '',
                postResponsibility: '',
                postSalary: ''
            },
            formLabelWidth: '120px',
            rules: {
                postName: [
                    { required: true, message: '请输入岗位名称', trigger: 'blur' },
                    { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
                ],


            }
        }

    },

    methods: {
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
        handleMonthly(sNo) {
            this.$router.push('/main/Monthly?studentNo=' + sNo + '&className=' + this.className)
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
        exportTableData() {
            this.mergedArray = this.tableData.concat(this.postList);
            // 创建一个工作簿对象
            const workbook = XLSX.utils.book_new();
            // 将表格数据转换为工作表对象
            const worksheet1 = XLSX.utils.json_to_sheet(this.mergedArray);
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
        },
        insertPost() {
            console.log(this.ruleForm)

            axios.post("/main/insertObtainEmployment", JSON.stringify(this.ruleForm), {
                headers: {
                    'Content-Type': 'application/json',
                }
            }).then(res => {
                if (res.data.code == 1)
                    alert("添加成功")
                console.log(this.fileList)
                console.log(this.student)
                this.student.practiceID = this.ruleForm.practiceID
                this.updatetStudent();
                this.dialogFormVisible = false
                this.selectObtainEmploymentWC();
            })

        },

        updatetStudent() {

            axios.put("/main/updateStudent", JSON.stringify(this.student), {
                headers: {
                    "Content-Type": "application/json"
                }
            }).then(res => {
                if (res.data.code == 1) {
                    console.log(1)

                }
            })
        },
        insert(row) {
            this.dialogFormVisible = true
            this.ruleForm.studentID = row.studentID
            this.student = row;
            console.log(this.student)
        },
        updatePost(row1, row2) {
            this.student = row2;
            this.sid = row1.studentID
            this.dialogForm = true
            axios.get("/main/selectObtainEmploymentByID", {
                params: {
                    obtainEmploymentID: row1.obtainEmploymentID
                }
            }).then(res => {
                this.from = res.data.data
                console.log(this.from)
            })
        },
        handleFonrtnighty(id) {
            this.$router.push('/main/Fortnightly?studentNo=' + id + '&className=' + this.className)
        },
        isUpdatePost() {
            this.dialogForm = false
            axios.put("/main/updateObtainEmployment", JSON.stringify(this.from), {
                headers: {
                    'Content-Type': 'application/json',
                }
            }).then(res => {
                if (res.data.code == 1) {
                    alert("修改成功")
                    this.selectPostBySID(this.sid)
                }
            })
        },
        selectPostBySID() {
            axios.get("/main/selectObtainEmploymentByStudentID", { params: { studentID: this.sid } }).then(res => {
                this.ObtainEmployment = res.data.data
                console.log("xxx")
                for (let index = 0; index < this.postList.length; index++) {
                    const t = this.ObtainEmployment[index].entryTime.indexOf('T');
                    if (t != -1) {
                        let date = new Date(this.ObtainEmployment[index].entryTime)
                        date.setDate(date.getDate() + 1)
                        let newDateStr = date.toISOString().slice(0, t);
                        this.ObtainEmployment[index].entryTime = newDateStr

                    }
                }
            })
        },
        selectStudentByName() {
            console.log(this.sname)

            axios.get("/main/selectStudentByContraErture", {
                params: {
                    studentName: this.sname,
                    className: this.className,
                    contraErture: this.text
                },
            }).then(res => {
                this.tableData = res.data.data.rows;
                this.total = res.data.data.total
            })
        },
        selectStudentAll() {
            axios.get("/main/selectStudent", {
                params: {
                    page: this.page,
                    court: this.court,
                    studentName: this.sname,
                    contraErture: this.text,
                    className: this.className,
                },
            }).then(res => {
                this.tableData = res.data.data.rows;
                this.total = parseInt(res.data.data.total);
                console.log(this.tableData)
            })
        },
        selectObtainEmployment(row, index) {
            console.log(row.studentID)
            if (this.isEX == false)
                this.sid = row.studentID
             this.ObtainEmployment = []
            axios.get("/main/selectObtainEmploymentByStudentID?studentID=" + this.sid).then(res => {
                this.ObtainEmployment = res.data.data
                console.log(this.ObtainEmployment)
                this.isEX = false
                for (let index = 0; index < this.ObtainEmployment.length; index++) {
                    const t = this.ObtainEmployment[index].entryTime.indexOf('T');
                    if (t != -1) {
                        let date = new Date(this.ObtainEmployment[index].entryTime)
                        date.setDate(date.getDate() + 1)
                        let newDateStr = date.toISOString().slice(0, t);
                        this.ObtainEmployment[index].entryTime = newDateStr
                        console.log(this.ObtainEmployment)
                    }

                }
                if (index.length > 1) {
                    this.isEX = true
                    this.$refs.refTable.toggleRowExpansion(index[0])
                }
            })


        },



        selectPractice() {
            axios.get("/main/selectPractice").then(res => {
                this.practiceList = res.data.data;

            })
        },
        selectObtainEmploymentWC() {
            axios.get("/main/selectObtainEmploymentByStudentID").then(res => {
                this.ObtainEmployment = res.data.data
                console.log(this.ObtainEmployment)
                for (let index = 0; index < this.ObtainEmployment.length; index++) {
                    const t = this.ObtainEmployment[index].entryTime.indexOf('T');
                    console.log(t)
                    if (t != -1) {
                        let date = new Date(this.ObtainEmployment[index].entryTime)
                        date.setDate(date.getDate() + 1)
                        let newDateStr = date.toISOString().slice(0, t);
                        this.ObtainEmployment[index].entryTime = newDateStr

                    }
                }
            })
        },
        handleSizeChange(val) {
            console.log(`每页 ${val} 条`);
            this.court = val;
            this.selectStudentAll();

        },
        handleCurrentChange(val) {
            console.log('当前页: ' + val);
            this.page = val;
            this.selectStudentAll();

        },
        handClose: function () {
            for (let f in this.ruleForm)
                this.ruleForm[f] = '';
            for (let f in this.from)
                this.from[f] = '';
        },

        handleRemove(file, fileList) {
            console.log(file, fileList);
            console.log(1111)
        },
        handlePreview: function (file, fileList) {
            this.student.fileSrc = fileList.response.data
            let fname = fileList.response.data.slice(0, 8)
            console.log(fname)
            this.fileList.name = file.name
            this.fileList.url = file.response
            console.log(file)
            this.fileList.push[{ name: file.name, url: file.response }]
            console.log(this.fileList)

        },

        beforeRemove(file) {
            console.log(4444)
            this.student.fileSrc = null
            return this.$confirm(`确定移除 ${file.name}?`);

        }

    },
    mounted() {
        this.className = this.$route.query.className
        this.selectStudentAll();
        this.selectObtainEmploymentWC();
        this.selectPractice();
        
        this.jwt()
    }
}
</script>

<style scoped> 
.el-steps {
    margin: auto;
    width: 300px;
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