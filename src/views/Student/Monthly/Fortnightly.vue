<template>
  <div>
    <div class="MonthlyBox1">
      <div
        class="forth2"
        style="
          width: 1200px;
          height: 70px;
          background-color: f2f6fc;
          margin: 0 auto;
          margin-top: 20px;
        "
      >
        <div class="lndivt" style="background-color: #f2f6fc">
          <el-breadcrumb separator="/">
            <el-breadcrumb-item >首页</el-breadcrumb-item>
            <el-breadcrumb-item>半月报</el-breadcrumb-item>
          </el-breadcrumb>
        </div>

        <div class="Monthly1" style="margin-bottom: 20px">
          <label for="" style="">请输入标题:</label>
          <el-input
            v-model="input"
            placeholder="请输入内容"
            style="width: 200px; margin-left: 20px"
          ></el-input>

          <label for="" style="width: 200px; margin-right: 40px"
            >请选择日期:</label
          >
          <el-select
            v-model="value"
            placeholder="请选择"
            style="width: 200px; margin-left: -100px"
          >
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.label"
            >
            </el-option>
          </el-select>

          <el-button
            type="primary"
            icon="el-icon-search"
            style="width: 80px; height: 40px; margin-left: 20px"
            @click="searchData111"
            >搜索</el-button
          >

          <!-- 添加月报按钮 -->
          <el-button type="success" @click="showAddDialog">添加月报</el-button>
        </div>
      </div>

      <div
        class="Monthly2"
        style="
          width: 1200px;
          height: 700px;
          background-color: white;
          margin: 0 auto;
          margin-top: 90px;
        "
      >
        <el-row :gutter="20">
          <el-col
            :span="8"
            v-for="(item, index) in cardData"
            :key="index"
            style="
              width: 200px;
              height: 200px;
              margin-left: 36px;
              margin-top: 35px;
              margin-bottom: 80px;
            "
          >
            <el-card
              :body-style="{ padding: '0px' }"
              style="margin-bottom: 20px;position: relative;"
            >
            <img src="../../../assets/月报.jpg" class="image" >
              <div class="MonthlyTp1">
                <div style="margin-bottom: 40px; position: absolute; left: 50px;top: 150px;font-size: 22px;">
                  <span v-if="item.score === -1">暂未评分</span>
                  <span v-else>分数为:{{ item.score }}</span>
                </div>
              </div>
              <div style="padding: 18px">
                <span v-if="item.halfTitle">{{ item.halfTitle }}</span>
                <span v-else
                  ><span style="color: red">文件:</span
                  >{{ item.textName }}</span
                >
                <div class="bottom clearfix">
                  <div v-if="!item.updateTime">
                    <time class="time" style="display: block">{{
                      formatDate(item.createTime)
                    }}</time>
                  </div>
                  <div v-else>
                    <time class="time" style="display: block">{{
                      formatDate(item.updateTime)
                    }}</time>
                  </div>

                  <!-- 修改月报按钮 -->
                  <el-button
                    type="text"
                    class="button"
                    style="margin-left: 10px; color: #e6a23c"
                    @click="showEditDialog(item)"
                    >修改月报</el-button
                  >
                  <!-- 查看详细按钮 -->

                  <el-button
                    type="text"
                    class="button"
                    @click="showDetailDialog(item)"
                    >查看详细</el-button
                  >
                </div>
              </div>
            </el-card>
          </el-col>
        </el-row>
        <el-empty
          v-if="cardData.length === 0"
          description="暂无数据"
          style="width: 100%; height: 600px; margin-top: 20px"
        ></el-empty>
      </div>

      <hr style="width: 1200px; margin: 0 auto; border: 1px solid #e4e7ed" />
      <div
        class="block"
        style="
          background-color: white;
          width: 1200px;
          height: 60px;
          margin: 0 auto;
        "
      >
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page.sync="currentPage1"
          :page-sizes="[10, 3, 6, 9]"
          :page-size="100"
          layout="sizes, prev, pager, next"
          :total="total"
          style="padding-top: 18px"
        >
        </el-pagination>
      </div>

      <div class="Monthly3"></div>

      <!-- 添加月报弹窗 -->
      <div>
        <el-dialog
          :visible.sync="showAddDialogData"
          title="添加半月报"
          width="50%"
          @close="cancelAddDialog()"
        >
          <!-- 弹窗内容 -->
          <el-form :model="addForm" ref="addForm" label-width="80px">
            <el-form-item label="标题">
              <el-input
                v-model="addForm.halfTitle"
                @input="handleInput"
                :disabled="inputDisabled"
              ></el-input>
            </el-form-item>
            <el-form-item label="内容">
              <el-input
                type="textarea"
                v-model="addForm.halfMonthDetails"
                @input="handleInput"
                :disabled="inputDisabled"
              ></el-input>
            </el-form-item>
            <el-form-item label="上传">
              <!-- 这里是上传组件，具体可以使用 element-ui 的 el-upload 组件 -->
              <el-upload
                action="/main/upload"
                :on-success="handleAvatarSuccess"
                :on-remove="handleRemove"
                :before-remove="beforeRemove"
                :limit="1"
                :on-exceed="handleExceed"
                :disabled="uploadDisabled"
                ref="mYupload"
              >
                <span v-show="isVisible" style="color: red; padding-left: 20px"
                  >已输入文本,不可上传</span
                >
                <el-button slot="trigger" size="small" type="primary"
                  >点击上传</el-button
                >
              </el-upload>
            </el-form-item>
          </el-form>
          <span slot="footer" class="dialog-footer">
            <el-button @click="cancelAddDialog()">取 消</el-button>
            <el-button type="primary" @click="saveAddMonthly()"
              >确 定</el-button
            >
          </span>
        </el-dialog>
      </div>

      <!-- 修改月报弹窗 -->
      <el-dialog
        :visible.sync="showEditDialogData"
        title="修改月报"
        width="50%"
        @close="handleClose"
      >
        <div v-if="!editForm.textName">
          <!-- 弹窗内容 -->
          <el-form :model="editForm" ref="editForm" label-width="80px">
            <el-form-item label="标题">
              <el-input v-model="editForm.halfTitle"></el-input>
            </el-form-item>
            <el-form-item label="内容">
              <el-input
                type="textarea"
                v-model="editForm.halfMonthDetails"
              ></el-input>
            </el-form-item>
          </el-form>
          <span slot="footer" class="dialog-footer">
            <el-button @click="showEditDialogData = false">取 消</el-button>
            <el-button type="primary" @click="saveEditMonthly">确 定</el-button>
          </span>
        </div>
        <div v-else>
          <el-form>
            <el-form-item label="上传">
              <!-- 这里是上传组件，具体可以使用 element-ui 的 el-upload 组件 -->
              <el-upload
                action="/main/upload"
                :on-success="handleAvatarSuccess"
                :limit="1"
                :on-exceed="handleExceed"
                ref="mYupload"
              >
                <el-button slot="trigger" size="small" type="primary"
                  >点击上传</el-button
                >
              </el-upload>
            </el-form-item>
          </el-form>
          <span slot="footer" class="dialog-footer">
            <el-button @click="showEditDialogData = false">取 消</el-button>
            <el-button type="primary" @click="saveEditMonthly">确 定</el-button>
          </span>
        </div>
      </el-dialog>

      <!-- 查看详细弹窗 -->
      <el-dialog
        :visible.sync="showDetailDialogData"
        title="查看详细"
        width="50%"
      >
        <!-- 使用 v-if 判断标题是否为空 -->
        <div v-if="!detailForm.textName">
          <!-- 弹窗内容 -->
          <el-form :model="detailForm" label-width="80px">
            <el-form-item label="标题">
              <span>{{ detailForm.halfTitle }}</span>
            </el-form-item>
            <el-form-item label="内容">
              <span>{{ detailForm.halfMonthDetails }}</span>
            </el-form-item>
            <el-form-item label="时间">
              <span>{{ detailForm.createTime }}</span>
            </el-form-item>
            <el-form-item label="成绩">
              <span v-if="detailForm.score === -1">暂未评分</span>
              <span v-else>{{ detailForm.score }}</span>
            </el-form-item>
          </el-form>
          <!-- 关闭弹窗按钮 -->
          <span slot="footer" class="dialog-footer">
            <el-button @click="showDetailDialogData = false">关 闭</el-button>
          </span>
        </div>

        <!-- 如果标题为空，显示一个按钮 -->
        <div v-else>
          <div style="margin-bottom: 20px">
            <label for="" style="font-size: 20px; margin-right: 20px"
              >文件名</label
            ><span style="font-size: 20px; color: red">{{
              detailForm.textName
            }}</span>
            <p></p>
          </div>
          <el-button type="primary" @click="downloadFile(detailForm.textName)"
            >下载按钮</el-button
          >
          <el-button @click="showDetailDialogData = false">关闭</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import axios from "axios";
export default {
  data() {
    return {
      uploadDisabled: false, // 控制上传组件的禁用状态
      inputDisabled: false, // 控制输入框的禁用状态
      inputContent: "", // 输入框内容

      isVisible: false,

      input: "",
      value: "",
      currentPage1: 1,
      total: 0,
      options: [
        { value: "选项1", label: "全部" },
        { value: "选项2", label: "2024" },
        { value: "选项3", label: "2023" },
        { value: "选项4", label: "2022" },
      ],
      searchData: [],
      cardData: [],
      fileName: "",

      fileList: [],

      currentDate: new Date(),
      showAddDialogData: false, // 控制添加月报弹窗显示
      showEditDialogData: false, // 控制修改月报弹窗显示
      showDetailDialogData: false, // 控制查看详细弹窗显示
      addForm: {
        halfTitle: "",
        halfMonthDetails: "",
        studentNo: localStorage.getItem("userName"),
        textName: "",
      },
      editForm: {},
      page: { page: 1, pageSize: 10 },
      detailForm: {
        halfTitle: "",
        halfMonthDetails: "",
        studentNo: localStorage.getItem("userName"),
        createTime: "",
        updateTime: "",
        score: "",
        textName: "",
      },
    };
  },

  mounted() {
    // this.search();
    this.searchData111()
    //this.handleSizeChange(10);
    this.value = this.options[0].label;
  },

  methods: {

     //清空上传数据
     clearFiles() {
      this.$refs["mYupload"].clearFiles();
    },
    handleClose(){
      
      if(this.editForm.textName !==""){
        this.clearFiles()
      }else{
        this.editForm = {
          halfTitle: "",
          halfMonthDetails: "",
          studentNo: localStorage.getItem("userName"),
          textName: "",
      }; // 清空表单数据
      
      }
      this.searchData111()
      this.showEditDialogData=false
    },
    handleInput() {
      // 监听输入框输入事件
      if (
        this.addForm.halfTitle !== "" ||
        this.addForm.halfMonthDetails !== ""
      ) {
        // 如果标题输入框内容不为空
        this.uploadDisabled = true; // 禁用上传组件
        this.isVisible = true;
      } else {
        this.uploadDisabled = false; // 否则启用上传组件
        this.isVisible = false;
      }
    },
    handleRemove(file, fileList) {
      console.log("removed file:", file);
      // 在这里可以处理删除文件的逻辑
      this.addForm.halfTitle = "";
    },

    cancelAddDialog() {
      this.clearFiles();
      // this.addForm.halfTitle = ""; // 清空标题输入框内容
      // this.addForm.halfMonthDetails = ""; // 清空内容输入框内容
      this.addForm.textName = ""; // 清空文件名
      this.inputDisabled = false; // 启用输入框
      this.uploadDisabled = false; // 启用上传组件
      this.isVisible = false; // 隐藏提示框
      this.showAddDialogData = false; // 不显示添加月报弹窗
      this.addForm = {
        halfTitle: "",
        halfMonthDetails: "",
        studentNo: localStorage.getItem("userName"),
        textName: "",
      }; // 清空表单数据
    },

   
    handleExceed(files, fileList) {
      this.$message.warning(
        `当前限制选择 1 个文件，本次选择了 ${files.length} 个文件，共选择了 ${
          files.length + fileList.length
        } 个文件`
      );
    },

    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
      this.page.pageSize = val;
      this.searchData111();
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      this.page.page = val;
      this.searchData111();
    },
    async downloadFile(row) {
      console.log(row);
      try {
        // 请求文件数据
        const response = await fetch(`/main/download?name=${row.textName}`);
        const data = await response.blob();
        // 创建临时 URL
        const tempUrl = URL.createObjectURL(data);
        console.log(tempUrl);
        // 创建隐藏的 <a> 标签并触发点击事件
        const link = document.createElement("a");
        link.href = tempUrl;
        link.style.display = "none";
        link.download = this.detailForm.textName;
        document.body.appendChild(link);
        link.click();

        // 释放临时 URL
        document.body.removeChild(link);
        URL.revokeObjectURL(tempUrl);
      } catch (error) {
        console.error("下载文件失败：", error);
      }
    },
    beforeRemove(file, fileList) {
      this.inputDisabled = false;
      return true;
    },
    handleAvatarSuccess(file, fileList) {
      console.log(13);
      console.log(file, fileList);
      this.addForm.textName = file.data;
      this.editForm.textName = file.data;
      
      this.addForm.halfTitle = this.addForm.textName;
      
      if (file.data != "") {
        this.inputDisabled = true;
      } else {
        this.inputDisabled = false;
      }
    },
    // 搜索数据方法
    searchData111() {
      var data = this.value;
      console.log(data);
      if (this.value == "全部") {
        data = "";
      }

      axios
        .get("/main/selectHalf", {
          params: {
            halfTitle: this.input,
            createTime: data,
            studentNo: localStorage.getItem("userName"),
            page: this.page.page,
            court: this.page.pageSize,
          },
        })
        .then((res) => {
          this.cardData = res.data.data.rows;
          this.total=res.data.data.total
          console.log(res,'to');
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
        });
    },

    getData() {
      axios
        .get("/main/selectHalf", {
          params: { studentNo: localStorage.getItem("userName") },
        })

        .then((res) => {
          this.cardData = res.data.data.rows;
          this.total = res.data.data.total;
          console.log(res.data);
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
        });
    },

    // 添加月报弹窗
    showAddDialog() {
      this.showAddDialogData = true;
    },
    // 保存添加月报
    saveAddMonthly() {
     
      if(this.inputDisabled==false){
        if (this.addForm.halfTitle=="" || this.addForm.halfMonthDetails=="") {
        this.$message.error('标题和内容不能为空！');
        return;
      }
      }else if(this.editForm.halfTitle =="" && this.editForm.halfMonthDetails==""){
        this.$message.error('内容不能为空！');
        return ;
      }
      
      
      // 这里处理保存添加月报的逻辑
      this.showAddDialogData = false;
      axios
        .post("/main/insertHalf", JSON.stringify(this.addForm), {
          headers: {
            "Content-Type": "application/json",
          },
        })
        .then((res) => {
          if (res.data.code == 1) {
            this.cancelAddDialog();
            this.searchData111();
            this.$message({
              message: "添加成功！",
              type: "success",
            });
          }
        });
    },
    // 修改月报弹窗
    showEditDialog(item) {
      // 填充修改月报表单数据
      this.editForm = item;

      // halfMonthDetails

      // 显示修改月报弹窗
      this.showEditDialogData = true;
    },
    // 修改月报
    saveEditMonthly() {
      if(this.editForm.halfTitle =="" || this.editForm.halfMonthDetails==""){
        this.$message.error('内容不能为空！');
        return ;
      }else if(this.editForm.halfTitle =="" && this.editForm.halfMonthDetails==""){
        this.$message.error('内容不能为空！');
        return ;
      }

      this.editForm.halfTitle = this.addForm.textName;
      console.log("addForm修改1",this.addForm);
      axios
        .put("/main/updateHalf", JSON.stringify(this.editForm), {
          headers: {
            "Content-Type": "application/json",
          },
        })
        .then((res) => {
          console.log(res);
          if (res.data.code === 1) {
           
            this.$message({
              message: "修改成功！",
              type: "success",
            });
            // 关闭修改月报弹窗
            this.showEditDialogData = false;
            console.log("addForm修改2",this.addForm);
            
            // 刷新数据
            // this.getData();
          } else {
            this.$message.error('修改失败，请稍后重试！');
          }
        })
        .catch((error) => {
          console.error("Error updating monthly report:", error);
          this.$message.error('修改失败，请稍后重试！');
        });
    },
    // 查看详细弹窗
    showDetailDialog(item) {
      console.log(item);
      this.detailForm.textName = item.textName;
      console.log(this.textName);
      // 填充查看详细表单数据
      this.detailForm.halfTitle = item.halfTitle;
      this.detailForm.halfMonthDetails = item.halfMonthDetails;
      this.detailForm.createTime = this.formatDate(item.createTime);
      this.detailForm.updateTime = this.formatDate(item.updateTime);
      this.detailForm.score = item.score;
      // 显示查看详细弹窗
      this.showDetailDialogData = true;
    },
    handleAddUploadSuccess() {
      // 处理添加月报上传成功的逻辑
    },
    handleEditUploadSuccess() {
      // 处理修改月报上传成功的逻辑
    },
    formatDate(dateString) {
      const date = new Date(dateString);
      const year = date.getFullYear();
      const month = date.getMonth() + 1;
      const day = date.getDate();
      return `${year}-${month}-${day}`;
    },
  },
};
</script>

<style scoped>
.el-upload-list__item-name {
  display: none;
}
.el-form-item__label {
  font-size: 40px;
}
.Monthly1 {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100px;
  margin-top: 20px;
  background-color: white;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}
.Monthly1 .content {
  display: flex;
  align-items: center;
}

.time {
  font-size: 13px;
  color: #999;
}

.bottom {
  line-height: 12px;
}

.button {
  padding: 0;
  float: right;
}

.image {
  width: 100%;
  display: block;
}

.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}

.clearfix:after {
  clear: both;
}

.MonthlyTp1 {
  width: 100px;
  height: 50px;
  /* background-image: url("../../../assets/月报.jpg"); 这里设置背景图片的路径 */
  background-size: cover; /* 可选：设置背景图片的尺寸 */
  background-position: center; /* 可选：设置背景图片的位置 */
  background-repeat: no-repeat; /* 可选：设置背景图片不重复 */
}

.MonthlyTp1 {
  width: 100px;
  height: 50px;
  /* background-image: url("../../../assets/月报.jpg"); */
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  display: flex; /* 使用 Flexbox 布局 */
  justify-content: center; /* 水平居中 */
  align-items: center; /* 垂直居中 */
  font-size: 40px;
  color: red;
}
</style>
