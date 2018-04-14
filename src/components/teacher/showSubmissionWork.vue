<template>
  <div>
    <el-container>
      <el-header style="margin: 30px; padding: 0px;display:flex;justify-content:space-between;align-items: center">
        <div style="display: inline">
          <el-row>
            <el-input
              placeholder="通过作业名搜索作业。。。"
              clearable
              @change="keywordsChange"
              style="width: 250px;margin: 0px;padding: 0px;"
              size="mini"
              @keyup.enter.native="searchWork"
              prefix-icon="el-icon-search"
              v-model="searchCondition.keyword">
            </el-input>
            <el-button type="primary" size="mini" style="margin-left: 10px" icon="el-icon-search" @click="searchWork">搜索
            </el-button>
            <el-button type="primary" size="mini" style="margin-left: 10px" icon="el-icon-refresh" @click="resetSearch">重置
            </el-button>
          </el-row>
          <el-row style="margin-top: 20px">
            <span>学生：</span>
            <el-select v-model="searchCondition.studentNo"  clearable size="mini" placeholder="请选择" style="width: 100px">
              <el-option
                v-for="item in studentList"
                :key="item.id"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
            <span >课程：</span>
            <el-select v-model="searchCondition.courseNo" clearable size="mini" placeholder="请选择" style="width: 100px">
              <el-option
                v-for="item in courseList"
                :key="item.id"
                :label="item.courseName"
                :value="item.id">
              </el-option>
            </el-select>
            <span >班级：</span>
            <el-select v-model="searchCondition.classesNo" clearable size="mini" placeholder="请选择" style="width: 100px">
              <el-option
                v-for="item in classesList"
                :key="item.id"
                :label="item.classesName"
                :value="item.id">
              </el-option>
            </el-select>
          </el-row>
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
              prop="studentName"
              width="100"
              sortable
              label="学生姓名">
            </el-table-column>
            <el-table-column
              prop="classesName"
              width="100"
              sortable
              label="班级">
            </el-table-column>
            <el-table-column
              prop="status"
              width="100"
              sortable
              label="状态">
            </el-table-column>
            <el-table-column
              prop="releaseTime"
              width="150"
              sortable
              label="发布时间">
            </el-table-column>
            <el-table-column
              prop="submissionTime"
              width="150"
              sortable
              label="提交时间">
            </el-table-column>
            <el-table-column
              label="操作"
              width="195">
              <template slot-scope="scope">
                <el-button type="primary" style="padding: 3px 4px 3px 4px;margin: 2px" size="mini"
                           @click="downLoadWork(scope.row)">
                  下载
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
  </div>
</template>
<script>
  export default {
    data() {
      return {
        works: [],
        dialogTitle: '',
        teacherId: this.$store.state.user.id,
        studentList: this.$store.state.students,
        courseList: this.$store.state.courses,
        classesList: this.$store.state.classess,
        searchCondition:{
          keyword: '',
          studentNo:'',
          courseNo:'',
          classesNo:''
        },
        totalCount: -1,
        currentPage: 0,
        dialogVisible: false,
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
      resetSearch() {
        this.searchCondition.keyword = '';
        this.searchCondition.classesNo = '';
        this.searchCondition.studentNo = '';
        this.searchCondition.courseNo = '';
      },
      downLoadWork(row) {
        window.location.href = "http://localhost:8080/file/download?address=" + row.address;
      },
      loadWorks(){
        var _this = this;
        this.$api.get("/workSubmission?currentPage=" + this.currentPage + "&size=10&keyword=" + this.searchCondition.keyword
          + "&teacherNo=" + this.teacherId + "&classesNo="+this.searchCondition.classesNo+"&studentNo="
          +this.searchCondition.studentNo+"&courseNo="+this.searchCondition.courseNo, null, res => {
          _this.totalCount = res.size;
          _this.works = res.records;
        })
      }
    }
  };
</script>
