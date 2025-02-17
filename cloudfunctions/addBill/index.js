// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV // 获取当前环境
})

const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  
  // 数据验证
  if (!event.amount || !event.type || !event.category || !event.date) {
    return {
      success: false,
      errMsg: '缺少必要参数'
    }
  }

  try {
    // 构建账单数据
    const billData = {
      userId: wxContext.OPENID,
      amount: parseFloat(event.amount),
      type: event.type,
      category: event.category,
      date: event.date,
      description: event.description || '',
      createTime: db.serverDate()
    }

    // 添加到数据库
    const result = await db.collection('bills').add({
      data: billData
    })

    return {
      success: true,
      _id: result._id,
      data: billData
    }

  } catch (err) {
    console.error('添加账单失败：', err)
    return {
      success: false,
      errMsg: err
    }
  }
}
