Component({
  properties: {
    billData: {
      type: Object,
      value: {}
    }
  },

  data: {
    year: 2024,
    month: 3,
    weekdays: ['日', '一', '二', '三', '四', '五', '六'],
    days: [],
    selectedDate: ''
  },

  methods: {
    initCalendar() {
      const date = new Date(this.data.year, this.data.month - 1, 1);
      const days = [];
      const firstDay = date.getDay();
      const lastDate = new Date(this.data.year, this.data.month, 0).getDate();

      // 填充上个月的日期
      const prevMonthLastDate = new Date(this.data.year, this.data.month - 1, 0).getDate();
      for (let i = firstDay - 1; i >= 0; i--) {
        days.push({
          day: prevMonthLastDate - i,
          date: `${this.data.year}-${this.data.month - 1}-${prevMonthLastDate - i}`,
          current: false
        });
      }

      // 当月日期
      for (let i = 1; i <= lastDate; i++) {
        const dateStr = `${this.data.year}-${this.data.month}-${i}`;
        days.push({
          day: i,
          date: dateStr,
          current: true,
          selected: dateStr === this.data.selectedDate,
          amount: this.getBillAmount(dateStr)
        });
      }

      this.setData({ days });
    },

    getBillAmount(date) {
      const bills = this.data.billData[date] || [];
      return bills.reduce((sum, bill) => {
        return sum + (bill.type === 'expense' ? -bill.amount : +bill.amount);
      }, 0);
    },

    prevMonth() {
      let { year, month } = this.data;
      if (month === 1) {
        year--;
        month = 12;
      } else {
        month--;
      }
      this.setData({ year, month }, () => this.initCalendar());
    },

    nextMonth() {
      let { year, month } = this.data;
      if (month === 12) {
        year++;
        month = 1;
      } else {
        month++;
      }
      this.setData({ year, month }, () => this.initCalendar());
    },

    selectDate(e) {
      const date = e.currentTarget.dataset.date;
      this.setData({ selectedDate: date });
      this.triggerEvent('select', { date });
    },

    showYearMonth() {
      // 可以在这里实现年月选择器
    }
  },

  lifetimes: {
    attached() {
      const now = new Date();
      this.setData({
        year: now.getFullYear(),
        month: now.getMonth() + 1,
        selectedDate: now.toISOString().split('T')[0]
      });
      this.initCalendar();
    }
  }
}); 