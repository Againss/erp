<template>
  <div class="contacts-view-all-page">
    <div class="contactsHeader">
      <span v-if="customerName" class="contactsText">{{ customerName }}</span>
      <div class="details-button">
        <el-button size="mini" @click="viewAllAdd">上传</el-button>
        <!-- <el-button @click="$router.back()">返回</el-button> -->
      </div>
    </div>
    <!-- table表格 -->
    <div class="page-table">
      <cs-custom-table
        :cell-style="isNotPointer"
        tooltip-effect="dark"
        :columns="enclosureColumns"
        :data-source="fileDataSource"
        :operates="enclosurePopOperates"
        :pagination="pagination"
        edit-type="pop"
        highlight-current-row
      />
    </div>
    <!-- 上传弹出框 -->
    <div class="pop">
      <cs-custom-pop :options="enclosurePopOptions" />
    </div>
    <!-- 导入附件更改所有人pop弹出层 -->
    <div class="pop">
      <cs-custom-pop :options="enclosureOwnerPopOptions" />
    </div>
  </div>
</template>

<script>
import { Contract } from '../components/index'
import { PublicCrm } from '@/views/crm/public/index'
import uploadSlotTrigger from '../components/upload-slot-trigger.vue'
import uploadSlotTip from '../components/upload-slot-tip.vue'
export default {
  mixins: [Contract, PublicCrm],
  data() {
    // 公用验证正则
    const commonChangeReg = this.$getRules({})
    // 公用验证正则
    // const commonBlurReg = this.$getRules({ trigger: ['blur'] })
    // 远程用户搜索(更改所有人)
    const remoteUserSearch2 = value => {
      // debugger
      // console.log(value)
      if (value === '') {
        this.$set(this.enclosureOwnerPopOptions.content[0], 'dataSource', [])
      } else {
        if (!this.getData4) {
          this.getData4 = this.$utils.debounce(this.remoteUserList, 300)
        }
        this.getData4({ realName: value, name: value }, 0, this.enclosureOwnerPopOptions)
      }
    }

    // 表格头数据
    const enclosureColumns = [
      {
        prop: 'id',
        label: '序号',
        width: '60',
        formater: scope => {
          // console.log('scope', scope, this.pagination)
          // return this.pagination.currentPage && (this.pagination.currentPage - 1) * 20 + scope.$index + 1
          return scope.$index + 1
        }
      },
      {
        prop: 'originalName',
        label: '文件名称',
        showOverflowTooltip: true,
        minWidth: '80',
        handle: scope => {
          // console.log('scope', scope)
          (scope.row.suffix === 'PDF' || scope.row.suffix === 'pdf') && this.previewEnclosure({ id: scope.row.id })
          // this.$router.push(`/crm/contract/contract-details-page/${scope.row.contractId}`)
        }
        // style: {
        //   color: '#1890ff',
        //   cursor: 'pointer'
        // }
      },
      {
        prop: 'fileSize',
        label: '文件大小',
        minWidth: '80',
        align: 'right',
        formater: scope => {
          const fileSize = scope.row[scope.column.property]
          return fileSize > 1024 ? this.numRecursion(fileSize / 1024) + 'MB' : fileSize + 'KB'
        }
      },
      {
        prop: 'suffix',
        label: '文件格式',
        width: '100'
      },
      {
        prop: 'createdTime',
        label: '创建日期',
        width: '160',
        formater: scope => {
          return scope.row[scope.column.property] ? this.$filters.parseTime(scope.row[scope.column.property] + '', '{y}-{m}-{d} {h}:{i}:{s}') : ''
        }
      },
      {
        prop: 'follower',
        label: '所有人',
        minWidth: '70'
      }
    ]

    // 分页配置信息
    const pagination = {
      // currentPage: 1,
      // pageSize: 20,
      // dataTotal: dataSource.length,
      currentChange: val => {
        // console.log('currentChange', this.pagination)
        this.getfilePage({ pageSize: this.pagination.pageSize || 20, pageNum: val })
      },
      sizeChange: val => {
        // console.log('sizeChange', this.pagination)
        this.getfilePage({ pageNum: this.pagination.pageNum || 1, pageSize: val })
      }
    }

    // 合同附件上传弹出框
    const enclosurePopOptions = {
      itemType: 'dialog',
      visible: false,
      title: '修改',
      // width: '720px',
      // okText: '保存',
      okHidden: true,
      cancelText: '关闭',
      // cancelHidden: true,
      customClass: 'popOptionsClass',
      // ok: params => {
      //   console.log('确认', params)
      //   this.addOrEditContract(params)
      // },
      cancel: params => {
        this.closePopDialogHandle(this.enclosurePopOptions)
        // console.log(params)
      },
      formDatas: {
      },
      formOptions: {
        // inline: true
        // labelWidth: '111px'
      },
      content: [
        {
          prop: 'upload',
          itemType: 'upload',
          label: '',
          className: 'upload-demo',
          // showFileList: false,
          onSuccess: (res, file) => {
            // console.log(res, file)
            this.$message.success('导入成功')
            // this.fetchLog(this.getLogMessages('IMPORT', '/userCenter/sysUser/batch/add'), file, JSON.stringify({ beforeText: `在'用户中心-员工管理'批量导入成功` }))
            // this.importPopDialogHandle()
            this.closePopDialogHandle(this.enclosurePopOptions)
            this.getfilePage()
          },
          onError: (res, file) => {
            // console.log(res, file)
          },
          beforeUpload: (file) => {
            // console.log(file.type.split('/')[1])
            const fileName = file.name.split('.')
            const fileType = fileName[fileName.length - 1]
            const regexp = new RegExp(fileType)
            const isXls = regexp.test(this.accept)
            console.log(file, fileType, regexp, isXls)
            const isLt1M = file.size / 1024 / 1024 <= 10
            if (!isXls) {
              this.$message.error('上传文件只能是 .xlsx,.xls,XLSX,.XLS 格式!')
            } else if (!isLt1M) {
              this.$message.error('上传文件大小不能超过 10MB!')
            }
            return isXls && isLt1M
          },
          action: `/crm/file/upload`,
          data: {
            bizId: this.routeId,
            // follower: this.follower,
            bizType: 'CONTRACT'
          },
          accept: '.xlsx,.xls,.XLSX,.XLS,.ppt,.pptx,.PPT,.PPTX,.pdf,.PDF,.doc,.docx,.DOC,.DOCX',
          showFileList: false,
          timeout: 30000,
          content: [
            {
              slot: 'trigger',
              component: uploadSlotTrigger
            },
            {
              slot: 'tip',
              component: uploadSlotTip
            }
          ]
        }
      ]
    }

    const enclosureOwnerPopOptions = {
      itemType: 'dialog',
      visible: false,
      title: '更改所有人',
      // close: () => { this.$emit('visibleClick', false) },
      //   width: '720px',
      // okText: '保存',
      customClass: 'popOptionsClass',
      ok: this.okEnclosureClick,
      cancel: params => {
        // this.PopDialogHandle()
        // this.$emit('visibleClick', false)
        this.$set(this.enclosureOwnerPopOptions, 'visible', false)
        // console.log(params)
      },
      formDatas: {
        // areaNum: 86
      },
      formOptions: {
        // inline: true
        // labelWidth: '111px'
      },
      content: [
        {
          prop: 'follower',
          itemType: 'select',
          filterable: true,
          className: 'commonRemoteSearch',
          remote: true,
          remoteMethod: remoteUserSearch2,
          loading: false,
          rules: [commonChangeReg],
          // itemStyle: { 'width': '50%', 'marginRight': 0 },
          label: '用户',
          dataSource: [],
          placeholder: '查找用户'
        }
      ]
    }
    // 合同附件操作栏
    const enclosureHandleConf = [
      {
        label: '下载',
        // permitTag: ['userCenter:sysDataMaskingRule:modify'],
        isShow: true,
        handle: params => {
          this.downloadEnclosure({ id: params.row.id })
          // this.type = 'edit'
          console.log('下载', params)
          // this.PopDialogHandle(this.enclosurePopOptions, '编辑商机')
          // this.getContractInfo({ contractId: params.row.contractId })
        }
      },
      {
        label: '删除',
        style: { 'color': '#FE4949' },
        // permitTag: ['userCenter:sysDataMaskingRule:modify'],
        isShow: true,
        handle: params => {
          this.$confirm(' 你确认要删除该附件吗？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
            center: true
          })
            .then(() => {
              this.deleteEnclosure({ id: params.row.id })
            })
            .catch(() => {
              this.$message({
                type: 'info',
                message: '已取消删除'
              })
            })
        }
      },
      {
        label: '更改所有人',
        // permitTag: ['userCenter:sysDataMaskingRule:modify'],
        isShow: true,
        handle: params => {
          // this.type = 'edit'
          console.log('下载', params)
          this.PopDialogHandle(this.enclosureOwnerPopOptions, '更改附件所有人')
          this.$set(this.enclosureOwnerPopOptions, 'formDatas', { id: params.row.id })
          // this.getContractInfo({ contractId: params.row.contractId })
        }
      }
    ]

    const enclosurePopOperates = {
      label: '操作',
      width: '200',
      dataSource: enclosureHandleConf
    }
    return {
      customerName: '',
      fileDataSource: [],
      enclosureColumns,
      enclosurePopOperates,
      pagination,
      enclosureOwnerPopOptions,
      enclosurePopOptions,
      accept: '.xlsx,.xls,.XLSX,.XLS,.ppt,.pptx,.PPT,.PPTX,.pdf,.PDF,.doc,.docx,.DOC,.DOCX'
    }
  },
  computed: {
    routeId() {
      return this.$route.params.id
    }
  },
  created() {
    this.getfilePage()
    this.getContractInfo({ id: this.routeId })
  },
  methods: {
    viewAllAdd() {
      this.PopDialogHandle(this.enclosurePopOptions, '上传合同')
      this.$set(this.enclosurePopOptions.content[0].data, 'bizId', this.routeId)
    }
  }
}
</script>

<style lang='scss' scoped>
.contacts-view-all-page {
    padding:20px;

    .contactsHeader {
        height: 60px;
        border-bottom: 1px solid #E9EFF2;
        background-color: #fff;
        display: flex;
        align-items: center;
    }

    .contactsText {
      font-size: 18px;
      font-weight: 400;
      flex:1;
      margin-left: 20px;
    }

    .details-button {
        display: flex;
        margin-right: 20px;
    }
}
</style>
