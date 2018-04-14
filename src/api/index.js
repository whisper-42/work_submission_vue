import {Message} from 'element-ui'
import store from '../store/index'
import router from '../router/index'

// 配置API接口地址
var root= 'http://127.0.0.1:8080'
// 引用axios
var axios = require('axios')
// 自定义判断元素类型JS
function toType (obj) {
  return ({}).toString.call(obj).match(/\s([a-zA-Z]+)/)[1].toLowerCase()
}
// 参数过滤函数
function filterNull (o) {
  for (var key in o) {
    if (o[key] === null) {
      delete o[key]
    }
    if (toType(o[key]) === 'string') {
      o[key] = o[key].trim()
    } else if (toType(o[key]) === 'object') {
      o[key] = filterNull(o[key])
    } else if (toType(o[key]) === 'array') {
      o[key] = filterNull(o[key])
    }
  }
  return o
}

function apiAxios (method, url, params, success, failure) {
  if (params) {
    params = filterNull(params)
  }
  axios({
    method: method,
    url: url,
    data: method === 'POST' || method === 'PUT' ? params : null,
    params: method === 'GET' || method === 'DELETE' ? params : null,
    baseURL: root,
    headers: {'token': store.state.user.token},
    withCredentials: false
  })
  .then(function (res) {
    if (res.data.code === "200") {
      if (success) {
        success(res.data.data)
      }
    } else if (res.data.code === "401") {
      router.replace({path: '/'});
      Message.error({message: JSON.stringify(res.data.msg)});
    } else {
      if (failure) {
        failure(res.data.data)
      } else {
        Message.error({message: JSON.stringify(res.data.msg)});
      }
    }
  })
  .catch(function (err) {
    let res = err.response
    if (err) {
      Message.error({message: 'api error, HTTP CODE: ' + res});
    }
  })
}

export default {
  get: function (url, params, success, failure) {
    return apiAxios('GET', url, params, success, failure)
  },
  post: function (url, params, success, failure) {
    return apiAxios('POST', url, params, success, failure)
  },
  put: function (url, params, success, failure) {
    return apiAxios('PUT', url, params, success, failure)
  },
  delete: function (url, params, success, failure) {
    return apiAxios('DELETE', url, params, success, failure)
  }
}
