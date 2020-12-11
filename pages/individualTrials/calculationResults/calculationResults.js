// pages/calculationResults/calculationResults.js
import * as echarts from '../../../components/ec-canvas/echarts';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    ec: {
      lazyLoaded: true,
      disableTouch: true,
    },
    money:0,
    yeaAmount:0,//全年开票金额
    taxRate: 0,//赋税率
    valueAddedTax:0,//增值税
    addTaxRate:0,//增值税率
    surtax:0,//附加税
    taxable: 0,//应纳税所得额
    proportion:0,//比例
    personalTax:0,//个人所得税
    speedBuckle:0,//速扣
    totalTax:0,//纳税总额
    allTaxRate:0,//全部赋税率
    addRate:0,//增值返还率
    vatRefund:0,//增值税返还
    personRate:0,//个人所得返还率
    personalReturn:0,//个人所得税返还
    totalReturn:0,//返回总额
    actualTaxPayable:0,//实际应纳税额
    actualTaxrate:0,//实际赋税率
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      money: Number(options.amount).toFixed(2)
    })
    if(this.data.money<100000){
      this.setData({
        addTaxRate: 0
      })
    }else{
      this.setData({
        addTaxRate: 0.03
      })
    }
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
    // wx.showLoading({
    //   title: '加载中...',
    //   mask: true
    // })
    let taxable = this.data.money * 0.1;//应纳税金额 = 全年开票金额 * 0.1
    if (taxable <= 30000) {
      this.setData({
        proportion: 0.05,
        speedBuckle: 0
      })
    }
    if (taxable > 30000 && taxable <= 90000) {
      this.setData({
        proportion: 0.1,
        speedBuckle: 1500
      })
    }
    if (taxable > 90000 && taxable <= 300000) {
      this.setData({
        proportion: 0.2,
        speedBuckle: 10500
      })
    }
    if (taxable > 300000 && taxable <= 500000) {
      this.setData({
        proportion: 0.3,
        speedBuckle: 40500
      })
    }
    if (taxable > 500000) {
      this.setData({
        proportion: 0.35,
        speedBuckle: 65500
      })
    }
    let addTax = this.data.money * this.data.addTaxRate;//增值税 = 全年开票金额 * 增值税率
    if (addTax <= 100000) {
      this.setData({
        addRate: 0.13
      })
    }
    if (addTax > 100000 && addTax <= 500000) {
      this.setData({
        addRate: 0.195
      })
    }
    if (addTax > 500000 && addTax <= 1000000) {
      this.setData({
        addRate:0.21125
      })
    }
    if (addTax > 1000000) {
      this.setData({
        addRate: 0.2275
      })
    }
    //应纳税所得额 taxable ；增值税 addTax
    //纳税总额 = 增值税 + 附加税 + 个人所得税 - 速扣（this.data.speedBuckle）
    //附加税 = 增值税 * 0.11 ；个人所得税 = 应纳税所得额 * 比例（this.data.proportion） 
    let personTax = addTax + addTax * 0.11 + taxable * this.data.proportion - this.data.speedBuckle;
    if (personTax == 0) {
      this.setData({
        personRate: 0
      })
    }
    if (personTax <= 100000) {
        this.setData({
          personRate:0.088
        })
      }
    if (personTax > 100000 && personTax <= 500000) {
      this.setData({
        personRate: 0.132
      })
    }
    if (personTax > 500000 && personTax <= 1000000) {
      this.setData({
        personRate: 0.143
      })
    }
    if (personTax > 1000000) {
      this.setData({
        personRate: 0.154
      })
    }
    this.setData({//应纳税所得额 taxable ；增值税 addTax ； 纳税总额 personTax
      yeaAmount: this.conversion(this.data.money),//全年开票金额
      valueAddedTax: this.conversion(addTax),//增值税 = 全年开票金额 * 增值税率
      surtax: this.conversion(addTax * 0.11),//附加税 = 增值税 * 0.11
      taxable: this.conversion(taxable),//应纳税所得额 = 全年开票金额 * 0.1
      personalTax: this.conversion(taxable * this.data.proportion),//个人所得税 = 应纳税所得额 * 比例（this.data.proportion）
      totalTax: this.conversion(personTax),//纳税总额 = 增值税 + 附加税 + 个人所得税 - 速扣（this.data.speedBuckle）
      allTaxRate: (personTax / this.data.money).toFixed(4),//全部赋税率 = 纳税总额 / 全年开票金额
      vatRefund: this.conversion(addTax * this.data.addRate),//增值税返还 = 增值税 * 比例（this.data.addRate）
      personalReturn: this.conversion((taxable * this.data.proportion - this.data.speedBuckle) * this.data.personRate),//个人所得税返还 = （个人所得税 - 速扣（this.data.speedBuckle））* 比例（this.data.personRate）
      // personalReturn: this.conversion((personTax - addTax * 1.11) * this.data.personRate),
      //personTax - addTax - addTax * 0.11 == personTax - addTax*1.11
      totalReturn: this.conversion(addTax * this.data.addRate + (personTax - addTax * 1.11) * this.data.personRate),//返还总额 = 增值税返还 + 个人所得税返还
      actualTaxPayable: this.conversion(personTax - (addTax * this.data.addRate + (personTax - addTax * 1.11) * this.data.personRate)),//实际应纳税额 = 应纳税所得额 - 返还总额
      actualTaxrate: ((personTax - (addTax * this.data.addRate + (personTax - addTax * 1.11) * this.data.personRate)) / this.data.money).toFixed(4),//实际全部赋税率 = 实际应纳税额 / 全年开票金额
      enterprise: personTax - (addTax * this.data.addRate + (personTax - addTax * 1.11) * this.data.personRate)
    })
    this.initChart('#histogram-chart', this.histogramChart());
    this.initChart("#pie-chart", this.pieChart());
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
        data: ["有限公司", "个独企业"]
      },
      grid:{
        left:'20%'
      },
      yAxis: { 
        splitLine:{show:false},
        name:'月缴税额/万元',
        nameGap:25,
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
          data: [
            (this.data.money * 0.25 + (this.data.money - this.data.money * 0.25) * 0.2).toFixed(2),
            this.data.enterprise],
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
  pieChart() {
    return {
      title: {
        text: '',
      },
      color: ['#3AA0FF', '#4ECB73', '#FBD337', '#435188'],
      legend: { show: false },
      series: [
        {
          type: 'pie',
          radius: '50%',
          center: ['50%', '60%'],
          label: {
            normal: {
              show:true,
              formatter: "{b}\n{d}%",
              fontSize: 14,
              rich:{}
            }
          },
          data: [
            { value: this.data.money * 0.03, name: '增值税' },
            { value: this.data.money * 0.03 *0.11, name: '附加税' },
            { value: this.data.money * 0.1, name: '应纳税所得额' },
            { value: this.data.money * 0.1 * this.data.proportion , name: '个人所得税' }
          ],
          
        }
      ]
    }
  },











  again() {
    wx.reLaunch({
      url: '../calculator/calculator',
    })
  },
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
    if (res.from == "button") {
      return {
        title: '优企宝算薪小程序',
        path: '/pages/individualTrials/calculationResults/calculationResults?amount=' + this.data.money+'&share=share'
      }
    } else {
      return {
        title: '优企宝算薪小程序',
        path: '/pages/index/index',
        imageUrl: "../../images/share_img.jpg"
      }
    }
  }
})