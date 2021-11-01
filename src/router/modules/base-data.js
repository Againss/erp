import Layout from '@/layout'
import levelLayout from '@/layout/levelLayout'

const componentsRouter = {
  path: '/base-data',
  name: 'base-data',
  component: Layout,
  alwaysShow: true,
  redirect: 'noRedirect',
  meta: {
    title: '基础数据',
    icon: 'table',
    permitTag: 'baseData'
    // keepOrgin: true,
    // noUseAuth: true
  },
  children: [
    {
      path: 'reissue-setting',
      name: 'reissue-setting',
      component: () => import('@/views/base-data/reissue-setting/index.vue'),
      meta: {
        title: '复期设置',
        // keepOrgin: true, // 保持自定义元数据信息
        // noUseAuth: true, // 无需认证的路由
        // icon: 'excel',
        permitTag: 'baseData:baseDeliverySet:list'// 认证标识
      }
    },
    // {
    //   path: 'standard-process-flow',
    //   name: 'standard-process-flow',
    //   component: () => import('@/views/base-data/standard-process-flow/index.vue'),
    //   meta: {
    //     title: '标准工序流程',
    //     keepOrgin: true, // 保持自定义元数据信息
    //     noUseAuth: true, // 无需认证的路由
    //     icon: 'excel'
    //     // permitTag: ''// 认证标识
    //   }
    // },
    {
      path: 'loss-setting',
      name: 'loss-setting',
      component: levelLayout,
      meta: {
        title: '损耗设置',
        icon: 'config',
        permitTag: 'baseData:lossSetting'
        // keepOrgin: true,
        // noUseAuth: true
      },
      children: [
        {
          path: 'dye-yarn-wastage',
          name: 'dye-yarn-wastage',
          component: () => import('@/views/base-data/loss-setting/dye-yarn-wastage/index.vue'),
          meta: {
            title: '染纱损',
            permitTag: 'baseData:lossSetting:baseDyeYarnWastage:list'
            // keepOrgin: true,
            // noUseAuth: true
          }
        },
        {
          path: 'weave-yarn',
          name: 'weave-yarn',
          component: () => import('@/views/base-data/loss-setting/weave-yarn/index.vue'),
          meta: {
            title: '织损',
            permitTag: 'baseData:lossSetting:weaveLoss'
            // keepOrgin: true,
            // noUseAuth: true
          }
        },
        {
          path: 'dye-loss',
          name: 'dye-loss',
          component: () => import('@/views/base-data/loss-setting/dye-loss/index.vue'),
          meta: {
            title: '染损',
            permitTag: 'baseData:lossSetting:dyeLoss'
            // keepOrgin: true,
            // noUseAuth: true
          }
        },
        {
          path: 'print-loss',
          name: 'print-loss',
          component: () => import('@/views/base-data/loss-setting/print-loss/index.vue'),
          meta: {
            title: '印损',
            permitTag: 'baseData:lossSetting:printLoss'
            // keepOrgin: true,
            // noUseAuth: true
          }
        }
      ]
    },
    {
      path: 'quality-base-info',
      name: 'quality-base-info',
      component: levelLayout,
      meta: {
        title: '质量基础资料',
        icon: '通用基础数据-通用',
        // permitTag: 'soPrint:printProcessConf:page'
        keepOrgin: true,
        noUseAuth: true
      },
      children: [
        {
          path: 'yarn-testing-project',
          name: 'yarn-testing-project',
          component: () => import('@/views/base-data/quality-base-info/yarn-testing-project/index.vue'),
          meta: {
            title: '试纱项目',
            permitTag: 'baseData:qa:yarnTest'
            // keepOrgin: true,
            // noUseAuth: true
          }
        },
        {
          path: 'physical-survey-items',
          name: 'physical-survey-items',
          component: () => import('@/views/base-data/quality-base-info/physical-survey-items/index.vue'),
          meta: {
            title: '物测项目',
            // permitTag: 'baseData:qa:pysicalTest'
            keepOrgin: true,
            noUseAuth: true
          }
        },
        {
          path: 'raw-fabrics',
          name: 'raw-fabrics',
          component: () => import('@/views/base-data/quality-base-info/raw-fabrics/index.vue'),
          meta: {
            title: '坯布',
            permitTag: 'baseData:qa:greigeConfig:list'
            // keepOrgin: true,
            // noUseAuth: true
          }
        },
        {
          path: 'cloth-inspection',
          name: 'cloth-inspection',
          component: () => import('@/views/base-data/quality-base-info/finished-fabric/cloth-inspection/index.vue'),
          meta: {
            title: '成品布验布',
            permitTag: 'baseData:qa:finishedFabricInspection'
            // keepOrgin: true,
            // noUseAuth: true
          }
        },
        {
          path: 'item-testing',
          name: 'item-testing',
          component: () => import('@/views/base-data/quality-base-info/finished-fabric/item-testing/index.vue'),
          meta: {
            title: '成品布物测',
            permitTag: 'baseData:qa:finishedFabricPhysical'
            // keepOrgin: true,
            // noUseAuth: true
          }
        }
        // {
        //   path: 'finished-fabric',
        //   name: 'finished-fabric',
        //   component: levelLayout,
        //   meta: {
        //     title: '成品布',
        //     keepOrgin: true,
        //     noUseAuth: true
        //   },
        //   children: [
        //     {
        //       path: 'cloth-inspection',
        //       name: 'cloth-inspection',
        //       component: () => import('@/views/base-data/quality-base-info/finished-fabric/cloth-inspection/index.vue'),
        //       meta: {
        //         title: '成品布验布',
        //         // permitTag: 'baseData:qa:yarnTest'
        //         keepOrgin: true,
        //         noUseAuth: true
        //       }
        //     },
        //     {
        //       path: 'item-testing',
        //       name: 'item-testing',
        //       component: () => import('@/views/base-data/quality-base-info/finished-fabric/item-testing/index.vue'),
        //       meta: {
        //         title: '成品布物测',
        //         // permitTag: 'baseData:qa:pysicalTest'
        //         keepOrgin: true,
        //         noUseAuth: true
        //       }
        //     }

        //   ]
        // }
      ]
    },
    {
      path: 'printing-progress',
      name: 'printingProgress',
      component: () =>
        import('@/views/base-data/printing-progress/index.vue'),
      meta: {
        title: '印花进度',
        permitTag: 'soPrint:printProcessConf:page'
        // keepOrgin: true,
        // noUseAuth: true
      }
    },
    {
      path: 'color-palette',
      name: 'colorPalette',
      redirect: 'noRedirect',
      component: levelLayout,
      meta: {
        title: '色板',
        permitTag: 'customerOrder:colorModel'
        // keepOrgin: true,
        // noUseAuth: true
      },
      children: [
        {
          path: 'swatches-progress',
          name: 'swatchesProgress',
          component: () =>
            import('@/views/base-data/color-palette/swatches-progress'),
          meta: {
            title: '色板进度项目',
            permitTag: 'customerOrder:colorModel:colorModelScheduleConf:page'
            // keepOrgin: true,
            // noUseAuth: true
          }
        },
        {
          path: 'swatches-standard',
          name: 'swatchesStandard',
          component: () =>
            import('@/views/base-data/color-palette/swatches-stantard'),
          meta: {
            title: '色板标准',
            permitTag: 'customerOrder:colorModel:colorModelStandardConf:page'
            // keepOrgin: true,
            // noUseAuth: true
          }
        }
      ]
    },
    {
      path: 'weaving-technology',
      name: 'weaving-technology',
      component: () => import('@/views/base-data/weaving-technology/index.vue'),
      meta: {
        title: '织造工艺',
        permitTag: 'baseData:tmWeavingTech:page'

        // keepOrgin: true, // 保持自定义元数据信息
        // noUseAuth: true // 无需认证的路由
        // icon: 'excel'
        // permitTag: ''// 认证标识
      }
    },
    {
      path: 'dyeing-technology',
      name: 'dyeing-technology',
      component: () => import('@/views/base-data/dyeing-technology/index.vue'),
      meta: {
        title: '染整工艺',
        permitTag: 'baseData:tmDyeFinishTech:page'

        // keepOrgin: true, // 保持自定义元数据信息
        // noUseAuth: true // 无需认证的路由
        // icon: 'excel'
        // permitTag: ''// 认证标识
      }
    },
    {
      path: 'option-config',
      component: levelLayout,
      name: 'option-config',
      redirect: 'noRedirect',
      meta: {
        title: '选项配置',
        icon: 'component',
        permitTag: 'baseData:optionConfig:page'
        // keepOrgin: true, // 保持自定义元数据信息
        // noUseAuth: true // 无需认证的路由
      },
      children: [
        {
          path: 'config-list',
          component: () =>
            import('@/views/base-data/option-config/config-list/index.vue'),
          name: 'config-list',
          meta: {
            title: '选项配置',
            permitTag: 'baseData:optionConfig:page'
            // keepOrgin: true, // 保持自定义元数据信息
            // noUseAuth: true // 无需认证的路由
          }
        }
      ]
    },
    // 生产进度预警配置
    {
      path: 'production-schedule-warning',
      name: 'ProductionScheduleWarning',
      component: () =>
      import('@/views/base-data/production-schedule-warning/index.vue'),
      meta: {
        title: '生产进度预警配置',
        permitTag: 'baseData:pdProductionScheduleWarn:list'
        // keepOrgin: true, // 保持自定义元数据信息
        // noUseAuth: true // 无需认证的路由
      }
    }
  ]
}

export default componentsRouter
