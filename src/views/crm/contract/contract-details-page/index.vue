<template>
  <div class="contract-details-page">
    <div class="contractHeader">
      <span class="contractText">合同</span>
      <div class="details-button">
        <el-button size="mini" @click="detailEdit">编辑</el-button>
        <el-button size="mini" type="danger" plain @click="detailDelete">删除</el-button>
        <el-button size="mini" @click="changeOwnerClick">更改所有人</el-button>
        <!-- <changeOwner :ok-click="okClick" :visible="visible" @visibleClick="visiblePopOption" /> -->
        <!-- <el-button @click="$router.back()">返回</el-button> -->
      </div>
    </div>
    <el-tabs v-model="activeName" class="commonTabs" @tab-click="handleClick">
      <el-tab-pane label="详细信息" name="detailed">
        <!-- 搜索表单 -->
        <div class="detailSearch">
          <cs-custom-form ref="searchForm" :data-source="searchData" :options="formOtions" :form-datas="contractFormDatas" />
        </div>
      </el-tab-pane>
      <el-tab-pane label="相关" name="relevant"><relevantTable :relevant-options="relevantEnclosureOptions" /></el-tab-pane>
    </el-tabs>
    <!-- 导入pop弹出层 -->
    <div class="pop">
      <cs-custom-pop :options="contractPopOptions" />
    </div>
    <!-- 导入更改所有人pop弹出层 -->
    <div class="pop">
      <cs-custom-pop :options="OwnerPopOptions" />
    </div>
    <!-- 导入附件更改所有人pop弹出层 -->
    <div class="pop">
      <cs-custom-pop :options="enclosureOwnerPopOptions" />
    </div>
  </div>
</template>

<script>
// import changeOwner from '@/views/crm/public/components/change-owner.vue'
import relevantTable from '@/views/crm/public/components/relevant-table.vue'
import { Contract } from '../components/index'
import { ContractRelevant } from '../components/relevantIndex.js'
import { PublicCrm } from '@/views/crm/public/index'
import lineJump from '@/views/crm/public/components/line-jump.vue'
import uploadSlotTrigger from '../components/upload-slot-trigger.vue'
import uploadSlotTip from '../components/upload-slot-tip.vue'

export default {
  components: {
    // changeOwner,
    relevantTable
  },
  mixins: [Contract, PublicCrm, ContractRelevant],
  data() {
    // 公用验证正则
    const commonChangeReg = this.$getRules({})
    // 公用验证正则
    const commonBlurReg = this.$getRules({ trigger: ['blur'] })
    // 金额数字正则
    const moneyReg = this.$getRules({ type: 'number', pattern: /^(([1-9]{1}\d{0,8})|(0{1}))(\.\d{1,2})?$/, message: '请输入最多9位整数或保留1到2位小数', trigger: ['blur'] })
    // 手机验证正则
    // const phoneReg = this.$getRules({ type: 'phone', trigger: ['blur'] })
    // 邮箱验证正则
    // const emailReg = this.$getRules({ type: 'email', trigger: ['blur'] })
    // const emailReg2 = this.$getRules({ type: 'email2', trigger: ['blur'] })
    // 公用组件样式
    const style = {
      'width': '100%',
      'font-size': '16px',
      'font-weight': '400',
      'letter-spacing': '2px',
      'color': '#333',
      'border-bottom': '1px #EEEFF0 solid',
      'margin-top': '20px',
      'padding-bottom': '10px',
      'margin-bottom': '10px'
    }
    // const fileData = {
    //   bizId: this.routeId,
    //   follower: this.follower,
    //   bizType: 'CONTRACT'
    // }
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
    // 客户搜索
    const customerSearch = value => {
      if (value === '') {
        this.$set(this.contractPopOptions.content[0], 'dataSource', [])
      } else {
        if (!this.getData1) {
          this.getData1 = this.$utils.debounce(this.remoteCustomerPage, 300)
        }
        this.getData1({ name: value, dataTag: 'ALL' }, 1, this.contractPopOptions)
      }
    }
    // 商机搜索
    // const businessSearch = value => {
    //   if (value === '') {
    //     this.$set(this.contractPopOptions.content[0], 'dataSource', [])
    //   } else {
    //     if (!this.getData2) {
    //       this.getData2 = this.$utils.debounce(this.remoteBusinessPage, 300)
    //     }
    //     this.getData2({ name: value, dataTag: 'ALL' }, 2, this.contractPopOptions)
    //   }
    // }
    // 用户搜索
    const userSearch = value => {
      if (value === '') {
        this.$set(this.contractPopOptions.content[9], 'dataSource', [])
      } else {
        if (!this.getData3) {
          this.getData3 = this.$utils.debounce(this.remoteUserList, 300)
        }
        this.getData3({ realName: value, name: value }, 9, this.contractPopOptions)
      }
    }

    // 合同附件上传弹出框
    const enclosurePopOptions = {
      itemType: 'dialog',
      visible: false,
      title: '修改',
      // width: '720px',
      // okText: '保存',
      // okHidden: true,
      cancelText: '关闭',
      // cancelHidden: true,
      customClass: 'popOptionsClass',
      ok: params => {
        console.log('确认', params)
        this.addOrEditContract(params)
      },
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
          rules: [commonChangeReg],
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
          onProgress: (event, file, fileList) => {
            console.log(event, file, fileList)
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
              this.$message.error('上传文件只能是 .xlsx,.xls,.XLSX,.XLS,.ppt,.pptx,.PPT,.PPTX,.pdf,.PDF,.doc,.docx,.DOC,.DOCX 格式!')
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

    // 合同附件格头部列表
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
        // style: scope => {
        //   return {
        //     color: '#1890ff',
        //     cursor: 'pointer'
        //   }
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
        minWidth: '80'
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
        showOverflowTooltip: true,
        minWidth: '70'
      }
    ]

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
          this.$confirm(' 你确认要删除该合同附件吗？', '提示', {
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
          // this.setFormDatas(this.enclosureOwnerPopOptions, params)
          // this.getContractInfo({ id: params.row.id })
        }
      }
    ]

    const enclosurePopOperates = {
      label: '操作',
      width: '200',
      dataSource: enclosureHandleConf
    }

    // relevantEnclosureOptions表格弹框配置信息
    const relevantEnclosureOptions = {
      relevantAddText: '上传',
      title: '附件',
      tip: 0,
      isTwo: true,
      isNotPointer: this.isNotPointer,
      viewAll: () => {
        this.$router.push(`/crm/contract/contract-view-all-page/${this.$route.params.id}`)
      },
      relevantAdd: () => {
        console.log(111)
        this.PopDialogHandle(this.enclosurePopOptions, '上传合同')
        this.$set(this.enclosurePopOptions.content[0].data, 'bizId', this.routeId)
        // this.$set(this.enclosurePopOptions.content[0].data, 'follower', this.follower)
      },
      dataSource: [],
      popOperates: enclosurePopOperates,
      columns: enclosureColumns,
      popOptions: enclosurePopOptions
    }

    // pop弹出框配置信息
    const contractPopOptions = {
      itemType: 'dialog',
      visible: false,
      title: '修改',
      width: '720px',
      // okText: '保存',
      customClass: 'popOptionsClass',
      ok: params => {
        console.log('确认', params)
        delete params.follower
        const ourSignatoryName = this.userList.length !== 0 ? this.userList.filter(item => item.userId === params.ourSignatory)[0].realName : params.ourSignatoryName
        const totalAmount = params.totalAmount && (params.totalAmount * 10000).toFixed()
        this.editContract({ ...params, ourSignatoryName, totalAmount }, true)
      },
      cancel: params => {
        this.closePopDialogHandle(this.contractPopOptions)
        // console.log(params)
      },
      formDatas: {
      },
      formOptions: {
        inline: true
        // labelWidth: '111px'
      },
      content: [
        {
          prop: 'name',
          itemType: 'input',
          itemStyle: { 'width': '47%', 'marginRight': '0px' },
          maxlength: 50,
          label: '合同名称',
          rules: [commonBlurReg],
          placeholder: '请输入合同名称'
        },
        {
          prop: 'customerId',
          itemType: 'select',
          filterable: true,
          className: 'commonRemoteSearch',
          remote: true,
          change: this.customerChange,
          remoteMethod: customerSearch,
          labelWidth: '121px',
          itemStyle: { 'width': '53%', 'marginRight': '0px' },
          label: '客户',
          rules: [commonChangeReg],
          dataSource: [],
          placeholder: '查找客户'
        },
        {
          prop: 'businessOpportunityId',
          itemType: 'select',
          // props: {
          //   label: 'name',
          //   value: 'id'
          // },
          // filterab le: true,
          // className: 'commonRemoteSearch',
          // remote: true,
          // remoteMethod: businessSearch,
          itemStyle: { 'width': '47%', 'marginRight': '0px' },
          label: '商机',
          rules: [commonChangeReg],
          dataSource: [],
          placeholder: '请先查找用户'
        },
        {
          itemType: 'date',
          prop: 'contractDate',
          labelWidth: '121px',
          itemStyle: { 'width': '53%', 'marginRight': '0px' },
          label: '签约日期',
          rules: [commonChangeReg],
          placeholder: '请选择日期'
        },
        {
          prop: 'status',
          itemType: 'select',
          itemStyle: { 'width': '47%', 'marginRight': '0px' },
          label: '合同状态',
          rules: [commonChangeReg],
          dataSource: [
            {
              value: 'E',
              label: '执行中'
            },
            {
              value: 'C',
              label: '结束'
            },
            {
              value: 'D',
              label: '意外终止'
            }
          ]
        },
        {
          prop: 'totalAmount',
          itemType: 'input',
          labelWidth: '121px',
          itemStyle: { 'width': '53%', 'marginRight': '0px' },
          maxlength: 12,
          label: '总金额',
          rules: [commonBlurReg, moneyReg],
          placeholder: '请输入总金额'
        },
        {
          itemType: 'date',
          prop: 'startTime',
          label: '开始日期',
          change: (value, form, formDatas, setFormDatas) => {
            if (formDatas.endTime) {
              if (new Date(value) > new Date(formDatas.endTime)) {
                this.$message.warning('开始日期不能晚于结束日期')
                setFormDatas({ startTime: '' })
              }
            }
          },
          itemStyle: { 'width': '47%', 'marginRight': '0px' },
          rules: [commonChangeReg],
          placeholder: '请选择日期'
        },
        {
          itemType: 'date',
          prop: 'endTime',
          label: '结束日期',
          change: (value, form, formDatas, setFormDatas) => {
            if (formDatas.startTime) {
              if (new Date(value) < new Date(formDatas.startTime)) {
                this.$message.warning('结束日期不能早于开始日期')
                setFormDatas({ endTime: '' })
              }
            }
          },
          labelWidth: '121px',
          itemStyle: { 'width': '53%', 'marginRight': '0px' },
          rules: [commonChangeReg],
          placeholder: '请选择日期'
        },
        {
          prop: 'customerSignatory',
          itemType: 'input',
          itemStyle: { 'width': '47%', 'marginRight': '0px' },
          maxlength: 10,
          label: '客户签约人',
          rules: [commonBlurReg],
          placeholder: '请输入客户签约人'
        },
        {
          prop: 'ourSignatory',
          itemType: 'select',
          filterable: true,
          className: 'commonRemoteSearch',
          remote: true,
          remoteMethod: userSearch,
          labelWidth: '121px',
          itemStyle: { 'width': '53%', 'marginRight': '0px' },
          label: '我方签约人',
          rules: [commonChangeReg],
          dataSource: [],
          placeholder: '查找系统用户'
        },
        {
          prop: 'payType',
          itemType: 'select',
          itemStyle: { 'width': '47%', 'marginRight': '0px' },
          label: '支付方式',
          rules: [commonChangeReg],
          dataSource: [
            {
              value: 'B',
              label: '银行转账'
            },
            {
              value: 'C',
              label: '支票'
            },
            {
              value: 'M',
              label: '现金'
            },
            {
              value: 'O',
              label: '其他'
            }
          ]
        },
        {
          prop: 'remark',
          itemType: 'input',
          itemStyle: { 'width': '100%', 'marginRight': 0 },
          maxlength: 1000,
          type: 'textarea',
          autosize: { minRows: 2, maxRows: 4 },
          label: '备注',
          // rules: [commonBlurReg, nameReg],
          placeholder: '请输入备注'
        }
      ]
    }

    const searchData = [
      {
        itemType: 'view',
        itemStyle: { 'width': '50%', 'marginRight': 0 },
        text: '基本信息',
        style
      },
      {
        prop: 'name',
        itemType: 'input',
        itemStyle: { 'width': '50%', 'marginRight': 0 },
        label: '合同名称:',
        readonly: true
      },
      {
        components: {
          lineJump
        },
        componentsOptions: {
          prop: 'customerName',
          label: '客户:',
          // text: '深圳市卓色文化艺术有限公司',
          url: `/crm/customer/customer-details-page/${this.$route.params.id}`
        }
      },
      {
        components: {
          lineJump
        },
        componentsOptions: {
          prop: 'businessOpportunityName',
          label: '商机:',
          // text: '深圳市卓色文化艺术有限公司',
          url: `/crm/customer/customer-details-page/${this.$route.params.id}`
        }
      },
      {
        prop: 'contractDate',
        itemType: 'input',
        itemStyle: { 'width': '50%', 'marginRight': 0 },
        label: '签约日期:',
        // disabled: true
        readonly: true
      },
      {
        prop: 'statusName',
        itemType: 'input',
        itemStyle: { 'width': '50%', 'marginRight': 0 },
        label: '合同状态:',
        // disabled: true
        readonly: true
      },
      {
        prop: 'totalAmount',
        itemType: 'input',
        itemStyle: { 'width': '50%', 'marginRight': 0 },
        label: '总金额:',
        // disabled: true
        readonly: true
      },
      {
        prop: 'startTime',
        itemType: 'input',
        itemStyle: { 'width': '50%', 'marginRight': 0 },
        label: '开始日期:',
        // disabled: true
        readonly: true
      },
      {
        prop: 'payTypeName',
        itemType: 'input',
        itemStyle: { 'width': '50%', 'marginRight': 0 },
        label: '付款方式:',
        // disabled: true
        readonly: true
      },
      {
        prop: 'customerSignatory',
        itemType: 'input',
        itemStyle: { 'width': '50%', 'marginRight': 0 },
        label: '客户方签约人:',
        // disabled: true
        readonly: true
      },
      {
        prop: 'endTime',
        itemType: 'input',
        itemStyle: { 'width': '50%', 'marginRight': 0 },
        label: '结束日期:',
        readonly: true
      },
      {
        prop: 'ourSignatoryName',
        itemType: 'input',
        itemStyle: { 'width': '50%', 'marginRight': 0 },
        label: '我方签约人:',
        readonly: true
      },
      {
        prop: 'remark',
        itemType: 'input',
        type: 'textarea',
        autosize: true,
        itemStyle: { 'width': '100%', 'marginRight': 0 },
        label: '备注:',
        readonly: true
      },
      {
        itemType: 'view',
        text: '系统信息',
        style
      },
      {
        prop: 'follower',
        itemType: 'input',
        itemStyle: { 'width': '50%', 'marginRight': 0 },
        label: '所有人:',
        readonly: true
      },
      {
        prop: 'createdBy',
        itemType: 'input',
        itemStyle: { 'width': '50%', 'marginRight': 0 },
        label: '创建人:',
        readonly: true
      },
      {
        prop: 'createdTime',
        itemType: 'input',
        itemStyle: { 'width': '50%', 'marginRight': 0 },
        label: '创建日期:',
        readonly: true,
        trim: value => {
          console.log(value)
        }
        // formater: scope => {
        //   return scope.row[scope.column.property] ? this.$filters.parseTime(scope.row[scope.column.property] + '', '{y}-{m}-{d} {h}:{i}:{s}') : ''
        // }
      },
      {
        prop: 'updatedBy',
        itemType: 'input',
        itemStyle: { 'width': '50%', 'marginRight': 0 },
        label: '上次修改人:',
        readonly: true
      },
      {
        prop: 'updatedTime',
        itemType: 'input',
        itemStyle: { 'width': '50%', 'marginRight': 0 },
        label: '上次修改日期:',
        readonly: true
        // formater: scope => {
        //   return scope.row[scope.column.property] ? this.$filters.parseTime(scope.row[scope.column.property] + '', '{y}-{m}-{d} {h}:{i}:{s}') : ''
        // }
      }
    ]
    // 更改所有人pop弹出框配置信息
    const OwnerPopOptions = {
      itemType: 'dialog',
      visible: false,
      title: '更改所有人',
      // close: () => { this.$emit('visibleClick', false) },
      //   width: '720px',
      // okText: '保存',
      customClass: 'popOptionsClass',
      ok: this.okClick,
      cancel: params => {
        // this.PopDialogHandle()
        // this.$emit('visibleClick', false)
        this.$set(this.OwnerPopOptions, 'visible', false)
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
          remoteMethod: this.remoteUserSearch,
          loading: false,
          rules: [commonBlurReg],
          // itemStyle: { 'width': '50%', 'marginRight': 0 },
          label: '用户',
          dataSource: [],
          placeholder: '查找用户'
        }
      ]
    }
    // 更改所有人pop弹出框配置信息
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
    return {
      formOtions: {
        inline: true
      },
      relevantEnclosureOptions,
      enclosurePopOptions,
      contractPopOptions,
      OwnerPopOptions,
      enclosureOwnerPopOptions,
      searchData,
      contractFormDatas: {},
      accept: '.xlsx,.xls,.XLSX,.XLS,.ppt,.pptx,.PPT,.PPTX,.pdf,.PDF,.doc,.docx,.DOC,.DOCX',
      activeName: 'detailed',
      visible: false,
      fileTotal: 0,
      follower: null,
      userList: []
    }
  },
  computed: {
    routeId() {
      return this.$route.params.id
    },
    customerId() {
      return this.contractFormDatas.customerId
    },
    businessOpportunityId() {
      return this.contractFormDatas.businessOpportunityId
    }
  },
  watch: {
    fileTotal() {
      this.$set(this.relevantEnclosureOptions, 'tip', this.fileTotal || 0)
    },
    customerId(newVal, oldNew) {
      this.$set(this.searchData[2].componentsOptions, 'url', `/crm/customer/customer-details-page/${newVal}`)
    },
    businessOpportunityId(newVal, oldNew) {
      this.$set(this.searchData[3].componentsOptions, 'url', `/crm/business-opportunity/business-opportunity-details-page/${newVal}`)
    }
  },
  created() {
    this.routeId && this.getContractInfoDisplay({ id: this.routeId })
    this.getfilePage()
  },
  methods: {
    // 编辑
    detailEdit() {
      this.PopDialogHandle(this.contractPopOptions, '编辑合同')
      this.getContractInfo({ id: this.routeId })
    },

    // 删除
    detailDelete() {
      this.$confirm(' 你确认要删除该合同吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      })
        .then(() => {
          this.deleteContract({ id: this.routeId }, true)
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },

    handleClick(tab, event) {
      console.log(tab, event)
    }

    // visiblePopOption(data) {
    //   this.vis
    // }
  }
}
</script>

<style lang='scss' scoped>
.contract-details-page {
    margin:20px;
    background-color: #fff;

    .contractHeader {
        height: 60px;
        border-bottom: 1px solid #E9EFF2;
        display: flex;
        align-items: center;
        margin-bottom: 20px;
    }

    .contractText {
      font-size: 18px;
      font-weight: 400;
      color: '#151222';
      flex:1;
      margin-left: 20px;
    }

    .details-button {
        display: flex;
        margin-right: 20px;
    }
}
</style>

<style lang="scss">
.contract-details-page {
  .el-tabs__content {
    padding-bottom: 20px;
  }
  .detailSearch {
    // margin-bottom: 20px;

    .el-input__inner,.el-textarea__inner {
      border: 0;
    }

    .el-form-item__label {
      color: #888E9E
    }

    .el-form-item {
      margin-bottom: 0px;
    }

    .el-input__inner {
      padding: 0 8px;
    }
  }
  .el-textarea__inner { //el_input中的隐藏属性
    resize: none;  //主要是这个样式
  }

  .commonTabs {
    padding: 0 40px;
    .el-tabs__item {
      line-height: 20px;
      font-size: 14px;
    }
    .el-tabs__nav-wrap::after {
      height: 1px;
    }
    .el-tabs__header {
      margin-bottom: 0;
    }
  }
}
</style>

