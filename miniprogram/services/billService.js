const Bill = {
  // 添加新账单
  async add(billData) {
    try {
      const bills = wx.getStorageSync('bills') || [];
      const newBill = {
        id: Date.now().toString(),
        ...billData,
        createTime: new Date().toISOString()
      };
      bills.unshift(newBill);
      wx.setStorageSync('bills', bills);
      return newBill;
    } catch (error) {
      console.error('添加账单失败:', error);
      throw error;
    }
  },

  // 获取账单列表
  async getList(params = {}) {
    try {
      const bills = wx.getStorageSync('bills') || [];
      const { startDate, endDate, category, type } = params;
      
      return bills.filter(bill => {
        let match = true;
        if (startDate && endDate) {
          match = match && bill.date >= startDate && bill.date <= endDate;
        }
        if (category) {
          match = match && bill.category === category;
        }
        if (type) {
          match = match && bill.type === type;
        }
        return match;
      });
    } catch (error) {
      console.error('获取账单列表失败:', error);
      throw error;
    }
  },

  // 删除账单
  async delete(billId) {
    try {
      const bills = wx.getStorageSync('bills') || [];
      const newBills = bills.filter(bill => bill.id !== billId);
      wx.setStorageSync('bills', newBills);
      return true;
    } catch (error) {
      console.error('删除账单失败:', error);
      throw error;
    }
  },

  // 更新账单
  async update(billId, updateData) {
    try {
      const bills = wx.getStorageSync('bills') || [];
      const index = bills.findIndex(bill => bill.id === billId);
      if (index > -1) {
        bills[index] = { ...bills[index], ...updateData };
        wx.setStorageSync('bills', bills);
        return bills[index];
      }
      throw new Error('账单不存在');
    } catch (error) {
      console.error('更新账单失败:', error);
      throw error;
    }
  }
};

module.exports = Bill; 