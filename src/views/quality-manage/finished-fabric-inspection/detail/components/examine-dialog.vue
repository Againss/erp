<template>
  <cs-custom-pop :options="options" />
</template>
<script>
import { qaFinishFabricInspectionTaskAudit } from '../api/index'
import logMethods from '@/views/product-center/mixin/log-methods'
import uploadSlotTrigger from '@/views/quality-manage/finished-cloth/detail/components/upload-slot-trigger'

export default {
  mixins: [logMethods],
  props: {
    data: {
      type: Object,
      default: () => ({
        id: '',
        qaFinishFabricDefectInformationList: [], // 成品验布疵点整缸信息
        qaFinishFabricRecordList: [], // 验布信息list
        qaGreigeInspectionInfoResponse: {} // 加工基础信息
      })
    }
  },
  data() {
    // 公用验证正则
    const commonBlurReg = this.$getRules({ trigger: ['blur'] })
    return {
      fileList: [],
      attachmentName: '', // 附件名称 附件id 用，分隔
      auditAttachmentName: '', // 审核附件名称  附件id 用，分隔
      options: {
        itemType: 'dialog',
        visible: false,
        title: '审核',
        okText: '提交',
        ok: params => {
          this.doExamine(params)
        },
        beforeClose: (form, formDatas) => {
          this.options.visible = false // 关闭弹框
        },
        cancel: (params) => {
          this.options.visible = false // 关闭弹框
        },
        formDatas: {},
        formOptions: {},
        content: {
          auditComments: { itemType: 'input', type: 'textarea', prop: 'auditComments', label: '', labelWidth: '0', maxlength: 200, rows: 5, disabled: false, clearable: true, rules: [commonBlurReg], placeholder: '请输入评审意见(1-200字)' },
          _attachmentUpload: {
            prop: 'attachmentUpload',
            itemType: 'upload',
            label: '上传附件:',
            className: 'upload-attachment',
            itemStyle: { 'width': '100%', 'margin-top': '20px !important', 'border': 'none', 'height': 'auto', 'padding': '0', 'background': '#fff' },
            onSuccess: (res, file) => {
              console.log(res, file)
              if (res.code === 200) {
                this.$message.success('导入成功')
                this.fileList.push(res.data)
              }
            },
            onExceed: (files, fileList) => {
              this.$message.warning(`当前限制选择 10 个文件`)
            },
            beforeRemove: (file, fileList) => {
              const index = this.fileList.findIndex(n => n.id === file.response.data.id) // 寻找下标
              this.fileList.splice(index, 1) // 根据下标删除元素
            },
            action: `/common/file/upload`,
            data: {
              bizId: this.data.id || '',
              bizType: 'QAPUBLIC'
            },
            accept: '*',
            showFileList: true,
            fileList: this.fileList,
            limit: 10,
            timeout: 30000,
            content: [
              {
                slot: 'trigger',
                component: uploadSlotTrigger
              }
            ]
          }
        }
      }
    }
  },
  created() {
  },
  mounted() {
  },
  methods: {
    // 审核
    async doExamine(params) {
      const { code = 0 } = await qaFinishFabricInspectionTaskAudit({ id: this.data.id, auditAttachmentName: this.fileList.map(n => n.id).join(','), auditComments: params.auditComments })
      if (code === 200) {
        this.$message.success('审核成功')
        this.$router.go(-1)
        this.fetchLog(
          this.getLogMessages('UPDATE', '/qa/qaFinishFabricInspectionTask/audit', 'qa'),
          { id: this.data.id },
          JSON.stringify({
            beforeText: `在"质量管理-成品检测-成品验布"审核成功一条记录`,
            beforeCode: { id: this.data.id }
          })
        )
      }
    },
    // 初始化
    init() {
      this.options.visible = true
    }
  }
}
</script>

<style>

</style>
