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
    activeTab: 'monthly',
    isTabSwitching: false,
  },

  switchTab(e) {
    // 阻止事件冒泡
    e.stopPropagation();
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

  onTabChange(e) {
    // 阻止事件冒泡
    e.stopPropagation();
    const tabId = e.detail.name;
    this.setData({ 
      currentTab: tabId,
      // 确保切换时重置一些状态
      isTabSwitching: true
    });
    this.loadChartData(tabId);

    // 添加一个短暂的锁定期
    setTimeout(() => {
      this.setData({
        isTabSwitching: false
      });
    }, 300);
  },

  onShow() {
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      const tabBar = this.getTabBar();
      tabBar.setData({
        active: 1  // 确保报表标签保持激活状态
      });
      tabBar.init();
    }
    
    // 如果是从其他页面返回，重新加载当前数据
    if (this.data.currentTab) {
      this.loadChartData(this.data.currentTab);
    }
  },
  
  onFooterNavChange(event) {
    // 如果正在切换标签页，则阻止导航
    if (this.data.isTabSwitching) {
      return;
    }
    // ... 其他导航逻辑 ...
  },

  handleExpenseTypeChange: function(e) {
    // 阻止事件冒泡
    e.stopPropagation();
    const type = e.currentTarget.dataset.type;
    // 使用节流，避免频繁切换导致的重影
    if (this.switchTimer) {
      clearTimeout(this.switchTimer);
    }
    
    this.switchTimer = setTimeout(() => {
      this.setData({
        currentExpenseType: type
      }, () => {
        // 根据当前activeTab重新加载对应数据
        if (this.data.activeTab === 'monthly') {
          this.getMonthlyData();
        } else {
          this.getYearlyData();
        }
      });
    }, 100);
  }
}) 