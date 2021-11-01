/** When your routing table is too long, you can split it into small modules **/

import Layout from '@/layout'
import levelLayout from '@/layout/levelLayout'

const componentsRouter = {
  path: '/fs',
  name: 'fs',
  component: Layout,
  meta: {
    permitTag: 'finance',
    // keepOrgin: true, // 保持自定义元数据信息
    // noUseAuth: true, // 无需认证的路由
    title: '财务',
    icon: 'money'
  },
  children: [{
    path: 'payment',
    component: levelLayout,
    name: 'payment',
    redirect: '/fs/payment/payment-list',
    meta: {
      title: '付款管理',
      permitTag: 'finance:payment',
      icon: 'table'
    },
    children: [
      {
        path: 'payment-list',
        name: 'payment-list',
        component: () => import('@/views/fs/payment/payment-list'),
        meta: {
          title: '付款单列表',
          permitTag: 'finance:payment:paymentApplication:page'
        }
      },
      {
        path: 'receipt-account',
        name: 'receipt-account',
        component: () => import('@/views/fs/payment/receipt-account'),
        meta: {
          title: '维护收款账户',
          permitTag: 'finance:payment:collectionAccount:page'
        }
      },
      {
        path: 'loan-account',
        name: 'loan-account',
        component: () => import('@/views/fs/payment/loan-account'),
        meta: {
          title: '维护付款账户',
          permitTag: 'finance:payment:paymentAccount:page'
        }
      },
      {
        path: 'loan-mate',
        name: 'loan-mate',
        component: () => import('@/views/fs/payment/loan-mate'),
        meta: {
          title: '维护付款匹配',
          permitTag: 'finance:payment:paymentMatch:page'
        }
      }
    ]
  }]
}

export default componentsRouter
