<template>
  <div>
    <el-container>
      <el-header style="margin: 30px; padding: 0px;display:flex;justify-content:space-between;align-items: center">
        <div style="display: inline">
          <el-row>
            <el-input
              placeholder="通过课程号或课程名搜索课程。。。"
              clearable
              @change="keywordsChange"
              style="width: 250px;margin: 0px;padding: 0px;"
              size="mini"
              @keyup.enter.native="searchCourse"
              prefix-icon="el-icon-search"
              v-model="keyword">
            </el-input>
            <el-button type="primary" size="mini" style="margin-left: 5px" icon="el-icon-search" @click="searchCourse">搜索
            </el-button>
            <el-button type="primary" size="mini" style="margin-left: 5px" icon="el-icon-refresh" @click="resetSearch">重置
            </el-button>
            <el-button type="primary" size="mini" style="margin-left: 40px"  icon="el-icon-plus"
                       @click="showAddCourseView">
              添加课程
            </el-button>
          </el-row>
          <el-row style="margin-top: 20px">
            <span>教师：</span>
            <el-select v-model="teacherNo" size="mini" clearable placeholder="请选择" style="width: 100px">
              <el-option
                v-for="item in teacherList"
                :key="item.id"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
            <span >专业：</span>
            <el-select v-model="professionNo" size="mini" clearable placeholder="请选择" style="width: 100px">
              <el-option
                v-for="item in professionList"
                :key="item.id"
                :label="item.professionName"
                :value="item.id">
              </el-option>
            </el-select>
          </el-row>
        </div>
      </el-header>
      <el-main style="padding-left: 0px;padding-top: 0px">
        <div>
          <el-table
            :data="courses"
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
              prop="teacherNo"
              label="teacherNo"
              v-if="false">
            </el-table-column>
            <el-table-column
              prop="professionNo"
              label="professionNo"
              v-if="false">
            </el-table-column>
            <el-table-column
              prop="courseNo"
              align="left"
              sortable
              label="课程号"
              width="150px">
            </el-table-column>
            <el-table-column
              prop="courseName"
              width="150px"
              sortable
              label="课程名">
            </el-table-column>
            <el-table-column
              prop="professionName"
              label="专业"
              sortable
              width="150px">
            </el-table-column>
            <el-table-column
              prop="teacherName"
              width="150px"
              sortable
              label="教师">
            </el-table-column>
            <el-table-column
              label="操作"
              width="195">
              <template slot-scope="scope">
                <el-button @click="showEditCourseView(scope.row)" style="padding: 3px 4px 3px 4px;margin: 2px"
                           size="mini">编辑
                </el-button>
                <el-button type="danger" style="padding: 3px 4px 3px 4px;margin: 2px" size="mini"
                           @click="deleteCourse(scope.row)">删除
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
    <el-form :model="course" :rules="rules" ref="addCourseForm" style="margin: 0px;padding: 0px;">
      <div style="text-align: left">
        <el-dialog
          :title="dialogTitle"
          style="padding: 0px;"
          :close-on-click-modal="false"
          :visible.sync="dialogVisible"
          width="30%">
          <el-row>
              <div>
                <el-form-item label="课程号:" prop="courseNo">
                  <el-input prefix-icon="el-icon-edit" v-model="course.courseNo" size="mini" style="width: 150px"
                            placeholder="请输入课程号"></el-input>
                </el-form-item>
              </div>
          </el-row>
          <el-row>
              <div>
                <el-form-item label="课程名:" prop="courseName">
                  <el-input prefix-icon="el-icon-edit" v-model="course.courseName" size="mini" style="width: 150px"
                            placeholder="请输入课程名"></el-input>
                </el-form-item>
              </div>
          </el-row>
          <el-row>
              <div>
                <el-form-item label="专业:" prop="teacherNo">
                  <el-select v-model="course.professionNo" clearable style="width: 150px" size="mini" placeholder="请选择专业">
                    <el-option
                      v-for="item in professionList"
                      :key="item.id"
                      :label="item.professionName"
                      :value="item.id">
                    </el-option>
                  </el-select>
                </el-form-item>
              </div>
          </el-row>
          <el-row>
              <div>
                <el-form-item label="教师:" prop="teacherNo">
                  <el-select v-model="course.teacherNo" clearable style="width: 150px" size="mini" placeholder="请选择教师">
                    <el-option
                      v-for="item in teacherList"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id">
                    </el-option>
                  </el-select>
                </el-form-item>
              </div>
          </el-row>
          <span slot="footer" class="dialog-footer">
            <el-button size="mini" @click="cancelEdit">取 消</el-button>
            <el-button size="mini" type="primary" @click="addCourse('addCourseForm')">确 定</el-button>
          </span>
        </el-dialog>
      </div>
    </el-form>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        courses: [],
        keyword: '',
        teacherNo:'',
        professionNo:'',
        dialogTitle: '',
        teacherList: this.$store.state.teachers,
        professionList: this.$store.state.professions,
        totalCount: -1,
        currentPage: 0,
        dialogVisible: false,
        course: {
          id:'',
          courseNo:'',
          courseName: '',
          professionNo: '',
          teacherNo: '',
        },
        rules: {
          courseName: [{required: true, message: '必填:课程名', trigger: 'blur'}],
          teacherNo: [{required: true, message: '必填:教师', trigger: 'blur'}],
          courseNo: [{required: true, message: '必填:课程号', trigger: 'blur'}],
          professionNo: [{required: true, message: '必填:性别', trigger: 'blur'}],
        }
      };
    },
    mounted: function () {
      this.loadCourses();
    },
    methods: {
      deleteCourse(row){
        this.$confirm('此操作将永久删除[' + row.courseNo + '], 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          var _this = this;
          this.$api.delete("/course/" + row.id, null, res => {
            _this.loadCourses();
          })
          _this.$api.get("/course?currentPage=0&size=9999&keyword=" , null, pro => {
            _this.$store.commit('setCourses', pro.records);
          });
        }).catch(() => {
        });
      },
      keywordsChange(val){
        if (val === '') {
          this.loadCourses();
        }
      },
      searchCourse(){
        this.loadCourses();
      },
      currentChange(currentChange){
        this.currentPage = currentChange;
        this.loadCourses();
      },
      loadCourses(){
        var _this = this;
        this.$api.get("/course?currentPage=" + this.currentPage + "&size=10&keyword=" + this.keyword
          +"&teacherNo="+this.teacherNo+"&professionNo="+this.professionNo, null, res => {
          _this.totalCount = res.size;
          _this.courses = res.records;
          _this.courses.forEach((e)=>{
            for(var i=0; i<_this.professionList.length; i++) {
              if (e.professionNo === _this.professionList[i].id) {
                e.professionName = _this.professionList[i].professionName
              }
            }
            for(var j=0; j<_this.teacherList.length; j++) {
              if (e.teacherNo === _this.teacherList[j].id) {
                e.teacherName = _this.teacherList[j].name
              }
            }
          });
          console.info(_this.courses)
        })
      },
      addCourse(formName){
        var _this = this;
        this.$refs[formName].validate((valid) => {
          if (valid) {
            if (this.course.id) {
              //更新
              this.$api.put("/course", this.course, res => {
                _this.dialogVisible = false;
                _this.emptyCourseData();
                _this.loadCourses();
              })
            } else {
              //添加
              this.$api.post("/course", this.course, res => {
                _this.dialogVisible = false;
                _this.emptyCourseData();
                _this.loadCourses();
              })
            }
            _this.$api.get("/course?currentPage=0&size=9999&keyword=" , null, pro => {
              _this.$store.commit('setCourses', pro.records);
            });
          } else {
            return false;
          }
        });
      },
      cancelEdit(){
        this.dialogVisible = false;
        this.emptyCourseData();
      },
      showEditCourseView(row){
        this.dialogTitle = "编辑课程";
        this.course = row;
        this.course.id = row.id;
        this.course.courseNo = row.courseNo;
        this.course.courseName = row.courseName;
        this.course.professionNo = row.professionNo;
        this.course.teacherNo = row.teacherNo;
        this.dialogVisible = true;
      },
      showAddCourseView(){
        this.dialogTitle = "添加课程";
        this.dialogVisible = true;
      },
      resetSearch(){
        this.keyword = '';
        this.teacherNo = '';
        this.professionNo = '';
      },
      emptyCourseData(){
        this.course = {
          id:'',
          courseName: '',
          courseNo:'',
          professionNo: '',
          teacherNo: ''
        }
      }
    }
  };
</script>
