/**
 * @Description: 路由配置
 * @author Roman
 * @date 2020/6/18
 */
import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

/* Layout */
import Layout from '@/layout'
import indexPage from '@/views/index'
/* Router Modules */
// import componentsRouter from './modules/components'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar
    noCache: true                if set true, the page will no be cached(default is false)
    affix: true                  if set true, the tag will affix in the tags-view
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/jump',
    component: () => import('@/views/jump'),
    hidden: true
  },
  {
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path(.*)',
        component: () => import('@/views/redirect/index')
      }
    ]
  },
  {
    path: '/404',
    component: () => import('@/views/error-page/404'),
    hidden: true
  },
  {
    path: '/403',
    component: () => import('@/views/error-page/403'),
    hidden: true
  },
  {
    path: '/',
    component: Layout,
    meta: { title: '', icon: 'dashboard' },
    redirect: '/index',
    children: [
      // {--replace--}
      {
        path: 'index',
        component: indexPage,
        name: 'index',
        meta: { title: '首页', icon: '首页', affix: true }
      },
      {
        path: 'personal-data',
        component: () => import('@/views/user-center/personal-data'),
        hidden: true,
        name: 'personal-data',
        meta: { title: '个人资料' }
      },
      {
        path: 'tform',
        hidden: true,
        component: () => import('@/views/demo/custom-tform'),
        name: 'tform',
        meta: { title: '基础组件文档', icon: 'list' }
      },
      {
        path: 'com-function',
        hidden: true,
        component: () => import('@/views/demo/com-function'),
        name: 'com-function',
        meta: { title: '权限方法及传参', icon: 'list' }
      },
      // {
      //   path: 'button-type',
      //   hidden: true,
      //   component: () => import('@/views/user-center/button-type'),
      //   name: 'button-type',
      //   meta: { title: '按钮类型' }
      // },
      {
        path: 'nginx-kafka',
        hidden: true,
        component: () => import('@/views/demo/nginx-kafka'),
        name: 'nginx-kafka',
        meta: { title: '操作日志接口传参' }
      },
      {
        path: 'flow-chart',
        hidden: true,
        component: () => import('@/views/demo/flow-chart'),
        name: 'flow-chart',
        meta: { title: '审核流程' }
      },
      {
        path: 'message-center',
        name: 'message-center',
        hidden: true,
        component: () => import('@/views/user-center/message-center'),
        meta: {
          title: '消息中心'
          // keepOrgin: true, // 保持自定义元数据信息
          // noUseAuth: true, // 无需认证的路由
          // icon: 'excel'
          // permitTag: 'userCenter:sysUserLog:list'// 认证标识
        }
      },
      {
        path: 'approve-list',
        name: 'approve-list',
        component: () => import('@/views/system-settings/review-process/approve-list/index.vue'),
        hidden: true,
        meta: {
          // keepOrgin: true,
          // noUseAuth: true,
          title: '我的审批'
        }
      },
      {
        path: 'message-info',
        name: 'message-info',
        hidden: true,
        component: () => import('@/views/user-center/message-info'),
        meta: {
          title: '消息详情'
          // keepOrgin: true, // 保持自定义元数据信息
          // noUseAuth: true, // 无需认证的路由
          // icon: 'excel'
          // permitTag: 'userCenter:sysUserLog:list'// 认证标识
        }
      }
    ]
  }
]

/**
 * asyncRoutes
 * the routes that need to be dynamically loaded based on user roles
 */

const modulesFiles = require.context('./modules', true, /\.js$/)

// you do not need `import app from './modules/app'`
// it will auto require all vuex module from modules file
const modules = modulesFiles.keys().reduce((modules, modulePath) => {
  // set './app.js' => 'app'
  const moduleName = modulePath.replace(/^\.\/(.*)\.\w+$/, '$1')
  const value = modulesFiles(modulePath)
  modules[moduleName] = value.default
  return modules
}, {})

const routerRequire = process.env.envData.require
if (routerRequire && routerRequire[0] !== '*') {
  for (const i in modules) {
    if (!routerRequire.includes(i)) {
      delete modules[i]
    }
  }
}
const asyncRoutes = Object.values(modules)
export { asyncRoutes }

const createRouter = () => new VueRouter({
  mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
