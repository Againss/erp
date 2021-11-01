<!--
 * @name: 损耗详情
 * @description: 损耗详情
 * @author: panmr
 * @time: 2021-04-27 13:39:39
-->
<template>
  <div class="lossDetail">
    <div class="order-content">
      <div class="order-title">
        <span>订单信息</span>
      </div>
      <!-- 搜索表单 -->
      <div class="search" style="padding-bottom: 20px;">
        <cs-custom-form ref="searchForm" :data-source="searchData" :options="formOtions" :form-datas="formDatas" />
      </div>
      <div class="order-info">
        <span>损耗信息</span>
      </div>
      <div class="page-table loss-table" style="margin-bottom: 60px">
        <cs-custom-table :header-cell-style="headerCellStyle" :columns="columns" :data-source="apsLossDetailInfoRespList" table-scrollx edit-type="pop" />
      </div>
    </div>
    <!-- 底部按钮 -->
    <div :class="{ 'fixed-footer': !sidebar }" class="button-group">
      <div class="btn">
        <el-button v-if="formDatas.orderStatus === '0'" v-permission="['aps-center:loss:confirm']" size="small" type="primary" @click="doConfirm">确认</el-button>
        <el-button v-if="formDatas.orderStatus === '0'" v-permission="['aps-center:loss:refresh']" size="small" @click="doRefresh">刷新</el-button>
        <el-button size="small" @click="goBack">返回</el-button>
      </div>
    </div>
  </div>
</template>
<script>
import { detail, refresh, confirm } from '../api/index'
import label from '../label'
import moreShow from '../components/moreShow'

export default {
  name: 'LossDetail',
  components: {},
  mixins: [],
  props: {
    params: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      formDatas: {},
      formOtions: { inline: true, size: 'small' },
      searchData: {
        orderNo: { prop: 'orderNo', itemType: 'itemview', label: `${label.orderNo}:`, className: 'inputWidth', itemStyle: { 'width': '20%', 'color': '#474747', ' margin-bottom': '0px' }},
        customerServiceName: { prop: 'customerServiceName', itemType: 'itemview', label: `${label.customerServiceName}:`, className: 'inputWidth', itemStyle: { 'width': '20%', 'color': '#474747', ' margin-bottom': '0' }},
        salesTeamName: { prop: 'salesTeamName', itemType: 'itemview', label: `${label.salesTeamName}:`, className: 'inputWidth', itemStyle: { 'width': '20%', 'color': '#474747', ' margin-bottom': '0' }},
        type: { prop: 'type', itemType: 'itemview', label: `${label.type}:`, className: 'inputWidth', itemStyle: { 'width': '20%', 'color': '#474747', ' margin-bottom': '0' }, renderContent: (value) => value === '1' ? '样板订单' : value && '大货订单' || '' },
        customerName: { prop: 'customerName', itemType: 'itemview', label: `${label.customerName}:`, className: 'inputWidth', itemStyle: { 'width': '20%', 'color': '#474747', ' margin-bottom': '0' }}
      },
      apsLossDetailInfoRespList: [], // 表格数据源
      headerCellStyle: {
        background: '#F5F7FA' // table表头颜色
      },
      // 表格表头的配置信息
      columns: [
        { prop: 'code', label: label.code, minWidth: '50', showOverflowTooltip: true },
        { prop: 'productCode', label: label.apsLossDetailInfoRespList.productCode, minWidth: '180', showOverflowTooltip: true },
        { prop: 'clothType', label: label.apsLossDetailInfoRespList.clothType, minWidth: '200', showOverflowTooltip: true },
        { prop: 'completedNum', label: label.apsLossDetailInfoRespList.completedNum, minWidth: '105', showOverflowTooltip: true, align: 'right' },
        { prop: 'yarnAllName', label: label.apsLossDetailInfoRespList.apsLossDetailYarnInfoRespList.yarnAllName, minWidth: '240', components: { moreShow },
          componentsOptions: { type: 'yarnAllName' }
          // formater: (scope) => {
          //   let html = '<div class="icon-itemtext" >'
          //   scope.row.apsLossDetailYarnInfoRespList && scope.row.apsLossDetailYarnInfoRespList.length && scope.row.apsLossDetailYarnInfoRespList.forEach(v => {
          //     if (v.yarnAllName && v.yarnAllName.includes('|')) {
          //       v.yarnAllName.split('|').forEach((n, index, self) => {
          //         html += `<p style="color: red;font-size: 9px;margin: 0" :title="${n + ((index === self.length - 1) ? '' : ' |')}">${n + ((index === self.length - 1) ? '' : ' |')}</p>`
          //       })
          //     } else {
          //       html += `<p :title="${v.yarnAllName || '-'}">${v.yarnAllName || '-'}</p>`
          //     }
          //   })
          //   html += '</div>'
          //   return html
          // }
        },
        { prop: 'yarnAttributes', label: label.apsLossDetailInfoRespList.apsLossDetailYarnInfoRespList.yarnAttributes, minWidth: '200', showOverflowTooltip: true, components: { moreShow },
          componentsOptions: { type: 'yarnAttributes' }
          // formater: (scope) => {
          //   let html = '<div class="icon-itemtext" >'
          //   scope.row.apsLossDetailYarnInfoRespList && scope.row.apsLossDetailYarnInfoRespList.length && scope.row.apsLossDetailYarnInfoRespList.forEach(v => {
          //     if (v.yarnAttributes && v.yarnAttributes.includes('|')) {
          //       v.yarnAttributes.split('|').forEach((n, index, self) => {
          //         html += `<p style="color: red;font-size: 9px;margin: 0" :title="${n + ((index === self.length - 1) ? '' : ' |')}">${n + ((index === self.length - 1) ? '' : ' |')}</p>`
          //       })
          //     } else {
          //       html += `<p :title="${v.yarnAttributes || '-'}">${v.yarnAttributes || '-'}</p>`
          //     }
          //   })
          //   html += '</div>'
          //   return html
          // }
        },
        { prop: 'whetherDyed', label: label.apsLossDetailInfoRespList.apsLossDetailYarnInfoRespList.whetherDyed, minWidth: '80', showOverflowTooltip: true,
          formater: (scope) => {
            let html = '<div >'
            const obj = { '0': '否', '1': '是' }
            scope.row.apsLossDetailYarnInfoRespList && scope.row.apsLossDetailYarnInfoRespList.length && scope.row.apsLossDetailYarnInfoRespList.forEach((v, index, self) => {
              if (index + 1 === self.length) {
                html += `<div style="height: 42px;line-height: 42px" :title="${obj[v.whetherDyed] || v.whetherDyed}">${obj[v.whetherDyed] || v.whetherDyed}</div>`
                return
              }
              html += `<div style="height: 42px;line-height: 42px" :title="${obj[v.whetherDyed] || v.whetherDyed}">${obj[v.whetherDyed] || v.whetherDyed}</div><div style="border-bottom: 1px solid #dfe6ec"></div>`
            })
            html += '</div>'
            return html
          }
        },
        { prop: 'yarnColor', label: label.apsLossDetailInfoRespList.apsLossDetailYarnInfoRespList.yarnColor, minWidth: '80', showOverflowTooltip: true,
          formater: (scope) => {
            let html = '<div >'
            scope.row.apsLossDetailYarnInfoRespList && scope.row.apsLossDetailYarnInfoRespList.length && scope.row.apsLossDetailYarnInfoRespList.forEach((v, index, self) => {
              if (index + 1 === self.length) {
                html += `<div style="height: 42px;line-height: 42px" :title="${v.yarnColor || '-'}">${v.yarnColor || '-'}</div>`
                return
              }
              html += `<div style="height: 42px;line-height: 42px" :title="${v.yarnColor || '-'}">${v.yarnColor || '-'}</div><div style="border-bottom: 1px solid #dfe6ec"></div>`
            })
            html += '</div>'
            return html
          }
        },
        { prop: 'colorRato', label: label.apsLossDetailInfoRespList.apsLossDetailYarnInfoRespList.colorRato, minWidth: '80', showOverflowTooltip: true,
          formater: (scope) => {
            let html = '<div >'
            scope.row.apsLossDetailYarnInfoRespList && scope.row.apsLossDetailYarnInfoRespList.length && scope.row.apsLossDetailYarnInfoRespList.forEach((v, index, self) => {
              if (index + 1 === self.length) {
                html += `<div style="height: 42px;line-height: 42px" :title="${v.colorRato ? (v.colorRato * 1000 / 10) + '%' : '-'}">${v.colorRato ? (v.colorRato * 1000 / 10) + '%' : '-'}</div>`
                return
              }
              html += `<div style="height: 42px;line-height: 42px" :title="${v.colorRato ? (v.colorRato * 1000 / 10) + '%' : '-'}">${v.colorRato ? (v.colorRato * 1000 / 10) + '%' : '-'}</div><div style="border-bottom: 1px solid #dfe6ec"></div>`
            })
            html += '</div>'
            return html
          }
        },
        { prop: 'dyedYarnLoss', label: label.apsLossDetailInfoRespList.apsLossDetailYarnInfoRespList.dyedYarnLoss, minWidth: '80', showOverflowTooltip: true,
          formater: (scope) => {
            let html = '<div >'
            scope.row.apsLossDetailYarnInfoRespList && scope.row.apsLossDetailYarnInfoRespList.length && scope.row.apsLossDetailYarnInfoRespList.forEach((v, index, self) => {
              if (index + 1 === self.length) {
                html += `<div style="height: 42px;line-height: 42px" :title="${v.dyedYarnLoss ? (v.dyedYarnLoss * 1000 / 10) + '%' : '-'}">${v.dyedYarnLoss ? (v.dyedYarnLoss * 1000 / 10) + '%' : '-'}</div>`
                return
              }
              html += `<div style="height: 42px;line-height: 42px" :title="${v.dyedYarnLoss ? (v.dyedYarnLoss * 1000 / 10) + '%' : '-'}">${v.dyedYarnLoss ? (v.dyedYarnLoss * 1000 / 10) + '%' : '-'}</div><div style="border-bottom: 1px solid #dfe6ec"></div>`
            })
            html += '</div>'
            return html
          }
        },
        { prop: 'knitLoss', label: label.apsLossDetailInfoRespList.apsLossDetailYarnInfoRespList.knitLoss, minWidth: '80', showOverflowTooltip: true,
          formater: (scope) => {
            let html = '<div >'
            scope.row.apsLossDetailYarnInfoRespList && scope.row.apsLossDetailYarnInfoRespList.length && scope.row.apsLossDetailYarnInfoRespList.forEach((v, index, self) => {
              if (index + 1 === self.length) {
                html += `<div style="height: 42px;line-height: 42px" :title="${v.knitLoss ? (v.knitLoss * 1000 / 10) + '%' : '-'}">${v.knitLoss ? (v.knitLoss * 1000 / 10) + '%' : '-'}</div>`
                return
              }
              html += `<div style="height: 42px;line-height: 42px" :title="${v.knitLoss ? (v.knitLoss * 1000 / 10) + '%' : '-'}">${v.knitLoss ? (v.knitLoss * 1000 / 10) + '%' : '-'}</div><div style="border-bottom: 1px solid #dfe6ec"></div>`
            })
            html += '</div>'
            return html
          }
        },
        { prop: 'completedNum', label: label.apsLossDetailInfoRespList.apsLossDetailYarnInfoRespList.completedNum, minWidth: '120', showOverflowTooltip: true, align: 'right',
          formater: (scope) => {
            let html = '<div >'
            scope.row.apsLossDetailYarnInfoRespList && scope.row.apsLossDetailYarnInfoRespList.length && scope.row.apsLossDetailYarnInfoRespList.forEach((v, index, self) => {
              if (index + 1 === self.length) {
                html += `<div style="height: 42px;line-height: 42px" :title="${v.completedNum || '-'}">${v.completedNum || '-'}</div>`
                return
              }
              html += `<div style="height: 42px;line-height: 42px" :title="${v.completedNum || '-'}">${v.completedNum || '-'}</div><div style="border-bottom: 1px solid #dfe6ec"></div>`
            })
            html += '</div>'
            return html
          }
        },
        { prop: 'dyedLoss', label: label.apsLossDetailInfoRespList.dyedLoss, minWidth: '80', showOverflowTooltip: true,
          formater: (scope) => {
            return scope.row.dyedLoss ? (scope.row.dyedLoss * 1000 / 10) + '%' : '-'
          }
        },
        { prop: 'printLoss', label: label.apsLossDetailInfoRespList.printLoss, minWidth: '80', showOverflowTooltip: true,
          formater: (scope) => {
            return scope.row.printLoss ? (scope.row.printLoss * 1000 / 10) + '%' : '-'
          }
        },
        { prop: 'greyClothNum', label: label.apsLossDetailInfoRespList.greyClothNum, minWidth: '120', showOverflowTooltip: true, align: 'right' },
        { prop: 'chengpinguige', label: label.apsLossDetailInfoRespList.chengpinguige, minWidth: '120', showOverflowTooltip: true,
          formater: (scope) => {
            return `${scope.row.suggestWidth}${scope.row.suggestWidthUnit}-${scope.row.suggestWeight}${scope.row.suggestWeightUnit}`
          }
        },
        { prop: 'garmentPartName', label: label.apsLossDetailInfoRespList.garmentPartName, minWidth: '100', showOverflowTooltip: true },
        { prop: 'elementRato', label: label.apsLossDetailInfoRespList.elementRato, minWidth: '120', showOverflowTooltip: true,
          formater: (scope) => {
            let html = '<div >'
            const elementRato = JSON.parse(scope.row.elementRato)
            elementRato.length && elementRato.forEach((v, index, self) => {
              if (index + 1 === self.length) {
                html += `<div style="height: 42px;line-height: 42px" :title="${v.ratio ? v.ratio + '% ' + v.elementName : '-'}">${v.ratio ? v.ratio + '% ' + v.elementName : '-'}</div>`
                return
              }
              html += `<div style="height: 42px;line-height: 42px" :title="${v.ratio ? v.ratio + '% ' + v.elementName : '-'}">${v.ratio ? v.ratio + '% ' + v.elementName : '-'}</div><div style="border-bottom: 1px solid #dfe6ec"></div>`
            })
            html += '</div>'
            return html
          }
        },
        { prop: 'colorType', label: label.apsLossDetailInfoRespList.colorType, minWidth: '80', showOverflowTooltip: true },
        { prop: 'whetherBlack', label: label.apsLossDetailInfoRespList.whetherBlack, minWidth: '80', showOverflowTooltip: true,
          formater: (scope) => {
            const obj = { '0': '否', '1': '是' }
            return obj[scope.row.whetherBlack] || scope.row.whetherBlack
          }
        },
        { prop: 'customerColor', label: label.apsLossDetailInfoRespList.customerColor, minWidth: '80', showOverflowTooltip: true },
        { prop: 'produceProcess', label: label.apsLossDetailInfoRespList.produceProcess, minWidth: '150', showOverflowTooltip: true },
        // { prop: 'dyeCraft', label: label.apsLossDetailInfoRespList.dyeCraft, minWidth: '80', showOverflowTooltip: true},
        { prop: 'delivery', label: label.apsLossDetailInfoRespList.delivery, minWidth: '120', showOverflowTooltip: true,
          formater: (scope) => {
            return scope.row.delivery ? this.$filters.parseTime(scope.row.delivery, '{y}-{m}-{d}') : scope.row.delivery || '-'
          }
        }
      ]
    }
  },
  computed: {
    sidebar() {
      return this.$store.state.app.sidebar.opened
    }
  },
  created() {
    this.load({ id: Number(this.params.id) })
  },
  methods: {
    goBack() {
      this.$router.push('/plan-manage/loss-list')
    },
    /**
     * 刷新
     */
    async doRefresh() {
      const { code = 0 } = await refresh({ id: Number(this.formDatas.id) })
      if (code === 200) {
        this.$message({ message: '刷新成功', type: 'success' })
        this.load({ id: this.params.id })
      }
    },
    /**
     * 确认
     */
    doConfirm() {
      let str = '确认成功'
      for (const item of this.apsLossDetailInfoRespList) {
        let flag = false
        // 生产流程含有染纱
        // 是否染色：是
        // 染纱损：0
        if (item.produceProcess.includes('染纱')) {
          if (item.apsLossDetailYarnInfoRespList) {
            for (let i = 0; i < item.apsLossDetailYarnInfoRespList.length; i++) {
              if (item.apsLossDetailYarnInfoRespList[i].whetherDyed === '1' && (!item.apsLossDetailYarnInfoRespList[i].dyedYarnLoss || item.apsLossDetailYarnInfoRespList[i].dyedYarnLoss === '0' || item.apsLossDetailYarnInfoRespList[i].dyedYarnLoss === '-')) {
                str = `第${item.code || '1'}-${i + 1}分录的染纱损值为0, 是否按此下发`
                flag = true
                break // 退出当前for循环
              }
            }
          }
        }
        if (flag) {
          break // 退出当前for循环
        }
        // 生产流程含有织布
        // 织损：0
        if (item.produceProcess.includes('织布')) {
          if (item.apsLossDetailYarnInfoRespList) {
            for (let i = 0; i < item.apsLossDetailYarnInfoRespList.length; i++) {
              if (!item.apsLossDetailYarnInfoRespList[i].knitLoss || item.apsLossDetailYarnInfoRespList[i].knitLoss === '0' || item.apsLossDetailYarnInfoRespList[i].knitLoss === '-') {
                str = `第${item.code || '1'}-${i + 1}分录的织损值为0, 是否按此下发`
                flag = true
                break
              }
            }
          }
        }
        if (flag) {
          break
        }
        // 生产流程含有染整
        // 染损：0
        if (item.produceProcess.includes('染整') && (!item.dyedLoss || item.dyedLoss === '0' || item.dyedLoss === '-')) {
          str = `第${item.code || '1'}分录的染损值为0, 是否按此下发`
        }
        // 生产流程含有印花
        // 印损：0
        if (item.produceProcess.includes('印花') && (!item.printLoss || item.printLoss === '0' || item.printLoss === '-')) {
          str = `第${item.code || '1'}分录的印损值为0, 是否按此下发`
        }
        // 生产流程含有染纱
        // 是否染色：是
        // 染纱损为-
        if (item.produceProcess.includes('染纱')) {
          if (item.apsLossDetailYarnInfoRespList) {
            for (let i = 0; i < item.apsLossDetailYarnInfoRespList.length; i++) {
              if (item.apsLossDetailYarnInfoRespList[i].whetherDyed === '1' && (!item.apsLossDetailYarnInfoRespList[i].dyedYarnLoss || item.apsLossDetailYarnInfoRespList[i].dyedYarnLoss === '0' || item.apsLossDetailYarnInfoRespList[i].dyedYarnLoss === '-')) {
                str = `第${item.code || '1'}-${i + 1}分录的印损值为0, 是否按此下发`
                flag = true
                break
              }
            }
          }
        }
        if (flag) {
          break
        }
        // 生产流程含有织布
        // 织损为-
        if (item.produceProcess.includes('织布')) {
          if (item.apsLossDetailYarnInfoRespList) {
            for (let i = 0; i < item.apsLossDetailYarnInfoRespList.length; i++) {
              if (!item.apsLossDetailYarnInfoRespList[i].knitLoss || item.apsLossDetailYarnInfoRespList[i].knitLoss === '0' || item.apsLossDetailYarnInfoRespList[i].knitLoss === '-') {
                str = `第${item.code || '1'}-${i + 1}分录的织损值为0, 是否按此下发`
                flag = true
                break
              }
            }
          }
        }
        if (flag) {
          break
        }
        // 生产流程含有染整
        // 染损为-
        if (item.produceProcess.includes('染整') && (!item.dyedLoss || item.dyedLoss === '-' || item.dyedLoss === '0')) {
          str = `第${item.code || '1'}分录的染损值为0, 是否按此下发`
        }
        // 生产流程含有印花
        // 印损为-
        if (item.produceProcess.includes('染整') && (!item.printLoss || item.printLoss === '-' || item.printLoss === '0')) {
          str = `第${item.code || '1'}分录的印损值为0, 是否按此下发`
        }
      }
      this.$confirm(str, '提示', { confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning' }).then(async() => {
        const { code = 0 } = await confirm({ id: Number(this.formDatas.id) })
        if (code === 200) {
          this.$message({ message: '确认成功', type: 'success' })
          this.load({ id: this.params.id })
        }
      }).catch(() => {
        this.$message({ type: 'info', message: '已取消' })
      })
    },
    // 获取列表数据
    async load(params = {}) {
      if (this.params.id) {
        const { data = { apsLossDetailInfoRespList: [] }, code = 0 } = await detail(params)
        if (code === 200) {
          this.formDatas = data
          const apsLossDetailInfoRespList = data.apsLossDetailInfoRespList.map((item, index) => ({ code: index + 1, ...item }))
          this.apsLossDetailInfoRespList = [...apsLossDetailInfoRespList]
        }
      } else {
        this.formDatas = {}
        this.apsLossDetailInfoRespList = []
      }
    }
  }
}
</script>
<style lang='scss'>
.loss-table {
  thead {
    th {
      height: 40px;
      background-color: #f5f7fa;
    }
  }
  .el-table__body tr {
    cursor: pointer;
  }
  .el-table__body tr.hover-row td {
    background: transparent;
  }
  .el-table__body tr.currentRowClassName td {
    background-color: transparent;
  }
  .el-table__body .currentRowClassName {
    background-color: #d8eafd;
  }
  tr:nth-child(even) {
    background-color: #fff;
  }
  tbody .el-table__row td {
    border-bottom-width: 1px;
  }
}
</style>
<style lang="scss" scoped>
.lossDetail {
  //padding: 20px;
  padding-bottom: 0px;
  .el-form.el-form--inline .el-form-item__label-wrap {
    margin-left: 0px !important;
  }
  .order-content {
    margin: 20px;
    .order-title {
      flex: 1;
      background: #fff;
      height: 58px;
      line-height: 58px;
      padding-left: 16px;
      font-size: 16px;
      border-bottom: 1px solid #EEEFF0;
    }
    .order-info {
      flex: 1;
      background: #fff;
      height: 58px;
      line-height: 58px;
      padding-left: 16px;
      font-size: 16px;
    }
    /deep/ .el-form-item__label {
      font-weight: 400;
      color: #888E9E;
    }
  }
  .fixed-footer {
    width: calc(100% - 54px) !important;
  }
  .button-group {
    width: calc(100% - 210px);
    transition: width 0.28s;
    position: fixed;
    text-align: center;
    bottom: 0;
    padding: 10px;
    background: #ffffff;
    border-top: 1px solid #ecf0f3;
    z-index: 999;
  }
  .el-table__row td {
    padding: 0;
  }
  /deep/ .el-table td {
    padding: 0;
  }
  .el-table th, .el-table td{
    padding: 0;
  }
}
</style>
