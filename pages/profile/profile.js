Page({
  data: {
    userInfo: {
      avatarUrl: '/images/default-avatar.png',
      nickName: '未登录',
      streakDays: 0,
      totalBills: 0,
      monthlyBills: 0,
      unlockedAchievements: 0
    },
    achievements: [
      {
        id: 1,
        name: '记账新手',
        icon: '/images/achievements/newbie.png',
        unlocked: true
      },
      {
        id: 2,
        name: '坚持达人',
        icon: '/images/achievements/streak.png',
        unlocked: true
      },
      {
        id: 3,
        name: '理财高手',
        icon: '/images/achievements/master.png',
        unlocked: false
      },
      {
        id: 4,
        name: '节约能手',
        icon: '/images/achievements/saver.png',
        unlocked: false
      }
    ],
    pet: {
      name: '小财神',
      image: '/images/pet/normal.png',
      moodStars: 4,
      message: '主人今天也要记得记账哦！'
    },
    functionList: [
      {
        id: 1,
        name: '导出账单',
        icon: '/images/functions/export.png',
        url: '/pages/export/export'
      },
      {
        id: 2,
        name: '预算设置',
        icon: '/images/functions/budget.png',
        url: '/pages/budget/budget'
      },
      {
        id: 3,
        name: '消息通知',
        icon: '/images/functions/notification.png',
        url: '/pages/notification/notification'
      },
      {
        id: 4,
        name: '帮助中心',
        icon: '/images/functions/help.png',
        url: '/pages/help/help'
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
      url: '/pages/statistics/statistics'
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
  },

  onShow() {
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      // 获取底部导航实例并初始化
      const tabBar = this.getTabBar();
      tabBar.setData({
        active: 4
      });
      tabBar.init();
    }
  },
  
  onFooterNavChange(event) {
     // 点击底部导航栏切换后回调
     // console.log('点击底部导航栏', event.detail.detail);
  },

  onLoad() {
    this.getUserInfo();
    this.checkAchievements();
    this.updatePetStatus();
  },

  getUserInfo() {
    // 获取用户信息
    const userInfo = wx.getStorageSync('userInfo');
    if (userInfo) {
      this.setData({
        userInfo: {
          ...this.data.userInfo,
          ...userInfo
        }
      });
    }
  },

  checkAchievements() {
    // 检查并更新成就状态
    const unlockedCount = this.data.achievements.filter(item => item.unlocked).length;
    this.setData({
      'userInfo.unlockedAchievements': unlockedCount
    });
  },

  updatePetStatus() {
    // 根据记账情况更新宠物状态
    const lastBillDate = wx.getStorageSync('lastBillDate');
    const today = new Date().toDateString();
    
    if (lastBillDate === today) {
      this.setData({
        'pet.message': '今天已经记账啦，真棒！',
        'pet.image': '/images/pet/happy.png'
      });
    }
  },

  navigateToFunction(e) {
    const { url } = e.currentTarget.dataset;
    wx.navigateTo({ url });
  }
}); 