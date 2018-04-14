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
              <span>教师：</span>
              <el-select v-model="searchCondition.teacherId" clearable size="mini" placeholder="请选择" style="width: 100px">
                <el-option
                  v-for="item in teacherList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
                </el-option>
              </el-select>
              <span >课程：</span>
              <el-select v-model="searchCondition.courseId" clearable size="mini" placeholder="请选择" style="width: 100px">
                <el-option
                  v-for="item in courseList"
                  :key="item.id"
                  :label="item.courseName"
                  :value="item.id">
                </el-option>
              </el-select>
              <span >状态：</span>
              <el-select v-model="searchCondition.status" clearable size="mini" placeholder="请选择" style="width: 100px">
                <el-option
                  v-for="item in statusList"
                  :key="item.key"
                  :label="item.value"
                  :value="item.key">
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
              prop="submissionTime"
              width="150"
              sortable
              label="提交时间">
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
                  下载已提交的作业
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
        searchCondition:{
          keyword: '',
          teacherId:'',
          courseId:'',
          status:'',
        },
        studentNo: this.$store.state.user.id,
        teacherList: this.$store.state.teachers,
        courseList: this.$store.state.courses,
        statusList: [{
          key: '-1',
          value: '不合格'
        },{
          key: '1',
          value: '已提交'
        },{
          key: '2',
          value: '已完成'
        }],
        limit:1,
        totalCount: -1,
        currentPage: 0,
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
      resetSearch() {
        this.searchCondition.keyword = '';
        this.searchCondition.teacherId = '';
        this.searchCondition.courseId = '';
        this.searchCondition.status = '';
      },
      loadWorks(){
        var _this = this;
        this.$api.get("/workSubmission?currentPage=" + this.currentPage + "&size=10&keyword="
          + this.searchCondition.keyword + "&teacherNo=" + this.searchCondition.teacherId
          + "&courseNo="+this.searchCondition.courseId+"&studentNo="+this.studentNo
          + "&status="+this.searchCondition.status, null, res => {
          _this.totalCount = res.size;
          _this.works = res.records;
        })
      }
    }
  };
</script>
