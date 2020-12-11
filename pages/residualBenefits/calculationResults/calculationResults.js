// pages/calculationResults/calculationResults.js
import * as echarts from '../../../components/ec-canvas/echarts';
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
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let obj = JSON.parse(options.obj);
    this.setData({
      cityName:obj.cityName,
      cityId: obj.cityId,
      totalPeople: obj.totalPeople,
      amount: obj.amount,
      disabledNum: obj.disabledNum,
      baseNum: obj.baseNum
    })
    if(options.share){
      wx.removeStorageSync('sessionId');
      // 登录
      wx.login({
        success: res => {
          // 发送 res.code 到后台换取 openId, sessionKey, unionId
          const urlLoaction = `extension/landOpenId`;
          const params = { code: res.code }
          that.app.http.get(urlLoaction, params).then(res => {
            wx.setStorageSync("sessionId", "JSESSIONID=" + res.data)//sessionId存储到本地
            that.app.globalData.schemeId = options.schemeId;
            that.app.globalData.city = options.city;
            that.getList();
          })
        }
      })
    } 
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
    this.getInfo();
  },
  getInfo(){
    const urlLoaction = `disability/calculation`;
    const params = {
      staffAllCount:this.data.totalPeople,
      avgSocialSecurity:this.data.amount,
      disableStaff:this.data.disabledNum,
      cityId:this.data.cityId
    }
    this.app.http.post(urlLoaction,params).then(res => {
      if (res.resCode == '0000') {
        this.setData({
          rate:res.objectRs.rate,//比例
          allReduce: res.objectRs.allReduce,//减免金额
          optimizedBefore: res.objectRs.residualBenefitsPayAmount,//优化前
          optimizedAfter: res.objectRs.optimizedResidualBenefitsPayAmount,//优化后
          basicWage: res.objectRs.basicWage,//最低基本工资
          firstMonth: res.objectRs.firstMonth,//年度需雇佣残疾人 
          secondMonth: res.objectRs.secondMonth,
          costAmount: res.objectRs.costAmount,
          fiveInsurance: res.objectRs.fiveInsuranceAmount,
          half: Number(res.objectRs.firstMonth)/2
        })
        this.initChart('#histogram-chart', this.histogramChart());
      }
      wx.hideLoading();
    }) 
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
  histogramChart() {
    return {
      title: { 
        text:'',
      },
      xAxis: {
        data: ["优化前", "优化后"]
      },
      grid:{
        left:'20%'
      },
      yAxis: { 
        splitLine:{show:false},
        name:'残保金金额/万元',
        nameGap: 25,
        algin:'left',
        top:'20',
        nameTextStyle: { color:'#909399',fontSize:14},
        axisLabel: {
          formatter: function (v) {
            return Number(v)/10000;
          }
        }
      },
      series: [
        {
          name: "有限公司",
          type: 'bar',
          data: [this.data.optimizedBefore, this.data.optimizedAfter],
          itemStyle: {
            normal: {
              label:{
                show: true, //开启显示
                position: 'top', //在上方显示
                textStyle: { //数值样式
                  color: '#303133',
                  fontSize: 12,
                },
                rich: {},
                formatter: function (v) {
                  return (Number(v.value) / 10000).toFixed(2) + 'w';
                }
              },
              color: function (params) {
                var colorList = ["#3AA0FF", "#4ECB73"];
                return colorList[params.dataIndex]
              }
            }
          },
          barWidth: "20"
        }
      ]
    };
  },











  // again() {
  //   wx.reLaunch({
  //     url: '../selectCity/selectCity',
  //   })
  // },
  conversion(money){//转换金额格式
    // if(money && money != null){
      money = String(money);
      var left = money.split('.')[0], right = money.split('.')[1];
      right = right ? (right.length >= 2 ? '.' + right.substr(0, 2) : '.' + right + '0') : '.00';
      var temp = left.split('').reverse().join('').match(/(\d{1,3})/g);
      return (Number(money) < 0 ? "-" : "") + temp.join(',').split('').reverse().join('') + right;
    // }else if (money === 0) {   //注意===在这里的使用，如果传入的money为0,if中会将其判定为boolean类型，故而要另外做===判断
    //   return '0.00';
    // } else {
    //   return "";
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
  onShareAppMessage: function (res) {
    // if (res.from == "button") {
    //   return {
    //     title: '优企宝算薪小程序',
    //     path: '/pages/residualBenefits/calculationResults/calculationResults?share=share'
    //   }
    // } else {
      return {
        title: '优企宝算薪小程序',
        path: '/pages/index/index',
        imageUrl: "../../../images/share_img.jpg"
      }
    }
  // }
})