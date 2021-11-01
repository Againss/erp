/**
 * @Description: srm数据配置
 * @author Roman
 * @date 2020/6/18
*/

const state = {
  /* 新增部门 */
  addDepartment: []
}

const mutations = {
  ADD_DEPARTMENT(state, data) {
    console.log('data', data)
    state.addDepartment = data
  }
}

const actions = {

}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
