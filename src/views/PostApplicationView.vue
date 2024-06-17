<template>
    <div class="UserManage">
        <div style="margin-bottom: 20px;">
            <el-breadcrumb separator-class="el-icon-arrow-right">
                <el-breadcrumb-item style="font-weight: bold;">用户管理</el-breadcrumb-item>
                <el-breadcrumb-item>用户信息</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="UserManage_box">
            <div class="UserManage_Search">
                <el-form :inline="true" :model="formInline" style="margin: 0px auto;">
                    <el-form-item label="公司名称">
                        <el-input v-model="formInline.companyName" placeholder="支持模糊查询"></el-input>
                    </el-form-item>

                    <el-form-item label="状态">
                        <el-select v-model="formInline.status" placeholder="状态">
                            <el-option label="待审核" value="待审核"></el-option>
                            <el-option label="通过" value="通过"></el-option>

                        </el-select>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="getData">查询</el-button>
                        <el-button type="info" @click="handleReset">重置</el-button>
                    </el-form-item>
                </el-form>
            </div>
            <div>
                <el-table :data="tableData" style="width: 90%;border-radius: 5px;margin: 0 auto;">
                    <el-table-column prop="postCompany" label="公司名称" width="160"
                        style="overflow: hidden;white-space: nowrap;text-overflow: ellipsis;">
                    </el-table-column>
                    <el-table-column prop="postName" label="岗位名称" width="160">
                    </el-table-column>
                    <el-table-column label="工作要求" width="160">
                        <template slot-scope="scope">
                            <span style=" white-space: nowrap;overflow: hidden;text-overflow: ellipsis;">
                                {{ scope.row.postResponsibility }}</span>
                        </template>

                    </el-table-column>
                    <el-table-column prop="postContactInformation" label="联系方式" width="160">
                    </el-table-column>
                    <el-table-column label="工作地点" width="160">
                        <template slot-scope="scope">
                            <span style=" white-space: nowrap;overflow: hidden;text-overflow: ellipsis;">
                                {{ scope.row.address }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="申请状态" width="160">
                        <template slot-scope="scope">
                            <span style=" white-space: nowrap;overflow: hidden;text-overflow: ellipsis;">
                                {{ scope.row.statu }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="操作" width="150">
                        <template slot-scope="scope">
                            <el-button v-if="scope.row.statu == '待审核'" size="mini"
                                @click="editJob(scope.row)">通过</el-button>
                            <el-button v-else size="mini" disabled title="该岗位已经通过！">通过</el-button>
                            <el-button v-if="scope.row.statu == '通过' " disabled size="mini"
                                title="该岗位已经通过！" type="danger">拒绝</el-button>
                            <el-button v-else-if="scope.row.statu == '已拒绝'" disabled size="mini" title="该岗位已经拒绝！"
                                type="danger">拒绝</el-button>
                            <el-button v-else size="mini" type="danger" @click="deleteJob(scope.row)">拒绝</el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                    :current-page="currentPage" :page-sizes="[5, 10, 15, 20]" :page-size="page.count"
                    layout="total, sizes, prev, pager, next, jumper" :total="total" class="UserManage_page">
                </el-pagination>
            </div>

        </div>
    </div>
</template>


<script>
import axios from "axios";
export default {
    data() {
        return {


            dialogFormVisible: false, //添加用户弹窗

            id: '',//当前登录用户id
            //查询条件
            formInline: {
                companyName: '',
                status: '',
            },
            formLabelWidth: '120px',//文本宽度
            total: 0,
            // 分页
            page: {
                page: 1,
                count: 5,
            },
            // 表格数据
            tableData: [],
            currentPage: 1,
        }
    },
    created() {
        this.id = localStorage.getItem('userID')
    },
    mounted() {
        this.getData();
    },
    methods: {
        deleteJob(row) {
            if (confirm("您确定要拒绝这个岗位吗?")) {
                this.$set(row, 'statu', '已拒绝')
                console.log(row)
                axios.put("/main/updatePost", JSON.stringify(row), {
                    headers: {
                        'Content-Type': 'application/json',
                    }
                }).then(res => {
                    if (res.data.data == 1) {
                        this.$message({
                            type: "success",
                            message: "执行成功"
                        })
                        this.getData()
                    }
                })
            }
        },
        editJob(row) {
            if (confirm("您确定要通过这个岗位吗?")) {
                this.$set(row, 'statu', '通过')
                console.log(row)
                axios.put("/main/updatePost", JSON.stringify(row), {
                    headers: {
                        'Content-Type': 'application/json',
                    }
                }).then(res => {
                    if (res.data.data == 1) {
                        this.$message({
                            type: "success",
                            message: "通过成功"
                        })
                        this.getData()
                    }
                })
            }


        },
        handleSizeChange(val) {
            this.page.count = val;
            this.getData();
        },
        handleCurrentChange(val) {
            this.page.page = val;
            this.getData();
        },
        getData() {
            this.tableData = []
            axios.get("/main/selectPostByCompanyNameAndStatus", { params: { page: this.page.page, count: this.page.count, companyName: this.formInline.companyName, status: this.formInline.status } }).then(res => {
                console.log(res, 'msg');
                this.total = res.data.data.total
                this.tableData = res.data.data.rows;
                console.log(this.tableData)
            })
        },
        handleReset() {
            this.formInline.status = ''
            this.formInline.companyName = ''

            this.getData()
        }
    },
}
</script>
<style scoped>
.UserManage_box {
    box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04);
    padding: 20px;
    border-radius: 10px;
}
</style>