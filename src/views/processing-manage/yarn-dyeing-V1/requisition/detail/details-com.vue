<!--
 * @Descripttion:原纱调拨通知单
 * @version:
 * @Author: shujing
 * @Date: 2020-11-17 10:53:03
 * @LastEditors: OBKoro1
 * @LastEditTime: 2021-06-23 15:31:44
-->
<template>
  <div class="analyse-com_requisitio">
    <div class="header-product">
      <cs-custom-form ref="product" :data-source="productData" :options="formOptions" :form-datas="formDatas" />
    </div>
    <detail-branch ref="codePop" :data-branch="ListData" :active-index="activeIndex" :is-edit="isEdit" :sync-moudle-data-handle="syncMoudleDataHandle" />
  </div>
</template>

<script>
import detailBranch from './detailBranch'
import { setOrderFun } from '../../public/mou'
export default {
  components: {
    detailBranch
  },
  mixins: [setOrderFun],
  props: {
    isEdit: {
      type: Boolean
    },
    activeIndex: {
      type: String
    },
    data: {
      type: Object
    },
    syncMoudleDataHandle: {
      type: Function
    }
  },
  data() {
    const detailStyle = {
      width: '32%',
      height: '32px',
      'line-height': '32px',
      'margin-bottom': '0px'
    }
    // 产品信息 this.inputTypeChange
    const productData = {
      _noticeNo: {
        prop: 'noticeNo',
        itemType: 'itemview',
        itemStyle: detailStyle,
        label: '调拨单号：',
        valueType: 'object',
        clearable: true,
        renderContent: this.renderContent,
        dataSource: []
      },
      _allotOutAddr: {
        prop: 'allotOutAddr',
        itemType: 'itemview',
        itemStyle: detailStyle,
        label: '调出地址：',
        valueType: 'object',
        clearable: true,
        renderContent: this.renderContent,
        dataSource: []
      },
      _outUserName: {
        prop: 'outUserName',
        itemType: 'itemview',
        itemStyle: detailStyle,
        label: '联系人员：',
        clearable: true,
        disabled: true,
        renderContent: this.renderContent
      },
      _outUserConnect: {
        prop: 'outUserConnect',
        itemType: 'itemview',
        itemStyle: detailStyle,
        label: '联系方式：',
        clearable: true,
        disabled: true,
        renderContent: this.renderContent
      },
      _sourceNoAddr: {
        prop: 'sourceNoAddr',
        itemType: 'itemview',
        itemStyle: detailStyle,
        label: '调入地址：',
        clearable: true,
        disabled: true,
        renderContent: this.renderContent
      },
      _inUserName: {
        prop: 'inUserName',
        itemType: 'itemview',
        itemStyle: detailStyle,
        label: '联系人员：',
        clearable: true,
        disabled: true,
        renderContent: this.renderContent
      },
      _inUserContact: {
        prop: 'inUserContact',
        itemType: 'itemview',
        itemStyle: detailStyle,
        label: '联系方式：',
        clearable: true,
        isShow: true,
        disabled: true,
        renderContent: this.renderContent
      },
      _sourceNo: {// pm
        prop: 'sourceNo',
        itemType: 'itemview',
        itemStyle: detailStyle,
        label: '调入生产单：',
        isShow: true,
        clearable: true,
        disabled: true,
        renderContent: this.renderContent
      },
      _pmUserName: {
        prop: 'pmUserName',
        itemType: 'itemview',
        itemStyle: detailStyle,
        label: '跟单人员：',
        clearable: true,
        isShow: true,
        disabled: true,
        renderContent: this.renderContent
      },
      _createdByName: {
        prop: 'createdByName',
        itemType: 'itemview',
        itemStyle: detailStyle,
        label: '创建人员：',
        clearable: true,
        isShow: true,
        disabled: true,
        renderContent: this.renderContent
      },
      _createdTime: {
        prop: 'createdTime',
        itemType: 'itemview',
        itemStyle: detailStyle,
        label: '创建时间：',
        clearable: true,
        isShow: true,
        disabled: true,
        renderContent: (value, options, form, formDatas, setFormDatas, scope) => {
          return `<div title='${value ? this.$filters.parseTime(value + '', '{y}-{m}-{d} {h}:{i}') : '-'}' class='yarn_order'>${value ? this.$filters.parseTime(value + '', '{y}-{m}-{d} {h}:{i}') : '-'}</div>`
        }
      },
      _status: {
        prop: 'status',
        itemType: 'itemview',
        itemStyle: detailStyle,
        label: '状态：',
        clearable: true,
        isShow: true,
        disabled: true,
        renderContent: (value, options, form, formDatas, setFormDatas, scope) => {
          if (value) {
            return this.getStatus(value)
          } else {
            return ''
          }
        }
      }
    }
    return {
      productData,
      formDatas: {},
      ListData: [],
      formOptions: {
        size: 'small',
        inline: true,
        labelWidth: '96px',
        className: 'detail-branch-detail-form',
        syncDataHandle: (syncData) => {
          this.syncMoudleDataHandle('productData', syncData)
        }
      }
    }
  },
  watch: {
    data: {
      handler(v) {
        if (v && Object.keys(v).length) {
          const datas = this.$utils.deepClone(v)
          this.ListData = datas.details || []
          this.formDatas = datas
        }
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    renderContent(value, options, form, formDatas, setFormDatas, scope) {
      return `<div title='${value || '-'}' class='yarn_order'>${value || '-'}</div>`
    }
  }
}
</script>
<style lang="scss">
  .analyse-com_requisitio{
    .yarn_order{
      text-overflow: ellipsis;
      overflow: hidden;
      max-width: 300px;
      white-space: nowrap;
      display: flex;
      align-items: center;
      color: #474747;
    }
    .detail-branch-detail-form {
      background: #fff;
      padding: 16px 20px;
      .el-form-item__content{
        display: flex;
        align-items: center;
      }
      .el-form-item__label {
        color: #888e9e;
        line-height: 28px;
      }
      .el-form-item__content {
        color: #474747;
        line-height: 28px;
      }
    }
    .header-product{
      .detail-branch-detail-form {
        .el-form-item__label{ line-height: 32px;}
      }
    }
    @media screen and (max-width: 1440px) {
      .yarn_order{
         max-width: 185px;
      }
    }
  }
</style>

<style lang="scss" scoped>
.analyse-com_requisitio{
  width: 100%;
  .header-product{
    border-bottom: 1px solid #dfe6ec;
    border-top: 1px solid #dfe6ec;
  }
      /deep/ th.ruleTip  .cell::before {
        display: block;
        content: '*';
        position: absolute;
        left: 4px;
        color: #FE4949;
      }
}
</style>
