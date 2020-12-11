// pages/result/result.js
import * as echarts from '../../../components/ec-canvas/echarts';
// const app = getApp();

Page({
  app: getApp(),
  /**
   * 页面的初始数据
   */
  data: { 
    ec: {
      lazyLoaded: true,
      disableTouch: true,  
    },
    rate: 0,
    len: false,
    share:true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let arr = Object.keys(options);
    let that = this;
    // 获取屏幕高度
    wx.getSystemInfo({
      success(res) {
        that.setData({
          height: (res.windowHeight - that.toPx(110)) + "px"//单位px
        })
      }
    })
    if(arr.length){ 
      that.setData({
        share: false
      })
      wx.removeStorageSync('sessionId');
      // 登录
      wx.login({
        success: res => {
          // 发送 res.code 到后台换取 openId, sessionKey, unionId
          const urlLoaction = `extension/landOpenId`;
          const params = { code: res.code}
          that.app.http.get(urlLoaction, params).then(res => {
            wx.setStorageSync("sessionId", "JSESSIONID=" + res.data)//sessionId存储到本地
            that.app.globalData.schemeId = options.schemeId;
            that.app.globalData.city = options.city; 
            that.app.globalData.type = options.type; 
            that.getList();
          }) 
        }
      })
      
    } 
  },
  toPx(rpx) {    // rpx转px
    const sysInfo = wx.getSystemInfoSync();
    const screenWidth = sysInfo.screenWidth;
    // 获取比例
    const factor = screenWidth / 750;
    return rpx * factor;
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
    if(this.data.share){
      this.getList();
    }
    this.setData({
      type:this.app.globalData.type
    })
    if (this.data.type =='52150'){
      this.setData({
        name1 : '员工所得（调整后）',
        name2: '企业成本去向（调整后）',
      })
    }else{
      this.setData({
        name1: '员工所得',
        name2: '企业成本去向',
      })
    }
    // 获取屏幕高度
    // wx.getSystemInfo({
    //   success(res) {
    //     that.setData({
    //       height: (res.windowHeight - that.toPx(70)) + "px"//单位px
    //     })
    //   }
    // })
    // that.toPx(70)  
  },
  // toPx(rpx) {    // rpx转px
  //   const sysInfo = wx.getSystemInfoSync();
  //   const screenWidth = sysInfo.screenWidth;
  //   // 获取比例
  //   const factor = screenWidth / 750; 
  //   return rpx * factor;
  // },
  getList(){
    wx.showLoading({
      title: '加载中...',
      mask: true
    })
    const urlLoaction = `extension/selectBrhSalaryOptimizeScheme`;
    const params = { id: this.app.globalData.schemeId};
    this.app.http.post(urlLoaction,params).then(res => {
      if(res.data){
        this.setData({
          list: res.data,
          rate: res.data.rate * 100,
          city: res.data.cityName
        })
        this.app.globalData.city = res.data.cityName;
        this.getData();
        this.getStaffDetial();
      }else{
        wx.showModal({
          title: '提示',
          content: '该方案已被删除',
          showCancel:false,
          success(res) {
            wx.redirectTo({
              url: '../../index/index'
            })
          }
        })
      }
      setTimeout(() => {
        wx.hideLoading();
      },0); 
    })
  },
  getData(){
    this.setData({
      city:"",
      staffBefore:"",
      staffAfter: "",
      companyBefore:"",
      companyAfter:"",
      bearHeight:"",
      bearLow:"",
    })
    wx.showLoading({
      title: '加载中...',
      mask: true
    })
    this.setData({
      city: this.app.globalData.city,
      staffBefore: this.data.list['staffNormalCost'],
      staffAfter: this.data.list['staffSelectedCost'],
      companyBefore: this.data.list['companyNormalCost'],
      companyAfter: this.data.list['companySelectedCost'],
      bearHeight: this.data.list['companyNormalCost'],
      bearLow: this.data.list['companyOptimizeCost'],
    })
    if (this.data.type =='52150'){
      this.initChart('#staff-chart-bar', this.staffChartOption());
      this.initChart("#company-chart-bar", this.companyChartOption());
    }
    this.getStaffDetial();
    setTimeout(() => {
      wx.hideLoading();
    }, 0); 
  },
  initChart(el, option) {//初始化 selectComponent获取自定义子组件
    this.selectComponent(el).init((canvas, width, height) => {
      const chart = echarts.init(canvas, null, {
        width: width,
        height: height
      });
      chart.setOption(option)
      return chart;
    })
  },
  staffChartOption: function () {//员工实际所得
    return {
      title: {show:false},
      xAxis: { show: false, data: ["调整前前", "调整后前"]},
      yAxis: { show: false},
      series: [
        {
          name:"",
          type: 'bar',
          data: [this.data.staffBefore, this.data.staffAfter],
          itemStyle:{
            normal:{
              color: function (params) {   
                var colorList = ["#E5E5E5", "#FBD337"];
                return colorList[params.dataIndex]
              }
            }
          },
          barCategoryGap:"50"
        }
      ]
    };
  },
  companyChartOption: function () {//企业实际负担
    return {
      title: {show:false},
      xAxis: {
        show:false,
        data: ["调整前", "调整后"]
      },
      yAxis: { show: false,},
      series: [
        {
          name: "",
          type: 'bar',
          data: [this.data.companyBefore, this.data.companyAfter],
          itemStyle: {
            normal: {
              color: function (params) {
                var colorList = ["#E5E5E5", "#4ECB73"];
                return colorList[params.dataIndex]
              }
            }
          },
          barCategoryGap: "50"
        }
      ]
    };
  },
  getStaffDetial(){//获取员工工资信息
    let that = this;
    wx.showLoading({
      title: '加载中...',
      mask:true
    })
    const urlLoaction = `extension/SmallProgramOptimizeDetail`;
    const params = { schemeId: this.app.globalData.schemeId }
    that.app.http.get(urlLoaction, params).then(res => {
      if(res){
        that.setData({
          staffList: res.data
        })
        if (that.data.staffList.length == 1) {
          //企业成本去向(调整后)饼图
          let companyPie = [
            { name: "税前工资", value: that.data.staffList[0].selectedRadix, bg: '' },
            { name: "企业社保", value: that.data.staffList[0].companySecurity, bg: '' },
            { name: "企业公积金", value: that.data.staffList[0].companyResfund + that.data.staffList[0].companyAddResfund, bg: '' }];
          //员工工资去向(调整后)饼图
          let staffPie = [
            { name: "税后工资", value: that.data.staffList[0].selectedRadix - that.data.staffList[0].revenueAmount - that.data.staffList[0].staffSecurity - that.data.staffList[0].staffAddResfund - that.data.staffList[0].staffRefund, bg: '' },
            { name: "公积金", value: (that.data.staffList[0].staffRefund + that.data.staffList[0].staffAddResfund) * 2, bg: '' },
          ];
          // let sum = "";//总和
          that.data.staffList.forEach(item => {
            item["tbrhPertaxItems"].forEach(i => {
              if (i.isResfund != "51022") {
                companyPie.push({
                  name: i.itemName,
                  value: Number(i.amount),
                  bg: ''
                });
                staffPie.push({
                  name: i.itemName,
                  value: Number(i.amount) * i.discount,
                  bg: ''
                });
                // sum = item["tbrhPertaxItems"].reduce((prev, next) => {
                //   return prev + Number(next.amount)
                // }, 0)
              }
            })
          })
          let companyBg = ['#1890FF', '#2FC25B', '#FACC14', '#223273', '#8543E0', '#13C2C2', "#3436C7", '#56C1F7', '#9271CC', '#499AE9', '#57BACC', '#6880DD'];
          companyPie.forEach((item, index) => {
            item.bg = companyBg[index];
          })
          staffPie.forEach((item, index) => {
            item.bg = companyBg[index];
          })
          that.setData({
            len: true,
            companyPie: companyPie,//企业成本去向(调整后)饼图
            staffPie: staffPie,//员工薪资去向(调整后)饼图
            totalMoney: Number(that.data.staffList[0].staffSelectedCost),
            companyAfter: Number(that.data.staffList[0].companySelectedCost)
          })
          that.initChart("#staff-pie", that.staffPie());
          that.initChart("#company-pie", that.companyPie());

          setTimeout(() => {
            wx.hideLoading();
          }, 0); 
        }
      }
      setTimeout(() => {
        wx.hideLoading();
      }, 0); 
    })
  },
  staffPie() {//员工税前工资去向
    return {
      title: {
        text: this.data.name1 + '  ￥' + this.data.totalMoney,
        textStyle: {
          color: "#303133",
          fontWeight: "bold",
          // fontSize:30
        },
        top: 26,
        left: 20
      },
      color: ['#1890FF', '#2FC25B', '#FACC14', '#223273', '#8543E0', '#13C2C2', "#3436C7", '#56C1F7', '#9271CC', '#499AE9', '#57BACC', '#6880DD'],
      legend: { show: false },
      series: [
        {
          type: 'pie',
          radius: '55%',
          center: ['50%', '60%'],
          data: this.data.staffPie
        }
      ]
    }
  },
  companyPie() {
    return {
      title: {
        text: this.data.name2+'  ￥' + this.data.companyAfter,
        textStyle: {
          color: "#303133",
          fontWeight: "bold",
          // fontSize:30
        },
        top: 26,
        left: 20
      },
      color: ['#1890FF', '#2FC25B', '#FACC14', '#223273', '#8543E0', '#13C2C2', "#3436C7", '#56C1F7', '#9271CC', '#499AE9', '#57BACC', '#6880DD'],
      legend: { show: false },
      series: [
        {
          type: 'pie',
          radius: '55%',
          center: ['50%', '60%'],
          data: this.data.companyPie
        }
      ]
    }
  },
  changeSilder(e) {//调整比列end
    wx.showLoading({
      title: '加载中...',
      mask: true
    })
    const urlLoaction = `extension/selectionCoefficient`;
    const params = {
      id: this.app.globalData.schemeId,
      rate: e.detail.value / 100
    }
    this.app.http.post(urlLoaction, params).then(res => {
      this.setData({
        staffAfter: res.data.staffSelectedCost,
        companyAfter: res.data.companySelectedCost,
        rate: res.data.rate * 100
      })
      // this.data.list = res.data;
      if (this.data.type == '52150'){
        this.initChart('#staff-chart-bar', this.staffChartOption());
        this.initChart("#company-chart-bar", this.companyChartOption());
      }
      this.getStaffDetial();
      setTimeout(() => {
        wx.hideLoading();
      }, 0); 
    })
    
  },
  personDetail(e){//跳转下一页到个人工资详情页
    wx.showLoading({
      title: '加载中...',
      mask: true
    })
    const index = e.currentTarget.dataset["index"];  
    this.app.globalData.staffDetail = this.data.staffList[index]
    wx.navigateTo({
      url: '../personDetail/personDetail?',
    })
  },
  again(){
    // wx.showModal({
    //   title: '提示',
    //   content: '您还未保存，是否重新试算？',
    //   success(res) {
    //     if (res.confirm) {
    wx.reLaunch({
      url: '../../index/index',
    })
    //     }
    //   }
    // })
  },
  // contant() {//跳转到联系我们页面
  //   wx.navigateTo({
  //     url: '../contant/contant',
  //   })
  // },

  /**
   * 生命周期函数--监听页面隐藏
   */
  // onHide: function () {
  // },

  /**
   * 生命周期函数--监听页面卸载
   */
  // onUnload: function () {
  // },

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
  onShareAppMessage: function (res) {
    if(res.from == "button"){
      return {
        title: '优企宝算薪小程序',
        path: '/pages/salaryTrial/result/result?schemeId=' + this.app.globalData.schemeId + "&city=" + this.app.globalData.city + '&type=' + this.app.globalData.type
      }
    }else{
      return {
        title: '优企宝算薪小程序',
        path: '/pages/index/index',
        imageUrl: "../../images/share_img.jpg"
      }
    }
  }
})