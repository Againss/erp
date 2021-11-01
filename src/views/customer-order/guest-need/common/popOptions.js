import { downFile } from '../api/index'
import uploadFile from '../component/uploa-file'
// import * as api from '../api/index.js'
export const popOptions = {
  data() {
    // 弹框基本信息样式
    const basisStyle = {
      'font-size': '16px',
      'color': '#333',
      'padding': '15px 0',
      'padding-top': '30px',
      'border-radius': '2px',
      'margin-bottom': '10px',
      'border-bottom': '1px solid #E9EFF2',
      'overflow': 'hidden',
      'width': '100%'
    }
    const contentStyle = { 'width': '46%', 'background': '#fff', 'margin': '0 2%' }
    // 有取消原因时更新人的样式
    const updateStyle = {
      'width': '46%',
      'display': 'inline-block',
      'margin': '0 2%',
      'height': '30px',
      'margin-bottom': '160px'
    }
    // 需要取消原因样式
    const cancelStyle = {
      'width': '635px',
      'position': 'fixed',
      'bottom': '78px',
      'background-color': '#fff',
      'border-top': '1px #E9EFF2 solid',
      'left': 'calc(100% - 660px)',
      'padding-top': '20px',
      'padding-bottom': '40px',
      'z-index': '2',
      'margin-right': '0'
    }
    // 日志表格样式
    const logTableStyle = { 'width': '96%', 'margin': '10px 2%' }
    // 基本信息共公部份
    const basicInfo = {
      _view0: {
        itemType: 'view',
        text: '基本信息',
        style: basisStyle
      },
      _customerRequireId: {
        prop: 'customerRequireId',
        itemType: 'itemview',
        itemStyle: contentStyle,
        label: '需求单号：',
        isShow: false,
        renderContent: (value) => {
          return value ? `<div class="render-content-item"  title="${value}">${value}</div>` : ''
        }
      },
      _status: {
        prop: 'status',
        itemType: 'itemview',
        itemStyle: contentStyle,
        label: '需求状态：',
        className: 'Bluestyle',
        isShow: false,
        renderContent: (value) => {
          const obj = {
            0: `<span>全部</span>`,
            1: `<span style="color:#FF9214">待处理</span>`,
            2: `<span style="color:#00BCC5">已处理</span>`,
            3: `<span style="color:#FF9214">待取消</span>`,
            4: `<span style="color:#888E9E">已取消</span>`,
            5: `<span style="color:#FF9214">已完结</span>`,
            6: `<span>hold单中</span>`
          }
          return value ? obj[value] : ''
        }

      },
      _requireType: {
        prop: 'requireType',
        itemType: 'itemview',
        itemStyle: contentStyle,
        label: '需求类型：',
        renderContent: (value) => {
          return value ? this.requireType[value] : ''
        }

      },
      _requireFrom: {
        prop: 'requireFrom',
        itemType: 'itemview',
        itemStyle: contentStyle,
        label: '需求来源：',
        isShow: false
      },
      _follower: {
        prop: 'follower',
        itemType: 'itemview',
        itemStyle: contentStyle,
        label: '所有人：',
        isShow: false
      },
      _sampleAnalysisApplyId: {
        prop: 'sampleAnalysisApplyId',
        itemType: 'itemview',
        itemStyle: contentStyle,
        label: '申请单号：',
        isShow: false,
        renderContent: (value) => {
          return value ? `<div class="render-content-item"  title="${value}">${value}</div>` : ''
        }
      },
      _modelDevelopIdText: {
        prop: '_modelDevelopIdText',
        itemType: 'itemview',
        itemStyle: contentStyle,
        label: '样板开发单号：',
        isShow: false,
        renderContent: (value, options, form, formDatas, setFormDatas, scope) => {
          return formDatas.modelDevelopId ? `<div class="render-content-item" title="${formDatas.modelDevelopId}">${formDatas.modelDevelopId}</div>` : ''
        }
      },
      _yarnOrderCode: {
        prop: 'yarnOrderCode',
        itemType: 'itemview',
        itemStyle: contentStyle,
        label: '备纱单号：',
        isShow: false,
        renderContent: (value) => {
          return value ? `<div class="render-content-item" title="${value}">${value}</div>` : ''
        }
      },
      _greyOrderCode: {
        prop: 'greyOrderCode',
        itemType: 'itemview',
        itemStyle: contentStyle,
        label: '备坯单号：',
        isShow: false,
        renderContent: (value) => {
          return value ? `<div class="render-content-item"  title="${value}">${value}</div>` : ''
        }
      },
      _customerOrderId: {
        prop: 'customerOrderId',
        itemType: 'itemview',
        itemStyle: contentStyle,
        label: '客户订单号：',
        isShow: false,
        renderContent: (value) => {
          return value ? `<div class="render-content-item"  title="${value}">${value}</div>` : ''
        }
      },
      _quotationId: {
        prop: 'quotationId',
        itemType: 'itemview',
        itemStyle: contentStyle,
        label: '报价编号：',
        isShow: false,
        renderContent: (value) => {
          return value ? `<div class="render-content-item" title="${value}">${value}</div>` : ''
        }
      },
      _developType: {
        prop: 'developType',
        itemType: 'itemview',
        itemStyle: contentStyle,
        label: '样板开发类型：',
        isShow: false,
        renderContent: (value) => {
          // 处理销售订单类型
          const developType = { 'Q': '品质办', 'F': 'Fit Sample', 'A': 'AD Sample', 'G': '试纱办', 'S': '试规格办', 'L': 'LA Sample' }
          return value ? `<div class="render-content-item" title="${developType[value]}">${developType[value]}</div>` : ''
        }
      },
      _versionIdentifier: {
        prop: 'versionIdentifier',
        itemType: 'itemview',
        itemStyle: contentStyle,
        label: '处理系统：'
      }
    }
    // 销售信息公共部份
    const salesInfo = {
      _viewSales: {
        itemType: 'view',
        text: '销售信息',
        style: basisStyle
      },
      _customerName: {
        prop: 'customerName',
        itemType: 'itemview',
        itemStyle: contentStyle,
        label: '客户：',
        renderContent: (value) => {
          return value ? `<div class="render-content-item" title="${value}">${value}</div>` : ''
        }
      },
      _businessOpportunityName: {
        prop: 'businessOpportunityName',
        itemType: 'itemview',
        itemStyle: contentStyle,
        label: '商机：',
        renderContent: (value) => {
          return value ? `<div class="render-content-item" title="${value}">${value}</div>` : ''
        }
      },
      _sellerName: {
        prop: 'sellerName',
        itemType: 'itemview',
        itemStyle: contentStyle,
        label: '销售员：',
        renderContent: (value) => {
          return value ? `<div class="render-content-item" title="${value}">${value}</div>` : ''
        }
      },
      _sellerTeamName: {
        prop: 'sellerTeamName',
        itemType: 'itemview',
        itemStyle: contentStyle,
        label: '销售部门：',
        renderContent: (value) => {
          return value ? `<div class="render-content-item" title="${value}">${value}</div>` : ''
        }
      },
      _orderType: {
        prop: 'orderType',
        itemType: 'itemview',
        itemStyle: contentStyle,
        label: '销售订单类型：',
        isShow: false,
        renderContent: (value) => {
          // 处理销售订单类型
          const orderType = { 'B': '大货', 'S': '销售版', 'T': '测试样', 'F': '快反单', 'A': '备成品' }
          return value ? `<div class="render-content-item" title="${orderType[value]}">${orderType[value]}</div>` : ''
        }
      },

      _brandName: {
        prop: 'brandName',
        itemType: 'itemview',
        itemStyle: contentStyle,
        label: '品牌商：',
        renderContent: (value) => {
          return value ? `<div class="render-content-item" title="${value}">${value}</div>` : ''
        }
      },
      _year: {
        prop: 'year',
        itemType: 'itemview',
        itemStyle: contentStyle,
        label: '销售年度：',
        renderContent: (value) => {
          return value ? `<div class="render-content-item" title="${value}">${value}</div>` : ''
        }
      },
      _quarter: {
        prop: 'quarter',
        itemType: 'itemview',
        itemStyle: contentStyle,
        label: '销售季度：',
        renderContent: (value) => {
          const obj = { 'Spr': '第一季度', 'Sum': '第二季度', 'Fall': '第三季度', 'Winter': '第四季度' }
          return value ? `<span>${obj[value]}<span/>` : ''
        }
      },
      _hasSample: {
        prop: 'hasSample',
        itemType: 'itemview',
        itemStyle: contentStyle,
        label: '是否有客样:',
        isShow: false,
        renderContent: (value) => {
          return value ? '是' : '否'
        }
      },

      _versionIdentifier: {
        prop: 'versionIdentifier',
        itemType: 'itemview',
        itemStyle: contentStyle,
        label: '处理系统：',
        isShow: false,
        renderContent: (value) => {
          return value ? `<div class="render-content-item" title="${value}">${value}</div>` : ''
        }
      }
    }
    // 价格信息
    const priceInfo = {
      _priceView: {
        itemType: 'view',
        text: '价格信息',
        style: basisStyle,
        isShow: false
      },
      _settlement: {
        prop: 'settlement',
        itemType: 'itemview',
        itemStyle: contentStyle,
        label: '是否结算：',
        isShow: false,
        renderContent: (value) => {
          return value && value === 1 ? '是' : '否'
        }
      },
      _priceTermName: {
        prop: 'priceTermName',
        itemType: 'itemview',
        itemStyle: contentStyle,
        label: '价格条款：',
        isShow: () => {
          return false
        },
        renderContent: (value) => {
          return value ? `<div class="render-content-item" title="${value}">${value}</div>` : ''
        }

      },
      _payConditionName: {
        prop: 'payConditionName',
        itemType: 'itemview',
        itemStyle: contentStyle,
        label: '付款条件：',
        isShow: () => {
          return false
        },
        renderContent: (value) => {
          return value ? `<div class="render-content-item" title="${value}">${value}</div>` : ''
        }

      },
      _currency: {
        prop: 'currency',
        itemType: 'itemview',
        itemStyle: contentStyle,
        label: '币别：',
        isShow: () => {
          return false
        },
        renderContent: (value) => {
          return value ? `<div class="render-content-item" title="${value}">${value}</div>` : ''
        }
      },
      _totalAmount: {
        prop: 'totalAmount',
        itemType: 'itemview',
        itemStyle: contentStyle,
        label: '合计金额：',
        isShow: () => {
          return false
        },
        renderContent: (value) => {
          return value ? `<div class="render-content-item" title="${this.moneyFormat((value / 10000) + '')}">${this.moneyFormat((value / 10000) + '')}</div>` : ''
        }

      }
    }
    // 其他信息
    const otherInfo = {
      _otherView: {
        itemType: 'view',
        text: '其他信息',
        style: basisStyle
      },
      _analysisTarget: {
        prop: 'analysisTarget',
        itemType: 'itemview',
        itemStyle: contentStyle,
        label: '分析目的：',
        renderContent: (value) => {
          const analyArr = value && value.split('|') || []
          let analyStr = ''
          analyArr && analyArr.forEach((item, index) => {
            if (item === 'O') {
              analyStr = analyStr + '报价' + ','
            } else if (item === 'D') {
              analyStr = analyStr + '样板' + ','
            } else if (item === 'S') {
              analyStr = analyStr + '大货' + ','
            }
          })
          analyStr = analyStr.substring(0, analyStr.lastIndexOf(','))
          return analyStr ? `<span>${analyStr}<span/>` : ''
        }
      },
      _yarnDesc: {
        prop: 'yarnDesc',
        itemType: 'itemview',
        label: '备纱要求：',
        itemStyle: 'width:96%;margin:0 2%',
        renderContent: (value) => {
          return value ? `<div class="render-content-item" title="${value}">${value}</div>` : ''
        }
      },
      _sampleAnalysisId: {
        prop: 'sampleAnalysisId',
        itemType: 'itemview',
        itemStyle: contentStyle,
        label: '客样分析需求单：',
        renderContent: (value) => {
          return value ? `<div class="render-content-item" title="${value}">${value}</div>` : ''
        }
      },
      _remark: {
        prop: 'remark',
        itemType: 'itemview',
        itemStyle: 'width:96%;margin:0 2%',
        label: '注意事项：',
        renderContent: (value) => {
          return value ? `<div class="render-content-item" title="${value}">${value}</div>` : ''
        }
      },
      _endTime: {
        prop: 'endTime',
        itemType: 'itemview',
        itemStyle: contentStyle,
        label: '要求完成日期：',
        renderContent: (value) => {
          return value ? this.$filters.parseTime(value + '', '{y}-{m}-{d}') : ''
        }
      },

      _sampleId: {
        prop: 'sampleId',
        itemType: 'itemview',
        itemStyle: contentStyle,
        label: '客来板编号：',
        className: 'cancelExceed',
        renderContent: (value) => {
          return value ? `<div class="render-content-item" title="${value}">${value}</div>` : ''
        }
      },
      _modelDevelopId: {
        prop: 'modelDevelopId',
        itemType: 'itemview',
        itemStyle: contentStyle,
        className: 'odd-number',
        label: '样板开发申请单：',
        isShow: false,
        renderContent: (value) => {
          return value ? `<div class="render-content-item" title="${value}">${value}</div>` : ''
        }
      },
      _customerRequirement: {
        prop: 'customerRequirement',
        itemType: 'itemview',
        itemStyle: 'width:96%;margin:0 2%',
        label: '客户要求：',
        renderContent: (value) => {
          return value ? `<div class="render-content-item" title="${value}">${value}</div>` : ''
        }
      },
      _orderFilePath: {
        isShow: false,
        components: {
          uploadFile
        },
        componentsOptions: {
          prop: 'orderFilePath',
          label: '客户订单：',
          url: 'orderFilePath'
        }
      },

      _styleFilePath: {
        isShow: false,
        components: {
          uploadFile
        },
        componentsOptions: {
          prop: 'styleFilePath',
          label: '成衣款式：',
          url: 'filePath'

        }
      },
      _otherFilePath: {
        isShow: false,
        components: {
          uploadFile
        },
        componentsOptions: {
          prop: 'otherFilePath',
          label: '其他：',
          url: 'filePath'
        }
      },
      _filePath: {
        isShow: false,
        components: {
          uploadFile
        },
        componentsOptions: {
          prop: 'filePath',
          label: '文件名称：',
          url: 'filePath'
        }
      },
      _createdTime: {
        prop: 'createdTime',
        itemType: 'itemview',
        itemStyle: { ...contentStyle, 'margin-top': '15px' },
        label: '创建时间：',
        renderContent: (value) => {
          return value ? this.$filters.parseTime(value + '', '{y}-{m}-{d}') : ''
        }
      },
      _createdBy: {
        prop: 'createdBy',
        itemType: 'itemview',
        itemStyle: { ...contentStyle, 'margin-top': '15px' },
        label: '创建人：'
      },
      _updatedTime: {
        prop: 'updatedTime',
        itemType: 'itemview',
        itemStyle: contentStyle,
        label: '更新时间：',
        renderContent: (value) => {
          return value ? this.$filters.parseTime(value + '', '{y}-{m}-{d}') : ''
        }
      },
      _updatedBy: {
        prop: 'updatedBy',
        itemType: 'itemview',
        itemStyle: contentStyle,
        label: '更新人：'
      }
    }
    // 取消原因状态下
    const saleSecondContent = {
      _cancelReason: {
        prop: 'cancelReason',
        itemType: 'input',
        type: 'textarea',
        maxlength: 1000,
        className: 'cancelReason',
        itemStyle: { ...cancelStyle, 'display': 'flex', 'flex-direction': 'column', 'padding-top': '10px' },
        itemClass: 'cancelReason',
        showWordLimit: true,
        row: 5,
        label: '取消原因：',
        labelWidth: '95px',
        rules: [{ required: true, message: '请输入取消原因', trigger: 'blur' }],
        renderContent: (value) => {
          return value ? `<div class="render-content-item" title="${value}">${value}</div>` : ''
        }
      }
    }

    const logTable = {
      _viewTable: {
        itemType: 'view',
        text: '操作日志',
        style: basisStyle
      },
      _tableForm: {
        prop: 'tableForm',
        props: { edit: 'edit' },
        headerCellStyle: { 'background-color': '#F5F7FA' },
        className: 'pop-table',
        itemType: 'table-form',
        itemStyle: logTableStyle,
        border: true,
        columns: [
          {
            prop: 'operationType',
            label: '操作类型',
            showOverflowTooltip: true
          },
          {
            prop: 'operatingTime',
            label: '操作时间',
            showOverflowTooltip: true,
            formater: (scope) => {
              return scope.row.operatingTime ? this.$filters.parseTime(scope.row.operatingTime + '', '{y}-{m}-{d} {h}:{i}') : ''
            }
          },
          {
            prop: 'operator',
            label: '操作人',
            showOverflowTooltip: true
          },
          {
            prop: 'reason',
            label: '备注说明',
            showOverflowTooltip: true
          }
        ],
        dataSource: []
      }
    }
    const viewPopOptions = {
      itemType: 'drawer',
      visible: false,
      title: '备纱单-详情',
      okText: '保存',
      size: '680px',
      className: 'view-pop-options',
      saveAndaddText: '去ERP2.0处理',
      saveAndadd: this.saveAndadd,
      ok: async params => {
        if (this.oprateStatus === 1) {
          // 取消需求
          this.cancelNeed({ id: params.customerRequireId, reason: params.cancelReason })
        } else if (this.oprateStatus === 2) {
          // 确认处理
          if (this.changeInfo === 'GREY' || this.changeInfo === 'YARN') {
            // GREY 备坯申请 YARN 备纱申请
            this.saveAndadd(params)
          } else {
            this.Confirmation({ id: params.customerRequireId })
          }
        } else if (this.oprateStatus === 3) {
          this.viewDetails()
        } else if (this.oprateStatus === 4) {
          // 确认取消
          this.confirmCancel({ id: params.customerRequireId })
        }
      },
      cancel: (params) => {
        this.$set(this.viewPopOptions, 'visible', false)
      },
      formDatas: {},
      formOptions: {
        inline: true,
        labelWidth: '130px'
      },
      content: {
        ...basicInfo,
        ...salesInfo,
        ...priceInfo,
        ...otherInfo,
        ...logTable,
        ...saleSecondContent
      }
    }

    return {
      logTableStyle,
      contentStyle,
      updateStyle,
      cancelStyle,
      basicInfo,
      salesInfo,
      priceInfo,
      otherInfo,
      logTable,
      saleSecondContent,
      viewPopOptions
    }
  },
  methods: {
    // 文件下载
    async uploadDown(link) {
      const res = await downFile({ url: link })
      this.$utils.downloadStream(res)
    },
    downLoadFile(url) {
      this.uploadDown(url)
    }
  }
}
