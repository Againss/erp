/*
 * @Description: 
 * @Author: Sun
 * @Date: 2021-04-20 22:36:48
 * @LastEditors: OBKoro1
 * @LastEditTime: 2021-06-19 13:58:29
 */
import { isArray } from '@/utils/validate'
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
          status = `<span style="color:#FF4444">已回撤</span>`
          break
        case 'C':
          status = `<span style="color:#888E9E">已取消</span>`
          break
        case 'F':
          status = `<span style="color:#00BCC5">已完工</span>`
          break
        default:
          status = ''
          break
      }
      return status
    },
    //样板的颜色状态值
    setOrderStatus (data) {
      let dataExamine = [ // 列表状态值
        {
          status: 'W',
          text: '待提交',
          statusColor: '#FF9214'
        },
        {
          status: 'S',
          text: '已提交',
          statusColor: '#00BCC5'
        },
        {
          status: 'R',
          text: '已回撤',
          statusColor: '#FF4444'
        },
        {
          status: 'C',
          text: '已取消',
          statusColor: '#888E9E'
        },
        {
          status: 'F',
          text: '已完工',
          statusColor: '#00BCC5'
        }
      ]
      var newArr = []
      newArr = dataExamine.filter((element) => {
        return element.status === data
      })
      let cler = { id: '', text: '', statusColor: '' }
      return (newArr && newArr.length ? newArr[0] : "") || cler
    },
    // 染纱需求 弹窗生成唯一标识 成品编码+色纱编码+计划交期
    setIDCode(data){
      let code=data.skuId||""
      let yan=data.yarnId||""
      let dateIndex=  data.planDelivery ? this.$filters.parseTime(data.planDelivery + '', '{y}-{m}-{d}') : '-' ||0
      return code+"-"+yan+"-"+dateIndex
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
    // 文件字符串化
    setUploadData(data) {
      let attachStr = []
      if (data&& isArray(data)) {
        data.forEach((item) => {
          let obj={}
          obj.name=item.name
          if (item.response && item.response.data) {
            obj.id=item.response.data.id
            obj.viewUrl=item.response.data.viewUrl
          }
          attachStr.push(obj) 
        })
      }
      console.log("op",attachStr)
      return JSON.stringify(attachStr)
    },

  // 文件字符串化
  setUploadFile(data, im) {
    if (data) {
      if (data&&isArray(data)) {
        let attachStr = ''
        data.forEach((item, index) => {
          if (item.response && item.response.data) {
            attachStr = attachStr + item.response.data.id + ','
          } else if (item.id) {
            attachStr = attachStr + item.id + ','
          }
        })
        return attachStr.substring(0, attachStr.lastIndexOf(','))
      }
    } else { return '' }
  },
  DigitalVerification(tm){
    return (tm === null || tm === undefined|| tm === '') ? '-' : this.$utils.getFloat(tm, 2)
  },

  }
}

