<template>
  <div id="app">
    <ChatDialog />
    <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal" @select="handleSelect">
      <el-menu-item index="1">个人实习</el-menu-item>
      <el-menu-item index="2">就业信息</el-menu-item>
      <el-submenu index="3">
        <template slot="title">月报管理</template>
        <el-menu-item index="2-1">半月报 </el-menu-item>
        <el-menu-item index="2-2">月报</el-menu-item>
      </el-submenu>
      <el-menu-item index="4">

        <!-- <div>
          <el-badge   is-dot class="item" style="cursor: pointer;margin-top: 5px;" @click.native="Natice()"
            slot="title">通知</el-badge>
        </div> -->
      </el-menu-item>
      <div class="demo-type" style="float: right; margin-right: 40px; margin-top: 10px">
        <el-dropdown trigger="hover" placement="bottom">
          <el-avatar class="avatar-dropdown"
            src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png"></el-avatar>
          <el-dropdown-menu slot="dropdown" class="dropdown-menu">
            <el-dropdown-item @click.native="handle" index="3">个人中心</el-dropdown-item>
            <el-dropdown-item @click.native="outLogin()">退出</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </el-menu>
    <router-view />
  </div>
</template>

<script>
import ChatDialog from "@/components/ChatDialog.vue";

import axios from "axios";
export default {
  components: {
    ChatDialog,
  },
  data() {
    return {
      activeIndex: "1",
      activeIndex2: "1",
    };
  },
  mounted() {
    this.jwt();
    if (this.$route.path != "/stu/practice") {
      this.$router.push("/stu/practice");
    }
    this.activeIndex = this.$route.name;

  },
  methods: {
    Natice(){
      if (this.$route.path != "/stu/notice") {
        this.$router.push("/stu/notice");
      }
    },
    outLogin() {
      localStorage.setItem("jwt", "");
      this.$router.push({ path: "/" });
    },
    handle() {
      console.log(1)
      if (this.$route.path != "/stu/notice") {
        this.$router.push("/stu/notice");
      }
    },
    handleSelect(key, keyPath) {
      console.log(key, keyPath);
      if (key == "1" && this.$route.path != "/stu/practice") {
        this.$router.push("/stu/practice");
      }
      if (key == "2" && this.$route.path != "/stu/Employ") {
        this.$router.push("/stu/Employ");
      }
      if (key == "2-1" && this.$route.path != "/stu/Fortnightly") {
        this.$router.push("/stu/Fortnightly");
      }
      if (key == "2-2" && this.$route.path != "/stu/Monthly") {
        this.$router.push("/stu/Monthly");
      }
    },
    jwt() {
      this.jwt = localStorage.getItem("jwt");
      //console.log(this.jwt)
      axios
        .get("/login/isLogin", {
          headers: {
            token: `${this.jwt}`,
          },
        })
        .then((res) => {
          if (res.data.code != 1) {
            this.$router.push({
              path: "/",
            });
          }
          //console.log(res.data.code)
        });
    },
  },
};
</script>

<style lang="less" scoped>
body {
  background-color: #f2f6fc;
}

#app {
  border-radius: 10px;
  /* 添加圆角矩形效果 */
  overflow: hidden;
  /* 确保边框圆角生效 */
}

.el-menu-demo {
  border-radius: 10px;
  /* 添加圆角矩形效果 */
  overflow: hidden;
  /* 确保边框圆角生效 */
}

.avatar-dropdown {
  cursor: pointer;
}

.dropdown-menu {
  width: 100px;
  margin-top: 10px;
}
</style>