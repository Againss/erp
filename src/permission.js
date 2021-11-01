/**
 * @Description: 路由权限配置
 * @author Roman
 * @date 2020/5/28
*/
import router from './router'
import store from './store'
// import { Message } from 'element-ui'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import { getToken } from '@/utils/auth' // get token from cookie
import { resetKeepAlive, resetRepeat } from '@/utils'
import getTitle from '@/utils/get-page-title'
// import jwt from 'jsonwebtoken'
NProgress.configure({ showSpinner: false }) // NProgress Configuration.
import { removeStorageToken } from '@/utils/auth'
import request from '@/utils/request'
const whiteList = ['/jump'] // no redirect whitelist

router.beforeEach(async(to, from, next) => {
  // start progress bar
  NProgress.start()
  // set page title
  document.title = getTitle(to, 'isTitle')
  if (to.meta) {
    to.meta.matchedOrigin = [...to.matched]
  }
  resetKeepAlive(to)
  resetRepeat(request.noRepeat)
  // determine whether the user has logged in
  const hasToken = getToken()
  if (hasToken) {
    // if (to.path === '/login') {
    //   // if is logged in, redirect to the home page
    //   next({ path: '/' })
    //   NProgress.done()
    // } else {
    // determine whether the user has obtained his permission roles through getInfo
    const userId = store.getters.userId
    if (userId) {
      next()
      // store.commit('app/SET_FAVICONUM')
    } else {
      try {
        // get user info
        // const userInfo = jwt.decode(hasToken)
        await store.dispatch('user/getInfo')
        next({ ...to, replace: true })
        const originPermits = await store.dispatch('user/getPermits')
        // generate accessible routes map based on roles
        const accessRoutes = await store.dispatch('permission/generateRoutes', originPermits)
        // dynamically add accessible routes
        router.addRoutes(accessRoutes)
        store.dispatch('user/initData')
        // hack method to ensure that addRoutes is complete
        // set the replace: true, so the navigation will not leave a history record
      } catch (error) {
        console.log(error)
        debugger
        // remove token and go to login page to re-login
        // await store.dispatch('user/resetToken')
        // Message.error(error || 'Has Error')
        // next(`/`)
        NProgress.done()
        if (!/40[1,2,5,6,7]$/.test(error.toString())) {
          await store.dispatch('user/logout')
        }
      }
    }
    // }
  } else {
    /* has no token*/
    removeStorageToken('userInfo')
    removeStorageToken('permitList')
    removeStorageToken('systemList')
    removeStorageToken('authLists')
    if (whiteList.indexOf(to.path) !== -1) {
      // in the free login whitelist, go directly
      next()
    } else {
      // other pages that do not have permission to access are redirected to the login page.
      // next(`/login?redirect=${to.path}`)
      location.href = process.env.VUE_APP_LOGIN
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  // finish progress bar
  NProgress.done()
})
