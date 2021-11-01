// 选项配置-公证行页面API
import request from '@/utils/request'

// 分页查询公证行列表
export function printingProcessInfoPage(data = {}) {
  const defaultParams = { pageNum: 1, pageSize: 20 }
  return request({
    url: '/priceCenter/dyeingInfo/page',
    method: 'post',
    data: { ...defaultParams, ...data }
  })
}

// 新增
export function printingProcessInfoAdd(data) {
  return request({
    url: '/priceCenter/dyeingInfo/add',
    method: 'post',
    data
  })
}

// 新增
export function printingProcessInfoList(data) {
  return request({
    url: '/priceCenter/dyeingInfo/optionsFilled',
    method: 'post',
    data
  })
}

// 编辑--详情
export function printingProcessInfoDetail(data) {
  return request({
    url: '/priceCenter/dyeingInfo/info',
    method: 'post',
    data
  })
}

// 修改
export function printingProcessInfoModify(data) {
  return request({
    url: '/priceCenter/dyeingInfo/modify',
    method: 'post',
    data
  })
}

// 删除
export function printingProcessInfoDelete(data) {
  return request({
    url: '/priceCenter/dyeingInfo/delete',
    method: 'post',
    data
  })
}

// 启用禁用
export function printingProcessInfoEnabled(data) {
  return request({
    url: '/priceCenter/dyeingInfo/status',
    method: 'post',
    data
  })
}
