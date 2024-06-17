<!-- 修改 -->

<template>
  <div>
    <el-dialog
  title="签到--编辑规则"
  :visible.sync="editRule.editDialog"
  width="40%"
  :before-close="handleEditRule"
  class="addbox"
  center
>
  <el-form
    :model="editRule.ruleForm"
    :rules="editRule.rules"
    ref="editRules"
    label-width="100px"
    class="demo-ruleForm"
  >
    <el-row :gutter="24">
      <el-form-item label="任务名称:" prop="ruleName">
        <el-row :gutter="20">
          <el-col :span="10" class="checkRule_list">
            <el-input
              placeholder="请输入"
              v-model="editRule.ruleForm.ruleName"
            ></el-input>
          </el-col>
        </el-row>
      </el-form-item>
      <el-row :gutter="4">
        <el-col :span="12">
          <el-form-item label="任务内容:" prop="inviteNum">
            <el-col :span="4" class="checkRule_list">每邀请</el-col>
            <el-col :span="13" class="checkRule_list">
              <el-input
                placeholder="请输入"
                v-model="editRule.ruleForm.inviteNum"
              ></el-input>
            </el-col>
            <el-col :span="2" class="checkRule_list">人注册</el-col>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="可获积分:" prop="integral">
            <el-col :span="4" class="checkRule_list">送</el-col>
            <el-col :span="13" class="checkRule_list">
              <el-input
                placeholder="请输入"
                v-model="editRule.ruleForm.integral"
              ></el-input>
            </el-col>
            <el-col :span="3" class="checkRule_list">积分</el-col>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col class="addcard_seleted">
          <el-form-item label="领取限制:" prop="channel">
            <el-row
              :gutter="20"
              style="
                display: flex;
                flex-direction: row;
                align-items: center;
              "
            >
              <el-col>
                <el-radio v-model="editRule.ruleForm.channel" label="0"
                  >仅限首次</el-radio
                >
                <el-radio v-model="editRule.ruleForm.channel" label="1"
                  >每次</el-radio
                >
              </el-col>
            </el-row>
          </el-form-item>
        </el-col>
      </el-row>
    </el-row>
  </el-form>
  <span slot="footer" class="checkRule_footer">
    <el-button @click="editRuleCancle">取 消</el-button>
    <el-button type="primary" @click="submitEditRule('editRules')"
      >确 定</el-button
    >
  </span>
</el-dialog>

  </div>
</template>

<script>


export default{
    data() {
  return {
    tableData: [],//列表
    //编辑规则
    editRule: {
      editDialog: false, //弹窗
      ruleForm: {
        integral: "",
        inviteNum: "",
        ruleName: "",
        channel: "0",
      },
      rules: {
        integral: [
          { required: true, message: "请输入", trigger: "blur" },
          // { min: 1, max: 10, message: '长度在10个字符以内', trigger: 'blur' }
          {
            pattern: /^[1-9]+[0-9]*$/,
            message: "请输入正整数",
            trigger: "blur",
          },
        ],
        inviteNum: [
          { required: true, message: "请输入", trigger: "blur" },
          // { min: 1, max: 10, message: '长度在10个字符以内', trigger: 'blur' }
          {
            pattern: /^[1-9]+[0-9]*$/,
            message: "请输入正整数",
            trigger: "blur",
          },
        ],
        ruleName: [
          {
            required: true,
            message: "请输入任务名称（限制15字）",
            trigger: "blur",
          },
          { min: 1, max: 15, message: "长度在15个字符以内", trigger: "blur" },
        ],
        channel: [
          { required: true, message: "请选择类型", trigger: "change" },
          //   { validator: validActionStatus, trigger: "change" }
        ],
      },
    },
  }
},
created() {
  this.getData();
},
methods: {
    //查询列表接口
    getData() {
      get("/sys/integral/invite/sel").then((res) => {
        if (res.code === 200) {
          res.data.forEach((item) => {
            if (item.updateTime == null) {
              item.updateTime = "";
            } else {
              item.updateTime = moment(item.updateTime).format(
                "YYYY-MM-DD HH:mm:ss"
              );
            }
          });
          console.log(res.data);
          this.tableData = res.data;
        } else {
          this.tableData = [];
        }
      });
    },
  //获取编辑详情
  //注意：获取详情时候radio要加上+“”：this.editRule.ruleForm.channel = scope.row.channel + "";
    editDialogEdit(scope) {
	     this.editRule.editDialog = true;
	     this.editRule.ruleForm.id = scope.row.id;
	     this.editRule.ruleForm.integral = scope.row.integral;
	     this.editRule.ruleForm.inviteNum = scope.row.inviteNum;
	     this.editRule.ruleForm.ruleName = scope.row.ruleName;
	     this.editRule.ruleForm.channel = scope.row.channel + "";
   },
   //编辑规则
   submitEditRule(ruleForm) {
     this.$refs[ruleForm].validate((valid) => {
       if (valid) {
         let params = {
           id: this.editRule.ruleForm.id,
           integral: this.editRule.ruleForm.integral,
           inviteNum: this.editRule.ruleForm.inviteNum,
           ruleName: this.editRule.ruleForm.ruleName,
           channel: this.editRule.ruleForm.channel,
         };
         put("/sys/integral/invite/update", params).then((res) => {
           if (res.code === 200) {
             this.$message.success("修改成功！");
             this.editRuleCancle();
             this.getData();
           } else {
             this.$message.error(res.data);
           }
         });
       }
     });
   },
   //编辑规则弹窗清空
   editRuleCancle() {
     this.editRule.editDialog = false;
     this.editRule.ruleForm.integral = "";
     this.editRule.ruleForm.inviteNum = "";
     this.editRule.ruleForm.ruleName = "";
     this.editRule.ruleForm.channel = "0";
     this.$refs["editRules"].resetFields();//清除校验
   },
   //点击蒙层清空弹窗
   handleEditRule(done) {
     this.editRule.ruleForm.integral = "";
     this.editRule.ruleForm.inviteNum = "";
     this.editRule.ruleForm.ruleName = "";
     this.editRule.ruleForm.channel = "0";
     this.$refs["editRules"].resetFields();//清除校验
     done();
   },
}


};
</script>
