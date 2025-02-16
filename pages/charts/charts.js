Page({
  data: {
    currentTab: 'monthly',
    tabs: [
      { id: 'monthly', name: '月度' },
      { id: 'category', name: '分类' },
      { id: 'trend', name: '趋势' }
    ],
    categories: [
      { name: '餐饮', amount: '1200.00', color: '#FF6B6B' },
      { name: '交通', amount: '800.00', color: '#4A90E2' },
      { name: '购物', amount: '1500.00', color: '#4CAF50' },
      { name: '娱乐', amount: '500.00', color: '#FFC107' }
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

  switchTab(e) {
    const tabId = e.currentTarget.dataset.id;
    this.setData({ currentTab: tabId });
    this.loadChartData(tabId);
  },

  loadChartData(tabId) {
    // 根据不同的tab加载对应的图表数据
    switch(tabId) {
      case 'monthly':
        this.loadMonthlyData();
        break;
      case 'category':
        this.loadCategoryData();
        break;
      case 'trend':
        this.loadTrendData();
        break;
    }
  },

  loadMonthlyData() {
    // 加载月度数据
  },

  loadCategoryData() {
    // 加载分类数据
  },

  loadTrendData() {
    // 加载趋势数据
  },

  onLoad() {
    // 初始化加载月度数据
    this.loadMonthlyData();
  },

  onShow() {
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      // 获取底部导航实例并初始化
      const tabBar = this.getTabBar();
      tabBar.setData({
        active: 1
      });
      tabBar.init();
    }
  },
  
  onFooterNavChange(event) {
     // 点击底部导航栏切换后回调
     // console.log('点击底部导航栏', event.detail.detail);
  },


}) 