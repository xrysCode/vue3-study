import axios from 'axios'
// import VueAxios from 'vue-axios'

// Set config defaults when creating the instance
const instance = axios.create({
  baseURL: 'http://127.0.0.1:9000/'
})
// Alter defaults after instance has been created
// instance.defaults.headers.common.Authorization = AUTH_TOKEN
// instance.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
// 覆写库的超时默认值
// 现在，在超时前，所有请求都会等待 2.5 秒
// instance.defaults.timeout = 2500;

// 添加请求拦截器
// instance.interceptors.request.use(function (config) {
//   // 在发送请求之前做些什么
//   return config
// }, function (error) {
//   // 对请求错误做些什么
//   return Promise.reject(error)
// })

// // 添加响应拦截器
// instance.interceptors.response.use(function (response) {
//   // 对响应数据做点什么
//   return response
// }, function (error) {
//   // 对响应错误做点什么
//   return Promise.reject(error)
// })

export default instance
