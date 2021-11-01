
export const brandPopOptions = {
  data() {
    // 公用验证正则
    const commonChangeReg = this.$getRules({})
    const commonBlurReg = this.$getRules({ trigger: ['blur'] })
    const maxNumberReg = this.$getRules({
      type: 'number',
      pattern: /^[1-9]\d{0,2}(?:\.\d{0,1})?$/,
      message: '请输入1.0-999.9',
      trigger: ['blur']
    })
    // const itemStyle = { width: '33%', 'margin-right': '0' }
    // 单元格合并
    const spanMethod = ({ row, column, rowIndex, columnIndex }) => {
      const dataList = this.brandPopOptions.content._qaFinishedFabricPhysicalBrandStandardItemsList.dataSource
      const mergingRows = this.getSpanArr(dataList)
      if (columnIndex === 0 || columnIndex === 1) {
        const _row = mergingRows[rowIndex]
        const _col = _row > 0 ? 1 : 0
        return {
          rowspan: _row,
          colspan: _col
        }
      }
    }
    // 品牌标准
    // 弹框表格操作配置
    const brandOperates = {
      label: '操作',
      width: '70',
      isShow: scope => this.isEdit,
      dataSource: [
        {
          label: '删除',
          style: { 'color': '#FE4949' },
          isShow: true,
          handle: (params, form, formDatas, setFormDatas) => {
            const dataList = [...formDatas.qaFinishedFabricPhysicalBrandStandardItemsList]
            dataList.splice(params.$index, 1)
            // setFormDatas({ qaFinishedFabricPhysicalBrandStandardItemsList: dataList })
            this.$set(this.brandPopOptions.content._qaFinishedFabricPhysicalBrandStandardItemsList, 'dataSource', dataList)
          }
        }
      ]
    }
    // 弹框 品牌弹框
    const brandPopOptions = {
      itemType: 'drawer',
      visible: false,
      title: '新增',
      customClass: 'popOptionsClass',
      size: '40%',
      ok: params => {
        if (this.brandPopOptions.okText === '编辑') {
          this.type = 'edit'
          this.$set(this.brandPopOptions, 'title', '修改品牌标准')
          this.isEdit = true
          this.getInfo({ id: params.id })
          this.$set(this.brandPopOptions, 'okText', '保存')
        } else {
          const datas = params && params.qaFinishedFabricPhysicalBrandStandardItemsList
          if (datas && datas.length !== 0) {
            const map = new Map()
            for (let j = 0; j < datas.length; j++) {
              if (datas[j].testMethod && !map.get(datas[j].firstItemsId)) {
                map.set(datas[j].firstItemsId, datas[j].testMethod)
              }
            }
            for (let i = 0; i < datas.length; i++) {
              datas[i].testMethod = map.get(datas[i].firstItemsId)
            }
            console.log({ ...params, qaFinishedFabricPhysicalBrandStandardItemsList: datas })
            this.addOrEdit({ ...params, qaFinishedFabricPhysicalBrandStandardItemsList: datas })
          } else {
            this.$message.warning('请新增一条记录')
          }
        }
      },
      okText: '保存',
      cancel: params => {
        console.log(params)
        this.brandPopOptions.visible = false
      },
      formDatas: {},
      formOptions: {
        inline: true,
        labelWidth: '90px',
        size: 'small',
        popError: true,
        validate: (flag, res, err) => {
          // console.log(flag, res, err)
        }
      },
      content: {
        _brand: {
          prop: 'brand',
          // itemType: 'select',
          itemType: this.selectTypeChange,
          valueType: 'object',
          clearable: true,
          filterable: true,
          label: '品牌',
          showOverflowTooltip: true,
          rules: [commonChangeReg],
          itemStyle: { width: '40%', 'margin-right': '0' },
          labelWidth: '60px',
          dataSource: [],
          visibleChange: (flag) => {
            if (flag) {
              this.getBrandSelet()
            }
          },
          renderContent: (value) => {
            return value ? value.label : ''
          },
          renderOptions: (item) => {
            return `<span style="display: block;width:200px;overflow: hidden;white-space: nowrap;text-overflow: ellipsis;">${item.label}</span>`
          }
        },
        _clothType: {
          prop: 'clothType',
          // itemType: 'select',
          itemType: this.selectTypeChange,
          valueType: 'object',
          clearable: true,
          filterable: true,
          label: '成衣类型',
          rules: [commonChangeReg],
          itemStyle: { width: '30%', 'margin-right': '0' },
          dataSource: [],
          visibleChange: (flag) => {
            if (flag) {
              this.getOptionConfig()
            }
          },
          renderContent: (value) => {
            return value ? value.label : ''
          }
        },
        _referenceStandard: {
          prop: 'referenceStandard',
          itemType: 'select',
          valueType: 'object',
          clearable: true,
          filterable: true,
          label: '引用标准',
          itemStyle: { width: '30%', 'margin-right': '0' },
          isShow: scope => this.isEdit,
          dataSource: [],
          change: (value, form, formDatas, setFormDatas, scope) => {
            if (value && value.id) {
              this.getInfo({ id: value.id }, 'reference')
            }
          },
          clear: () => {
            console.log('000')
          }
        },
        _addBtn: {
          prop: 'addBtn',
          itemType: 'view',
          text: '新增项目',
          className: 'brand-standards-add',
          isShow: scope => this.isEdit,
          handle: (scope, form, formDatas, setFormDatas) => {
            // this.$set(this.popOptionsAdd, 'visible', true)
            // 获取下拉选择

            this.physicalTestItemsLsit({ parentId: 0 }, 0)
          }
        },
        _qaFinishedFabricPhysicalBrandStandardItemsList: {
          prop: 'qaFinishedFabricPhysicalBrandStandardItemsList',
          headerCellStyle: { 'background-color': '#F5F7FA' },
          className: 'brand-standards-pop-table',
          itemType: 'table-form',
          label: '',
          labelWidth: '0',
          itemStyle: { 'width': '100%' },
          border: true,
          spanMethod: spanMethod,
          syncFormDatasToDataSource: false,
          cellStyle: { background: '#fff' },
          dataSource: [],
          columns: {
            _firstItemsName: {
              prop: 'firstItemsName',
              label: '一级项目',
              className: 'rules-class-name',
              showOverflowTooltip: true
            },
            _testMethod: {
              prop: 'testMethod',
              label: '测试方法',
              className: 'redStar inputBottom',
              editOptions: {
                labelWidth: '0',
                itemType: 'input',
                placeholder: '请输入',
                maxlength: 50
              }
            },
            _secondardItemsName: {
              prop: 'secondardItemsName',
              label: '二级项目',
              showOverflowTooltip: true
            },
            _claim: {
              prop: 'claim',
              label: '要求',
              showOverflowTooltip: true,
              className: 'rules-class-name',
              editOptions: {
                labelWidth: '0',
                itemType: 'input',
                placeholder: '请输入',
                maxlength: 50,
                rules: [commonBlurReg]
              }
            },
            _remarks: {
              prop: 'remarks',
              label: '备注',
              showOverflowTooltip: true,
              editOptions: {
                labelWidth: '0',
                itemType: 'input',
                placeholder: '请输入',
                maxlength: 200
              }
            }
          },
          operates: brandOperates,
          tooltipEffect: 'dark'
        }
      }
    }

    return {
      commonChangeReg,
      commonBlurReg,
      maxNumberReg,
      brandPopOptions,
      brandOperates,
      spanMethod
    }
  },
  methods: {

    inputTypeChange() {
      return this.isEdit ? 'input' : 'itemview'
    },
    selectTypeChange() {
      return this.isEdit ? 'select' : 'itemview'
    }
  }
}
