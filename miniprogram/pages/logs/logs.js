Page({
  data: {
    isLoading: false
  },

  onLoad() {
    this.checkLoginStatus()
  },

  async checkLoginStatus() {
    try {
      const { result } = await wx.cloud.callFunction({
        name: 'checkLogin'
      })

      if (result.isRegistered) {
        // 已注册用户，保存用户信息到本地
        wx.setStorageSync('userInfo', result.userInfo)
        // 跳转到首页
        wx.reLaunch({
          url: '/pages/index/index'
        })
      }
    } catch (error) {
      console.error('检查登录状态失败:', error)
    }
  },

  async handleGetUserProfile() {
    this.setData({ isLoading: true })
    
    try {
      // 获取用户信息
      const { userInfo } = await wx.getUserProfile({
        desc: '用于完善用户资料'
      })

      // 调用注册云函数
      const { result } = await wx.cloud.callFunction({
        name: 'register',
        data: {
          userInfo: userInfo
        }
      })

      if (result.error) {
        throw new Error(result.error)
      }

      // 保存用户信息到本地
      wx.setStorageSync('userInfo', result.userInfo)

      // 登录成功动画
      wx.showToast({
        title: '登录成功',
        icon: 'success',
        duration: 1500
      })

      // 延迟跳转，让用户看到成功提示
      setTimeout(() => {
        wx.reLaunch({
          url: '/pages/index/index'
        })
      }, 1500)

    } catch (error) {
      console.error('登录失败:', error)
      wx.showToast({
        title: '登录失败，请重试',
        icon: 'none'
      })
    } finally {
      this.setData({ isLoading: false })
    }
  },

  handleGuestLogin() {
    wx.showModal({
      title: '游客模式',
      content: '游客模式下部分功能将受限，建议使用微信登录获得完整体验',
      confirmText: '继续',
      cancelText: '返回',
      success: (res) => {
        if (res.confirm) {
          wx.reLaunch({
            url: '/pages/index/index'
          })
        }
      }
    })
  },

  showPrivacyPolicy() {
    wx.navigateTo({
      url: '/pages/privacy/privacy'
    })
  }
}) 