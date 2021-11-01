/*
 * @Date: 2021-04-26 15:53:26
 * @Author: Againss
 * @LastEditTime: 2021-06-25 14:25:56
 * @LastEditors: zhengjin
 * @Descripttion:花布API
 */
import request from '@/utils/request'
import configData from '@/views/product-center/configDock/index.js'
// 分页查询花布管理列表
export function pageList(data = {}) {
  const defaultParams = {
    page: 1,
    pageSize: 20
  }
  return request({
    url: `${configData.productRequestPrefix}/api/cloth/flowerFabric`,
    method: 'post',
    data: {
      ...defaultParams,
      ...data
    }
  })
}
// 花布列表删除
export function flowerFabricDestory(data = {}) {
  return request({
    url: `${configData.productRequestPrefix}/api/cloth/flowerFabric/destroy`,
    method: 'post',
    data: {
      ...data
    }
  })
}
// 列表导出
export function flowerFabricExport(data = {}) {
  return request({
    url: `${configData.productRequestPrefix}/api/cloth/flowerFabric/export`,
    method: 'post',
    data: {
      ...data
    }
  })
}
// 花布详情
export function flowerFabricShow(data = {}) {
  return request({
    url: `${configData.productRequestPrefix}/api/cloth/flowerFabric/show`,
    method: 'post',
    data: {
      ...data
    }
  })
}
// 花布添加
export function flowerFabricStore(data = {}) {
  return request({
    url: `${configData.productRequestPrefix}/api/cloth/flowerFabric/store`,
    method: 'post',
    data: {
      ...data
    }
  })
}
// 花布编辑
export function flowerFabricUpdate(data = {}) {
  return request({
    url: `${configData.productRequestPrefix}/api/cloth/flowerFabric/update`,
    method: 'post',
    data: {
      ...data
    }
  })
}
// 验证坯布编码是否存在
export function colorCode(data = {}) {
  return request({
    url: `${configData.productRequestPrefix}/api/cloth/flowerFabric/colorInfo`,
    method: 'post',
    data: {
      ...data
    }
  })
}
// 印染类型
export function dyePrintTypeList(data = {}) {
  return request({
    url: `basis/api/printingDyeingType/option`,
    method: 'post',
    data: {
      ...data
    }
  })
}
// 成品花号
export function productFlowerNumberList(data = {}) {
  return request({
    url: `color/api/flower/droplist`,
    method: 'post',
    data: {
      ...data
    }
  })
}
// 织造花型
export function fabricationKnitList(data = {}) {
  return request({
    url: `basis/api/fabricationProduceModes/option`,
    method: 'post',
    data: {
      ...data
    }
  })
}
// 布种
// export function fabricationList(data = {}) {
//   return request({
//     url: `basis/api/fabrications/option`,
//     method: 'post',
//     data: {
//       ...data
//     }
//   })
// }
// 幅宽 --作废
export function fabricWidthTypeList(data = {}) {
  return request({
    url: `basis/api/fabricWidthType/option`,
    method: 'post',
    data: {
      ...data
    }
  })
}
// 预览3D
export function previewCode(data = {}) {
  return request({
    url: `${configData.productRequestPrefix}/api/cloth/lingDi/viewLingDi`,
    method: 'post',
    data: {
      ...data
    }
  })
}
// 克重替换
export function getFabricWeight(data = {}) {
  return request({
    url: `${configData.productRequestPrefix}/api/range/fabricWeight/search`,
    method: 'post',
    data
  })
}
// 幅宽替换
export function getFabricWidth(data = {}) {
  return request({
    url: `${configData.productRequestPrefix}/api/range/fabricWidth/search`,
    method: 'post',
    data
  })
}

