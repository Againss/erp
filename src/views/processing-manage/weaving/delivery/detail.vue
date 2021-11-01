<template>
  <div id="WeavingDeliveryDetail" class="details WeavingDeliveryDetail">
    <div class="head-base">
      <div class="msg-lf">单号：{{ baseDatas.sendNo }}</div>
    </div>
    <div class="card">
      <div class="card-title">基本信息</div>
      <cs-custom-form
        :data-source="baseDataSource"
        :options="baseOptions"
        :form-datas="baseDatas"
      />
    </div>
    <div class="card" style="margin-top: 16px">
      <div class=" detail">
        <cs-custom-table :columns="columns" :data-source="dataSource" />
      </div>
    </div>
  </div>
</template>

<script>
import * as api from '@/views/processing-manage/weaving/delivery/api/index.js'
import { parseTime } from '@/utils'

export default {
  name: 'WeavingDeliveryDetail',
  data() {
    const itemStyle = {
      // width: '33%'
    }
    const baseDataSource = {
      _sendNo: {
        prop: 'sendNo', // 第一版默认纱
        itemType: 'itemview',
        label: '通知单号：',
        itemStyle,
        renderContent: (val) => {
          return val
        },
        title: true
      },
      _allotOutAddr: {
        prop: 'allotOutAddr', // 第一版默认纱
        itemType: 'itemview',
        label: '原纱地址：',
        itemStyle,
        renderContent: (val) => {
          return val
        },
        title: true
      },
      _outUserName: {
        prop: 'outUserName',
        itemType: 'itemview',
        label: '联系人员：',
        itemStyle
      },
      _outUserConnect: {
        prop: 'mbe',
        itemType: 'itemview',
        label: '联系方式：',
        itemStyle
      },
      _sourceNo: {
        prop: 'sourceNo',
        itemType: 'itemview',
        label: '送入生产单：',
        itemStyle,
        renderContent: (val) => {
          return val
        },
        title: true
      },
      _allotInAddr: {
        prop: 'allotInAddr',
        itemType: 'itemview',
        label: '送入地址：',
        itemStyle,
        title: true,
        renderContent: (val) => { return val }
      },
      _inUserName: {
        prop: 'inUserName',
        itemType: 'itemview',
        label: '送入联系人员：',
        itemStyle
      },
      _inUserContact: {
        prop: 'inUserContact',
        itemType: 'itemview',
        label: '送入联系方式：',
        itemStyle
      },
      _pmUserName: {
        prop: 'pmUserName',
        itemType: 'itemview',
        label: '跟单人员：',
        itemStyle
      },
      _createdBy: {
        prop: 'createdBy',
        itemType: 'itemview',
        label: '创建人员：',
        itemStyle
      },
      _createdTime: {
        prop: 'createdTime',
        itemType: 'itemview',
        label: '创建时间：',
        itemStyle,
        renderContent: (val) => {
          return parseTime(val)
        }
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
      _sourceCode: {
        prop: 'sourceCode',
        label: '来源单号',
        minWidth: '100',
        showOverflowTooltip: true
      },
      _yarnCode: {
        prop: 'yarnCode',
        label: '坯纱编码',
        showOverflowTooltip: true,
        minWidth: '100'
      },
      _yarnName: {
        prop: 'yarnName',
        label: '纱名',
        showOverflowTooltip: true,
        minWidth: '100'
      },
      _yarnAttr: {
        prop: 'yarnAttr',
        label: '纱属性',
        showOverflowTooltip: true,
        minWidth: '100'
      },
      _yarnColor: {
        prop: 'yarnColor',
        label: '染纱颜色',
        showOverflowTooltip: true,
        minWidth: '100'
      },
      _factoryColorCode: {
        prop: 'factoryColorCode',
        label: '工厂色号',
        showOverflowTooltip: true,
        minWidth: '100'
      },
      _qty: {
        prop: 'qty',
        label: '送纱量(KG)',
        align: 'right',
        showOverflowTooltip: true,
        minWidth: '100'
      },
      _planDelivery: {
        prop: 'planDelivery',
        label: '计划到纱期',
        showOverflowTooltip: true,
        minWidth: '100',
        formater: (scope) => {
          return parseTime(scope.row.planDelivery, '{y}-{m}-{d}')
        }
      }
    }
    return {
      dataSource: [],
      columns,
      baseDataSource,
      baseOptions: {
        inline: true,
        className: 'msg-content'
      },
      baseDatas: {}
    }
  },
  computed: {
    id() {
      return this.$route.query.id
    },
    uuid() {
      return this.$route.query.uuid
    }
  },
  created() {
    this.getInfo()
  },
  methods: {
    async getInfo() {
      const res = await api.info({ id: this.id, uuid: this.uuid })
      if (res.code === 200) {
        this.baseDatas = res.data || {}
        this.dataSource = res.data.details || []
      } else {
        this.$message({
          message: res.message,
          type: 'error'
        })
      }
    }
  }
}
</script>

<style  lang="scss" scoped>
#WeavingDeliveryDetail {
  padding: 0 20px;
}
</style>
<style  lang="scss">
@import "@/styles/base.scss";
#WeavingDeliveryDetail {
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
    .el-table th {
      background-color: #f5f7fa;
      padding: 0;
      .cell {
        height: 40px;
        line-height: 40px;
      }
    }
    .el-table td {
      height: 40px;
      line-height: 40px;
      padding: 0;
    }
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
        .el-form-item__label{
          color: #888E9E;
        }
       .el-form-item__content{
          color: #474747;
        }
      }
      // .el-form-item__label {
      //   color: #888e9e;
      //   padding: 0;
      // }
    }
  }
}
</style>
