Component({
  properties: {
    budget: {
      type: Number,
      value: 0
    },
    usedAmount: {
      type: Number,
      value: 0
    }
  },

  observers: {
    'budget, usedAmount': function(budget, used) {
      this.setData({
        remainingAmount: (budget - used).toFixed(2)
      });
      this.drawProgress();
    }
  },

  data: {
    remainingAmount: '0.00'
  },

  methods: {
    async drawProgress() {
      const query = this.createSelectorQuery();
      const canvas = await new Promise(resolve => {
        query.select('#progressCanvas')
          .fields({ node: true, size: true })
          .exec((res) => resolve(res[0]));
      });

      const ctx = canvas.node.getContext('2d');
      const dpr = wx.getSystemInfoSync().pixelRatio;
      canvas.width = canvas.width * dpr;
      canvas.height = canvas.height * dpr;
      ctx.scale(dpr, dpr);

      const centerX = canvas.width / (2 * dpr);
      const centerY = canvas.height / (2 * dpr);
      const radius = 120;

      // 绘制背景圆环
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
      ctx.strokeStyle = '#F5F5F5';
      ctx.lineWidth = 15;
      ctx.stroke();

      // 计算进度
      const progress = this.data.usedAmount / this.data.budget;
      const endAngle = (-0.5 + 2 * progress) * Math.PI;

      // 绘制进度圆环
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, -0.5 * Math.PI, endAngle);
      ctx.strokeStyle = '#4A90E2';
      ctx.stroke();
    }
  },

  lifetimes: {
    attached() {
      this.drawProgress();
    }
  }
}); 