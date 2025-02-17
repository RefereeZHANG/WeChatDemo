const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database()
const _ = db.command
const $ = _.aggregate

exports.main = async (event, context) => {
const { OPENID } = cloud.getWXContext()
const { startDate, endDate } = event

try {
    return await db.collection('bills')
    .aggregate()
    .match({
        userId: OPENID,
        date: _.gte(startDate).and(_.lte(endDate))
    })
    .group({
        _id: '$category',
        total: $.sum('$amount'),
        count: $.sum(1)
    })
    .end()
} catch(e) {
    console.error(e)
    return {
    success: false,
    errMsg: e
    }
}
}