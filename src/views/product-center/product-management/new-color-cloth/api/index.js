/*
 * @Author: Sanmao
 * @Date: 2020-09-30 10:06:53
 * @LastEditTime: 2021-06-25 14:26:06
 * @LastEditors: zhengjin
 * @Descripttion: 色/花布管理列表api文件
 */
import request from '@/utils/request'
import configData from '@/views/product-center/configDock/index.js'
// 分页查询色/花布管理列表
export function pageList(data = {}) {
  const defaultParams = {
    page: 1,
    pageSize: 20
  }
  return request({
    url: `${configData.productRequestPrefix}/api/cloth/productFabric`,
    method: 'post',
    data: {
      ...defaultParams,
      ...data
    }
  })
}
// 色/花布列表删除
export function chemicalFiberDestory(data = {}) {
  return request({
    url: `${configData.productRequestPrefix}/api/cloth/productFabric/destroy`,
    method: 'post',
    data: {
      ...data
    }
  })
}
// 化学纤维列表导出
export function productFabricExport(data = {}) {
  return request({
    url: `${configData.productRequestPrefix}/api/cloth/productFabric/export`,
    method: 'post',
    data: {
      ...data
    }
  })
}
// 色/花布详情
export function chemicalFiberShow(data = {}) {
  return request({
    url: `${configData.productRequestPrefix}/api/cloth/productFabric/show`,
    method: 'post',
    data: {
      ...data
    }
  })
}
// 色/花布添加
export function chemicalFiberStore(data = {}) {
  return request({
    url: `${configData.productRequestPrefix}/api/cloth/productFabric/store`,
    method: 'post',
    data: {
      ...data
    }
  })
}
// 色/花布编辑
export function chemicalFiberUpdate(data = {}) {
  return request({
    url: `${configData.productRequestPrefix}/api/cloth/productFabric/update`,
    method: 'post',
    data: {
      ...data
    }
  })
}
// 验证坯布编码是否存在
export function piShaCode(data = {}) {
  return request({
    url: `${configData.productRequestPrefix}/api/cloth/productFabric/embryoInfo`,
    method: 'post',
    data: {
      ...data
    }
  })
}
// 分页查询主工艺要求列表
export function pageMainTechList(data = {}) {
  const defaultParams = {
    page: 1,
    pageSize: 20
  }
  return request({
    url: `${configData.productRequestPrefix}/api/cloth/mainTech/index`,
    method: 'post',
    data: {
      ...defaultParams,
      ...data
    }
  })
}
// 主工艺要求-分类
export function mainTechTypeList(data = {}) {
  return request({
    url: `${configData.productRequestPrefix}/api/cloth/mainTech/typeIndex`,
    method: 'post',
    data: {
      ...data
    }
  })
}
// 主工艺要求-工艺要求
export function requirementList(data = {}) {
  return request({
    url: `${configData.productRequestPrefix}/api/bd/requirement/all`,
    method: 'post',
    data: {
      ...data
    }
  })
}
// 主工艺要求-工序流程
export function processFlowList(data = {}) {
  return request({
    url: `basis/api/standardProcessFlow/option`,
    method: 'post',
    data: {
      ...data
    }
  })
}
// 主工艺要求-风格整理
export function mainTechSplit(data = {}) {
  return request({
    url: `${configData.productRequestPrefix}/api/cloth/mainTech/split`,
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
// 染色成分
// export function dyeingList(data = {}) {
//   return request({
//     url: `basis/api/dyeIngredient/option`,
//     method: 'post',
//     data: {
//       ...data
//     }
//   })
// }
// 一级：type:1风格;type:2手感;type:3功能;
export function firstTechList(data = {}) {
  return request({
    url: `${configData.productRequestPrefix}/api/bd/requirement/techInfoByType`,
    method: 'post',
    data: {
      ...data
    }
  })
}
// 二级:传父级（一级）id
export function secondTechList(data = {}) {
  return request({
    url: `basis/api/requirementsDye/option`,
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
// 成品色号
export function productColorNumberList(data = {}) {
  return request({
    url: `color/api/color/droplist`,
    method: 'post',
    data: {
      ...data
    }
  })
}
// 染整工艺编码
export function dyeTechCodeList(data = {}) {
  return request({
    url: `${configData.productRequestPrefix}/api/tech/dyeTech/all`,
    method: 'post',
    data: {
      ...data
    }
  })
}
// 印花工艺编码
export function printTechCodeList(data = {}) {
  return request({
    url: `${configData.productRequestPrefix}/api/tech/printTech/all`,
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
// 染方式
export function fabricationDyedList(data = {}) {
  return request({
    url: `basis/api/fabricationProduceModes/option`,
    method: 'post',
    data: {
      ...data
    }
  })
}
// 布种
export function fabricationsList(data = {}) {
  return request({
    url: `basis/api/fabrications/option`,
    method: 'post',
    data: {
      ...data
    }
  })
}
// 幅宽 ---作废
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
// 布类下拉
export function getClothSelectData(data = {}) {
  return request({
    url: `basis/api/cloths/option`,
    method: 'post',
    data
  })
}

