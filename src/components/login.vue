<template>
  <el-form :model="loginForm" :rules="rules" class="login-container" label-position="left"
           label-width="0px">
    <h3 class="login_title">作业提交系统</h3>
    <el-form-item prop="username">
      <el-input type="text" v-model="loginForm.username"  placeholder="用户名"></el-input>
    </el-form-item>
    <el-form-item prop="password">
      <el-input type="password" v-model="loginForm.password" placeholder="密码"></el-input>
    </el-form-item>
    <el-form-item style="width: 100%">
      <el-button type="primary" @click.native.prevent="submitClick" style="width: 100%">登录</el-button>
    </el-form-item>
  </el-form>
</template>
<script>
  export default{
    data(){
      return {
        rules: {
          username: [{required: true, message: '请输入用户名', trigger: 'blur'}],
          password: [{required: true, message: '请输入密码', trigger: 'blur'}]
        },
        checked: true,
        loginForm: {
          username: '',
          password: ''
        },
        loading: false
      }
    },
    methods: {
      submitClick: function () {
        var _this = this;
        this.$api.post('/login', {
          'username': this.loginForm.username,
          'password': this.loginForm.password}, res => {
          _this.$store.commit('login', res);
          _this.$api.get("/profession?currentPage=0&size=9999&keyword=&type="+_this.$store.state.user.type
            +"&id="+_this.$store.state.user.id , null, pro => {
            _this.$store.commit('setProfessions', pro.records);
          });
          _this.$api.get("/course?currentPage=0&size=9999&keyword=&type="+_this.$store.state.user.type
            +"&id="+_this.$store.state.user.id  , null, pro => {
            _this.$store.commit('setCourses', pro.records);
          });
          _this.$api.get("/classes?currentPage=0&size=9999&keyword=&type="+_this.$store.state.user.type
            +"&id="+_this.$store.state.user.id  , null, pro => {
            _this.$store.commit('setClassess', pro.records);
          });
          _this.$api.get("/student?currentPage=0&size=9999&keyword=&type="+_this.$store.state.user.type
            +"&id="+_this.$store.state.user.id  , null, pro => {
            _this.$store.commit('setStudents', pro.records);
          });
          _this.$api.get("/teacher?currentPage=0&size=9999&keyword=&type="+_this.$store.state.user.type
            +"&id="+_this.$store.state.user.id  , null, pro => {
            _this.$store.commit('setTeachers', pro.records);
          });
          if (res.type === '0'){
            _this.$router.replace({path: '/student'});
          } else if(res.type === '1'){
            _this.$router.replace({path: '/showWork'});
          } else if (res.type === '2') {
            _this.$router.replace({path: '/newWork'});
          }
        });
      }
    }
  }
</script>
<style>
  .login-container {
    border-radius: 15px;
    background-clip: padding-box;
    margin: 180px auto;
    width: 350px;
    padding: 35px 35px 15px 35px;
    background: #fff;
    border: 1px solid #eaeaea;
    box-shadow: 0 0 25px #cac6c6;
  }

  .login_title {
    margin: 0px auto 40px auto;
    text-align: center;
    font-size: 33px;
    color: #5e90c3;
  }

</style>
