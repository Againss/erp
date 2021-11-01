/*
 * @Descripttion: 客户订单管理
 * @version: 1.0
 * @Author: shujing
 * @Date: 2020-11-16 09:21:53
 * @LastEditors: Againss
 * @LastEditTime: 2021-07-10 17:09:00
 */
/** When your routing table is too long, you can split it into small modules **/

import Layout from '@/layout'
import levelLayout from '@/layout/levelLayout'

const customerOrder = {
  path: '/customer-order',
  component: Layout,
  name: 'CustomerOrder',
  alwaysShow: true,
  redirect: 'noRedirect',
  meta: {
    title: '客户订单管理',
    icon: 'list',
    permitTag: 'customerOrder'
    // keepOrgin: true,
    // noUseAuth: true,
  },
  children: [
    {
      path: 'guest-need',
      component: () =>
        import('@/views/customer-order/guest-need/index.vue'),
      name: 'GuestNeed',
      meta: {
        title: '客户需求列表',
        permitTag: 'customerOrder:customerRequire:page'

      }
    },
    {
      path: 'analysis-application',
      component: levelLayout,
      name: 'analysis-application',
      redirect: 'noRedirect',
      alwaysShow: true,
      meta: {
        title: '申请单据',
        permitTag: 'customerOrder:analysisApply'

      },
      children: [
        {
          path: 'guest-application',
          component: () =>
            import('@/views/customer-order/analysis-application/guest-application/index.vue'),
          name: 'GuestApplicationList',
          meta: {
            title: '客样分析申请',
            permitTag: 'customerOrder:sampleAnalysisApply:page'

          }
        },
        {
          path: 'guest-application/:id/:edit',
          hidden: true,
          component: () => import('@/views/customer-order/analysis-application/guest-application/detail'),
          name: 'guestApplicationDetail',
          meta: {
            activeMenu: '/customer-order/analysis-application/guest-application',
            keepOrgin: true,
            noUseAuth: true, // 无需认证的路由
            title: '客样分析申请详情'
          }
        },
        {
          path: 'guest-application/create',
          hidden: true,
          component: () => import('@/views/customer-order/analysis-application/guest-application/detail'),
          name: 'guestApplicationCreate',
          meta: {
            activeMenu: '/customer-order/analysis-application/guest-application',
            keepOrgin: true,
            noUseAuth: true, // 无需认证的路由
            title: '客样分析申请详情'
          }
        },
        {
          path: 'guest-application/print',
          hidden: true,
          component: () => import('@/views/customer-order/analysis-application/guest-application/print'),
          name: 'guestApplicationPrint',
          meta: {
            activeMenu: '/customer-order/analysis-application/guest-application',
            keepOrgin: true,
            noUseAuth: true, // 无需认证的路由
            title: '客样分析申请单'
          }
        },
        {
          path: 'guest-application/weaveTechPrint',
          hidden: true,
          component: () => import('@/views/customer-order/analysis-application/guest-application/weaveTechPrint'),
          name: 'weaveTechPrint',
          meta: {
            activeMenu: '/customer-order/analysis-application/guest-application',
            keepOrgin: true,
            noUseAuth: true, // 无需认证的路由
            title: '客样分析打印'
          }
        },
        {
          path: 'printing-application',
          name: 'PrintingApplication',
          component: () =>
            import('@/views/customer-order/printing-application/index.vue'),
          meta: {
            title: '印花SO申请',
            permitTag: 'soPrint:printApply:page'
          }
        },
        {
          path: 'printing-application/create',
          name: 'printingApplication-create',
          hidden: true,
          component: () =>
            import('@/views/customer-order/printing-application/detail/index.vue'),
          meta: {
            activeMenu: '/customer-order/printing-application',
            title: '印花SO申请新增',
            keepOrgin: true,
            noUseAuth: true
          }
        },
        {
          path: 'printing-application/detail/:id/show',
          name: 'printingApplication-detail',
          hidden: true,
          component: () =>
            import('@/views/customer-order/printing-application/detail/index.vue'),
          meta: {
            activeMenu: '/customer-order/printing-application',
            title: '印花SO申请详情',
            keepOrgin: true,
            noUseAuth: true
          }
        },
        {
          path: 'printing-application/detail/:id/edit',
          name: 'printingApplication-edit',
          hidden: true,
          component: () =>
            import('@/views/customer-order/printing-application/detail/index.vue'),
          meta: {
            activeMenu: '/customer-order/printing-application',
            title: '印花SO申请编辑',
            keepOrgin: true,
            noUseAuth: true
          }
        },
        {
          path: 'printing-application/detail/:id/copy',
          name: 'printingApplication-copy',
          hidden: true,
          component: () =>
            import('@/views/customer-order/printing-application/detail/index.vue'),
          meta: {
            activeMenu: '/customer-order/printing-application',
            title: '印花SO申请复制',
            keepOrgin: true,
            noUseAuth: true
          }
        },
        {
          path: 'printing-application/print',
          hidden: true,
          component: () => import('@/views/customer-order/printing-application/print.vue'),
          name: 'printingApplicationPrint',
          meta: {
            activeMenu: '/customer-order/printing-application',
            keepOrgin: true,
            noUseAuth: true, // 无需认证的路由
            title: '印花SO申请单打印'
          }
        },
        {
          path: 'swatches-application',
          name: 'SwatchesApplication',
          component: () =>
            import('@/views/customer-order/swatches-application/index.vue'),
          meta: {
            title: '色板申请',
            permitTag: 'customerOrder:colorModel:colorModelApply:page'
          }
        },
        {
          path: 'swatches-application/detail/:id/show',
          name: 'swatchesApplicationShow',
          hidden: true,
          component: () =>
            import('@/views/customer-order/swatches-application/detail/index.vue'),
          meta: {
            title: '色板申请详情',
            activeMenu: '/customer-order/swatches-application',
            // permitTag: 'soPrint:printApply:page'
            keepOrgin: true,
            noUseAuth: true
          }
        },
        {
          path: 'swatches-application/create',
          name: 'swatchesApplicationCreate',
          hidden: true,
          component: () => import('@/views/customer-order/swatches-application/detail/index.vue'),
          meta: {
            activeMenu: '/customer-order/swatches-application',
            keepOrgin: true,
            noUseAuth: true, // 无需认证的路由
            title: '色板申请新增'
          }
        },
        {
          path: 'swatches-application/detail/:id/edit',
          name: 'swatchesApplicationEdit',
          hidden: true,
          component: () => import('@/views/customer-order/swatches-application/detail/index.vue'),
          meta: {
            activeMenu: '/customer-order/swatches-application',
            keepOrgin: true,
            noUseAuth: true, // 无需认证的路由
            title: '色板申请编辑'
          }
        },
        {
          path: 'swatches-application/print',
          hidden: true,
          component: () => import('@/views/customer-order/swatches-application/print.vue'),
          name: 'swatchesApplicationPrint',
          meta: {
            activeMenu: '/customer-order/swatches-application',
            keepOrgin: true,
            noUseAuth: true, // 无需认证的路由
            title: '色板申请单打印'
          }
        }
      ]
    },
    {
      path: 'sample-orders',
      name: 'SampleOrders',
      component: () => import('@/views/customer-order/sample-orders/index'),
      meta: {
        title: '样板订单',
        // keepOrgin: true, // 保持自定义元数据信息
        // noUseAuth: true, // 无需认证的路由
        icon: 'excel',
        permitTag: 'customerOrder:modelDevelopOrder:page'// 认证标识
      }
    },
    {
      path: 'sample-orders/create',
      name: 'sampleOrders-create',
      hidden: true,
      component: () => import('@/views/customer-order/sample-orders/detail/index'),
      meta: {
        activeMenu: '/customer-order/sample-orders',
        title: '样板订单新增',
        keepOrgin: true, // 保持自定义元数据信息
        noUseAuth: true, // 无需认证的路由
        icon: 'excel'
        // permitTag: ''// 认证标识
      }
    },
    {
      path: 'sample-orders/detail/:id/show',
      name: 'sampleOrders-detail',
      hidden: true,
      component: () => import('@/views/customer-order/sample-orders/detail/index'),
      meta: {
        activeMenu: '/customer-order/sample-orders',
        title: '样板订单详情',
        keepOrgin: true, // 保持自定义元数据信息
        noUseAuth: true, // 无需认证的路由
        icon: 'excel'
        // permitTag: ''// 认证标识
      }
    },
    {
      path: 'sample-orders/detail/:id/edit',
      name: 'sampleOrders-edit',
      hidden: true,
      component: () => import('@/views/customer-order/sample-orders/detail/index'),
      meta: {
        activeMenu: '/customer-order/sample-orders',
        title: '样板订单编辑',
        keepOrgin: true, // 保持自定义元数据信息
        noUseAuth: true, // 无需认证的路由
        icon: 'excel'
        // permitTag: ''// 认证标识
      }
    },
    {
      path: 'goods-orders',
      name: 'GoodsOrders',
      component: () => import('@/views/customer-order/goods-orders/index'),
      meta: {
        title: '大货订单',
        // keepOrgin: true, // 保持自定义元数据信息
        // noUseAuth: true, // 无需认证的路由
        icon: 'excel',
        permitTag: 'customerOrder:saleOrder:page'
        // permitTag: ''// 认证标识
      }
    },
    {
      path: 'goods-orders/create',
      name: 'goods-orders-create',
      hidden: true,
      component: () => import('@/views/customer-order/goods-orders/detail/index'),
      meta: {
        activeMenu: '/customer-order/goods-orders',
        title: '大货订单新增',
        keepOrgin: true, // 保持自定义元数据信息
        noUseAuth: true, // 无需认证的路由
        icon: 'excel'
        // permitTag: ''// 认证标识
      }
    },
    {
      path: 'goods-orders/detail/:id/show',
      name: 'goods-orders-detail',
      hidden: true,
      component: () => import('@/views/customer-order/goods-orders/detail/index'),
      meta: {
        activeMenu: '/customer-order/goods-orders',
        title: '大货订单详情',
        keepOrgin: true, // 保持自定义元数据信息
        noUseAuth: true, // 无需认证的路由
        icon: 'excel'
        // permitTag: ''// 认证标识
      }
    },
    {
      path: 'goods-orders/detail/:id/edit',
      name: 'goods-orders-edit',
      hidden: true,
      component: () => import('@/views/customer-order/goods-orders/detail/index'),
      meta: {
        activeMenu: '/customer-order/goods-orders',
        title: '大货订单编辑',
        keepOrgin: true, // 保持自定义元数据信息
        noUseAuth: true, // 无需认证的路由
        icon: 'excel'
        // permitTag: ''// 认证标识
      }
    },
    {
      path: 'yarn-preparation',
      name: 'YarnPreparation',
      component: () => import('@/views/customer-order/yarn-preparation/list/index'),
      meta: {
        title: '备纱单',
        icon: 'excel',
        permitTag: 'customerOrder:yarnOrder:page'// 认证标识
      }
    },
    {
      path: 'yarn-preparation/create',
      name: 'yarnPreparation-create',
      hidden: true,
      component: () => import('@/views/customer-order/yarn-preparation/detail/index'),
      meta: {
        activeMenu: '/customer-order/yarn-preparation',
        title: '备纱单新增',
        keepOrgin: true, // 保持自定义元数据信息
        noUseAuth: true, // 无需认证的路由
        icon: 'excel'
        // permitTag: ''// 认证标识
      }
    },
    {
      path: 'yarn-preparation/detail/:id/show',
      name: 'yarnPreparation-detail',
      hidden: true,
      component: () => import('@/views/customer-order/yarn-preparation/detail/index'),
      meta: {
        activeMenu: '/customer-order/yarn-preparation',
        title: '备纱单详情',
        keepOrgin: true, // 保持自定义元数据信息
        noUseAuth: true, // 无需认证的路由
        icon: 'excel'
      }
    },
    {
      path: 'yarn-preparation/detail/:id/edit',
      name: 'yarnPreparation-edit',
      hidden: true,
      component: () => import('@/views/customer-order/yarn-preparation/detail/index'),
      meta: {
        activeMenu: '/customer-order/yarn-preparation',
        title: '备纱单编辑',
        keepOrgin: true, // 保持自定义元数据信息
        noUseAuth: true, // 无需认证的路由
        icon: 'excel'
      }
    },
    {
      path: 'preform-preparation-orders',
      name: 'PreformPreparationOrders',
      component: () => import('@/views/customer-order/preform-preparation-orders/list/index'),
      meta: {
        title: '备坯单',
        icon: 'excel',
        permitTag: 'customerOrder:greyOrder:page'// 认证标识
      }
    },
    {
      path: 'preform-preparation-orders/create',
      name: 'preform-preparation-orders-create',
      hidden: true,
      component: () => import('@/views/customer-order/preform-preparation-orders/detail/index'),
      meta: {
        activeMenu: '/customer-order/preform-preparation-orders',
        title: '新增备坯单',
        keepOrgin: true, // 保持自定义元数据信息
        noUseAuth: true, // 无需认证的路由
        icon: 'excel'
      }
    },
    {
      path: 'preform-preparation-orders/:id',
      name: 'preform-preparation-orders-detail',
      hidden: true,
      component: () => import('@/views/customer-order/preform-preparation-orders/detail/index'),
      meta: {
        activeMenu: '/customer-order/preform-preparation-orders',
        title: '备坯单详情',
        keepOrgin: true, // 保持自定义元数据信息
        noUseAuth: true, // 无需认证的路由
        icon: 'excel'
      }
    },
    {
      path: 'board-application',
      name: 'BoardApplication',
      component: () => import('@/views/customer-order/board-application/list/index'),
      meta: {
        title: '寄板申请',
        icon: 'excel',
        // activeMenu: '/customer-order/board-application',
        // keepOrgin: true, // 保持自定义元数据信息
        // noUseAuth: true // 无需认证的路由
        permitTag: 'customerOrder:cutSampleApply:page'// 认证标识
      }
    },
    {
      path: 'board-application/create',
      name: 'boardApplication-create',
      hidden: true,
      component: () => import('@/views/customer-order/board-application/detail/index'),
      meta: {
        title: '寄板新增',
        icon: 'excel',
        activeMenu: '/customer-order/board-application',
        keepOrgin: true, // 保持自定义元数据信息
        noUseAuth: true // 无需认证的路由
        // permitTag: 'customerOrder:greyOrder:page'// 认证标识
      }
    },
    {
      path: 'board-application/detail/:uuid/show',
      name: 'boardApplication-detail',
      hidden: true,
      component: () => import('@/views/customer-order/board-application/detail/index'),
      meta: {
        title: '寄板详情',
        icon: 'excel',
        activeMenu: '/customer-order/board-application',
        keepOrgin: true, // 保持自定义元数据信息
        noUseAuth: true // 无需认证的路由
        // permitTag: 'customerOrder:greyOrder:page'// 认证标识
      }
    },
    {
      path: 'board-application-list',
      name: 'BoardApplicationLis',
      component: () => import('@/views/customer-order/board-application/list/list'),
      meta: {
        title: '剪板管理',
        icon: 'excel',
        // activeMenu: '/customer-order/board-application',
        // keepOrgin: true, // 保持自定义元数据信息
        // noUseAuth: true // 无需认证的路由
        permitTag: 'customerOrder:cutSampleRecords:page'// 认证标识
      }
    },
    {
      path: 'board-application-labelPrint',
      name: 'boardApplicationLabelPrint',
      hidden: true,
      component: () => import('@/views/customer-order/board-application/list/labelPrint'),
      meta: {
        title: '标签打印',
        icon: 'excel',
        activeMenu: '/customer-order/board-application-list',
        keepOrgin: true, // 保持自定义元数据信息
        noUseAuth: true // 无需认证的路由
        // permitTag: 'customerOrder:greyOrder:page'// 认证标识
      }
    },
    {
      path: 'patching-orders',
      name: 'patching-orders',
      component: () => import('@/views/customer-order/patching-orders/index'),
      meta: {
        title: '补布单',
        // keepOrgin: true, // 保持自定义元数据信息
        // noUseAuth: true // 无需认证的路由
        permitTag: 'customerOrder:reissueOrder:page'
        // permitTag: ''// 认证标识
      }
    },
    {
      path: 'patching-orders/create',
      name: 'patching-orders-create',
      hidden: true,
      component: () => import('@/views/customer-order/patching-orders/detail/index'),
      meta: {
        activeMenu: '/customer-order/patching-orders',
        title: '补布单新增',
        keepOrgin: true, // 保持自定义元数据信息
        noUseAuth: true // 无需认证的路由
        // icon: 'excel'
        // permitTag: ''// 认证标识
      }
    },
    {
      path: 'patching-orders/detail/:id/show',
      name: 'patching-orders-detail',
      hidden: true,
      component: () => import('@/views/customer-order/patching-orders/detail/index'),
      meta: {
        activeMenu: '/customer-order/patching-orders',
        title: '补布单详情',
        keepOrgin: true, // 保持自定义元数据信息
        noUseAuth: true // 无需认证的路由
        // icon: 'excel'
        // permitTag: ''// 认证标识
      }
    },
    {
      path: 'patching-orders/detail/:id/edit',
      name: 'patching-orders-edit',
      hidden: true,
      component: () => import('@/views/customer-order/patching-orders/detail/index'),
      meta: {
        activeMenu: '/customer-order/patching-orders',
        title: '补布单编辑',
        keepOrgin: true, // 保持自定义元数据信息
        noUseAuth: true // 无需认证的路由
        // icon: 'excel'
        // permitTag: ''// 认证标识
      }
    }
  ]
}

export default customerOrder
