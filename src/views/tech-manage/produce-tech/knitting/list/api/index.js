/*
 * @Author: your name
 * @Date: 2020-12-09 13:38:57
 * @LastEditTime: 2021-01-07 19:28:46
 * @LastEditors: your name
 * @Description: In User Settings Edit
 * @FilePath: \erp-tech-manage\src\views\tech-manage\weave-tech\analyse\list\api\index.js
 */
import request from '@/utils/request'

// 分页查询
export function pageList(data = {}) {
  const defaultParams = { pageNum: 1, pageSize: 20 }
  return request({
    url: '/techManage/tmKnitTech/page',
    method: 'post',
    data: { ...defaultParams, ...data }
  })
}
// 针织工艺分页查询数量统计
export function pageCount(data = {}) {
  return request({
    url: '/techManage/tmKnitTech/pageCount',
    method: 'post',
    data: { ...data }
  })
}

