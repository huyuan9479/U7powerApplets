// pages/setWelfare/setWelfare.js
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
    this.setData({
      flag : JSON.parse(options.flag)
    })
  },
  /**
 * 生命周期函数--监听页面初次渲染完成
 */
  onReady: function () {
    // this.getWelfareList();
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.setData({
      type:this.app.globalData.type,
      natural:''
    })
    this.data.list.forEach(item => {
      if (item.itemCode == 'natural') {
        item.percent = ''
      }
    })
    if (this.data.type == '52151'){
      this.setData({
        placeholder:'-'
      })
    }else{
      this.setData({
        placeholder: '请输入'
      })
    }
    this.getWelfareList();
  },
  getWelfareList(){
    let arr = [],that = this;
    arr = this.app.globalData.welfare.filter(item => {
      return item.checked;
    });
    that.setData({
      list: JSON.parse(JSON.stringify(arr)).map(item => {
        let list=[];
        item.index="0";
        item.minMax = (item.minPercent * 100).toFixed(0) + "% ~ " + (item.maxPercent *100).toFixed(0)  +"%";
        let min = Number((item.minPercent * 100).toFixed(0));
        let len = Number((item.maxPercent * 100).toFixed(0)) + 1;
        for (var i = min; i < len ;i++){
          list.push(i+"%")
        }
        item.list =list;
        item.percent = item.list[0];
        return item;
      })
    })
  },
  bindPickerChange(e) {//改变福利比列
    let obj = e.currentTarget.dataset.item;
    this.data.list.forEach(item => {
      if (item.itemName == obj.itemName) {
        item.index = e.detail.value;
        item.percent = obj.list[item.index]
      }
    })
    this.setData({
      list: this.data.list
    })
    
  },
  getNatural(e){
    this.setData({
      natural: e.detail.value
    })
    this.data.list.forEach(item => {
      if (item.itemCode == 'natural') {
        item.percent = e.detail.value
      }
    })
    this.setData({
      list: this.data.list
    })
  },
  addStaff() {//跳转页面添加员工
    if(this.data.flag){
      if (this.data.type != '52151' && !this.data.natural) {
        wx.showToast({
          title: '自然人代征项请手动输入',
          icon: 'none',
          duration: 2000
        })
        return;
      }
    }
    wx.showLoading({
      title: '数据加载中...',
      mask: true
    })
    let list=[];
    this.data.list.forEach(item => {
      delete item.pictureurl;
      delete item.list;
      delete item.checked;
      delete item.index;
      delete item.minMax;
      let len = item.percent.length;
      if (item.itemName != '自然人代征'){
        item.percent = Number(item.percent.substr(0, len - 1)) / 100
      } else{
        if (this.data.type =='52151'){
          item.percent = item.percent.substr(0, len - 1)
        }
      }
    })
    list = this.data.list;
    const urlLoaction = `extension/updateBrhSalaryOptimizeScheme`;
    const params = {
      id: this.app.globalData.schemeId,
      tbrhPertaxItemList: list
    }
    this.app.http.post(urlLoaction, params).then(res=>{
      if(res){
        wx.hideLoading();
        wx.navigateTo({
          url: '../addStaff/addStaff',
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