import Layout from '@/layout'
import levelLayout from '@/layout/levelLayout'

const componentsRouter = {
  path: '/capacity-center',
  component: Layout,
  name: 'capacity-center',
  meta: {
    title: '产能中心',
    icon: '',
    // keepOrgin: true,
    // noUseAuth: true,
    permitTag: 'bmpAps'
  },
  children: [
    {
      path: '/capacity-center/bmp-base-data',
      name: 'capacity-center-base-data',
      component: levelLayout,
      redirect: '/capacity-center/capacity-day/aps-print-day',
      meta: {
        permitTag: 'bmpAps:daysSetting',
        title: '生产天数设置',
        icon: 'form'
        // keepOrgin: true,
        // noUseAuth: true
      },
      children: [
        {
          path: '/capacity-center/capacity-day/aps-print-day',
          name: 'aps-print-day',
          component: () => import('@/views/capacity-center/capacity-day/aps-print-day/index.vue'),
          meta: {
            permitTag: 'bmpAps:apsPrintDay:page',
            title: '印花'
          // keepOrgin: true,
          // noUseAuth: true
          }
        },
        {
          path: '/capacity-center/capacity-day/aps-dye-day',
          name: 'aps-dye-day',
          component: () => import('@/views/capacity-center/capacity-day/aps-dye-day/index.vue'),
          meta: {
            permitTag: 'bmpAps:apsDyeDay:page',
            title: '染整'
          // keepOrgin: true,
          // noUseAuth: true
          }
        },
        {
          path: '/capacity-center/capacity-day/aps-knit-day',
          name: 'aps-knit-day',
          component: () => import('@/views/capacity-center/capacity-day/aps-knit-day/index.vue'),
          meta: {
            permitTag: 'bmpAps:apsKnitDay:page',
            title: '织布'
          // keepOrgin: true,
          // noUseAuth: true
          }
        },
        {
          path: '/capacity-center/capacity-day/aps-dyeing-yarn-day',
          name: 'aps-dyeing-yarn-day',
          component: () => import('@/views/capacity-center/capacity-day/aps-dyeing-yarn-day/index.vue'),
          meta: {
            permitTag: 'bmpAps:apsDyeingYarnDay:page',
            title: '染纱'
          // keepOrgin: true,
          // noUseAuth: true
          }
        },
        {
          path: '/capacity-center/capacity-day/aps-purchase-day',
          name: 'aps-purchase-day',
          component: () => import('@/views/capacity-center/capacity-day/aps-purchase-day/index.vue'),
          meta: {
            permitTag: 'bmpAps:apsPurchaseDay:general:page',
            title: '采购'
          // keepOrgin: true,
          // noUseAuth: true
          }
        }
      ]
    },
    {
      path: 'exhaust-settings',
      name: 'exhaust-settings',
      component: levelLayout,
      redirect: '/capacity-center/exhaust-settings/normal-LT-settings',
      alwaysShow: true,
      meta: {
        permitTag: 'bmpAps:ltset',
        title: '排期设置'
        // icon: 'form'
        // keepOrgin: true,
        // noUseAuth: true
      },
      children: [
        {
          path: 'normal-LT-settings',
          name: 'normal-LT-settings',
          component: () => import('@/views/capacity-center/exhaust-settings/normal-LT-settings/index.vue'),
          meta: {
            title: '正常LT设置',
            permitTag: 'bmpAps:ltset:normalLtSet'
            // keepOrgin: true,
            // noUseAuth: true
          }
        },
        {
          path: 'special--LT-settings',
          name: 'special--LT-settings',
          component: () => import('@/views/capacity-center/exhaust-settings/special--LT-settings/index.vue'),
          meta: {
            title: '特殊整理LT设置',
            permitTag: 'bmpAps:ltset:apsSpecialHandlerLtSet:page'
            // keepOrgin: true,
            // noUseAuth: true
          }
        },
        {
          path: 'holiday-settings',
          name: 'holiday-settings',
          component: () => import('@/views/capacity-center/exhaust-settings/holiday-settings/index.vue'),
          meta: {
            title: '节假日设置',
            permitTag: 'bmpAps:ltset:apsHolidaySet:page'
            // keepOrgin: true,
            // noUseAuth: true
          }
        },
        {
          path: 'operation-dictionary-table',
          name: 'operation-dictionary-table',
          component: () => import('@/views/capacity-center/exhaust-settings/operation-dictionary-table/index.vue'),
          meta: {
            title: '工序字典表',
            permitTag: 'bmpAps:ltset:apsProcessDic'
            // keepOrgin: true,
            // noUseAuth: true
          }
        },
        {
          path: 'calculate-constant-settings',
          name: 'calculate-constant-settings',
          component: () => import('@/views/capacity-center/exhaust-settings/calculate-constant-settings/index.vue'),
          meta: {
            title: '计算常数设置',
            permitTag: 'bmpAps:ltset:apsConstantSet:page'
            // keepOrgin: true,
            // noUseAuth: true
          }
        }
      ]
    }
  ]
}

export default componentsRouter
