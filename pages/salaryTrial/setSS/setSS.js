// pages/setSS/setSS.js
Page({
  app:getApp(),
  /**
   * 页面的初始数据
   */
  data: {
    setList:[],
    // itemIndex:0
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
    this.getSetList();
  },
  getSetList(){
    let arr = [],that = this;
    arr = this.app.globalData.socialSecurity.filter(item => {
      return item.checked;
    });

    that.setData({
      setList: JSON.parse(JSON.stringify(arr)).map(item => {
        item.index = "0";
        item.person = (item.list[0].personPercent) + "%";
        item.list.forEach(i => {
          i.companyPercent = (i.companyPercent) + "%"
        })
        return item;
      })
    })
  },
  bindPickerChange(e) {//改变社保比例
    let obj = e.currentTarget.dataset.item;
    this.data.setList.forEach(item => {
        if (item.schemeName == obj.schemeName) {
          item.index = e.detail.value;
          item.person = (obj.list[e.detail.value].personPercent) + "%";
        }
    })
    this.setData({
      setList: this.data.setList
    })
  },
  selectWelfare() {//下一步选择福利
    wx.showLoading({
      title: '数据加载中...',
      mask: true
    })
    let that = this;
    let list = [];
    that.data.setList.forEach(item => {
      list.push(item.list[item.index])
    })
    list.forEach(item => {
      let len = item.companyPercent.length;
      item.companyPercent = Number(item.companyPercent.substr(0,len-1)) / 100;
    })
    const urlLoaction = `extension/updatePolicyItemParam`;
    const params = {
        city: this.data.cityId,
        cityName: this.data.cityName,
        schemeId: this.app.globalData.schemeId,
        optimizeType: this.app.globalData.type,
        list: list
       }
    that.app.http.post(urlLoaction, params).then(res => {
     if(res){
       wx.hideLoading();
       that.app.globalData.schemeId = res.resMsg;
       wx.navigateTo({
         url: '../selectWelfare/selectWelfare',
       }) 
     }   
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