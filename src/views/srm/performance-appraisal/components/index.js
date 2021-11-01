// import data from '@/views/demo/com-function/config/bySort-config'
import * as api from '../api/index'
export const PerformanceAppraisal = {
  created() {
    this.getSupplilerList()
    this.getSelectData()
  },
  methods: {
    async getSelectData() {
      const resArea = await api.openapiAreaSearch()
      this.areaList = (resArea.data || []).map(e => ({ label: e.name, value: String(e.id), parentId: String(e.parentId) }))
      const list = this.areaList.filter(e => e.parentId === '0')
      this.searchData[8].dataSource = list
      const res = await api.getSupplierPerformancePeriod2noData()
      this.searchData[2].dataSource = this.period2noList = (res.data || []).map(e => ({
        ...e,
        label: e.type,
        value: e.id,
        data: e.data.map(ele => ({
          value: ele,
          label: ele
        }))
      }))
      const resleve = await api.getSupplierLevelList()
      this.searchData[7].dataSource = (resleve.data || []).map(e => ({ value: e, label: e }))
    },
    /* 获取考核周期列表 */
    async getSupplilerList(params = {}) {
      const res = await api.getSupplilerListData({ ...params, ...this.searchParams })
      if (this.$pub.responseValidate(res)) {
        const data = res.data
        this.dataSource = data.list || []
        this.pagination = {
          ...this.pagination,
          dataTotal: data.total,
          ...params,
          currentPage: data.pageNum,
          pageSize: data.pageSize
        }
      }
    },
    /* 考核确认 */
    async confirmSuppliler(params = {}) {
      const res = await api.confirmSupplilerData({
        ...params
      })
      if (this.$pub.responseValidate(res)) {
        this.fetchLog(this.getLogMessages('UPDATE', '/srm/supplierPerformance/confirm'), {
          ...params,
          supplierPerformanceId: params.supplierPerformanceId
        }, JSON.stringify({ beforeText: `在'供应商采购管理-供应商绩效考核'考核了一条数据`, beforeCode: {
          ...params,
          supplierPerformanceId: params.supplierPerformanceId
        }}))
        const callback = this.getSupplilerList
        const options = {
          type: 'insert',
          message: '考核成功！',
          api: '/srm/supplierPerformance/confirm',
          callback,
          callbackParams: {
            pageNum: this.pagination.currentPage,
            pageSize: this.pagination.pageSize
          },
          logParams: {},
          dialog: this.dialogPerformanceAppraisalVisable
        }
        this.$pub.handleSuccessfully(options)
      }
    },
    // 初始化当前页签下form的item项
    setForm(v) {
      const val = { ...v }
      if (!val.supplierTypeId) return
      const item = { ...val.supplierTypeId.find(e => e.value === val.tabs) }
      const content = {
        _supplierName: {
          prop: 'supplierName',
          itemType: 'input',
          label: '供应商名称',
          disabled: true
        },
        _supplierTypeId: {
          prop: 'supplierTypeId',
          itemType: 'select',
          multiple: true,
          disabled: true,
          valueType: 'object',
          label: '供应商类型',
          dataSource: [...val.supplierTypeId]
        },
        _tabs: {
          prop: 'tabs',
          itemType: 'tabs',
          change: value => {
            if (value !== this.popForm.dynamicValidateFormRuleForm.tabs) {
              this.setForm({ ...this.tableFormDatas })
            }
          },
          labelWidth: '0',
          dataSource: [...val.supplierTypeId],
          beforeLeave: (n, o) => {
            return new Promise((resolve, reject) => {
              this.popForm.form.validate(valid => {
                const bool1 = this.dialogPerformanceAppraisalVisable.title === '查看'
                const bool2 = this.dialogPerformanceAppraisalVisable.content['_rank'].disabled
                if (valid || bool1 || bool2) {
                  // 切换页签 表单验证通过 先保存当前页签form的值 再重置form
                  const datas = { ...this.dialogPerformanceAppraisalVisable.formDatas }
                  const newDatas = { ...this.popForm.dynamicValidateFormRuleForm }
                  const item = datas.supplierTypeId.find(e => e.value === o)
                  item.supplierAssessmentDetails = Object.keys(newDatas).reduce((a, n, i) => {
                    if (n.startsWith('table')) {
                      a.push({
                        assessDimension: newDatas['title' + n.slice(-1)],
                        detailsList: newDatas[n],
                        individualScores: newDatas['total' + n.slice(-1)]
                      })
                    }
                    return a
                  }, [])
                  item.remark = newDatas.remark
                  this.tableFormDatas = { ...datas, tabs: n }
                  resolve('可以')
                } else {
                  console.log(valid, bool1, bool2, 'valid || bool1 || bool2')
                  reject('不可以')
                }
              })
            })
          }
        }
      }
      let contBody = {}
      let formDatas = {}
      if (item && Array.isArray(item.supplierAssessmentDetails)) {
        contBody = item.supplierAssessmentDetails.reduce((a, n, i) => {
          a['_title' + i] = { ...this.formItem['_title'], prop: 'title' + i
          }
          formDatas['title' + i] = n.assessDimension
          a['_table' + i] = {
            ...this.formItem['_table'],
            prop: 'table' + i,
            dataSource: n.detailsList.map(e => ({
              ... e,
              individualScores: n.individualScores,
              edit: val.type === 'check' && e.assessUserId.includes(val.currentUserId)
            }))
          }
          a['_total' + i] = { ...this.formItem['_total'], prop: 'total' + i }
          formDatas['total' + i] = n.individualScores
          return a
        }, {})
      }
      const contFoot = {
        _score: {
          itemType: 'itemview',
          prop: 'score',
          itemStyle: {
            display: 'inline-block',
            width: '50%',
            fontSize: 0,
            marginBottom: '20px',
            marginTop: '5px'
          },
          renderContent: value => {
            if (value) {
              return `<div style="font-size: 18px;color: #0986FF;">
              ${value}
            </div>`
            }
          },
          label: '最终得分:'
        },
        _rank: {
          itemType: 'itemview',
          prop: 'rank',
          itemStyle: {
            display: 'inline-block',
            marginTop: '5px',
            fontSize: 0,
            width: '50%',
            marginBottom: '20px',
            color: '#FF8900'
          },
          renderContent: value => {
            if (value) {
              return `<div style="font-size: 16px;color: #FF8900;">
              ${value}
            </div>`
            }
          },
          label: '考核等级:'
        },
        _remark: {
          prop: 'remark',
          type: 'textarea',
          resize: 'none',
          disabled: val.type !== 'check',
          itemType: 'input',
          maxlength: '200',
          label: '备注'
        }
      }
      this.dialogPerformanceAppraisalVisable.content = { ...content, ...contBody, ...contFoot }
      formDatas = {
        ...formDatas,
        type: val.type,
        supplierPerformanceId: val.supplierPerformanceId,
        currentUserId: val.currentUserId,
        scoreThreshold: val.scoreThreshold,
        supplierName: val.supplierName,
        supplierId: val.supplierId,
        supplierTypeId: val.supplierTypeId,
        remark: item.remark,
        rank: item.rank,
        score: item.score,
        tabs: val.tabs
      }
      this.popForm.dynamicValidateFormRuleForm = { ...formDatas }
      this.dialogPerformanceAppraisalVisable.formDatas = { ...this.popForm.dynamicValidateFormRuleForm }
      this.dialogPerformanceAppraisalVisable.formOptions.popError = true
      this.dialogPerformanceAppraisalVisable.title = val.type === 'check' ? '考核' : '查看'
      this.$set(this.dialogPerformanceAppraisalVisable, 'okHidden', val.type !== 'check')
      this.dialogPerformanceAppraisalVisable.visible = true
    },
    /* 详情 */
    async getSupplierInfoById(params) {
      const res = (await api.getDetail(params)).data || {}
      const conArr = (res.performanceMultiTypeInfo || []).map(e => ({
        label: e.supplierTypeName,
        value: String(e.supplierTypeId),
        ...e
      }))
      const datas = {
        type: params.type,
        supplierPerformanceId: res.supplierPerformanceId,
        currentUserId: res.currentUserId,
        scoreThreshold: res.scoreThreshold,
        supplierName: res.supplierName,
        supplierId: res.supplierId,
        supplierTypeId: [...conArr],
        tabs: conArr[0] && String(conArr[0].value)
      }
      this.setForm(datas)
    },
    /* 查看历史考核记录 */
    async getSupplierHistory(params) {
      const res = await api.getSupplierHistoryData({ supplierId: params.row.supplierId })
      const arr = (res.data || []).map(e => ({
        ...e,
        value: e.supplierTypeName,
        label: e.supplierTypeName
      }))
      this.historyPop.formDatas.tabs = arr[0] && arr[0].value
      this.historyPop.content['_tabs'].dataSource = arr
      this.historyPop.content['_historyList'].dataSource = arr[0] && arr[0].historyList || []
      this.historyPop.visible = true
    },

    // 导出供应商
    async exportSupplier(params = {}) {
      const data = this.$refs.searchForm.dynamicValidateFormRuleForm
      const res = await api.getSupplierExportData(data)
      this.$utils.downloadStream(res)
      this.fetchLog(this.getLogMessages('EXPORT', '/srm/supplierPerformance/list/export'), data, JSON.stringify({ beforeText: `在'供应商采购管理-供应商绩效考核'导出成功`, beforeCode: data }))
    },

    // 点击上传按钮
    openImportPopBox() {
      this.$set(this.UploadImportPopBox, 'visible', true)
    }
  }
}
