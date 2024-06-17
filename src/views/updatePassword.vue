<!-- 修改账户 -->
<template>

    <div class="xgmm1Box1">

        <div class="xgmm22">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
                <el-breadcrumb-item><a href="/">个人中心</a></el-breadcrumb-item>
                <el-breadcrumb-item>修改账户</el-breadcrumb-item>
            </el-breadcrumb>
        </div>

        <div class="xgmm1Box">
            <div style="margin-bottom: 50px;margin-left: 10px;">
                <label for="" style="margin-right: 5px;"><span class="xing">*</span>请输入原密码:</label>
                <el-input placeholder="请输入密码" v-model="input1" show-password style="width: 400px;"></el-input>
            </div>
            <div style="margin-bottom: 50px;">
                <label for="请输入原密码" style="margin-right: 30px;"><span class="xing">*</span>请输入修改密码:</label>
                <el-input placeholder="请输入密码" v-model="input2" show-password
                    style="width: 400px;margin-left: -25px;"></el-input>
            </div>
            <div style="margin-right: 30px;">
                <label for="请输入原密码" style="margin-right: 50px;"><span class="xing">*</span>请再次输入修改密码:</label>
                <el-input placeholder="请输入密码" v-model="input3" show-password
                    style="width: 400px;margin-left: -45px;"></el-input>
            </div>
            <div class="button-container" style="display: flex;margin-top: 50px;">
                <el-button type="primary" @click="open" style="margin-right: 240px;">确定</el-button>
                <el-button type="info" @click="open2" plain>取消</el-button>
            </div>
        </div>
    </div>
</template>

<script>
import axios from "axios";
export default {

    name: 'JiuYeStudentAa',

    data() {
        return {
            input1: '',
            input2: '',
            input3: ''
        };
    },

    mounted() {
        console.log(localStorage.getItem('userName'),
        )
    },

    methods: {
        open() {
            if (this.input1 != '') {
                if (this.input2 != '' && this.input3 != '')
                    if (this.input2 !== this.input3) {
                        this.$confirm('两次输入的密码不一致， 请重新输入！', '提示', {
                            confirmButtonText: '确定',
                            cancelButtonText: '取消',
                            type: 'warning'
                        }).then(() => {
                            this.input2 = '';
                            this.input3 = '';
                            this.$refs.input1.focus();
                        }).catch(() => {
                            this.$message({
                                type: 'info',
                                message: '已取消修改'
                            });
                        });
                    } else
                        this.$confirm('此操作将修改密码, 是否继续?', '提示', {
                            confirmButtonText: '确定',
                            cancelButtonText: '取消',
                            type: 'warning'
                        }).then(() => {
                            var userID = parseInt(localStorage.getItem('userID'));
                            axios.get("/main/updatePassword", {params: {password: this.input1, newPassword: this.input2, isNewPassword: this.input3, userID: userID} }).then(res => {
                                console.log(res)
                                this.$message({
                                    type: 'success',
                                    message: '修改成功，请重新登录!'
                                });
                                localStorage.setItem('jwt', '');
                                this.$router.push('/')
                            }).catch(err => {
                                this.$message({
                                    type: 'error',
                                    message: '修改失败！请检查原密码或修改后的密码是否一致'
                                });
                            })

                        }).catch(() => {
                            this.$message({
                                type: 'info',
                                message: '已取消修改'
                            });
                        });
                else {
                    this.$message({
                        type: 'info',
                        message: '请输入修改后的密码！'
                    });
                }

            } else {
                this.$message({
                    type: 'info',
                    message: '请输入原密码！'
                });
            }

        },
        open2() {
            this.$confirm('此操作将清空内容, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.input1='',
                this.input2='',
                this.input3='',
                this.$message({
                    type: 'success',
                    message: '清空成功!'
                });
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消清空'
                });
            });
        }
    },
};
</script>

<style scoped>
.xing {
    color: red;
}

.xgmm1Box1 {
    float: right;
    width: 70%;
    height: 460px;
    margin-right: 5%;



}

.xgmm1Box {
    margin-top: 2%;
    width: 100%;
    height: 90%;
    background-color: #fff;
    display: flex;
    justify-content: center;
    /* 水平居中 */
    align-items: center;
    /* 垂直居中 */
    flex-direction: column;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.15);
}
</style>