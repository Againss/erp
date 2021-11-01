/** When your routing table is too long, you can split it into small modules **/

import Layout from '@/layout'
import levelLayout from '@/layout/levelLayout'

const componentsRouter = {
  path: '/basic-data',
  component: Layout,
  // redirect: 'noRedirect',
  name: 'basic-data-component',
  meta: {
    title: '基础数据',
    icon: 'list',
    permitTag: 'basic'
  },
  children: [
    {
      path: 'general-data',
      component: levelLayout,
      name: 'general-data',
      redirect: '/basic-data/general-data/country-area',
      alwaysShow: true,
      meta: {
        title: '通用',
        icon: 'component',
        permitTag: 'basic:Common'
      },
      children: [
        {
          path: 'country-area',
          component: () => import('@/views/basic-data/general-data/country-area/index.vue'),
          name: 'country-area',
          meta: {
            title: '国家/地区',
            permitTag: 'basic:countries:index'
          }
        },
        {
          path: 'province-area',
          component: () => import('@/views/basic-data/general-data/province-area/index.vue'),
          name: 'province-area',
          meta: {
            title: '省市区',
            permitTag: 'basic:areas:index'
          }
        },
        {
          path: 'harbour',
          component: () => import('@/views/basic-data/general-data/harbour/index.vue'),
          name: 'harbour',
          meta: {
            title: '港口',
            permitTag: 'basic:ports:index'
          }
        },
        {
          path: 'currency',
          component: () => import('@/views/basic-data/general-data/currency/index.vue'),
          name: 'currency',
          meta: {
            title: '币别',
            permitTag: 'basic:currencies:index'
          }
        },
        {
          path: 'payment',
          component: () => import('@/views/basic-data/general-data/payment/index.vue'),
          name: 'payment',
          meta: {
            title: '付款条件',
            permitTag: 'basic:paymentTerms:index'
          }
        },
        {
          path: 'price-terms',
          component: () => import('@/views/basic-data/general-data/price-terms/index.vue'),
          name: 'price-terms',
          meta: {
            title: '价格条款',
            permitTag: 'basic:priceTerms:index'
          }
        },
        {
          path: 'measurement',
          component: () => import('@/views/basic-data/general-data/measurement/index.vue'),
          name: 'measurement',
          meta: {
            title: '计量单位',
            permitTag: 'basic:units:index'
          }
        }
      ]
    },
    {
      path: 'products-data',
      component: levelLayout,
      redirect: '/basic-data/products-data/component-categories',
      name: 'products-data',
      alwaysShow: true,
      meta: {
        title: '产品',
        icon: 'component',
        permitTag: 'basic:Product'
      },
      children: [
        {
          path: 'component-categories',
          component: () =>
            import('@/views/basic-data/products-data/component-categories/index.vue'),
          name: 'component-categories',
          meta: {
            title: '成份大类',
            permitTag: 'basic:categories:index'
          }
        },
        {
          path: 'fabric-types',
          component: () =>
            import('@/views/basic-data/products-data/fabric-types/index.vue'),
          name: 'fabric-types',
          meta: {
            title: '面料大类',
            permitTag: 'basic:fabricCategory:index'
          }
        },
        {
          path: 'component-data',
          component: () =>
            import('@/views/basic-data/products-data/component-data/index.vue'),
          name: 'component-data',
          meta: {
            title: '成份',
            permitTag: 'basic:IngredientClassifications:index'
          }
        },
        {
          path: 'combined-components',
          component: () =>
            import('@/views/basic-data/products-data/combined-components/index.vue'),
          name: 'combined-components',
          meta: {
            title: '组合成份',
            permitTag: 'basic:assemblyIngredients:index'
          }
        },
        {
          path: 'yarn-attribute',
          component: () =>
            import('@/views/basic-data/products-data/yarn-attribute/index.vue'),
          name: 'yarn-attribute',
          meta: {
            title: '纱属性',
            permitTag: 'basic:yarnTypes:index'
          }
        },
        {
          path: 'cloth-attribute',
          component: () =>
            import('@/views/basic-data/products-data/cloth-attribute/index.vue'),
          name: 'cloth-attribute',
          meta: {
            title: '布属性',
            permitTag: 'basic:clothCategory:index'
          }
        },
        {
          path: 'weave-dyeStyle',
          component: () =>
            import('@/views/basic-data/products-data/weave-dyeStyle/index.vue'),
          name: 'weave-dyeStyle',
          meta: {
            title: '织染方式',
            permitTag: 'basic:knitDyes:index'
          }
        },
        {
          path: 'cloth-classification',
          component: () =>
            import('@/views/basic-data/products-data/cloth-classification/index.vue'),
          name: 'cloth-classification',
          meta: {
            title: '布类',
            permitTag: 'basic:cloths:index'
          }
        }
      ]
    },
    {
      path: 'product-process',
      component: levelLayout,
      name: 'product-process',
      redirect: 'noRedirect',
      alwaysShow: true,
      meta: {
        title: '生产工艺',
        icon: 'component',
        permitTag: 'basic:ProductionTechnology'
      },
      children: [
        {
          path: 'special-process',
          component: () =>
            import('@/views/basic-data/product-process/special-process/index.vue'),
          name: 'special-process',
          meta: {
            title: '工艺要求',
            permitTag: 'basic:requiredClassifications:index'
          }
        },
        {
          path: 'print-dyeing',
          component: () =>
            import('@/views/basic-data/product-process/print-dyeing/index.vue'),
          name: 'print-dyeing',
          meta: {
            title: '印染类型',
            permitTag: 'basic:printingDyeingType:index'
          }
        },
        {
          path: 'production-state',
          component: () =>
            import('@/views/basic-data/product-process/production-state/index.vue'),
          name: 'production-state',
          meta: {
            title: '生产状态',
            permitTag: 'basic:produceStates:index'
          }
        },
        {
          path: 'loom',
          component: () =>
            import('@/views/basic-data/product-process/loom/index.vue'),
          name: 'loom',
          meta: {
            title: '织机',
            permitTag: 'basic:loomBrands:index'
          }
        },
        {
          path: 'single-double',
          component: () =>
            import('@/views/basic-data/product-process/single-double/index.vue'),
          name: 'single-double',
          meta: {
            title: '染色类型',
            permitTag: 'basic:dyeType:index'
          }
        },
        {
          path: 'dye-composition',
          component: () =>
            import('@/views/basic-data/product-process/dye-composition/index.vue'),
          name: 'dye-composition',
          meta: {
            title: '染色成份',
            permitTag: 'basic:dyeIngredient:index'
          }
        },
        {
          path: 'process-flow',
          component: () =>
            import('@/views/basic-data/product-process/process-flow/index.vue'),
          name: 'process-flow',
          meta: {
            title: '工序流程',
            permitTag: 'basic:processFlow:index'
          }
        },
        {
          path: 'yarn-description',
          component: () =>
            import('@/views/basic-data/product-process/yarn-description/index.vue'),
          name: 'yarn-description',
          meta: {
            title: '纱长描述',
            permitTag: 'basic:YarnLengthDescription:index'
          }
        },
        {
          path: 'color-light',
          component: () =>
            import('@/views/basic-data/product-process/color-light/index.vue'),
          name: 'color-light',
          meta: {
            title: '对色光源',
            permitTag: 'basic:lightSources:index'
          }
        },
        {
          path: 'cloth-effect',
          component: () =>
            import('@/views/basic-data/product-process/cloth-effect/index.vue'),
          name: 'cloth-effect',
          meta: {
            title: '成品布面效果',
            permitTag: 'basic:finishedFabric:index'
          }
        },
        {
          path: 'drying-method',
          component: () =>
            import('@/views/basic-data/product-process/drying-method/index.vue'),
          name: 'drying-method',
          meta: {
            title: '干燥方式',
            permitTag: 'basic:dryingMethod:index'
          }
        },
        {
          path: 'breadth',
          component: () =>
            import('@/views/basic-data/product-process/breadth/index.vue'),
          name: 'breadth',
          meta: {
            title: '幅宽类型',
            permitTag: 'basic:fabricWidthType:index'
          }
        },
        {
          path: 'loss-classification',
          component: () =>
            import('@/views/basic-data/product-process/loss-classification/index.vue'),
          name: 'loss-classification',
          meta: {
            title: '损耗分类',
            permitTag: 'basic:wastageCategory:index'
          }
        },
        {
          path: 'soft-requirements',
          component: () =>
            import('@/views/basic-data/product-process/soft-requirements/index.vue'),
          name: 'soft-requirements',
          meta: {
            title: '制软要求',
            permitTag: 'basic:softMethod:index'
          }
        },
        {
          path: 'stand-process-flow',
          component: () =>
            import('@/views/basic-data/product-process/stand-process-flow/index.vue'),
          name: 'stand-process-flow',
          meta: {
            title: '标准工序流程',
            permitTag: 'basic:standardProcessFlow:index'
          }
        },
        {
          path: 'color-grade',
          component: () => import('@/views//basic-data/product-process/color-grade/list.vue'),
          name: 'colorGradeList',
          meta: {
            permitTag: 'basic:colorGrade:index',
            title: '色级'
          }
        }
      ]
    },
    {
      path: 'wms',
      component: levelLayout,
      name: 'wms',
      redirect: 'noRedirect',
      alwaysShow: true,
      meta: {
        title: '仓储物流',
        icon: 'component',
        permitTag: 'basic:Warehouse'
      },
      children: [
        {
          path: 'ts-way',
          component: () =>
            import('@/views/basic-data/wms/ts-way/index.vue'),
          name: 'ts-way',
          meta: {
            title: '运输方式',
            permitTag: 'basic:shipMethod:index'
          }
        }
      ]
    },
    {
      path: 'param-config',
      component: levelLayout,
      name: 'param-config',
      redirect: 'noRedirect',
      alwaysShow: true,
      meta: {
        title: '参数配置',
        icon: 'component',
        permitTag: 'basic:Parameter'
      },
      children: [
        {
          path: 'trade-types',
          component: () =>
            import('@/views/basic-data/param-config/trade-types/index.vue'),
          name: 'trade-types',
          meta: {
            title: '往来户类别',
            permitTag: 'basic:currentUser:index'
          }
        },
        {
          path: 'hs_code',
          component: () =>
            import('@/views/basic-data/param-config/hs_code/index.vue'),
          name: 'hs_code',
          meta: {
            title: 'HS Code',
            permitTag: 'basic:hsCode:index'
          }
        },
        {
          path: 'config-list',
          name: 'config-list',
          component: () =>
            import('@/views/basic-data/param-config/config_list/index.vue'),
          meta: {
            title: '选项配置',
            permitTag: 'basic:optionConfig:index'
          }
        }
      ]
    }
  ]
}

export default componentsRouter
