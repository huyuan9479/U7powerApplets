// pages/contant/contant.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
      imgFlag:true,
      saveBtn:true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  bigImg(){
    this.setData({
      imgFlag:false
    })
  },
  cancel(){
    this.setData({
      imgFlag: true
    })
  },
  savePhoto(){
    let that = this;  
    wx.getSetting({
      success(res) {
        if (res.authSetting['scope.writePhotosAlbum']){//用户授权
          that.saveImg();
        }else{
          wx.authorize({
            scope: 'scope.writePhotosAlbum',
            success() {
              that.saveImg();
            },fail(fail){
              wx.showToast({
                title: '您还未授权相册，请前往授权',
                icon: 'none',
                duration: 2000
              })
              that.setData({
                saveBtn:false,
              })
            }
          })
        }
      }
    })   
  },
  openSetting(e){
    if (e.detail.authSetting['scope.writePhotosAlbum']) {
      this.setData({
        saveBtn:true
      })
    } 
  },
  saveImg(){
    wx.saveImageToPhotosAlbum({
      filePath: "images/tdcode.jpg",
      success(res) {
        wx.showToast({
          title: '保存成功',
          icon: 'none',
          duration: 2000
        })
        that.setData({
          imgFlag: true
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

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