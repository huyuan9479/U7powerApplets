// pages/addStaff/addStaff.js
Page({
  app : getApp(),
  /**
   * 页面的初始数据
   */
  data: {
    staffList:[],
    name: "",
    money: "",
    ssAmount:'',
    provident:''
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
          height: (res.windowHeight) + "px"//单位px
        })
      }
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
    this.setData({
      type:this.app.globalData.type
    })
    this.getStaffList();
    // this.setData({
    //   staffList: this.app.globalData.staffList
    // })
  },
  getStaffList(){
    const urlLoaction = `extension/queryStaffIds`;
    const params = {
      schemeId: this.app.globalData.schemeId
    }
    this.app.http.post(urlLoaction, params).then(res => {
      if(res){
        this.setData({
          staffList: res.data
        })
        wx.hideLoading();
      }
    })
  },
  result() {//下一步
    if(!this.data.staffList.length){
      wx.showToast({
        title: '请添加员工',
        icon: 'none',
        duration: 2000
      })
    }else{
      wx.showLoading({
        title: '数据加载中...',
        mask: true
      })
      wx.navigateTo({
        url: '../result/result',
      })
    } 
  },
  add() {//跳转添加员工页面
    if(this.data.staffList.length == 3){
      wx.showToast({
        title: '最多同时添加3人',
        icon: 'none',
        duration: 2000
      })
    }else{
      // wx.navigateTo({
      //   url: '../add/add',
      // })
      this.setData({
        add:true,
        name:"",
        money:""
      })
    }  
  },
  delStaff(e){//删除员工
    let ids = [];
    ids.push(e.currentTarget.dataset["id"])
    const urlLoaction = `extension/delStaff`;
    const params = {
      schemeId: this.app.globalData.schemeId,
      staffIds: ids,
    }
    this.app.http.post(urlLoaction, params).then(res => {
      if(res){
        this.getStaffList();
      } 
    })
  },



  //添加员工
  getName(e) {
    this.setData({
      name: e.detail.value
    })
  },
  getSalary(e) {
    this.setData({
      money: e.detail.value
    })
  },
  getSS(e){//获取社保基数
    this.setData({
      ssAmount: e.detail.value
    })
  },
  getProvident(e){//公积金基数
    this.setData({
      provident: e.detail.value
    })
  },
  addStaff() {//点击保存返回上个页面
    if (!this.data.name || !this.data.money) {
      wx.showToast({
        title: '参数不能为空',
        icon: 'none',
        duration: 2000
      })
      return false;
    }
    if (this.data.type == '52151'){
      if (!this.data.ssAmount || !this.data.provident){
        wx.showToast({
          title: '参数不能为空',
          icon: 'none',
          duration: 2000
        })
        return false;
      }
    }
    // if (!this.data.money) {
    //   wx.showToast({
    //     title: '请输入大于0的数字',
    //     icon: 'none',
    //     duration: 2000
    //   })
    //   return false;
    // }
    // if (Number(this.data.money) <= 0) {
    //   wx.showToast({
    //     title: '请输入大于0的数字',
    //     icon: 'none',
    //     duration: 2000
    //   })
    //   return false;
    // }
    wx.showLoading({
      title: '数据加载中...',
      mask: true
    })
    let params = {};
    if (this.data.type =='52150'){//税前
       params = {
        name: this.data.name,
        grossPay: this.data.money,
        schemeId: this.app.globalData.schemeId,
      }
    } else if (this.data.type == '52151'){//到手
      params = {
        name: this.data.name,
        toGetSalary: this.data.money,
        socialBase: this.data.ssAmount,//社保基数
        resfundBase: this.data.provident,//公积金基数
        schemeId: this.app.globalData.schemeId,
      }
    }else{//企业负担
      params = {
        name: this.data.name,
        enterpriseBurden: this.data.money,
        schemeId: this.app.globalData.schemeId,
      }
    }
    const urlLoaction = `extension/addStaff`;
    this.app.http.post(urlLoaction, params).then(res => {
      if (res) {
        wx.hideLoading();
        this.setData({
          add: false
        })
        this.getStaffList();
      }
    })
    // if (this.data.name && this.data.money) {
    //   let obj = {
    //     name: this.data.name,
    //     money: this.data.money
    //   }
    //   let flag = false;
    //   if (isNaN(this.data.money)) {
    //     flag = true;
    //   }
    //   if (flag) {
    //     wx.showToast({
    //       title: '工资请输入数字',
    //       icon: 'none',
    //       duration: 2000
    //     })
    //   } else {
    //     wx.showLoading({
    //       title: '数据加载中...',
    //       mask: true
    //     })
    //     const urlLoaction = `extension/addStaff`;
    //     const params = {
    //       name: this.data.name,
    //       grossPay: this.data.money,
    //       schemeId: this.app.globalData.schemeId,
    //     }
    //     this.app.http.post(urlLoaction, params).then(res => {
    //       if (res.resCode == "0000") {
    //         // wx.navigateBack({ delta: 1 })
    //         wx.hideLoading();
    //         this.setData({
    //           add: false
    //         })
    //         this.getStaffList();
    //       }
    //     })
    //   }
    // } else if (!this.data.money) {
    //   wx.showToast({
    //     title: '工资不能为空',
    //     icon: 'none',
    //     duration: 2000
    //   })

    // } else if (!this.data.name) {
    //   wx.showToast({
    //     title: '姓名不能为空',
    //     icon: 'none',
    //     duration: 2000
    //   })
    // }
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