<template>
    <div>
        <!-- 编辑弹窗 -->
        <el-dialog title="编辑信息" :visible.sync="editDialogVisible" width="50%" @close="resetForm">
            <el-form :model="editData" ref="editForm" label-width="80px">
                <el-form-item label="姓名">
                    <el-input v-model="editData.name"></el-input>
                </el-form-item>
                <el-form-item label="年龄">
                    <el-input v-model="editData.age"></el-input>
                </el-form-item>
                <!-- 其他字段依次添加 -->
            </el-form>

            <div slot="footer" class="dialog-footer">
                <el-button @click="editDialogVisible = false">取消</el-button>
                <el-button type="primary" @click="saveEdit">确定</el-button>
            </div>
        </el-dialog>

        <div style="
          float: right;
          width: 70%;
          margin-right: 5%;
          margin-bottom: 10px;
        ">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
                <el-breadcrumb-item><a href="/">个人中心</a></el-breadcrumb-item>
                <el-breadcrumb-item>个人信息</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <!-- 原有模板代码 -->
        <div class="back">
            <br />
            <h2 class="jj1" style="display: inline">简介</h2>
            <!-- 点击操作按钮打开编辑弹窗 -->
            <el-button type="warning" style="
            float: right;
            margin-right: 6%;
            background-color: #409eff;
            border: none;
          " @click="showEditDialog">操作</el-button>
            <hr style="width: 95%; margin-top: 20px" />
            <div class="back2">
                <table class="t1" style="border-collapse: collapse; width: 100%">
                    <!-- 表格内容 -->
                    <tr class="r1">
                        <td class="d1"><i class="el-icon-user"></i>教师号</td>
                        <td class="d1">{{ Data.teacherNo }}</td>
                        <td class="d1"><i class="el-icon-user-solid"></i>姓名</td>
                        <td class="d1">{{ Data.teacherName }}</td>
                        <td class="d1"><i class="el-icon-aim"></i>年龄</td>
                        <td class="d1">{{ Data.teacherAge }}</td>
                    </tr>
                    <tr class="r1">
                        <td class="d1">
                            <i v-if="Data.teacherSex === '男'" class="el-icon-male"></i>
                            <i v-else class="el-icon-female"></i>性别
                        </td>
                        <td class="d1">{{ Data.teacherSex }}</td>
                        <td class="d1"><i class="el-icon-aim"></i>手机号</td>
                        <td class="d1">{{ Data.phoneNumber }}</td>
                        <td class="d1"><i class="el-icon-aim"></i>邮箱</td>
                        <td class="d1">{{ Data.mailbox }}</td>
                    </tr>
                    <!-- <tr class="r1">
                        <td class="d1"><i class="el-icon-notebook-2"></i>班级</td>
                        <td class="d1">{{ Data.className }}</td>
                        <td class="d1"><i class="el-icon-files"></i>学院</td>
                        <td class="d1">{{ Data.collegeName }}</td>
                        <td class="d1"><i class="el-icon-office-building"></i>专业</td>
                        <td class="d1">{{ Data.specialityName }}</td>
                    </tr>
                    <tr class="r1">
                        <td class="d1"><i class="el-icon-office-building"></i>实行</td>
                        <td class="d1">{{ Data.practice }}</td>
                        <td class="d1"><i class="el-icon-suitcase"></i>年级</td>
                        <td class="d1">{{ Data.gradeName }}</td>
                        <td class="d1"><i class="el-icon-tickets"></i>实习成绩</td>
                        <td class="d1">{{ Data.intern }}</td>
                    </tr> -->
                </table>
            </div>
        </div>
        <div class="Lonform2">
            <h1 style="text-align: center; margin-top: 60px">好好学习天天向上</h1>
            <hr style="width: 95%" />
        </div>
    </div>
</template>

<script>
import axios from "axios";
export default {
    data() {
        return {
            studentNo: '',
            // 控制编辑弹窗显示隐藏的变量
            editDialogVisible: false,
            // 编辑的数据
            editData: {
                name: "",
                age: "",
                // 其他字段依次添加
            },
            // 原始数据
            Data: {
                // sno: 666666,
                // name: "狗蛋",
                // age: 22,
                // sex: "男",
                // enrolTime: "2000-5-5",
                // graduateTime: "2004-5-5",
                // class: "软件班",
                // college: "软件学院",
                // speciality: "软件工程",
                // practice: "asdfadsf",
                // grade: "22",
                // intern: "88",
            },
        };
    },
    mounted() {
        this.getData();
        this.jwt()
    },
    methods: {
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
        //获取个人信息
        getData() {
            
            axios.get("/main/selectTeacherByTeacherNo",{
                params:{
                    teacherNo:localStorage.getItem('userName'),
                }
            }).then(res => {
                console.log(res,'tea')
               this.Data = res.data.data
              
            })
        },
        //根据id查学院
        getCollege(id) {
            axios.get("/main/selectCollege", { params: { collegeID: id } }).then(res => {
                this.$set(this.Data, 'collegeName', res.data.data[0].collegeName);
            })
        },
        //根据id查班级
        getClassName(id) {
            axios.get("/main/selectClassByID", { params: { classID: id } }).then(res => {
                // console.log(res)
                this.$set(this.Data, 'className', res.data.data.className);
            })
        },
        getSpeciality(id) {
            axios.get("/main/selectSpeciality", { params: { specialityID: id } }).then(res => {
                // console.log(res)
                this.$set(this.Data, 'specialityName', res.data.data[0].specialityName);
            })
        },
        getGrade(id) {
            axios.get("/main/selectGrade", { params: { gradeID: id } }).then(res => {
                // console.log(res)
                this.$set(this.Data, 'gradeName', res.data.data[0].gradeName);
            })
        },
        // 点击操作按钮显示编辑弹窗
        showEditDialog() {
            // 将原始数据赋值给编辑数据，确保弹窗中显示的数据是原始数据
            this.editData = { ...this.Data };
            // 打开编辑弹窗
            this.editDialogVisible = true;
        },
        // 保存编辑
        saveEdit() {
            // 在这里处理保存编辑的逻辑，比如发送请求到后端保存数据等
            // 此处仅关闭编辑弹窗示例
            this.editDialogVisible = false;
            // 更新表格数据，这里可以将编辑后的数据保存到后端或者更新 Vuex 中的数据
            this.Data = { ...this.editData };
        },
        // 重置表单
        resetForm() {
            // 在关闭编辑弹窗时重置表单数据，确保下次打开弹窗时数据是最新的
            this.editData = { ...this.Data };
        },
    },
};
</script>

<style scoped>
/* 样式内容 */

.back {
    float: right;
    width: 70%;
    height: 260px;
    /*原460*/
    margin-right: 5%;
    background-color: #fff;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.15);
    border-radius: 10px;
    /* 添加圆角矩形样式 */
}

.Lonform2 {
    float: right;

    width: 70%;
    margin-right: 5%;
    height: 140px;
    margin-top: 20px;
    background-color: #fff;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.15);
    border-radius: 10px;
    /* 添加圆角矩形样式 */
}

.back2 {
    width: 95%;
    height: 50%;

    margin: 0 auto;
    margin-top: 20px;
}

.jj1 {
    margin-left: 20px;
}

.t1 {
    border-collapse: collapse;
    width: 100%;
    height: 100%;
}

.d1 {
    border: 1px solid #dddddd;
    /* 设置单元格边框 */
    text-align: left;
    padding: 8px;
}

.t1 .r1 .d1:first-child {
    font-weight: bold;
    background-color: #f2f2f2;
    /* 设置背景颜色为灰色 */
}

.t1 .r1 .d1:nth-child(3) {
    font-weight: bold;
    background-color: #f2f2f2;
    /* 设置背景颜色为灰色 */
}

.t1 .r1 .d1:nth-child(5) {
    background-color: #f2f2f2;
    /* 设置背景颜色为灰色 */
}

.t1 .r1 .d1:nth-child(2) {
    background-color: #fff;
    /* 设置背景颜色为灰色 */
}

.t1 .r1 .d1:nth-child(4) {
    background-color: #fff;
    /* 设置背景颜色为灰色 */
}

.t1 .r1 .d1:nth-child(6) {
    background-color: #fff;
    /* 设置背景颜色为灰色 */
}
</style>