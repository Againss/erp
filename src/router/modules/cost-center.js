/*
 * @Descripttion:
 * @Author: admin
 * @Date: 2021-07-08 14:47:00
 * @LastEditors: admin
 * @LastEditTime: 2021-07-20 18:08:15
 */
/** When your routing table is too long, you can split it into small modules **/

import Layout from '@/layout'
// import levelLayout from '@/layout/levelLayout'

const componentsRouter = {
  path: '/cost-center',
  name: 'cost-center',
  component: Layout,
  alwaysShow: true,
  redirect: 'noRedirect',
  meta: {
    title: '成本中心',
    icon: 'money',
    // keepOrgin: true,
    // noUseAuth: true
    permitTag: 'costCenter'
  },
  children: [
    {
      path: 'quotation-setting',
      component: () => import('@/views/cost-center/quotation-setting/index'),
      name: 'quotation-setting',
      meta: {
        title: '报价设置',
        icon: 'component',
        permitTag: 'costCenter:offer:list'
      }
    },
    {
      path: 'dyeing-finishing/list',
      component: () => import('@/views/cost-center/dyeing-finishing/index'),
      name: 'dyeing-finishing',
      meta: {
        title: '染整确价',
        icon: 'component',
        permitTag: 'costCenter:dye:list'
      }
    },
    {
      path: 'dyeing-finishing/detail',
      hidden: true,
      component: () =>
      import('@/views/cost-center/dyeing-finishing/detail'),
      name: 'dyeing-finishing-detail',
      meta: {
        noCache: true,
        title: '染整确价详情',
        icon: 'component',
        permitTag: 'costCenter:dye:info'
      }
    },
    {
      path: 'printing-finishing/list',
      component: () => import('@/views/cost-center/printing-finishing/index'),
      name: 'printing-finishing',
      meta: {
        title: '印花确价',
        icon: 'component',
        permitTag: 'costCenter:print:list'
      }
    },
    {
      path: 'printing-finishing/detail',
      hidden: true,
      component: () =>
      import('@/views/cost-center/printing-finishing/detail'),
      name: 'printing-finishing-detail',
      meta: {
        noCache: true,
        title: '印花确价详情',
        icon: 'component',
        permitTag: 'costCenter:print:info'
      }
    }
  ]
}

export default componentsRouter
