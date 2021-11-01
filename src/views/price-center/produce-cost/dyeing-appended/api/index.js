// 选项配置-公证行页面API
import request from '@/utils/request'

// 分页查询公证行列表
export function dyeingAdditionalInfoPage(data = {}) {
  const defaultParams = { pageNum: 1, pageSize: 20 }
  return request({
    url: '/priceCenter/dyeingAdditionalInfo/page',
    method: 'post',
    data: { ...defaultParams, ...data }
  })
}

// 新增
export function dyeingAdditionalInfoAdd(data) {
  return request({
    url: '/priceCenter/dyeingAdditionalInfo/add',
    method: 'post',
    data
  })
}

// 编辑--详情
export function dyeingAdditionalInfoDetail(data) {
  return request({
    url: '/priceCenter/dyeingAdditionalInfo/info',
    method: 'post',
    data
  })
}

// 修改
export function dyeingAdditionalInfoModify(data) {
  return request({
    url: '/priceCenter/dyeingAdditionalInfo/modify',
    method: 'post',
    data
  })
}

// 删除
export function dyeingAdditionalInfoDelete(data) {
  return request({
    url: '/priceCenter/dyeingAdditionalInfo/delete',
    method: 'post',
    data
  })
}

// 启用禁用
export function dyeingAdditionalInfoEnabled(data) {
  return request({
    url: '/priceCenter/dyeingAdditionalInfo/status',
    method: 'post',
    data
  })
}

