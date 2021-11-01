<!--
 * @Date: 2020-12-22 09:52:31
 * @Author: Againss
 * @LastEditTime: 2021-07-08 09:48:12
 * @LastEditors: zhengjin
 * @Descripttion:
-->
<template>
  <div class="product-detail-content">
    <div class="product-item-content">
      <div class="product-content-title">
        <div>批量上传</div>
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
      <div class="product-content-info">
        <div class="tableitem">
          <div class="titleitem">
            <div class="title">处理结果</div>
            <div>
              <el-button
                v-show="uploadDataSource[0].dataSource.length"
                style="margin-top: 10px"
                type="primary"
                size="mini"
                @click="downloadResult"
              >下载已处理结果</el-button>
            </div>
          </div>
          <cs-custom-form
            ref="uploadTable"
            class="product-style-table"
            :data-source="uploadDataSource"
          />
        </div>
        <cs-custom-pop :options="importPopOptions" />
      </div>
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
          onSuccess: (res, file) => {
            this.setUploadTable(res)
            if (!res.data || !res.data.data || res.data.data.length === 0) {
              this.$message.success('导入成功')
            }

            res.data && res.data.code && res.data.code.length && this.fetchLog(
              this.getLogMessages('IMPORT', `${configData.productRequestPrefix}/api/naturalFiber/import`),
              file,
              JSON.stringify({
                beforeText: `在'产品目录库-纱线管理-天然纤维'批量导入成功`,
                beforeCode: { code: res.data && res.data.code && res.data.code.length ? res.data.code.join() : '' }
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
          action: `${configData.productRequestPrefix}/api/naturalFiber/import`,
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
        headerCellStyle: {
          background: '#F5F7FA!important'
        },
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
      location.href = `https://oss-sfabric.sfabric.com/product-catalog-demo/demo/naturalFiber_import.xlsx?T=${new Date().getTime()}`
    },
    /**
     * @description 文件导入失败后，处理表格数据
     */
    setUploadTable(res) {
      if (res.data && res.data.data && res.data.data.length) {
        this.$set(this.uploadDataSource[0], 'dataSource', res.data.data)
        this.errResultUrl = res.data.errorExcelUrl || ''
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
.tableitem {
  width: 100%;
  .titleitem {
    display: flex;
    justify-content: space-between;
    .title {
      ::before {
        content: "";
        border-left: 4px solid #001528;
      }
      font-size: 16px;
      color: #151222;
      padding-right: 12px;
      line-height: 52px;
    }
  }
  /deep/ thead {
    font-size: 14px;
  }
}
/deep/.table tr:nth-child(even) {
  background-color: #ffffff;
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
