// pages/selecctWelfare/selecctWelfare.js
//获取应用实例
Page({
  app:getApp(),
  /**
   * 页面的初始数据
   */
  data: {
    list:[],
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function (options) {
    this.getWelfareList();
  },
  /**
 * 生命周期函数--监听页面显示
 */
  onShow: function () {
    this.setData({
      city: this.app.globalData.city,
      // list: this.app.globalData.welfare
    })
    
  },
  getWelfareList(){
    wx.showLoading({
      title: '数据加载中...',
      mask: true
    })
    const urlLoaction = `extension/selectSalaryPertaxItem`;
    const params = { companyStaff: "51012", isResfund: ""};
    this.app.http.post(urlLoaction, params).then(res => {
      if(res){
        res.data.forEach(item => {
          item.checked = false;
          item.includeTax = "0";
          if (item.itemCode == "accumulation_fund" || item.itemCode == "natural") {
            item.checked = true;
          }
        })
        this.setData({
          list: res.data
        })

        // this.app.globalData.welfare = this.data.list;

        wx.hideLoading();
      }
    })
  },
  clickItem(e) {//点击某一项
    let that = this;
    let code = e.currentTarget.dataset.itemcode;
    let index = e.currentTarget.dataset.index;
    if (code == 'accumulation_fund'){ 
      wx.showToast({
        title: '公积金项不能取消',
        icon: 'none',
        duration: 2000
      })
    } else if ((this.app.globalData.type == '52151' && code == 'natural') || (this.app.globalData.type == '52152' && code == 'natural')){
      wx.showToast({
        title: '自然人代征项不能取消',
        icon: 'none',
        duration: 2000
      })
    }else{
      this.data.list.forEach((item, i) => {
        if (i == index) {
          item.checked = !item.checked;
        }
      })
    }  
    that.setData({
      list: this.data.list,
    })
    // this.app.globalData.welfare = this.data.list;
  },
  setWelfare() {//跳转设置福利页
    let flag = false;
    this.data.list.forEach(item=>{
      if (item.itemCode == 'natural' && item.checked == true){
        flag = true;
      }
    })
    this.app.globalData.welfare = this.data.list;
    wx.navigateTo({
      url: '../setWelfare/setWelfare?flag='+flag,
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