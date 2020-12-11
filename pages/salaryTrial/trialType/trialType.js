// pages/salaryTrial/trialType/trialType.js
Page({
  app: getApp(),
  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      cityId: options.id,
      cityName: options.name
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
    this.app.globalData.type = '52150';
    this.setData({
      city: this.app.globalData.city,
      list:[
        {
          name:'税前工资',
          type:'52150',
          checked:true
        },{
          name: '到手工资',
          type: '52151',
          checked: false
        }, {
          name: '企业负担',
          type: '52152',
          checked: false
        }
      ]
    })
  },
  clickItem(e) {//点击复选框
    let index = e.currentTarget.dataset.index;
    this.app.globalData.type = e.currentTarget.dataset.type;
    this.data.list.forEach((item, i) => {
      if (i == index) {
        item.checked = !item.checked;
      }else{
        item.checked = false;
      }
    })
    this.setData({
      list: this.data.list,
    })
  },
  nextSelectSS(){
    wx.navigateTo({
      url: '../selectSS/selectSS?id=' + this.data.cityId + "&name=" + this.data.cityName,
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