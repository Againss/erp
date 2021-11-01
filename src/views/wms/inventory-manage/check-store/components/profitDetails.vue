<!--
 * @Author: Do not edit
 * @Date: 2020-12-03 09:13:35
 * @LastEditTime: 2019-10-15 15:00:45
 * @LastEditors: Aurnm
 **  盘盈单详情页面
 -->
<template>
  <div class="check-all-detail">
    <header class="new-header">
      <span class="check-code">盘盈单号：{{ formDatas.checkPlanId }}</span>
    </header>
    <div class="check-one-detail">
      <div class="check-words">盘点信息</div>
      <div class="details-tab">
        <cs-custom-form
          ref="checkPlan"
          class="p-10"
          :data-source="checkMoreData"
          :options="formOtions"
          :form-datas="formDatas"
        />
      </div>
    </div>
    <!-- 盘点明细表格部分 -->
    <div class="check-two-table">
      <div class="check-words">
        盘点明细
      </div>
      <!-- 盘点明细表格 -->
      <div class="table-details detail">
        <cs-custom-table
          tooltip-effect="dark"
          :columns="columns"
          :data-source="dataSource"
          edit-type="pop"
        />
      </div>
      <!-- 总计 -->
      <div class="totalNum">
        <span style="font-size: 16px; font-weight: bold">总计：</span>
        <span class="tipFirst">{{ checkAmount }}</span>
      </div>
    </div>
    <!-- 其他说明部分 -->
    <div class="other-part">
      <cs-custom-form
        ref="remarkForm"
        class="clearfix"
        :form-datas="remarkFormDatas"
        :data-source="newCheckOther"
        :options="remarkFormOtions"
      />
    </div>
    <!-- 按钮位置 -->
    <div class="button-groups">
      <div class="btn-all">
        <el-button
          size="small"
          type="primary"
          @click="comeBack"
        >
          返回
        </el-button>
      </div>
    </div>
  </div>
</template>

<script>
import { checkDetail, downDetail } from '../api/index.js'
import popoverColumn from '@/components/cs-custom-table/columns/popover-column'
import propertyCard from '@/components/property-card/index.vue'
export default {
  components: {},
  data() {
    // 盘盈单页面
    const checkMoreData = [
      {
        prop: 'warehouse',
        itemType: 'input',
        itemStyle: { 'width': '27%', 'margin': '0px 2%' },
        label: '盘点仓库：',
        readonly: true
      },
      {
        prop: 'checkType',
        itemType: 'input',
        itemStyle: { 'width': '27%', 'margin': '0px 2%' },
        label: '盘点类型：',
        readonly: true
      },
      {
        prop: 'createdByName',
        itemType: 'input',
        itemStyle: { 'width': '27%', 'margin': '0px 2%' },
        label: '创建人：',
        readonly: true,
        formater: scope => {
          return scope.row.enable === 1 ? '启用' : scope.row.enable === 0 ? '禁用' : ''
        }
      },
      {
        prop: 'checkStartTime',
        itemType: 'input',
        itemStyle: { 'width': '27%', 'margin': '0px 2%' },
        label: '盘点开始时间：',
        formater: (scope) => {
          return this.$filters.parseTime(
            scope.row.checkStartTime || 0,
            '{y}-{m}-{d} {h}:{i}'
          )
        },
        readonly: true
      },
      {
        prop: 'createdTime',
        itemType: 'input',
        itemStyle: { 'width': '27%', 'margin': '0px 2%' },
        label: '创建时间：',
        formater: (scope) => {
          return this.$filters.parseTime(
            scope.row.createdTime || 0,
            '{y}-{m}-{d} {h}:{i}'
          )
        },
        readonly: true
      }
    ]

    // 表格表头的配置信息
    const columns = [
      {
        prop: 'locationCode',
        label: '库位',
        minWidth: '130'
      },
      {
        prop: 'materiel',
        label: '产品编号',
        minWidth: '180',
        components: {
          popoverColumn
        },
        componentsOptions: {
          customOptions: {
            placement: 'right',
            style: {
              color: '#0986FF',
              cursor: 'pointer',
              marginTop: '5px'
            },
            width: '500',
            content: propertyCard,
            contentOptions: {},
            trigger: 'click',
            mouseleave: true,
            formDatas: {},
            show: (scope) => {
              return scope.row['materiel']
            }
          }
        }
      },
      {
        prop: 'materielInfo.yarnName',
        label: '纱名',
        minWidth: '160',
        showOverflowTooltip: true,
        formater: scope => {
          if (scope.row.materielInfo) {
            return scope.row.materielInfo.yarnName
          } else {
            return '--'
          }
        }
      },
      {
        prop: 'materielInfo.yarnProperty',
        label: '纱属性',
        minWidth: '160',
        showOverflowTooltip: true,
        formater: scope => {
          if (scope.row.materielInfo) {
            return scope.row.materielInfo.yarnProperty
          } else {
            return '--'
          }
        }
      },
      {
        prop: 'materielType',
        label: '物料类型',
        minWidth: '100',
        formater: scope => {
          if (scope.row.materielInfo) {
            return this.getStatus(scope.row.materielInfo)
          } else {
            return '--'
          }
        }
      },
      // {
      //   prop: 'materielInfo.clothColor',
      //   label: '成品颜色',
      //   minWidth: '110',
      //   formater: scope => {
      //     if (scope.row.materielInfo) {
      //       return scope.row.materielInfo.clothColor
      //     } else {
      //       return '--'
      //     }
      //   }
      // },
      // {
      //   prop: 'materielInfo.flower',
      //   label: '印花花号',
      //   minWidth: '110',
      //   formater: scope => {
      //     if (scope.row.materielInfo) {
      //       return scope.row.materielInfo.flower
      //     } else {
      //       return '--'
      //     }
      //   }
      // },
      {
        prop: 'locationAmount',
        label: '库位数',
        minWidth: '80'
      },
      {
        prop: 'checkAmount',
        label: '盘点件数',
        minWidth: '90'
      },
      {
        prop: 'moreAmount',
        label: '盘盈件数',
        minWidth: '90'
      },
      {
        prop: 'unit',
        label: '包装单位',
        minWidth: '90',
        formater: scope => {
          if (scope.row.materielInfo) {
            return this.getUnit(scope.row.materielInfo)
          } else {
            return '--'
          }
        }
      },
      {
        prop: 'checkUserName',
        label: '盘点人',
        minWidth: '100'
      }
    ]
    // 其他说明
    const newCheckOther = [
      {
        prop: 'remark',
        itemType: 'input',
        label: '其他说明',
        type: 'textarea',
        disabled: true,
        rows: 6,
        itemStyle: {
          width: '100%',
          marginRight: '10%',
          float: 'left'
        },
        trim: (value) => {
          return value
        },
        maxlength: 500
      }
    ]
    return {
      checkMoreData, // 盘盈单详情
      newCheckOther, // 其他说明
      remarkFormDatas: {},
      remarkFormOtions: {
        inline: false,
        size: 'small',
        labelPosition: 'top'
      },
      columns,
      formDatas: {},
      dataSource: [],
      formOtions: {
        inline: true
      },
      checkAmount: ''
    }
  },
  watch: {

  },
  created() {
    this.editList({ checkPlanId: this.$route.query.checkPlanId, checkResultType: this.$route.query.checkResultType })
    this.downList({ checkResultType: this.$route.query.checkResultType, checkPlanId: this.$route.query.checkPlanId })
  },
  mounted() {
  },
  methods: {
    // 包装单位
    getUnit(data) {
      let str = ''
      switch (data.materielType) {
        case '0101':
          str = '件'
          break
        case '0102':
          str = '件'
          break
        case '0103':
          str = '件'
          break
        case '0201':
          str = '卷'
          break
        case '0202':
          str = '卷'
          break
        case '0203':
          str = '卷'
          break
        default:
          break
      }
      return str
    },
    // 物料类型
    getStatus(data) {
      let str = ''
      switch (data.materielType) {
        case '0101':
          str = '天然纤维'
          break
        case '0102':
          str = '化学纤维'
          break
        case '0103':
          str = '组合纱线'
          break
        case '0201':
          str = '坯布'
          break
        case '0202':
          str = '色布'
          break
        case '0203':
          str = '组合布'
          break
        case '0204':
          str = '花布'
          break
        default:
          break
      }
      return str
    },
    // 返回到列表页
    comeBack() {
      this.$router.push('/wms/inventory-manage/check-store/index')
    },
    // 点击获取盘盈详情
    async editList(data) {
      const res = await checkDetail(data)
      if (!res || res.code !== 200) {
        return false
      }
      const upData = res.data || {}
      this.formDatas = res.data || {}
      this.formDatas.warehouse = this.formDatas.warehouse.label
      this.formDatas.checkType = this.formDatas.checkType === '1' ? '明盘' : this.formDatas.checkType === '2' ? '盲盘' : ''
      // 时间转换
      this.formDatas.createdTime = this.formDatas.createdTime ? this.$filters.parseTime(this.formDatas.createdTime + '', '{y}-{m}-{d} {h}:{i}') : ''
      this.formDatas.checkStartTime = this.formDatas.checkStartTime ? this.$filters.parseTime(this.formDatas.checkStartTime + '', '{y}-{m}-{d} {h}:{i}') : ''
      this.remarkFormDatas = {
        remark: upData.remark
      }
    },
    // 列表查询
    async downList(data) {
      const res = await downDetail({ ...data })
      if (!res || res.code !== 200) {
        return false
      }
      console.log('打印列表查询', res.data.list)
      const listData = res.data ? res.data.list : []
      this.dataSource = listData
      // 盘点总数相加
      let checkNum = 0
      this.dataSource.forEach(val => {
        // 前端根据详情返回的库存数和盘点数相减，获得盘盈单数量
        // 盘盈单字段moreAmount由前端增加，后端未返回
        val.moreAmount = val.checkAmount - val.locationAmount
        checkNum += val.checkAmount
      })
      this.checkAmount = checkNum
    }
  }
}
</script>

<style lang="scss" scoped>
.check-all-detail{
  .new-header{
    margin: 20px;
    font-size: 18px;
    font-family: PingFangSC-Regular;
  }
  // 盘点信息的样式
  .check-one-detail{
    padding-top: 20px;
    margin: 15px;
    padding-bottom: 10px;
    background-color: #fff;

    /deep/ .el-input__inner{
    border: none;
  }

    .details-tab{
      padding-left: 15px;
      .el-tabs__nav-wrap::after{
        height: 1px;
      }
    }

    .check-words {
      font-size: 16px;
      padding-bottom: 15px;
      padding-left: 15px;
      border-bottom: 1px solid #dfe4ed;
    }

    .second-check{
      .el-form-item__label-wrap{
        margin-left: 28px;
      }
    }
  }
  // 盘点明细表格的样式
  .check-two-table{
    padding-top: 20px;
    padding-left: 15px;
    padding-right: 15px;
    margin: 15px;
    padding-bottom: 10px;
    background-color: #fff;

    .check-words{
      font-size: 16px;
      margin-bottom: 15px;
    }

    // .table-details{
    //   height: 600px;
    //   overflow-y: scroll;
    // }

    .totalNum{
      color: #666666;
      margin: 20px 20px 0px 0px;
      .tipFirst {
        margin-right: 15px;
        color: #ff9b02;
        font-size: 16px;
      }
    }
  }
  // 其他说明部分
  .other-part{
    margin: 15px;
    padding: 0px 15px;
    background-color: #fff;
    font-family: PingFangSC-Regular;
    padding-bottom: 40px;

    /deep/ .el-form--label-top .el-form-item__label{
      padding: 10px 0px 5px 0px;
    }
  }
  // 按钮的样式
  .button-groups{
    display: flex;
  }
  .button-groups {
    bottom: 0;
    z-index: 1000;
    padding: 10px;
    width: 100%;
    background: #fff;
    position: fixed;
    border-top: 1px solid #ECF0F3;
    .btn-all {
      position: relative;
      left: 40%;
    }
  }
}
</style>
<style lang="scss">
  .table-details{
    .el-table__body-wrapper{
      height: 400px;
      overflow: scroll;
    }
    .el-table th {
      background-color: #f5f7fa;
    }
  }
</style>
