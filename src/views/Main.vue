<template>
  <div>
    <!-- <a href="/index">main</a> -->
    <ChatDialog />
    <!-- <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal" @select="handleSelect">
      <img src="../assets/XueYuanlogo.png" alt="" class="logo">
      <el-menu-item index="1">业务管理</el-menu-item>
      <el-submenu index="2">
        <template slot="title">统计分析</template>
<el-menu-item index="2-1">学生数据</el-menu-item>
<el-menu-item index="2-2">实习就业</el-menu-item>
</el-submenu>

<el-submenu index="5">
  <template slot="title">基础数据</template>
  <el-menu-item index="5-1">班级管理</el-menu-item>
</el-submenu>
<div class="avatar">
  <el-dropdown>
    <span>
      <el-avatar src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png"
        style="cursor: pointer"></el-avatar>
    </span>
    <el-dropdown-menu slot="dropdown">
      <el-dropdown-item @click.native="handle()" index="6">个人中心</el-dropdown-item>
      <el-dropdown-item @click.native="outLogin()">退出登录</el-dropdown-item>
    </el-dropdown-menu>
  </el-dropdown>

</div>
</el-menu> -->

    <!-- <div class="main">
      <router-view />
    </div> -->
    <el-container>
      <el-header style="border-bottom: 1px solid #ddd">
        <img src="../assets/XueYuanlogo.png" alt="" class="logo">
        <div class="avatar">
          <el-dropdown>
            <span>
              <el-avatar src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png"
                style="cursor: pointer"></el-avatar>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item @click.native="handle()" index="6">个人中心</el-dropdown-item>
              <el-dropdown-item @click.native="outLogin()">退出登录</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>

        </div>
      </el-header>
      <el-container>
        <el-aside width="200px">
          <el-menu :default-active="activeIndex" class="el-menu-vertical-demo" :router="true">
            <!-- <el-submenu index="/main/operations">
              <template slot="title">
                <i class="el-icon-location"></i>
                <span>业务管理</span>
              </template>
              <el-menu-item-group>
                <template slot="title">分组一</template>
                <el-menu-item index="1-1">选项1</el-menu-item>
                <el-menu-item index="1-2">选项2</el-menu-item>
              </el-menu-item-group>
              <el-menu-item-group title="分组2">
                <el-menu-item index="1-3">选项3</el-menu-item>
              </el-menu-item-group>
              <el-submenu index="1-4">
                <template slot="title">选项4</template>
                <el-menu-item index="1-4-1">选项1</el-menu-item>
              </el-submenu>
            </el-submenu> -->
            <el-menu-item index="/main/operations">
              <i class="el-icon-document"></i>
              <span slot="title">业务管理</span>
            </el-menu-item>
            <el-submenu index="2">
              <template slot="title">
                <i class="el-icon-location"></i>
                <span>统计分析</span>
              </template>
              <el-menu-item index="/main/stuData">学生数据</el-menu-item>
              <el-menu-item index="/main/shiXiData">实习就业</el-menu-item>
            </el-submenu>
            <el-submenu index="5">
              <template slot="title">
                <i class="el-icon-document"></i>
                <span slot="title">业务管理</span>
              </template>
              <el-menu-item index="/main/classManagement">班级管理</el-menu-item>
              <el-menu-item index="/main/UserManage">学生账户管理</el-menu-item>
              <el-menu-item index="/main/TeacherManage">教师账户管理</el-menu-item>
              <el-menu-item index="/main/CompanyManage">企业账户管理</el-menu-item>
              <el-menu-item index="/main/PostApplication">企业工作申请</el-menu-item>
            </el-submenu>

          </el-menu>
        </el-aside>
        <el-main style="height: 90vh;">
          <router-view />
        </el-main>
      </el-container>
    </el-container>
  </div>

</template>
<script>
import ChatDialog from "@/components/ChatDialog.vue";

import axios from "axios";
export default {
  components: {
    ChatDialog
  },
  data() {
    return {
      activeIndex: '/main/operations',
    };
  },
  mounted() {
    this.jwt();
    this.activeIndex = this.$route.path;

  },
  methods: {
    handle() {

      if (this.$route.path != '/main/PersonalCenter/PersonalInformation') {
        this.$router.push('/main/PersonalCenter/PersonalInformation')
      }
    },
    handleSelect(key, keyPath) {
      console.log(key, keyPath);
      if (key == '1' && this.$route.path != '/main/operations') {
        this.$router.push('/main/operations')
      }
      if (key == '2-1' && this.$route.path != '/main/stuData') {
        this.$router.push('/main/stuData')
      }
      if (key == '2-2' && this.$route.path != '/main/shiXiData') {
        this.$router.push('/main/shiXiData')
      }
      if (key == '2-2-2' && this.$route.path != '/main/jiuYeData') {
        this.$router.push('/main/jiuYeData')
      }
      if (key == '5-1' && this.$route.path != '/main/classManagement') {
        this.$router.push('/main/classManagement')

      }
    },
    outLogin() {
      localStorage.setItem('jwt', '');
      this.$router.push({ path: '/' })
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
  }
}

</script>

<style scoped>
.main {
  padding-left: 50px;
  padding-right: 50px;
}

.avatar {
  display: inline-block;
  width: 50px;
  height: 100%;
  text-align: center;
  line-height: 100%;
  margin-top: 10px;
  float: right;
  margin-right: 50px;
}

.logo {
  float: left;
  height: 50px;
  margin-top: 5px;
  margin-left: 40px;
  margin-right: 10px;
}
</style>