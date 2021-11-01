/** When your routing table is too long, you can split it into small modules **/

import Layout from '@/layout'
import levelLayout from '@/layout/levelLayout'

// SPU管理三级菜单
const spuManagement = [
  {
    path: 'list',
    component: () => import('@/views/product-center/spu-management/spu-list/list'),
    name: 'SpuManagementList',
    meta: {
      title: 'SPU列表',
      permitTag: 'catalog:Api:Spu:ProductSpu:index'
    }
  },
  {
    path: 'list/create',
    component: () => import('@/views/product-center/spu-management/spu-list/create'),
    name: 'SpuManagementCreate',
    hidden: true,
    meta: {
      noCache: true,
      title: 'SPU添加',
      activeMenu: '/product-center/spu-management/list',
      permitTag: 'catalog:Api:Spu:ProductSpu:store'
    }
  },
  {
    path: 'list/spu-import',
    component: () => import('@/views/product-center/spu-management/spu-list/spu-import'),
    name: 'SpuManagementImport',
    hidden: true,
    meta: {
      noCache: true,
      title: '批量导入',
      activeMenu: '/product-center/spu-management/list',
      permitTag: 'catalog:Api:Spu:ProductSpu:import'
    }
  }
]
// 色布
const newcolourManagement = [
  {
    path: 'color-cloth',
    component: () => import('@/views/product-center/product-management/new-color-cloth/list'),
    name: 'ColourClothList',
    meta: {
      title: '色布列表',
      permitTag: 'catalog:Api:Cloth:ClothProductFabricMain:index'
    }
  },
  {
    path: 'color-cloth/create',
    component: () => import('@/views/product-center/product-management/new-color-cloth/create'),
    name: 'ColourClothCreate',
    hidden: true,
    meta: {
      noCache: true,
      title: '色布新增',
      activeMenu: '/product-center/product-management/color-cloth',
      permitTag: 'catalog:Api:Cloth:ClothProductFabricMain:store'
    }
  },
  {
    path: 'color-cloth/show/:id',
    component: () => import('@/views/product-center/product-management/new-color-cloth/create'),
    name: 'ColourClothUpdate',
    hidden: true,
    meta: {
      noCache: true,
      title: '色布编辑',
      activeMenu: '/product-center/product-management/color-cloth',
      permitTag: 'catalog:Api:Cloth:ClothProductFabricMain:update'
    }
  },
  {
    path: 'color-cloth/is-show/:id',
    component: () => import('@/views/product-center/product-management/new-color-cloth/create'),
    name: 'ColourClothShow',
    hidden: true,
    meta: {
      noCache: true,
      title: '色布详情',
      activeMenu: '/product-center/product-management/color-cloth',
      permitTag: 'catalog:Api:Cloth:ClothProductFabricMain:show'
    }
  },
  {
    path: 'color-cloth/import',
    component: () => import('@/views/product-center/product-management/new-color-cloth/import'),
    name: 'ColourClothImport',
    hidden: true,
    meta: {
      noCache: true,
      title: '批量导入',
      activeMenu: '/product-center/product-management/color-cloth',
      permitTag: 'catalog:Api:Cloth:ClothProductFabricMain:import'
    }
  }
]
// 花布
const flowerManagement = [
  {
    path: 'flower-cloth',
    component: () => import('@/views/product-center/product-management/flower-cloth/list'),
    name: 'FlowerClothList',
    meta: {
      title: '花布列表',
      permitTag: 'catalog:Api:Cloth:ClothFlowerFabricMain:index'
      // keepOrgin: true, // 保持自定义元数据信息
      // noUseAuth: true // 无需认证的路由
    }
  },
  {
    path: 'flower-cloth/create',
    component: () => import('@/views/product-center/product-management/flower-cloth/create'),
    name: 'flowerClothCreate',
    hidden: true,
    meta: {
      noCache: true,
      title: '花布新增',
      activeMenu: '/product-center/product-management/flower-cloth',
      permitTag: 'catalog:Api:Cloth:ClothFlowerFabricMain:store'
      // keepOrgin: true, // 保持自定义元数据信息
      // noUseAuth: true // 无需认证的路由
    }
  },
  {
    path: 'flower-cloth/show/:id',
    component: () => import('@/views/product-center/product-management/flower-cloth/create'),
    name: 'flowerClothUpdate',
    hidden: true,
    meta: {
      noCache: true,
      title: '花布编辑',
      activeMenu: '/product-center/product-management/flower-cloth',
      permitTag: 'catalog:Api:Cloth:ClothFlowerFabricMain:update'
    }
  },
  {
    path: 'flower-cloth/is-show/:id',
    component: () => import('@/views/product-center/product-management/flower-cloth/create'),
    name: 'flowerClothShow',
    hidden: true,
    meta: {
      noCache: true,
      title: '花布详情',
      activeMenu: '/product-center/product-management/flower-cloth',
      permitTag: 'catalog:Api:Cloth:ClothFlowerFabricMain:show'
    }
  },
  {
    path: 'flower-cloth/import',
    component: () => import('@/views/product-center/product-management/flower-cloth/import'),
    name: 'flowerClothImport',
    hidden: true,
    meta: {
      noCache: true,
      title: '批量导入',
      activeMenu: '/product-center/product-management/flower-cloth',
      permitTag: 'catalog:Api:Cloth:ClothFlowerFabricMain:import'
      // keepOrgin: true, // 保持自定义元数据信息
      // noUseAuth: true // 无需认证的路由
    }
  }
]
// 复合布
const compositeManagement = [
  {
    path: 'composite-cloth',
    component: () => import('@/views/product-center/product-management/composite-cloth/list'),
    name: 'CompositeClothList',
    meta: {
      title: '复合布列表',
      permitTag: 'catalog:Api:Cloth:ClothCombineFabric:index'
    }
  },
  {
    path: 'composite-cloth/create',
    component: () => import('@/views/product-center/product-management/composite-cloth/create'),
    name: 'compositeClothCreate',
    hidden: true,
    meta: {
      noCache: true,
      title: '复合布新增',
      permitTag: 'catalog:Api:Cloth:ClothCombineFabric:store',
      activeMenu: '/product-center/product-management/composite-cloth'
    }
  },
  {
    path: 'composite-cloth/show/:id',
    component: () => import('@/views/product-center/product-management/composite-cloth/create'),
    name: 'compositeClothShow',
    hidden: true,
    meta: {
      noCache: true,
      title: '复合布编辑',
      permitTag: 'catalog:Api:Cloth:ClothCombineFabric:update',
      activeMenu: '/product-center/product-management/composite-cloth'

    }
  },
  {
    path: 'composite-cloth/is-show/:id',
    component: () => import('@/views/product-center/product-management/composite-cloth/create'),
    name: 'compositeClothShow1',
    hidden: true,
    meta: {
      noCache: true,
      title: '复合布查看',
      permitTag: 'catalog:Api:Cloth:ClothCombineFabric:show',
      activeMenu: '/product-center/product-management/composite-cloth'

    }
  }
]
// 坯布
const greyManagement = [
  {
    path: 'grey-cloth',
    component: () => import('@/views/product-center/product-management/grey-cloth/list'),
    name: 'GreyClothList',
    meta: {
      title: '坯布列表',
      permitTag: 'catalog:Api:Cloth:Embryo:index'
    }
  },
  {
    path: 'grey-cloth/show/:id',
    component: () => import('@/views/product-center/product-management/grey-cloth/detail'),
    name: 'greyClothDtails',
    hidden: true,
    meta: {
      noCache: true,
      title: '坯布编辑',
      permitTag: 'catalog:Api:Cloth:Embryo:update',
      activeMenu: '/product-center/product-management/grey-cloth'

    }
  },
  {
    path: 'grey-cloth/is-show/:id',
    component: () => import('@/views/product-center/product-management/grey-cloth/detail'),
    name: 'greyClothDtails1',
    hidden: true,
    meta: {
      noCache: true,
      title: '坯布详情',
      permitTag: 'catalog:Api:Cloth:Embryo:show',
      activeMenu: '/product-center/product-management/grey-cloth'
    }
  },
  {
    path: 'grey-cloth/show',
    component: () => import('@/views/product-center/product-management/grey-cloth/detail'),
    name: 'greyClothCreate',
    hidden: true,
    meta: {
      noCache: true,
      title: '坯布新增',
      permitTag: 'catalog:Api:Cloth:Embryo:store',
      activeMenu: '/product-center/product-management/grey-cloth'
    }
  },
  {
    path: 'grey-cloth/grey-cloth-import',
    component: () => import('@/views/product-center/product-management/grey-cloth/grey-cloth-import'),
    name: 'greyClothImport',
    // name: 'greyManagementImport',
    hidden: true,
    meta: {
      noCache: true,
      title: '坯布批量导入',
      activeMenu: '/product-center/product-management/grey-cloth',
      permitTag: 'catalog:Api:Cloth:Embryo:import'
    }
  }
]
// 数据配置
const basicData = [
  {
    path: 'range-of-yarn-width/index',
    component: () => import('@/views/product-center/basic-data/range-of-yarn-width/index'),
    name: 'rangeOfYarnWidth',
    meta: {
      noCache: true,
      title: '幅宽区间',
      permitTag: 'catalog:Api:Range:fabricWidth:index'
    }
  },
  {
    path: 'range-of-yarn-weight/index',
    component: () => import('@/views/product-center/basic-data/range-of-yarn-weight/index'),
    name: 'rangeOfYarnWeight',
    meta: {
      noCache: true,
      title: '克重区间',
      permitTag: 'catalog:Api:Range:fabricWeight:index'
    }
  },
  {
    path: 'range-of-yarn-length/index',
    component: () => import('@/views/product-center/basic-data/range-of-yarn-length/index'),
    name: 'rangeOfYarnLength',
    meta: {
      noCache: true,
      title: '纱长区间',
      permitTag: 'catalog:Api:Range:yarnLength:index'
    }
  }
]
// 天然纤维管理
const naturalManagement = [
  {
    path: 'natural-fiber',
    component: () => import('@/views/product-center/yarn-management/natural-fiber/list'),
    name: 'NaturalFiberList',
    meta: {
      noCache: true,
      title: '天然纤维列表',
      permitTag: 'catalog:Api:Yarn:NaturalFiber:index'
    }
  },
  {
    path: 'natural-fiber/show/:id',
    component: () => import('@/views/product-center/yarn-management/natural-fiber/detail'),
    name: 'naturalFiberdEdit',
    hidden: true,
    meta: {
      noCache: true,
      title: '天然纤维编辑',
      permitTag: 'catalog:Api:Yarn:NaturalFiber:update',
      activeMenu: '/product-center/yarn-management/natural-fiber'
    }
  },
  {
    path: 'natural-fiber/is-show/:id',
    component: () => import('@/views/product-center/yarn-management/natural-fiber/detail'),
    name: 'naturalFiberdDtails',
    hidden: true,
    meta: {
      noCache: true,
      title: '天然纤维详情',
      permitTag: 'catalog:Api:Yarn:NaturalFiber:show',
      activeMenu: '/product-center/yarn-management/natural-fiber'
    }
  },
  {
    path: 'natural-fiber/show',
    component: () => import('@/views/product-center/yarn-management/natural-fiber/detail'),
    name: 'naturalFiberdAdd',
    hidden: true,
    meta: {
      noCache: true,
      title: '天然纤维新增',
      permitTag: 'catalog:Api:Yarn:NaturalFiber:store',
      activeMenu: '/product-center/yarn-management/natural-fiber'
    }
  },
  {
    path: 'natural-fiber/natural-fiber-import',
    component: () => import('@/views/product-center/yarn-management/natural-fiber/natural-fiber-import'),
    name: 'naturalManagementImport',
    hidden: true,
    meta: {
      noCache: true,
      title: '天然纤维批量导入',
      activeMenu: '/product-center/yarn-management/natural-fiber',
      permitTag: 'catalog:Api:Yarn:NaturalFiber:import'
    }
  }
]
// 化学纤维
const chemicalManagement = [
  {
    path: 'chemical-fiber',
    component: () => import('@/views/product-center/yarn-management/chemical-fiber/list'),
    name: 'ChemicalFiberList',
    meta: {
      noCache: true,
      title: '化学纤维列表',
      permitTag: 'catalog:Api:Yarn:ChemicalFiber:index'
    }
  },
  {
    path: 'chemical-fiber/create',
    component: () => import('@/views/product-center/yarn-management/chemical-fiber/create'),
    name: 'chemicalFiberAdd',
    hidden: true,
    meta: {
      noCache: true,
      title: '化学纤维新增',
      activeMenu: '/product-center/yarn-management/chemical-fiber',
      permitTag: 'catalog:Api:Yarn:ChemicalFiber:store'
    }
  },
  {
    path: 'chemical-fiber/show/:id',
    component: () => import('@/views/product-center/yarn-management/chemical-fiber/create'),
    name: 'chemicalFiberUpdate',
    hidden: true,
    meta: {
      noCache: true,
      title: '化学纤维编辑',
      activeMenu: '/product-center/yarn-management/chemical-fiber',
      permitTag: 'catalog:Api:Yarn:ChemicalFiber:update'
    }
  },
  {
    path: 'chemical-fiber/is-show/:id',
    component: () => import('@/views/product-center/yarn-management/chemical-fiber/create'),
    name: 'chemicalFiberShow',
    hidden: true,
    meta: {
      noCache: true,
      title: '化学纤维详情',
      activeMenu: '/product-center/yarn-management/chemical-fiber',
      permitTag: 'catalog:Api:Yarn:ChemicalFiber:show'
    }
  },
  {
    path: 'chemical-fiber/import',
    component: () => import('@/views/product-center/yarn-management/chemical-fiber/import'),
    name: 'chemicalFiberImport',
    hidden: true,
    meta: {
      noCache: true,
      title: '批量导入',
      activeMenu: '/product-center/yarn-management/chemical-fiber',
      permitTag: 'catalog:Api:Yarn:ChemicalFiber:import'
    }
  }
]
// 组合纱
const combinationManagement = [
  {
    path: 'combination-yarn',
    component: () => import('@/views/product-center/yarn-management/combination-yarn/list'),
    name: 'CombinationList',
    meta: {
      title: '组合纱列表',
      permitTag: 'catalog:Api:Yarn:Composite:index'
    }
  },
  {
    path: 'combination-yarn/show/:id',
    component: () => import('@/views/product-center/yarn-management/combination-yarn/detail'),
    name: 'combinationDtails',
    hidden: true,
    meta: {
      noCache: true,
      title: '组合纱编辑',
      permitTag: 'catalog:Api:Yarn:Composite:update',
      activeMenu: '/product-center/yarn-management/combination-yarn/list'
    }
  },
  {
    path: 'combination-yarn/is-show/:id',
    component: () => import('@/views/product-center/yarn-management/combination-yarn/detail'),
    name: 'combinationDtails1',
    hidden: true,
    meta: {
      noCache: true,
      title: '组合纱详情',
      permitTag: 'catalog:Api:Yarn:Composite:show',
      activeMenu: '/product-center/yarn-management/combination-yarn/list'

    }
  },
  {
    path: 'combination-yarn/show',
    component: () => import('@/views/product-center/yarn-management/combination-yarn/detail'),
    name: 'combinationCreate',
    hidden: true,
    meta: {
      noCache: true,
      title: '组合纱新增',
      permitTag: 'catalog:Api:Yarn:Composite:store',
      activeMenu: '/product-center/yarn-management/combination-yarn/list'

    }
  },
  {
    path: 'combination-yarn/combination-yarn-import',
    component: () => import('@/views/product-center/yarn-management/combination-yarn/combination-yarn-import'),
    name: 'combinationYarnImport',
    hidden: true,
    meta: {
      noCache: true,
      title: '组合纱批量导入',
      activeMenu: '/product-center/yarn-management/combination-yarn/list',
      permitTag: 'catalog:Api:Yarn:Composite:import'
    }
  }
]

const componentsRouter = {
  path: '/product-center',
  component: Layout,
  redirect: '/product-center/spu-management/list',
  name: 'productCenter',
  meta: {
    title: '产品目录库',
    icon: 'component',
    permitTag: 'catalog'
  },
  children: [
    {
      path: 'spu-management',
      component: levelLayout,
      redirect: '/product-center/spu-management/list',
      name: 'spuManagement',
      alwaysShow: true,
      meta: {
        title: 'SPU管理',
        permitTag: 'catalog:SpuManage'
      },
      children: [
        ...spuManagement
      ]
    },
    {
      path: 'product-management',
      component: levelLayout,
      redirect: 'noRedirect',
      name: 'productManagement',
      meta: {
        title: '产品管理',
        permitTag: 'catalog:ProductManage'
      },
      children: [
        ...newcolourManagement,
        ...flowerManagement,
        ...greyManagement,
        ...compositeManagement
      ]
    },
    {
      path: 'yarn-management',
      component: levelLayout,
      redirect: 'noRedirect',
      name: 'yarnManagement',
      meta: {
        title: '纱线管理',
        permitTag: 'catalog:YarnManage'
      },
      children: [
        ...naturalManagement,
        ...chemicalManagement,
        ...combinationManagement
      ]
    },
    {
      path: 'basic-data',
      component: levelLayout,
      redirect: 'noRedirect',
      alwaysShow: true,
      name: 'basicData',
      meta: {
        title: '数据配置',
        icon: 'config',
        permitTag: 'catalog:dataConfig'
      },
      children: [
        ...basicData
      ]
    },
    {
      path: 'jacquard-management',
      component: levelLayout,
      redirect: '/product-center/jacquard-management/list',
      name: 'jacquardManagement',
      alwaysShow: true,
      meta: {
        title: '提花号管理',
        permitTag: 'catalog:jacquard'
      },
      children: [
        {
          path: 'list',
          component: () => import('@/views/product-center/jacquard-management/jacquard/list'),
          name: 'JacquardList',
          meta: {
            title: '提花号列表',
            permitTag: 'catalog:jacquard:index'
          }
        }
      ]
    }
  ]
}

export default componentsRouter
