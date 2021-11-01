/*
 * @Author: xj
 * @Description:
 * @Date: 2020-12-29 18:47:42
 * @LastEditors: OBKoro1
 * @LastEditTime: 2020-12-30 15:54:15
 */
/** When your routing table is too long, you can split it into small modules **/

import Layout from '@/layout'
import levelLayout from '@/layout/levelLayout'

const componentsRouter = {
  path: '/tech-manage',
  name: 'tech-manage',
  component: Layout,
  meta: {
    title: '工艺管理',
    icon: 'table',
    permitTag: 'techManage'
  },
  children: [
    // {
    //   path: 'process-basic-data',
    //   name: 'process-basic-data',
    //   alwaysShow: true,
    //   redirect: '/tech-manage/weave-tech/process-basic-data/standard-process-flow',
    //   component: levelLayout,
    //   // component: () => import('@/views/tech-manage/weave-tech/process-basic-data/index'),
    //   meta: {
    //     title: '基础资料',
    //     permitTag: 'baseData',
    //     // keepOrgin: true, // 保持自定义元数据信息
    //     // noUseAuth: true, // 无需认证的路由
    //     icon: 'excel'
    //     // permitTag: ''// 认证标识
    //   },
    //   children: [
    //     {
    //       path: 'weaving-technology',
    //       name: 'weaving-technology',
    //       component: () => import('@/views/tech-manage/weave-tech/process-basic-data/weaving-technology/index.vue'),
    //       meta: {
    //         title: '织造工艺',
    //         permitTag: 'baseData:tmWeavingTech:page'

    //         // keepOrgin: true, // 保持自定义元数据信息
    //         // noUseAuth: true // 无需认证的路由
    //         // icon: 'excel'
    //         // permitTag: ''// 认证标识
    //       }
    //     }
    //   ]
    // },
    {
      path: 'weave-tech',
      component: levelLayout,
      name: 'weave-tech',
      redirect: 'noRedirect',
      meta: {
        title: '织造工艺',
        permitTag: 'techManage:weavingTechnique'
      },
      children: [
        {
          path: 'list',
          name: 'analyse-list',
          component: () => import('@/views/tech-manage/weave-tech/analyse/list'),
          meta: {
            title: '客样分析列表',
            permitTag: 'techManage:sampleAnalysisResult:page'
          }
        },
        {
          path: 'detail/:id',
          name: 'analyse-detail',
          hidden: true,
          component: () => import('@/views/tech-manage/weave-tech/analyse/detail'),
          meta: {
            activeMenu: '/tech-manage/weave-tech/list',
            title: '客样分析详情页',
            keepOrgin: true,
            noUseAuth: true // 无需认证的路由
          }
        },
        {
          path: 'print',
          hidden: true,
          component: () => import('@/views/tech-manage/weave-tech/analyse/detail/print.vue'),
          name: 'weave-tech-weaveTechPrint',
          meta: {
            activeMenu: '/tech-manage/weave-tech/list',
            keepOrgin: true,
            noUseAuth: true, // 无需认证的路由
            title: ' 客样分析打印'
          }
        }

      ]
    },
    {
      path: 'produce-tech',
      component: levelLayout,
      name: 'produce-tech',
      redirect: 'noRedirect',
      meta: {
        title: '生产工艺',
        // permitTag: 'techManage:weavingTechnique',
        keepOrgin: true,
        noUseAuth: true // 无需认证的路由
      },
      children: [
        {
          path: 'list',
          name: 'knitting-list',
          component: () => import('@/views/tech-manage/produce-tech/knitting/list'),
          meta: {
            title: '针织工艺',
            permitTag: 'techManage:tmKnitTech'
            // keepOrgin: true,
            // noUseAuth: true // 无需认证的路由
          }
        },
        {
          path: 'detail/:id',
          name: 'knitting-detail',
          hidden: true,
          component: () => import('@/views/tech-manage/produce-tech/knitting/detail'),
          meta: {
            activeMenu: '/tech-manage/produce-tech/list',
            title: '针织工艺详情页',
            keepOrgin: true,
            noUseAuth: true // 无需认证的路由
          }
        }

      ]
    }]

}

export default componentsRouter
