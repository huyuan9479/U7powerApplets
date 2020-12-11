Page({
  app : getApp(),
  data: {
    options: {
      baseChunkHeight: 10,
      circleBtnWith: 40,
      step: 5,
      max: 100,
      nodata:false,
    },
    left:0,
    // delBtnWidth: 180,//删除按钮宽度单位（rpx）
    list:[]
  },  
  onLoad: function (options) {
  },
  onReady: function () {
    
  },
  onShow: function () {
    // 页面显示
    this.getHistoryList();
  },
  getHistoryList(){//获取历史列表
    wx.showLoading({
      title: '加载中...',
      mask:true
    })
    const urlLoaction = `extension/brhSalaryOptimizeSchemeList`;
    this.app.http.get(urlLoaction).then(res => {
      if(res){
        res.data.forEach(item => {
          item.txtStyle = "";
          item.mark = false;
        })
        this.setData({
          list: res.data
        })
        if (this.data.list.length == 0) {
          this.setData({
            nodata: true
          })
        } else {
          this.setData({
            nodata: false
          })
        }
        wx.hideLoading();
      }  
    }) 
  },
  delItem(e){
    let that = this;
    wx.showModal({
      title: '提示',
      content: '是否删除该记录',
      success(res) {
        if (res.confirm) {
          const urlLoaction = `extension/deleteBrhSalaryOptimizeScheme`;
          const params = { id: e.currentTarget.dataset["id"] }
          that.app.http.post(urlLoaction, params).then(res => {
            if(res){
              wx.showToast({
                title: '删除成功！',
                icon: 'success',
                duration: 2000
              })
              that.getHistoryList();
            }
          })
        }
      }
    })
  },
  onHide: function () {
    // 页面隐藏
  },
  onUnload: function () {
    // 页面关闭
  },
  touchStart(e) { //手指触摸动作开始
    this.data.list.forEach(item=>{
      item.mark=false;
    })
    if (e.touches.length == 1) {
      this.setData({
        startX: e.touches[0].clientX//设置触摸起始点水平方向位置
      });
    }
  },
  touchMove(e) {//手指触摸移动位置
    if (e.touches.length == 1){
      var moveX = e.touches[0].clientX;//手指移动时水平方向位置 
      var disX = this.data.startX - moveX;//手指起始点位置与移动期间的差值
      var txtStyle = "";
      if (disX == 0 || disX < 0) {//如果移动距离小于等于0，位置不变（右划）
        txtStyle = 0;
        // this.setData({
        //   'list[' + e.currentTarget.dataset.index + '].txtStyle': 0
        // })
        // this.setData({
        //   left:0,
        // })
      } else if (disX > 0) {//移动距离大于0(左划)，
        txtStyle = "-" + disX
        // this.setData({
        //   left: '-' + disX,
        // })
        if (disX >= 160) {//控制手指移动距离最大值为删除按钮的宽度 
          // this.setData({
          //   left: '-160',
          // })
          txtStyle = '-160'
        }
      }
      //获取手指触摸的是哪一项
      var index = e.currentTarget.dataset["index"];
      var list = this.data.list;
      //互斥操作
      for (var i = 0; i < list.length; i++) {
        if (i == index) {
          list[i].txtStyle = txtStyle;
        } else {
          list[i].txtStyle = "0"
        }
      }
      // list[index].txtStyle = txtStyle;
      //更新列表的状态
      this.setData({
        list: list
      });
    }
  },
  touchEnd(e) {  //手指触摸结束
    if (e.changedTouches.length == 1) {
      var endX = e.changedTouches[0].clientX;//手指移动结束后水平位置
      var disX = this.data.startX - endX;//触摸开始与结束，手指移动的距离
      //如果距离小于删除按钮的1/2，不显示删除按钮
      var txtStyle = disX > (160 / 2) ? '-160' : "0";
      // this.setData.left = disX > 160 / 2 ? '-160'  : "0";
      
      //获取手指触摸的是哪一项
      var index = e.currentTarget.dataset.index;
      var list = this.data.list;
      if (txtStyle == "-160") {
        list[index].mark = true;
      }
      list[index].txtStyle = txtStyle;
     
      //更新列表的状态
      this.setData({
        list: list
      });
    }
  },
  planDetails(e){
    this.app.globalData.schemeId = e.currentTarget.dataset["id"];
    this.app.globalData.type = e.currentTarget.dataset["type"];
    wx.navigateTo({
      url: '../salaryTrial/result/result',
    })
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
