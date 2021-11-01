import levelLayout from '@/layout/levelLayout'

const componentsRouter = {
  path: '/finished-ipad',
  component: levelLayout,
  name: 'finished-ipad',
  hidden: true,
  meta: {
    title: '成品检测',
    icon: 'table',
    keepOrgin: true,
    noUseAuth: true // 无需认证的路由
  },
  children: [
    {
      path: 'finished-ipad-list',
      name: 'finished-ipad-list',
      component: () => import('@/views/quality-manage/finished-ipad/list/index.vue'),
      hidden: true,
      meta: {
        title: '成品验布-ipad',
        icon: 'table',
        keepOrgin: true,
        noUseAuth: true
      }
    },
    {
      path: 'finished-ipad-sub-list/:id',
      name: 'finished-ipad-sub-list',
      component: () => import('@/views/quality-manage/finished-ipad/sub-list/index.vue'),
      hidden: true,
      meta: {
        title: '验布列表-ipad',
        icon: 'table',
        keepOrgin: true,
        noUseAuth: true
      }
    },
    {
      path: 'finished-ipad-sub-list/detail/view',
      name: 'finished-ipad-sub-detail',
      hidden: true,
      component: () => import('@/views/quality-manage/finished-ipad/sub-list/detail/index.vue'),
      meta: {
        title: '布匹详情',
        keepOrgin: true,
        noUseAuth: true // 无需认证的路由
      }
    },
    {
      path: 'finished-ipad-sub-list/additional/:id',
      name: 'finished-ipad-sub-additional',
      hidden: true,
      component: () => import('@/views/quality-manage/finished-ipad/sub-list/additional.vue'),
      meta: {
        title: '验布结果计算规则',
        keepOrgin: true,
        noUseAuth: true // 无需认证的路由
      }
    }
  ]
}

export default componentsRouter
