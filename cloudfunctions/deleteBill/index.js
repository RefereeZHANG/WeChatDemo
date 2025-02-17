const cloud = require('wx-server-sdk')
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })
const db = cloud.database()

exports.main = async (event, context) => {
  try {
    const { id } = event
    return await db.collection('bills').doc(id).remove()
  } catch (error) {
    console.error(error)
    throw error
  }
} 