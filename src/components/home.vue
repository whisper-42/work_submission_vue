<template>
  <div>
    <el-container class="home-container">
      <el-header class="home-header">
        <span class="home_title">作业提交系统</span>
        <div style="display: flex;align-items: center;margin-right: 7px">

          <el-dropdown @command="handleCommand">

            <span class="el-dropdown-link" style="align-items: center; font-size: 26px">
                <span style="margin-right: 30px;" v-if="this.$store.state.user.type === '0'">管理员</span>
                <span style="margin-right: 30px;" v-if="this.$store.state.user.type === '1'">教师</span>
                <span style="margin-right: 30px;" v-if="this.$store.state.user.type === '2'">学生</span>
                {{this.$store.state.user.name}}
              &nbsp;&nbsp;
              <i class="el-icon-setting"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="showInfoPage" divided>个人信息</el-dropdown-item>
              <el-dropdown-item command="showPasswordPage" divided>修改密码</el-dropdown-item>
              <el-dropdown-item command="logout" divided>注销</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </el-header>
      <el-container>
        <el-aside width="180px" class="home-aside">
          <div style="display: flex;justify-content: flex-start;width: 180px;text-align: left;">
            <div v-if="this.$store.state.user.type === '0'">
              <el-menu style="width: 180px;" unique-opened router>
                <el-menu-item index="teacher">
                  <i class="el-icon-menu"></i>
                  <span slot="title">教师管理</span>
                </el-menu-item>
                <el-menu-item index="student">
                  <i class="el-icon-menu"></i>
                  <span slot="title">学生管理</span>
                </el-menu-item>
                <el-menu-item index="course">
                  <i class="el-icon-menu"></i>
                  <span slot="title">课程管理</span>
                </el-menu-item>
                <el-menu-item index="profession">
                  <i class="el-icon-menu"></i>
                  <span slot="title">专业管理</span>
                </el-menu-item>
                <el-menu-item index="classes">
                  <i class="el-icon-menu"></i>
                  <span slot="title">班级管理</span>
                </el-menu-item>
              </el-menu>
            </div>
            <div v-else-if = "this.$store.state.user.type === '1'">
              <el-menu style="width: 180px;" unique-opened router >
              <el-menu-item index="releaseWork">
                  <i class="el-icon-menu"></i>
                  <span>发布作业</span>
                </el-menu-item>
                <el-menu-item index="showWork">
                  <i class="el-icon-menu"></i>
                  <span>已发布的作业</span>
                </el-menu-item>
                <el-menu-item index="showSubmissionWork">
                  <i class="el-icon-menu"></i>
                  <span>学生提交的作业</span>
                </el-menu-item>
              </el-menu>
            </div>
            <div v-else-if = "this.$store.state.user.type === '2'">
              <el-menu style="width: 180px;" unique-opened router >

                <el-menu-item index="newWork">
                  <i class="el-icon-menu"></i>
                  <span slot="title">新作业</span>
                </el-menu-item>
                <el-menu-item index="workRecord">
                  <i class="el-icon-menu"></i>
                  <span slot="title">作业记录</span>
                </el-menu-item>
              </el-menu>
            </div>
          </div>
        </el-aside>
        <el-container>
          <el-main>
            <el-breadcrumb separator-class="el-icon-arrow-right">
              <el-breadcrumb-item>作业管理系统</el-breadcrumb-item>
              <el-breadcrumb-item v-text="this.$router.currentRoute.name"></el-breadcrumb-item>
            </el-breadcrumb>
            <keep-alive>
              <router-view v-if="this.$route.meta.keepAlive"></router-view>
            </keep-alive>
            <router-view v-if="!this.$route.meta.keepAlive"></router-view>
          </el-main>
        </el-container>
      </el-container>
    </el-container>
    <el-dialog
      title="个人信息"
      style="padding: 0px;"
      :close-on-click-modal="false"
      :visible.sync="infoVisible"
      width="30%">
      <div style="font-size: 20px">
        <div v-if="this.user.type === '0'">
          <el-row style="margin-top: 10px">
            <i class="el-icon-menu"></i>
            <span>管理员号：{{this.user.username}}</span>
          </el-row>
          <el-row style="margin-top: 10px">
            <i class="el-icon-menu"></i>
            <span>姓名：{{this.user.name}}</span>
          </el-row>
        </div>
        <div v-else-if="this.user.type === '1'">
          <el-row style="margin-top: 10px">
            <i class="el-icon-menu"></i>
            <span>教师号：{{this.user.username}}</span>
          </el-row>
          <el-row style="margin-top: 10px">
            <i class="el-icon-menu"></i>
            <span>姓名：{{this.user.name}}</span>
          </el-row>
        </div>
        <div v-else-if="this.user.type === '2'">
          <el-row style="margin-top: 10px">
            <i class="el-icon-menu"></i>
            <span>学号：{{this.user.username}}</span>
          </el-row>
          <el-row style="margin-top: 10px">
            <i class="el-icon-menu"></i>
            <span>姓名：{{this.user.name}}</span>
          </el-row>
          <el-row style="margin-top: 10px">
            <i class="el-icon-menu"></i>
            <span>性别：{{this.user.sex}}</span>
          </el-row>
          <el-row style="margin-top: 10px">
            <i class="el-icon-menu"></i>
            <span>班级：{{this.user.classesName}}</span>
          </el-row>
        </div>

      </div>

    </el-dialog>
    <el-form :model="pwds" :rules="rules" ref="passwordForm" style="margin: 0px;padding: 0px;">
      <div style="text-align: left">
        <el-dialog
          title="修改密码"
          style="padding: 0px;"
          :close-on-click-modal="false"
          :visible.sync="passwordVisible"
          width="30%">
          <el-row>
            <div>
              <el-form-item label="原密码:" prop="oldPassword">
                <el-input type="password" prefix-icon="el-icon-edit" v-model="pwds.oldPassword" size="mini" style="width: 150px"
                          placeholder="请输入原密码"></el-input>
              </el-form-item>
            </div>
          </el-row>
          <el-row>
            <div>
              <el-form-item label="新密码:" prop="newPassword">
                <el-input type="password" prefix-icon="el-icon-edit" v-model="pwds.newPassword" size="mini" style="width: 150px"
                          placeholder="请输入新密码"></el-input>
              </el-form-item>
            </div>
          </el-row>
          <el-row>
            <div>
              <el-form-item label="确认新密码:" prop="confirmNewPassword">
                <el-input type="password" prefix-icon="el-icon-edit" v-model="confirmNewPassword" size="mini" style="width: 150px"
                          placeholder="请再输入一次新密码"></el-input>
              </el-form-item>
            </div>
          </el-row>
          <span slot="footer" class="dialog-footer">
            <el-button size="mini" @click="cancelEdit">取 消</el-button>
            <el-button size="mini" type="primary" @click="changePassword('passwordForm')">确 定</el-button>
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
        pwds : {
          id: this.$store.state.user.id,
          type: this.$store.state.user.type,
          oldPassword: '',
          newPassword:''

        },
        user: this.$store.state.user,
        confirmNewPassword:'',
        passwordVisible: false,
        infoVisible: false,
        rules: {
          oldPassword: [{required: true, message: '必填:旧密码', trigger: 'blur'}],
          newPassword: [{required: true, message: '必填:新密码', trigger: 'blur'}]
        }
      }
    },
    mounted: function () {
    },
    methods: {
      cancelEdit(){
        this.passwordVisible = false;
        this.pwds = {
          id: this.$store.state.user.id,
          type: this.$store.state.user.type,
          oldPassword: '',
          newPassword:''
        };
        this.confirmNewPassword = ''
      },
      changePassword(formName) {
        var _this = this;
        this.$refs[formName].validate((valid) => {
          if (valid) {
            if (_this.confirmNewPassword === _this.pwds.newPassword) {
              _this.$api.post("/changePassword",_this.pwds, pro => {
                _this.$message.success("密码修改成功");
                _this.cancelEdit()
              });
            } else {
              _this.$message.error("两次新密码不一致")
            }
          }
        });
      },
       handleCommand(cmd){
         var _this = this;
         if (cmd === 'logout') {
           this.$confirm('注销登录, 是否继续?', '提示', {
             confirmButtonText: '确定',
             cancelButtonText: '取消',
             type: 'warning'
           }).then(() => {
             _this.$api.post("/logout");
             _this.$store.commit('logout');
             _this.$router.replace({path: '/'});
           }).catch(() => {
             _this.$message({
               type: 'info',
               message: '取消'
             });
           });
         } else if(cmd === 'showPasswordPage') {
           this.passwordVisible = true;
         } else if(cmd === 'showInfoPage') {
           this.infoVisible = true;
         }
       }
    }
  }
</script>
<style>
  .home-container {
    height: 100%;
    position: absolute;
    top: 0px;
    left: 0px;
    width: 100%;
  }

  .home-header {
    background-color: #20a0ff;
    color: #333;
    font-size: 26px;
    text-align: center;
    display: flex;
    align-items: center;
    justify-content: space-between;
    box-sizing: content-box;
    padding: 0px;
  }

  .home-aside {
    background-color: #ECECEC;
  }
  .home_title {
    color: #fff;
    display: inline;
    margin-left: 8px;
  }

</style>
