<template>
  <div>
    <el-container>
      <el-header style="margin: 30px; padding: 0px;display:flex;justify-content:space-between;align-items: center">
        <div style="display: inline">
          <el-input
            placeholder="通过作业名搜索作业。。。"
            clearable
            @change="keywordsChange"
            style="width: 250px;margin: 0px;padding: 0px;"
            size="mini"
            @keyup.enter.native="searchWork"
            prefix-icon="el-icon-search"
            v-model="keyword">
          </el-input>
          <el-button type="primary" size="mini" style="margin-left: 5px" icon="el-icon-search" @click="searchWork">搜索
          </el-button>
        </div>
      </el-header>
      <el-main style="padding-left: 0px;padding-top: 0px">
        <div>
          <el-table
            :data="works"
            border
            stripe
            size="mini"
            style="width: 100%">
            <el-table-column
              type="index"
              label="序号"
              width="100">
            </el-table-column>
            <el-table-column
              prop="id"
              label="id"
              v-if="false">
            </el-table-column>
            <el-table-column
              prop="courseNo"
              label="courseNo"
              v-if="false">
            </el-table-column>
            <el-table-column
              prop="workNo"
              align="left"
              v-if="false">
            </el-table-column>
            <el-table-column
              prop="workName"
              width="150"
              sortable
              label="作业名">
            </el-table-column>
            <el-table-column
              prop="courseName"
              width="150"
              sortable
              label="课程名">
            </el-table-column>
            <el-table-column
              prop="teacherName"
              width="100"
              sortable
              label="教师">
            </el-table-column>
            <el-table-column
              prop="description"
              width="200"
              label="描述">
            </el-table-column>
            <el-table-column
              prop="releaseTime"
              width="150"
              sortable
              label="发布时间">
            </el-table-column>
            <el-table-column
              prop="status"
              width="150"
              sortable
              label="状态">
            </el-table-column>
            <el-table-column
              label="操作"
              width="200">
              <template slot-scope="scope">
                <el-button type="primary" style="padding: 3px 4px 3px 4px;margin: 2px" size="mini"
                           @click="downLoadWork(scope.row)">
                  下载作业
                </el-button>
                <el-button type="primary" style="padding: 3px 4px 3px 4px;margin: 2px" size="mini"
                           @click="uploadWork(scope.row)">
                  提交作业
                </el-button>
              </template>
            </el-table-column>
          </el-table>
          <div style="display: flex;justify-content: space-between;margin: 2px">
            <el-pagination
              background
              :page-size="10"
              :current-page="currentPage"
              @current-change="currentChange"
              layout="prev, pager, next"
              :total="totalCount">
            </el-pagination>
          </div>
        </div>
      </el-main>
    </el-container>
    <el-form :model="workSubmission" ref="updateWorkForm" style="margin: 0px;padding: 0px;">
      <div style="text-align: left">
        <el-dialog
          title="提交作业"
          style="padding: 0px;"
          :close-on-click-modal="false"
          :visible.sync="dialogVisible"
          width="30%">
          <el-form-item  prop="address">
            <el-upload
              class="upload-demo"
              ref="upload"
              :action = "uploadAction"
              :data="{type: '2', username: this.workSubmission.studentNo}"
              :limit="limit"
              :on-exceed="handleExceed"
              :on-success="handleSuccess"
              :auto-upload="false">
              <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
              <el-button style="margin-left: 10px;" size="small" type="success" @click="submitUpload">上传到服务器</el-button>
            </el-upload>
          </el-form-item>
          <el-form-item>
            <el-button @click="cancelEdit">取 消</el-button>
            <el-button type="primary" @click="submissionWork">确 定</el-button>
          </el-form-item>
        </el-dialog>
      </div>
    </el-form>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        works: [],
        keyword: '',
        professionId: this.$store.state.user.professionId,
        limit:1,
        uploadAction: 'http://127.0.0.1:8080/file/upload',
        totalCount: -1,
        currentPage: 0,
        dialogVisible: false,
        workSubmission: {
          workNo:'',
          studentNo: this.$store.state.user.id,
          address:''
        },
      };
    },
    mounted: function () {
      this.loadWorks();
    },
    methods: {
      keywordsChange(val){
        if (val === '') {
          this.loadWorks();
        }
      },
      searchWork(){
        this.loadWorks();
      },
      currentChange(currentChange){
        this.currentPage = currentChange;
        this.loadWorks();
      },
      downLoadWork(row) {
        window.location.href = "http://localhost:8080/file/download?address=" + row.address;
      },
      showStudentWork(row) {
        this.$router.replace({path:"/showSubmissionWork"})
      },
      handleSuccess(response){
        if (response.code === '200') {
          this.workSubmission.address = response.data;
          this.$message.success("文件上传成功");
        }
      },
      submitUpload() {
        this.$refs.upload.submit();
      },
      handleExceed() {
        this.$message.warning("只能选择一个文件上传")
      },
      uploadWork(row) {
        this.workSubmission.workNo = row.workNo;
        this.dialogVisible = true;
      },
      submissionWork() {
        var _this = this;
        this.$api.post("/workSubmission",this.workSubmission, res => {
          _this.$message.success("提交成功");
          this.loadWorks();
          this.workSubmission.address = '';
          this.$refs.upload.clearFiles();
          this.dialogVisible = false;
        });
      },
      cancelEdit(){
        this.dialogVisible = false;
        this.workSubmission.address = '';
        this.$refs.upload.clearFiles();
      },
      loadWorks(){
        var _this = this;
        this.$api.get("/workRelease?currentPage=" + this.currentPage + "&size=10&keyword=" + this.keyword
          + "&studentNo=" + this.workSubmission.studentNo+ "&professionNo="+this.professionId, null, res => {
          _this.totalCount = res.size;
          _this.works = res.records;
        })
      }
    }
  };
</script>
