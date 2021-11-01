import Layout from '@/layout'
import levelLayout from '@/layout/levelLayout'

const componentsRouter = {
  path: '/system-settings',
  component: Layout,
  name: 'system-settings',
  alwaysShow: true,
  meta: {
    title: '系统设置',
    icon: '',
    permitTag: 'sysSettings'
  },
  children: [
    // {
    //   path: '/system-settings/review-processr',
    //   name: 'review-processr',
    //   component: levelLayout,
    //   redirect: '/system-settings/review-processr/review-processr-list',
    //   meta: {
    //     permitTag: 'sysSettings:billCheckSetting',
    //     title: '单据审批设置',
    //     icon: 'form'
    //   },
    //   children: [
    // {
    //   path: '/system-settings/review-processr/review-processr-list',
    //   name: 'review-process-list',
    //   component: () => import('@/views/system-settings/review-process/review-process-list/index.vue'),
    //   meta: {
    //     permitTag: 'sysSettings:billCheckSetting:workflow:page',
    //     title: '审核流程设置'
    //   }
    // },
    {
      path: '/system-settings/review-processr/review-process-list',
      name: 'review-processr-list',
      component: () => import('@/views/system-settings/review-process/review-process-list/index.vue'),
      meta: {
        permitTag: 'sysSettings:workflow:page',
        title: '审核流程设置'
      }
    },
    // {
    //   path: '/system-settings/review-processr/approve-list',
    //   name: 'approve-list',
    //   component: () => import('@/views/system-settings/review-process/approve-list/index.vue'),
    //   hidden: true,
    //   meta: {
    //     keepOrgin: true,
    //     noUseAuth: true,
    //     title: '我的审批'
    //   }
    // },
    {
      path: '/system-settings/review-processr/review-processr-edit/:id',
      name: 'review-process-edit',
      hidden: true,
      component: () => import('@/views/system-settings/review-process/review-process-edit/index.vue'),
      meta: {
        title: '审核流程编辑',
        icon: '',
        keepOrgin: true,
        noUseAuth: true
      }
    },
    {
      path: '/system-settings/review-processr/review-processr-detail/:id',
      name: 'review-process-detail',
      hidden: true,
      component: () => import('@/views/system-settings/review-process/review-process-edit/index.vue'),
      meta: {
        title: '审核流程详情',
        icon: '',
        keepOrgin: true,
        noUseAuth: true
      }
    },
    {
      path: '/system-settings/review-processr/review-processr-add',
      name: 'review-process-add',
      hidden: true,
      component: () => import('@/views/system-settings/review-process/review-process-edit/index.vue'),
      meta: {
        title: '审核流程新增',
        icon: '',
        keepOrgin: true,
        noUseAuth: true
      }
      // }
      // ]
    },
    // 流程详情
    {
      path: '/system-settings/review-processr/detail/:id',
      name: 'review-process-detail',
      component: () => import('@/views/system-settings/review-process/approvedDetail.vue'),
      hidden: true,
      meta: {
      // permitTag: 'srm:basicData',
        title: '审核流程详情',
        icon: '',
        keepOrgin: true,
        noUseAuth: true
      }
    },
    {
      path: 'task-setting',
      name: 'task-setting',
      component: levelLayout,
      meta: {
        title: '任务配置',
        icon: '',
        permitTag: 'sysSettings:task'
        // keepOrgin: true,
        // noUseAuth: true
      },
      children: [
        {
          path: '/system-settings/task-setting/region-config',
          name: 'region-config',
          component: () => import('@/views/system-settings/task-setting/region-config/index.vue'),
          meta: {
            title: '区域配置',
            permitTag: 'sysSettings:task:area:page'
            // keepOrgin: true,
            // noUseAuth: true // 无需认证的路由
          }
        },
        {
          path: '/system-settings/task-setting/assign-manage',
          name: 'assign-manage',
          component: () => import('@/views/system-settings/task-setting/assign-manage/index.vue'),
          meta: {

            title: '指派管理',
            permitTag: 'sysSettings:task:outworker:page'
            // keepOrgin: true,
            // noUseAuth: true // 无需认证的路由
          }
        }
      ]
    },

    // 制版参数设置
    {
      path: '/system-settings/template-params',
      name: 'template-params',
      component: () => import('@/views/system-settings/template-params/index.vue'),
      meta: {
        title: '制版参数设置',
        permitTag: 'sysSettings:template:parameter:batchList'
      }
    }
  ]
}

export default componentsRouter
