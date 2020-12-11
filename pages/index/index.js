// pages/index/index.js
Page({
  app : getApp(),
  /**
   * 页面的初始数据
   */
  data: {
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
     // 获取屏幕高度
    wx.getSystemInfo({
      success(res) {
        that.setData({
          height: (res.windowHeight - that.toPx(716)) + "px"//单位px
        })
      }
    })
    
    let arr = Object.keys(options);
    wx.removeStorageSync('sessionId')
    wx.login({//登陆获取临时code
      success: res => {
        const urlLoaction = `extension/landOpenId`;
        const params = { code: res.code };
        that.app.http.get(urlLoaction, params).then((res) => {
          //获取openid 和 session_key
          if(res){
            wx.setStorageSync("sessionId", "JSESSIONID=" + res.data)//sessionId存储到本地
          } 
        })
      }
    })
  },
  toPx(rpx) {    // rpx转px
    const sysInfo = wx.getSystemInfoSync();
    const screenWidth = sysInfo.screenWidth;
    // 获取比例
    const factor = screenWidth / 750; 
    return rpx * factor;
  },
  start(){
    const urlLoaction = `extension/brhSalaryOptimizeSchemeList`;
    this.app.http.get(urlLoaction).then(res => {
      if (res) {
        this.setData({
          num: res.data.length
        })
        if (this.data.num >= 5) {
          wx.showToast({
            title: '方案过多，请前往历史记录删除',
            icon: 'none',
            duration: 2000
          })
          return;
        }
        wx.navigateTo({
          // url:'../residualBenefits/calculation/calculation'
          url: '../salaryTrial/selectCity/selectCity',
        })

      }
    })
    console.log(this.data.num)
    
  },
  individual(){
    wx.navigateTo({
      url: '../individualTrials/calculator/calculator',
    })
  },
  residualBenefits(){
    wx.navigateTo({
      url: '../residualBenefits/selectCity/selectCity',
    })
  },
  // getHistoryList() {//获取历史列表
    // const urlLoaction = `extension/brhSalaryOptimizeSchemeList`;
    // this.app.http.get(urlLoaction).then(res => {
    //   if (res) {
    //     this.setData({
    //       num: res.data.length
    //     })
    //   }
    // })
  // },
  // history(){
  //   wx.navigateTo({
  //     url: '../history/history',
  //   })
  // },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    // this.getHistoryList();
    wx.setNavigationBarColor({
      frontColor: '#ffffff',//前景颜色值，包括按钮、标题、状态栏的颜色
      backgroundColor: '#3F86FF',//背景颜色值
      // backgroundColor: '#5378e9',//背景颜色值
    })    
    // this.app.globalData.socialSecurity = null,//社保列表
    // this.app.globalData. welfare = null,//福利列表
    this.app.globalData.schemeId = null//方案id
    // this.app.globalData.staffList = [],//员工列表
    // this.app.globalData.trialInfo = null,//试算信息（总）
    // this.app.globalData.staffDetail = null//试算员工的工资详情
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  // onUnload: function () {

  // },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return {
      title: '优企宝算薪小程序',
      path: '/pages/index/index',
      imageUrl: "../../images/share_img.jpg"
    }
  }
})