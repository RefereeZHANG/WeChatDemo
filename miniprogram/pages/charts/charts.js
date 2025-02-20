import * as echarts from '../../components/ec-canvas/echarts';
Page({
  data: {
    currentTab: 'monthly',
    tabs: [
      { id: 'monthly', name: '月度' },
      { id: 'category', name: '分类' },
      { id: 'trend', name: '趋势' }
    ],
    categories: [],
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
    budget: {
      total: 0,
      used: 0,
      percentage: 0
    },
    monthlyStats: {
      monthOverMonth: 0,
      dailyAverageExpense: 0,
      dailyAverageIncome: 0,
      totalIncome: 0,
      totalExpense: 0,
      balance: 0
    },
    pieEc: null,  // 修改为 null
    ec: {
      lazyLoad: false,
      option: {
        backgroundColor: '#ffffff',
        tooltip: {
          trigger: 'item',
          formatter: function(params) {
            return `${params.name}\n¥${params.value} (${params.percent}%)`
          },
          backgroundColor: 'rgba(255,255,255,0.95)',
          borderColor: '#eee',
          borderWidth: 1,
          padding: [10, 15],
          textStyle: {
            fontSize: 13,
            color: '#424874'
          }
        },
        legend: {
          orient: 'vertical',
          right: '5%',
          top: 'center',
          itemWidth: 8,
          itemHeight: 8,
          itemGap: 10,
          textStyle: {
            fontSize: 11,
            color: '#424874',
            padding: [0, 0, 0, 4]
          },
          formatter: function(name) {
            return name.length > 4 ? name.slice(0, 4) + '...' : name;
          }
        },
        series: [{
          name: '支出分类',
          type: 'pie',
          radius: ['40%', '65%'],
          center: ['38%', '50%'],
          avoidLabelOverlap: true,
          itemStyle: {
            borderRadius: 6,
            borderColor: '#fff',
            borderWidth: 2
          },
          label: {
            show: true,
            position: 'outside',
            formatter: function(params) {
              return params.percent > 8 ?
                `${params.name}\n${params.percent}%` : '';
            },
            fontSize: 10,
            lineHeight: 14,
            edgeDistance: '5%'
          },
          labelLine: {
            show: true,
            length: 10,
            length2: 10,
            maxSurfaceAngle: 80,
            lineStyle: {
              color: '#A6B1E1'
            }
          },
          data: [],
          emphasis: {
            scale: true,
            scaleSize: 12,
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.2)'
            },
            labelLine: {
              lineStyle: {
                color: '#424874'
              }
            }
          }
        }]
      }
    },
    trendEc: {
      lazyLoad: false,
      option: {
        backgroundColor: '#ffffff',
        tooltip: {
          trigger: 'axis',
          backgroundColor: 'rgba(255,255,255,0.95)',
          borderColor: '#eee',
          borderWidth: 1,
          padding: [10, 15],
          textStyle: {
            color: '#424874',
            fontSize: 12
          },
          formatter: function(params) {
            let result = params[0].axisValue + '\n';
            params.forEach(item => {
              result += `${item.seriesName}: ¥${item.value}\n`;
            });
            return result;
          }
        },
        legend: {
          data: ['收入', '支出'],
          bottom: '0',
          itemWidth: 10,
          itemHeight: 10,
          textStyle: {
            color: '#424874',
            fontSize: 12
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          top: '30rpx',
          bottom: '60rpx',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: [],
          axisLine: {
            lineStyle: {
              color: '#DCD6F7'
            }
          },
          axisLabel: {
            color: '#424874',
            fontSize: 10
          }
        },
        yAxis: {
          type: 'value',
          axisLine: {
            show: false
          },
          axisTick: {
            show: false
          },
          splitLine: {
            lineStyle: {
              color: '#DCD6F7',
              type: 'dashed'
            }
          },
          axisLabel: {
            color: '#424874',
            fontSize: 10,
            formatter: function(value) {
              return '¥' + value;
            }
          }
        },
        series: [
          {
            name: '收入',
            type: 'line',
            smooth: true,
            symbol: 'circle',
            symbolSize: 6,
            itemStyle: {
              color: '#4CAF50'
            },
            lineStyle: {
              width: 2
            },
            areaStyle: {
              color: {
                type: 'linear',
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [{
                  offset: 0,
                  color: 'rgba(76,175,80,0.2)'
                }, {
                  offset: 1,
                  color: 'rgba(76,175,80,0.01)'
                }]
              }
            },
            data: []
          },
          {
            name: '支出',
            type: 'line',
            smooth: true,
            symbol: 'circle',
            symbolSize: 6,
            itemStyle: {
              color: '#FF6B6B'
            },
            lineStyle: {
              width: 2
            },
            areaStyle: {
              color: {
                type: 'linear',
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [{
                  offset: 0,
                  color: 'rgba(255,107,107,0.2)'
                }, {
                  offset: 1,
                  color: 'rgba(255,107,107,0.01)'
                }]
              }
            },
            data: []
          }
        ]
      }
    }
  },

  loadChartData(tabId) {
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
      default:
        console.log('未知的tabId:', tabId);
    }
  },

  async loadMonthlyData() {
    try {
      wx.showLoading({ title: '加载中' });
      
      // 获取当月预算
      const budgetRes = await wx.cloud.callFunction({
        name: 'getBudget'
      });
      
      // 获取当月账单
      const now = new Date();
      const startDate = new Date(now.getFullYear(), now.getMonth(), 1);
      const endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0);
      
      const billsRes = await wx.cloud.callFunction({
        name: 'getBills',
        data: {
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString()
        }
      });

      // 分别计算收入和支出
      const totalIncome = billsRes.result.data
        .filter(bill => bill.type === 'income')
        .reduce((sum, bill) => sum + bill.amount, 0);
        
      const totalExpense = billsRes.result.data
        .filter(bill => bill.type === 'expense')
        .reduce((sum, bill) => sum + bill.amount, 0);

      const balance = totalIncome - totalExpense;
      
      // 计算预算使用情况（只考虑支出）
      const totalBudget = budgetRes.result.data.amount;
      const percentage = Math.min(Math.round((totalExpense / totalBudget) * 100), 100);

      // 计算日均支出和收入
      const daysInMonth = endDate.getDate();
      const dailyAverageExpense = totalExpense / daysInMonth;
      const dailyAverageIncome = totalIncome / daysInMonth;

      // 计算环比变化（支出）
      const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0);
      
      const lastMonthBills = await wx.cloud.callFunction({
        name: 'getBills',
        data: {
          startDate: lastMonthStart.toISOString(),
          endDate: lastMonthEnd.toISOString()
        }
      });

      const lastMonthExpense = lastMonthBills.result.data
        .filter(bill => bill.type === 'expense')
        .reduce((sum, bill) => sum + bill.amount, 0);
        
      const monthOverMonth = lastMonthExpense ? 
        ((totalExpense - lastMonthExpense) / lastMonthExpense * 100).toFixed(1) : 0;

      this.setData({
        budget: {
          total: totalBudget.toFixed(2),
          used: totalExpense.toFixed(2),
          percentage
        },
        monthlyStats: {
          monthOverMonth,
          dailyAverageExpense: dailyAverageExpense.toFixed(2),
          dailyAverageIncome: dailyAverageIncome.toFixed(2),
          totalIncome: totalIncome.toFixed(2),
          totalExpense: totalExpense.toFixed(2),
          balance: balance.toFixed(2)
        }
      });

    } catch (error) {
      console.error('加载月度数据失败：', error);
      wx.showToast({
        title: '加载失败',
        icon: 'none'
      });
    } finally {
      wx.hideLoading();
    }
  },

  async loadCategoryData() {
    try {
      wx.showLoading({ title: '加载中' });
      
      // 获取当月账单
      const now = new Date();
      const startDate = new Date(now.getFullYear(), now.getMonth(), 1);
      const endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0);
      
      const billsRes = await wx.cloud.callFunction({
        name: 'getBills',
        data: {
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString()
        }
      });

      // 只处理支出类型的账单
      const expenseBills = billsRes.result.data.filter(bill => bill.type === 'expense');

      // 按分类汇总支出
      const categoryMap = new Map();
      expenseBills.forEach(bill => {
        const amount = categoryMap.get(bill.category) || 0;
        categoryMap.set(bill.category, amount + bill.amount);
      });

      // 定义分类颜色映射
      const categoryColors = {
        '餐饮': '#FF6B6B',
        '交通': '#4A90E2',
        '购物': '#4CAF50',
        '娱乐': '#FFC107',
        '居住': '#9C27B0',
        '医疗': '#E91E63',
        '教育': '#3F51B5',
        '其他': '#795548'
      };

      // 转换为前端需要的数据格式
      const categories = Array.from(categoryMap).map(([name, amount]) => ({
        name,
        amount: amount.toFixed(2),
        color: categoryColors[name] || '#795548' // 如果没有预设颜色，使用默认色
      }));

      // 按金额降序排序
      categories.sort((a, b) => parseFloat(b.amount) - parseFloat(a.amount));
      console.log("hello" + categories);

      // 更新图表数据
      const chartComponent = this.selectComponent('#mychart-dom-pie');
      if (chartComponent) {
        chartComponent.init((canvas, width, height, dpr) => {
          const chart = echarts.init(canvas, null, {
            width: width,
            height: height,
            devicePixelRatio: dpr
          });
          
          const option = this.data.ec.option;
          option.series[0].data = categories.map(item => ({
            name: item.name,
            value: parseFloat(item.amount),
            itemStyle: {
              color: item.color
            }
          }));
          
          chart.setOption(option);
          return chart;
        });
      }

      this.setData({ categories });

    } catch (error) {
      console.error('加载分类数据失败：', error);
      wx.showToast({
        title: '加载失败',
        icon: 'none'
      });
    } finally {
      wx.hideLoading();
    }
  },

  async loadTrendData() {
    try {
      wx.showLoading({ title: '加载中' });
      
      // 获取最近6个月的数据
      const now = new Date();
      const months = [];
      const incomeData = [];
      const expenseData = [];

      for (let i = 5; i >= 0; i--) {
        const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const startDate = new Date(date.getFullYear(), date.getMonth(), 1);
        const endDate = new Date(date.getFullYear(), date.getMonth() + 1, 0);

        const billsRes = await wx.cloud.callFunction({
          name: 'getBills',
          data: {
            startDate: startDate.toISOString(),
            endDate: endDate.toISOString()
          }
        });

        // 计算当月收支
        const monthIncome = billsRes.result.data
          .filter(bill => bill.type === 'income')
          .reduce((sum, bill) => sum + bill.amount, 0);
        
        const monthExpense = billsRes.result.data
          .filter(bill => bill.type === 'expense')
          .reduce((sum, bill) => sum + bill.amount, 0);

        // 格式化月份标签
        const monthLabel = `${date.getMonth() + 1}月`;
        months.push(monthLabel);
        incomeData.push(monthIncome.toFixed(2));
        expenseData.push(monthExpense.toFixed(2));
      }

      // 更新图表数据
      const chartComponent = this.selectComponent('#mychart-dom-trend');
      if (chartComponent) {
        chartComponent.init((canvas, width, height, dpr) => {
          const chart = echarts.init(canvas, null, {
            width: width,
            height: height,
            devicePixelRatio: dpr
          });
          
          const option = this.data.trendEc.option;
          option.xAxis.data = months;
          option.series[0].data = incomeData;
          option.series[1].data = expenseData;
          
          chart.setOption(option);
          return chart;
        });
      }

    } catch (error) {
      console.error('加载趋势数据失败：', error);
      wx.showToast({
        title: '加载失败',
        icon: 'none'
      });
    } finally {
      wx.hideLoading();
    }
  },

  onTabChange(e) {
    console.log('onTabChange 被调用', e.detail);
    // 使用 tabs 数组根据索引获取对应的 id
    const tabId = this.data.tabs[e.detail.index].id;
    
    this.setData({ 
      currentTab: tabId,
      isTabSwitching: true
    });
    
    this.loadChartData(tabId);

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
  },
}) 