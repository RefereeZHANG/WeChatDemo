const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database()

exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const userId = wxContext.OPENID
  
  const now = new Date()
  const year = now.getFullYear()
  const month = now.getMonth() + 1

  try {
    const result = await db.collection('budgets')
      .where({
        userId: userId,
        year: year,
        month: month,
        isActive: true
      })
      .limit(1)
      .get()

    if (result.data && result.data.length > 0) {
      return {
        success: true,
        data: result.data[0]
      }
    } else {
      // 如果没有找到当月预算，返回默认值
      return {
        success: true,
        data: {
          amount: 5000 // 默认预算金额
        }
      }
    }
  } catch (error) {
    console.error('获取预算失败：', error)
    return {
      success: false,
      error: error
    }
  }
} 