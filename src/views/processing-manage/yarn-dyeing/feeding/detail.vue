<!--
 * @Author: xj
 * @Description:  送纱通知单
 * @Date: 2021-06-10 19:23:16
 * @LastEditors: OBKoro1
 * @LastEditTime: 2021-06-25 14:41:04
 * @FilePath: e:\erpmu\erp2-processing-v2.0.0\src\views\processing-manage\yarn-dyeing\feeding\detail.vue
-->
<template>
  <div id="WeavingDeliveryDetailCopy" class="details WeavingDeliveryDetailCopy">
    <div class="head-base">
      <div class="msg-lf">单号：{{ orderIndexData.noticeNo||'' }}</div>
    </div>
    <div class="card">
      <div class="card-title">基本信息</div>
      <cs-custom-form
        class="card-froms"
        :data-source="baseDataSource"
        :options="baseOptions"
        :form-datas="baseDatas"
      />
    </div>

    <div v-for="(i) in dataSource" :key="i.id" class="card card-list" style="margin-top: 16px">
      <div class="DetailBranch_order_10px">
        <cs-custom-form
          :data-source="detailData"
          :options="detailFormOptions"
          :form-datas="i"
        />
      </div>

      <div class="detail">
        <cs-custom-table
          :columns="columns"
          :data-source="i.sendNotifyDetails"
          :pagination="pagination"
        />
      </div>
    </div>

  </div>
</template>

<script>
import { orderInfo } from './api/index'
export default {
  name: 'WeavingDeliveryDetailCopy',
  data() {
    const itemStyle = {
      width: '32%'
    }
    const baseDataSource = {
      _noticeNo: {
        prop: 'noticeNo',
        itemType: 'itemview',
        label: '通知单号：',
        itemStyle
      },
      _allotOutAddr: {
        prop: 'allotOutAddr',
        itemType: 'itemview',
        label: '原纱地址：',
        itemStyle
      },
      _outUserName: {
        prop: 'outUserName',
        itemType: 'itemview',
        label: '联系人员：',
        itemStyle
      },
      _outUserConnect: {
        prop: 'outUserConnect',
        itemType: 'itemview',
        label: '联系方式：',
        itemStyle
      },
      _sourceNoAddr: {
        prop: 'sourceNoAddr',
        itemType: 'itemview',
        label: '送入地址：',
        itemStyle
      },
      _inUserName: {
        prop: 'inUserName',
        itemType: 'itemview',
        label: '联系人员：',
        itemStyle
      },
      _inUserContact: {
        prop: 'inUserContact',
        itemType: 'itemview',
        label: '联系方式：',
        itemStyle
      },
      _sourceNo: {
        prop: 'sourceNo',
        itemType: 'itemview',
        label: '送入生产单：',
        itemStyle
      },
      _pmUserName: {
        prop: 'pmUserName',
        itemType: 'itemview',
        label: '跟单人员：',
        itemStyle
      },
      _createdByName: {
        prop: 'createdByName',
        itemType: 'itemview',
        label: '创建人员：',
        itemStyle
      },
      _createdTime: {
        prop: 'createdTime',
        itemType: 'itemview',
        label: '创建时间：',
        renderContent: (value, options, form, formDatas, setFormDatas, scope) => {
          return `<div title='${value ? this.$filters.parseTime(value + '', '{y}-{m}-{d} {h}:{i}') : '-'}' class='yarn_order'>${value ? this.$filters.parseTime(value + '', '{y}-{m}-{d} {h}:{i}') : '-'}</div>`
        },
        itemStyle
      }
    }
    const detailStyle = {
      width: '32%',
      'line-height': '20px',
      'margin-bottom': '0'
    }
    const detailData = {
      _skuId: {
        prop: 'skuId',
        itemType: 'itemview',
        label: '成品编码:',
        itemClassName: 'precfeefing',
        itemStyle: detailStyle,
        renderContent: this.renderContent
      },
      _clothName: {
        prop: 'clothName',
        itemType: 'itemview',
        itemClassName: 'precfeefing',
        label: '布类:',
        itemStyle: detailStyle,
        renderContent: this.renderContent
      },
      _suggest: {
        prop: 'suggest',
        itemType: 'itemview',
        itemClassName: 'precfeefing',
        label: '成品规格:',
        itemStyle: detailStyle,
        renderContent: this.renderContent
      }
    }

    const columns = {
      _index: {
        type: 'index',
        label: '序号',
        minWidth: '50',
        formater: (scope) => {
          return scope.$index + 1
        }
      },
      _yarnId: {
        prop: 'yarnId',
        label: '色纱编码',
        minWidth: '120'
      },
      _sourceCode: {
        prop: 'sourceCode',
        label: '来源单号',
        minWidth: '100'
      },
      _yarnCode: {
        prop: 'yarnCode',
        label: '坯纱编码',
        minWidth: '140'
      },
      _yarnType: {
        prop: 'yarnType',
        label: '纱名',
        minWidth: '100'
      },
      _yarnAttributes: {
        prop: 'yarnAttributes',
        label: '纱属性',
        minWidth: '100'
      },
      _dyeingColor: {
        prop: 'dyeingColor',
        label: '染纱颜色',
        minWidth: '100'
      },
      _factoryNo: {
        prop: 'factoryNo',
        label: '工厂色号',
        minWidth: '100'
      },
      _sendNum: {
        prop: 'sendNum',
        label: '送纱量(KG)',
        minWidth: '100'
      },
      _planDelivery: {
        prop: 'planDelivery',
        label: '计划到纱期',
        minWidth: '100',
        formater: (scope) => {
          return scope.row.planDelivery ? this.$filters.parseTime(scope.row.planDelivery + '', '{y}-{m}-{d}') : '-'
        }
      }
    }
    const pagination = {
      currentChange: (val) => {
        this.pagination.pageNum = val
      },
      sizeChange: (val) => {
        this.pagination.pageSize = val
        this.pagination.pageNum = 1
        this.pagination.currentPage = 1
      }
    }
    return {
      IndexId: 0,
      pagination,
      dataSource: [],
      columns,
      detailData,
      orderData: {},
      orderIndexData: {},
      baseDataSource,
      detailFormOptions: {
        inline: true,
        labelWidth: '80px',
        className: 'detail-branch-detail-form'
      },
      baseOptions: {
        inline: true,
        className: 'msg-content'
      },
      baseDatas: {
      }
    }
  },
  created() {
    this.IndexId = this.$route.query && this.$route.query.id || ''
    if (this.IndexId) {
      this.getDetailData()
    }
  },
  methods: {
    async getDetailData() { // 获取详情数据
      console.log('ssssommmm', this.IndexId)
      const res = await orderInfo({ 'noticeNo': this.IndexId })
      if (this.$pub.responseValidate(res)) {
        this.infoDaTA(res)
      }
    },
    async infoDaTA(res) { // 详情数据 统一处理
      const dataTim = Object.assign({}, res.data) || {}
      this.IndexCode = dataTim.noticeNo
      this.orderData = dataTim
      this.orderIndexData = this.$utils.deepClone(this.orderData) // 接口请求慢 赋值不正确
      this.baseDatas = this.orderIndexData
      this.dataSource = this.orderIndexData.details || []
      console.log('sssssom', this.orderIndexData)
    },
    renderContent(value, options, form, formDatas, setFormDatas, scope) {
      return `<div title='${value || '-'}' class='yarn-style'>${value || '-'}</div>`
    }

  }

}
</script>

<style  lang="scss">
@import "@/styles/base.scss";
#WeavingDeliveryDetailCopy {
  .head-base {
    display: flex;
    line-height: 65px;
    justify-content: space-between;
    .msg-lf {
      font-size: 18px;
      color: #151222;
    }
  }
  .detail {
    width: 100%;
    padding: 10px;
    padding-top: 0px;
    .el-table th {
      background-color: #f5f7fa;
      padding: 0;
      .cell {
        height: 44px;
        line-height: 44px;
      }
    }
    .el-table td {
      height: 50px;
      line-height: 50px;
      padding: 0;
    }
  }
  .detail-branch-detail-form {
    background: #fff;
    padding: 12px 10px !important;
    margin-top: 16px;
    z-index: 4;
  }
  .card {
    .msg-content {
      padding: 0 40px 20px;
      margin: 16px 0;
      > div {
        width: 24%;
      }
      .el-form-item {
        line-height: 20px;
        margin-bottom: 0;
      }
      // .el-form-item__label {
      //   color: #888e9e;
      //   padding: 0;
      // }
    }
  }
  .yarn-style{
    text-overflow: ellipsis;
    overflow: hidden;
    max-width: 300px;
    white-space: nowrap;
    color: #151222;
  }
  .precfeefing{
    .el-form-item__label{
      color: #888e9e;
      // line-height: 28px;
    }
  }
  .card-froms{
    .el-form-item__label-wrap{
      label{color: #888e9e !important;}
    }
    .el-form-item__content{
      div{
        span{color: #474747 !important; }
      }
    }
  }
  // .card-list{
  //   .el-table__header-wrapper .has-gutter tr th{ height: 44px!important;}
  // }

}
</style>
<style  lang="scss" scoped>
#WeavingDeliveryDetailCopy {
  padding: 0 20px;

}
</style>
