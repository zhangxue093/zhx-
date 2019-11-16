// 导出文章相关的api函数
import request from '@/utils/request'
/**
 *
 * @param {integer} channelId 频道id
 * @param {integer} timestamp 时间戳
 */
export const getArticles = (channelId, timestamp) => {
  return request('app/v1_1/articles', 'get', {
    channel_id: channelId,
    timestamp,
    with_top: 1
  })
}
