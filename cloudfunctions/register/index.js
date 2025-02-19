const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database()

exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const { userInfo } = event

  try {
    // 检查用户是否已存在
    const userCheck = await db.collection('users').where({
      openid: wxContext.OPENID
    }).get()

    if (userCheck.data.length > 0) {
      return {
        userInfo: userCheck.data[0]
      }
    }

    // 创建新用户
    const result = await db.collection('users').add({
      data: {
        openid: wxContext.OPENID,
        nickName: userInfo.nickName,
        avatarUrl: userInfo.avatarUrl,
        createdAt: db.serverDate(),
        settings: {
          currency: 'CNY',
          monthlyBudget: 0
        }
      }
    })

    const newUser = await db.collection('users').doc(result._id).get()
    return {
      userInfo: newUser.data
    }

  } catch (error) {
    console.error(error)
    return {
      error: error.message
    }
  }
} 