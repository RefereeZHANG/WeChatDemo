// index.js
const defaultAvatarUrl = 'https://mmbiz.qpic.cn/mmbiz/icTdbqWNOwNRna42FI242Lcia07jQodd2FJGIYQfG0LAJGFxM4FbnQP6yfMxBgJ0F3YRqJCJ1aPAK2dQagdusBZg/0'

Page({
  data: {
    motto: 'Hello World',
    userInfo: {
      avatarUrl: defaultAvatarUrl,
      nickName: '',
    },
    hasUserInfo: false,
    canIUseGetUserProfile: wx.canIUse('getUserProfile'),
    canIUseNicknameComp: wx.canIUse('input.type.nickname'),
    bills: [
      {
        id: 1,
        category: '餐饮',
        amount: '38.00',
        note: '午餐',
        type: 'expense',
      },
      {
        id: 2,
        category: '交通',
        amount: '90.00',
        note: '打车',
        type: 'expense'
      }
    ],
    footerNavList: [{
      icon: 'home-o',
      text: '首页',
      url: '/pages/index/index'
    },
    {
      icon: 'chart-trending-o',
      text: '报表',
      url: '/pages/charts/charts'
    },
    {
      icon: 'friends-o',
      text: '社交',
      url: '/pages/social/social'
    },
    {
      icon: 'user-o',
      text: '我的',
      url: '/pages/profile/profile'
    }],
    categoryIconMap: {
      '餐饮': 'fire-o',
      '交通': 'logistics',
      '购物': 'cart-o',
      '娱乐': 'smile-o',
      '居住': 'home-o',
      '通讯': 'phone-o',
      '服饰': 'gift-o',
      '医疗': 'plus',
      '教育': 'bookmark-o',
      '其他': 'apps-o'
    }
  },

  onShow() {
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      // 获取底部导航实例并初始化
      const tabBar = this.getTabBar();
      tabBar.setData({
        active: 0  // 设置首页的索引为0
      });
      tabBar.init();
    }
  },
  onFooterNavChange(event) {
     // 点击底部导航栏切换后回调
     // console.log('点击底部导航栏', event.detail.detail);
  },
  bindViewTap() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onChooseAvatar(e) {
    const { avatarUrl } = e.detail
    const { nickName } = this.data.userInfo
    this.setData({
      "userInfo.avatarUrl": avatarUrl,
      hasUserInfo: nickName && avatarUrl && avatarUrl !== defaultAvatarUrl,
    })
  },
  onInputChange(e) {
    const nickName = e.detail.value
    const { avatarUrl } = this.data.userInfo
    this.setData({
      "userInfo.nickName": nickName,
      hasUserInfo: nickName && avatarUrl && avatarUrl !== defaultAvatarUrl,
    })
  },
  getUserProfile(e) {
    // 推荐使用wx.getUserProfile获取用户信息，开发者每次通过该接口获取用户个人信息均需用户确认，开发者妥善保管用户快速填写的头像昵称，避免重复弹窗
    wx.getUserProfile({
      desc: '展示用户信息', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
      success: (res) => {
        console.log(res)
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    })
  },
  showAddBillPanel() {
    // 显示记账面板
    wx.showModal({
      title: '添加记账',
      content: '记账面板开发中...',
      showCancel: false
    })
  },
  onLoad() {
    // 页面加载时的初始化逻辑
    // 测试 getCategoryIcon 函数
    // console.log('测试 getCategoryIcon 函数');
    // const testIcon = this.getCategoryIcon('餐饮');
    // console.log('测试结果:', testIcon);
    // 测试 bills 数据和图标映射
    // console.log('当前账单数据:', this.data.bills);
    // this.data.bills.forEach(bill => {
    //   console.log(`账单类别: ${bill.category}, 对应图标: ${this.getCategoryIcon(bill.category)}`);
    // });
  },
})
