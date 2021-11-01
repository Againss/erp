/** When your routing table is too long, you can split it into small modules **/

import Layout from '@/layout'
import levelLayout from '@/layout/levelLayout'

const componentsRouter = {
  path: '/wms',
  component: Layout,
  name: 'wms',
  meta: {
    title: '仓库管理系统',
    icon: '仓储管理',
    permitTag: 'wms'
  },
  children: [
    {
      path: '/wms/enter-manage',
      component: levelLayout,
      name: 'enter-manage',
      meta: {
        permitTag: 'wms:stockIn',
        title: '入库管理',
        icon: 'table'
      },
      children: [
        {
          path: '/wms/enter-manage/booking-manage',
          name: 'booking-manage',
          component: () => import('@/views/wms/enter-manage/booking-manage'),
          meta: {
            permitTag: 'wms:stockIn:reservation:list',
            title: '预约单管理',
            icon: 'table'
          }
        },
        {
          path: '/wms/enter-manage/booking-manage/booking-details',
          name: 'booking-details',
          hidden: true,
          component: () => import('@/views/wms/enter-manage/booking-manage/booking-details'),
          meta: {
            permitTag: 'wms:stockIn:reservation:info',
            activeMenu: '/wms/enter-manage/booking-manage',
            title: '详情'
          }
        },
        {
          path: '/wms/enter-manage/booking-manage/start-receiving',
          name: 'start-receiving',
          hidden: true,
          component: () => import('@/views/wms/enter-manage/booking-manage/start-receiving'),
          meta: {
            activeMenu: '/wms/enter-manage/booking-manage',
            title: '开始收货',
            permitTag: 'wms:stockIn:reservation:complete'
          }
        },
        {
          path: '/wms/enter-manage/booking-manage/print-receiving-order',
          name: 'print-receiving-order',
          hidden: true,
          component: () => import('@/views/wms/enter-manage/booking-manage/print-receiving-order'),
          meta: {
            activeMenu: '/wms/enter-manage/booking-manage',
            title: '打印签收单',
            permitTag: 'wms:stockIn:reservation:printSignForm'
          }
        },
        {
          path: '/wms/enter-manage/booking-manage/print-sign-order',
          name: 'print-sign-order',
          hidden: true,
          component: () => import('@/views/wms/enter-manage/booking-manage/print-sign-order'),
          meta: {
            activeMenu: '/wms/enter-manage/booking-manage',
            title: '打印收货单',
            permitTag: 'wms:stockIn:reservation:printReceiptForm'
          }
        },
        {
          path: '/wms/enter-manage/booking-manage/print-post-code',
          name: 'print-post-code',
          hidden: true,
          component: () => import('@/views/wms/enter-manage/booking-manage/print-post-codeV1'),
          meta: {
            activeMenu: '/wms/enter-manage/booking-manage',
            title: '打印贴码',
            permitTag: 'wms:stockIn:reservation:printSerial'
          }
        },
        {
          path: '/wms/enter-manage/booking-manage/start-put-storage',
          name: 'start-put-storage',
          hidden: true,
          component: () => import('@/views/wms/enter-manage/booking-manage/start-put-storage'),
          meta: {
            activeMenu: '/wms/enter-manage/booking-manage',
            title: '其他入库',
            permitTag: 'wms:stockIn:reservation:other:submit'
          }
        },
        {
          path: '/wms/enter-manage/booking-manage/product-storage',
          name: 'product-storage',
          hidden: true,
          component: () => import('@/views/wms/enter-manage/booking-manage/product-storage'),
          meta: {
            activeMenu: '/wms/enter-manage/booking-manage',
            title: '生产入库',
            permitTag: 'wms:stockIn:reservation:production:submit'
          }
        },
        {
          path: '/wms/enter-manage/putup-manage',
          name: 'putup-manage',
          component: () => import('@/views/wms/enter-manage/putup-manage'),
          meta: {
            permitTag: 'wms:stockIn:shelf:list',
            title: '上架单管理',
            icon: 'table'
          }
        },
        {
          path: '/wms/enter-manage/putup-manage/putup-confirm',
          name: 'putup-confirm',
          hidden: true,
          component: () => import('@/views/wms/enter-manage/putup-manage/putup-confirm'),
          meta: {
            permitTag: 'wms:stockIn:shelf:complete',
            activeMenu: '/wms/enter-manage/putup-manage',
            title: '上架确认'
          }
        },
        {
          path: '/wms/enter-manage/putup-manage/details',
          name: 'putup-details',
          hidden: true,
          component: () => import('@/views/wms/enter-manage/putup-manage/details'),
          meta: {
            permitTag: 'wms:stockIn:shelf:info',
            activeMenu: '/wms/enter-manage/putup-manage',
            title: '详情'
          }
        },
        {
          path: '/wms/enter-manage/putup-manage/print-putup-order',
          name: 'print-putup-order',
          hidden: true,
          component: () => import('@/views/wms/enter-manage/putup-manage/print-putup-order'),
          meta: {
            permitTag: 'wms:stockIn:shelf:printShelf',
            activeMenu: '/wms/enter-manage/putup-manage',
            title: '打印上架单'
          }
        },
        {
          path: '/wms/enter-manage/incoming-manage',
          name: 'incoming-manage',
          component: () => import('@/views/wms/enter-manage/incoming-manage'),
          meta: {
            permitTag: 'wms:stockIn:form:list',
            title: '入库单管理',
            icon: 'table'
          }
        },
        {
          path: '/wms/enter-manage/incoming-manage/details',
          name: 'print-putup-order-details',
          hidden: true,
          component: () => import('@/views/wms/enter-manage/incoming-manage/details'),
          meta: {
            permitTag: 'wms:stockIn:form:info',
            activeMenu: '/wms/enter-manage/incoming-manage',
            title: '入库单管理-详情'
          }
        }
      ]
    },
    {
      path: 'out-manage',
      component: levelLayout,
      name: 'out-manage',
      redirect: '/out-manage/pre-delivery-order-manage',
      meta: {
        title: '出库管理',
        icon: 'component',
        permitTag: 'wms:stockOut'
      },
      children: [
        {
          path: 'pre-delivery-order-manage',
          component: () => import('@/views/wms/out-manage/pre-delivery-order-manage/index.vue'),
          name: 'pre-delivery-order-manage',
          meta: {
            title: '预出库单管理',
            permitTag: 'wms:stockOut:reservation:list'
          }
        },
        {
          path: 'pre-delivery-order-manage/detail/:id',
          component: () => import('@/views/wms/out-manage/pre-delivery-order-manage/detail.vue'),
          name: 'pre-delivery-order-manage-detail',
          hidden: true,
          meta: {
            title: '详情',
            permitTag: 'wms:stockOut:reservation:info',
            activeMenu: '/wms/out-manage/pre-delivery-order-manage'
          }
        },
        {
          path: 'picking-manage',
          component: () => import('@/views/wms/out-manage/picking-manage/index.vue'),
          name: 'picking-manage',
          meta: {
            title: '拣货单管理',
            permitTag: 'wms:stockOut:pick:list'
          }
        },
        {
          path: 'picking-manage/print/:id',
          component: () => import('@/views/wms/out-manage/picking-manage/printPicking.vue'),
          name: 'picking-manage-PrintPicking',
          hidden: true,
          meta: {
            title: '打印拣货单',
            permitTag: 'wms:stockOut:pick:printPickForm',
            activeMenu: '/wms/out-manage/picking-manage'
          }
        },
        {
          path: 'picking-manage/confirm/:id',
          component: () => import('@/views/wms/out-manage/picking-manage/confirm.vue'),
          name: 'picking-manage-confirm',
          hidden: true,
          meta: {
            title: '拣货确认',
            permitTag: 'wms:stockOut:pick:confirm',
            activeMenu: '/wms/out-manage/picking-manage'
          }
        },
        {
          path: 'picking-manage/detail/:id',
          component: () => import('@/views/wms/out-manage/picking-manage/detail.vue'),
          name: 'picking-manage-detail',
          hidden: true,
          meta: {
            title: '详情',
            permitTag: 'wms:stockOut:pick:info',
            activeMenu: '/wms/out-manage/picking-manage'
          }
        },
        {
          path: 'picking-manage/detail/:id/splitPrint',
          component: () => import('@/views/wms/out-manage/picking-manage/components/splitPrint.vue'),
          name: 'picking-manage-splitPrint',
          hidden: true,
          meta: {
            title: '批量打印',
            activeMenu: '/wms/out-manage/picking-manage',
            // 此处暂无权限
            keepOrgin: true,
            noUseAuth: true
          }
        },
        {
          path: 'warehouse-receipt-manage',
          component: () => import('@/views/wms/out-manage/warehouse-receipt-manage/index.vue'),
          name: 'warehouse-receipt-manage',
          meta: {
            title: '出库单管理',
            permitTag: 'wms:stockOut:form:list'
          }
        },
        {
          path: 'warehouse-receipt-manage/detail/:id',
          component: () => import('@/views/wms/out-manage/warehouse-receipt-manage/detail.vue'),
          name: 'warehouse-receipt-manage-detail',
          hidden: true,
          meta: {
            title: '详情',
            permitTag: 'wms:stockOut:form:info',
            activeMenu: '/wms/out-manage/warehouse-receipt-manage'
          }
        }
      ]
    },
    {
      path: 'inventory-manage',
      component: levelLayout,
      redirect: '/wms/inventory-manage/move-store',
      name: 'inventory-manage',
      alwaysShow: true,
      meta: {
        title: '库内管理',
        icon: 'component',
        permitTag: 'wms:stockInner'
      },
      children: [
        {
          path: 'move-store/index',
          component: () =>
            import('@/views/wms/inventory-manage/move-store/index'),
          name: 'move-store',
          meta: {
            permitTag: 'wms:inner:moveStock:list',
            title: '移库管理'
          }
        },
        {
          path: 'move-store/components/create',
          hidden: true,
          component: () => import('@/views/wms/inventory-manage/move-store/components/create'),
          name: 'moveCreate',
          meta: {
            permitTag: 'wms:inner:moveStock:add',
            activeMenu: '/wms/inventory-manage/move-store/index',
            title: '移库管理新增'
          }
        },
        {
          path: 'move-store/components/details',
          hidden: true,
          component: () => import('@/views/wms/inventory-manage/move-store/components/details'),
          name: 'moveStoreManagementDetails',
          meta: {
            permitTag: 'wms:inner:moveStock:info',
            activeMenu: '/wms/inventory-manage/move-store/index',
            title: '移库管理详情'
          }
        },
        {
          path: '/wms/inventory-manage/move-store/components/print',
          hidden: true,
          component: () => import('@/views/wms/inventory-manage/move-store/components/print'),
          name: 'moveStoreManagementPrint',
          meta: {
            activeMenu: '/wms/inventory-manage/move-store/index',
            title: '移库管理打印页面',
            permitTag: 'wms:inner:moveStock:print'
          }
        },
        {
          path: 'check-store/index',
          component: () =>
            import('@/views/wms/inventory-manage/check-store/index'),
          name: 'check-store',
          meta: {
            title: '盘点管理',
            permitTag: 'wms:inner:checkPlan:list'
          }
        },
        {
          path: 'check-store/components/create',
          hidden: true,
          component: () => import('@/views/wms/inventory-manage/check-store/components/create'),
          name: 'checkCreate',
          meta: {
            activeMenu: '/wms/inventory-manage/check-store/index',
            title: '新建盘点计划单',
            permitTag: 'wms:inner:checkPlan:add'
          }
        },
        {
          path: 'check-store/components/print',
          hidden: true,
          component: () => import('@/views/wms/inventory-manage/check-store/components/print'),
          name: 'checkStoreManagementPrint',
          meta: {
            activeMenu: '/wms/inventory-manage/check-store/index',
            title: '盘点管理打印页面',
            permitTag: 'wms:inner:checkPlan:print'
          }
        },
        {
          path: 'check-store/components/details',
          hidden: true,
          component: () => import('@/views/wms/inventory-manage/check-store/components/details.vue'),
          name: 'check-store-details',
          meta: {
            activeMenu: '/wms/inventory-manage/check-store/index',
            title: '盘点计划单详情',
            permitTag: 'wms:inner:checkPlan:info'
          }
        },
        {
          path: 'check-store/components/lossDetails',
          hidden: true,
          component: () => import('@/views/wms/inventory-manage/check-store/components/lossDetails.vue'),
          name: 'checkLossDetails',
          meta: {
            activeMenu: '/wms/inventory-manage/check-store/index',
            title: '盘亏单详情',
            permitTag: 'wms:inner:checkPlan:info'
          }
        },
        {
          path: 'check-store/components/profitDetails',
          hidden: true,
          component: () => import('@/views/wms/inventory-manage/check-store/components/profitDetails.vue'),
          name: 'checkprofitDetails',
          meta: {
            activeMenu: '/wms/inventory-manage/check-store/index',
            title: '盘盈单详情',
            permitTag: 'wms:inner:checkPlan:info'
          }
        },
        {
          path: 'check-store/components/makeCheck',
          hidden: true,
          component: () => import('@/views/wms/inventory-manage/check-store/components/makeCheck.vue'),
          name: 'check-details',
          meta: {
            activeMenu: '/wms/inventory-manage/check-store/index',
            title: '盘点确认页面',
            permitTag: 'wms:inner:checkPlan:confirm'
          }
        },
        {
          path: 'cutting-cloth/list',
          component: () => import('@/views/wms/inventory-manage/cutting-cloth/index.vue'),
          name: 'CuttingCloth',
          meta: {
            icon: '',
            title: '剪版管理',
            noCache: true,
            permitTag: 'wms:inner:cutCloth:list'
          }
        },
        {
          path: 'cutting-cloth/detail',
          hidden: true,
          component: () => import('@/views/wms/inventory-manage/cutting-cloth/detail.vue'),
          name: 'CuttingClothDetail',
          meta: {
            icon: '',
            activeMenu: '/wms/inventory-manage/cutting-cloth/list',
            title: '剪版管理详情',
            // noCache: true,
            permitTag: 'wms:inner:cutCloth:info'
          }
        },
        {
          path: 'cutting-cloth/print',
          hidden: true,
          component: () => import('@/views/wms/inventory-manage/cutting-cloth/print.vue'),
          name: 'CuttingClothPrint',
          meta: {
            icon: '',
            title: '剪版管理打印标签',
            activeMenu: '/wms/inventory-manage/cutting-cloth/list',
            permitTag: 'wms:inner:cutCloth:info'
          }
        }
      ]
    },
    {
      path: 'stock-manage',
      component: levelLayout,
      name: 'stock-manage',
      redirect: '/stock-manage/stock-manage',
      alwaysShow: true,
      meta: {
        title: '库存管理',
        icon: 'component',
        permitTag: 'wms:stock'
      },
      children: [
        {
          path: 'stock-manage/index',
          component: () => import('@/views/wms/stock-manage/stock-manage/index.vue'),
          name: 'stock-manage-index',
          meta: {
            title: '库存管理',
            permitTag: 'wms:stock:list'
          }
        },
        {
          path: 'stock-manage/components/details',
          hidden: true,
          component: () => import('@/views/wms/stock-manage/stock-manage/components/details.vue'),
          name: 'stockManageDetails',
          meta: {
            activeMenu: '/wms/stock-manage/stock-manage/index',
            permitTag: 'wms:stock:detail',
            title: '库存管理详情'
          }
        },
        {
          path: 'stock-manage/components/isLock/:type',
          hidden: true,
          component: () => import('@/views/wms/stock-manage/stock-manage/components/isLock.vue'),
          name: 'stockManageIsLock',
          meta: {
            activeMenu: '/wms/stock-manage/stock-manage/index',
            title: '库存管理锁定',
            permitTag: 'wms:stock:lock'
          }
        },
        {
          path: 'virtual-manage/index',
          component: () => import('@/views/wms/stock-manage/virtual-manage/index.vue'),
          name: 'virtual-manage-index',
          meta: {
            title: '虚拟库存',
            permitTag: 'wms:virtualStock:list'
          }
        },
        {
          path: 'virtual-manage/detail',
          component: () => import('@/views/wms/stock-manage/virtual-manage/detail.vue'),
          name: 'virtual-manage-detail',
          hidden: true,
          meta: {
            title: '虚拟库存详情',
            activeMenu: '/wms/stock-manage/virtual-manage/index',
            permitTag: 'wms:virtualStock:detail'
          }
        }
      ]
    },
    {
      path: 'report-manage',
      component: levelLayout,
      name: 'report-manage',
      redirect: '/report-manage/inventory-statistics',
      alwaysShow: true,
      meta: {
        title: '报表统计',
        icon: 'component',
        permitTag: 'wms:report'
      },
      children: [
        // 暂时不做
        // {
        //   path: 'inventory-statistics',
        //   component: () => import('@/views/wms/report-manage/inventory-statistics/index.vue'),
        //   name: 'inventory-statistics',
        //   meta: {
        //     title: '库存统计',
        //     permitTag: '',
        //     keepOrgin: true,
        //     noUseAuth: true
        //   }
        // },
        {
          path: 'outbound-statistics',
          component: () => import('@/views/wms/report-manage/outbound-statistics/index.vue'),
          name: 'outbound-statistics',
          meta: {
            title: '出库统计',
            permitTag: 'wms:report:stockOut:list'
          }
        },
        {
          path: 'library-statistics',
          component: () => import('@/views/wms/report-manage/library-statistics/index.vue'),
          name: 'library-statistics',
          meta: {
            title: '入库统计',
            permitTag: 'wms:report:stockIn:list'
          }
        }
      ]
    },
    {
      path: 'basis-data',
      component: levelLayout,
      redirect: '/wms/basis-data/store-data',
      name: 'basis-data',
      alwaysShow: true,
      meta: {
        title: '基础资料',
        icon: 'component',
        permitTag: 'wms:basis'
      },
      children: [
        {
          path: 'store-data',
          component: () =>
            import('@/views/wms/basis-data/store-data/index'),
          name: 'store-data',
          meta: {
            title: '仓库资料',
            permitTag: 'wms:warehouse:list'
          }
        },
        {
          path: 'area-data',
          component: () =>
            import('@/views/wms/basis-data/area-data/index'),
          name: 'area-data',
          meta: {
            title: '库区资料',
            permitTag: 'wms:warehouseArea:list'
          }
        },
        {
          path: 'shelf-data',
          component: () =>
            import('@/views/wms/basis-data/shelf-data/index'),
          name: 'shelf-data',
          meta: {
            title: '货架资料',
            permitTag: 'wms:warehouseShelf:list'
          }
        },
        {
          path: '/wms/basis-data/location-data/index',
          component: () =>
            import('@/views/wms/basis-data/location-data/index'),
          name: 'location-data',
          meta: {
            title: '库位资料',
            permitTag: 'wms:warehouseLocation:list'
          }
        },
        {
          path: 'location-data/components/details/:id',
          hidden: true,
          component: () => import('@/views/wms/basis-data/location-data/components/details'),
          name: 'move-create-details',
          meta: {
            activeMenu: '/wms/basis-data/location-data',
            title: '库位资料详情页面',
            permitTag: 'wms:warehouseLocation:info'
          }
        }
      ]
    }
  ]
}

export default componentsRouter
