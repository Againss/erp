/*
 * @Author: xj
 * @Description: 列表样式
 * @Date: 2021-05-19 10:49:34
 * @LastEditors: OBKoro1
 * @LastEditTime: 2021-05-26 16:33:05
 * @FilePath: e:\erpmu\erp2-customer-order-v2.0.1\src\views\customer-order\board-application\api\com.js
 */
export const setOrderFun = setOrderFun || {
  methods: {
    // 处理状态数据
    getStatusFun(data) {
      let status = ''
      switch (data) {
        case 0:
          status = `<span style="color:#FF9214">草稿</span>`
          break
        case 1:
          status = `<span style="color:#FF9214">待审核</span>`
          break
        case 2:
          status = `<span style="color:#FF4444">已驳回</span>`
          break
        case 3:
          status = `<span style="color:#00BCC5">进行中</span>`
          break
        case 4:
          status = `<span style="color:#888E9E">已取消</span>`
          break
        case 5:
          status = `<span style="color:#00BCC5">已完结</span>`
          break
        default:
          status = ''
          break
      }
      return status
    },
    // 样板的颜色状态值
    setOrderStatus(data) {
      const dataExamine = [ // 列表状态值
        {
          id: '0',
          text: '草稿',
          statusColor: '#FF9214'
        },
        {
          id: '1',
          text: '待审核',
          statusColor: '#FF9214'
        },
        {
          id: '2',
          text: '已驳回',
          statusColor: '#00BCC5'
        },
        {
          id: '3',
          text: '进行中',
          statusColor: '#00BCC5'
        },
        {
          id: '4',
          text: '已取消',
          statusColor: '#888E9E'
        },
        {
          id: '5',
          text: '已完结',
          statusColor: '#00BCC5'
        },
        {
          id: '6',
          text: '取消会签中',
          statusColor: '#888E9E'
        },
        {
          id: '7',
          text: '已取消',
          statusColor: '#888E9E'
        },
        {
          id: '8',
          text: '变更审核中',
          statusColor: '#FF9214'
        },
        {
          id: '9',
          text: '变更会签中',
          statusColor: '#FF9214'
        },
        {
          id: '10',
          text: 'Hold单审核中',
          statusColor: '#FF9214'
        },
        {
          id: '11',
          text: 'Hold单会签中',
          statusColor: '#FF9214'
        },
        {
          id: '12',
          text: 'Hold单',
          statusColor: '#FF9214'
        },
        {
          id: '13',
          text: '已完结',
          statusColor: '#00BCC5'
        }
      ]
      var newArr = []
      newArr = dataExamine.filter((element) => {
        return element.id === (data + '')
      })
      const cler = { id: '', text: '', statusColor: '' }
      return (newArr && newArr.length ? newArr[0] : '') || cler
    },
    // 对象的纯文本展示
    setInfoValue(it) {
      if (it && it.value) {
        it.value = it.value !== null ? it.value : ''
      } else {
        it = ''
      }
      console.log('xiaoj', it)
      return it
    },
    setlabel(data) {
      const sm = data && data.label ? data.label : ''
      return sm
    }
  }
}
