/** When your routing table is too long, you can split it into small modules **/

import Layout from '@/layout'
// import levelLayout from '@/layout/levelLayout'

const componentsRouter = {
  path: '/srm',
  component: Layout,
  // redirect: 'noRedirect',
  name: 'srm',
  meta: {
    title: '供应商采购管理',
    icon: 'component',
    permitTag: 'srm'
  },
  children: [
    {
      path: '/srm/masic-data',
      name: 'masic-data',
      component: () => import('@/views/srm/masic-data/index'),
      redirect: '/srm/masic-data/type-of-supplier',
      meta: {
        permitTag: 'srm:basicData',
        title: '基础数据',
        icon: 'table'
      },
      children: [
        {
          path: '/srm/masic-data/type-of-supplier',
          name: 'type-of-supplier',
          component: () => import('@/views/srm/masic-data/type-of-supplier'),
          meta: {
            permitTag: 'srm:basicData:supplierType:list',
            title: '供应商类别',
            icon: 'table'
          }
        },
        {
          path: '/srm/masic-data/evaluation-cycle',
          name: 'evaluation-cycle',
          component: () => import('@/views/srm/masic-data/evaluation-cycle'),
          meta: {
            permitTag: 'srm:basicData:assessmentPeriod:list',
            title: '考核周期',
            icon: 'table'
          }
        },
        {
          path: '/srm/masic-data/rating',
          name: 'rating',
          component: () => import('@/views/srm/masic-data/rating'),
          meta: {
            permitTag: 'srm:basicData:rankAssess:list',
            title: '等级评定',
            icon: 'table'
          }
        },
        {
          path: '/srm/masic-data/auditing',
          name: 'auditing',
          component: () => import('@/views/srm/masic-data/auditing'),
          meta: {
            permitTag: 'srm:basicData:judgmentAndReview',
            title: '评估审核流程',
            icon: 'table'
          }
        },
        {
          path: '/srm/masic-data/type-of-payment',
          name: 'type-of-payment',
          component: () => import('@/views/srm/masic-data/type-of-payment'),
          meta: {
            permitTag: 'srm:basicData:payMode:list',
            title: '付款方式',
            icon: 'table'
          }
        },
        // 原先的考核比重暂时先注释
        // {
        //   path: '/srm/masic-data/specific-gravity',
        //   name: 'specific-gravity',
        //   component: () => import('@/views/srm/masic-data/specific-gravity'),
        //   meta: {
        //     permitTag: 'srm:basicData:assessSpecific:list',
        //     title: '考核比重',
        //     icon: 'table'
        //     // keepOrgin: true,
        //     // noUseAuth: true
        //   }
        // },
        {
          path: '/srm/masic-data/appraisal-settings',
          name: 'appraisal-settings',
          component: () => import('@/views/srm/masic-data/appraisal-settings'),
          meta: {
            // permitTag: 'srm:basicData:assessSpecific:list',
            title: '考核设置',
            // icon: 'table',
            keepOrgin: true,
            noUseAuth: true
          }
        },
        {
          path: '/srm/masic-data/supplier-certificate',
          name: 'supplier-certificate',
          component: () => import('@/views/srm/masic-data/supplier-certificate'),
          meta: {
            permitTag: 'srm:basicData:supplierCertdential:list',
            title: '供应商证件'
          }
        },
        {
          path: '/srm/masic-data/equipment-brand',
          name: 'equipment-brand',
          component: () => import('@/views/srm/masic-data/equipment-brand'),
          meta: {
            permitTag: 'srm:basicData:equipmentBrand:list',
            title: '设备品牌'
          }
        }
      ]
    },
    {
      path: '/srm/application-supplier',
      name: 'application-supplier',
      component: () => import('@/views/srm/application-supplier'),
      meta: {
        permitTag: 'srm:supplierApplication:list',
        title: '申请新供应商',
        icon: 'table'
      }
    },
    {
      path: '/srm/suppliers-list',
      name: 'suppliers-list',
      component: () => import('@/views/srm/suppliers-list'),
      meta: {
        permitTag: 'srm:supplier:list',
        title: '供应商列表新',
        icon: 'table'
      }
    },
    /* 新增供应商详情*/
    {
      path: '/srm/suppliers-list/:type',
      name: 'suppliers-detail',
      hidden: true,
      component: () => import('@/views/srm/suppliers-list/detail'),
      meta: {
        activeMenu: '/srm/suppliers-list',
        title: '供应商详情',
        keepOrgin: true,
        noUseAuth: true
      }
    },
    {
      path: '/srm/performance-appraisal',
      name: 'performance-appraisal',
      component: () => import('@/views/srm/performance-appraisal'),
      meta: {
        permitTag: 'srm:supplierPerformance:list',
        title: '供应商绩效考核',
        icon: 'table'
      }
    },
    {
      path: '/srm/performance-analysis',
      name: 'performance-analysis',
      component: () => import('@/views/srm/performance-analysis'),
      meta: {
        permitTag: 'srm:supplierPerformanceAnalysis:list',
        title: '供应商绩效分析',
        icon: 'table'
      }
    }
  ]
}

export default componentsRouter
