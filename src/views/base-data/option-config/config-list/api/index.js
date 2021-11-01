/*
 * @Descripttion:选项配置
 * @Author: admin
 * @Date: 2021-03-04 13:54:46
 * @LastEditors: admin
 * @LastEditTime: 2021-03-05 11:30:31
 */
import request from '@/utils/request'

// 列表数据
export function sysOptionConfigList(data = {}) {
  const defaultParams = { pageNum: 1, pageSize: 20 }
  return request({
    url: '/baseData/optionConfig/page',
    method: 'post',
    data: { ...defaultParams, ...data }
  })
}

// 编辑详情
export function sysOptionConfigInfo(data) {
  return request({
    url: '/baseData/optionConfig/info',
    method: 'post',
    data
  })
}
// 编辑保存
export function sysOptionConfigModify(data) {
  return request({
    url: '/baseData/optionConfig/modify',
    method: 'post',
    data
  })
}
