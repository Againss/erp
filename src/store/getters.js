/**
 * @Description: 公共getters
 * @author Roman
 * @date 2020/5/28
*/
const getters = {
  sidebar: state => state.app.sidebar,
  size: state => state.app.size,
  cacheMax: state => state.settings.cacheMax,
  device: state => state.app.device,
  visitedViews: state => state.tagsView.visitedViews,
  cachedViews: state => state.tagsView.cachedViews,
  token: state => state.user.token,
  avatar: state => state.user.avatar,
  name: state => state.user.name,
  realName: state => state.user.realName,
  introduction: state => state.user.introduction,
  loadingAnimation: state => state.settings.loadingAnimation,
  roles: state => state.user.roles,
  permits: state => state.user.permits,
  userId: state => state.user.userId,
  permission_routes: state => state.permission.routes,
  errorLogs: state => state.errorLog.logs
}
export default getters
