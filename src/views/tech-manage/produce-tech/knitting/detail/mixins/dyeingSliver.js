import summary from '../components/summary.vue'
import request from '../components/request.vue'
import colorPreview from '../components/colorPreview.vue'
// import { timeAgo } from '@/filters'
export const dyeingSliver = {
  data() {
    // 公用验证正则
    const commonBlurReg = this.$getRules({ trigger: ['blur'] })
    const commonChangeReg = this.$getRules({ trigger: ['change'] })
    // 1~100且保留两位小数正则
    const moneyReg = this.$getRules({ type: 'number', pattern: /^(\d|[1-9]\d|100)(\.\d{1,2})?$/, message: '0.00~100.00', trigger: ['blur'] })
    // 1-999999.99
    const moneyReg2 = this.$getRules({ type: 'number', pattern: /^([1-9][0-9]{0,7})(\.[1-9]|\.[0-9][0-9])?$/, message: '1~999999.99之间', trigger: ['blur'] })
    // 标题样式
    const style = {
      'font-size': '16px',
      'color': '#151222',
      'margin-bottom': '15px'
    }

    // 原料信息表格表头
    const rawMaterialColumnsInfos = {
      '_id': {
        prop: 'id',
        label: '序号',
        minWidth: '60',
        showOverflowTooltip: true,
        formater: (scope) => {
          return scope.$index + 1
        }
      },
      '_yarnFineness': {
        prop: 'yarnFineness',
        label: '纱支/细度',
        minWidth: '90',
        showOverflowTooltip: true
      },
      '_elementName': {
        prop: 'elementName',
        label: '成份/比例',
        minWidth: '70',
        showOverflowTooltip: true
      },
      '_yarnRatio': {
        prop: 'yarnRatio',
        label: '纱比',
        minWidth: '60',
        showOverflowTooltip: true
      },
      '_isDyed': {
        prop: 'isDyed',
        label: '是否染色',
        minWidth: '100',
        formater: (scope) => {
          if (this.isEdit === 'detail') {
            return scope.row.isDyed === 0 ? '否' : '是'
          }
        },
        // showOverflowTooltip: true
        editOptions: {
          labelWidth: '0',
          itemType: 'select',
          change: (value, form, formDatas, setFormDatas, scope) => {
            // console.log(value, scope, formDatas)
            const dataList = [...formDatas.rawMaterialTable]
            const ids = []
            dataList.forEach((item, i) => {
              const mainId = item.mainId
              if (scope.row.mainId === mainId) {
                ids.push(item)
              }
            })
            if (ids.length > 1) {
              scope.row.isDyedType = 1
            } else {
              scope.row.isDyedType = 1
            }
            console.log(ids)
            let flag = null
            if (value === 0 && scope.row.isDyedType !== 1) {
              flag = true
              this.$set(this.rawMaterialColumnsInfos._colorPreview.componentsOptions, 'popValue', false)
            } else {
              flag = true
            }

            dataList[scope.$index].colorEdit = flag
            dataList[scope.$index].color = ''
            dataList[scope.$index].colorRatioEdit = flag
            dataList[scope.$index].colorRatio = ''
            dataList[scope.$index].colorPreview = ''
            this.$set(this.dyeingSliverPopOptions.content._rawMaterialTable, 'dataSource', dataList)
            this.$set(this.dyeingSliverPopOptions.content._rawMaterialTable.dataSource[scope.$index], 'colorEdit', flag)
          },
          dataSource: [
            {
              value: 0,
              label: '否'
            },
            {
              value: 1,
              label: '是'
            }
          ]
        }
      },
      '_color': {
        prop: 'color',
        label: '染纱颜色',
        minWidth: '100',
        editOptions: {
          labelWidth: '0',
          // readonly: true,
          itemType: 'input',
          rules: [commonChangeReg]
        }
      },
      '_colorRatio': {
        prop: 'colorRatio',
        label: '颜色占比%',
        minWidth: '100',
        editOptions: {
          labelWidth: '0',
          itemType: 'input',
          // inlineMessage: true,
          rules: [commonBlurReg, moneyReg]
        }
      },
      _fabricColorNo: {
        prop: 'fabricColorNo',
        label: '智布色号',
        minWidth: '100',
        showOverflowTooltip: true,
        isShow: () => {
          return !!(this.stripeSpacingData && this.stripeSpacingData.length)
        }
      },
      _p1: {
        prop: 'p1',
        label: '色级',
        minWidth: '60',
        showOverflowTooltip: true,
        isShow: () => {
          return !!(this.stripeSpacingData && this.stripeSpacingData.length)
        }
      },
      // _p2: {
      //   prop: 'p2',
      //   label: '色号类型/编号',
      //   minWidth: '100',
      //   showOverflowTooltip: true,
      //   isShow: () => {
      //     return !!(this.stripeSpacingData && this.stripeSpacingData.length)
      //   }
      // },
      '_colorPreview': {
        prop: 'colorPreview',
        label: '颜色预览',
        minWidth: '80',
        isShow: () => {
          return !!(this.stripeSpacingData && this.stripeSpacingData.length)
        },
        components: {
          colorPreview
        },
        componentsOptions: {
          // popValue: false,
          colorPropName: 'colorPreview',
          noJudgment: true,
          itemClick: (item, scope, formDatas) => {
            console.log('item', scope, item)
            console.log(formDatas)
            const dataList = [...formDatas.rawMaterialTable]
            dataList[scope.$index].colorPreview = item.colorValue
            dataList[scope.$index].color = item.colorName
            dataList[scope.$index].height = item.height
            dataList[scope.$index].fabricColorNo = item.fabricColorNo
            this.$set(this.dyeingSliverPopOptions.content._rawMaterialTable, 'dataSource', dataList)
            const colorDataList = formDatas.rawMaterialTable.reduce((total, item) => {
              if (item.colorPreview && !total.map(item => item.colorValue).includes(item.colorPreview)) {
                total.push({
                  colorValue: item.colorPreview,
                  height: item.height,
                  colorName: item.color,
                  fabricColorNo: item.fabricColorNo
                })
              }
              return total
            }, [])
            console.log(colorDataList)
            this.$set(this.intervalStripColumnsInfos._colorBlock.componentsOptions, 'colorGroups', colorDataList)
          }
        }
      }
    }

    // 原料信息表格操作栏
    const rawMaterialOperates = {
      label: '操作',
      width: '100',
      dataSource: [
        {
          label: '新增',
          isShow: true,
          handle: (params, form, formDatas, setFormDatas) => {
            const data = [...formDatas.rawMaterialTable]
            const { yarnFineness, elementName, yarnRatio, mainId, dyeInfoType } = params.row
            const intervalStripRow = { yarnFineness, elementName, yarnRatio, mainId, dyeInfoType, isDyed: 0, isDyedType: 1, edit: true, colorEdit: true, colorRatioEdit: true }

            data.splice(params.$index + 1, 0, intervalStripRow)

            data[params.$index].isDyedType = 1
            data[params.$index].colorEdit = true
            data[params.$index].colorRatioEdit = true
            data[params.$index].edit = true
            this.dyeingSliverPopOptions.content._rawMaterialTable['dataSource'] = data
          }
        },
        {
          label: '删除',
          style: { 'color': '#FE4949' },
          // isShow: true,
          isShow: (scope) => {
            const dataList = this.dyeingSliverPopOptions.content._rawMaterialTable.dataSource
            const mergingRows = this.dataPretreatment(dataList)
            if (mergingRows[scope.$index]) {
              return false
            } else {
              return true
            }
          },
          handle: (params, form, formDatas, setFormDatas) => {
            console.log(params, formDatas)
            let colorPreviewNum = 0
            const rawMaterialTableData = [...formDatas.rawMaterialTable]
            rawMaterialTableData.forEach(item => {
              if (item.colorPreview === params.row.colorPreview) {
                colorPreviewNum += 1
              }
            })
            if (colorPreviewNum < 2 && params.row.colorPreview) {
              const colorDataList = this.intervalStripColumnsInfos._colorBlock.componentsOptions.colorGroups.filter(item => item.colorValue !== params.row.colorPreview)
              this.$set(this.intervalStripColumnsInfos._colorBlock.componentsOptions, 'colorGroups', colorDataList)
            }
            this.deleteALine(params.$index, formDatas.rawMaterialTable, '_rawMaterialTable')
            console.log(formDatas)
          }
        }
      ]
    }

    // 间条设计表格表头信息
    const intervalStripColumnsInfos = {
      '_id': {
        prop: 'id',
        label: '序号',
        minWidth: '60',
        showOverflowTooltip: true,
        formater: (scope) => {
          return scope.$index + 1
        }
      },
      '_colorBlock': {
        prop: 'colorBlock',
        label: '色块',
        minWidth: '80',
        components: {
          colorPreview
        },
        componentsOptions: {
          // popValue: false,
          colorPropName: 'colorBlock',
          noJudgment: true,
          itemClick: (item, scope, formDatas) => {
            console.log('item', scope, item, formDatas)
            scope.row.colorBlock = item.colorValue
            const productData = this.$parent.$refs.product.$refs.proForm.dynamicValidateFormRuleForm
            const CPIData = productData.cpi || 0
            const module = this.$utils.getFloat(CPIData * item.height / 2.54, 2)
            const intervalStripTableData = [...formDatas.intervalStripTable]
            intervalStripTableData[scope.$index].colorBlock = item.colorValue
            intervalStripTableData[scope.$index].colorPreview = item.colorPreview
            intervalStripTableData[scope.$index].fabricColorNo = item.fabricColorNo

            intervalStripTableData[scope.$index].yarnFineness = []
            intervalStripTableData[scope.$index].height = item.height
            intervalStripTableData[scope.$index].module = module
            this.$set(this.dyeingSliverPopOptions.content._intervalStripTable, 'dataSource', intervalStripTableData)
          }
        }
      },
      '_yarnFineness': {
        prop: 'yarnFineness',
        label: '纱支/细度',
        minWidth: '120',
        editOptions: {
          labelWidth: '0',
          itemType: 'select',
          multiple: true,
          collapseTags: true,
          dataSource: []
        }
      },
      '_height': {
        prop: 'height',
        label: '高度',
        minWidth: '90',
        editOptions: {
          labelWidth: '0',
          itemType: 'input',
          rules: [moneyReg],
          change: (value, form, formDatas, setFormDatas, scope) => {
            console.log(this.$parent.$refs.product)
            const productData = this.$parent.$refs.product.$refs.proForm.dynamicValidateFormRuleForm
            const CPIData = productData.cpi || 0
            const dataList = [...formDatas.intervalStripTable]
            dataList[scope.$index].module = (CPIData * ((isNaN(value) ? 0 : value) / 2.54)).toFixed(2)
            this.$set(this.dyeingSliverPopOptions.content._intervalStripTable, 'dataSource', dataList)
          }
        }
      },
      '_module': {
        prop: 'module',
        label: '模数',
        minWidth: '90',
        editOptions: {
          // inlineMessage: true,
          rules: [moneyReg2],
          labelWidth: '0',
          itemType: 'input'
        }
      }
    }
    // 间条设计表格操作栏
    const intervalStripOperates = {
      label: '操作',
      width: '100',
      dataSource: [
        {
          label: '增加',
          isShow: true,
          handle: (params, form, formDatas, setFormDatas) => {
            console.log(params)
            this.addALine(params.$index, formDatas.intervalStripTable, '_intervalStripTable')
            // this.editHandle(params)
          }
        },
        {
          label: '删除',
          style: { 'color': '#FE4949' },
          isShow: (scope, form, formDatas, setFormDatas) => {
            // if (formDatas.intervalStripTable.length !== 1) {
            //   return true
            // } else {
            //   return false
            // }
            return scope.$index !== 0
          },
          handle: (params, form, formDatas, setFormDatas) => {
            this.deleteALine(params.$index, formDatas.intervalStripTable, '_intervalStripTable')
            // this.delHandle(params)
          }
        }
      ]
    }

    // 单元格合并
    const spanMethod = ({ row, column, rowIndex, columnIndex }) => {
      const dataList = this.dyeingSliverPopOptions.content._rawMaterialTable.dataSource

      // console.log(this.dataPretreatment(dataList))
      const mergingRows = this.dataPretreatment(dataList)
      if (columnIndex >= 0 && columnIndex <= 3) {
        const _row = mergingRows[rowIndex]
        const _col = _row > 0 ? 1 : 0
        return {
          rowspan: _row,
          colspan: _col
        }
      }
    }
    // 染纱/间条弹出框
    const dyeingSliverPopOptions = {
      itemType: 'dialog',
      visible: false,
      width: '70%',
      top: '30px',
      title: '染纱详情',
      drag: true,
      customClass: 'editHeightPopOptionsClass',
      ok: params => {
        console.log(params)
        // this.edit(params)
        this.fringeSpacing = params
        // 校验必有一项为是 并且染纱颜色和颜色占比不能为空

        if (this.stripeSpacingData && this.stripeSpacingData.length) {
          // 如果有颜色预览则校验颜色预览不能为空
          const rawMaterialTable = params.rawMaterialTable.find(v => v.isDyed === 1 && v.colorPreview)
          if (!rawMaterialTable) {
            return this.$message.error('原料信息，至少有一项 "是否染色为是"并且染纱颜色、颜色占比、颜色预览不能为空')
          }
          // 如果条件间距要求不为空，间条信息必填一条，并且色块，纱支/细度，高度，模数不能为空
          const stripeSpacingData = params.intervalStripTable.find(v => v.colorBlock && v.height && v.module)
          if (!stripeSpacingData) {
            return this.$message.error('原料信息，间条信息必填一条，并且色块，纱支/细度，高度，模数不能为空')
          }
        } else {
          const rawMaterialTable = params.rawMaterialTable.find(v => v.isDyed)
          if (!rawMaterialTable) {
            return this.$message.error('原料信息，至少有一项 "是否染色为是"并且染纱颜色、颜色占比')
          }
        }
        const yarnOrFinenessColor = {}
        params.rawMaterialTable.forEach(item => {
          if (item.colorPreview) {
            if (yarnOrFinenessColor[item.colorPreview]) {
              yarnOrFinenessColor[item.colorPreview].push(item.yarnFineness)
            } else {
              yarnOrFinenessColor[item.colorPreview] = [item.yarnFineness]
            }
          }
        })
        console.log('yarnOrFinenessColor', yarnOrFinenessColor)
        let yarnOrFinenessFlag = false;
        (params.intervalStripTable && params.intervalStripTable.length) && params.intervalStripTable.some(item => {
          // debugger
          if (item.colorBlock) {
            yarnOrFinenessFlag = item.yarnFineness.length ? item.yarnFineness.some(someItem => {
              // debugger
              if (!someItem) {
                return true
              } else {
                return !yarnOrFinenessColor[item.colorBlock].includes(someItem)
              }
            }) : true
            return yarnOrFinenessFlag
          } else {
            return true
          }
        })

        if (yarnOrFinenessFlag) {
          this.$message.error('间条信息所选纱支/细度在原料信息无对应匹配, 请选择原料信息里对应的纱支/细度和颜色预览。')
          return false
        }
        // const rawMaterialTable = params.rawMaterialTable
        // const intervalStripTable = params.intervalStripTable

        // 原料要求的数据处理
        const dataIndex = ['naturalData', 'chemicalData', 'composeYarns']
        const dataName = { 'naturalData': [], 'chemicalData': [], 'composeYarns': [] }
        params.rawMaterialTable.forEach((item, index) => {
          const keyName = dataIndex[item.dyeInfoType - 1]
          const oneRowData = { mainId: item.mainId, dyeInfoType: item.dyeInfoType, isDyed: item.isDyed, color: item.color, isDyedType: item.isDyedType, colorRatio: item.colorRatio, colorPreview: item.colorPreview, height: item.height }
          if (index === 0) {
            // debugger
            dataName[keyName].push({ ...item, dyeInfoInfoRespList: [oneRowData] })
          } else {
            if (item.mainId === params.rawMaterialTable[index - 1].mainId && item.dyeInfoType === params.rawMaterialTable[index - 1].dyeInfoType) {
              console.log(dataName, keyName, dataName[keyName])
              dataName[keyName][dataName[keyName].length - 1].dyeInfoInfoRespList.push(oneRowData)
            } else {
              dataName[keyName].push({ ...item, dyeInfoInfoRespList: [oneRowData] })
            }
          }
        })
        console.log(dataName)
        // debugger
        const allData = [...dataName.naturalData, ...dataName.chemicalData, ...dataName.composeYarns]
        let isItEqual = true
        allData.forEach(item => {
          let isDyedArr = false
          const totalNum = this.$utils.getFloat(item.dyeInfoInfoRespList.reduce((total, item) => {
            if (item.isDyed === 1 || item.isDyedType === 1) {
              isDyedArr = true
            }
            const tempNum = (item.colorRatio || 0) * 1
            total += tempNum
            return total
          }, 0), 2)
          // debugger
          if (isDyedArr) {
            if (this.$utils.getFloat(item.yarnRatio * 1, 2) !== totalNum) {
              console.log(this.$utils.getFloat(item.yarnRatio * 1, 2), totalNum)
              isItEqual = false
              return false
            }
          }
        })

        const designData = params.intervalStripTable && params.intervalStripTable.map((item, index) => {
          return {
            seq: index,
            ...item,
            yarnFineness: (item.yarnFineness && item.yarnFineness.length) ? item.yarnFineness.join(',') : ''
          }
        })
        // debugger
        if (isItEqual) {
          this.naturalData = dataName.naturalData
          this.chemicalData = dataName.chemicalData
          this.composeYarns = dataName.composeYarns
          this.designData = designData
          console.log(this.designData)

          this.$message.success('染纱/间条保存成功')
          this.$set(this.dyeingSliverPopOptions, 'visible', false)
        } else {
          this.$message.error('颜色占比相加不等于纱比')
        }
      },
      okText: '保存',
      cancel: params => {
        // this.PopDialogHandle()
        this.$set(this.dyeingSliverPopOptions, 'visible', false)
        // console.log(params)
      },
      formDatas: {},
      formOptions: {
      },
      content: {
        '_request': {
          prop: 'request',
          label: '',
          components: {
            request
          },
          componentsOptions: {}
        },
        '_rawMaterialView': {
          itemType: 'view',
          text: `原料信息`,
          style
        },
        '_rawMaterialTable': {
          prop: 'rawMaterialTable',
          headerCellStyle: { 'background-color': '#F5F7FA' },
          className: 'rawMaterialTable-table',
          itemType: 'table-form',
          label: '',
          labelWidth: '0',
          spanMethod: spanMethod,
          dataSource: [
            // { yarnFineness: 'yyy', elementName: 'zzz', yarnRatio: 'ccc', edit: true, isDyed: 0, colorEdit: false, colorRatioEdit: false },
            // { yarnFineness: 'YYY', elementName: 'ZZZ', yarnRatio: 'CCC', edit: true, isDyed: 0, colorEdit: false, colorRatioEdit: false }
          ],
          columns: rawMaterialColumnsInfos,
          operates: rawMaterialOperates,
          tooltipEffect: 'light'
          // pagination: businessOpportunityPagination
        },
        '_intervalStripView': {
          itemType: 'view',
          text: `间条信息`,
          style,
          isShow: () => {
            // 如果条纹间距要求为空则不显示
            return this.stripeSpacingData && this.stripeSpacingData.length
            // return true
          }
        },
        _stripeRange: {
          prop: 'stripeRange',
          label: '',
          itemType: 'itemview',
          width: 60,
          labelWidth: '0',
          showOverflowTooltip: true,
          itemStyle: {
            'width': '60px',
            'position': 'absolute',
            'right': '10px',
            'top': '10px',
            'margin': '0',
            'text-align': 'center'
          },
          isShow: () => {
            // 如果条纹间距要求为空则不显示
            return this.stripeSpacingData && this.stripeSpacingData.length
            // return true
          }
        },
        '_intervalStripTable': {
          prop: 'intervalStripTable',
          headerCellStyle: { 'background-color': '#F5F7FA' },
          className: 'rawMaterialTable-table',
          itemType: 'table-form',
          label: '',
          labelWidth: '0',
          dataSource: [],
          columns: intervalStripColumnsInfos,
          operates: intervalStripOperates,
          tooltipEffect: 'light',
          isShow: () => {
            // 如果条纹间距要求为空则不显示
            return this.stripeSpacingData && this.stripeSpacingData.length
            // return true
          }
          // pagination: businessOpportunityPagination

        },
        '_summaryView': {
          itemType: 'view',
          text: `汇总`,
          style
        },
        '_type': {
          prop: 'type',
          label: '',
          components: {
            summary
          },
          componentsOptions: {}
        }
      }
    }
    return {
      dyeingSliverPopOptions,
      rawMaterialColumnsInfos,
      intervalStripColumnsInfos,
      fringeSpacing: {},
      rawMaterialOperates,
      intervalStripOperates
    }
  },
  methods: {
    dyeingSliverValid() {
      // 天然纤维数据处理
      const isDyedFlag = false
      const naturalData = this.naturalData.map(item => {
        const tempData = (item.dyeInfoInfoRespList && item.dyeInfoInfoRespList.length !== 0) ? item.dyeInfoInfoRespList.map(item => {
          let flag = false
          if (isDyedFlag) {
            if (item.isDyed === 0) {
              flag = true
            } else {
              flag = true
            }
          }
          return {
            edit: isDyedFlag,
            ...item,
            colorEdit: flag,
            colorRatioEdit: flag
          }
        }) : [{ edit: isDyedFlag, isDyed: 0, mainId: item.id, dyeInfoType: 1, colorEdit: false, colorRatioEdit: false }]
        // const zzz = [{ edit: true, isDyed: 0, isDyedEdit: true, colorEdit: false, colorRatioEdit: isDyedFlag }]
        return tempData.map(itemValue => {
          return {
            ...item,
            // dataId: 1,
            yarnFineness: item.yarnInfo ? item.yarnInfo.label : '',
            elementName: item.elementInfo ? item.elementInfo.label : '',
            ...itemValue
          }
        })
      }).flat()
      // 化学纤维数据处理
      const chemicalData = this.chemicalData.map(item => {
        const tempData = (item.dyeInfoInfoRespList && item.dyeInfoInfoRespList.length !== 0) ? item.dyeInfoInfoRespList.map(item => {
          let flag = false
          if (isDyedFlag) {
            if (item.isDyed === 0) {
              flag = true
            } else {
              flag = true
            }
          }
          return {
            edit: isDyedFlag,
            ...item,
            colorEdit: flag,
            colorRatioEdit: flag
          }
        }) : [{ edit: isDyedFlag, isDyed: 0, mainId: item.id, dyeInfoType: 2, colorEdit: false, colorRatioEdit: false }]
        return tempData.map(itemValue => {
          return {
            ...item,
            // dataId: 2,
            yarnFineness: item.finenessInfo ? item.finenessInfo.label : '',
            elementName: item.elementInfo ? item.elementInfo.label : '',
            ...itemValue
          }
        })
      }).flat()
      // 组合数据处理
      const composeYarnsData = this.composeYarns.map(item => {
        const yarnFinenessData = [...(item.naturalFiberUpdateReqtList || []).map(item => item.yarnInfo ? item.yarnInfo.label : ''), ...(item.chemicalFiberUpdateReqtList || []).map(item => item.finenessInfo ? item.finenessInfo.label : '')]

        const elementNameData = [...(item.naturalFiberUpdateReqtList || []), ...(item.chemicalFiberUpdateReqtList || [])].map(item => item.elementInfo ? item.elementInfo.label : '')

        const tempData = (item.dyeInfoInfoRespList && item.dyeInfoInfoRespList.length !== 0) ? item.dyeInfoInfoRespList.map(item => {
          let flag = false
          if (isDyedFlag) {
            if (item.isDyed === 0) {
              flag = true
            } else {
              flag = true
            }
          }
          return {
            edit: isDyedFlag,
            ...item,
            colorEdit: flag,
            colorRatioEdit: flag
          }
        }) : [{ edit: isDyedFlag, isDyed: 0, mainId: item.id, dyeInfoType: 3, colorEdit: false, colorRatioEdit: false }]
        return tempData.map(itemValue => {
          return {
            ...item,
            // dataId: 3,
            yarnFineness: yarnFinenessData.join('|'),
            elementName: elementNameData.join('|'),
            ...itemValue
          }
        })
      }).flat()
      console.log('组装数据', naturalData, chemicalData, composeYarnsData)
      const datas = [...naturalData, ...chemicalData, ...composeYarnsData]
      let errSrr = ''
      datas.length > 1 && datas.some(v => {
        if (!v.color || !v.colorRatio) {
          errSrr = '条纹间距未填写'
        }
      })
      return errSrr
    },
    // 添加一行
    addALine(index, formDatas, formTable) {
      const data = [...formDatas]
      const intervalStripRow = { edit: true }
      data.splice(index + 1, 0, intervalStripRow)
      this.dyeingSliverPopOptions.content[formTable]['dataSource'] = data
    },

    // 删除一行
    deleteALine(index, formDatas, formTable) {
      const data = [...formDatas]
      data.splice(index, 1)
      const cache = {} // 下标
      const indices = [] // 数组
      data.forEach((item, i) => {
        const mainId = item.mainId
        const index = cache[mainId]
        if (index !== undefined) {
          indices[index].push(item)
        } else {
          cache[mainId] = indices.length
          indices.push([item])
        }
      })
      for (let i = 0; i < indices.length; i++) {
        const item = indices[i]
        for (let k = 0; k < item.length; k++) {
          if (item.length > 1) {
            item[k].isDyedType = 1
            item[k].colorEdit = true
            item[k].colorRatioEdit = true
            item[k].edit = true
          } else {
            if (item[k].isDyed === 0) {
              item[k].colorRatio = ''
              item[k].color = ''
              item[k].isDyedType = 1
              item[k].colorEdit = true
              item[k].colorRatioEdit = true
              item[k].edit = true
            } else {
              item[k].isDyedType = 1
              item[k].colorEdit = true
              item[k].colorRatioEdit = true
              item[k].edit = true
            }
          }
        }
      }
      const newArr = []
      for (let i = 0; i < indices.length; i++) {
        newArr.push(...indices[i])
      }
      this.dyeingSliverPopOptions.content[formTable]['dataSource'] = newArr
    },

    // 处理表格的合并的数据，找到要合并的数组
    dataPretreatment(data) {
      // 注意因为需要多次处理后台数据合并 所以合并前初始化这两个
      const mergingRows = []
      let mergingPos = 0
      for (let i = 0; i < data.length; i++) {
        // data传入的表格数据源
        if (i === 0) {
          mergingRows.push(1)
          mergingPos = 0
        } else {
          if (data[i].yarnFineness && data[i - 1].yarnFineness) {
            // 哪些数据是要合并的 合并的条件是什么
            if (data[i].yarnFineness === data[i - 1].yarnFineness && data[i].elementName === data[i - 1].elementName && data[i].yarnRatio === data[i - 1].yarnRatio && data[i].mainId === data[i - 1].mainId) {
              mergingRows[mergingPos] += 1
              mergingRows.push(0)
            } else {
              mergingRows.push(1)
              mergingPos = i
            }
          } else {
            mergingRows.push(1)
            mergingPos = i
          }
        }
      }
      return mergingRows
    }
  }
}
