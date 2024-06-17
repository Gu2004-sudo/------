<!-- 个人中心 -->

<template>
    <div class="grzx">
        <div class="dhl2">
            <el-col :span="4">
                <el-menu :default-active="active" class="el-menu-vertical-demo" @select="handleSelect">
                    <h3 class="centered-with-border" style="
                text-align: center;
                line-height: -10px;
                padding-top: -10px;
                padding-bottom: 20px;
              ">
                        个人中心
                    </h3>
                    <el-menu-item index="1">
                        <i class="el-icon-menu"></i>
                        <span slot="title">个人信息</span>
                    </el-menu-item>
                    <el-menu-item index="2">
                        <i class="el-icon-menu"></i>
                        <span slot="title">修改密码</span>
                    </el-menu-item>
                    <el-menu-item index="3">
                        <i class="el-icon-document"></i>
                        <span slot="title">管理</span>
                    </el-menu-item>
                    <el-menu-item index="4">
                        <i class="el-icon-setting"></i>
                        <span slot="title">关于</span>
                    </el-menu-item>
                </el-menu>
            </el-col>
        </div>
        <div>
            <router-view />
        </div>
    </div>
</template>

<script>
import axios from "axios";
export default {
    data() {
        return {
            active:'1'
        }},
    mounted() {
        // 检查当前路径是否为 /Message2，如果不是再进行导航
        // if (this.$route.path !== '/Message2') {
        //     this.$router.push({ path: "/Message2" });
        // }
        this.jwt()
    },
    methods: {

        handleSelect(key, keyPath) {
            if (key == '1' && this.$route.path != '/main/PersonalCenter/PersonalInformation') {
                this.$router.push('/main/PersonalCenter/PersonalInformation')
            }
            if (key == '2' && this.$route.path != '/main/PersonalCenter/updatePassword') {
                this.$router.push('/main/PersonalCenter/updatePassword')
            }
            // if (key == '2' && this.$route.path != '/main/PersonalCenter/personalInformation') {
            //     this.$router.push('/main/PersonalCenter/PersonalInformation')
            // }
        },
        handleOpen(key, keyPath) {
            console.log(key, keyPath);
        },
        handleClose(key, keyPath) {
            console.log(key, keyPath);
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
};
</script >

<style scoped>
.el-menu-vertical-demo {
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.15);
    margin: 0 auto;
}

.dhl2 {
    margin-left: 6%;
    margin-top: 5%;
}

.grzx .el-menu {
    height: 450px;
    /* 设置高度为页面的60% */
}

.centered-with-border {
    border-bottom: 2px solid #409eff;
    /* 添加下边框样式 */
    margin-top: 22%;
    /* 与您原来的样式保持一致 */
}

.el-menu-vertical-demo {
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.15);
    margin: 0 auto;
    border-radius: 10px;
    /* 添加圆角矩形效果 */
}

.dhl2 {
    margin-left: 6%;
    margin-top: 5%;
}

.grzx .el-menu {
    height: 450px;
    /* 设置高度为页面的60% */
}

.centered-with-border {
    border-bottom: 2px solid #409eff;
    /* 添加下边框样式 */
    margin-top: 22%;
    /* 与您原来的样式保持一致 */
}
</style>