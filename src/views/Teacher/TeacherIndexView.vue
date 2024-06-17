<template>
    <div>
      <el-container style="height: 600px; border: 1px solid #eee">
        <el-header style="text-align: right; font-size: 12px;">
          <div class="avatar" style="height: 100px;">
            <img src="../img/image.png" alt="" style="float: left;">
            <el-dropdown>
              <span>
                <el-avatar
                  src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png"
                  style="cursor: pointer"
                ></el-avatar>
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item @click.native="handle()" index="6"
                  >个人中心</el-dropdown-item
                >
                <el-dropdown-item @click.native="outLogin()">退出登录</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </div>
        </el-header>
  
        <el-container>
          <el-aside width="200px" style="background-color: rgb(238, 241, 246);margin-top: 50px;">
            <el-menu :default-openeds="['1', '3']" @select="handleSelect">
              <el-submenu index="2">
                <template slot="title"><i class="el-icon-menu"></i>功能模块</template>
                <el-menu-item-group>
                  <el-menu-item index="1-1">学生信息</el-menu-item>
                </el-menu-item-group>
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
  export default {
    data() {
      return {
        tableData: [],
        stuName: ''
      };
    },
    methods: {
      handleSelect(key, keyPath) {
        console.log(key + "," + keyPath);
        if (key === '1-1' && this.$route.path !== '/teacher/teaStudent') {
          this.$router.push('/teacher/teaStudent');
        }
      },
      outLogin() {
        localStorage.setItem('jwt', '');
        this.$router.push({ path: '/' });
      },
      handle() {
        if (this.$route.path !== '/teacher/PersonalCenter/PersonalInformation') {
          this.$router.push('/teacher/PersonalCenter/PersonalInformation');
        }
      }
    }
  };
  </script>
  
  <style scoped>
  .main {
    padding-left: 50px;
    padding-right: 50px;
  }
  
  .el-header {
    color: #333;
    line-height: 60px;
  }
  
  .el-aside {
    color: #333;
  }
  </style>