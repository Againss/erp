/**
 * @Description: UI公共方法
 * @author Roman
 * @date 2020/5/28
 */
/**
 * Parse the time to string
 * @param {(Object|string|number)} time
 * @param {string} cFormat
 * @returns {string | null}
 */
import { MessageBox, Message } from 'element-ui'

/**
 * @Description: 统一操作提示
 * @author Roman
 * @date 2021-06-02 14:23:28
 * @edit 2021-06-02 14:23:28
*/
export async function confirmMsg(data = {}) {
  return await new Promise((resolve, reject) => {
    MessageBox.confirm(`${data.message || '确认删除该条数据吗？'}`, `${data.title || '提示'}`, {
      distinguishCancelAndClose: data.distinguishCancelAndClose, // 区分colse及取消
      confirmButtonText: `${data.confirmButtonText || '确定'}`,
      cancelButtonText: `${data.cancelButtonText || '取消'}`,
      type: `${data.type || 'warning'}`,
      cancelButtonClass: `${data.cancelButtonClass || 'btn-cancel'}`,
      confirmButtonClass: `${data.confirmButtonClass || 'btn-confirm  '}`
    }).then(() => {
      resolve(true)
    }).catch(() => {
      Message({
        type: `${data.cancelType || 'info'}`,
        message: `${data.cancelMessage || '已取消删除'}`
      })
      resolve(false)
    })
  })
}
