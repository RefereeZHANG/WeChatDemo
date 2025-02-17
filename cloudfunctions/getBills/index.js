const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV // 获取当前环境
})

const db = cloud.database()
const _ = db.command
const MAX_LIMIT = 100 // 每次最多获取100条数据

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  
  try {
    // 构建查询条件
    const where = {
      userId: wxContext.OPENID
    }

    // 如果有日期范围，添加日期条件
    if (event.startDate && event.endDate) {
      where.date = _.gte(event.startDate).and(_.lte(event.endDate))
    }

    // 先取得总数
    const countResult = await db.collection('bills').where(where).count()
    const total = countResult.total

    // 计算需要取多少次
    const batchTimes = Math.ceil(total / MAX_LIMIT)
    
    // 承载所有读操作的 promise 的数组
    const tasks = []
    
    for (let i = 0; i < batchTimes; i++) {
      const promise = db.collection('bills')
        .where(where)
        .skip(i * MAX_LIMIT)
        .limit(MAX_LIMIT)
        .orderBy('date', 'desc') // 按日期降序排列
        .get()
      tasks.push(promise)
    }

    // 等待所有数据取完
    const results = await Promise.all(tasks)
    
    // 把数据打平成一个数组
    let bills = []
    results.forEach(result => {
      bills = bills.concat(result.data)
    })

    return {
      success: true,
      data: bills,
      total: total
    }

  } catch (err) {
    console.error('获取账单列表失败：', err)
    return {
      success: false,
      errMsg: err
    }
  }
}