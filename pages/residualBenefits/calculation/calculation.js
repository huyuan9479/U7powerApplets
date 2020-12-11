// pages/residualBenefits/calculation/calculation.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let obj = JSON.parse(options.obj);
    this.setData({
      cityName:obj.cityName,
      cityId:obj.cityId,
      rate:obj.rate,
      baseNum:obj.baseNum
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },
  getTotalPeople(e) {
    this.setData({
      totalPeople: e.detail.value
    })
  },
  getAmount(e) {
    this.setData({
      amount: e.detail.value
    })
  },
  getDisabledNum(e){
    this.setData({
      disabledNum: e.detail.value
    })
  },
  confirm() {
    if (!this.data.totalPeople || !this.data.amount || !this.data.disabledNum){
      wx.showToast({
        title: '输入框不能为空',
        icon: 'none',
        duration: 2000
      })
      return false;
    }
    let obj = {
      cityName : this.data.cityName,
      cityId : this.data.cityId,
      totalPeople: this.data.totalPeople,
      amount : this.data.amount,
      disabledNum : this.data.disabledNum,
      baseNum: this.data.baseNum
    }
    wx.redirectTo({
      url: '../calculationResults/calculationResults?obj=' + JSON.stringify(obj),
    })


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

  }
})