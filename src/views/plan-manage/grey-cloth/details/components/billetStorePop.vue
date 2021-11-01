<template>
  <div class="pop billetStore-pop ">
    <cs-custom-popsearch :options="popOptions" />
  </div>
</template>

<script>
import cusGreyInput from './cusGreyInput.vue'
import { grayclothreduceList, grayclothSave } from '../api/index.js'
export default {
  name: 'BilletStorePop',
  props: {
    detailInfo: {
      type: Object
    }
  },
  data() {
    const max999Reg = this.$getRules({ type: 'number', pattern: /^[0-9]\d{0,100}?$/, message: '请输入正整数', trigger: ['blur'] })
    const itemStyle = { width: '33%' }
    // 库存列表
    const publicOneColumns = {
      _greyClothCode: {
        prop: 'greyClothCode',
        label: '坯布编码',
        minWidth: '150'
      },
      _sourceOrderNo: {
        prop: 'sourceOrderNo',
        label: '来源订单号',
        minWidth: '180'
      },
      _sourceBill: {
        prop: 'sourceBill',
        label: '来源单据',
        minWidth: '180'
      },
      _billStatus: {
        prop: 'billStatus',
        label: '单据状态',
        minWidth: '80',
        formater: scope => {
          return scope.row.billStatus === '0'
            ? `<span style="color: #FF9214;">${'进行中'}</span>`
            : `<span style="color: #00BCC5;">${'已完成'}</span>`
        }
      },
      _storehouse: {
        prop: 'storehouse',
        label: '仓库',
        showOverflowTooltip: true,
        minWidth: '100'
      },
      _storeNum: {
        prop: 'storeNum',
        label: '可用库存(KG)',
        minWidth: '160',
        align: 'right',
        formater: (scope) => {
          return !isNaN(scope.row.storeNum) ? (scope.row.storeNum).toFixed(2) : '-'
        }
      },
      _lockNum: {
        prop: 'lockNum',
        label: '划扣重量(KG)',
        minWidth: '160',
        align: 'right',
        style: { padding: '5px' },
        components: {
          cusGreyInput
        },
        componentsOptions: {
          type: 'store'
        }
      },
      _clothType: {
        prop: 'clothType',
        label: '布类',
        showOverflowTooltip: true,
        minWidth: '100'
      },
      _specifications: {
        prop: 'specifications',
        label: '规格',
        minWidth: '160',
        showOverflowTooltip: true
      },
      _yarnName: {
        prop: 'yarnName',
        label: '纱名',
        minWidth: '160',
        showOverflowTooltip: true
      },
      _yarnAttr: {
        prop: 'yarnAttr',
        label: '纱属性',
        showOverflowTooltip: true,
        minWidth: '160'
      },
      _sellerTeamName: {
        prop: 'sellerTeamName',
        label: '销售团队',
        showOverflowTooltip: true,
        minWidth: '160'
      }
    }
    const copyContent = {
      _greyClothCode: {
        prop: 'greyClothCode',
        itemType: 'input',
        label: '坯布编码',
        clearable: true,
        placeholder: '请输入',
        itemStyle
      },
      _sourceOrderNo: {
        prop: 'sourceOrderNo',
        itemType: 'input',
        label: '来源订单号',
        clearable: true,
        placeholder: '请输入',
        itemStyle
      },
      _sourceBill: {
        prop: 'sourceBill',
        itemType: 'input',
        label: '来源单据',
        clearable: true,
        placeholder: '请输入',
        itemStyle
      },

      _operate: {
        itemType: 'operate',
        submitText: '查询',
        submitHandle: params => {
          if (params.suggestWidthB && params.suggestWidthE) {
            if (params.suggestWidthB > params.suggestWidthE) {
              this.$message.warning('请输入正确的成品幅宽范围')
              return
            }
          }
          if (params.suggestWeightB && params.suggestWeightF) {
            if (params.suggestWeightF > params.suggestWeightB) {
              this.$message.warning('请输入正确的成品克重范围')
              return
            }
          }
          this.getGrayclothreduceList(params)
        },
        style: {
          display: 'inline-block'
        },
        resetHandle: () => {
          const coGreyNo = this.detailInfo.apsGrayClothReduceSourceInfoResp.length > 0 ? this.detailInfo.apsGrayClothReduceSourceInfoResp[0].coGreyNo : ''
          const data = { greyClothCode: this.detailInfo.greyClothCode, sourceOrderNo: coGreyNo }
          this.$set(this.popOptions.popFormOptions, 'formDatas', data)
        }
      },
      _storehouse: {
        prop: 'storehouse',
        itemType: 'input',
        label: '仓库',
        clearable: true,
        placeholder: '请输入',
        itemStyle
      },
      // _reduceBy: {
      //   prop: 'reduceBy',
      //   itemType: 'select',
      //   label: '抽用所属',
      //   type: 'radio',

      //   // clearable: true,
      //   itemStyle,
      //   dataSource: [
      //     {
      //       label: '同销售团队',
      //       value: 0
      //     },
      //     {
      //       label: '公用',
      //       value: 1
      //     },
      //     {
      //       label: '全部',
      //       value: 2
      //     }
      //   ]
      // },
      _clothType: {
        prop: 'clothType',
        itemType: 'input',
        label: '布类',
        clearable: true,
        placeholder: '请输入',
        itemStyle
      },
      _yarnName: {
        prop: 'yarnName',
        itemType: 'input',
        label: '纱名',
        clearable: true,
        placeholder: '请输入',
        itemStyle
      },
      _yarnAttr: {
        prop: 'yarnAttr',
        itemType: 'input',
        label: '纱属性',
        clearable: true,
        placeholder: '请输入',
        itemStyle
      },
      _sellerTeamName: {
        prop: 'sellerTeamName',
        itemType: 'input',
        label: '销售团队',
        clearable: true,
        placeholder: '请输入',
        itemStyle
      },
      _suggestWidth: {
        children: {
          _suggestWidthB: {
            prop: 'suggestWidthB',
            itemType: 'input',
            label: '成品幅宽',
            maxLength: 9,
            rules: [max999Reg],
            span: 13,
            placeholder: '请输入',
            itemStyle: { 'padding-right': '30' }
          },
          _areaTelRowC2: {
            prop: 'areaTelRowC2',
            itemType: 'view',
            text: '-',
            span: 2,
            style: { textAlign: 'center', lineHeight: '36px' },
            labelWidth: '0'
          },
          _suggestWidthE: {
            prop: 'suggestWidthE',
            span: 9,
            maxLength: 9,
            itemType: 'input',
            label: '',
            labelWidth: '0',
            rules: [max999Reg],
            placeholder: '请输入'
          }
        }

      },
      _suggestWeight: {
        children: {
          _suggestWeightF: {
            prop: 'suggestWeightF',
            itemType: 'input',
            label: '成品克量',
            maxLength: 9,
            rules: [max999Reg],
            span: 13,
            placeholder: '请输入',
            itemStyle: { 'padding-right': '30' }
          },
          _areaTelRowC2: {
            prop: 'areaTelRowC2',
            itemType: 'view',
            text: '-',
            span: 2,
            style: { textAlign: 'center', lineHeight: '36px' },
            labelWidth: '0'
          },
          _suggestWeightB: {
            prop: 'suggestWeightB',
            span: 9,
            maxLength: 9,
            itemType: 'input',
            label: '',
            labelWidth: '0',
            rules: [max999Reg],
            placeholder: '请输入'
          }
        }

      }

    }
    // 坯布库存弹出层用的配置信息
    const popOptions = {
      itemType: 'dialog',
      visible: false,
      className: 'billetDialog',
      title: '坯布库存',
      // okText: '确定',
      footerOptions: {
        content: [
          {
            name: '确定',
            style: { background: '#0986FF', color: '#fff' },
            handle: (formDatas, form, table) => {
              this.confirmSelect()
            }
          },
          {
            name: '取消',
            handle: (formDatas, form, table) => {
              this.popOptions.visible = false
            }
          }
        ]
      },
      popFormOptions: {
        content: copyContent,
        formOptions: {
          // layout: true,
          syncDataHandle: syncData => {
            console.log(syncData)
            // this.popsearchFormDatas = syncData
          },
          size: 'small',
          inline: true,
          layout: true
        },
        formDatas: { }
      },
      popTableOptions: {
        headerCellStyle: { 'background-color': '#F5F7FA', 'height': '40px', 'padding': '0' },
        className: 'pop-table',
        itemType: 'table-form',
        maxHeight: 400,
        rowStyle: { 'background-color': '#fff' },
        layout: true,
        prop: 'noteDialogTable',
        selectionChange: (val) => {
          this.selectionDialog = val
          this.selectNote(val)
        },
        columns: {
          _selection: {
            prop: 'id',
            type: 'selection',
            fixed: 'left'
          },
          _index: {
            prop: 'index',
            label: '序号',
            formater: scope => {
              return scope.$index + 1
            },
            minWidth: '50'
          },
          ...publicOneColumns
        },
        dataSource: []
        // pagination
      }

    }

    return {
      popOptions,
      copyContent,
      selectDataSource: [], // 库存列表数据
      selectionDialog: [] // 弹框中勾选的数据
    }
  },
  watch: {
    'popOptions.visible': {// 深度监听，可监听到对象、数组的变化
      handler(val, oldVal) {
        if (val) {
          this.$nextTick(() => {
            const coGreyNo = this.detailInfo.apsGrayClothReduceSourceInfoResp.length > 0 ? this.detailInfo.apsGrayClothReduceSourceInfoResp[0].coGreyNo : ''
            const data = { greyClothCode: this.detailInfo.greyClothCode, sourceOrderNo: coGreyNo }
            this.$set(this.popOptions.popFormOptions, 'formDatas', data)
            this.getGrayclothreduceList(data)
          })
        }
      }
    }
  },
  methods: {
    // 坯布库存查询
    async getGrayclothreduceList(data = {}) {
      const arr = ['greyClothCode', 'sourceOrderNo', 'sourceBill']
      let flag = false
      arr.forEach((v) => {
        if (data[v] && data[v] !== '') {
          flag = true
        }
      })
      if (!flag) {
        if ((data.clothType && data.yarnName) || (data.clothType && data.yarnAttr) || (data.yarnName && data.yarnAttr)) {
          this.query(data)
        } else {
          this.$message.warning('请填写布类和纱名条件')
          return
        }
      } else {
        this.query(data)
      }
    },
    async query(data) {
      const res = await grayclothreduceList(data)
      // 规格字段处理
      for (let i = 0; i < res.data.length; i++) {
        res.data[i].specifications = `${res.data[i].suggestWidth}${
          res.data[i].suggestWidthUnit
        }-${res.data[i].suggestWeight}${res.data[i].suggestWeightUnit}`
      }

      this.selectDataSource = res.data || []
      this.$set(
        this.popOptions.popTableOptions,
        'dataSource',
        this.selectDataSource
      )
    },
    // 库存弹框中的勾选
    selectNote(val) {
      this.selectionDialog = val
      this.selectDataSource.forEach(item => {
        item.checked = false
      })
      if (this.selectionDialog.length > 0) {
        this.selectDataSource.map((item) => { if (val.includes(item)) { item.checked = true } })
      }
    },
    // 确定抽坯
    async confirmSelect(data) {
      if (this.selectionDialog.length === 0) {
        this.$message.warning('请勾选记录')
        return false
      }
      let flag = false
      let reguFlag = false
      let lockNumFlag = false
      const reg = /^(([1-9]{1}\d{0,8})|(0{1}))(\.\d{1,2})?$/
      for (let i = 0; i < this.selectionDialog.length; i++) {
        this.selectionDialog[i].billStatus = 1 // WMS库存单据状态未确定，暂时写定
        if (this.selectionDialog[i].lockNum === '' || this.selectionDialog[i].lockNum == null) {
          reguFlag = true
        }
        if (this.selectionDialog[i].lockNum > this.selectionDialog[i].storeNum) {
          flag = true
        }
        if (!reg.test(this.selectionDialog[i].lockNum)) {
          lockNumFlag = true
        }
      }
      if (reguFlag) {
        this.$message.warning('请输入划扣重量')
        return
      }
      if (flag) {
        this.$message.warning('划扣重量不可大于可用库存')
        return
      }
      if (lockNumFlag) {
        this.$message.warning('请输入9位正数，最多两位小数')
        return
      }
      const params = {
        id: this.detailInfo.id,
        reduceRecord: this.selectionDialog
      }
      const res = await grayclothSave(params)
      this.$message.success('保存成功')
      const api = `/aps/grayclothreduce/save`
      const opratorType = `SET`
      const description = { beforeText: `在'计划管理-抽坯布-抽坯详情'划扣多条记录`, beforeCode: params }
      const appId = 'aps'
      this.$store.dispatch('app/fetchParamsLog', { params, opratorType, api, description, appId })
      if (!res || res.code !== 200) {
        return false
      }
      this.$emit('searchData')
      this.$set(this.popOptions, 'visible', false)
    }
  }
}
</script>

<style lang="scss" scoped>
.billetStore-pop{
  .billetDialog {
    /deep/.el-dialog {
      width: 1185px !important;
    }
    /deep/.el-row{
        width: 33%;
    }
    // /deep/.el-form-item:last-child {
    //   .el-form-item__content {
    //     overflow: auto;
    //   }
    // }
  }
}

</style>>
