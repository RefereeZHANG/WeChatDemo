const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database()

exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const openid = wxContext.OPENID

  try {
    // 获取用户基本信息
    const userResult = await db.collection('users').where({
      openid: openid
    }).get()

    if (userResult.data.length === 0) {
      // 如果用户不存在，创建新用户
      const newUser = {
        openid: openid,
        nickName: '新用户',
        avatarUrl: '/images/default-avatar.png',
        createdAt: db.serverDate(),
        settings: {
          currency: 'CNY',
          monthlyBudget: 0
        }
      }
      await db.collection('users').add({
        data: newUser
      })
      return { ...newUser, isNewUser: true }
    }

    // 获取用户统计数据
    const now = new Date()
    const currentMonth = now.getMonth() + 1
    const currentYear = now.getFullYear()

    const [billsStats, streakData] = await Promise.all([
      // 获取账单统计
      db.collection('bills')
        .where({
          userId: userResult.data[0]._id,
          deleted: false
        })
        .count(),
      // 获取当月账单数
      db.collection('bills')
        .where({
          userId: userResult.data[0]._id,
          deleted: false,
          date: db.command.gte(new Date(`${currentYear}-${currentMonth}-01`))
        })
        .count(),
      // 获取连续记账天数（这里简化处理，实际可能需要更复杂的逻辑）
      db.collection('bills')
        .where({
          userId: userResult.data[0]._id,
          deleted: false
        })
        .orderBy('date', 'desc')
        .limit(30)
        .get()
    ])

    // 计算成就
    const achievements = await calculateAchievements(userResult.data[0]._id, billsStats.total)

    return {
      ...userResult.data[0],
      totalBills: billsStats.total,
      monthlyBills: streakData.total,
      streakDays: calculateStreakDays(streakData.data),
      achievements: achievements,
      isNewUser: false
    }
  } catch (error) {
    console.error(error)
    return {
      error: error.message
    }
  }
}

// 计算连续记账天数
function calculateStreakDays(bills) {
  if (!bills || bills.length === 0) return 0
  
  let streakDays = 1
  let lastDate = new Date(bills[0].date)
  
  for (let i = 1; i < bills.length; i++) {
    const currentDate = new Date(bills[i].date)
    const diffDays = Math.floor((lastDate - currentDate) / (1000 * 60 * 60 * 24))
    
    if (diffDays === 1) {
      streakDays++
      lastDate = currentDate
    } else {
      break
    }
  }
  
  return streakDays
}

// 计算成就
async function calculateAchievements(userId, totalBills) {
  const achievements = [
    {
      id: 1,
      name: '记账新手',
      icon: 'records',
      unlocked: totalBills >= 1
    },
    {
      id: 2,
      name: '坚持达人',
      icon: 'clock-o',
      unlocked: totalBills >= 30
    },
    {
      id: 3,
      name: '理财高手',
      icon: 'gold-coin-o',
      unlocked: totalBills >= 100
    },
    {
      id: 4,
      name: '节约能手',
      icon: 'gift-o',
      unlocked: totalBills >= 365
    }
  ]
  
  return achievements
} 