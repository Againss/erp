/*
 * @Author: zhengjin
 * @Date: 2021-06-11 16:26:27
 * @LastEditors: zhengjin
 * @LastEditTime: 2021-06-15 16:26:27
 * @Descripttion: 产品目录public接口
 */
import request from '@/utils/request'
export function publicSelectList(data = {}) {
  return request({
    url: `basis/api/yarnTypes/option`,
    method: 'post',
    data: {
      ...data
    }
  })
}
// 布面效果public接口
export function finishedFabric(data = {}) {
  return request({
    url: `basis/api/finishedFabric/option`,
    method: 'post',
    data: {
      ...data
    }
  })
}
