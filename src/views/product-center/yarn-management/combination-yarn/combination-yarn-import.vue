<!--
 * @Author: anthony
 * @Date: 2020-11-23 11:23:35
 * @LastEditors: Sanmao
 * @LastEditTime: 2021-02-03 13:55:59
 * @Descripttion: 组合纱批量导入页面
-->
<template>
  <div class="product-detail-content">
    <div class="product-item-content">
      <div class="product-content-title upload-title">
        <div class="upload-text">批量上传</div>
        <div class="upload-btn">
          <el-button
            type="primary"
            size="mini"
            plain
            @click="uploadFile"
          >上传文件</el-button>
          <el-button
            type="primary"
            size="mini"
            plain
            @click="downloadTemplate"
          >模板下载</el-button>
        </div>
      </div>
      <div class="product-content-title result-table">
        <div class="result-text">
          <span>处理结果</span>
          <span
            v-show="uploadDataSource[0].dataSource.length"
            @click="downloadResult"
          >下载已处理结果</span>
        </div>
        <div>
          <cs-custom-form
            ref="uploadTable"
            class="p-10"
            :data-source="uploadDataSource"
          />
        </div>
      </div>
      <cs-custom-pop :options="importPopOptions" />
    </div>
    <div
      v-show="tableLoading"
      v-loading="tableLoading"
      class="page-loading"
      element-loading-text="拼命导入中..."
      element-loading-spinner="el-icon-loading"
      element-loading-background="rgba(0, 0, 0, 0.4)"
    />
  </div>
</template>
<script>
import uploadSlotTrigger from '@/views/user-center/employee-management/components/upload-slot-trigger.vue'
import logMethods from '@/views/product-center/mixin/log-methods'
import configData from '@/views/product-center/configDock/index.js'
export default {
  name: 'ChemicalFiberImport',
  mixins: [logMethods],
  data() {
    // 批量导入pop弹出框的配置信息
    const importPopOptions = {
      itemType: 'dialog',
      visible: false,
      title: '导入文件',
      showFooter: false,
      cancelHidden: true,
      okHidden: true,
      width: '560px',
      content: [
        {
          prop: 'upload',
          itemType: 'upload',
          className: 'upload-demo',
          onSuccess: (res, file) => {
            this.setUploadTable(res)
            if (!res.data || !res.data.data || res.data.data.length === 0) {
              this.$message.success('导入成功')
            }

            res.data && res.data.codes && res.data.codes.length && this.fetchLog(
              this.getLogMessages('IMPORT', `${configData.productRequestPrefix}/api/yarn/composite/import`),
              file,
              JSON.stringify({
                beforeText: `在'产品目录库-纱线管理-组合纱'批量导入成功`,
                beforeCode: { code: res.data && res.data.codes && res.data.codes.length ? res.data.codes.join() : '' }
              })
            )
            this.setUploadtableLoad()
            this.importPopDialogHandle()
          },
          onError: (res, file) => {
            this.setUploadTable(res)
            this.setUploadtableLoad()
          },
          beforeUpload: (file) => {
            const fileName = file.name.split('.')
            const fileType = fileName[fileName.length - 1]
            const regexp = new RegExp(fileType)
            const isXls = regexp.test(this.accept)
            if (!isXls) {
              this.$message.error('上传文件只能是 .xlsx,.xls,XLSX,.XLS 格式!')
              this.setUploadtableLoad()
            }
            this.setUploadtableLoad()
            return isXls
          },
          action: `${configData.productRequestPrefix}/api/yarn/composite/import`,
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
    const uploadColumns = [
      {
        prop: 'line',
        label: '序号',
        width: '180',
        showOverflowTooltip: true
      },
      {
        prop: 'message',
        label: '失败原因',
        showOverflowTooltip: true
      }
    ]
    const uploadDataSource = [
      {
        prop: 'tableForm',
        itemType: 'table-form',
        dataSource: [],
        columns: uploadColumns,
        size: 'mini'
      }
    ]
    return {
      importPopOptions,
      accept: '.xlsx,.xls,XLSX,.XLS',
      uploadDataSource,
      tableLoading: false,
      errResultUrl: '' // 下载已处理结果url
    }
  },
  methods: {
    /** *
     * @description 修改弹出层的判断
     */
    importPopDialogHandle(val) {
      this.$set(
        this.importPopOptions,
        'visible',
        !this.importPopOptions.visible
      )
      if (val) {
        this.$set(this.importPopOptions, 'title', val)
      }
    },
    /**
     * @description 显示文件导入弹窗
     */
    uploadFile() {
      this.importPopDialogHandle()
    },
    /**
     * @description 下载模板
     */
    downloadTemplate() {
      // 后端要求前端加个随机生成字符串的参数，后端更换模板说有缓存，加参数是为了清除缓存
      var str = Math.random().toString(36).slice(-6)
      location.href = `https://oss-sfabric.sfabric.com/product-catalog-demo/demo/CompositeImportModule.xlsx?a=${str}`
    },
    /**
     * @description 文件导入失败后，处理表格数据
     */
    setUploadTable(res) {
      if (res.data && res.data.errors && res.data.errors.length) {
        this.$set(this.uploadDataSource[0], 'dataSource', res.data.errors)
        this.errResultUrl = res.data.exportUrl || ''
      } else {
        this.errResultUrl = ''
        this.$set(this.uploadDataSource[0], 'dataSource', [])
      }
    },
    /**
     * @description 下载已处理结果
     */
    downloadResult() {
      location.href = this.errResultUrl
    },
    /**
     * @description 导入文件，页面loading加载
     */
    setUploadtableLoad() {
      this.tableLoading = !this.tableLoading
    }
  }
}
</script>
<style lang="scss" scoped>
.product-item-content {
  .upload-title {
    .upload-text {
      font-family: PingFangSC-Regular;
      font-size: 18px;
      color: #151222;
    }
  }
  .result-table {
    flex-direction: column;
    line-height: normal;
    height: auto;
    .result-text {
      margin-bottom: 16px;
      font-family: PingFangSC-Regular;
      display: flex;
      justify-content: space-between;
      & > span:first-child {
        font-size: 16px;
        color: #3c4043;
      }
      & > span:last-child {
        font-size: 14px;
        color: #0986ff;
        cursor: pointer;
      }
    }
    /deep/ .el-table th {
      background: #f5f7fa;
    }
    /deep/ thead {
      font-size: 14px;
    }
    /deep/.table tr:nth-child(even) {
      background: #fff;
    }
  }
}
.page-loading {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 3000;
}
/deep/.upload-demo {
  margin-left: 0;
  margin-top: 0;
}
/deep/.el-form-item {
  margin-bottom: 0;
}
</style>
