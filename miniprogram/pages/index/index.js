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
    bills: [],
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
    },
    incomeCategoryIconMap: {
      '工资': 'balance-pay',
      '兼职': 'point-gift-o',
      '红包': 'cash-back-record',
      '投资': 'chart-trending-o',
      '其他收入': 'apps-o'
    },
    incomeCategories: ['工资', '兼职', '红包', '投资', '其他收入'],
    expenseCategories: [],
    categoryList: [],
    currentCategoryIconMap: {},
    showAddBill: false,
    showCategoryPicker: false,
    billType: 'expense',
    amount: '',
    category: '',
    note: '',
    totalBudget: 0,
    remainingBudget: 0,
    budgetPercentage: 100,
    currentMonthBills: 0,
    budgetColor: 'rgb(66, 72, 116)',
    gradientColor: 'rgb(66, 80, 116)',
    todayExpense: 0,
    todayIncome: 0,
    isSubmitting: false
  },

  onShow() {
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      const tabBar = this.getTabBar();
      tabBar.setData({
        active: 0
      });
      tabBar.init();
    }
  },
  onFooterNavChange(event) {
    // 点击底部导航栏切换后回调
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
    wx.getUserProfile({
      desc: '展示用户信息',
      success: (res) => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    })
  },
  showBillPopup:function() {
    this.setData({
      showAddBill: true
    });
  },
  onAddBillClose() {
    this.setData({
      showAddBill: false
    });
  },
  async onAddBillSuccess(event) {
    wx.showToast({
      title: '添加成功',
      icon: 'success'
    });
    await this.loadBills();
  },
  async loadBills() {
    try {
      wx.showLoading({ title: '加载中...' });

      const today = new Date();
      const startDate = new Date(today.getFullYear(), today.getMonth(), today.getDate()).toISOString();
      const endDate = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1).toISOString();

      const result = await wx.cloud.callFunction({
        name: 'getBills',
        data: {
          startDate,
          endDate
        }
      });

      wx.hideLoading();
      if (result.result && result.result.data) {
        const todayExpense = result.result.data
          .filter(bill => bill.type === 'expense')
          .reduce((total, bill) => total + Number(bill.amount), 0);

        const todayIncome = result.result.data
          .filter(bill => bill.type === 'income')
          .reduce((total, bill) => total + Number(bill.amount), 0);

        this.setData({
          bills: result.result.data,
          todayExpense: todayExpense.toFixed(2),
          todayIncome: todayIncome.toFixed(2)
        });
      }
    } catch (error) {
      wx.hideLoading();
      console.error('加载账单失败:', error);
      wx.showToast({
        title: '加载失败',
        icon: 'error'
      });
    }
  },
  onLoad() {
    this.initializeBudget();
    this.loadBills();
    const categories = Object.keys(this.data.categoryIconMap);
    this.setData({
      categoryList: categories,
      expenseCategories: Object.keys(this.data.categoryIconMap),
      currentCategoryIconMap: this.data.categoryIconMap
    });
    this.getCurrentMonthBills();
  },
  initializeBudget() {
    const now = new Date();
    const currentMonth = now.getMonth() + 1;
    const currentYear = now.getFullYear();

    wx.getStorage({
      key: 'lastResetDate',
      success: (res) => {
        const lastReset = new Date(res.data);
        if (lastReset.getMonth() + 1 !== currentMonth || lastReset.getFullYear() !== currentYear) {
          this.resetBudget();
        } else {
          this.loadBudgetStatus();
        }
      },
      fail: () => {
        this.resetBudget();
      }
    });
  },
  resetBudget() {
    wx.getStorage({
      key: 'defaultBudget',
      success: (res) => {
        const defaultBudget = res.data || 5000; 
        this.setData({
          totalBudget: defaultBudget
        }, () => {
          this.calculateBudget();
          this.saveBudgetStatus();
        });
        wx.setStorage({
          key: 'lastResetDate',
          data: new Date().toString()
        });
      }
    });
  },
  loadBudgetStatus() {
    wx.getStorage({
      key: 'budgetStatus',
      success: (res) => {
        const { totalBudget } = res.data;
        this.setData({
          totalBudget
        }, () => {
          this.calculateBudget();
        });
      }
    });
  },
  saveBudgetStatus() {
    wx.setStorage({
      key: 'budgetStatus',
      data: {
        totalBudget: this.data.totalBudget
      }
    });
  },
  updateUsedAmount(amount) {
    const newUsedAmount = this.data.usedAmount + amount;
    this.setData({
      usedAmount: newUsedAmount
    });
    this.saveBudgetStatus();
  },
  showCategoryPicker() {
    this.setData({
      showCategoryPicker: true
    });
  },
  onCategoryClose() {
    this.setData({
      showCategoryPicker: false
    });
  },
  onCategoryConfirm(event) {
    this.setData({
      category: event.detail.value,
      showCategoryPicker: false
    });
  },
  async onSubmitBill() {
    if (this.data.isSubmitting) return;
    
    const { billType, amount, category, note } = this.data;
    
    if (!amount || !category) {
      wx.showToast({
        title: '请填写完整信息',
        icon: 'none'
      });
      return;
    }

    this.setData({ isSubmitting: true });

    try {
      await wx.cloud.callFunction({
        name: 'addBill',
        data: {
          type: billType,
          amount: Number(amount),
          category,
          note,
          date: new Date()
        }
      });

      this.setData({
        showAddBill: false,
        amount: '',
        category: '',
        note: ''
      });

      await this.loadBills();
      if (billType === 'expense') {
        await this.getCurrentMonthBills();
      }

      wx.showToast({
        title: '添加成功',
        icon: 'success'
      });

    } catch (error) {
      console.error('添加账单失败:', error);
      wx.showToast({
        title: '添加失败',
        icon: 'error'
      });
    } finally {
      this.setData({ isSubmitting: false });
    }
  },
  onBillTypeChange(event) {
    const billType = event.detail;
    this.setData({
      billType,
      categoryList: billType === 'expense' ? this.data.expenseCategories : this.data.incomeCategories,
      currentCategoryIconMap: billType === 'expense' ? this.data.categoryIconMap : this.data.incomeCategoryIconMap,
      category: ''
    });
  },
  calculateBudgetColor(percentage) {
    const usedPercentage = 100 - percentage;
    if (usedPercentage >= 80) {
      return 'rgb(255, 77, 79)';
    } else if (usedPercentage >= 60) {
      return 'rgb(250, 173, 20)';
    } else {
      return 'rgb(66, 72, 116)';
    }
  },
  calculateBudget() {
    const { totalBudget, currentMonthBills } = this.data;

    const totalBudgetNum = Number(totalBudget);
    const currentMonthBillsNum = Number(currentMonthBills);

    const remainingBudget = totalBudgetNum - currentMonthBillsNum;
    const budgetPercentage = Math.max(0, Math.min(100, (remainingBudget / totalBudgetNum) * 100));

    console.log('预算百分比:', budgetPercentage);

    let budgetColor;
    if (budgetPercentage <= 20) {
      budgetColor = 'rgb(255, 77, 79)';
    } else if (budgetPercentage <= 40) {
      budgetColor = 'rgb(255, 169, 64)';
    } else if (budgetPercentage <= 60) {
      budgetColor = 'rgb(255, 214, 102)';
    } else {
      budgetColor = 'rgb(66, 72, 116)';
    }

    console.log('设置的颜色:', budgetColor);

    // 先清空组件
    this.setData({
      budgetPercentage: null,
      gradientColor: null
    }, () => {
      // 然后重新设置数据
      this.setData({
        remainingBudget: remainingBudget.toFixed(2),
        budgetPercentage: budgetPercentage.toFixed(1),
        gradientColor: budgetColor
      });
    });
  },
  async getCurrentMonthBills() {
    try {
      const now = new Date();
      const startDate = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
      const endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59).toISOString();

      const result = await wx.cloud.callFunction({
        name: 'getBills',
        data: {
          startDate,
          endDate
        }
      });

      if (result.result && result.result.data) {
        const currentMonthBills = result.result.data
          .filter(bill => bill.type === 'expense')
          .reduce((sum, bill) => sum + Number(bill.amount), 0);

        this.setData({ 
          currentMonthBills: currentMonthBills.toFixed(2)
        }, () => {
          this.calculateBudget();
        });
      }
    } catch (error) {
      console.error('获取账单失败:', error);
      wx.showToast({
        title: '获取账单失败',
        icon: 'error'
      });
    }
  },
  handleBudgetTap() {
    wx.showModal({
      title: '修改预算',
      editable: true,
      placeholderText: '请输入预算金额',
      content: String(this.data.totalBudget),
      success: (res) => {
        if (res.confirm) {
          const newBudget = Number(res.content);
          if (isNaN(newBudget) || newBudget <= 0) {
            wx.showToast({
              title: '请输入有效金额',
              icon: 'none'
            });
            return;
          }
          this.setData({
            totalBudget: newBudget
          }, () => {
            this.getCurrentMonthBills();
            this.calculateBudget();
            this.saveBudgetStatus();
          });
        }
      }
    });
  },
  async onDeleteBill(event) {
    const { id } = event.currentTarget.dataset;

    try {
      const res = await wx.showModal({
        title: '确认删除',
        content: '是否确定删除这条记录？',
        confirmColor: '#424874'
      });

      if (res.confirm) {
        wx.showLoading({ title: '删除中...' });

        await wx.cloud.callFunction({
          name: 'deleteBill',
          data: { id }
        });

        wx.hideLoading();
        wx.showToast({
          title: '删除成功',
          icon: 'success'
        });

        await this.loadBills();
        await this.getCurrentMonthBills();
      }
    } catch (error) {
      wx.hideLoading();
      console.error('删除账单失败:', error);
      wx.showToast({
        title: '删除失败',
        icon: 'error'
      });
    }
  }
});
