Component({
  properties: {
      navList: {
          type: Array,
          value: [{
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
              }
              ]
          }
  },
  data: {
      active: 0
  },

  lifetimes: {
    attached() {
      this.init()
    }
  },

  pageLifetimes: {
    show() {
      this.init()
    }
  },

  methods: {
    init() {
      const pages = getCurrentPages()
      if (pages.length === 0) return
      
      const page = pages[pages.length - 1]
      if (!page || !page.route) return
      
      const active = this.data.navList.findIndex(item => item.url === `/${page.route}`)
      if (active !== -1) {
        this.setData({ active })
      }
    },

    onChange(event) {
      const index = event.detail;
      const tabItem = this.data.navList[index];
      
      if (!tabItem) return;
      
      this.setData({ active: index });
      
      // 获取当前页面路径
      const pages = getCurrentPages();
      const currentPage = pages[pages.length - 1];
      const currentPath = `/${currentPage.route}`;
      
      // 如果点击的是当前页面，不进行跳转
      if (currentPath === tabItem.url) {
        return;
      }
      
      // 判断是否是 tabBar 页面
      const isTabBarPage = tabItem.url.startsWith('/pages/') && 
                          (tabItem.url.includes('/index/') || 
                          tabItem.url.includes('/charts/') || 
                          tabItem.url.includes('/social/') || 
                          tabItem.url.includes('/profile/'));
      
      if (isTabBarPage) {
        wx.switchTab({
          url: tabItem.url,
          fail: (error) => {
            console.error('导航失败：', error);
          }
        });
      } else {
        wx.navigateTo({
          url: tabItem.url,
          fail: (error) => {
            console.error('页面跳转失败：', error);
          }
        });
      }
      
      // 触发自定义事件
      this.triggerEvent('onFooterNavChange', { detail: event.detail });
    }
  }
});