// app.js
App({
  onLaunch: function () {
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        env: 'recordmoney-1g885c472a08bffa', // 替换为你的云开发环境ID
        traceUser: true,
      })
    }

    // 展示本地存储能力
    const logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    })

    this.checkLogin()
  },

  async checkLogin() {
    try {
      const userInfo = wx.getStorageSync('userInfo')
      
      if (!userInfo) {
        // 未登录，跳转到登录页
        wx.reLaunch({
          url: '/pages/logs/logs'
        })
        return
      }

      // 验证登录状态
      const { result } = await wx.cloud.callFunction({
        name: 'checkLogin'
      })

      if (!result.isRegistered) {
        // 登录状态失效，跳转到登录页
        wx.removeStorageSync('userInfo')
        wx.reLaunch({
          url: '/pages/logs/logs'
        })
      }
    } catch (error) {
      console.error('检查登录状态失败:', error)
    }
  },

  globalData: {
    userInfo: null
  }
})
