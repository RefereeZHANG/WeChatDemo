Page({
  data: {
    showSharePanel: false,
    currentBill: null,
    groupBooks: [
      {
        id: 1,
        name: '家庭账本',
        status: 'pending',
        statusText: '待结算',
        pendingAmount: '200.00',
        members: [
          { id: 1},
          { id: 2},
          { id: 3}
        ]
      },
      {
        id: 2,
        name: '旅行账本',
        status: 'settled',
        statusText: '已结清',
        pendingAmount: '0.00',
        members: [
          { id: 1},
          { id: 4}
        ]
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
        active: 3
      });
      tabBar.init();
    }
  },
  
  onFooterNavChange(event) {
     // 点击底部导航栏切换后回调
     // console.log('点击底部导航栏', event.detail.detail);
  },

  createNewBook() {
    wx.navigateTo({
      url: '/pages/createBook/createBook'
    });
  },

  showSharePanel(e) {
    const { billId } = e.currentTarget.dataset;
    // 获取账单详情
    const billDetail = {
      id: billId,
      posterUrl: '/images/share-poster.png'
    };
    
    this.setData({
      showSharePanel: true,
      currentBill: billDetail
    });
  },

  closeSharePanel() {
    this.setData({
      showSharePanel: false,
      currentBill: null
    });
  },

  saveImage() {
    wx.saveImageToPhotosAlbum({
      filePath: this.data.currentBill.posterUrl,
      success: () => {
        wx.showToast({
          title: '保存成功',
          icon: 'success'
        });
      },
      fail: () => {
        wx.showToast({
          title: '保存失败',
          icon: 'error'
        });
      }
    });
  },

  onShareAppMessage() {
    return {
      title: '来看看这笔账单吧',
      path: '/pages/billDetail/billDetail?id=' + this.data.currentBill.id,
      imageUrl: this.data.currentBill.posterUrl
    };
  }
}); 