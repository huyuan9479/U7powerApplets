// pages/selectCity/selectCity.js
var QQMapWX = require('../../../utils/qqmap-wx-jssdk.min.js');
var qqmapsdk;
Page({
  app : getApp(),
  /**
   * 页面的初始数据
   */
  data: {
    keyword:'',
    locationFail:false,//定位失败
    deiBtn:false,//删除图标
    cancelText:false,//取消文字
    mark:false,//搜索聚焦遮罩
    search:false,//搜索框有文字
    focus:false,//输入框是否聚焦
    nodata:false,//搜索为空
    width:"100%",//搜索框宽度
    hotCity:[],//热门城市列表
    historyCity:[],//历史访问
    cityList:[],//城市列表
    btn: [{ type: "当前", id:'present'},
      {type: "历史", id: 'history' },
      { type: "热门", id: 'hot' },
      { type: "A", id: 'A' },
      { type: "B", id: 'B' },
      { type: "C", id: 'C' },
      { type: "D", id: 'D' },
      { type: "E", id: 'E' },
      { type: "F", id: 'F' },
      { type: "G", id: 'G' },
      { type: "H", id: 'H' },
      { type: "I", id: 'I' },
      { type: "J", id: 'J' },
      { type: "K", id: 'K' },
      { type: "L", id: 'L' },
      { type: "M", id: 'M' },
      { type: "N", id: 'N' },
      { type: "O", id: 'O' },
      { type: "P", id: 'P' },
      { type: "Q", id: 'Q' },
      { type: "R", id: 'R' },
      { type: "S", id: 'S' },
      { type: "T", id: 'T' },
      { type: "U", id: 'U' },
      { type: "V", id: 'V' },
      { type: "W", id: 'W' },
      { type: "X", id: 'X' },
      { type: "Y", id: 'Y' },
      { type: "Z", id: 'Z' }],
    toView:''
  },

  /**
   * 生命周期函数--监听页面加载
   */

  onLoad: function (options) {
    let that = this;
    qqmapsdk = new QQMapWX({
      key: 'IIOBZ-W5KWX-3IE4H-ZJ4HF-TCAK7-TWB35'
    });
    // 获取屏幕高度
    wx.getSystemInfo({
      success(res) {
        that.setData({
          height:res.windowHeight+"px"//单位px
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.getHotCity();
    // ;
    this.analysisSite();
  },
  analysisSite(){//解析地址
    let that = this;
    wx.showLoading({
      title: '加载中...',
      mask:true
    })

    qqmapsdk.reverseGeocoder({//地址逆解析
      get_poi: 0,
      success(res) {
        // let site = res.result.address_component.city;
        that.getCityList(res.result.address_component.city) 
      },
      fail(error){
        wx.hideLoading();
        wx.showModal({
          title: '提示',
          content: '您还未授权位置信息，是否授权',
          success(res) {
            if (res.confirm) {
              wx.openSetting({
                success(res) {
                  if (res.authSetting["scope.userLocation"]){
                    that.analysisSite();
                  }
                }
              })
            } else if (res.cancel) {
              that.getCityList();
              that.setData({
                noInfo:true
              })
            }
          }
        })
      }
    })
    setTimeout(() => {
      wx.hideLoading();
    }, 0);
  },
  getHotCity(){//获取热门城市
    const urlLoaction = `extension/findSmallProgramCity`;
    this.app.http.get(urlLoaction).then(res => {
      this.setData({
        hotCity: res.data.popularCitys,
        historyCity: res.data.wxHistoryCity
      })
    })
  },
  getCityList(site) {//获取城市列表
    const urlLoaction = `extension/findAllCity`;
    const params = {
      areaName: ""
    }
    this.app.http.get(urlLoaction, params).then(res => {
      if(site){
        let locationCity = res.data.filter(item => {
          return item.areaName.indexOf(site) > -1
        })
        this.setData({
          locationCity: locationCity
        })
      }
      
      let city = res.data.sort((a, b) => {
        return a.areaName.localeCompare(b.areaName, "zh");
      })//城市列表排序
      this.setData({
        list: city
      })
      let initial = city.map(item => {
        return item.en.substr(0, 1);
      });
      //首字母去重
      let flag = null;
      let arr = [];
      for (let i = 0; i < initial.length; i++) {
        flag = true;
        for (let j = 0; j < arr.length; j++) {
          if (initial[i] === arr[j]) {
            flag = false;
            break;
          }
        }
        if (flag) {
          arr.push(initial[i]);
        }
      }
      arr = arr.sort((a, b) => {
        return a.localeCompare(b, "zh");
      });
      let array = [];
      arr.forEach(item => {
        let obj = {
          type: item,
          list: [],
        }
        city.forEach(i => {
          if (item == i.en.substr(0, 1)) {
            obj.list.push(i)
          }
        })
        array.push(obj)
      })

      this.setData({
        cityList: array
      })
      wx.hideLoading();
    }) 
  },
  searchCityList(){//获取搜索城市列表
    let that = this;
    const urlLoaction = `extension/findAllCity`;
    const params = {
      areaName:that.data.keyword
    }
    this.app.http.get(urlLoaction, params).then(res => {
      this.setData({
        mark: false //半透明遮罩隐藏
      })
      if (!res.data.length) {//无数据  
        this.setData({
          nodata:true,
          search:false
        })
      }else{
        this.setData({//有数据
          searchList: res.data,
          search: true,
          nodata: false 
        })
      }  
    })
  },
  selectSS(e) {//跳转页面到选择社保
    wx.showLoading({
      title: '加载中...',
      mask:true
    })
    this.app.globalData.city = e.currentTarget.dataset["info"].areaName;
    const urlLoaction = `extension/updateCity`;
    const params = {
      areaId: e.currentTarget.dataset["info"].areaId,
      parentId: e.currentTarget.dataset["info"].parentId,
      areaCode: e.currentTarget.dataset["info"].areaCode,
      areaName: e.currentTarget.dataset["info"].areaName,
      areaNameEn: e.currentTarget.dataset["info"].areaNameEn,
      en: e.currentTarget.dataset["info"].en,
    }
    this.app.http.post(urlLoaction, params).then(res => {
      if (res.resCode == '0000'){
        wx.navigateTo({
          
          // url: '../selectSS/selectSS?id=' + e.currentTarget.dataset["info"].areaId + "&name=" + e.currentTarget.dataset["info"].areaName,
          url: '../trialType/trialType?id=' + e.currentTarget.dataset["info"].areaId + "&name=" + e.currentTarget.dataset["info"].areaName,
        })
      }
    })     
  },
  scroll() {//监听页面滚动
    this.setData({
      toView: ''
    })
  },
  clickBtn(e) {//点击侧边按钮
    this.setData({
      toView: e.currentTarget.dataset.id
    })
  },
  inputFocus(e){//输入框聚焦
    this.setData({
      width: '596rpx',
      focus: true,
      cancelText: true
    })
    if (e.detail.value == ""){
      this.setData({ 
        delBtn: false,
        mark: true,
        search: false
      })
    }else{
      this.setData({
        delBtn: true
      })
    } 
  },
  searchConfirm(e){
    if (e.detail.value != ""){
      this.setData({
        keyword: e.detail.value,
        delBtn: true
      })
    }
    this.setData({
      cancelText:true
    })
    this.searchCityList();
    },
  delSearch(){
    this.setData({
      keyword: "",
      mark:true,
      delBtn: false,
      focus: true
    })
  },
  cancel(){
    this.setData({
      delBtn: false,
      cancelText: false,
      keyword: "",
      mark: false,
      width:"100%"
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