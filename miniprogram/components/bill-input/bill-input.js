Component({
  properties: {
    show: {
      type: Boolean,
      value: false
    }
  },

  data: {
    billType: 'expense',
    amount: '',
    selectedCategory: '',
    note: '',
    date: '',
    categories: [
      {
        id: 'food',
        name: '餐饮',
        icon: 'coffee-o',
        type: 'expense'
      },
      {
        id: 'transport',
        name: '交通',
        icon: 'logistics',
        type: 'expense'
      },
      {
        id: 'shopping',
        name: '购物',
        icon: 'cart-o',
        type: 'expense'
      },
      {
        id: 'salary',
        name: '工资',
        icon: 'balance-pay',
        type: 'income'
      }
      // ... 更多分类
    ],
    canSave: false
  },

  observers: {
    'amount, selectedCategory': function(amount, category) {
      this.setData({
        canSave: amount && category
      });
    }
  },

  methods: {
    onClose() {
      this.triggerEvent('close');
      this.resetForm();
    },

    switchType(e) {
      const type = e.currentTarget.dataset.type;
      this.setData({
        billType: type,
        selectedCategory: ''
      });
    },

    onAmountInput(e) {
      let value = e.detail.value;
      // 限制只能输入两位小数
      if (value.indexOf('.') > 0) {
        value = value.match(/^\d*(\.?\d{0,2})/g)[0] || '';
      }
      this.setData({ amount: value });
    },

    selectCategory(e) {
      const category = e.currentTarget.dataset.category;
      this.setData({ selectedCategory: category });
    },

    onNoteInput(e) {
      this.setData({ note: e.detail.value });
    },

    onDateChange(e) {
      this.setData({ date: e.detail.value });
    },

    resetForm() {
      this.setData({
        billType: 'expense',
        amount: '',
        selectedCategory: '',
        note: '',
        date: ''
      });
    },

    onSave() {
      if (!this.data.canSave) return;

      const billData = {
        type: this.data.billType,
        amount: this.data.amount,
        category: this.data.selectedCategory,
        note: this.data.note,
        date: this.data.date || new Date().toISOString().split('T')[0]
      };

      this.triggerEvent('save', billData);
      this.onClose();
    }
  },

  lifetimes: {
    attached() {
      // 设置默认日期为今天
      const today = new Date().toISOString().split('T')[0];
      this.setData({ date: today });
    }
  }
}); 