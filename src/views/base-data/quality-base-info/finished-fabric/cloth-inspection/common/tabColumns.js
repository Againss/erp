import enableSwitch from '../components/enableSwitch.vue'
export const tabColumns = {
  data() {
    // 查询/重置表单配置信息
    const searchData = [
      {
        prop: 'nameQuery',
        itemType: 'input',
        label: '名称:',
        dataSource: [],
        filterable: true
      },
      {
        prop: 'isEnabled',
        itemType: 'select',
        label: '启用/禁用:',
        isShow: true,
        dataSource: [
          { label: '全部', value: '' },
          { label: '启用', value: 1 },
          { label: '禁用', value: 0 }
        ]
      },
      {
        itemType: 'operate',
        submitText: '查询',
        submitHandle: params => {
          this.formDatas = { ...params }
          this.getPageData({ ...params })
        },
        resetHandle: (params) => {
          this.formDatas = {}
        }
      }
    ]
    const publicColumns = {
      _remarks: {
        prop: 'remarks',
        label: '备注',
        minWidth: '100',
        showOverflowTooltip: true
      },
      _operatorName: {
        prop: 'operatorName',
        label: '操作人',
        minWidth: '100',
        showOverflowTooltip: true
      },
      _operatorTime: {
        prop: 'operatorTime',
        label: '操作时间',
        width: '150',
        showOverflowTooltip: true,
        // sortable: true,
        formater: scope => {
          return scope.row[scope.column.property] ? this.$filters.parseTime(scope.row[scope.column.property] + '', '{y}-{m}-{d} {h}:{i}') : ''
        }
      },
      _isEnabled: {
        prop: 'isEnabled',
        label: '启用/禁用',
        minWidth: '100',
        components: {
          enableSwitch
        },
        componentsOptions: {
          // permitTag: 'baseData:tmDyeFinishTech:submit',
          changeStatus: (scope) => {
            this.statusChange({ id: scope.row.id, isEnabled: scope.row.isEnabled }, scope)
          }
        }
      },
      _status: {
        prop: 'status',
        label: '状态',
        minWidth: '80',
        showOverflowTooltip: true,
        formater: scope => {
          return scope.row[scope.column.property] === 'Y' ? `<span style="color: #00BCC5;">已审核</span>` : '<span style="color: #FF9B02;">未审核</span>'
        }
      }
    }
    // 扣分项目（单匹）列表配置
    const deductPointsColumns = {
      '_code': {
        prop: 'code',
        label: '序号',
        width: '60'
      },
      '_name': {
        prop: 'name',
        label: '中文名',
        minWidth: '100',
        showOverflowTooltip: true
      },
      '_nameEn': {
        prop: 'nameEn',
        label: '英文名',
        minWidth: '100',
        showOverflowTooltip: true
      },
      _orders: {
        prop: 'orders',
        label: '顺序',
        minWidth: '100',
        sortable: true,
        showOverflowTooltip: true
      },
      ...publicColumns
    }

    // 其他项目列表配置
    const otherProjectColumns = {
      _code: {
        prop: 'code',
        label: '序号',
        width: '60'
      },
      _name: {
        prop: 'name',
        label: '中文名',
        minWidth: '100',
        showOverflowTooltip: true
      },
      _nameEn: {
        prop: 'nameEn',
        label: '英文名',
        minWidth: '100',
        showOverflowTooltip: true
      },
      _grade: {
        prop: 'grade',
        label: '等级',
        minWidth: '100',
        showOverflowTooltip: true,
        itemStyle: { width: 'calc(50% - 10px)' },
        formater: scope => {
          return scope.row.unit === '3' ? 'A/B/C' : ''
        }
      },
      _unit: {
        prop: 'unit',
        label: '单位',
        minWidth: '100',
        showOverflowTooltip: true,
        itemStyle: { width: 'calc(50% - 10px)' },
        formater: scope => {
          scope.row.unit = scope.row.unit + ''
          const obj = { '1': '"', '2': 'cm', '3': '' }
          return scope.row.unit && obj[scope.row.unit] || ''
        }
      },
      _whetherRecorded: {
        prop: 'whetherRecorded',
        label: '是否必录',
        minWidth: '100',
        showOverflowTooltip: true,
        formater: scope => {
          return scope.row.whetherRecorded && scope.row.whetherRecorded === 1 ? '是' : '否'
        }
      },
      _singleOrEntire: {
        prop: 'singleOrEntire',
        label: '单匹/整缸',
        minWidth: '100',
        showOverflowTooltip: true,
        formater: scope => {
          return scope.row.singleOrEntire && scope.row.singleOrEntire === 1 ? '单匹' : '整缸'
        }
      },
      _orders: {
        prop: 'orders',
        label: '顺序',
        minWidth: '100',
        sortable: true,
        showOverflowTooltip: true
      },
      ...publicColumns

    }
    // 问题类型列表配置
    const problemColumns = {
      _code: {
        prop: 'code',
        label: '序号',
        width: '60'
      },
      _name: {
        prop: 'name',
        label: '中文名',
        minWidth: '100',
        showOverflowTooltip: true
      },
      _nameEn: {
        prop: 'nameEn',
        label: '英文名',
        minWidth: '100',
        showOverflowTooltip: true
      },
      _remarks: {
        prop: 'remarks',
        label: '备注',
        minWidth: '100',
        showOverflowTooltip: true
      },
      _operatorName: {
        prop: 'operatorName',
        label: '操作人',
        minWidth: '100',
        showOverflowTooltip: true
      },
      _operatorTime: {
        prop: 'operatorTime',
        label: '操作时间',
        width: '150',
        showOverflowTooltip: true,
        formater: scope => {
          return scope.row[scope.column.property] ? this.$filters.parseTime(scope.row[scope.column.property] + '', '{y}-{m}-{d} {h}:{i}') : ''
        }
      }
    }
    // 列表操作栏按钮
    const popOperates = {
      label: '操作',
      width: '150',
      fixed: 'right',
      dataSource: [
        {
          label: '编辑',
          permitTag: [this.permitModify],
          isShow: (params) => {
            return true
          },
          handle: params => {
            this.$set(this.popOptions.content._name, 'disabled', params.row.status === 'Y')
            this.editHandle(params)
          }
        },
        {
          label: '删除',
          permitTag: [this.permitDel],
          style: { 'color': '#FE4949' },
          isShow: scope => {
            return scope.row.status !== 'Y'
          },
          handle: async params => {
            const res = await this.$uiUtils.confirmMsg()
            if (res) {
              this.deleteData(params.row)
            }
          }
        },
        {
          label: '审核',
          permitTag: this.permitModify,
          isShow: scope => {
            if (this.activeName === 'problem') {
              return false
            }
            return scope.row.status !== 'Y'
          },
          handle: async params => {
            const res = await this.$uiUtils.confirmMsg({
              message: '确定审核？',
              cancelMessage: '已取消'
            })
            if (res) {
              this.checkStatus(params.row)
            }
          }
        }
      ]
    }

    // 默认扣分项目
    const columns = {
      ...deductPointsColumns
    }
    // 表格分页
    const pagination = {
      currentChange: val => {
        this.getPageData({ pageSize: this.pagination.pageSize || 20, pageNum: val })
      },
      sizeChange: val => {
        this.$set(this.pagination, 'currentPage', 1)
        this.getPageData({ pageNum: 1, pageSize: val })
      }

    }
    return {
      columns,
      searchData,
      publicColumns,
      deductPointsColumns,
      otherProjectColumns,
      problemColumns,
      popOperates,
      pagination,
      permitObj: {
        // deduct: '扣分项目（单匹）', other: '其它项目',problem: '问题类型'
        deduct: {
          add: 'baseData:qa:finishedFabricPointsDeductedItems:add',
          modify: 'baseData:qa:finishedFabricPointsDeductedItems:modify',
          del: 'baseData:qa:finishedFabricPointsDeductedItems:delete',
          check: 'baseData:qa:finishedFabricPointsDeductedItems:check',
          isEnabled: 'baseData:qa:finishedFabricPointsDeductedItems:isEnabled'
        },
        other: {
          add: 'baseData:qa:finishedFabricOtherProjects:add',
          modify: 'baseData:qa:finishedFabricOtherProjects:modify',
          del: 'baseData:qa:finishedFabricOtherProjects:delete',
          check: 'baseData:qa:finishedFabricOtherProjects:check',
          isEnabled: 'baseData:qa:finishedFabricOtherProjects:isEnabled'
        },
        problem: {
          add: 'baseData:qa:finishedFabricProblemType:add',
          modify: 'baseData:qa:finishedFabricProblemType:modify',
          del: 'baseData:qa:finishedFabricProblemType:delete',
          check: '',
          isEnabled: ''
        }
      },
      permitAdd: '',
      permitModify: '',
      permitDel: '',
      permitCheck: '',
      permitEnabled: ''

    }
  },
  watch: {
    activeName: {

      handler(val, oldVal) {
        this.permitModify = this.permitObj[this.activeName].modify
        this.permitAdd = this.permitObj[this.activeName].add
        this.permitDel = this.permitObj[this.activeName].del
        this.permitCheck = this.permitObj[this.activeName].check
        this.permitEnabled = this.permitObj[this.activeName].isEnabled
        console.log(this.permitModify, this.permitAdd, this.permitDel)
      },
      deep: true,
      immediate: true
    }
  }
}
