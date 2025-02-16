const formatAmount = (amount) => {
  return parseFloat(amount).toFixed(2);
};

const getCategoryIcon = (category) => {
  const categoryIcons = {
    food: '/images/categories/food.png',
    transport: '/images/categories/transport.png',
    shopping: '/images/categories/shopping.png',
    entertainment: '/images/categories/entertainment.png',
    housing: '/images/categories/housing.png',
    income: '/images/categories/income.png'
  };
  return categoryIcons[category] || categoryIcons.other;
};

const getBillType = (category) => {
  const expenseCategories = ['food', 'transport', 'shopping', 'entertainment', 'housing'];
  return expenseCategories.includes(category) ? 'expense' : 'income';
};

const calculateMonthlyTotal = (bills) => {
  return bills.reduce((total, bill) => {
    if (bill.type === 'expense') {
      return total - parseFloat(bill.amount);
    }
    return total + parseFloat(bill.amount);
  }, 0);
};

const groupBillsByDate = (bills) => {
  const groups = {};
  bills.forEach(bill => {
    const date = bill.date.split(' ')[0];
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(bill);
  });
  return groups;
};

module.exports = {
  formatAmount,
  getCategoryIcon,
  getBillType,
  calculateMonthlyTotal,
  groupBillsByDate
}; 