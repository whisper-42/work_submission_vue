<template>
  <div>
    <el-container>
      <el-header style="margin: 30px; padding: 0px;display:flex;justify-content:space-between;align-items: center">
        <div style="display: inline">
          <el-row>
            <el-input
              placeholder="通过班级号或班级名搜索班级。。。"
              clearable
              @change="keywordsChange"
              style="width: 250px;margin: 0px;padding: 0px;"
              size="mini"
              @keyup.enter.native="searchClasses"
              prefix-icon="el-icon-search"
              v-model="keyword">
            </el-input>
            <el-button type="primary" size="mini" style="margin-left: 5px" icon="el-icon-search" @click="searchClasses">搜索
            </el-button>
            <el-button type="primary" size="mini" style="margin-left: 10px" icon="el-icon-refresh" @click="resetSearch">重置
            </el-button>
            <el-button type="primary" size="mini"  style="margin-left: 40px"  icon="el-icon-plus"
                       @click="showAddClassesView">
              添加班级
            </el-button>
          </el-row>
          <el-row style="margin-top: 20px">
            <span>专业：</span>
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
            :data="classess"
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
              prop="professionNo"
              label="professionNo"
              v-if="false">
            </el-table-column>
            <el-table-column
              prop="classesNo"
              align="left"
              label="班级号"
              sortable
              width="150px">
            </el-table-column>
            <el-table-column
              prop="classesName"
              width="150px"
              sortable
              label="班级名">
            </el-table-column>
            <el-table-column
              prop="professionName"
              label="专业"
              sortable
              width="150px">
            </el-table-column>
            <el-table-column
              label="操作"
              width="195">
              <template slot-scope="scope">
                <el-button @click="showEditClassesView(scope.row)" style="padding: 3px 4px 3px 4px;margin: 2px"
                           size="mini">编辑
                </el-button>
                <el-button type="danger" style="padding: 3px 4px 3px 4px;margin: 2px" size="mini"
                           @click="deleteClasses(scope.row)">删除
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
    <el-form :model="classes" :rules="rules" ref="addClassesForm" style="margin: 0px;padding: 0px;">
      <div style="text-align: left">
        <el-dialog
          :title="dialogTitle"
          style="padding: 0px;"
          :close-on-click-modal="false"
          :visible.sync="dialogVisible"
          width="30%">
          <el-row>
            <div>
              <el-form-item label="班级号:" prop="classesNo">
                <el-input prefix-icon="el-icon-edit" v-model="classes.classesNo" size="mini" style="width: 150px"
                          placeholder="请输入班级号"></el-input>
              </el-form-item>
            </div>
          </el-row>
          <el-row>
            <div>
              <el-form-item label="班级名:" prop="classesName">
                <el-input prefix-icon="el-icon-edit" v-model="classes.classesName" size="mini" style="width: 150px"
                          placeholder="请输入班级名"></el-input>
              </el-form-item>
            </div>
          </el-row>
          <el-row>
            <div>
              <el-form-item label="专业:" prop="teacherNo">
                <el-select v-model="classes.professionNo" style="width: 150px" clearable size="mini" placeholder="请选择专业">
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
          <span slot="footer" class="dialog-footer">
            <el-button size="mini" @click="cancelEdit">取 消</el-button>
            <el-button size="mini" type="primary" @click="addClasses('addClassesForm')">确 定</el-button>
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
        classess: [],
        keyword: '',
        dialogTitle: '',
        professionList: this.$store.state.professions,
        professionNo:'',
        totalCount: -1,
        currentPage: 0,
        dialogVisible: false,
        classes: {
          id:'',
          classesNo:'',
          classesName: '',
          professionNo: '',
        },
        rules: {
          classesName: [{required: true, message: '必填:班级名', trigger: 'blur'}],
          classesNo: [{required: true, message: '必填:班级号', trigger: 'blur'}],
          professionNo: [{required: true, message: '必填:专业', trigger: 'blur'}],
        }
      };
    },
    mounted: function () {
      this.loadClassess();
    },
    methods: {
      deleteClasses(row){
        this.$confirm('此操作将永久删除[' + row.classesNo + '], 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          var _this = this;
          this.$api.delete("/classes/" + row.id, null, res => {
            _this.loadClassess();
          })
          _this.$api.get("/classes?currentPage=0&size=9999&keyword=" , null, pro => {
            _this.$store.commit('setClassess', pro.records);
          });
        }).catch(() => {
        });
      },
      keywordsChange(val){
        if (val === '') {
          this.loadClassess();
        }
      },
      searchClasses(){
        this.loadClassess();
      },
      currentChange(currentChange){
        this.currentPage = currentChange;
        this.loadClassess();
      },
      loadClassess(){
        var _this = this;
        this.$api.get("/classes?currentPage=" + this.currentPage + "&size=10&keyword=" + this.keyword
          +"&professionNo="+this.professionNo, null, res => {
          _this.totalCount = res.size;
          _this.classess = res.records;
          _this.classess.forEach((e)=>{
            for(var i=0; i<_this.professionList.length; i++) {
              if (e.professionNo === _this.professionList[i].id) {
                e.professionName = _this.professionList[i].professionName
              }
            }
          });
        })
      },
      addClasses(formName){
        var _this = this;
        this.$refs[formName].validate((valid) => {
          if (valid) {
            if (this.classes.id) {
              //更新
              this.$api.put("/classes", this.classes, res => {
                _this.dialogVisible = false;
                _this.emptyClassesData();
                _this.loadClassess();
              })
            } else {
              //添加
              this.$api.post("/classes", this.classes, res => {
                _this.dialogVisible = false;
                _this.emptyClassesData();
                _this.loadClassess();
              })
            }
            _this.$api.get("/classes?currentPage=0&size=9999&keyword=" , null, pro => {
              _this.$store.commit('setClassess', pro.records);
            });
          } else {
            return false;
          }
        });
      },
      cancelEdit(){
        this.dialogVisible = false;
        this.emptyClassesData();
      },
      resetSearch() {
        this.keyword = '';
        this.professionNo = '';
      },
      showEditClassesView(row){
        this.dialogTitle = "编辑班级";
        this.classes = row;
        this.classes.id = row.id;
        this.classes.classesNo = row.classesNo;
        this.classes.classesName = row.classesName;
        this.classes.professionNo = row.professionNo;
        this.dialogVisible = true;
      },
      showAddClassesView(){
        this.dialogTitle = "添加班级";
        this.dialogVisible = true;
      },
      emptyClassesData(){
        this.classes = {
          id:'',
          classesName: '',
          classesNo:'',
          professionNo: '',
        }
      }
    }
  };
</script>
