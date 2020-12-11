//app.js
import { HttpClient } from 'utils/http.js';
App({
  http: new HttpClient(),
  onLaunch: function (options) {
    // 展示本地存储能力
    // var logs = wx.getStorageSync('logs') || []
    // logs.unshift(Date.now())
    // wx.setStorageSync('logs', logs)

  },
  globalData: {
    city:null,//定位地址
    socialSecurity:null,//社保列表
    welfare:null,//福利列表
    schemeId:null,//方案id
    staffDetail:null,//试算员工的工资详情,
    type:null,//试算员工类型
  }
})