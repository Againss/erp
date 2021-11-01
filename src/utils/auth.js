/**
 * @Description: 获取认证token
 * @author Roman
 * @date 2020/5/28
*/
import Cookies from 'js-cookie'

// const TokenKey = 'Admin-Token'
const token = 'token'

export function getToken(name = token) {
  return Cookies.get(name)
}
export function getStorageToken(name = token) {
  return localStorage.getItem(name)
}
export function setToken({ name = token, value, domain }) {
  return Cookies.set(name, value, { domain })
}
export function setStorageToken({ name = token, value }) {
  return localStorage.setItem(name, value)
}
export function removeToken(name = token) {
  return Cookies.remove(name)
}
export function removeStorageToken(name = token) {
  return localStorage.removeItem(name)
}
export function setCookie(name, value, expires, path = '/') {
  return Cookies.set(name, value, { expires, path })
}
