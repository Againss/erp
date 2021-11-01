<template>
  <div class="srm-main">
    <div class="search islayoutForm">
      <cs-custom-form
        ref="searchForm"
        :form-datas="searchFormDatas"
        :data-source="searchData"
        :options="formOtions"
      />
    </div>
    <!-- <div class="button" style="text-align: left">
      <el-button
        v-permission="['srm:supplierPerformance:export']"
        size="small"
        @click="exportSupplier"
      >导出</el-button>
      <el-button
        v-permission="['srm:supplierPerformance:import']"
        size="small"
        @click="openImportPopBox"
      >上传</el-button>
    </div> -->
    <div class="srm-content">
      <!-- 列表 -->
      <div v-permission="['srm:supplierPerformance:list']" class="page-table">
        <cs-custom-table
          tooltip-effect="dark"
          :table-scrollx="true"
          :col-drag="colDrag"
          :columns="columns"
          :autoresize="false"
          :data-source="dataSource"
          :pagination="pagination"
          :operates="popOperates"
          :header-cell-style="{ padding: '10px 0' }"
          edit-type="pop"
          highlight-current-indexrow
        />
      </div>
    </div>
    <!-- 考核 -->
    <div class="pop-wrap detail">
      <cs-custom-pop ref="popApp" class="pop-dialog" :options="dialogPerformanceAppraisalVisable" />
    </div>
    <div class="pop-wrap">
      <cs-custom-pop ref="historyPop" :options="historyPop" />
    </div>
    <!-- 供应商绩效考核上传弹框 -->
    <div class="pop-wrap">
      <cs-custom-pop :options="UploadImportPopBox" />
    </div>
  </div>
</template>
<script>
import { fetchLog } from '@/views/srm/public/fetchLog'
import { PerformanceAppraisal } from './components/index'
import downloadTemplate from './components/download-template.vue'
import uploadSlotTrigger from '../suppliers-list/components/common/upload-slot-trigger.vue'
export default {
  name: 'Index',
  mixins: [PerformanceAppraisal, fetchLog],
  data() {
    // 限制输入正整数
    const ruleTrim = (data) => {
      if (data === '0') {
        return ''
      }
      data = data.replace(/[^0-9]/g, '')
      data = data.toUpperCase()
      data = data.replace('_', '')
      return data
    }
    const pjRule = (rule, value, callback) => {
      const data = this.popForm.dynamicValidateFormRuleForm
      const arr = rule.field.split('.')
      const val = data[arr[0]] && data[arr[0]][arr[1] * 1] && data[arr[0]][arr[1] * 1]['evaluationScore'] || 0
      const fen = this.dialogPerformanceAppraisalVisable.formDatas.scoreThreshold
      if (val && val < fen && !value) {
        return callback(new Error('请输入当前评价'))
      }
      return callback()
    }
    const scoreRule = (rule, value, callback) => {
      var reg = /^[+]{0,1}(\d+)$/
      if (!reg.test(value) && value) {
        callback(new Error('请输入正整数'))
      } else if (parseInt(value) > 100) {
        return callback(new Error('请输入0~100的数值！'))
      }
      return callback()
    }
    /* 表头参数信息配置 */
    const columns = {
      _index: {
        prop: 'index',
        label: '序号',
        align: 'left',
        fixed: 'left',
        minWidth: '60',
        formater: scope => (this.pagination.currentPage - 1) * this.pagination.pageSize + scope.$index + 1
      },
      _supplierNo: {
        prop: 'supplierNo',
        align: 'left',
        label: '供应商编码',
        showOverflowTooltip: true,
        width: '115'
      },
      _supplierName: {
        prop: 'supplierName',
        align: 'left',
        label: '供应商名称',
        showOverflowTooltip: true,
        minWidth: '120'
      },
      _supplierAbbreviation: {
        prop: 'supplierAbbreviation',
        align: 'left',
        label: '供应商简称',
        showOverflowTooltip: true,
        minWidth: '120'
      },
      _address: {
        prop: 'address',
        align: 'left',
        label: '所在地区',
        showOverflowTooltip: true,
        width: '150',
        formater: (scope) => {
          const row = scope.row
          if (this.areaList.length && row.provinceCode && row.cityCode && row.areaCode) {
            const obj = {
              province: row.provinceCode,
              cityList: row.cityCode,
              areaList: row.areaCode
            }
            const sheng = this.areaList.find(item => obj.province && item.value === obj.province)
            const shi = this.areaList.find(item => obj.cityList && item.value === obj.cityList)
            const qu = this.areaList.find(item => obj.areaList && item.value === obj.areaList)
            const province = sheng && sheng.label || ''
            const cityList = shi && shi.label || ''
            const areaList = qu && qu.label || ''
            return `<div style="width: 130px;">${province + cityList + areaList}</div>`
          }
        }
      },
      _name: {
        prop: 'name',
        align: 'left',
        label: '联系人',
        showOverflowTooltip: true,
        minWidth: '100'
      },
      _phone: {
        prop: 'phone',
        align: 'left',
        label: '联系电话',
        showOverflowTooltip: true,
        minWidth: '115'
      },
      _mainProduct: {
        prop: 'mainProduct',
        align: 'left',
        label: '主要产品',
        showOverflowTooltip: true,
        minWidth: '115'
      },
      _assessmentPeriodType: {
        prop: 'assessmentPeriodType',
        align: 'left',
        label: '考核周期',
        showOverflowTooltip: true,
        minWidth: '80'
      },
      _performanceNo: {
        prop: 'performanceNo',
        align: 'left',
        label: '考核月份',
        showOverflowTooltip: true,
        minWidth: '100'
      },
      _supplierType: {
        prop: 'supplierType',
        align: 'left',
        label: '供应商类型/等级/分数',
        width: '160',
        popoverOptions: {
          formater: scope => {
            const str = (scope.row.multiSupplierTypeInfos || []).reduce((a, n) => {
              a += `<p>${n.supplierType || '-'} / ${n.rank || '-'} / ${n.score || '-'}</p>`
              return a
            }, '<div>')
            return str + '</div>'
          }
        },
        formater: scope => {
          const val = `${Array.isArray(scope.row.multiSupplierTypeInfos) && (scope.row.multiSupplierTypeInfos.reduce((a, n) => {
            a += n.supplierType && n.supplierType + '/' + (n.rank || '-') + '/' + (n.score || '-') + ', ' || ''
            return a
          }, '')).slice(0, -2) || ''}`
          return `<div style="width: 140px; overflow: hidden; white-space:nowrap; text-overflow:ellipsis;">${val}</div>`
        }
      },
      _status: {
        prop: 'status',
        align: 'left',
        label: '状态',
        showOverflowTooltip: true,
        width: '80',
        formater: (scope) => {
          const s = scope.row[scope.column.property]
          if (s === 0) {
            return '<div style="width: 60px; color:#FF9214;">未完成</div>'
          } else if (s === 1) {
            return '<div style="width: 60px; color:#00BCC5;">已完成</div>'
          } else {
            return ''
          }
        }
      }
    }
    // 表格操作栏的配置信息
    let newDataSource = [
      {
        label: '查看',
        isShow: scope => scope.row.status === 1,
        handle: (params) => {
          this.getSupplierInfoById({
            id: params.row.id,
            type: 'details'
          })
        }
      },
      {
        label: '考核',
        permitTag: ['srm:supplierPerformance:confirm'],
        isShow: scope => scope.row.status === 0,
        handle: (params) => {
          this.getSupplierInfoById({
            id: params.row.id,
            type: 'check'
          })
        }
      },
      {
        label: '查看历史考核记录',
        permitTag: ['srm:supplierPerformance:history'],
        isShow: true,
        handle: (params) => {
          this.getSupplierHistory(params)
        }
      }
    ]
    newDataSource = this.$filterPermission(newDataSource)
    const popOperates = {
      label: '操作',
      align: 'left',
      fixed: 'right',
      width: 190,
      dataSource: newDataSource
    }

    /*  分页配置信息 */
    const pagination = {
      currentChange: (val) => {
        this.getSupplilerList({
          pageSize: this.pagination.pageSize,
          pageNum: val
        })
      },
      sizeChange: (val) => {
        this.getSupplilerList({
          pageNum: this.pagination.currentPage || 1,
          pageSize: val
        })
      }
    }

    const formItem = {
      _title: {
        itemType: 'itemview',
        labelWidth: '0',
        itemStyle: {
          marginTop: '10px',
          marginBottom: '5px'
        },
        renderContent: value => {
          if (value) {
            return `<div style="font-size: 16px;color: #151222;">${value}</div>`
          }
          return ''
        }
      },
      _table: {
        itemType: 'table-form',
        border: true,
        dataSource: [],
        className: 'tableName',
        itemStyle: {
          marginBottom: '0px',
          lineHeight: '10px'
        },
        columns: {
          _assessUserName: {
            prop: 'assessUserName',
            label: '考核人',
            minWidth: '80'
          },
          _evaluationScore: {
            prop: 'evaluationScore',
            label: '分数（满分100）',
            editOptions: {
              labelWidth: '0',
              itemType: 'input',
              trim: (val) => {
                return ruleTrim(val)
              },
              change: (value, form, formDatas, setFormDatas, scope) => {
                const item = formDatas.supplierTypeId.find(e => e.value === formDatas.tabs)
                const index = item.supplierAssessmentDetails.findIndex(e => scope.row.assessDimension === e.assessDimension)
                scope.row.realAssessUserId = value && formDatas.currentUserId || ''
                setFormDatas({ ...formDatas, ['total' + index]: this.getSum(formDatas['table' + index]) })
              },
              rules: [{ trigger: 'blur', validator: scoreRule }]
            },
            minWidth: '100'
          },
          _evaluationInfo: {
            prop: 'evaluationInfo',
            label: '评价',
            editOptions: {
              labelWidth: '0',
              itemType: 'input',
              maxlength: 200,
              rules: [{ trigger: 'blur', validator: pjRule }]
            },
            minWidth: '100'
          }
        }
      },
      _total: {
        itemType: 'itemview',
        itemStyle: {
          color: '#0986FF',
          // fontSize: '18px',
          border: '1px solid #dfe6ec',
          borderTop: 'none',
          marginBottom: '0px'
        },
        label: ' 单项总分：',
        renderContent: value => {
          if (value) {
            return `<div style="font-size: 18px;">
              ${value}
            </div>`
          }
        }
      }
    }
    const historyPop = {
      itemType: 'dialog',
      visible: false,
      title: '历史考核记录',
      okHidden: true,
      cancelHidden: true,
      className: 'history-pop',
      formDatas: {},
      formOptions: {},
      content: {
        _tabs: {
          prop: 'tabs',
          itemType: 'tabs',
          labelWidth: '0',
          dataSource: [],
          change: val => {
            const obj = this.historyPop.content['_tabs'].dataSource.find(e => e.value === val)
            this.historyPop.content['_historyList'].dataSource = obj && obj.historyList || []
          }
        },
        _historyList: {
          prop: 'historyList',
          itemType: 'table',
          labelWidth: '0',
          dataSource: [],
          columns: {
            _performanceNo: {
              prop: 'performanceNo',
              align: 'left',
              label: '考核月份',
              minWidth: '100'
            },
            _score: {
              prop: 'score',
              align: 'left',
              label: '综合评分',
              minWidth: '100'
            },
            _rank: {
              prop: 'rank',
              align: 'left',
              label: '等级评定',
              minWidth: '100'
            }
          }
        }
      }
    }
    /* 考核弹框 */
    const dialogPerformanceAppraisalVisable = {
      itemType: 'drawer',
      visible: false,
      title: '考核',
      okText: '保存',
      ok: params => {
        // 对老数据的限制
        // if (!params.supplierPerformanceId && !params.supplierAssessmentDetails) {
        //   this.$set(this.dialogPerformanceAppraisalVisable, 'visible', false)
        //   return false
        // }
        const datas = { ...this.dialogPerformanceAppraisalVisable.formDatas }
        const newDatas = { ...params }
        const item = datas.supplierTypeId.find(e => e.value === params.tabs)
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
        const data = {
          supplierPerformanceId: params.supplierPerformanceId,
          supplierId: params.supplierId,
          performanceMultiTypeInfo: this.dialogPerformanceAppraisalVisable.formDatas.supplierTypeId
        }
        this.confirmSuppliler(data)
      },
      close: () => {
        this.tableFormDatas = null
      },
      cancel: params => {
        this.dialogPerformanceAppraisalVisable.visible = false
        // this.$nextTick(() => {
        //   this.dialogPerformanceAppraisalVisable.visible = false
        // })
      },
      formDatas: {},
      formOptions: {
        getForm: e => {
          this.popForm = e.$parent
        }
      },
      content: {}
    }

    // 上传弹出框
    const UploadImportPopBox = {
      itemType: 'dialog',
      visible: false,
      title: '导入',
      cancelHidden: true,
      okHidden: true,
      width: '560px',
      ok: params => {},
      cancel: params => {},
      formDatas: {},
      formOptions: {},
      content: [
        {
          itemType: 'view',
          style: {
            padding: '12px 0',
            textAlign: 'center'
          },
          text: '第一步：下载模板，填写信息'
        },
        {
          components: {
            downloadTemplate
          }
        },
        {
          itemType: 'view',
          style: {
            padding: '12px 0',
            textAlign: 'center'
          },
          text: '第二步：上传填写好的文件，并导入'
        },
        {
          prop: 'upload',
          itemType: 'upload',
          style: {
            textAlign: 'center',
            marginRight: 0
          },
          label: '',
          onSuccess: (res, file) => {
            if (res.data.allSuccess) {
              this.$message.success('导入成功')
              this.$set(this.UploadImportPopBox, 'visible', false)
              this.getSupplilerList()
              this.fetchLog(this.getLogMessages('IMPORT', '/srm/supplierPerformance/import/excel'), file, JSON.stringify({ beforeText: `在'供应商采购管理-供应商绩效考核'批量导入成功` }))
            } else {
              const h = this.$createElement
              const failData = res.data.resultList.filter(item => item.success === false).map(item => {
                return h('div', null, `第${item.row}行,问题: ${item.message}`)
              })
              this.$msgbox({
                title: '错误消息',
                message: h('p', null, failData),
                // showCancelButton: true,
                confirmButtonText: '确定'
                // cancelButtonText: '取消'
              })
            }
            // this.importPopDialogHandle()
            // this.getUserList()
          },
          onError: (res, file) => {
          },
          beforeUpload: (file) => {
            const fileName = file.name.split('.')
            const fileType = fileName[fileName.length - 1]
            const regexp = new RegExp(fileType)
            const isXls = regexp.test(this.accept)
            if (!isXls) {
              this.$message.error('上传文件只能是 .xlsx,.xls,XLSX,.XLS 格式!')
            }
            return isXls
          },
          action: `/srm/supplierPerformance/import/excel`,
          accept: '.xlsx,.xls,XLSX,.XLS',
          showFileList: false,
          timeout: 30000,
          content: [
            {
              slot: 'trigger',
              component: uploadSlotTrigger
            }
          ]
        }
      ]
    }
    /* 搜索条件 */
    const searchData = [
      {
        prop: 'supplierCategory',
        itemStyle: { width: '25%' },
        itemType: 'select',
        label: '供应商类别',
        dataSource: [
          {
            label: '全部',
            value: ''
          },
          {
            label: '服务',
            value: 1
          },
          {
            label: '采购',
            value: 0
          }
        ],
        change: (value, form, formDatas, setFormDatas) => {
          this.getSupplierTypeList({ supplierCategory: value }).then((data) => {
            const supplierTypeList = this.converSupplierTypeList(data)
            if (supplierTypeList && supplierTypeList.length > 0) {
              setFormDatas({ supplierType: '' })
              this.$set(this.searchData[1], 'dataSource', supplierTypeList)
            }
          })
        }
      },
      {
        prop: 'supplierType',
        itemStyle: { width: '25%' },
        itemType: 'select',
        label: '供应商类型',
        dataSource: [],
        clearable: true
      },
      {
        prop: 'assessmentPeriodType',
        itemStyle: { width: '25%' },
        itemType: 'select',
        label: '考核周期',
        dataSource: [],
        change: async(value, form, formDatas, setFormDatas) => {
          setFormDatas({ performanceNo: '' })
          if (this.period2noList.length > 0) {
            this.searchData[3].dataSource = this.period2noList.find(it => it.value === value)['data']
          }
        }
      },
      {
        itemType: 'select',
        itemStyle: { width: '25%' },
        prop: 'performanceNo',
        label: '考核期数',
        placeholder: '请选择',
        dataSource: [],
        clearable: true
      },
      {
        prop: 'supplierNo',
        itemStyle: { width: '25%' },
        itemType: 'input',
        label: '供应商编码',
        clearable: true,
        placeholder: '请输入'
      },
      {
        prop: 'supplierName',
        itemStyle: { width: '25%' },
        itemType: 'input',
        label: '供应商名称',
        clearable: true,
        placeholder: '请输入'
      },
      {
        itemType: 'performanceNo',
        itemStyle: { width: '25%' },
        prop: 'date',
        label: '考核时间',
        placeholder: '请选择',
        type: 'datetime',
        format: 'yyyy-MM-dd',
        valueFormat: 'yyyy-MM-dd'
      },
      {
        prop: 'rank',
        itemStyle: { width: '25%' },
        itemType: 'select',
        label: '等级',
        dataSource: []
      },
      {
        prop: 'provinceCode',
        itemStyle: { width: '25%' },
        itemType: 'select',
        label: '所在省',
        dataSource: [],
        change: (val, form, formDatas, setFormDatas) => {
          setFormDatas({ ...formDatas, cityCode: '', areaCode: '' })
          const list = this.areaList.filter(e => e.parentId === val)
          this.searchData[9].dataSource = list
        }
      },
      {
        prop: 'cityCode',
        itemStyle: { width: '25%' },
        itemType: 'select',
        label: '所在市',
        dataSource: [],
        change: (val, form, formDatas, setFormDatas) => {
          setFormDatas({ ...formDatas, areaCode: '' })
          const list = this.areaList.filter(e => e.parentId === val)
          this.searchData[10].dataSource = list
        }
      },
      {
        prop: 'areaCode',
        itemStyle: { width: '25%' },
        itemType: 'select',
        label: '所在区',
        dataSource: []
      },
      {
        prop: 'status',
        itemStyle: { width: '25%' },
        itemType: 'select',
        label: '状态',
        dataSource: [
          {
            value: '0',
            label: '未完成'
          },
          {
            value: '1',
            label: '已完成'
          }
        ]
      },
      {
        itemType: 'operate',
        submitHandle: (params) => {
          this.searchParams = params
          this.getSupplilerList(params)
          this.searchFormDatas = { ...params }
        },
        submitText: '查询',
        resetHandle: () => {
          this.searchFormDatas = {}
        }
      }
    ]
    return ({
      supplierAll: {},
      score: 0,
      dimensionA: 0,
      dimensionB: 0,
      dimensionC: 0,
      popOperates,
      columns,
      pagination,
      dataSource: [],
      dialogPerformanceAppraisalVisable,
      formItem,
      searchFormDatas: {},
      searchData,
      formOtions: {
        layout: true,
        inline: true,
        size: 'small'
      },
      supplierTypeList: [],
      period2noList: [],
      UploadImportPopBox,
      accept: '.xlsx,.xls,XLSX,.XLS',
      areaList: [],
      colDrag: {
        onEnd: (evt, newColmns,) => {
          this.columns = newColmns
        }
      },
      searchParams: {},
      historyPop,
      popForm: {}
    })
  },
  methods: {
    // 获取单项得分
    getSum(arr) {
      var allTest = 0
      if (arr.every((val) => val.evaluationScore)) {
        arr.forEach((val, i) => {
          allTest += this.$utils.getFloat((Number(val.evaluationScore) * (Number(val.specifics) / 100)), 6)
        })
      }
      return this.$utils.getFloat(allTest, 6)
    }
  }
}
</script>

<style lang="scss" scoped>
  /deep/ .upload-demo {
    margin-left: 0px;
  }
  .history-pop {
    /deep/ .el-tabs__header, /deep/ .el-form .el-form-item {
      margin: 0;
    }
    /deep/ .el-form .el-table__header thead th {
      background: #F5F7FA;
      padding: 0;
    }
  }
</style>
<style lang="scss">
.pop-dialog{
  .tableName{
    th {
      padding: 1.5px 0;
    }
  }
  .el-drawer {
    width: 500px !important;
  }
}
</style>
