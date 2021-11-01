import request from '@/utils/request'

// 商机分页查询
export function businessOpportunityPage(data = {}) {
  const defaultParams = { pageNum: 1, pageSize: 20 }
  return request({
    url: '/crm/business/opportunity/page',
    method: 'post',
    data: { ...defaultParams, ...data }
  })
}

// 商机详情
export function businessOpportunityInfo(data) {
  return request({
    url: '/crm/business/opportunity/info',
    method: 'post',
    data
  })
}

// 商机更改所有人
export function businessOpportunityModifyFollower(data) {
  return request({
    url: '/crm/business/opportunity/modify/follower',
    method: 'post',
    data
  })
}

// 修改商机
export function businessOpportunityModify(data) {
  return request({
    url: '/crm/business/opportunity/modify',
    method: 'post',
    data
  })
}

// 删除商机
export function businessOpportunityDelete(data) {
  return request({
    url: '/crm/business/opportunity/delete',
    method: 'post',
    data
  })
}

// 新增商机
export function businessOpportunityAdd(data) {
  return request({
    url: '/crm/business/opportunity/add',
    method: 'post',
    data
  })
}

// 更改商机阶段
export function businessOpportunityModifyStage(data) {
  return request({
    url: '/crm/business/opportunity/modify/stage',
    method: 'post',
    data
  })
}

// 关联竞争对手
export function businessOpportunityCompetitorLink(data) {
  return request({
    url: '/crm/business/opportunity/competitor/link',
    method: 'post',
    data
  })
}
// 取消关联竞争对手
export function businessOpportunityCompetitorUnlink(data) {
  return request({
    url: '/crm/business/opportunity/competitor/unlink',
    method: 'post',
    data
  })
}
// 商机-竞争对手分页列表
export function businessOpportunityCompetitorPage(data) {
  const defaultParams = { pageNum: 1, pageSize: 20 }
  return request({
    url: '/crm/business/opportunity/competitor/page',
    method: 'post',
    data: { ...defaultParams, ...data }
  })
}

// 商机-联系人分页列表
export function opinionPage(data) {
  const defaultParams = { pageNum: 1, pageSize: 20 }
  return request({
    url: '/crm/opinion/page',
    method: 'post',
    data: { ...defaultParams, ...data }
  })
}

// 商机-联系人新增
export function opinionAdd(data) {
  return request({
    url: '/crm/opinion/add',
    method: 'post',
    data
  })
}

// 商机-联系人删除
export function opinionDelete(data) {
  return request({
    url: '/crm/opinion/delete',
    method: 'post',
    data
  })
}

// 商机-联系人修改
export function opinionModify(data) {
  return request({
    url: '/crm/opinion/modify',
    method: 'post',
    data
  })
}

// 商机-联系人详情
export function opinionInfo(data) {
  return request({
    url: '/crm/opinion/info',
    method: 'post',
    data
  })
}

// 联系人相关商机分页查询
export function businessOpportunityAbout(data = {}) {
  const defaultParams = { pageNum: 1, pageSize: 20 }
  return request({
    url: '/crm/business/opportunity/about',
    method: 'post',
    data: { ...defaultParams, ...data }
  })
}
