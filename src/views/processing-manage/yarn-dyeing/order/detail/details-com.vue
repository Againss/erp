<!--
 * @Descripttion:染纱订单详情
 * @version:
 * @Author: shujing
 * @Date: 2020-11-17 10:53:03
 * @LastEditors: OBKoro1
 * @LastEditTime: 2021-06-23 14:49:19
-->
<template>
  <div class="analyse-com_order order_analyse-com">
    <div class="header-product">
      <cs-custom-form
        ref="product"
        :data-source="productData"
        :options="formOptions"
        :form-datas="formDatas"
      />
    </div>
    <detail-branch
      ref="codePop"
      :active-index="activeIndex"
      :data-branch="ListData"
      :is-edit="isEdit"
      :sync-moudle-data-handle="syncMoudleDataHandle"
      :set-parent-data-handle="setParentDataHandle"
    />
  </div>
</template>

<script>
import detailBranch from './detailBranch'
import { PublicCustomer } from '@/views/customer-order/public/index'
import uploadFile from './upload-file'
import { setOrderFun } from '../../public/mou'
export default {
  components: {
    detailBranch
  },
  mixins: [PublicCustomer, setOrderFun],
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
    },
    setParentDataHandle: {
      type: Function
    }
  },
  data() {
    const detailStyle = {
      width: '32%',
      height: '32px',
      'line-height': '32px',
      'margin-bottom': '0px',
      'margin-right': '10px'
    }
    // 产品信息 this.inputTypeChange
    const productData = {
      _orderId: {
        prop: 'orderId',
        itemType: 'itemview',
        itemStyle: detailStyle,
        label: '染纱单号：',
        valueType: 'object',
        renderContent: this.renderContent
      },
      _supplier: {
        prop: 'supplier',
        itemType: 'itemview',
        itemStyle: detailStyle,
        label: '染纱厂：',
        valueType: 'object',
        renderContent: this.renderObj
      },
      _pmUser: {
        prop: 'pmUser',
        itemType: 'itemview',
        itemStyle: detailStyle,
        label: '跟单人员：',
        clearable: true,
        disabled: true,
        renderContent: this.renderObj
      },
      _status: {
        prop: 'status',
        itemType: 'itemview',
        className: 'hideInput',
        itemStyle: detailStyle,
        label: '状态：',
        clearable: true,
        disabled: true,
        renderContent: (
          value,
          options,
          form,
          formDatas,
          setFormDatas,
          scope
        ) => {
          return `<div class='yarn_order'>${this.getStatus(value)}</div>`
        }
      },
      _createdByName: {
        prop: 'createdByName',
        itemType: 'itemview',
        className: 'hideInput',
        itemStyle: detailStyle,
        label: '排厂人员：',
        clearable: true,
        disabled: true,
        renderContent: this.renderContent
      },
      _createdTime: {
        prop: 'createdTime',
        itemType: 'itemview',
        className: 'hideInput',
        itemStyle: detailStyle,
        label: '排厂时间：',
        clearable: true,
        disabled: true,
        renderContent: (
          value,
          options,
          form,
          formDatas,
          setFormDatas,
          scope
        ) => {
          return `<div title='${
            value ? this.$filters.parseTime(value) : '-'
          }' class='yarn_order'>${
            value ? this.$filters.parseTime(value) : '-'
          }</div>`
        }
      },
      // 已提交 this.getOrdestatus === 'W'
      _submitTime: {
        prop: 'submitTime',
        itemType: 'itemview',
        className: 'hideInput',
        itemStyle: detailStyle,
        isShow: (scope) => {
          return this.getOrdestatus === 'S'
        },
        label: '提交时间：',
        clearable: true,
        disabled: true,
        renderContent: (
          value,
          options,
          form,
          formDatas,
          setFormDatas,
          scope
        ) => {
          return `<div title='${
            value ? this.$filters.parseTime(value) : '-'
          }' class='yarn_order'>${
            value ? this.$filters.parseTime(value) : '-'
          }</div>`
        }
      },
      _submitUserName: {
        prop: 'submitUserName',
        itemType: 'itemview',
        className: 'hideInput',
        itemStyle: detailStyle,
        isShow: (scope) => {
          return this.getOrdestatus === 'S'
        },
        label: '提交人员：',
        clearable: true,
        disabled: true,
        renderContent: this.renderContent
      },
      // 已回撤
      _recallTime: {
        prop: 'recallTime',
        itemType: 'itemview',
        className: 'hideInput',
        itemStyle: detailStyle,
        isShow: (scope) => {
          return this.getOrdestatus === 'R'
        },
        label: '撤回时间：',
        clearable: true,
        disabled: true,
        renderContent: (
          value,
          options,
          form,
          formDatas,
          setFormDatas,
          scope
        ) => {
          return `<div title='${
            value ? this.$filters.parseTime(value) : '-'
          }' class='yarn_order'>${
            value ? this.$filters.parseTime(value) : '-'
          }</div>`
        }
      },
      _recallUserName: {
        prop: 'recallUserName',
        itemType: 'itemview',
        className: 'hideInput',
        itemStyle: detailStyle,
        label: '撤回人员：',
        isShow: (scope) => {
          return this.getOrdestatus === 'R'
        },
        clearable: true,
        disabled: true,
        renderContent: this.renderContent
      },
      // 已完工
      _finishTime: {
        prop: 'finishTime',
        itemType: 'itemview',
        className: 'hideInput',
        itemStyle: detailStyle,
        label: '完工时间：',
        isShow: (scope) => {
          return this.getOrdestatus === 'F'
        },
        clearable: true,
        disabled: true,
        renderContent: (
          value,
          options,
          form,
          formDatas,
          setFormDatas,
          scope
        ) => {
          return `<div title='${
            value ? this.$filters.parseTime(value) : '-'
          }' class='yarn_order'>${
            value ? this.$filters.parseTime(value) : '-'
          }</div>`
        }
      },
      _finishUserName: {
        prop: 'finishUserName',
        itemType: 'itemview',
        className: 'hideInput',
        itemStyle: detailStyle,
        label: '完工人员：',
        isShow: (scope) => {
          return this.getOrdestatus === 'F'
        },
        clearable: true,
        disabled: true,
        renderContent: this.renderContent
      },
      // 已取消
      _cancelTime: {
        prop: 'cancelTime',
        itemType: 'itemview',
        className: 'hideInput',
        itemStyle: detailStyle,
        isShow: (scope) => {
          return this.getOrdestatus === 'C'
        },
        label: '取消时间：',
        clearable: true,
        disabled: true,
        renderContent: (
          value,
          options,
          form,
          formDatas,
          setFormDatas,
          scope
        ) => {
          return `<div title='${
            value ? this.$filters.parseTime(value) : '-'
          }' class='yarn_order'>${
            value ? this.$filters.parseTime(value) : '-'
          }</div>`
        }
      },
      _cancelUserName: {
        prop: 'cancelUserName',
        itemType: 'itemview',
        className: 'hideInput',
        itemStyle: detailStyle,
        label: '取消人员：',
        isShow: (scope) => {
          return this.getOrdestatus === 'C'
        },
        clearable: true,
        disabled: true,
        renderContent: this.renderContent
      }
    }
    const baseEdit = {
      _note: {
        prop: 'note',
        itemType: 'input',
        type: 'textarea',
        row: 5,
        labelWidth: '88px',
        itemClassName: 'precMaleft precHth',
        className: 'precautionscolor',
        maxlength: 200,
        itemStyle: { width: '100%', 'margin-top': '10px;' },
        label: '注意事项:',
        trim: (value) => {
          return value
        },
        dataSource: []
      },
      _attachmentPath: {
        prop: 'attachmentPath',
        itemType: 'upload',
        labelWidth: '88px',
        itemClassName: 'precHth precFile',
        drag: true,
        itemStyle: {
          width: '100%'
        },
        data: {
          bizType: 'ORDER',
          bizId: this.routeId()
        },
        className: 'uploadfile',
        label: '附件:',
        action: '/common/file/upload', // 最新的链接
        limit: 6,
        beforeRemove: (file, fileList) => {
          const editformObj = this.$utils.deepClone(fileList)
          const arr = []
          editformObj &&
            editformObj.forEach((item, indexs) => {
              if (item.uid !== file.uid) {
                arr.push(item)
              }
            })
          this.$set(this.productData._attachmentPath, 'dataSource', arr)
          this.formDatas = { attachmentPath: arr }
        },
        onPreview: (file) => {},
        beforeUpload: (file) => {
          return this.DocumentGudgment(file)
        },
        onExceed: (files) => {
          this.$message.error('上传文件个数不能超过6个!')
        },
        customText: '上传',
        accept:
          '.png,.PNG,.jpg,.JPG,.jpeg,.JPEG,.bmp,.BMP,.xlsx,.xls,.XLSX,.XLS,.pdf,.PDF,.doc,.docx,.DOC,.DOCX'
      }
    }
    const baseLookOver = {
      _note: {
        prop: 'note',
        itemType: 'itemview',
        itemStyle: {
          width: '100%',
          'line-height': '32px',
          'margin-bottom': '0px',
          'padding-right': '20px'
        },
        itemClassName: 'note-class',
        label: '注意事项:',
        renderContent(value, options, form, formDatas, setFormDatas, scope) {
          value =
            value && value.indexOf('\n') !== -1
              ? value.replace(/\n/g, '<br>')
              : value
          return value
        }
      },
      _attachmentPath: {
        prop: 'attachmentPath',
        label: '附件:',
        components: {
          uploadFile
        },
        componentsOptions: {
          prop: 'attachmentPath',
          url: 'attachmentPath',
          text: '附件:'
        }
      }
    }
    return {
      accept:
        '.png,.PNG,.jpg,.JPG,.jpeg,.JPEG,.bmp,.BMP,.xlsx,.xls,.XLSX,.XLS,.pdf,.PDF,.doc,.docx,.DOC,.DOCX',
      productData,
      baseEdit,
      ListData: [],
      AllData: {},
      baseLookOver,
      formDatas: {},
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
  computed: {
    getOrdestatus() {
      return (this.data && this.data.status) || ''
    }
  },
  watch: {
    data: {
      handler(v) {
        if (v && Object.keys(v).length) {
          const datas = this.$utils.deepClone(v)
          const cs = this.$utils.deepClone(v)
          delete cs.details
          this.isClick(this.isEdit)
          this.ListData = datas.details || []
          this.formDatas = { ...cs, isEdit: this.isEdit }
        } else {
          this.formDatas = {}
        }
      },
      deep: true,
      immediate: true
    },
    activeIndex: {
      handler(v) {
        // if (this.data && Object.keys(this.data).length) {
        // this.setStatus(this.data && Object.keys(this.data).length ? this.data.status : '')
        // }
      },
      deep: true,
      immediate: true
    },
    isEdit: {
      handler(v) {
        this.isClick(v)
      },
      deep: true,
      immediate: true
    }
  },
  created() {},
  mounted() {},
  methods: {
    // 获取id
    routeId() {
      const sp =
        this.$route.params && this.$route.params.id
          ? this.$route.params.id
          : ''
      return sp
    },
    // 判断文件上传格式
    DocumentGudgment(file) {
      const flieText = file.name.length <= 50
      let isLt1M = false
      let isXls = false
      if (flieText) {
        const fileName = file.name.split('.')
        const fileType = fileName[fileName.length - 1]
        const regexp = new RegExp(fileType)
        isXls = regexp.test(this.accept)
        isLt1M = file.size / 1024 / 1024 <= 10
      }
      if (!flieText) {
        this.$message.error('上传文件名不能超过50个字符')
      } else if (!isXls) {
        this.$message.error(
          '上传文件只能是 JPG/JPEG/PNG/BMP/PDF/EXCEL/WORD 格式!'
        )
      } else if (!isLt1M) {
        this.$message.error('上传文件大小不能超过 10MB!')
      }
      return isXls && isLt1M && flieText
    },
    renderContent(value, options, form, formDatas, setFormDatas, scope) {
      return `<div title='${value || '-'}' class='yarn_order'>${
        value || '-'
      }</div>`
    },
    renderObj(value, options, form, formDatas, setFormDatas, scope) {
      return `<div title='${value ? value.label : '-'}' class='yarn_order'>${
        value ? value.label : '-'
      }</div>`
    },
    isClick(v) {
      if (v) {
        this.productData = { ...this.productData, ...this.baseEdit }
        this.$nextTick(() => {
          this.$refs.product.form.clearValidate()
        })
      } else {
        this.productData = { ...this.productData, ...this.baseLookOver }
      }
    },
    inputTypeChange() {
      if (this.isEdit) {
        return 'input'
      }
      return 'itemview'
    },
    selectTypeChange() {
      if (this.type === 'edit') {
        return 'select'
      }
      return 'itemview'
    }
  }
}
</script>
<style lang="scss">
.order_analyse-com {
  .note-class {
    .el-form-item__label {
      padding-right: 20px;
    }
    .el-form-item__content {
      >div{
        white-space:normal !important
      }
    }
  }
  .yarn_order {
    text-overflow: ellipsis;
    overflow: hidden;
    max-width: 300px;
    white-space: nowrap;
    color: #474747;
    display: flex;
    height: 32px;
    align-items: center;
  }
  .header-product {
    .detail-branch-detail-form {
      padding-top: 20px;
      .el-form-item__label {
        line-height: 32px;
      }
    }
  }
}

.order_analyse-com {
  .detail-branch-detail-form {
    background: #fff;
    padding: 0 20px;
  }
}
</style>

<style lang="scss" scoped>
.order_analyse-com {
  width: 100%;
  .header-product {
    border-bottom: 1px solid #dfe6ec;
    border-top: 1px solid #dfe6ec;
  }
  // //附件信息样式
  /deep/ .uploadfile .el-upload-dragger {
    width: 57px;
    height: auto;
    text-align: left;
    cursor: auto;
    border: none;
  }
  /deep/ .uploadfile .el-icon-upload {
    font-size: 36px;
    margin: 10px 0 0 0;
  }
  /deep/ .uploadfile .el-upload-list.el-upload-list--text {
    > li {
      display: inline-flex;
      width: 50%;
      height: 20px;
      line-height: 20px;
    }
  }
  /deep/.precMaleft label {
    text-align: right;
    line-height: 20px !important;
  }
  /deep/ .precHth {
    margin-top: 10px;
  }
  /deep/ .precFile {
    label {
      line-height: 20px !important;
    }
  }
}
</style>
