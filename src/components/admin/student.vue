<template>
  <div>
    <el-container>
      <el-header style="margin:30px; padding: 0px;display:flex;justify-content:space-between;align-items: center">
        <div style="display: inline">
          <el-row>
            <el-input
              placeholder="通过学号或姓名搜索学生。。。"
              clearable
              @change="keywordsChange"
              style="width: 250px;margin: 0px;padding: 0px;"
              size="mini"
              @keyup.enter.native="searchStudent"
              prefix-icon="el-icon-search"
              v-model="keyword">
            </el-input>
            <el-button type="primary" size="mini" style="margin-left: 5px" icon="el-icon-search" @click="searchStudent">搜索
            </el-button>
            <el-button type="primary" size="mini" style="margin-left: 10px" icon="el-icon-refresh" @click="resetSearch">重置
            </el-button>
            <el-button type="primary" size="mini" style="margin-left: 40px" icon="el-icon-plus"
                       @click="showAddStudentView">
              添加学生
            </el-button>
          </el-row>
          <el-row style="margin-top: 20px">
            <span>班级：</span>
            <el-select v-model="classesNo" size="mini" clearable placeholder="请选择" style="width: 100px">
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
            :data="students"
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
              prop="classesNo"
              label="classesNo"
              v-if="false">
            </el-table-column>
            <el-table-column
              prop="username"
              align="left"
              label="学号"
              sortable
              width="150px">
            </el-table-column>
            <el-table-column
              prop="name"
              width="150px"
              sortable
              label="姓名">
            </el-table-column>
            <el-table-column
              prop="sex"
              label="性别"
              sortable
              width="150px">
            </el-table-column>
            <el-table-column
              prop="classesName"
              width="150px"
              sortable
              label="班级">
            </el-table-column>
            <el-table-column
              label="操作"
              width="195">
              <template slot-scope="scope">
                <el-button @click="showEditStudentView(scope.row)" style="padding: 3px 4px 3px 4px;margin: 2px"
                           size="mini">编辑
                </el-button>
                <el-button type="danger" style="padding: 3px 4px 3px 4px;margin: 2px" size="mini"
                           @click="deleteStudent(scope.row)">删除
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
    <el-form :model="student" :rules="rules" ref="addStudentForm" style="margin: 0px;padding: 0px;">
      <div style="text-align: left">
        <el-dialog
          :title="dialogTitle"
          style="padding: 0px;"
          :close-on-click-modal="false"
          :visible.sync="dialogVisible"
          width="30%">
          <el-row>
              <div>
                <el-form-item label="学号:" prop="username">
                  <el-input prefix-icon="el-icon-edit" v-model="student.username" size="mini" style="width: 150px"
                            placeholder="请输入学号"></el-input>
                </el-form-item>
              </div>
          </el-row>
          <el-row>
              <div>
                <el-form-item label="姓名:" prop="name">
                  <el-input prefix-icon="el-icon-edit" v-model="student.name" size="mini" style="width: 150px"
                            placeholder="请输入姓名"></el-input>
                </el-form-item>
              </div>
          </el-row>
          <el-row>
              <div>
                <el-form-item label="性别:" prop="sex">
                  <el-radio-group v-model="student.sex">
                    <el-radio label="男">男</el-radio>
                    <el-radio style="margin-left: 15px" label="女">女</el-radio>
                  </el-radio-group>
                </el-form-item>
              </div>
          </el-row>
          <el-row>
              <div>
                <el-form-item label="班级:" prop="classNo">
                  <el-select v-model="student.classesNo" clearable style="width: 150px" size="mini" placeholder="请选择班级">
                    <el-option
                      v-for="item in classesList"
                      :key="item.id"
                      :label="item.classesName"
                      :value="item.id">
                    </el-option>
                  </el-select>
                </el-form-item>
              </div>
          </el-row>
          <el-row>
            <div>
              重置密码：
              <el-switch
                v-model="resetPassword"
                active-color="#13ce66"
                inactive-color="#ff4949">
              </el-switch>
            </div>
          </el-row>
          <span slot="footer" class="dialog-footer">
            <el-button size="mini" @click="cancelEdit">取 消</el-button>
            <el-button size="mini" type="primary" @click="addStudent('addStudentForm')">确 定</el-button>
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
        students: [],
        keyword: '',
        classesNo:'',
        dialogTitle: '',
        classesList: this.$store.state.classess,
        totalCount: -1,
        currentPage: 0,
        dialogVisible: false,
        resetPassword: false,
        student: {
          id:'',
          username:'',
          password:'',
          name: '',
          sex: '',
          classesNo: '',
        },
        rules: {
          name: [{required: true, message: '必填:姓名', trigger: 'blur'}],
          classesNo: [{required: true, message: '必填:班级', trigger: 'blur'}],
          username: [{required: true, message: '必填:学号', trigger: 'blur'}],
          sex: [{required: true, message: '必填:性别', trigger: 'blur'}],
        }
      };
    },
    mounted: function () {
      this.loadStudents();
    },
    methods: {
      deleteStudent(row){
        this.$confirm('此操作将永久删除[' + row.username + '], 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          var _this = this;
          this.$api.delete("/student/" + row.id, null, res => {
            _this.loadStudents();
          })
        }).catch(() => {
        });
      },
      keywordsChange(val){
        if (val === '') {
          this.loadStudents();
        }
      },
      searchStudent(){
        this.loadStudents();
      },
      currentChange(currentChange){
        this.currentPage = currentChange;
        this.loadStudents();
      },
      loadStudents(){
        var _this = this;
        this.$api.get("/student?currentPage=" + this.currentPage + "&size=10&keyword=" + this.keyword
          +"&classesNo="+this.classesNo , null, res => {
          _this.totalCount = res.size;
          _this.students = res.records;
          _this.students.forEach((e)=>{
            for(var i=0; i<_this.classesList.length; i++) {
              if (e.classesNo === _this.classesList[i].id) {
                e.classesName = _this.classesList[i].classesName
              }
            }
          });
        })
      },
      addStudent(formName){
        var _this = this;
        this.$refs[formName].validate((valid) => {
          if (valid) {
            if (this.student.id) {
              if (this.resetPassword === true) {
                this.student.password = this.student.username
              }
              //更新
              this.$api.put("/student", this.student, res => {
                _this.dialogVisible = false;
                _this.emptyStudentData();
                _this.loadStudents();
              })
            } else {
              //添加
              this.$api.post("/student", this.student, res => {
                _this.dialogVisible = false;
                _this.emptyStudentData();
                _this.loadStudents();
              })
            }
          } else {
            return false;
          }
        });
      },
      cancelEdit(){
        this.dialogVisible = false;
        this.emptyStudentData();
      },
      showEditStudentView(row){
        this.dialogTitle = "编辑学生";
        this.student = row;
        this.student.id = row.id;
        this.student.username = row.username;
        this.student.name = row.name;
        this.student.sex = row.sex;
        this.student.classesNo = row.classesNo;
        this.dialogVisible = true;
        this.resetPassword = false;
      },
      showAddStudentView(){
        this.dialogTitle = "添加学生";
        this.dialogVisible = true;
        this.resetPassword = false;
      },
      resetSearch() {
        this.keyword = '';
        this.classesNo = '';
      },
      emptyStudentData(){
        this.student = {
          id:'',
          name: '',
          username:'',
          sex: '',
          classesNo: ''
        }
      }
    }
  };
</script>
