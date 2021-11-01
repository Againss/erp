/*
 * @Author: Sanmao
 * @Date: 2021-01-04 15:39:30
 * @LastEditors: Sanmao
 * @LastEditTime: 2021-01-05 17:14:36
 * @Descripttion: 基础数据-生成工艺-幅宽列表api文件
 */
import request from '@/utils/request'
// 分页查询色系管理列表
export function pageList(data = {}) {
  const defaultParams = {
    page: 1,
    pageSize: 20
  }
  return request({
    url: `basis/api/fabricWidthType/index`,
    method: 'post',
    data: {
      ...defaultParams,
      ...data
    }
  })
}
// 新增
export function fabricWidthTypeAdd(data) {
  return request({
    url: `basis/api/fabricWidthType/store`,
    method: 'post',
    data
  })
}

// 点击编辑
export function fabricWidthTypeEdit(data) {
  return request({
    url: `basis/api/fabricWidthType/show`,
    method: 'post',
    data
  })
}

// 更新
export function fabricWidthTypeUpdate(data) {
  return request({
    url: `basis/api/fabricWidthType/update`,
    method: 'post',
    data
  })
}

// 删除
export function fabricWidthTypeDelete(data) {
  return request({
    url: `basis/api/fabricWidthType/destroy`,
    method: 'post',
    data
  })
}

// 审核
export function fabricWidthTypeApprove(data) {
  return request({
    url: `basis/api/fabricWidthType/approve`,
    method: 'post',
    data
  })
}

// 启用禁用
export function fabricWidthTypeEnabled(data) {
  return request({
    url: `basis/api/fabricWidthType/enabled`,
    method: 'post',
    data
  })
}
