// pages/selectCity/selectCity.js
Page({
  app : getApp(),
  /**
   * 页面的初始数据
   */
  data: {
    cityList: [],
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
          height: res.windowHeight + "px"//单位px
        })
      }
    })

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  },
  getCityList() {//获取城市列表
    const urlLoaction = `disability/cityList`;
    this.app.http.post(urlLoaction).then(res => {
      if(res.resCode == '0000'){
        this.setData({
          cityList:res.objectRs
        })
      }
      wx.hideLoading();
    }) 
  },

  selectSS(e) {//跳转残保金计算
    let obj = e.currentTarget.dataset["info"];
    // wx.showLoading({
    //   title: '加载中...',
    //   mask:true
    // })
    // this.app.globalData.city = e.currentTarget.dataset["info"].areaName;
    // const urlLoaction = `extension/updateCity`;
    // const params = {
    //   areaId: e.currentTarget.dataset["info"].areaId,
    //   parentId: e.currentTarget.dataset["info"].parentId,
    //   areaCode: e.currentTarget.dataset["info"].areaCode,
    //   areaName: e.currentTarget.dataset["info"].areaName,
    //   areaNameEn: e.currentTarget.dataset["info"].areaNameEn,
    //   en: e.currentTarget.dataset["info"].en,
    // }
    // this.app.http.post(urlLoaction, params).then(res => {
    //   if(res){
        wx.navigateTo({
          url: '../calculation/calculation?obj=' + JSON.stringify(obj),
        })
    //   }
    // })     
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.getCityList();
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

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