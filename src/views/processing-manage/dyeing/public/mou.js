/*
 * @Description: 
 * @Author: Sun
 * @Date: 2021-04-20 22:36:48
 * @LastEditors: anthony
 * @LastEditTime: 2021-06-24 10:57:55
 */
export const setOrderFun = setOrderFun || {
  methods: {
    // 处理状态数据
    getStatus(data) {
      let status = ''
      switch (data) {
        case 'W':
          status = `<span style="color:#FF9214">待提交</span>`
          break
        case 'S':
          status = `<span style="color:#00BCC5">已提交</span>`
          break
        case 'R':
          status = `<span style="color:#FF4444">已撤回</span>`
          break
        case 'F':
          status = `<span style="color:#00BCC5">已完工</span>`
          break
        case 'C':
          status = `<span style="color:#888E9E">已取消</span>`
          break
        default:
          status = ''
          break
      }
      return status
    },
    // 染纱需求 弹窗生成唯一标识 成品编码+色纱编码+计划交期
    setIDCode(data){
      let samedemandDetailUuid = data.demandDetailUuid
      // let code=data.skuId||""
      // let dateIndex=data.planDelivery||0
      return samedemandDetailUuid
      // return code+"-"+dateIndex
    },
    // 对象的纯文本展示
    setInfoValue (it) {
      if (it && it.value) {
        it.value = it.value !== null ? it.value : ''
      } else {
        it = ''
      }
      return it
    },
    setlabel (data) {
      let sm = data && data.label ? data.label : ""
      return sm
    },
  }
}

