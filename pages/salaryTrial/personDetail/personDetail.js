// pages/personDetail/personDetail.js
import * as echarts from '../../../components/ec-canvas/echarts';
Page({
  app : getApp(),
  /**
   * 页面的初始数据
   */
  data: {
    ec: {
      lazyLoaded: true,
      disableTouch: true
    },
    detailList:[]
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
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.setData({
      type:this.app.globalData.type
    })
    //员工工资信息列表
    let arr = [];
    arr.push(this.app.globalData.staffDetail);
    //企业成本去向(调整后)饼图
    let companyPie = [
      { name: "税前工资", value: arr[0].selectedRadix ,bg:''}, 
      { name: "企业社保", value: arr[0].companySecurity, bg: ''}, 
      { name: "企业公积金", value: arr[0].companyResfund + arr[0].companyAddResfund, bg: '' }];
    //员工工资去向(调整后)饼图
    let staffPie = [
      { name: "税后工资", value: arr[0].selectedRadix - arr[0].revenueAmount - arr[0].staffSecurity - arr[0].staffAddResfund - arr[0].staffRefund , bg: '' },
      // { name: "社保", value: arr[0].staffSecurity, bg: '' },
      { name: "公积金", value: (arr[0].staffRefund + arr[0].staffAddResfund)*2, bg: '' },
      // { name: "个税", value: arr[0].revenueAmount }
      ];
    let sum = "";//总和
    arr.forEach(item => {
       item["tbrhPertaxItems"].forEach(i => {
        if (i.isResfund != "51022"){
          companyPie.push({
            name: i.itemName,
            value: Number(i.amount),
            bg:''
          });
          staffPie.push({
            name: i.itemName,
            value: Number(i.amount) * i.discount,
            bg: ''
          });
          sum = item["tbrhPertaxItems"].reduce((prev, next) => {
            return prev + Number(next.amount)
          },0)
        }
      })
    })
    let companyBg = ['#1890FF', '#2FC25B', '#FACC14', '#223273', '#8543E0', '#13C2C2', "#3436C7", '#56C1F7', '#9271CC', '#499AE9', '#57BACC', '#6880DD'];
    companyPie.forEach((item,index) => {
        item.bg = companyBg[index];
    })
    staffPie.forEach((item, index) => {
      item.bg = companyBg[index];
    })
    this.setData({
      city: this.app.globalData.city,
      detailList: arr,//员工工资信息列表
      staffBefore: this.app.globalData.staffDetail["staffNormalCost"],//员工调整前
      staffAfter: this.app.globalData.staffDetail["staffSelectedCost"],//员工调整后
      companyBefore: this.app.globalData.staffDetail["companyNormalCost"],// 企业调整前
      companyAfter: this.app.globalData.staffDetail["companySelectedCost"],//企业调整后
      money: this.app.globalData.staffDetail["selectedRadix"],//税前工资
      companyPie: companyPie,//企业成本去向(调整后)饼图
      staffPie: staffPie,//员工薪资去向(调整后)饼图
      totalMoney: Number(this.app.globalData.staffDetail["staffSelectedCost"])
    })

    wx.setNavigationBarTitle({
      title: this.data.detailList[0].name+"-试算结果"
    })
    if (this.data.type == '52150'){
      this.initChart('#staff-dom-bar', this.staffChartOption());
      this.initChart("#company-dom-bar", this.companyChartOption());
    }
    this.initChart("#staff-dom-pie", this.staffPie());
    this.initChart("#company-dom-pie", this.companyPie());
  },
  initChart(el, option) {//初始化
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
      title: { show: false },
      xAxis: { show: false, data: ["调整前前", "调整后前"] },
      yAxis: { show: false },
      series: [
        {
          name: "",
          type: 'bar',
          data: [this.data.staffBefore, this.data.staffAfter],
          itemStyle: {
            normal: {
              color: function (params) {
                var colorList = ["#E5E5E5", "#FBD337"];
                return colorList[params.dataIndex]
              }
            }
          },
          barCategoryGap: "50"
        }
      ]
    };
  },
  companyChartOption: function () {//企业实际负担
    return {
      title: { show: false },
      xAxis: {
        show: false,
        data: ["调整前", "调整后"]
      },
      yAxis: { show: false, },
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
  staffPie(){//员工税前工资去向
    return {
      title: {
        text: '员工所得(调整后)  ￥' + this.data.totalMoney,
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
    };
  },
  companyPie(){
    return {
      title: {
        text: '企业成本去向(调整后)  ￥' + this.data.companyAfter,
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
    };
  },
  contant(){//跳转到来呢西我们页面
    wx.navigateTo({
      url: '../contant/contant',
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