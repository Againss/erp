/*
 * @Date: 2020-09-24 10:22:08
 * @Author: Againss
 * @LastEditTime: 2021-06-18 14:15:22
 * @LastEditors: zhengjin
 * @Descripttion: 色号库路由
 */
/** When your routing table is too long, you can split it into small modules **/

import Layout from '@/layout'
import levelLayout from '@/layout/levelLayout'
// 基础数据
const basicData = [
  {
    path: 'color-board-type',
    component: () => import('@/views/color-library/basic-data/color-board-type/list'),
    name: 'colorBoardType',
    meta: {
      permitTag: 'color:Api:ColorBd:ColorPlateType:index',
      title: '色板类型'
    }
  },
  {
    path: 'color-system',
    component: () => import('@/views/color-library/basic-data/color-system/list'),
    name: 'colorSystemList',
    meta: {
      permitTag: 'color:Api:ColorBd:ColorSystem:index',
      title: '色系'
    }
  },
  {
    path: 'dye-additives',
    component: () => import('@/views/color-library/basic-data/dye-additives/list'),
    name: 'dyeAdditivesList',
    meta: {
      permitTag: 'color:Api:ColorBd:DyestuffAssist:index',
      title: '染料助剂'
    }
  },
  {
    path: 'pretreatment',
    component: () => import('@/views/color-library/basic-data/pretreatment/list'),
    name: 'pretreatmentList',
    meta: {
      permitTag: 'color:Api:ColorBd:Pretreatment:index',
      title: '前处理'
    }
  },
  // {
  //   path: 'color-grade',
  //   component: () => import('@/views/color-library/basic-data/color-grade/list'),
  //   name: 'colorGradeList',
  //   meta: {
  //     permitTag: 'color:Api:ColorBd:ColorGrade:index',
  //     title: '色级'
  //   }
  // },
  {
    path: 'process-parameters',
    component: () => import('@/views/color-library/basic-data/process-parameters/list'),
    name: 'processParametersList',
    meta: {
      permitTag: 'color:Api:FlowerBd:TechParamName:index',
      title: '印花工艺参数'
    }
  }
]
// 色号管理
const colorManagement = [
  {
    path: 'list',
    component: () => import('@/views/color-library/color-management/list'),
    name: 'colorManagementList',
    meta: {
      permitTag: 'color:Api:Color:ColorManage:index',
      title: '色号管理'
    }
  },
  {
    path: 'color-code/:id/edit',
    hidden: true,
    component: () => import('@/views/color-library/color-management/color-code/detail'),
    name: 'colorManagementColorCodeupdate',
    meta: {
      permitTag: 'color:Api:ColorManage:ColorManage:update',
      activeMenu: '/color-library/color-management/list',
      title: '色号详情编辑'
    }
  },
  {
    path: 'color-code/:id/show',
    hidden: true,
    component: () => import('@/views/color-library/color-management/color-code/detail'),
    name: 'colorManagementColorCodeshow',
    meta: {
      permitTag: 'color:Api:ColorManage:ColorManage:show',
      activeMenu: '/color-library/color-management/list',
      title: '色号详情查看'
    }
  },
  {
    path: 'color-code/:id/copy',
    hidden: true,
    component: () => import('@/views/color-library/color-management/color-code/detail'),
    name: 'colorManagementColorCodecopy',
    meta: {
      permitTag: 'color:Api:ColorManage:ColorManage:copy',
      activeMenu: '/color-library/color-management/list',
      title: '色号详情复制'
    }
  },
  {
    path: 'color-code/create',
    hidden: true,
    component: () => import('@/views/color-library/color-management/color-code/detail'),
    name: 'colorManagementColorCodeCreate',
    meta: {
      permitTag: 'color:Api:ColorManage:ColorManage:store',
      activeMenu: '/color-library/color-management/list',
      title: '色号新增'
    }
  },
  {
    path: 'computer-color/:id/add',
    component: () => import('@/views/color-library/color-management/compute-color/create'),
    name: 'colorManagementComputerColorStore',
    hidden: true,
    meta: {
      permitTag: 'color:Api:ColorManage:Datacolor:store',
      activeMenu: '/color-library/color-management/list',
      title: '电脑对色'
    }
  },
  {
    path: 'computer-color/:id/edit',
    component: () => import('@/views/color-library/color-management/compute-color/create'),
    name: 'colorManagementComputerColorUpdate',
    hidden: true,
    meta: {
      permitTag: 'color:Api:ColorManage:Datacolor:update',
      activeMenu: '/color-library/color-management/list',
      title: '电脑对色'
    }
  },
  {
    path: 'computer-color/:id/show',
    component: () => import('@/views/color-library/color-management/compute-color/create'),
    name: 'colorManagementComputerColorShow',
    hidden: true,
    meta: {
      permitTag: 'color:Api:ColorManage:Datacolor:show',
      activeMenu: '/color-library/color-management/list',
      title: '电脑对色'
    }
  },
  {
    path: 'recipe-entry/:id/add',
    hidden: true,
    component: () => import('@/views/color-library/color-management/recipe-entry/detail'),
    name: 'recipeEntryShow',
    meta: {
      permitTag: 'color:Api:ColorManage:Formula:store',
      activeMenu: '/color-library/color-management/list',
      title: '配方录入新增'
    }
  },
  {
    path: 'recipe-entry/:id/edit',
    hidden: true,
    component: () => import('@/views/color-library/color-management/recipe-entry/detail'),
    name: 'recipeEntryCreateA',
    meta: {
      permitTag: 'color:Api:ColorManage:Formula:update',
      activeMenu: '/color-library/color-management/list',
      title: '配方录入编辑'
    }
  },
  {
    path: 'recipe-entry/:id/show',
    hidden: true,
    component: () => import('@/views/color-library/color-management/recipe-entry/detail'),
    name: 'recipeEntryCreate',
    meta: {
      permitTag: 'color:Api:ColorManage:Formula:show',
      activeMenu: '/color-library/color-management/list',
      title: '配方录入查看'
    }
  }
]

// 花号管理
const flowerManagement = [
  {
    path: 'list',
    component: () => import('@/views/color-library/flower-management/list'),
    name: 'flowerManagementList',
    meta: {
      permitTag: 'color:Api:FlowerManage:FlowerManage:index',
      title: '花号管理'
    }
  },
  {
    path: 'flower-code/:id/edit',
    hidden: true,
    component: () => import('@/views/color-library/flower-management/detail'),
    name: 'flowerManagementFlowerCodeupdate',
    meta: {
      permitTag: 'color:Api:FlowerManage:FlowerMain:update',
      activeMenu: '/color-library/flower-management/list',
      title: '花号详情编辑'
    }
  },
  {
    path: 'flower-code/:id/show',
    hidden: true,
    component: () => import('@/views/color-library/flower-management/detail'),
    name: 'flowerManagementFlowerCodeshow',
    meta: {
      permitTag: 'color:Api:FlowerManage:FlowerMain:show',
      activeMenu: '/color-library/flower-management/list',
      title: '花号详情查看'
    }
  }
]
// 花号工艺
const flowerCraft = [
  {
    path: 'list',
    component: () => import('@/views/color-library/flower-craft/list'),
    name: 'flowerCraftList',
    meta: {
      permitTag: 'color:Api:FlowerManage:FlowerTechnology:index',
      title: '花号工艺'
    }
  },
  {
    path: 'flower-code/:id/edit',
    hidden: true,
    component: () => import('@/views/color-library/flower-craft/detail'),
    name: 'flowerCraftFlowerCodeupdate',
    meta: {
      permitTag: 'color:Api:FlowerManage:FlowerTechnology:update',
      activeMenu: '/color-library/flower-craft/list',
      title: '花号详情编辑'
    }
  },
  {
    path: 'flower-code/:id/show',
    hidden: true,
    component: () => import('@/views/color-library/flower-craft/detail'),
    name: 'flowerCraftCodeshow',
    meta: {
      permitTag: 'color:Api:FlowerManage:FlowerTechnology:show',
      activeMenu: '/color-library/flower-craft/list',
      title: '花号详情查看'
    }
  },
  {
    path: 'flower-code/print/:id',
    hidden: true,
    component: () => import('@/views/color-library/flower-craft/print'),
    name: 'flowerManagementFlowerCodePrint',
    meta: {
      permitTag: 'color:Api:FlowerManage:FlowerTechnology:print',
      activeMenu: '/color-library/flower-craft/list',
      title: '花号工艺打印'
    }
  }
]
const componentsRouter = {
  path: '/color-library',
  component: Layout,
  // redirect: 'noRedirect',
  name: 'colorLibrary',
  meta: {
    title: '色号库',
    icon: 'component',
    permitTag: 'color'
  },
  children: [
    {
      path: 'basic-data',
      component: levelLayout,
      redirect: '/color-library/basic-data/color-board-type',
      name: 'colorBasicData',
      meta: {
        title: '基础数据管理',
        permitTag: 'color:BasicData'
      },
      children: [
        ...basicData
      ]
    },
    {
      path: 'color-management',
      component: levelLayout,
      redirect: '/color-library/color-management/list',
      name: 'colorManagement',
      meta: {
        title: '色号管理',
        permitTag: 'color:Api:Color:ColorManage:index'
      },
      children: [
        ...colorManagement
      ]
    },
    {
      path: 'flower-management',
      component: levelLayout,
      redirect: '/color-library/flower-management/list',
      name: 'flowerManagement',
      meta: {
        title: '花号管理',
        permitTag: 'color:Api:FlowerManage:FlowerManage:index'
      },
      children: [
        ...flowerManagement
      ]
    },
    {
      path: 'flower-craft',
      component: levelLayout,
      redirect: '/color-library/flower-craft/list',
      name: 'flowerCraft',
      meta: {
        title: '花号工艺',
        permitTag: 'color:Api:FlowerManage:FlowerTechnology:index'
      },
      children: [
        ...flowerCraft
      ]
    }
  ]
}

export default componentsRouter
