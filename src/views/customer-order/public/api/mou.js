/*
 * @Description:
 * @Author: Sun
 * @Date: 2021-04-20 22:36:48
 * @LastEditors: OBKoro1
 * @LastEditTime: 2021-07-14 10:52:01
 */
export const setOrderFun = setOrderFun || {
  methods: {
    // 处理状态数据
    getStatus(data) {
      let status = ''
      switch (data) {
        case '0':
          status = `<span style="color:#FF9214">草稿</span>`
          break
        case '1':
          status = `<span style="color:#FF9214">新单待审</span>`
          break
        case '2':
          status = `<span style="color:#00BCC5">已审核</span>`
          break
        case '3':
          status = `<span style="color:#FF4444">已废弃</span>`
          break
        case '4':
          status = `<span style="color:#FF4444">已驳回</span>`
          break
        case '5':
          status = `<span style="color:#888E9E">取消审核中</span>`
          break
        case '6':
          status = `<span style="color:#888E9E">取消会签中</span>`
          break
        case '7':
          status = `<span style="color:#888E9E">已取消</span>`
          break
        case '8':
          status = `<span style="color:#FF9214">变更审核中</span>`
          break
        case '9':
          status = `<span style="color:#FF9214">变更会签中</span>`
          break
        case '10':
          status = `<span style="color:#FF9214">hold单审核中</span>`
          break
        case '11':
          status = `<span style="color:#FF9214">Hold单会签中</span>`
          break
        case '12':
          status = `<span style="color:#FF9214">Hold单</span>`
          break
        case '13':
          status = `<span style="color:#00BCC5">已完结</span>`
          break
        default:
          status = ''
          break
      }
      return status
    },
    //样板的颜色状态值
    setOrderStatus(data) {
      let dataExamine = [ // 列表状态值
        {
          id: '0',
          text: '草稿',
          statusColor: '#FF9214'
        },
        {
          id: '1',
          text: '新单待审',
          statusColor: '#FF9214'
        },
        {
          id: '2',
          text: '已审核',
          statusColor: '#00BCC5'
        },
        {
          id: '3',
          text: '已废弃',
          statusColor: '#FF4444'
        },
        {
          id: '4',
          text: '已驳回',
          statusColor: '#FF4444'
        },
        {
          id: '5',
          text: '取消待审',
          statusColor: '#888E9E'
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
          text: '已完成',
          statusColor: '#00BCC5'
        }
      ]
      var newArr={}
      var newArr = dataExamine.filter((element) => {
        return element.id === (data + '')
      })
      let cler= {id: '',text: '', statusColor: ''}
      return (newArr&&newArr.length?newArr[0]:"") || cler
    },
    // 获取样板开发详情
    getDevelopType(data) {
      const list = [
        // 样板开发类型 Q：品质办；F：Fit Sample；A：AD Sample；G：试纱办；S：试规格办；L：LA Sample
        {
          label: '品质办',
          value: 'Q'
        },
        {
          label: 'Fit Sample',
          value: 'F'
        },
        {
          label: 'AD Sample',
          value: 'A'
        },
        {
          label: '试纱办',
          value: 'G'
        },
        {
          label: '试规格办',
          value: 'S'
        },
        {
          label: 'LA Sample',
          value: 'L'
        }
      ]
      const index = list.findIndex(n => n.value === data)
      return index !== -1 ? list[index].label : data
    },
    // 处理销售订单类型 大货
    getOrder(data) {
      let str = ''
      switch (data) {
        case 'B':
          str = '大货'
          break
        case 'S':
          str = '销售版'
          break
        case 'T':
          str = '测试样'
          break
        case 'F':
          str = '快反单'
          break
        case 'A':
          str = '备成品'
          break
        default:
          break
      }
      return str
    },
    // 获取样板比例判断
    ratioFun(ratiovValue) {
      const reg = /^\d+\.?\d{0,2}$/
      let newV = ratiovValue ? ratiovValue.split('/') : []
      newV = newV.filter(v => {
        if (v) {
          return true
        }
      })
      const testArr = newV.filter(v => {
        if (reg.test(v)) {
          return true
        }
      }) || []
      let num = 0
      let nsum = true
      const arr = ratiovValue ? ratiovValue.split('/') : []
      arr.forEach(v => {
        if (!v || v * 1 <= 0) {
          nsum = false
        }
        num += v * 1
        num = this.$utils.getFloat(num, 2)
      })
      if (!nsum) {
        return '比例存在小于等于0的数项'
      } else if (num !== 100) {
        return '比例计算总和100'
      } else if (testArr.length !== newV.length) {
        return '比例存在超过两位小数项'
      } else {
        return ''
      }
    },
    // 缩水最大值99的校验
    checkNumFun(value) {
      const reg = /^[1-9]\d*$/
      if (value === 0 || !reg.test(value)) {
        return '缩水请填写正整数'
      } else if (value > 99) {
        return '缩水最大值99'
      } else {
        return ''
      }
    },
    getnaturalFiber (data) {
      let str = ''
      switch (data) {
        case '0':
          str = '天然纤维'
          break
        case '1':
          str = '化学纤维'
          break
        case '2':
          str = '组合纱线'
          break
        default:
          break
      }
      return str
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
    setArrayInfo (it) {
      return it && it.value ?[it]:null
    },
    //克重（洗前）
    weightBeforeFormDatas(formDatas){
      let  pu=[]
        const reg = /^\d+(\.\d{0,2})?$/
        if (formDatas.weightBefore && reg.test(formDatas.weightBefore)) {
          const min = formDatas.minVal
          const max = formDatas.maxVal
          let  value=formDatas.weightBefore
        
          if (value && !reg.test(value)) {
            pu.push('克重（洗前）数字(两位小数)')
          } else if (value && value < min * 1) {
            pu.push(`克重（洗前）范围${min}~${max}`)
          } else if (value && value > max * 1) {
            pu.push(`克重（洗前）范围${min}~${max}`)
          } 
      }
      return pu.length?false:true
    },
    // 克重（洗后） +5
    weightAfterFormDatas(formDatas){
      const reg = /^\d+(\.\d{0,2})?$/
      let  pu=[]
      if (formDatas.weightAfter && reg.test(formDatas.weightAfter)) {
        const min = (formDatas.weightBefore * 1 - 5 <= 0) ? 1 : (formDatas.weightBefore * 1 - 5)
        const max = formDatas.weightBefore * 1 + 5
        let  value=formDatas.weightAfter
    
        if (value && !reg.test(value)) {
          pu.push('克重（洗后）数字(两位小数)')
        } else if (value && value < min * 1) {
          pu.push(`克重（洗后）范围${min}~${max}`)
        } else if (value && value > max * 1) {
          pu.push(`克重（洗后）范围${min}~${max}`)
        } 
    }
    return pu.length?false:true
  },
  // 幅宽
   suggestWidthFormDatas(formDatas){
    let  pu=[]   
     const reg = /^\d+(\.\d{0,2})?$/
      if (formDatas.suggestWidth && reg.test(formDatas.suggestWidth)) {
        const min = formDatas.widthMinVal
        const max = formDatas.widthMaxVal
        let  value=formDatas.suggestWidth
  
        if (value && !reg.test(value)) {
          pu.push('幅宽数字(两位小数)')
        } else if (value && value < min * 1) {
          pu.push(`幅宽范围${min}~${max}`)
        } else if (value && value > max * 1) {
          pu.push(`幅宽范围${min}~${max}`)
        } 
    }
    return pu.length?false:true
  },

  //下栏校验

  NextColumnVerification(data,tm){
    let TextColor=[]
    let com = tm.colorQuantityDeliverySummary && tm.colorQuantityDeliverySummary.colorInfo || [] 
    com.forEach((it, index) => {
      if(it.styleNumber&&!this.setlabel(it.shirtBody)){
        data.forEach((im,ix)=>{
          let com = im.colorQuantityDeliverySummary && im.colorQuantityDeliverySummary.colorInfo || [] 
            com.forEach((iz,ix)=>{
              if(iz.styleNumber&&it.styleNumber===iz.styleNumber){
                TextColor.push("有相同项") 
              }
            })
        })
      }
    })
    return TextColor.length
  },
  //分录弹窗 
  setFabricType(data){ //1-色布 印花隐藏 ；2-花布 2显示 
    let pu=true
    if(data&&data.fabricType){
      pu=!!(data.fabricType==='2')
    }
    return pu
  }
   
 }
}

