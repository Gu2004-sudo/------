<!-- 导航栏 -->
<template>
  <div>
    <el-container>
        <el-header>
          
          <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal" @select="handleSelect">
            <!-- 设置index属性与路由路径保持一致 -->
            <img src="../img/image.png" alt="" style="display: inline-block;float: left;width: 300px;">
           
            <el-menu-item index="/com/st">职位管理</el-menu-item>
            <el-menu-item index="/com/ViewApplicationList">查看申请列表</el-menu-item>
            <el-menu-item index="/com/InterviewArrangement">面试安排</el-menu-item>
            <el-menu-item index="/com/HistoricalRecord">历史记录</el-menu-item>
           
            <el-col :span="3" style="float: right; padding-top: 10px;">
              <!-- 使用下拉框 -->
              <el-dropdown>
                <span class="el-dropdown-link">
                  <el-avatar src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png" style="cursor: pointer;"></el-avatar>
                </span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item><el-menu-item index="/com/EditInformation">公司信息</el-menu-item></el-dropdown-item>
                  <el-dropdown-item ><el-menu-item index="/com/updatePassword2">修改密码</el-menu-item></el-dropdown-item>
                  <!-- divided添加分割线 -->
                  <el-dropdown-item divided><el-menu-item index="/">退出登录</el-menu-item></el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </el-col>
          </el-menu>
          
        </el-header>
        <el-main>
        
          <router-view></router-view>
        </el-main>
      
        <el-footer>Footer</el-footer>
    </el-container>

  </div>
</template>

<script>
export default {
  data() {
    return {
      activeIndex: '1',
      activeIndex2: '1'
    };
  },
  mounted() {},
  methods: {

    //判断多次点击一个路由--如果点击次数多会报错，这个是用来解决这个问题
    handleSelect(item) {
      // console.log("this.$route.path",this.$route.path)
      // console.log("item",item)
      if (this.$route.path !== item) {
        this.$router.push(item);
      }
    }
  }
};
</script>




