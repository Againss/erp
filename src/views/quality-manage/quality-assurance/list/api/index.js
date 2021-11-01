/*
 * @Author: your name
 * @Date: 2020-12-09 13:38:57
 * @LastEditTime: 2021-01-07 19:28:46
 * @LastEditors: your name
 * @Description: In User Settings Edit
 * @FilePath: \erp-tech-manage\src\views\tech-manage\weave-tech\analyse\list\api\index.js
 */
import request from '@/utils/request'

// 试纱-分页查询
export function pageList(data = {}) {
  const defaultParams = { pageNum: 1, pageSize: 20 }
  return request({
    url: '/qa/qaYarnInspectionTesting/page',
    method: 'post',
    data: { ...defaultParams, ...data }
  })
}
// 试纱-每个分组对应的数量
export function pageCount(data = {}) {
  return request({
    url: '/qa/qaYarnInspectionTesting/AllCountsGroupByStatus',
    method: 'post',
    data: { ...data }
  })
}
