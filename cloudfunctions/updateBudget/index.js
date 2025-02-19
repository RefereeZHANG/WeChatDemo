const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database()

exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const userId = wxContext.OPENID
  const { amount } = event
  
  const now = new Date()
  const year = now.getFullYear()
  const month = now.getMonth() + 1

  try {
    // 先查找是否存在当月预算
    const existingBudget = await db.collection('budgets')
      .where({
        userId: userId,
        year: year,
        month: month,
        isActive: true
      })
      .get()

    if (existingBudget.data.length > 0) {
      // 更新现有预算
      await db.collection('budgets').doc(existingBudget.data[0]._id).update({
        data: {
          amount: Number(amount),
          updatedAt: db.serverDate()
        }
      })
    } else {
      // 创建新预算
      await db.collection('budgets').add({
        data: {
          userId: userId,
          amount: Number(amount),
          year: year,
          month: month,
          isActive: true,
          createdAt: db.serverDate(),
          updatedAt: db.serverDate()
        }
      })
    }

    return {
      success: true
    }
  } catch (error) {
    console.error('更新预算失败：', error)
    return {
      success: false,
      error: error
    }
  }
} 