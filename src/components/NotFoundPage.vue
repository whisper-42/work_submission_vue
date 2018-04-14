<template>
  <div class="notFoundPage">
    <h1>404</h1>
    <h1>找不到页面</h1>
    <div style="width:100%;height:20px;"></div>
    <router-link to="/">跳到主页</router-link>
  </div>
</template>

<script>
export default {
  name: 'notFoundPage',
  data () {
    return {

    }
  },
  methods: {
  }
}
</script>

<style type="text/css">
h1{
  padding: 0px;
  margin: 0px;
}
.notFoundPage{
  border-radius: 5px;
  text-align: center;
  background-color: #0a8acd;
  color: #ffffff;
  position: relative;
  width: 100%;
  height: 100%;
}
</style>
