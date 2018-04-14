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
              label="作业号"
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
              prop="description"
              width="180"
              label="描述">
            </el-table-column>
            <el-table-column
              prop="submissionNum"
              width="100"
              sortable
              label="已交人数">
            </el-table-column>

            <el-table-column
              prop="releaseTime"
              width="150"
              sortable
              label="发布时间">
            </el-table-column>
            <el-table-column
              label="操作"
              width="200">
              <template slot-scope="scope">
                <el-button type="primary" style="padding: 3px 4px 3px 4px;margin: 2px" size="mini"
                           @click="downLoadWork(scope.row)">
                  下载
                </el-button>
                <el-button type="primary" style="padding: 3px 4px 3px 4px;margin: 3px" size="mini"
                           @click="showStudentWork(scope.row)">
                  查看学生作业
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
    <el-dialog
      title="查看作业"
      style="padding: 0px;"
      :close-on-click-modal="false"
      :visible.sync="studentVisible"
      width="70%">
      <span  slot="title" class="dialog-title">
        <el-row>
          <span>查看作业</span>
        </el-row>
        <el-row style="margin-top: 10px">
          <span>班级：</span>
          <el-select v-model="classesNo" size="mini" clearable placeholder="请选择" style="width: 100px">
            <el-option
              v-for="item in classesList"
              :key="item.id"
              :label="item.classesName"
              :value="item.id">
            </el-option>
          </el-select>
          <el-button type="primary" size="mini" style="margin-left: 5px"
                     icon="el-icon-search" @click="searchWorkByClasses">搜索
          </el-button>
        </el-row>
      </span>
      <el-table
        :data="studentWorks"
        border
        stripe
        size="mini"
        style="width: 100%">
        <el-table-column
          prop="id"
          label="id"
          v-if="false">
        </el-table-column>
        <el-table-column
          type="index"
          label="序号"
          width="100">
        </el-table-column>
        <el-table-column
          prop="studentNo"
          width="120"
          align="left"
          sortable
          label="学号">
        </el-table-column>
        <el-table-column
          prop="studentName"
          width="100"
          sortable
          label="学生姓名">
        </el-table-column>
        <el-table-column
          prop="classesName"
          width="100"
          align="left"
          sortable
          label="班级">
        </el-table-column>
        <el-table-column
          prop="submissionTime"
          width="150"
          sortable
          label="提交时间">
        </el-table-column>
        <el-table-column
          prop="status"
          width="100"
          sortable
          label="状态">
        </el-table-column>
        <el-table-column
          label="操作"
          width="230">
          <template slot-scope="scope">
            <el-button type="primary" style="padding: 3px 4px 3px 4px;margin: 2px" size="mini"
                       @click="downLoadWork(scope.row)">
              下载
            </el-button>
              <el-select size="mini" style="width: 100px" v-model="status" placeholder="批改">
                <el-option key="2" label="合格" value="2">
                </el-option>
                <el-option key="-1" label="不合格" value="-1">
                </el-option>
              </el-select>


            <el-button type="primary" style="padding: 3px 4px 3px 4px;margin: 3px" size="mini"
                       @click="correctingStudentWork(scope.row)">
              批改
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <span slot="footer" class="dialog-footer">
            <el-button type="primary" size="mini" @click="cancelEdit">返回</el-button>
      </span>

    </el-dialog>

  </div>
</template>
<script>
  export default {
    data() {
      return {
        works: [],
        studentWorks: [],
        keyword: '',
        dialogTitle: '',
        teacherId: this.$store.state.user.id,
        classesList:[],
        classesNo:'',
        workNo:'',
        totalCount: -1,
        currentPage: 0,
        status:'2',
        dialogVisible: false,
        studentVisible: false,
        work: {
          id:'',
          workNo:'',
          workName: '',
          description:'',
          releaseTime:'',
          courseNo: '',
          courseName:'',
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
        var _this = this;
        this.workNo = row.workNo;
        this.$api.get("/workSubmission?currentPage=1&size=9999&workNo=" + row.workNo, null, res => {
          _this.studentWorks = res.records
        });
        this.$api.get("/classes/course?courseNo="+row.courseNo,null,res => {
          _this.classesList = res
        });
        this.studentVisible = true;
      },
      searchWorkByClasses() {
        var _this = this;
        this.$api.get("/workSubmission?currentPage=1&size=9999&workNo=" + this.workNo
          + "&classesNo="+this.classesNo, null, res => {
          _this.studentWorks = res.records
        });
      },
      /* 批改作业 */
      correctingStudentWork(row) {
        var _this = this;
        this.$api.post("/workSubmission/correcting",{'id':row.id, 'status': this.status}, res => {
          _this.$message.success("批改成功");
          _this.$api.get("/workSubmission?currentPage=1&size=9999&workNo=" + row.workNo, null, res => {
            _this.studentWorks = res.records
          });
        })
      },
      cancelEdit(){
        this.studentVisible = false;
        this.studentWorks = [];
        this.classesNo = '';
        this.workNo = '';
      },
      loadWorks(){
        var _this = this;
        this.$api.get("/workRelease?currentPage=" + this.currentPage + "&size=10&keyword=" + this.keyword
          + "&teacherNo=" + this.teacherId + "&professionNo=", null, res => {
          _this.totalCount = res.size;
          _this.works = res.records;
        })
      }
    }
  };
</script>
