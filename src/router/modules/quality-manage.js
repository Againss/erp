import Layout from '@/layout'
import levelLayout from '@/layout/levelLayout'

const componentsRouter = {
  path: '/quality-manage',
  name: 'quality-manage',
  component: Layout,
  meta: {
    title: '质量管理',
    icon: 'table',
    permitTag: 'qa'
    // keepOrgin: true,
    // noUseAuth: true // 无需认证的路由
  },
  children: [
    {
      path: 'quality-assurance',
      component: levelLayout,
      name: 'quality-assurance',
      redirect: 'noRedirect',
      meta: {
        title: '纱线检测',
        permitTag: 'qa:yarn:test'
        // keepOrgin: true,
        // noUseAuth: true // 无需认证的路由
      },
      children: [
        {
          path: 'quality-yarn-list',
          name: 'quality-yarn-list',
          component: () =>
            import('@/views/quality-manage/quality-yarn/index.vue'),
          meta: {
            title: '纱线物测',
            // keepOrgin: true,
            // noUseAuth: true,
            permitTag: 'qa:qaYarnInspectionPhysical:list'
          }
        },
        {
          path: 'quality-yarn-edit/:id',
          name: 'quality-yarn-edit',
          hidden: true,
          component: () =>
            import('@/views/quality-manage/quality-yarn/detail/index.vue'),
          meta: {
            activeMenu: '/quality-manage/quality-assurance/quality-yarn-list',
            title: '纱线物测编辑',
            icon: '',
            keepOrgin: true,
            noUseAuth: true
          }
        },
        {
          path: 'quality-yarn-add',
          name: 'quality-yarn-add',
          hidden: true,
          component: () =>
            import('@/views/quality-manage/quality-yarn/detail/index.vue'),
          meta: {
            activeMenu: '/quality-manage/quality-assurance/quality-yarn-list',
            title: '纱线物测新增',
            icon: '',
            keepOrgin: true,
            noUseAuth: true
          }
        },
        {
          path: 'quality-yarn-print/:id/:version',
          name: 'quality-yarn-print',
          hidden: true,
          component: () =>
            import('@/views/quality-manage/quality-yarn/print/index.vue'),
          meta: {
            title: '打印预览',
            icon: '',
            keepOrgin: true,
            noUseAuth: true
          }
        },
        {
          path: 'list',
          name: 'quality-assurance-list',
          component: () =>
            import('@/views/quality-manage/quality-assurance/list/index.vue'),
          meta: {
            title: '试纱',
            permitTag: 'qa:qaYarnInspectionTesting:list'
            // keepOrgin: true,
            // noUseAuth: true // 无需认证的路由
          }
        },
        {
          path: 'detail',
          name: 'quality-assurance-detail',
          hidden: true,
          component: () =>
            import('@/views/quality-manage/quality-assurance/detail/index.vue'),
          meta: {
            activeMenu: '/quality-manage/quality-assurance/list',
            title: '纱线检测详情页',
            keepOrgin: true,
            noUseAuth: true // 无需认证的路由
          }
        },
        {
          path: 'yarn-testing-yarn',
          name: 'yarn-testing-yarn',
          component: () =>
            import('@/views/quality-manage/yarn-testing-yarn/list/index.vue'),
          meta: {
            title: '纱检试纱',
            permitTag: 'qa:qaYarnInspectionPhysicalTesting:list'
            // keepOrgin: true,
            // noUseAuth: true // 无需认证的路由
          }
        },
        {
          path: 'yarn-testing-yarn/:id',
          name: 'yarn-detail',
          hidden: true,
          component: () =>
            import('@/views/quality-manage/yarn-testing-yarn/detail/index.vue'),
          meta: {
            title: '纱检试纱报告',
            activeMenu: '/quality-manage/quality-assurance/yarn-testing-yarn',
            keepOrgin: true,
            noUseAuth: true // 无需认证的路由
          }
        }
      ]
    },
    {
      path: 'grey-fabric-inspection',
      component: levelLayout,
      name: 'grey-fabric-inspection',
      redirect: 'noRedirect',
      meta: {
        title: '坯布检测',
        permitTag: 'qa:greige:test'
        // keepOrgin: true,
        // noUseAuth: true // 无需认证的路由
      },
      children: [
        {
          path: 'grey-fabric-determinate-board',
          name: 'grey-fabric-determinate-board',
          redirect: '/quality-assurance/grey-fabric-determinate-board/index',
          component: levelLayout,
          // component: () => import('@/views/quality-manage/grey-fabric-inspection/grey-fabric-determinate-board/index.vue'),
          meta: {
            // activeMenu: '/quality-manage/grey-fabric-inspection',
            title: '坯布确板',
            // keepOrgin: true,
            // noUseAuth: true
            permitTag: 'qa:qaGreigeSwatchesTask:list'
          },
          children: [
            {
              path: 'index',
              name: 'grey-fabric-determinate-board-page',
              // hidden: true,
              component: () =>
                import('@/views/quality-manage/grey-fabric-inspection/grey-fabric-determinate-board/index.vue'),
              meta: {
                // activeMenu: '/quality-manage/grey-fabric-inspection/index',
                title: '坯布确板',
                // keepOrgin: true,
                // noUseAuth: true
                permitTag: 'qa:qaGreigeSwatchesTask:list'
              }
            },
            {
              path: 'detail',
              name: 'grey-fabric-determinate-board-detail',
              hidden: true,
              component: () =>
                import('@/views/quality-manage/grey-fabric-inspection/grey-fabric-determinate-board/detail/index.vue'),
              meta: {
                activeMenu:
                  '/quality-manage/grey-fabric-inspection/grey-fabric-determinate-board/index',
                title: '坯布确板详情页',
                keepOrgin: true,
                noUseAuth: true
                // permitTag: 'qa:qaYarnInspectionPhysical:list'
              }
            }
          ]
        },
        {
          path: 'grey-fabric-cloth-inspection',
          name: 'grey-fabric-cloth-inspection',
          redirect: '/quality-assurance/grey-fabric-cloth-inspection/index',
          component: levelLayout,
          meta: {
            title: '坯布验布',
            // keepOrgin: true,
            // noUseAuth: true
            permitTag: 'qa:qaGreigeFabricTask:list'
          },
          children: [
            {
              path: 'index',
              name: 'grey-fabric-cloth-inspection-page',
              // hidden: true,
              component: () =>
                import('@/views/quality-manage/grey-fabric-inspection/grey-fabric-cloth-inspection/index.vue'),
              meta: {
                // activeMenu: '/quality-manage/grey-fabric-inspection/index',
                title: '坯布验布',
                // keepOrgin: true,
                // noUseAuth: true
                permitTag: 'qa:qaGreigeFabricTask:list'
              }
            },
            {
              path: 'detail',
              name: 'grey-fabric-cloth-inspection-detail',
              hidden: true,
              component: () =>
                import('@/views/quality-manage/grey-fabric-inspection/grey-fabric-cloth-inspection/detail/index.vue'),
              meta: {
                activeMenu:
                  '/quality-manage/grey-fabric-inspection/grey-fabric-cloth-inspection/index',
                title: '坯布验布详情页',
                keepOrgin: true,
                noUseAuth: true
                // permitTag: 'qa:qaYarnInspectionPhysical:list'
              }
            }
          ]
        }
      ]
    },
    {
      path: 'finished-product-testing',
      component: levelLayout,
      name: 'finished-product-testing',
      redirect: 'noRedirect',
      meta: {
        title: '成品检测',
        icon: 'table',
        permitTag: 'qa:finish:test'
        // keepOrgin: true,
        // noUseAuth: true // 无需认证的路由
      },
      children: [
        {
          path: 'finished-fabric-inspection',
          name: 'finished-fabric-inspection',
          component: () => import('@/views/quality-manage/finished-fabric-inspection/index.vue'),
          meta: {
            title: '成品验布',
            icon: 'table',
            // keepOrgin: true,
            // noUseAuth: true
            permitTag: 'qa:qaFinishFabricInspectionTask:list'
          }
        },
        {
          path: 'finished-fabric-inspection/detail/:id',
          name: 'finished-fabric-inspection-detail',
          hidden: true,
          component: () => import('@/views/quality-manage/finished-fabric-inspection/detail/index.vue'),
          meta: {
            activeMenu: '/quality-manage/finished-product-testing/finished-fabric-inspection',
            title: '成品验布详情',
            keepOrgin: true,
            noUseAuth: true // 无需认证的路由
          }
        },
        {
          path: 'finish-batch-color',
          name: 'finish-batch-color',
          component: () => import('@/views/quality-manage/finish-batch-color/index.vue'),
          meta: {
            title: '成品批色',
            icon: 'table',
            // keepOrgin: true,
            // noUseAuth: true
            permitTag: 'qa:qaFinishBatchColor:list'
          }
        },
        {
          path: 'finish-batch-color/detail/:id',
          name: 'finish-batch-color-detail',
          hidden: true,
          component: () => import('@/views/quality-manage/finish-batch-color/detail/index.vue'),
          meta: {
            activeMenu: '/quality-manage/finished-product-testing/finish-batch-color',
            title: '成品批色详情',
            keepOrgin: true,
            noUseAuth: true // 无需认证的路由
          }
        },
        {
          path: 'finished-cloth',
          name: 'finished-cloth',
          component: () => import('@/views/quality-manage/finished-cloth/list/index.vue'),
          meta: {
            title: '成品物测',
            icon: 'table',
            // keepOrgin: true,
            // noUseAuth: true
            permitTag: 'qa:qaFinishFabricPhysical:list'
          }
        },
        {
          path: 'finished-cloth/detail/:id',
          name: 'finished-cloth-detail',
          hidden: true,
          component: () => import('@/views/quality-manage/finished-cloth/detail/index.vue'),
          meta: {
            activeMenu: '/quality-manage/finished-product-testing/finished-cloth',
            title: '成品物测详情',
            keepOrgin: true,
            noUseAuth: true // 无需认证的路由
          }
        },
        {
          path: 'finished-cloth-pring/:id/:version',
          name: 'finished-cloth-pring',
          hidden: true,
          component: () => import('@/views/quality-manage/finished-cloth/print/index.vue'),
          meta: {
            activeMenu: '/quality-manage/finished-product-testing/finished-cloth',
            title: '打印预览',
            icon: '',
            keepOrgin: true,
            noUseAuth: true
          }
        }
      ]
    }
  ]
}

export default componentsRouter
