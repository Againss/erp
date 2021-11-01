/*
 * @Descripttion:选项配置
 * @Author: admin
 * @Date: 2021-05-28 18:03:46
 * @LastEditors: zhengjin
 * @LastEditTime: 2021-06-21 17:26:31
 */
import request from '@/utils/request'

// 列表数据
export function sysOptionConfigList(data = {}) {
  const defaultParams = { page: 1, pageSize: 20 }
  return request({
    url: '/basis/api/optionConfig/index',
    method: 'post',
    data: { ...defaultParams, ...data }
  })
}

// 新增
export function sysOptionConfigAdd(data = {}) {
  return request({
    url: '/basis/api/optionConfig/store',
    method: 'post',
    data
  })
}

// 审核
export function sysOptionConfigExam(data = {}) {
  return request({
    url: '/basis/api/optionConfig/approve',
    method: 'post',
    data
  })
}

// 删除
export function sysOptionConfigDelete(data = {}) {
  return request({
    url: '/basis/api/optionConfig/destroy',
    method: 'post',
    data
  })
}

// 编辑详情
export function sysOptionConfigInfo(data) {
  return request({
    url: '/basis/api/optionConfig/show',
    method: 'post',
    data
  })
}
// 编辑更新
export function sysOptionConfigModify(data) {
  return request({
    url: '/basis/api/optionConfig/update',
    method: 'post',
    data
  })
}
