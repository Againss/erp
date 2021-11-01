import Layout from '@/layout'
import levelLayout from '@/layout/levelLayout'

const componentsRouter = {
  path: '/processing',
  name: 'processing',
  component: Layout,
  // redirect: 'noRedirect',
  alwaysShow: true,
  meta: {
    title: '加工管理',
    // icon: '',
    permitTag: 'pd'
  },
  children: [
    {
      path: 'yarn-dyeing',
      component: levelLayout,
      name: 'YarnDyeing',
      // redirect: '',
      alwaysShow: true,
      meta: {
        title: '染纱',
        permitTag: 'pd:dyeing'
      },
      children: [
        {
          path: 'demand',
          component: () => import('@/views/processing-manage/yarn-dyeing/demand/index.vue'),
          // component: () => import('@/views/processing-manage/yarn-dyeing-V1/demand/index.vue'),
          name: 'YarnDyeingDemand',
          meta: {
            noCache: true,
            title: '染纱需求',
            permitTag: 'pd:pdDyeingDemand:list'
          }
        },
        {
          path: 'order',
          component: () => import('@/views/processing-manage/yarn-dyeing/order/index.vue'),
          name: 'YarnDyeingOrder',
          meta: {
            title: '染纱订单',
            permitTag: 'pd:pdDyeingOrder:list'
          }
        },
        {
          path: 'order/print/:id',
          component: () => import('@/views/processing-manage/yarn-dyeing/order/print.vue'),
          name: 'YarnDyeingPrint',
          hidden: true,
          meta: {
            activeMenu: '/processing/yarn-dyeing/order',
            title: '打印预览',
            keepOrgin: true,
            noUseAuth: true
            // permitTag: 'pd:pdDyeingOrder:list'
          }
        },
        {
          path: 'requisition',
          component: () => import('@/views/processing-manage/yarn-dyeing/requisition/index.vue'),
          name: 'YarnDyeingRequisition',
          meta: {
            noCache: true,
            title: '原纱调拨通知单',
            permitTag: 'pd:pdDyeingAllotNotify:list'
          }
        },
        {
          path: 'feeding',
          component: () => import('@/views/processing-manage/yarn-dyeing/feeding/index.vue'),
          name: 'YarnDyeingFeeding',
          meta: {
            title: '送纱通知单',
            permitTag: 'pd:pdDyeingSendNotify:list'
          }
        },
        {
          path: 'feeding/detail',
          component: () => import('@/views/processing-manage/yarn-dyeing/feeding/detail.vue'),
          name: 'YarnDyeingDetail',
          hidden: true,
          meta: {
            noCache: true,
            title: '送纱通知单详情',
            keepOrgin: true,
            noUseAuth: true,
            activeMenu: '/processing/yarn-dyeing/feeding'
          }
        },
        {
          path: 'schedule',
          component: () => import('@/views/processing-manage/yarn-dyeing/schedule/index.vue'),
          name: 'YarnDyeingSchedule',
          meta: {
            title: '染纱生产进度',
            // keepOrgin: true,
            // noUseAuth: true,
            permitTag: 'pd:pdDyeingProductionSchedule:list'
          }
        }
      ]
    },
    {
      path: 'weaving',
      component: levelLayout,
      name: 'Weaving',
      // redirect: '',
      alwaysShow: true,
      meta: {
        title: '织布',
        // icon: ''
        permitTag: 'pd:knit'
      },
      children: [
        {
          path: 'demand',
          component: () => import('@/views/processing-manage/weaving/demand/index.vue'),
          name: 'WeavingDemand',
          meta: {
            noCache: true,
            title: '织布需求',
            permitTag: 'pd:pdKnitDemand:list'
          }
        },
        {
          path: 'orderDetails/:uuid',
          component: () => import('@/views/processing-manage/weaving/demand/orderDetails.vue'),
          hidden: true,
          name: 'orderDetails',
          meta: {
            activeMenu: '/processing-manage/weaving/demand',
            noCache: true,
            title: '织订单详情',
            keepOrgin: true,
            noUseAuth: true // 无需认证的路由
          }
        },
        {
          path: 'order',
          component: () => import('@/views/processing-manage/weaving/order/index.vue'),
          name: 'WeavingOrder',
          meta: {
            // noCache: true,
            title: '织布订单',
            permitTag: 'pd:pdKnitOrder:list'
          }
        },
        {
          path: 'print/:id',
          hidden: true,
          component: () => import('@/views/processing-manage/weaving/order/print.vue'),
          name: 'processing-manage-weaving-orderPrint',
          meta: {
            activeMenu: '/processing/weaving/order',
            keepOrgin: true,
            noUseAuth: true, // 无需认证的路由
            title: ' 织布通知单'
          }
        },
        {
          path: 'requisition',
          component: () => import('@/views/processing-manage/weaving/requisition/index.vue'),
          name: 'WeavingRequisition',
          meta: {
            noCache: true,
            title: '纱线调拨通知单',
            permitTag: 'pd:pdKnitAllotNotify:list'
          }
        },
        {
          path: 'delivery-requisition',
          component: () => import('@/views/processing-manage/weaving/delivery/index.vue'),
          name: 'WeavingDelivery',
          meta: {
            noCache: true,
            title: '送纱通知单',
            permitTag: 'pd:pdKnitSendNotify:list'
          }
        },
        {
          path: 'delivery-requisition/detail',
          component: () => import('@/views/processing-manage/weaving/delivery/detail.vue'),
          name: 'WeavingDeliveryDetail',
          hidden: true,
          meta: {
            noCache: true,
            title: '送纱通知单详情',
            keepOrgin: true,
            noUseAuth: true,
            activeMenu: '/processing/weaving/delivery-requisition'
            // permitTag: ''
          }
        },
        {
          path: 'schedule',
          component: () => import('@/views/processing-manage/weaving/schedule/index.vue'),
          name: 'WeavingSchedule',
          meta: {
            noCache: true,
            // keepOrgin: true,
            // noUseAuth: true,
            title: '织生产进度',
            permitTag: 'pd:knitProductionSchedule:list'
          }
        }
      ]
    },
    {
      path: 'dyeing',
      component: levelLayout,
      name: 'Dyeing',
      // redirect:'',
      alwaysShow: true,
      meta: {
        title: '染整',
        // icon: ''
        permitTag: 'pd:dye'
      },
      children: [
        {
          path: 'demand',
          component: () => import('@/views/processing-manage/dyeing/demand/index.vue'),
          name: 'DyeingDemand',
          meta: {
            noCache: true,
            title: '染整需求',
            permitTag: 'pd:pdDyeDemand:list'
          }
        },
        {
          path: 'order',
          component: () => import('@/views/processing-manage/dyeing/order/index.vue'),
          name: 'DyeingOrder',
          meta: {
            // noCache: true,
            title: '染整订单',
            permitTag: 'pd:pdDyeOrder:list'
          }
        },
        {
          path: 'requisition',
          component: () => import('@/views/processing-manage/dyeing/requisition/index.vue'),
          name: 'DyeingRequisition',
          meta: {
            noCache: true,
            title: '坯布调拨通知单',
            permitTag: 'pd:pdDyeAllotNotice:list'
          }
        },
        {
          path: 'schedule',
          component: () => import('@/views/processing-manage/dyeing/schedule/index.vue'),
          name: 'DyeingSchedule',
          meta: {
            title: '染整生产进度',
            // keepOrgin: true,
            // noUseAuth: true
            permitTag: 'pd:pdDyeProductionSchedule:list'
          }
        },
        {
          path: 'print',
          hidden: true,
          component: () => import('@/views/processing-manage/dyeing/order/print.vue'),
          name: 'processing-manage-dyeing-orderPrint',
          meta: {
            activeMenu: '/processing/dyeing/order',
            keepOrgin: true,
            noUseAuth: true, // 无需认证的路由
            title: ' 染整订单打印'
          }
        }
      ]
    },
    {
      path: 'printing',
      component: levelLayout,
      name: 'Printing',
      // redirect:'',
      alwaysShow: true,
      meta: {
        title: '印花',
        // icon: ''
        permitTag: 'pd:print'
      },
      children: [
        {
          path: 'demand',
          component: () => import('@/views/processing-manage/printing/demand/index.vue'),
          name: 'PrintingDemand',
          meta: {
            noCache: true,
            title: '印花需求',
            permitTag: 'pd:pdPrintDemand:list'
          }
        },
        {
          path: 'order',
          component: () => import('@/views/processing-manage/printing/order/index.vue'),
          name: 'PrintingOrder',
          meta: {
            noCache: true,
            title: '印花订单',
            permitTag: 'pd:pdPrintOrder:list'
          }
        },
        {
          path: 'print',
          hidden: true,
          component: () => import('@/views/processing-manage/printing/order/print.vue'),
          name: 'processing-manage-printing-orderPrint',
          meta: {
            activeMenu: '/processing-manage/printing/order',
            keepOrgin: true,
            noUseAuth: true, // 无需认证的路由
            title: ' 印花订单打印'
          }
        },
        {
          path: 'requisition',
          component: () => import('@/views/processing-manage/printing/requisition/index.vue'),
          name: 'PrintingRequisition',
          meta: {
            noCache: true,
            title: '色布调拨通知单',
            permitTag: 'pd:pdPrintAllotDetail:list'
          }
        },
        {
          path: 'schedule',
          component: () => import('@/views/processing-manage/printing/schedule/index.vue'),
          name: 'PrintingSchedule',
          meta: {
            title: '印花生产进度',
            // keepOrgin: true,
            // noUseAuth: true
            permitTag: 'pd:printProductionSchedule:list'
          }
        }
      ]
    }
  ]
}

export default componentsRouter
