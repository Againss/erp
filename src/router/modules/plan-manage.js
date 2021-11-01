/*
 * @Descripttion:
 * @Author: shujing
 * @Date: 2020-12-22 16:26:52
 * @LastEditors: admin
 * @LastEditTime: 2021-01-14 11:32:12
 */
/*
 * @Descripttion:
 * @Author: shujing
 * @Date: 2020-12-10 17:16:08
 * @LastEditors: shujing
 * @LastEditTime: 2020-12-23 15:25:07
 */
/** When your routing table is too long, you can split it into small modules **/

import Layout from '@/layout'
import levelLayout from '@/layout/levelLayout'

const componentsRouter = {
  path: '/plan-manage',
  component: Layout,
  redirect: 'noRedirect',
  name: 'plan-manage',
  alwaysShow: true,
  meta: {
    title: '计划管理',
    icon: '用户中心-员工管理',
    permitTag: 'aps-center'
    // noUseAuth: true,
    // keepOrgin: true
  },
  children: [
    {
      path: 'product-schedule',
      component: levelLayout,
      redirect: 'noRedirect',
      name: 'product-schedule',
      alwaysShow: true,
      // redirect: 'plan-manage/product-schedule/print-schedule',
      meta: {
        title: '生产进度',
        permitTag: 'aps'
        // keepOrgin: true,
        // noUseAuth: true
      },
      children: [
        {
          path: 'print-schedule',
          component: () =>
            import('@/views/plan-manage/product-schedule/print-schedule/index.vue'),
          name: 'printScheduleList',
          meta: {
            title: '印花SO生产进度',
            permitTag: 'soPrint:printProduceProgress:page'
            // keepOrgin: true,
            // noUseAuth: true

          }
        },
        {
          path: 'print-schedule/:id/:type/:factoryid/:antitype',
          hidden: true,
          component: () => import('@/views/plan-manage/product-schedule/print-schedule/detail'),
          name: 'printScheduleDetail',
          meta: {
            activeMenu: '/plan-manage/product-schedule/print-schedule',
            keepOrgin: true,
            noUseAuth: true, // 无需认证的路由
            title: '印花SO生产进度详情'
          }
        },
        {
          path: 'swatches-schedule',
          component: () =>
            import('@/views/plan-manage/swatches-schedule/index.vue'),
          name: 'swatchesSchedule',
          meta: {
            title: '色板生产进度',
            permitTag: 'aps-center:aps:colorModelSchedule:page'
            // keepOrgin: true,
            // noUseAuth: true

          }
        },
        {
          path: 'swatches-schedule/detail/:id/:type',
          hidden: true,
          component: () => import('@/views/plan-manage/swatches-schedule/detail'),
          name: 'swatchesScheduleDetail',
          meta: {
            activeMenu: '/plan-manage/product-schedule/swatches-schedule',
            keepOrgin: true,
            noUseAuth: true, // 无需认证的路由
            title: '色板生产进度详情'
          }
        }
      ]
    },
    {
      path: 'loss-list',
      component: () => import('@/views/plan-manage/loss-list/index.vue'),
      name: 'loss-list',
      meta: {
        title: '损耗列表',
        permitTag: 'aps-center:loss:page'
        // keepOrgin: true,
        // noUseAuth: true
      }
    },
    {
      path: 'loss-list/detail/:id/show',
      hidden: true,
      component: () => import('@/views/plan-manage/loss-list/loss-detail/index.vue'),
      props: route => ({ params: route.params }),
      name: 'lossList-detail',
      meta: {
        title: '损耗详情',
        activeMenu: '/plan-manage/loss-list',
        permitTag: 'aps-center:loss:info'
        // keepOrgin: true,
        // noUseAuth: true
      }
    },
    // {
    //   path: 'material-planning',
    //   component: () => import('@/views/plan-manage/material-planning/index.vue'),
    //   name: 'material-planning',
    //   meta: {
    //     title: '物料计划',
    //     permitTag: 'aps-center:materielPlan:page'
    //     // keepOrgin: true,
    //     // noUseAuth: true
    //   }
    // },
    {
      path: 'preparing-yarn-single-plans',
      component: levelLayout,
      name: 'preparing-yarn-single-plans',
      // redirect: 'preparing-yarn-single-plans/list/index.vue',
      // alwaysShow: true,
      meta: {
        title: '备纱单计划',
        permitTag: 'aps-center:yarnPlanOrder:page'
        // keepOrgin: true,
        // noUseAuth: true
      },
      children: [
        {
          path: 'index',
          component: () => import('@/views/plan-manage/preparing-yarn-single-plans/list/index.vue'),
          name: 'preparing-yarn-single-plans-index',
          // hidden: true,
          // alwaysShow: true,
          meta: {
            title: '备纱单计划',
            permitTag: 'aps-center:yarnPlanOrder:page'
            // keepOrgin: true,
            // noUseAuth: true
          }
        },
        {
          path: 'detail',
          component: () => import('@/views/plan-manage/preparing-yarn-single-plans/details/index.vue'),
          name: 'preparing-yarn-single-plans-detail',
          hidden: true,
          // alwaysShow: true,
          meta: {
            activeMenu: '/plan-manage/preparing-yarn-single-plans/index',
            title: '备纱单计划详情',
            // permitTag: 'aps-center:yarnPlanOrder:info'
            keepOrgin: true,
            noUseAuth: true
          }
        }
      ]
    },
    {
      path: 'grey-cloth',
      component: levelLayout,
      name: 'grey-cloth',
      redirect: 'grey-cloth/list/index.vue',
      // alwaysShow: true,
      meta: {
        title: '抽坯布',
        permitTag: 'aps:grayclothreduce:page'
        // keepOrgin: true,
        // noUseAuth: true
      },
      children: [
        {
          path: 'index',
          component: () => import('@/views/plan-manage/grey-cloth/list/index.vue'),
          name: 'grey-cloth-index',
          // hidden: true,
          // alwaysShow: true,
          meta: {
            title: '抽坯布',
            permitTag: 'aps:grayclothreduce:page'
            // keepOrgin: true,
            // noUseAuth: true
          }
        },
        {
          path: 'detail',
          component: () => import('@/views/plan-manage/grey-cloth/details/index.vue'),
          name: 'grey-cloth-detail',
          hidden: true,
          // alwaysShow: true,
          meta: {
            activeMenu: '/plan-manage/grey-cloth/index',
            title: '抽坯布详情',
            // permitTag: 'aps:grayclothreduce:info'
            keepOrgin: true,
            noUseAuth: true
          }
        }
      ]
    },
    {
      path: 'drawnwork',
      component: levelLayout,
      name: 'drawnwork',
      redirect: 'drawnwork/list/index.vue',
      // alwaysShow: true,
      meta: {
        title: '抽纱',
        permitTag: 'aps-center:grayYarn:page'
        // keepOrgin: true,
        // noUseAuth: true
      },
      children: [
        {
          path: 'index',
          component: () => import('@/views/plan-manage/drawnwork/list/index.vue'),
          name: 'drawnwork-index',
          // hidden: true,
          // alwaysShow: true,
          meta: {
            title: '抽纱',
            permitTag: 'aps-center:grayYarn:page'
            // keepOrgin: true,
            // noUseAuth: true
          }
        },
        {
          path: 'detail',
          component: () => import('@/views/plan-manage/drawnwork/details/index.vue'),
          name: 'drawnwork-detail',
          hidden: true,
          // alwaysShow: true,
          meta: {
            activeMenu: '/plan-manage/drawnwork/index',
            title: '抽纱详情',
            // permitTag: 'aps-center:grayYarn:info'
            keepOrgin: true,
            noUseAuth: true
          }
        }
      ]
    },
    {
      path: 'order-materials',
      component: () => import('@/views/plan-manage/order-materials/index.vue'),
      name: 'order-materials',
      meta: {
        title: '查看订单物料',
        permitTag: 'aps-center:materielPlanProcess:page'
        // keepOrgin: true,
        // noUseAuth: true
      }
    },
    {
      path: 'scheduling',
      component: () => import('@/views/plan-manage/scheduling/index.vue'),
      name: 'scheduling',
      meta: {
        title: '计划排期',
        permitTag: 'aps-center:planSchedule:unrepeat:page'
        // keepOrgin: true,
        // noUseAuth: true
      }
    },
    {
      path: 'demand-list',
      component: levelLayout,
      name: 'demand-list',
      // redirect: 'drawnwork/list/index.vue',
      alwaysShow: true,
      meta: {
        title: '需求列表',
        permitTag: 'aps-center:requireList'
        // keepOrgin: true,
        // noUseAuth: true
      },
      children: [
        {
          path: 'purchase-demand-list',
          component: () => import('@/views/plan-manage/demand-list/purchase-demand-list/index.vue'),
          name: 'purchase-demand-list',
          // hidden: true,
          // alwaysShow: true,
          meta: {
            title: '采购需求列表',
            permitTag: 'aps-center:requireList:purchaseRequire:page'
            // keepOrgin: true,
            // noUseAuth: true
          }
        },
        {
          path: 'production-demand-list',
          component: () => import('@/views/plan-manage/demand-list/production-demand-list/index.vue'),
          name: 'production-demand-list',
          // hidden: true,
          // alwaysShow: true,
          meta: {
            title: '生产需求列表',
            permitTag: 'aps-center:requireList:produceRequire:page'
            // keepOrgin: true,
            // noUseAuth: true
          }
        }
      ]
    },
    {
      path: 'convent-yarn-manage',
      component: () => import('@/views/plan-manage/convent-yarn-manage/index.vue'),
      name: 'convent-yarn-manage',
      // alwaysShow: true,
      meta: {
        title: '常规纱管理',
        permitTag: 'aps-center:generalYarn:list'
        // keepOrgin: true,
        // noUseAuth: true
      }
    },
    {
      path: 'general-yarn-purchase-request',
      component: levelLayout,
      name: 'general-yarn-purchase-request',
      // redirect: 'general-yarn-purchase-request/list/index.vue',
      // alwaysShow: true,
      meta: {
        title: '常规纱采购',
        permitTag: 'aps-center:purchaseGeneralYarn:page'
        // keepOrgin: true,
        // noUseAuth: true
      },
      children: [
        {
          path: 'index',
          component: () => import('@/views/plan-manage/general-yarn-purchase-request/list/index.vue'),
          name: 'general-yarn-purchase-request-index',
          // hidden: true,
          // alwaysShow: true,
          meta: {
            title: '常规纱采购',
            permitTag: 'aps-center:purchaseGeneralYarn:page'
            // keepOrgin: true,
            // noUseAuth: true
          }
        },
        {
          path: 'detail',
          component: () => import('@/views/plan-manage/general-yarn-purchase-request/details/index.vue'),
          name: 'general-yarn-purchase-request-detail',
          hidden: true,
          // alwaysShow: true,
          meta: {
            activeMenu: '/plan-manage/general-yarn-purchase-request/index',
            title: '常规纱采购详情',
            permitTag: 'aps-center:purchaseGeneralYarn:info'
            // keepOrgin: true,
            // noUseAuth: true
          }
        }
      ]
    },
    {
      path: 'gray-fabric-debit',
      component: levelLayout,
      name: 'gray-fabric-debit',
      // redirect: 'gray-fabric-debit/list/index.vue',
      // alwaysShow: true,
      meta: {
        title: '坯布借调',
        permitTag: 'aps:grayClothLoan:page'
        // keepOrgin: true,
        // noUseAuth: true
      },
      children: [
        {
          path: 'index',
          component: () => import('@/views/plan-manage/gray-fabric-debit/list/index.vue'),
          name: 'gray-fabric-debit-index',
          // hidden: true,
          // alwaysShow: true,
          meta: {
            title: '坯布借调',
            permitTag: 'aps:grayClothLoan:page'
            // keepOrgin: true,
            // noUseAuth: true
          }
        },
        {
          path: 'detail',
          component: () => import('@/views/plan-manage/gray-fabric-debit/details/index.vue'),
          name: 'gray-fabric-debit-detail',
          hidden: true,
          // alwaysShow: true,
          meta: {
            activeMenu: '/plan-manage/gray-fabric-debit/index',
            title: '坯布借调详情',
            // permitTag: 'aps-center:yarnPlanOrder:info'
            keepOrgin: true,
            noUseAuth: true
          }
        }
      ]
    }
    // {
    //   path: 'production-demand-list',
    //   component: () => import('@/views/plan-manage/production-demand-list/index.vue'),
    //   name: 'production-demand-list',
    //   meta: {
    //     title: '生产需求列表',
    //     permitTag: 'aps-center:requireList'
    //     // keepOrgin: true,
    //     // noUseAuth: true
    //   }
    // }
  ]
}

export default componentsRouter
