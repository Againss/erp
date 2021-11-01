// 生产成本-染色损耗
import request from '@/utils/request'

// 分页查询公证行列表
export function dyeingLossPage(data = {}) {
  const defaultParams = { pageNum: 1, pageSize: 20 }
  return request({
    url: '/priceCenter/dyeingLossInfo/page',
    method: 'post',
    data: { ...defaultParams, ...data }
  })
}

// 搜索下拉数据
export function dyeingLossList(data) {
  return request({
    url: '/priceCenter/dyeingLossInfo/optionsFilled',
    method: 'post',
    data
  })
}

// 新增
export function dyeingLossAdd(data) {
  return request({
    url: '/priceCenter/dyeingLossInfo/add',
    method: 'post',
    data
  })
}

// 编辑--详情
export function dyeingLossDetail(data) {
  return request({
    url: '/priceCenter/dyeingLossInfo/info',
    method: 'post',
    data
  })
}

// 修改
export function dyeingLossModify(data) {
  return request({
    url: '/priceCenter/dyeingLossInfo/modify',
    method: 'post',
    data
  })
}

// 删除
export function dyeingLossDelete(data) {
  return request({
    url: '/priceCenter/dyeingLossInfo/delete',
    method: 'post',
    data
  })
}

// 启用禁用
export function dyeingLossEnabled(data) {
  return request({
    url: '/priceCenter/dyeingLossInfo/status',
    method: 'post',
    data
  })
}
