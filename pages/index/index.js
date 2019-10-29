//index.js
//获取应用实例
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    couponList: [],
    pageIndex: 1,
    isLoading: true,
    loadOver: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
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
    if (wx.getStorageSync('isDetailBack')) {
      wx.removeStorageSync('isDetailBack')
      return
    }
    this.setData({
      couponList: [],
      pageIndex: 1,
      isLoading: true,
      loadOver: false,
      inputContent: wx.getStorageSync('inputContent')
    })
    this.getMoreCouponList()
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
    this.setData({
      couponList: [],
      isLoading: true,
      loadOver: false,
      pageIndex: 1
    })
    // wx.stopPullDownRefresh()
    this.getMoreCouponList()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this.setData({
      isLoading: true,
      loadOver: false,
      pageIndex: this.data.pageIndex + 1
    })
    this.getMoreCouponList()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage:function(){
    return {
      title: '福财岭',
      desc: '自购省钱，分享赚钱',
      path: '/page/index'
    }
  },

  /**
   * 点击拷贝
   */
  copyText: function (e) {
    console.log(e)
    wx.setClipboardData({
      data: e.currentTarget.dataset.text,
      success: function (res) {
        wx.getClipboardData({
          success: function (res) {
            wx.showToast({
              title: '复制成功'
            })
          }
        })
      }
    })
  },

  /**
   * 获取服务器数据
   */
  getMoreCouponList: function () {
    var that = this;
    wx.request({
      url: "https://www.teachjs.com/fucailing/search/all",
      data: {
        "q":"羽绒服",
        "pageNo": that.data.pageIndex,
        "pageSize":6
      },
      method: "POST",
      success: function (resRequest) {
        if (resRequest.data.code == "0") {
          if (resRequest.data != null) {
            resRequest.data.data.forEach(function (coupon) {
              coupon.quanhoujia = parseInt(coupon.zkFinalPrice - coupon.couponAmount);
            })
            that.setData({
              couponList: resRequest.data.data,
              isLoading: false
            })
          }
          else {
            that.setData({
              isLoading: true,
              loadOver: true
            })
          }
        }
      }
    })
  }

})
