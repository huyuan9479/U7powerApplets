export class HttpClient {
  cookieKey = 'sessionId';// 本地存储cookie名字
  // domain = 'http://192.168.30.20:8084/hrwelfare';// 后台请求地址(大强)
  // domain = 'http://192.168.30.224:8084/hrwelfare';// 后台请求地址(袁春杰)
  // domain = 'https://test.u7power.com/hrwelfare';// 后台请求地址(测试)
  domain = 'https://hr.u7power.com/hrwelfare';// 后台请求地址(生产)
  request(method, url, data) {
    let $$header = Object.assign({}, this.setHeaders());
    const $$url = `${this.domain}/${url}`;
    return new Promise((resolve, reject) => {
      wx.request({
        url: $$url,
        data: data,
        header: $$header,
        method: method,
        dataType: 'json',
        success: function (res) {
          resolve(res);
        },
        fail: function (res) {
          reject(res);
        }
      })
    }).then(res => {
      const cookie = res.cookie ? res.cookie : '';
      // 这里如果后台返回的有更新cookie 或者是第一次返回 cookie 设置到本地存储
      // 下次请求携带上cookie
      if (cookie) {
        wx.setStorageSync(this.cookieKey, cookie);
      }
      const result = res.data;
      if (result.resCode === "0000") {
        return result;
      } else if (result.resCode === "mobile_null"){
        wx.navigateTo({
          url: '../index/index',
        })
      }else{
        wx.hideLoading();
        // throw new Error(result.resMsg);
        if (result.resMsg == "方案过多"){
          wx.showModal({
            title: '提示',
            content: result.resMsg,
            success(res) {
              wx.switchTab({
                url: '../../history/history'
              })
            }
          })
        }else{
          wx.showModal({
            title: '提示',
            content: result.resMsg,
            success(res) { 
            }
          })
        }
        
      }
    });
  }
  /**
   * 设置请求的 header, header 中不能设置 Referer
   */
  setHeaders() {
    return {
      'content-type': 'application/json', // 默认值
      'Cookie': `${wx.getStorageSync(this.cookieKey)}` ? `${wx.getStorageSync(this.cookieKey)}` : 'none'
    }
  }
  /**
   * GET 请求
   */
  get(url, params = {}) {
    Object.keys(params).forEach((key, index) => {
      url += index === 0 ? '?' : '&';
      url += `${key}=${encodeURIComponent(params[key])}`;
    });
    return this.request(`GET`, url, '');
  }
  /**
   * POST 请求
   */
  post(url, data) {
    return this.request(`POST`, url, data);
  }
  /**
   * PUT 请求
   */
  put(url, data) {
    return this.request(`PUT`, url, data);
  }
  /**
   * DELETE 请求
   */
  delete(url, data) {
    return this.request(`DELETE`, url, data);
  }
  /**
   * 使用方法说明：把这个文件导入到 app.js
   * // app.js 顶部导入
   * import { HttpClient } from './utils/http-client.js';
   * App({
   *    http: new HttpClient()
   * });
   * 
   * // login.js
   * Page({
   *    app: getApp(),
   *    data: {
   *      userInfo: null
   *    },
   *    onClickSendRequest: function(e) {
   *      比如说登录请求
   *      const urlLoaction = `/user/login`;
   *      const userLoginInfo = {
   *        userPhone: '12345678901',
   *        password: 'key|root'
   *      };
   *      this.app.http.post(urlLoaction, userLoginInfo).then((res)=> {
   *        // 这个是set到全局data用户信息，别的页面直接可以获取到
   *        this.app.globalData.userInfo = res.userInfo;
   *        // 这个是set到当前页面，可以在当前页面做展示用户信息用
   *        this.setData({
   *          userInfo: res.userInfo,
   *        });
   *      });
   *    }
   * });
   * 
   * 上面写的是调用方法详情
   * 下面写的是简单调用方法
   * const urlLoaction = `/user/login`; // 请求后台地址
   * const params = {}; // 传递参数的对象
   * this.app.http.get(urlLoaction, params).then((res)=> {
   *  // 这里做逻辑处理
   * });
   * this.app.http.post(urlLoaction, params).then((res)=> {
   *  // 这里做逻辑处理
   * });
   * this.app.http.put(urlLoaction, params).then((res)=> {
   *  // 这里做逻辑处理
   * });
   * this.app.http.delete(urlLoaction`, params).then((res)=> {
   *  // 这里做逻辑处理
   * });
   * 
   */
}