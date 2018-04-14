<template>
  <div>
    <el-container>
      <el-header style="margin: 30px; padding: 0px;display:flex;justify-content:space-between;align-items: center">
        <div style="display: inline">
          <el-input
            placeholder="通过专业号或专业名搜索专业。。。"
            clearable
            @change="keywordsChange"
            style="width: 250px;margin: 0px;padding: 0px;"
            size="mini"
            @keyup.enter.native="searchProfession"
            prefix-icon="el-icon-search"
            v-model="keyword">
          </el-input>
          <el-button type="primary" size="mini" style="margin-left: 5px" icon="el-icon-search" @click="searchProfession">搜索
          </el-button>
          <el-button type="primary" size="mini"  style="margin-left: 40px" icon="el-icon-plus"
          @click="showAddProfessionView">
          添加专业
          </el-button>
        </div>
      </el-header>
      <el-main style="padding-left: 0px;padding-top: 0px">
        <div>
          <el-table
            :data="professions"
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
              align="left"
              label="专业号"
              sortable
              width="150px">
            </el-table-column>
            <el-table-column
              prop="professionName"
              width="150px"
              sortable
              label="专业名">
            </el-table-column>
            <el-table-column
              label="操作"
              width="195">
              <template slot-scope="scope">
                <el-button @click="showEditProfessionView(scope.row)" style="padding: 3px 4px 3px 4px;margin: 2px"
                           size="mini">编辑
                </el-button>
                <el-button type="danger" style="padding: 3px 4px 3px 4px;margin: 2px" size="mini"
                           @click="deleteProfession(scope.row)">删除
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
    <el-form :model="profession" :rules="rules" ref="addProfessionForm" style="margin: 0px;padding: 0px;">
      <div style="text-align: left">
        <el-dialog
          :title="dialogTitle"
          style="padding: 0px;"
          :close-on-click-modal="false"
          :visible.sync="dialogVisible"
          width="30%">
          <el-row>
            <div>
              <el-form-item label="专业号:" prop="professionNo">
                <el-input prefix-icon="el-icon-edit" v-model="profession.professionNo" size="mini" style="width: 150px"
                          placeholder="请输入专业号"></el-input>
              </el-form-item>
            </div>
          </el-row>
          <el-row>
            <div>
              <el-form-item label="专业名:" prop="professionName">
                <el-input prefix-icon="el-icon-edit" v-model="profession.professionName" size="mini" style="width: 150px"
                          placeholder="请输入专业名"></el-input>
              </el-form-item>
            </div>
          </el-row>
          <span slot="footer" class="dialog-footer">
            <el-button size="mini" @click="cancelEdit">取 消</el-button>
            <el-button size="mini" type="primary" @click="addProfession('addProfessionForm')">确 定</el-button>
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
        professions: [],
        keyword: '',
        dialogTitle: '',
        teacherList: [],
        totalCount: -1,
        currentPage: 0,
        dialogVisible: false,
        profession: {
          id:'',
          professionNo:'',
          professionName: '',
        },
        rules: {
          professionName: [{required: true, message: '必填:专业名', trigger: 'blur'}],
          professionNo: [{required: true, message: '必填:专业号', trigger: 'blur'}],
        }
      };
    },
    mounted: function () {
      this.loadProfessions();
    },
    methods: {
      deleteProfession(row){
        this.$confirm('此操作将永久删除[' + row.professionNo + '], 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          var _this = this;
          this.$api.delete("/profession/" + row.id, null, res => {
            _this.loadProfessions();
          })
          _this.$api.get("/profession?currentPage=0&size=9999&keyword=" , null, pro => {
            _this.$store.commit('setProfessions', pro.records);
          });
        }).catch(() => {
        });
      },
      keywordsChange(val){
        if (val === '') {
          this.loadProfessions();
        }
      },
      searchProfession(){
        this.loadProfessions();
      },
      currentChange(currentChange){
        this.currentPage = currentChange;
        this.loadProfessions();
      },
      loadProfessions(){
        var _this = this;
        this.$api.get("/profession?currentPage=" + this.currentPage + "&size=10&keyword=" + this.keyword , null, res => {
          _this.professions = res.records;
          _this.totalCount = res.size;
        })
      },
      addProfession(formName){
        var _this = this;
        this.$refs[formName].validate((valid) => {
          if (valid) {
            if (this.profession.id) {
              //更新
              this.$api.put("/profession", this.profession, res => {
                _this.dialogVisible = false;
                _this.emptyProfessionData();
                _this.loadProfessions();
              })
            } else {
              //添加
              this.$api.post("/profession", this.profession, res => {
                _this.dialogVisible = false;
                _this.emptyProfessionData();
                _this.loadProfessions();
              })
            }
            _this.$api.get("/profession?currentPage=0&size=9999&keyword=" , null, pro => {
              _this.$store.commit('setProfessions', pro.records);
            });
          } else {
            return false;
          }
        });
      },
      cancelEdit(){
        this.dialogVisible = false;
        this.emptyProfessionData();
      },
      showEditProfessionView(row){
        this.dialogTitle = "编辑专业";
        this.profession = row;
        this.profession.id = row.id;
        this.profession.professionNo = row.professionNo;
        this.profession.professionName = row.professionName;
        this.profession.teacherNo = row.teacherNo;
        this.dialogVisible = true;
      },
      showAddProfessionView(){
        this.dialogTitle = "添加专业";
        this.dialogVisible = true;
      },
      emptyProfessionData(){
        this.profession = {
          id:'',
          professionName: '',
          professionNo:'',
        }
      }
    }
  };
</script>
