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
    isSubmitting: false,
    showBillDetail: false,
    currentBill: null
  },

  //导航栏设置
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
  //未登录
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
  /*--------------------展示添加账单的弹窗-------------------*/
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
  //选种类
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
  //添加账单完成之后处理
  async onAddBillSuccess(event) {
    wx.showToast({
      title: '添加成功',
      icon: 'success'
    });
    await this.loadBills();
  },
  //每次添加完之后，和初始化时需要调用，更新账单
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
  /*------------页面初始时需要做什么---------------*/
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
  /*------------预算处理--------------------------*/
  initializeBudget() {
    this.loadBudgetFromCloud();
  },
  //获取账单数据
  async loadBudgetFromCloud() {
    try {
      const result = await wx.cloud.callFunction({
        name: 'getBudget'
      });

      if (result.result.success) {
        this.setData({
          totalBudget: result.result.data.amount
        }, () => {
          this.calculateBudget();
        });
      }
    } catch (error) {
      console.error('获取预算失败:', error);
      wx.showToast({
        title: '获取预算失败',
        icon: 'error'
      });
    }
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
  //计算的是这月已经使用
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
      success: async (res) => {
        if (res.confirm) {
          const newBudget = Number(res.content);
          if (isNaN(newBudget) || newBudget <= 0) {
            wx.showToast({
              title: '请输入有效金额',
              icon: 'none'
            });
            return;
          }

          try {
            wx.showLoading({ title: '更新中...' });
            const result = await wx.cloud.callFunction({
              name: 'updateBudget',
              data: { amount: newBudget }
            });

            if (result.result.success) {
              this.setData({
                totalBudget: newBudget
              }, () => {
                this.calculateBudget();
                wx.showToast({
                  title: '更新成功',
                  icon: 'success'
                });
              });
            }
          } catch (error) {
            console.error('更新预算失败:', error);
            wx.showToast({
              title: '更新失败',
              icon: 'error'
            });
          } finally {
            wx.hideLoading();
          }
        }
      }
    });
  },
  /*------------------删除账单------------------ */
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
  },
  /*-------------------展示账单详情页----------------- */
  showBillDetail(event) {
    const bill = event.currentTarget.dataset.bill;
    // 格式化日期
    const date = new Date(bill.date);
    bill.dateFormatted = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
    
    this.setData({
      showBillDetail: true,
      currentBill: bill
    });
  },
  onBillDetailClose() {
    this.setData({
      showBillDetail: false,
      currentBill: null
    });
  }
});
