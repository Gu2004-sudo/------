<template>
    <div class="body">
        <div class="mask" v-loading="loading">
            <div class="loginBox">
                <div class="title">实习就业管理平台</div>
                <div class="loginForm">
                    <el-form :label-position="labelPosition" :model="formLabelAlign" :rules="rules">
                        <el-form-item prop="userName">
                            <el-input v-model="formLabelAlign.userName" prefix-icon="el-icon-user" placeholder="请输入账号"
                                clearable></el-input>
                        </el-form-item>
                        <el-form-item prop="password">
                            <el-input v-model="formLabelAlign.password" prefix-icon="el-icon-key" placeholder="请输入密码"
                                show-password clearable></el-input>
                        </el-form-item>
                        <el-checkbox v-model="checked" style="float: left;margin-bottom: 10px;">记住密码</el-checkbox>
                        <Vcode :show="isShow" @success="success" @close="close" />
                        <el-button type="primary" style="width:300px;" @click="isShow = true">登录</el-button>
                    </el-form>
                </div>

            </div>
        </div>
    </div>
</template>

<script>
import Vcode from "vue-puzzle-vcode";
import axios from "axios";
export default {
    components: {
        Vcode
    },
    data() {
        return {
            roleName: '',
            loading: false,
            fullscreenLoading: false,//页面加载
            labelPosition: 'right',
            isShow: false,//验证码
            checked: true,//记住密码
            formLabelAlign: {
                userName: '',
                password: '',
            },
            rules: {
                userName: [
                    { required: true, message: '请输入账号', trigger: 'blur' },
                ],
                password: [
                    { required: true, message: '请输入密码', trigger: 'blur' }
                ],

            }

        };

    },
    mounted() {
        this.getCookie();
    },
    methods: {
        getData() {
            const params = {
                userName: this.formLabelAlign.userName,
                password: this.formLabelAlign.password
            }
            axios.post("/login/selectUser?userName=" + params.userName + "&password=" + params.password).then(res => {
                // console.log(res)
                if (res.data.code != 0&&res.data.data2.status==1) {
                    this.$message({
                        message: '登录成功',
                        type: 'success',
                        duration: 1500

                    });
                    localStorage.setItem('userName', res.data.data2.roleName);
                    localStorage.setItem('userID', res.data.data2.userID);
                    console.log()
                    this.roleName = res.data.data2.roleName.charAt(0);
                    if (res.data.data2.roleID == 1) {
                        setTimeout(() => {
                            this.loading = false
                            this.$router.push('/main/operations')
                        }, 1000);
                    } else if (res.data.data2.roleID == 4) {
                        setTimeout(() => {
                            this.loading = false
                            this.$router.push('/stu')
                        }, 1000);
                    } else if (res.data.data2.roleID == 3) {
                        setTimeout(() => {
                            this.loading = false
                            this.$router.push('/teacher/PersonalCenter/personalInformation')
                        }, 1000);
                    } else {
                        setTimeout(() => {
                            this.loading = false
                            this.$router.push('/com')
                        }, 1000);
                    }
                    //  console.log(this.roleName)
                    localStorage.setItem('jwt', res.data.data);
                    // console.log(localStorage.getItem('jwt'))
                    this.loading = true
                    //console.log(res)
                } else {
                    this.$message({
                        message: '登录失败，请检查账号或密码',
                        type: 'error',
                        duration: 1500
                    });
                }

                //this.getPage();
            }).catch(err => {
                this.$message({
                    message: 'error',
                    type: 'error',
                    duration: 1500
                });

            });
        },

        submit() {
            this.isShow = true;
        },
        //设置cookie
        setCookie(c_name, c_pwd, c_checked, exdays) {
            var exdate = new Date(); //获取时间
            exdate.setTime(exdate.getTime() + 24 * 60 * 60 * 1000 * exdays); //保存的天数
            //字符串拼接cookie
            window.document.cookie = "userName" + "=" + c_name + ";path=/;expires=" + exdate.toGMTString();
            window.document.cookie = "password" + "=" + c_pwd + ";path=/;expires=" + exdate.toGMTString();
            window.document.cookie = "checked" + "=" + c_checked + ";path=/;expires=" + exdate.toGMTString();
        },
        //读取cookie
        getCookie: function () {
            if (document.cookie.length > 0) {
                var arr = document.cookie.split('; '); //这里显示的格式需要切割一下自己可输出看下
                for (var i = 0; i < arr.length; i++) {
                    var arr2 = arr[i].split('='); //再次切割
                    //判断查找相对应的值
                    if (arr2[0] == 'userName') {
                        this.formLabelAlign.userName = arr2[1]; //保存到保存数据的地方
                    } else if (arr2[0] == 'password') {
                        this.formLabelAlign.password = arr2[1];
                    }
                }
            }
        },
        //清除cookie
        clearCookie: function () {
            this.setCookie("", "", -1); //修改2值都为空，天数为负1天就好了
        },
        // 用户通过了验证
        success(msg) {
            console.log(msg)
            this.isShow = false; // 通过验证后，需要手动隐藏模态框
            //判断复选框是否被勾选 勾选则调用配置cookie方法
            if (this.checked == true) {
                //传入账号名，密码，和保存天数3个参数
                this.setCookie(this.formLabelAlign.userName, this.formLabelAlign.password, 7);
            } else {
                //清空Cookie
                this.clearCookie();
            }

            this.getData()
        },
        // 用户点击遮罩层，应该关闭模态框
        close() {
            this.isShow = false;
        }
    }

}
</script>

<style>
* {
    margin: 0;
    padding: 0;
}

.body {
    top: 0;
    background: url('../assets/shiXi.jpg') no-repeat;
    width: 100%;
    height: 100%;
    position: fixed;
    background-size: 100% 100%;
}

.mask {
    width: 100%;
    height: 100%;
    position: fixed;
    background-size: 100% 100%;
    background-color: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(1px)
}

.loginBox {
    width: 400px;
    height: 400px;
    margin: 150px auto;
    box-shadow: 0 2px 4px rgba(255, 255, 255, 0.5), 0 0 6px rgba(0, 0, 0, .04);
    background-color: rgba(255, 255, 255, 0.879);
    background-size: cover;
    border-radius: 20px;

}

.loginForm {
    padding-top: 50px;
    width: 300px;
    margin: 0 auto;
}

/* .login{
    padding-top: 100px;
    width: 450px;
    height:100%;
    float: right;
} */
.title {
    padding-top: 30px;
    font-size: 24px;
    color: gray;
}
</style>