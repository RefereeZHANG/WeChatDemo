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
      const icons = {
        food: '/images/categories/food.png',
        transport: '/images/categories/transport.png',
        shopping: '/images/categories/shopping.png',
        salary: '/images/categories/salary.png'
        // ... 更多分类图标
      };
      this.setData({
        categoryIcon: icons[category] || '/images/categories/other.png'
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