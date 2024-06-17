<template>
    <div style="width: 100%; height: 100%;">
        <div style="margin-top: 20px;">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>业务管理</el-breadcrumb-item>
                <el-breadcrumb-item>实习就业</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        
        <el-tabs v-model="activeName" tab-position="left" @tab-click="handleClick" class="shixiTabs">
            <el-tab-pane label="实习" name="first"><shiXiView></shiXiView></el-tab-pane>
            <el-tab-pane label="就业" name="second"><jiuYeView></jiuYeView></el-tab-pane>
        </el-tabs>
    </div>
</template>
<script>
import axios from "axios";
import shiXiView from "./shiXiView.vue";
import jiuYeView from "./jiuYeView.vue";
export default {
    components: {shiXiView,jiuYeView},
    data() {
        return {
            className: '',
            activeName: 'first'
        }
    },
    mounted() {
        this.className = this.$route.query.className
        if (this.$route.path != '/main/shiXiAndJiuYe/shiXiView')
            this.$router.push('/main/shiXiAndJiuYe/shiXiView?className=' + this.className)
       
    },
    methods: {
        handleClick(tab, event) {
            console.log(tab, event);
        },
       
        isExs() {
            this.expandedRowIndex = -1;
        },
        
    },

}

</script>

<style scoped>
::v-deep .el-tabs__header,.is-left,.el-tabs__nav {
   margin-top: 10%;
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