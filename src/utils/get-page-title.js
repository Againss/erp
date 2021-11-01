/**
 * @Description: 获取页面title
 * @author Roman
 * @date 2020/5/28
*/
import defaultSettings from '@/settings'
import i18n from '@/lang'
const title = defaultSettings.title || ''

// 获取菜单名
export default function getTitle(item, flag) {
  const tit = flag ? ` - ${title}` : ''
  const path = item.meta._path
  if (i18n.te(path)) {
    return `${i18n.t(path)}${tit}`
  }
  return `${item.meta.title}${tit}`
}
