<!--
 * @Descripttion:报价单添加弹窗
 * @version:
 * @Author: xj
 * @Date: 2020-11-17 10:53:03
 * @LastEditors: OBKoro1
 * @LastEditTime: 2021-07-14 17:29:58
-->
<template>
  <div ref="popOptionsCode" lass="pop">
    <cs-custom-popsearch
      ref="popOpForm"
      class="quotation_popOptions_codes"
      :options="popOptions"
      @close="popClose"
    />
  </div>
</template>

<script>
import { quotationSheet } from '@/views/customer-order/public/api/index'
import { PublicCustomer } from '@/views/customer-order/public/index'
export default {
  name: 'CodePop',
  components: {},
  mixins: [PublicCustomer],
  props: {
    tab: {
      type: String
    },
    setParentDataHandle: {
      type: Function
    },
    deliFreshData: {
      type: Object
    },
    popGetData: {
      type: Object
    }
  },
  data() {
  // 纱线编码分页
    const pagination = {
      pageSizes: [10, 20, 50, 100],
      currentChange: val => {
        this.getData({ pageSize: this.popOptions.popTableOptions.pageSize || 10, pageNum: val, currentPage: val })
      },
      sizeChange: val => {
        this.$set(this.popOptions.popTableOptions.pagination, 'currentPage', 1)
        this.getData({ pageNum: 1, pageSize: val, currentPage: 1 })
      }
    }
    const columns = {
      _quotationId: {
        prop: 'quotationId',
        label: '报价单号',
        minWidth: '140',
        placeholder: '请输入单号',
        showOverflowTooltip: true
      },
      _customerName: {
        prop: 'customerName',
        label: '客户',
         minWidth: '120',
        showOverflowTooltip: true,
        formater: (scope) => {
          return scope.row.customerName || '-'
        }
      },
      _brandName: {
        prop: 'brandName',
        label: '品牌',
        showOverflowTooltip: true,
        formater: (scope) => {
          return scope.row.brandName || '-'
        }
      },
      _salePrice: {
        prop: 'salePrice',
        label: '单价（含税）',
        minWidth: '110',
        formater: (scope) => {
          return  this.$utils.priceFormat( scope.row.salePrice, 2) || '-'
        }
      },
      _moq: {
        prop: 'moq',
        label: 'MOQ(KG）',
        minWidth: '110',
        showOverflowTooltip: true,
        formater: (scope) => {
          return scope.row.moq || '-'
        }
      },
      _mcq: {
        prop: 'mcq',
        label: 'MCQ(KG）',
        minWidth: '110',
        showOverflowTooltip: true,
        formater: (scope) => {
          return scope.row.mcq
        }
      },
      _proposerName: {
        prop: 'proposerName',
        label: '产品信息',
        minWidth: '140',
        showOverflowTooltip: true,
        formater: (scope) => {
          return this.getProposerName(scope.row)
        }
      },
      _proposerName1: {
        prop: 'proposerName1',
        label: '纱名',
        minWidth: '140',
        showOverflowTooltip: true,
        formater: (scope) => {
          return this.YanNames(scope.row.yarnList||[])
        }
      },
      _proposerName2: {
        prop: 'proposerName2',
        label: '纱属性',
        minWidth: '140',
        showOverflowTooltip: true,
        formater: (scope) => {
          return this.YanJson(scope.row.yarnList||[])
        }
      },
      _proposerName3: {
        prop: 'proposerName3',
        label: '工艺要求',
        minWidth: '140',
        showOverflowTooltip: true,
        formater: (scope) => {
          return this.getdyeingProcess(scope.row)
        }
      },
      _testRequirement: {
        prop: 'testRequirement',
        label: '测试要求',
        minWidth: '140',
        showOverflowTooltip: true,
        formater: (scope) => {
          return scope.row.testRequirement || '-'
        }
      },
      _sellerTeamName: {
        prop: 'sellerTeamName',
        label: '销售组织',
        minWidth: '140',
        showOverflowTooltip: true,
        formater: (scope) => {
          return scope.row.sellerTeamName || '-'
        }
      },
      _remark: {
        prop: 'remark',
        label: '备注',
        showOverflowTooltip: true,
        formater: (scope) => {
          return scope.row.remark || '-'
        }
      }
    }
    const coYarnNaturalFiberSearchReq = {// 天然纤维请求参数 ,CoYarnNaturalFiberSearchReq
      _quotationId: {
        prop: 'quotationId',
        itemType: 'input',
        itemStyle: { width: '23%' },
        itemClassName: 'labeClassPadding',
        label: '报价单号',
        clearable: true
      },
      _customerId: {
        prop: 'customerId',
        itemType: 'select',
        itemStyle: { width: '23%' },
        itemClassName: 'labeClassPadding',
        label: '客户',
        visibleChange: (value, val) => {
          if (value) {
            this.getCustomerSelect('customerId')
          }
        },
        dataSource: [],
        clearable: true
      },
      _sellerTeamId: {
        prop: 'sellerTeamId',
        itemType: 'select',
        itemStyle: { width: '23%' },
        itemClassName: 'labeClassPadding',
        label: '销售团队',
        visibleChange: (value, val) => {
          if (value) {
            this.getSellTeamSelect('sellerTeamId')
          }
        },
        dataSource: [],
        clearable: true
      },
      _quarter: {
        prop: 'quarter',
        itemType: 'select',
        itemStyle: { width: '23%' },
        itemClassName: 'labeClassPadding',
        label: '销售季度',
        visibleChange: (value, val) => {
          if (value) {
           this.getOptionConfigSelect({fieldName: '销售季度' }, 'chooseSearch')
          }
        },
        dataSource: [],
        clearable: true
      },
      // _yarnCertName: {
      //   prop: 'yarnCertName',
      //   itemType: 'select',
      
      //   itemStyle: { width: '23%' },
      //   itemClassName: 'labeClassPadding',
      //   label: '证书要求',
      //   visibleChange: value => {
      //     this.getOptionConfigSelect({ pageName: '样板开发单', fieldName: '证书要求' }, 'naturalFiber')
      //   },
      //   dataSource: [],
      //   clearable: true
      // },
      _operate: {
        itemType: 'operate',
        submitHandle: params => {
          // let com= this.$utils.deepClone(params)
          // if(com.yarnCertName){
          //   let con=this.yarnCertNameData.filter((v, index) => v.value===com.yarnCertName)
          //   params.yarnCertName=con.label
          // }
          this.getData(params)
          this.popsearchFormDatas = params
        },
        submitText: '查询',
        resetHandle: (params) => {
          this.popsearchFormDatas = {}
        }
      }
    }
    // 纱线编码搜索组件
    const popOptions = {
      visible: false,
      title: '报价单检索',
      width: '1235px',
      footerOptions: {
        content: [
          {
            name: '确定',
            handle: (formDatas, form, table) => {
              if (!this.currentRow) {
                this.$message({
                  message: '请选择一条记录',
                  type: 'warning'
                })
                return
              }
              console.log("omnsssssxiaojia",this.currentRow)
              this.OkClick({ ...this.currentRow })
            }
          },
          {
            name: '取消',
            handle: (formDatas, form, table) => {
              this.popHandle()
            }
          }

        ]
      },
      popFormOptions: {
        content: coYarnNaturalFiberSearchReq,
        formOptions: {
          syncDataHandle: (syncData) => {
            // console.log('pm', syncData)
          },
          inline: true,
          layout: true,
          labelWidth: '80px'
        }
      },
      popTableOptions: {
        columns,
        highlightCurrentRow: true,
        currentRowKey: 'id',
        rowClick: (row, column, event) => {
          this.currentRow = row
        },
        dataSource: [],
        pagination
      }
    }
    return {
      activeName: '1',
      popOptions,
      yarnCertNameData:[],
      pagination,
      popsearchFormDatas: {}, // /弹窗搜索组件
      coYarnNaturalFiberSearchReq // 天然纤维请求参数 ,CoYarnNaturalFiberSearchReq
    }
  },
  computed: {
    getPopForm() { // 表格数据
      return this.popOptions.popTableOptions.dataSource
    }
  },
  watch: {
    'popOptions.visible': {// 深度监听，可监听到对象、数组的变化
      handler(val, oldVal) {
        if (val) {
          this.getData()
        }
      }
    },
    popGetData: {
      handler(val, oldVal) {},
      deep: true,
      immediate: true
    }
  },
  created() {
  },
  mounted() {
  },
  methods: {
    popHandle(activeName) { // 纱线编码显隐
      this.popsearchFormDatas = {}
      this.$set(this.popOptions, 'visible', !this.popOptions.visible)
    },
    async getData(data = {}) {
      const params = { ...data, ...this.popGetData,...this.popsearchFormDatas }
      const tableData = await quotationSheet(params)
      const res = tableData.data || ''
      const list = res.list || []
      const pagination = {
        ...this.popOptions.popTableOptions.pagination,
        ...data,
        dataTotal: res.total || 0,
        currentPage: res.pageNum || 0,
        pageSize: res.pageSize || 1,
        pageNum: res.pageNum || 1
      }
      if (!res) {
        this.$message({ message: '查询无结果', type: 'warning' })
        return false
      } else {
        this.$set(this.popOptions.popTableOptions, 'dataSource', list)
        this.$set(this.popOptions.popTableOptions, 'pagination', pagination)
      }
    },
    popClose() {
      this.currentRow = null
      this.popsearchFormDatas = {}
      this.popOptions.popTableOptions.dataSource = []
    },
    async OkClick(data = {}) { // 确定按钮
     console.log('报价单号9898', data)
      this.$emit('okHandleClick', data)
      this.currentRow = null
      this.popHandle()
    },
    getCloe() {
      this.popOptions.popTableOptions.dataSource = []
    },
    // 获取客户下拉
    getCustomerSelect(type) {
      this.getCustomer().then(res => {
        if (type === 'customerId') {
          this.$set(this.coYarnNaturalFiberSearchReq._customerId, 'dataSource', res)
        }
      })
    },
    // 获取销售团队下拉
    getSellTeamSelect(type) {
      this.getSellTeam({ functionTag: 'SAL' }).then(res => {
        if (type === 'sellerTeamId') {
          this.$set(this.coYarnNaturalFiberSearchReq._sellerTeamId, 'dataSource', res)
        }
      })
    },
    // 选项配置下拉
    getOptionConfigSelect(data, type) {
      this.getOptionConfig(data).then(res => {
        if (type === 'naturalFiber') { // 证书要求
           this.yarnCertNameData=res||[]
          this.$set(this.coYarnNaturalFiberSearchReq._yarnCertName, 'dataSource', res)
        }else if (type === 'chooseSearch') { // 销售季度
          this.$set(this.coYarnNaturalFiberSearchReq._quarter, 'dataSource', res)
        }
      }
      )
    },
    // 产品信息：可以通过“布类、布封、克重、针数、寸数等”字段进行合并显示，
    // 布封克重可组合之间用-，针寸可组合之间用-，不同组信息要分行显示。
    //  不同单据中产品信息可用不同字段拼接显示（具体由业务和产品确定）。居中显示；
    getProposerName(data){
      let fabricName=data.fabricName||''
      let clothWidth=data.clothWidth||''
      let weightPerSquare=data.weightPerSquare||''
      return  fabricName+""+clothWidth+""+weightPerSquare
    },
    YanNames(data){ //纱名 纱线类型 S-短纤；F-长丝
      if(!data.length){return}
      let yan=""
      data.forEach(items => {
        if(items.yarnType==="S"){
          yan+=items.yarnsBranchName+items.compositionName+items.compositionProportionName
          +items.yarnsTypeName+items.cardingMethodName+items.spinMethodName
        }else if (items.yarnType==="F"){ //弹力强度
          yan+=items.finenessName+items.compositionName+items.goodsName+items.colorName
        }
      })
       return  yan
    },

    YanJson(data){ //纱名 纱线类型 S-短纤；F-长丝 ="|<br/>"+
      if(!data.length){return}
      let yan=""
      data.forEach(items => {
        if(items.yarnType==="S"){
          yan+=items.colorFlexibilityName
        }else if (items.yarnType==="F"){ //弹力强度
          yan+=items.colorFlexibilityName?"|":""+items.finenessName+items.glossName
        }
      })
      return  yan
    },
    getdyeingProcess(data){
      let dye=""
      let afts=""
      let funs=""
      let majs=""
      let days=data.dyeingTechList ||[]
          days.length&&days.forEach((item)=>{ //染色工艺列表
            dye+=this.dyeingTechList(item.dyeingProcess)+" "
          })
      let aft=data.afterfinishLossList ||[]
          aft.length&&aft.forEach((it)=>{ //后整/后整损耗列表
            afts+=it.afterfinishTechName+" "
          })
      let fun=data.functionLossList ||[]
          fun.length&&fun.forEach((ite)=>{ //功能/功能损耗列表
            funs+=ite.functionName+" "
          })
      let maj=data.majorPrintingTechList ||[]
          maj.length&&maj.forEach((itm)=>{ //主要印花列表
           majs+=itm.printingName+" "
          })
      return  dye+afts+funs+majs

    },
    //工艺要求
    dyeingTechList(data){
      let str = ''
      switch (data) {
        case 'W':
          str = '洗水'
          break
        case 'B':
          str = '漂白'
          break
        case 'D':
          str = '半漂'
          break
        case '4':
          str = '染色'
          break
        default:
          break
      }
      return str
    }
  }
}
</script>

<style lang="scss" scoped>
/deep/ .quotation_popOptions_codes {
  .labeClassPadding {
    margin-right: 15px !important;
    padding-right: 0 !important;
  }
  .custom-form{
    margin: 0!important;
  }
  .dialog-footer button:first-child{
    background-color: #1890ff;
    color: #fff;
  }

}
</style>
