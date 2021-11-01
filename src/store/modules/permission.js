/**
 * @Description: 权限配置
 * @author Roman
 * @date 2020/5/28
 */
import { asyncRoutes, constantRoutes } from '@/router'
// import * as permissionHandle from 'com-sfabric/lib/permission'
// console.log(permissionHandle.filterRouters)
// console.log(permissionHandle.bySort)
/**
 * Use meta.role to determine if the current user has permission
 * @param roles
 * @param route
 */
function hasPermission(roles, route) {
  if (route.meta && route.meta.roles) {
    return roles.some(role => route.meta.roles.includes(role))
  } else {
    return true
  }
}

/**
 * Filter asynchronous routing tables by recursion
 * @param routes asyncRoutes
 * @param roles
 */
export function filterAsyncRoutes(routes, roles) {
  const res = []

  routes.forEach(route => {
    const tmp = { ...route }
    if (hasPermission(roles, tmp)) {
      if (tmp.children) {
        tmp.children = filterAsyncRoutes(tmp.children, roles)
      }
      res.push(tmp)
    }
  })

  return res
}
function bySort(list, key = 'sort') {
  const newList = list.sort((a, b) => b.meta[key] - a.meta[key])
  newList.map(v => {
    if (v.children && v.children.length) {
      return bySort(v.children)
    }
  })
  return newList
}
function filterRouters(origin, asyncList) {
  let i = origin.length
  while (i--) {
    let obj
    for (let j = 0; j < asyncList.length; j++) {
      const v = asyncList[j]
      if (origin[i].meta && v.permitTag === origin[i].meta.permitTag || origin[i].meta && origin[i].meta.noUseAuth) {
        if (!origin[i].meta.keepOrgin) {
          origin[i].meta.icon = v.icon
          origin[i].meta.title = v.name
          origin[i].meta.sort = v.sort
        }
        obj = v
        break
      }
    }
    if (obj) {
      // if (origin[i].children && obj.child) {
      //   filterRouters(origin[i].children, obj.child)
      if (origin[i].children) {
        filterRouters(origin[i].children, asyncList)
      } else {
        delete origin[i].children
      }
    } else {
      origin.splice(i, 1)
    }
  }
}

const state = {
  routes: [],
  addRoutes: []
}

const mutations = {
  SET_ROUTES: (state, routes) => {
    state.addRoutes = routes
    state.routes = constantRoutes.concat(routes)
  }
}

const _403 = [{ path: '*', redirect: '/403', hidden: true }]
const actions = {
  generateRoutes({ commit }, originPermits) {
    return new Promise((resolve, reject) => {
      const accessedRoutes = asyncRoutes || []
      filterRouters(accessedRoutes, originPermits)
      const list = bySort(accessedRoutes).concat(_403)
      commit('SET_ROUTES', list)
      resolve(list)
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
