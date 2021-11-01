/*
 * @Descripttion: 客户信息
 * @version: 1.0
 * @Author: shujing
 * @Date: 2020-11-16 09:21:53
 * @LastEditors: zhengjin
 * @LastEditTime: 2021-08-06 11:50:29
 */
/** When your routing table is too long, you can split it into small modules **/

import Layout from '@/layout'
// import levelLayout from '@/layout/levelLayout'

const customerInfo = {
  path: '/customer-info',
  component: Layout,
  name: 'CustomerInfo',
  alwaysShow: true,
  redirect: 'noRedirect',
  meta: {
    title: '客户信息',
    icon: 'list',
    permitTag: 'customer'
  },
  children: [
    {
      path: 'customer-management',
      name: 'CustomerList',
      component: () => import('@/views/customer-info/customer-management/list/index.vue'),
      meta: {
        title: '客户信息管理',
        permitTag: 'customer:list'
      }
    },
    {
      path: 'customer-management/details/:id',
      name: 'CustomerDetails',
      hidden: true,
      component: () => import('@/views/customer-info/customer-management/detail/details.vue'),
      meta: {
        title: '客户信息详情',
        activeMenu: '/customer-info/customer-management',
        permitTag: 'customer:info'
      }
    }
  ]
}

export default customerInfo
