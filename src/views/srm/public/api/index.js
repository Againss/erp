import request from '@/utils/request'
//import { pagingConfig } from '@/utils/public'
/* 获取供应商类型列表 */
export const getSupplierTypeListData = (params = {}) => {
    return request({
        method: 'post',
        url: '/srm/supplierType/list',
        data: params
    })
}
/* 根据供应商类型查询供应商信息 */
export const getSupplierNameListData = (params = {}) => {
    return request({
        method: 'post',
        url: '/srm/supplier/list',
        data: params
    })
}
/* 选择评估部门 */
export const getSysOrgListData = (params = {}) => {
    return request({
        method: 'post',
        url: '/srm/usercommon/org/list?r=' + Math.random(),
        data: params
    })
}

/* 获取用户部门 */
export const getSysUserListData = (params = {}) => {
    /*  orgIds: [params.orglds] */
    return request({
        method: 'post',
        url: '/srm/usercommon/user/list?r=' + Math.random(),
        data: {
            orgIds: [params.orglds]
        }
    })
}
/* 付款方式列表 */
export const getPaymentData = (params = {}) => {
    return request({
        method: 'post',
        url: '/srm/payMode/list',
        data: params
    })
}
/* 获取考核周期和考核期数 查询条件 联动数据 */
export const getSupplierPerformancePeriod2noData = (data = {}) => {
    return request({
        method: 'post',
        url: '/srm/supplierPerformance/query/period2no',
        data
    })
}
/* 考核周期列表 */
export const getPublicCycleData = (params = {}) => {
    return request({
        method: 'post',
        url: '/srm/assessmentPeriod/list',
        data: params
    })
}

/* 供应商等级列表 */
export const getDropDownRankAssessData = (params = {}) => {
    return request({
        method: 'post',
        url: '/srm/rankAssess/list',
        data: params
    })
}

/* 用户详情 */
export const getSysUserInfoData = (params = {}) => {
    return request({
        method: 'post',
        url: '/userCenter/sysUser/info',
        data: params
    })
}

// 获取省市区信息
export function openapiAreaSearch (data) {
    return request({
        url: '/basis/openapi/area/search',
        method: 'post',
        data
    })
}
