/** When your routing table is too long, you can split it into small modules **/

import Layout from '@/layout'
import levelLayout from '@/layout/levelLayout'

const componentsRouter = {
  path: '/user-center',
  component: Layout,
  name: 'user-center',
  meta: {
    permitTag: 'userCenter',
    title: '用户中心',
    icon: 'list'
    // _path: 'crm.route.userCenter'
  },
  redirect: '/user-center/micro-services',
  children: [
    {
      path: 'micro-services',
      name: 'MicroServices',
      component: () => import('@/views/user-center/micro-services'),
      meta: {
        permitTag: 'userCenter:sysAppSystem:list',
        title: '微服务管理',
        icon: 'table'
      }
    },
    {
      path: 'menu-management',
      name: 'MenuManagement',
      component: () => import('@/views/user-center/menu-management'),
      meta: {
        permitTag: 'userCenter:sysPermit:list',
        title: '菜单管理',
        icon: 'tree'
        // _path: 'crm.route.menuManagement'
      }
    },
    {
      path: 'role-management',
      name: 'RoleManagement',
      component: levelLayout,
      redirect: '/user-center/role-management/index',
      meta: {
        permitTag: 'userCenter:sysRole:list',
        title: '角色管理',
        icon: 'example'
      },
      children: [
        {
          path: 'index',
          name: 'RoleManagementIndex',
          component: () => import('@/views/user-center/role-management'),
          meta: {
            // keepOrgin: true,
            permitTag: 'userCenter:sysRole:list',
            title: '角色管理列表',
            icon: 'example'
          }
        },
        {
          path: 'role-authorization/:id',
          name: 'role-authorization',
          hidden: true,
          component: () => import('@/views/user-center/role-authorization'),
          meta: {
            permitTag: 'userCenter:sysRole:permit:modify',
            activeMenu: '/user-center/role-management/index',
            title: '角色授权详情'
          }
        }
      ]
    },
    {
      path: 'department-management',
      name: 'DepartmentManagement',
      component: () => import('@/views/user-center/department-management'),
      meta: {
        permitTag: 'userCenter:sysOrg:list',
        title: '组织部门',
        icon: 'link'
      }
    },
    {
      path: 'data-setting-range',
      name: 'DataSettingRange',
      component: () => import('@/views/user-center/data-setting-range'),
      meta: { permitTag: 'userCenter:sysDataGroup:list', title: '设置数据范围' }
    },
    {
      path: 'employee-management',
      name: 'EmployeeManagement',
      component: () => import('@/views/user-center/employee-management'),
      meta: {
        permitTag: 'userCenter:sysUser:list',
        title: '员工管理',
        icon: 'user'
      }
    },
    {
      path: 'business-field-encryption-settings',
      name: 'BusinessFieldEncryptionSettings',
      component: () => import('@/views/user-center/business-field-encryption-settings'),
      meta: {
        permitTag: 'userCenter:sysDataMaskingRule:list',
        title: '业务单据字段加密设置'
      }
    },
    {
      path: 'log-management',
      name: 'LogManagement',
      component: () => import('@/views/user-center/log-management'),
      meta: {
        noCache: true,
        title: '日志管理',
        // keepOrgin: true, // 保持自定义元数据信息
        // noUseAuth: true, // 无需认证的路由
        icon: 'excel',
        permitTag: 'userCenter:sysUserLog:list'// 认证标识
      }
    },
    {
      path: 'available-mailbox',
      name: 'AvailableMailbox',
      component: () => import('@/views/user-center/available-mailbox'),
      meta: {
        permitTag: 'userCenter:mailBoxManager:list',
        title: '可用邮箱',
        icon: 'example'
      }
    },
    {
      path: 'department-type',
      name: 'DepartmentType',
      component: () => import('@/views/user-center/department-type'),
      meta: {
        // keepOrgin: true, // 保持自定义元数据信息
        // noUseAuth: true, // 无需认证的路由
        permitTag: 'userCenter:sysOrgType:list',
        title: '部门类型',
        icon: 'example'
      }
    }
  ]
}

export default componentsRouter
