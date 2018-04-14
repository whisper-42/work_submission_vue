<template>
  <div style="margin-top: 30px;">
    <el-container>
      <el-form :model="workRelease" :rules="rules" ref="workRelease" label-width="100px" class="demo-ruleForm">
        <el-form-item label="作业名称" prop="workName">
          <el-input v-model="workRelease.workName"></el-input>
        </el-form-item>
        <el-form-item label="所属课程" prop="courseNo">
          <el-select v-model="workRelease.courseNo" clearable style="width: 150px" size="mini" placeholder="请选择课程">
            <el-option
              v-for="item in courseList"
              :key="item.id"
              :label="item.courseName"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="作业描述" prop="description">
          <el-input type="textarea" v-model="workRelease.description"></el-input>
        </el-form-item>
        <el-form-item label="选择作业" prop="address">
          <el-upload
            class="upload-demo"
            ref="upload"
            :action = "uploadAction"
            :data="{type:'1',username: teacherId}"
            :limit="limit"
            :on-exceed="handleExceed"
            :on-success="handleSuccess"
            :auto-upload="false">
            <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
            <el-button style="margin-left: 10px;" size="small" type="success" @click="submitUpload">上传到服务器</el-button>
          </el-upload>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('workRelease')">立即发布</el-button>
          <el-button @click="resetForm('workRelease')">重置</el-button>
        </el-form-item>
      </el-form>
    </el-container>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        workRelease: {
          workName: '',
          courseNo: '',
          description: '',
          address: ''
        },
        teacherId: this.$store.state.user.id,
        courseList: [],
        /* 上传文件 */
        limit:1,
        uploadAction: 'http://127.0.0.1:8080/file/upload',
        rules: {
          workName: [
            { required: true, message: '请输入作业名', trigger: 'change' }
          ],
          courseNo: [
            { required: true, message: '请选择课程', trigger: 'change' }
          ],
          address: [
            { required: true, message: '请选择文件', trigger: 'change' }
          ]
        }
      };
    },
    mounted: function () {
      this.loadCourseList();
    },
    methods: {
      handleSuccess(response){
        if (response.code === '200') {
          this.workRelease.address = response.data;
          this.$message.success("文件上传成功");
        }
      },
      handleExceed() {
        this.$message.warning("只能选择一个文件上传")
      },
      submitUpload() {
        this.$refs.upload.submit();
      },
      loadCourseList() {
        var _this = this;
        this.$api.get("/course?currentPage=1&size=9999&teacherNo=" + this.teacherId, null, res => {
          _this.courseList = res.records
        })
      },
      submitForm(formName) {
        var _this = this;
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.$api.post("/workRelease", this.workRelease, res => {
              _this.$message.success("发布成功");
              _this.resetForm('workRelease')
            })
          } else {
            return false;
          }
        });
      },
      resetForm(formName) {
        this.$refs.upload.clearFiles();
        this.$refs[formName].resetFields();
      }
    }
  }
</script>
