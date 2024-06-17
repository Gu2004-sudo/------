<template>
    <div class="UserManage">
        <div style="margin-bottom: 20px;">
            <el-breadcrumb separator-class="el-icon-arrow-right">
                <el-breadcrumb-item style="font-weight: bold;">首页</el-breadcrumb-item>
                <el-breadcrumb-item>岗位审核</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="UserManage_box">
            <div class="UserManage_Search">
                <el-form :inline="true" :model="formInline" style="margin: 0px auto;">


                    <el-form-item label="公司名称" style="margin-left: 20px;">
                        <el-input v-model="formInline.companyName" placeholder="支持模糊查询"></el-input>
                    </el-form-item>

                    <el-form-item>
                        <el-button type="primary" @click="getData">查询</el-button>
                        <el-button type="info" @click="handleReset">重置</el-button>
                    </el-form-item>
                </el-form>
            </div>
            <div>
                <!-- <div style="text-align: right;width: 90%;margin: 0 auto;">
                    <el-button type="primary" icon="el-icon-plus" circle @click="dialogFormVisible = true"></el-button>
                </div> -->
                <el-table :data="tableData" style="width: 90%;border-radius: 5px;margin: 0 auto;">
                    <el-table-column prop="companyName" label="公司名" width="180"
                        style="overflow: hidden;white-space: nowrap;text-overflow: ellipsis;">
                    </el-table-column>
                    <el-table-column prop="postNature" label="岗位性质" width="120">
                    </el-table-column>
                    <el-table-column prop="postName" label="岗位名称" width="180">
                    </el-table-column>
                    <el-table-column prop="postResponsibility" label="岗位要求" width="180">
                    </el-table-column>
                    <el-table-column prop="postSalary" label="薪资">
                    </el-table-column>
                    <el-table-column prop="numberPeople" label="招聘人数">
                    </el-table-column>
                    <el-table-column prop="statu" label="状态">
                    </el-table-column>
                    <el-table-column label="操作">
                        <template slot-scope="scope">
                            <el-link :underline="false" type="primary" style="margin-right: 10px;"
                                @click="pass(scope.row)">通过</el-link>

                            <el-link :underline="false" type="danger" @click="reject(scope.row)">驳回</el-link>
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
            //表单验证规则
            rules: {
                userName: [
                    { required: true, message: '请输入用户名', trigger: 'blur' },
                    { min: 1, max: 20, message: '长度在 1 到 20 个字符', trigger: 'blur' }
                ],
                name: [
                    { required: true, message: '请输入姓名', trigger: 'blur' }
                ],
                phone: [{ required: true, message: '请输入手机号', trigger: 'blur' }, { pattern: /^1[345789]\d{9}$/, message: '手机号码格式不正确', trigger: 'blur' }],
                email: [{ required: true, message: '请输入邮箱', trigger: 'blur' }, { pattern: /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/, message: '邮箱格式不正确', trigger: 'blur' }],
                avatar: [
                    { required: true, message: '请上传头像', trigger: 'blur' }
                ],
                role: [
                    { required: true, message: '请填写身份', trigger: 'blur' }
                ],
                password: [
                    { required: true, message: '请输入密码', trigger: 'blur' }
                ],
            },

            dialogFormVisible: false, //添加用户弹窗
            statusList: [],//状态下拉列表

            id: '',//当前登录用户id
            //查询条件
            formInline: {
                companyName: '',
            },
            //创建人下拉框
            nameList: [],

            currentPage: 1,//当前页
            formLabelWidth: '120px',//文本宽度
            total: 0,
            // 分页
            page: {
                page: 1,
                count: 5,
            },
            // 表格数据
            tableData: []
        }
    },
    created() {
        this.id = localStorage.getItem('userID')
    },
    mounted() {
        this.getData();
    },
    methods: {
        reject(row) {
            const data = {
                postID: row.postID,
                statu: '未通过'
            }
            axios.post(`/main/editPostStatu`, JSON.stringify(data), {
                headers: {
                    "Content-Type": "application/json",
                }
            }).then(res => {
                this.$message({
                    message: '操作成功',
                    type: 'success'
                });
            })
            this.getData()
        },
        pass(row) {
            const data = {
                postID: row.postID,
                statu: '通过'
            }
            axios.post(`/main/editPostStatu`, JSON.stringify(data), {
                headers: {
                    "Content-Type": "application/json",
                }
            }).then(res => {
                this.$message({
                    message: '操作成功',
                    type: 'success'
                });
            })
            this.getData()
        },
        handleReset() {
            this.formInline.companyName = '',
                this.getData();
        },
        getData() {
            axios.get("/main/selectPostByCompanyName", { params: { page: this.page.page, court: this.page.count, companyName: this.formInline.companyName, statu: '待审核' } }).then(res => {
                this.tableData = res.data.data.rows;
                this.total = res.data.data.total
                console.log(res)
            })
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