<template>
  <div>
    <el-container>
      <el-header style="margin: 30px; padding: 0px;display:flex;justify-content:space-between;align-items: center">
        <div style="display: inline">
          <el-input
            placeholder="通过教师号或教师名搜索教师。。。"
            clearable
            @change="keywordsChange"
            style="width: 250px;margin: 0px;padding: 0px;"
            size="mini"
            @keyup.enter.native="searchTeacher"
            prefix-icon="el-icon-search"
            v-model="keyword">
          </el-input>
          <el-button type="primary" size="mini" style="margin-left: 5px" icon="el-icon-search" @click="searchTeacher">搜索
          </el-button>
          <el-button type="primary" style="margin-left: 40px" size="mini" icon="el-icon-plus"
                     @click="showAddTeacherView">
            添加教师
          </el-button>
        </div>

      </el-header>
      <el-main style="padding-left: 0px;padding-top: 0px">
        <div>
          <el-table
            :data="teachers"
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
              prop="username"
              align="left"
              label="教师号"
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
              label="操作"
              width="195">
              <template slot-scope="scope">
                <el-button @click="showEditTeacherView(scope.row)" style="padding: 3px 4px 3px 4px;margin: 2px"
                           size="mini">编辑
                </el-button>
                <el-button type="danger" style="padding: 3px 4px 3px 4px;margin: 2px" size="mini"
                           @click="deleteTeacher(scope.row)">删除
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
    <el-form :model="teacher" :rules="rules" ref="addTeacherForm" style="margin: 0px;padding: 0px;">
      <div style="text-align: left">
        <el-dialog
          :title="dialogTitle"
          style="padding: 0px;"
          :close-on-click-modal="false"
          :visible.sync="dialogVisible"
          width="30%">
          <el-row>
              <div>
                <el-form-item label="教师号:" prop="username">
                  <el-input prefix-icon="el-icon-edit" v-model="teacher.username" size="mini" style="width: 150px"
                            placeholder="请输入教师号"></el-input>
                </el-form-item>
              </div>
          </el-row>
          <el-row>
              <div>
                <el-form-item label="姓名:" prop="name">
                  <el-input prefix-icon="el-icon-edit" v-model="teacher.name" size="mini" style="width: 150px"
                            placeholder="请输入姓名"></el-input>
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
            <el-button size="mini" type="primary" @click="addTeacher('addTeacherForm')">确 定</el-button>
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
        teachers: [],
        keyword: '',
        dialogTitle: '',
        totalCount: -1,
        currentPage: 0,
        dialogVisible: false,
        resetPassword: false,
        teacher: {
          id:'',
          username:'',
          password:'',
          name: '',
        },
        rules: {
          name: [{required: true, message: '必填:姓名', trigger: 'blur'}],
          username: [{required: true, message: '必填:教师号', trigger: 'blur'}],
        }
      };
    },
    mounted: function () {
      this.loadTeachers();
    },
    methods: {
      deleteTeacher(row){
        this.$confirm('此操作将永久删除[' + row.username + '], 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          var _this = this;
          this.$api.delete("/teacher/" + row.id, null, res => {
            _this.loadTeachers();
          })
        }).catch(() => {
        });
      },
      keywordsChange(val){
        if (val === '') {
          this.loadTeachers();
        }
      },
      searchTeacher(){
        this.loadTeachers();
      },
      currentChange(currentChange){
        this.currentPage = currentChange;
        this.loadTeachers();
      },
      loadTeachers(){
        var _this = this;
        this.$api.get("/teacher?currentPage=" + this.currentPage + "&size=10&keyword=" + this.keyword , null, res => {
          _this.teachers = res.records;
          _this.totalCount = res.size;
        })
      },
      addTeacher(formName){
        var _this = this;
        this.$refs[formName].validate((valid) => {
          if (valid) {
            if (this.teacher.id) {
              if (this.resetPassword === true) {
                this.teacher.password = this.teacher.username
              }
              //更新
              this.$api.put("/teacher", this.teacher, res => {
                _this.dialogVisible = false;
                _this.emptyTeacherData();
                _this.loadTeachers();
              })
            } else {
              //添加
              this.$api.post("/teacher", this.teacher, res => {
                _this.dialogVisible = false;
                _this.emptyTeacherData();
                _this.loadTeachers();
              })
            }
          } else {
            return false;
          }
        });
      },
      cancelEdit(){
        this.dialogVisible = false;
        this.emptyTeacherData();
      },
      showEditTeacherView(row){
        this.dialogTitle = "编辑教师";
        this.teacher = row;
        this.teacher.id = row.id;
        this.teacher.username = row.username;
        this.teacher.name = row.name;
        this.dialogVisible = true;
        this.resetPassword = false;
      },
      showAddTeacherView(){
        this.dialogTitle = "添加教师";
        this.dialogVisible = true;
        this.resetPassword = false;
      },
      emptyTeacherData(){
        this.teacher = {
          id: '',
          name: '',
          username:'',
        }
      }
    }
  };
</script>
