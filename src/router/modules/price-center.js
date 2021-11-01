/** When your routing table is too long, you can split it into small modules **/

import Layout from '@/layout'
import levelLayout from '@/layout/levelLayout'

const componentsRouter = {
  path: '/price-center',
  component: Layout,
  name: 'price-center',
  alwaysShow: true,
  meta: {
    title: '价格中心',
    icon: 'list',
    permitTag: 'price'
  },
  children: [
    {
      path: '/price-offer',
      component: () => import('@/views/price-center/price-offer/index.vue'),
      name: 'price-offer',
      meta: {
        title: '报价工具',
        permitTag: 'price:quotationSheet:list'
      }
    },
    {
      path: '/price-offer/offer-details-page/:id/:codeid',
      name: 'offer-details-page',
      hidden: true,
      component: () => import('@/views/price-center/price-offer/offer-details-page/index.vue'),
      meta: {
        // permitTag: 'userCenter:sysAppSystem:list',
        title: '报价详情页',
        icon: 'table',
        activeMenu: '/price-offer',
        keepOrgin: true, // 保持自定义元数据信息
        noUseAuth: true // 无需认证的路由
      }
    },
    {
      path: '/price-offer/offer-add-edit-page/:id/:codeid?',
      name: 'offer-add-edit-page',
      hidden: true,
      component: () => import('@/views/price-center/price-offer/offer-add-edit-page/index.vue'),
      meta: {
        // permitTag: 'userCenter:sysAppSystem:list',
        title: '报价新增/编辑页',
        icon: 'table',
        activeMenu: '/price-offer',
        keepOrgin: true, // 保持自定义元数据信息
        noUseAuth: true // 无需认证的路由
      }
    },
    {
      path: '/price-offer/offer-add-edit-page',
      name: '1offer-add-edit-page',
      hidden: true,
      component: () => import('@/views/price-center/price-offer/offer-add-edit-page/index.vue'),
      meta: {
        // permitTag: 'userCenter:sysAppSystem:list',
        title: '报价新增/编辑页',
        icon: 'table',
        activeMenu: '/price-offer',
        keepOrgin: true, // 保持自定义元数据信息
        noUseAuth: true // 无需认证的路由
      }
    },
    {
      path: 'price-yarn',
      component: levelLayout,
      name: 'price-yarn',
      redirect: '/price-center/gauze-cost/yarn',
      alwaysShow: true,
      meta: {
        title: '纱成本',
        permitTag: 'price:yarn:costs'
      },
      children: [
        {
          path: 'yarn',
          component: () => import('@/views/price-center/gauze-cost/yarn'),
          name: 'yarn',
          meta: {
            title: '纱线',
            permitTag: 'price:yarn:list'
          }
        },
        {
          path: 'yarn-certificate',
          component: () => import('@/views/price-center/gauze-cost/yarn-certificate'),
          name: 'yarn-certificate',
          meta: {
            title: '纱线证书',
            permitTag: 'price:yarnCertInfo:list'
          }
        },
        {
          path: 'dyeing-yarn',
          component: () => import('@/views/price-center/gauze-cost/dyeing-yarn'),
          name: 'dyeing-yarn',
          meta: {
            title: '染纱',
            permitTag: 'price:dyedYarnInfo:list'
          }
        },
        {
          path: 'dyeing-yarn-loss',
          component: () => import('@/views/price-center/gauze-cost/dyeing-yarn-loss'),
          name: 'dyeing-yarn-loss',
          meta: {
            title: '染纱损耗',
            permitTag: 'price:dyedYarnLossInfo:list'
          }
        }
      ]
    },
    {
      path: 'material-cost',
      component: levelLayout,
      name: 'material-cost',
      redirect: '/price-center/material-cost/weaving-loss',
      alwaysShow: true,
      meta: {
        title: '原材料成本',
        permitTag: 'price:materials:costs'
      },
      children: [
        {
          path: 'weaving-loss',
          component: () => import('@/views/price-center/material-cost/weaving-loss'),
          name: 'weaving-loss',
          meta: {
            title: '织损耗',
            permitTag: 'price:wavenLossInfo:list'
          }
        }
      ]
    },
    {
      path: 'embryo-cost',
      component: levelLayout,
      name: 'embryo-cost',
      redirect: '/price-center/embryo-cost/weaving-loss',
      alwaysShow: true,
      meta: {
        title: '坯布成本',
        permitTag: 'price:fabric:costs'
      },
      children: [
        {
          path: 'weavers',
          component: () => import('@/views/price-center/embryo-cost/weavers'),
          name: 'weavers',
          meta: {
            title: '织工',
            permitTag: 'price:wovenTechInfo:list'
          }
        }
      ]
    },
    {
      path: 'produce-cost',
      component: levelLayout,
      name: 'produce-cost',
      redirect: '/price-center/produce-cost/dyeing',
      alwaysShow: true,
      meta: {
        title: '生产成本',
        permitTag: 'price:production:costs'
      },
      children: [
        {
          path: 'dyeing',
          component: () => import('@/views/price-center/produce-cost/dyeing'),
          name: 'dyeing',
          meta: {
            title: '染色工艺',
            permitTag: 'price:dyeingInfo:list'
          }
        },
        {
          path: 'dyeing-appended',
          component: () => import('@/views/price-center/produce-cost/dyeing-appended'),
          name: 'dyeing-appended',
          meta: {
            title: '染色附加',
            permitTag: 'price:dyeingAdditionalInfo:list'
          }
        },
        {
          path: 'dyeing-loss',
          component: () => import('@/views/price-center/produce-cost/dyeing-loss'),
          name: 'dyeing-loss',
          meta: {
            title: '染色损耗',
            permitTag: 'price:dyeingLossInfo:list'
          }
        },
        {
          path: 'arrange-loss',
          component: () => import('@/views/price-center/produce-cost/arrange-loss'),
          name: 'arrange-loss',
          meta: {
            title: '后整损耗',
            permitTag: 'price:afterfinishLoss:list'
          }
        },
        {
          path: 'function-loss',
          component: () => import('@/views/price-center/produce-cost/function-loss'),
          name: 'function-loss',
          meta: {
            title: '功能损耗',
            permitTag: 'price:functionLossInfo:list'
          }
        },
        {
          path: 'printing-process',
          component: () => import('@/views/price-center/produce-cost/printing-process'),
          name: 'printing-process',
          meta: {
            title: '印花工艺',
            permitTag: 'price:printingTechInfo:list'
          }
        },
        {
          path: 'printing-certificate',
          component: () => import('@/views/price-center/produce-cost/printing-certificate'),
          name: 'printing-certificate',
          meta: {
            title: '印花证书',
            permitTag: 'price:printingCertInfo:list'
          }
        },
        {
          path: 'printing-additional',
          component: () => import('@/views/price-center/produce-cost/printing-additional'),
          name: 'printing-additional',
          meta: {
            title: '印花附加',
            permitTag: 'price:printingAdditionalInfo:list'
          }
        },
        {
          path: 'printing-loss',
          component: () => import('@/views/price-center/produce-cost/printing-loss'),
          name: 'printing-loss',
          meta: {
            title: '印花损耗',
            permitTag: 'price:printingLossInfo:list'
          }
        }
      ]
    },
    {
      path: 'finance-cost',
      component: levelLayout,
      name: 'finance-cost',
      redirect: '/price-center/finance-cost/payment-method',
      alwaysShow: true,
      meta: {
        title: '财务成本',
        permitTag: 'price:financial:costs'
      },
      children: [
        {
          path: 'payment-method',
          component: () => import('@/views/price-center/finance-cost/payment-method'),
          name: 'payment-method',
          meta: {
            title: '付款条件',
            permitTag: 'price:paymentMethod:list'
          }
        }
      ]
    },
    {
      path: 'transport-cost',
      component: levelLayout,
      name: 'transport-cost',
      redirect: '/price-center/transport-cost/freight',
      alwaysShow: true,
      meta: {
        title: '运输成本',
        permitTag: 'price:freight:costs'
      },
      children: [
        {
          path: 'freight',
          component: () => import('@/views/price-center/transport-cost/freight'),
          name: 'freight',
          meta: {
            title: '运费',
            permitTag: 'price:freight:list'
          }
        }
      ]
    },
    {
      path: 'test-cost',
      component: levelLayout,
      name: 'test-cost',
      redirect: '/price-center/test-cost/test-mode',
      alwaysShow: true,
      meta: {
        title: '测试成本',
        permitTag: 'price:test:costs'
      },
      children: [
        {
          path: 'test-mode',
          component: () => import('@/views/price-center/test-cost/test-mode'),
          name: 'test-mode',
          meta: {
            title: '测试方式',
            permitTag: 'price:testCost:list'
          }
        }
      ]
    },
    {
      path: 'profit',
      component: levelLayout,
      name: 'profit',
      redirect: '/price-center/profit/area',
      alwaysShow: true,
      meta: {
        title: '销售利润',
        permitTag: 'price:profit:costs'
      },
      children: [
        {
          path: 'area',
          component: () => import('@/views/price-center/profit/area'),
          name: 'area',
          meta: {
            title: '国家/地区',
            permitTag: 'price:profit:list'
          }
        }
      ]
    },
    {
      path: 'option-config',
      component: levelLayout,
      name: 'price-option-config',
      redirect: '/price-center/option-config/area',
      alwaysShow: true,
      meta: {
        title: '选项配置',
        permitTag: 'price:option:setting'
      },
      children: [
        {
          path: 'notarization',
          component: () => import('@/views/price-center/option-config/notarization'),
          name: 'notarization',
          meta: {
            title: '公证行',
            permitTag: 'price:notaryIndustry:list'
          }
        },
        {
          path: 'config-yarn-certificate',
          component: () => import('@/views/price-center/option-config/yarn-certificate'),
          name: 'config-yarn-certificate',
          meta: {
            title: '纱线证书选项',
            permitTag: 'price:yarnCertificateOption:list'
          }
        },
        {
          path: 'stamp-certificate',
          component: () => import('@/views/price-center/option-config/stamp-certificate'),
          name: 'stamp-certificate',
          meta: {
            title: '印花证书选项',
            permitTag: 'price:printingCertificateOption:list'
          }
        },
        {
          path: 'gauze-grade',
          component: () => import('@/views/price-center/option-config/gauze-grade'),
          name: 'gauze-grade',
          meta: {
            title: '布类等级',
            permitTag: 'price:fabricGrade:list'
          }
        },
        {
          path: 'loss-color',
          component: () => import('@/views/price-center/option-config/loss-color'),
          name: 'loss-color',
          meta: {
            title: '染纱/损耗颜色',
            permitTag: 'price:dyeYarnLossColor:list'
          }
        },
        {
          path: 'loss-color-serious',
          component: () => import('@/views/price-center/option-config/loss-color-serious'),
          name: 'loss-color-serious',
          meta: {
            title: '染整/损耗颜色深浅',
            permitTag: 'price:dyeFinishLossColorShade:list'
          }
        },
        {
          path: 'cost-share',
          component: () => import('@/views/price-center/option-config/cost-share'),
          name: 'cost-share',
          meta: {
            title: '成分占比',
            permitTag: 'price:componentRate:list'
          }
        },
        {
          path: 'test-standard',
          component: () => import('@/views/price-center/option-config/test-standard'),
          name: 'test-standard',
          meta: {
            title: '测试标准',
            permitTag: 'price:testStandard:list'
          }
        },
        {
          path: 'supplier-color',
          component: () => import('@/views/price-center/option-config/supplier-color'),
          name: 'supplier-color',
          meta: {
            title: '供应商色号',
            keepOrgin: true,
            noUseAuth: true
          }
        },
        {
          path: 'yarn-brand',
          component: () => import('@/views/price-center/option-config/yarn-brand'),
          name: 'yarn-brand',
          meta: {
            title: '纱线品牌',
            keepOrgin: true,
            noUseAuth: true
          }
        }
      ]
    },
    {
      path: 'against-config',
      component: levelLayout,
      name: 'against-config',
      redirect: '/price-center/against-config/against-list',
      alwaysShow: true,
      meta: {
        title: '汇率配置',
        permitTag: 'price:rate:setting'
      },
      children: [
        {
          path: 'against-list',
          component: () => import('@/views/price-center/against-config/against-list'),
          name: 'against-list',
          meta: {
            title: '汇率',
            permitTag: 'price:exchangeRate:list'
          }
        }
      ]
    }
    // 销售报价二级菜单去掉
    // {
    //   path: '/price-offer',
    //   component: levelLayout,
    //   name: 'price-offer',
    //   redirect: '/price-offer/against-list',
    //   alwaysShow: true,
    //   meta: {
    //     title: '销售报价',
    //     // keepOrgin: true, // 保持自定义元数据信息
    //     // noUseAuth: true // 无需认证的路由
    //     permitTag: 'price:sell:quotationSheet'
    //   },
    //   children: [
    //     {
    //       path: 'offer-list',
    //       component: () => import('@/views/price-center/price-offer/index.vue'),
    //       name: 'offer-list',
    //       meta: {
    //         title: '报价工具',
    //         // keepOrgin: true, // 保持自定义元数据信息
    //         // noUseAuth: true // 无需认证的路由
    //         permitTag: 'price:quotationSheet:list'
    //       }
    //     },
    //     {
    //       path: 'offer-details-page/:id/:codeid',
    //       name: 'offer-details-page',
    //       hidden: true,
    //       component: () => import('@/views/price-center/price-offer/offer-details-page/index.vue'),
    //       meta: {
    //         // permitTag: 'userCenter:sysAppSystem:list',
    //         title: '报价详情页',
    //         icon: 'table',
    //         activeMenu: '/price-offer/index',
    //         keepOrgin: true, // 保持自定义元数据信息
    //         noUseAuth: true // 无需认证的路由
    //       }
    //     },
    //     {
    //       path: 'offer-add-edit-page/:id/:codeid?',
    //       name: 'offer-add-edit-page',
    //       hidden: true,
    //       component: () => import('@/views/price-center/price-offer/offer-add-edit-page/index.vue'),
    //       meta: {
    //         // permitTag: 'userCenter:sysAppSystem:list',
    //         title: '报价新增/编辑页',
    //         icon: 'table',
    //         activeMenu: '/price-offer/index',
    //         keepOrgin: true, // 保持自定义元数据信息
    //         noUseAuth: true // 无需认证的路由
    //       }
    //     },
    //     {
    //       path: 'offer-add-edit-page',
    //       name: '1offer-add-edit-page',
    //       hidden: true,
    //       component: () => import('@/views/price-center/price-offer/offer-add-edit-page/index.vue'),
    //       meta: {
    //         // permitTag: 'userCenter:sysAppSystem:list',
    //         title: '报价新增/编辑页',
    //         icon: 'table',
    //         activeMenu: '/price-offer/index',
    //         keepOrgin: true, // 保持自定义元数据信息
    //         noUseAuth: true // 无需认证的路由
    //       }
    //     }
    //   ]
    // }

  ]
}

export default componentsRouter
