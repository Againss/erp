/** When your routing table is too long, you can split it into small modules **/

import Layout from '@/layout'
// import levelLayout from '@/layout/levelLayout'

const componentsRouter = {
  path: '/pms',
  name: 'pms',
  component: Layout,
  alwaysShow: true,
  redirect: 'noRedirect',
  meta: {
    title: '采购管理',
    icon: 'money',
    permitTag: 'pms'
  },
  children: [{
    path: 'renewal-management',
    component: () => import('@/views/pms/renewal-management/index'),
    name: 'renewal-management',
    meta: {
      title: '复期管理',
      icon: 'table',
      permitTag: 'pms:renewal:list'
    }
  },
  {
    path: 'demand-management/list',
    component: () =>
      import('@/views/pms/demand-management/index'),
    name: 'DemandManagement',
    meta: {
      noCache: true,
      title: '采购需求',
      icon: 'component',
      permitTag: 'pms:purchaseDemand:list'
    }
  },
  {
    path: 'enquiry-management/list',
    component: () => import('@/views/pms/enquiry-manage/index'),
    name: 'EnquiryManagement',
    meta: {
      title: '询价单',
      icon: 'component',
      permitTag: 'pms:inquiry:list'
    }
  },
  {
    path: 'enquiry-manage/:type',
    hidden: true,
    component: () =>
      import('@/views/pms/enquiry-manage/detail'),
    name: 'EnquiryDetail',
    meta: {
      noCache: true,
      title: '询价单详情',
      icon: 'component',
      permitTag: 'pms:inquiry:info',
      activeMenu: '/pms/enquiry-management/list'
    }
  },
  {
    path: 'order-management/list',
    component: () =>
      import('@/views/pms/order-management/index'),
    name: 'OrderManagement',
    meta: {
      noCache: true,
      title: '采购订单',
      icon: 'component',
      permitTag: 'pms:purchaseOrder:list'
    }
  },
  {
    path: 'order-management/:type',
    hidden: true,
    component: () =>
      import('@/views/pms/order-management/detail'),
    name: 'OrderDetail',
    meta: {
      noCache: true,
      title: '采购订单详情',
      icon: 'component',
      permitTag: 'pms:purchaseOrder:info',
      activeMenu: '/pms/order-management/list'
    }
  },
  {
    path: 'delivery-plan',
    component: () =>
      import('@/views/pms/delivery-plan/index'),
    name: 'delivery-plan',
    meta: {
      title: '送货计划',
      icon: 'table',
      permitTag: 'pms:deliveryPlan:list'
    }
  },
  {
    path: 'delivery-note/index',
    component: () =>
      import('@/views/pms/delivery-note/index'),
    name: 'delivery-note',
    meta: {
      title: '送货单',
      icon: 'component',
      permitTag: 'pms:deliveryNote:list'
    }
  },
  {
    path: 'delivery-note/detail',
    hidden: true,
    component: () =>
      import('@/views/pms/delivery-note/detail'),
    name: 'deliveryDetail',
    meta: {
      noCache: true,
      title: '送货单详情',
      icon: 'component',
      permitTag: 'pms:deliveryNote:info',
      activeMenu: '/pms/delivery-note/index'
    }
  },
  {
    path: 'contract-manage/index',
    component: () =>
      import('@/views/pms/contract-manage/index'),
    name: 'contract-manage',
    meta: {
      title: '合同管理',
      icon: 'excel',
      permitTag: 'pms:contract:list'
    }
  }]
}

export default componentsRouter
