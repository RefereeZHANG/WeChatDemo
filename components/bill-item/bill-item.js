Component({
  properties: {
    bill: {
      type: Object,
      value: {}
    }
  },

  data: {
    categoryIcon: ''
  },

  observers: {
    'bill.category': function(category) {
      this.setCategoryIcon(category);
    }
  },

  methods: {
    setCategoryIcon(category) {
      const iconMap = {
        '餐饮': 'coffee-o',
        '交通': 'logistics',
        '购物': 'cart-o',
        '娱乐': 'smile-o',
        '居住': 'home-o',
        '通讯': 'phone-o',
        '服饰': 'gift-o',
        '医疗': 'plus',
        '教育': 'bookmark-o',
        '其他': 'apps-o'
      };
      this.setData({
        categoryIcon: iconMap[category] || 'apps-o'
      });
    },

    onTap() {
      this.triggerEvent('tap', { bill: this.data.bill });
    },

    onLongPress() {
      wx.showActionSheet({
        itemList: ['编辑', '删除'],
        success: (res) => {
          if (res.tapIndex === 0) {
            this.triggerEvent('edit', { bill: this.data.bill });
          } else if (res.tapIndex === 1) {
            this.triggerEvent('delete', { bill: this.data.bill });
          }
        }
      });
    }
  }
}); 