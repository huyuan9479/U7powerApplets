// pages/selectSS/selectSS.js
//获取应用实例
// const app = getApp();
Page({
  app:getApp(),
  /**
   * 页面的初始数据
   */
  data: {
    i:0,
    list:[],
    noData:false,
    hide:false,
    height:"100rpx"
    // checked: [],
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      cityId:options.id,
      cityName:options.name
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.getSocialSecurity()
  },
  /**
 * 生命周期函数--监听页面显示
 */
  onShow: function () {
    this.setData({
      list: this.app.globalData.socialSecurity,
      city: this.app.globalData.city
    })
  },
  bindPickerChange(e) {
    this.setData({
      i: e.currentTarget.dataset["index"],
      hide:false
    })
    this.getSocialSecurity();
  },
  getSocialSecurity(){
    wx.showLoading({
      title: '加载中...',
      mask: true
    })
    const urlLoaction = `extension/queryPolicySocialSecurityAndResfund`;
    const params = { areaId: this.data.cityId}
    this.app.http.get(urlLoaction, params).then(res => {
      if (res.soicalList != null){
        let list = [];
        let len = res.soicalList.length;
        res.soicalList[this.data.i].list.forEach(item => {
          if(item.list.length != 0){
            item.checked = true;
            list.push(item)
          }  
        })
        if(len < 3){
          this.setData({
            height:len * 100 +"rpx"
          })
        }else{
          this.setData({
            height: "300rpx"
          })
        }
        this.setData({
          list: list,
          socialName: res.soicalList[this.data.i].policyName,
          soicalList: res.soicalList
        })
        this.app.globalData.socialSecurity = this.data.list;
      }else{
        this.setData({
          noData:true
        })
      }
      wx.hideLoading();
      // let arr = ["养老保险", "生育保险", "医疗保险", "失业保险", "工伤保险"]
      // res.list.forEach(item => {
      //   item.checked = false;
      //   arr.forEach(i => {
      //     if (item.schemeName == i) {
      //       item.checked = true;
      //     }
      //   })
      //   if (item.checked){
      //     list.unshift(item)
      //   }else{
      //     list.push(item)
      //   }
      // })
      // let list = [];
      // list.push(res.soicalList[this.data.index])
      // this.setData({
      //   list: list,
      //   soicalList: res.soicalList
      // })
      // this.app.globalData.socialSecurity = this.data.list;

      // wx.hideLoading();
    })
  },
  clickItem(e) {//点击复选框
    let that = this;
    let index = e.currentTarget.dataset.index;
    this.data.list.forEach((item, i) => {
      if (i == index) {
        item.checked = !item.checked;
      }
    })
    that.setData({
      list: this.data.list,
    })
    this.app.globalData.socialSecurity = this.data.list;
  },
  nextSetSS() {//跳转设置社保页
    
    let flag = this.app.globalData.socialSecurity.some(item => {
      return item.checked == true
    })
    if (!flag){
      wx.showToast({
        title: '请选择社保科目',
        icon: 'none',
        duration: 3000
      })
    }else{ 
      wx.showLoading({
        title: '加载中...',
        mask: true
      })
      wx.navigateTo({
        url: '../setSS/setSS?id=' + this.data.cityId + "&name=" + this.data.cityName,
      })
      wx.hideLoading()
    }
    
  },
  selShow(){
    this.setData({
      hide:true
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
    return {
      title: '优企宝算薪小程序',
      path: '/pages/index/index',
      imageUrl: "../../images/share_img.jpg"
    }
  }
})