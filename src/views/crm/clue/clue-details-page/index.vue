<template>
  <div class="clue-details-page">
    <div class="clueHeader">
      <span class="clueText">线索</span>
      <div class="details-button">
        <el-button v-if="clueStaus !== 'T'" size="mini" @click="detailEdit">编辑</el-button>
        <el-button size="mini" type="danger" plain @click="detailDelete">删除</el-button>
        <el-button size="mini" @click="changeOwnerClick">更改所有人</el-button>
        <el-button v-if="clueStaus !== 'C' && clueStaus !== 'T'" size="mini" @click="transform">转化</el-button>
        <!-- <changeOwner :ok-click="okClick" :visible="visible" @visibleClick="visiblePopOption" /> -->
        <!-- <el-button @click="$router.back()">返回</el-button> -->
      </div>
    </div>
    <!-- 状态控制 -->
    <div style="margin: 30px 0 0 0;">
      <div v-if="clueStaus !== 'C'" class="clueStatusLine">
        <div class="status" :class="{actived:onGoingStatus > -1}" @click="onGoingStatusChange('U')">未跟进</div>
        <div class="dottedLine" />
        <div class="status" :class="{actived:onGoingStatus > 0}" @click="onGoingStatusChange('F')">跟进中</div>
        <div class="dottedLine" />
        <div class="status" :class="{actived:onGoingStatus > 1}" @click="onGoingStatusChange('T')">已转化</div>
        <div v-if="clueStaus !== 'T'" class="dottedLine" />
        <i v-if="clueStaus !== 'T'" class="el-icon-circle-close close" />
        <div v-if="clueStaus !== 'T'" class="closeTxt" @click="closedStateChange">关闭进度</div>
      </div>
      <div v-else class="closeStatus">
        <div class="closeDottedLine" />
        <div class="clueClosed">线索已关闭</div>
        <div class="closeDottedLine" />
      </div>
    </div>
    <!-- <div v-if="clueStaus" style="display: flex; justify-content: space-between;">
      <el-steps v-if="clueStaus !== 'C'" :active="onGoingStatus" process-status="success" finish-status="success" align-center simple style="margin: 0px 10px 20px 0; width: 80%; font-size: 14px;">
        <template v-for="(item, index) in clueStatus">
          <el-step :key="index" style="cursor: pointer;" :title="item.label" @click.native="onGoingStatusChange(item)" />
        </template>
      </el-steps>
      <el-steps :active="closedState" process-status="success" finish-status="success" align-center simple style="margin: 0px 0 20px 0;flex: 1;">
        <el-step class="closedState" :title="'关闭'" @click.native="closedStateChange" />
      </el-steps>
    </div> -->
    <!-- 搜索表单 -->
    <div class="detailSearch">
      <cs-custom-form ref="searchForm" :data-source="searchData" :options="formOtions" :form-datas="clueFormDatas" />
    </div>
    <!-- 导入pop弹出层 -->
    <div class="pop">
      <cs-custom-pop :options="cluePopOptions" />
    </div>
    <!-- 导入更改所有人pop弹出层 -->
    <div class="pop">
      <cs-custom-pop :options="OwnerPopOptions" />
    </div>
    <!-- 转化pop弹出层 -->
    <div class="pop">
      <cs-custom-pop :options="transformPopOptions" />
    </div>
  </div>
</template>

<script>
// import changeOwner from '@/views/crm/public/components/change-owner.vue'
// import relevantTable from '@/views/crm/public/components/relevant-table.vue'
import { Clue } from '../components/index'
import { ClueRelevant } from '../components/relevantIndex.js'
import { PublicCrm } from '@/views/crm/public/index'
// import lineJump from '@/views/crm/public/components/line-jump.vue'
// import uploadSlotTrigger from '../components/upload-slot-trigger.vue'
// import uploadSlotTip from '../components/upload-slot-tip.vue'

export default {
  components: {
    // changeOwner,
    // relevantTable
  },
  mixins: [Clue, PublicCrm, ClueRelevant],
  data() {
    // 公用验证正则
    const commonChangeReg = this.$getRules({})
    // 公用验证正则
    const commonBlurReg = this.$getRules({ trigger: ['blur'] })
    // 手机验证正则
    const phoneReg = this.$getRules({ type: 'phone', trigger: ['blur'] })
    // 数字验证
    const numberReg = this.$getRules({ type: 'number', trigger: ['blur'] })
    // 邮箱验证正则
    const emailReg = this.$getRules({ type: 'email', trigger: ['blur'] })
    // const emailReg2 = this.$getRules({ type: 'email2', trigger: ['blur'] })
    // 金额数字正则
    const moneyReg = this.$getRules({ type: 'number', pattern: /^(([1-9]{1}\d{0,8})|(0{1}))(\.\d{1,2})?$/, message: '请输入最多9位整数或保留1到2位小数', trigger: ['blur'] })

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
    const popStyle = {
      'font-size': '14px',
      'color': '#333',
      'width': '100%',
      'background-color': '#eee',
      'padding': '10px',
      'border-radius': '2px',
      'margin-bottom': '15px'
    }
    const unrepeatStyle = {
      'width': '100%',
      'font-size': '12px',
      'color': '#009900',
      'background-color': '#eee',
      'textAlign': 'center',
      'padding': '5px',
      'margin-bottom': '15px'
    }
    // 远程用户搜索(更改所有人)
    // const remoteUserSearch2 = value => {
    //   // debugger
    //   // console.log(value)
    //   if (value === '') {
    //     this.$set(this.enclosureOwnerPopOptions.content[0], 'dataSource', [])
    //   } else {
    //     if (!this.getData4) {
    //       this.getData4 = this.$utils.debounce(this.remoteUserList, 300)
    //     }
    //     this.getData4({ realName: value }, 0, this.enclosureOwnerPopOptions)
    //   }
    // }

    // pop弹出框配置信息
    const cluePopOptions = {
      itemType: 'dialog',
      visible: false,
      title: '修改',
      width: '720px',
      // okText: '保存',
      customClass: 'popOptionsClass',
      ok: params => {
        console.log('确认', params)
        delete params.follower
        this.editClue(params, true)
      },
      cancel: params => {
        this.closePopDialogHandle(this.cluePopOptions)
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
          prop: 'contactName',
          itemType: 'input',
          itemStyle: { 'width': '47%', 'marginRight': '0px' },
          maxlength: 10,
          label: '姓名',
          rules: [commonBlurReg],
          placeholder: '请输入姓名'
        },
        {
          prop: 'gender',
          itemType: 'select',
          labelWidth: '97px',
          itemStyle: { 'width': '53%', 'marginRight': '0px' },
          label: '性别',
          rules: [commonChangeReg],
          dataSource: [
            {
              label: '男',
              value: 'M'
            },
            {
              label: '女',
              value: 'W'
            }
          ]
        },
        {
          prop: 'companyName',
          itemType: 'input',
          itemStyle: { 'width': '47%', 'marginRight': '0px' },
          maxlength: 50,
          label: '公司名称',
          rules: [commonBlurReg],
          placeholder: '请输入公司名称'
        },
        {
          prop: 'clueStaus',
          itemType: 'select',
          labelWidth: '97px',
          itemStyle: { 'width': '53%', 'marginRight': '0px' },
          label: '线索状态',
          rules: [commonChangeReg],
          dataSource: [
            {
              label: '未跟进',
              value: 'U'
            },
            {
              label: '跟进中',
              value: 'F'
            },
            {
              label: '关闭',
              value: 'C'
            }
          ]
        },
        {
          prop: 'mobile',
          itemType: 'input',
          itemStyle: { 'width': '47%', 'marginRight': '0px' },
          label: '手机',
          rules: [commonBlurReg, phoneReg],
          placeholder: '请输入手机号'
        },
        {
          prop: 'clueFrom',
          itemType: 'select',
          labelWidth: '97px',
          itemStyle: { 'width': '53%', 'marginRight': '0px' },
          label: '线索来源',
          // rules: [commonChangeReg],
          dataSource: []
        },
        {
          itemType: 'input',
          prop: 'department',
          itemStyle: { 'width': '47%', 'marginRight': '0px' },
          label: '部门',
          maxlength: 10,
          // rules: [commonChangeReg],
          placeholder: '请输入部门'
        },
        {
          prop: 'phone',
          itemType: 'input',
          labelWidth: '97px',
          itemStyle: { 'width': '53%', 'marginRight': '0px' },
          label: '座机',
          maxlength: 12,
          rules: [numberReg],
          placeholder: '请输入座机号'
        },
        {
          prop: 'email',
          itemType: 'input',
          itemStyle: { 'width': '47%', 'marginRight': '0px' },
          maxlength: 50,
          label: '邮箱',
          rules: [emailReg],
          placeholder: '请输入邮箱'
        },
        {
          prop: 'position',
          itemType: 'input',
          labelWidth: '97px',
          itemStyle: { 'width': '53%', 'marginRight': '0px' },
          maxlength: 20,
          label: '职位',
          // rules: [emailReg, emailReg2],
          placeholder: '请输入职位'
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
        prop: 'contactName',
        itemType: 'input',
        itemStyle: { 'width': '50%', 'marginRight': 0 },
        label: '姓名:',
        readonly: true
      },
      {
        prop: 'gender',
        itemType: 'input',
        itemStyle: { 'width': '50%', 'marginRight': 0 },
        label: '性别:',
        readonly: true
      },
      {
        prop: 'companyName',
        itemType: 'input',
        itemStyle: { 'width': '50%', 'marginRight': 0 },
        label: '公司名称:',
        // disabled: true
        readonly: true
      },
      {
        prop: 'clueStaus',
        itemType: 'input',
        itemStyle: { 'width': '50%', 'marginRight': 0 },
        label: '线索状态:',
        // disabled: true
        readonly: true
      },
      {
        prop: 'mobile',
        itemType: 'input',
        itemStyle: { 'width': '50%', 'marginRight': 0 },
        label: '手机:',
        // disabled: true
        readonly: true
      },
      {
        prop: 'position',
        itemType: 'input',
        itemStyle: { 'width': '50%', 'marginRight': 0 },
        label: '职位:',
        // disabled: true
        readonly: true
      },
      {
        prop: 'department',
        itemType: 'input',
        itemStyle: { 'width': '50%', 'marginRight': 0 },
        label: '部门:',
        // disabled: true
        readonly: true
      },
      {
        prop: 'phone',
        itemType: 'input',
        itemStyle: { 'width': '50%', 'marginRight': 0 },
        label: '座机:',
        // disabled: true
        readonly: true
      },
      {
        prop: 'email',
        itemType: 'input',
        itemStyle: { 'width': '50%', 'marginRight': 0 },
        label: '邮箱:',
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
          placeholder: '请查找用户'
        }
      ]
    }

    // 转化pop弹出框配置信息
    const transformPopOptions = {
      itemType: 'dialog',
      visible: false,
      title: '线索转化',
      width: '720px',
      // close: () => { this.$emit('visibleClick', false) },
      //   width: '720px',
      // okText: '保存',
      customClass: 'popOptionsClass',
      ok: params => {
        console.log('转化', params)
        // const follower = params.follower
        const customer = {
          name: params.companyName,
          level: params.level,
          customerTypeId: params.customerTypeId
        }
        const contactPerson = {
          name: params.contactName,
          gender: params.gender,
          mobile: params.mobile,
          email: params.email,
          position: params.position,
          department: params.department,
          phone: params.phone,
          remark: params.remark
        }
        const businessOpportunity = {
          name: params.name,
          salesAmount: (params.salesAmount * 10000).toFixed(),
          endDate: params.endDate,
          businessStage: params.businessStage
        }
        this.transformationClue({ cluesId: this.routeId, customer, contactPerson, businessOpportunity })
      },
      cancel: params => {
        this.$set(this.transformPopOptions, 'visible', false)
      },
      formDatas: {
      },
      formOptions: {
        inline: true
        // labelWidth: '111px'
      },
      content: [
        {
          itemType: 'view',
          text: '',
          style: unrepeatStyle
        },
        {
          itemType: 'view',
          text: '客户信息',
          style: popStyle
        },
        {
          prop: 'companyName',
          itemType: 'input',
          itemStyle: { 'width': '47%', 'marginRight': '0px' },
          label: '客户名称',
          readonly: true
        },
        {
          prop: 'level',
          itemType: 'select',
          labelWidth: '97px',
          itemStyle: { 'width': '53%', 'marginRight': '0px' },
          label: '客户级别',
          rules: [commonChangeReg],
          dataSource: []
        },
        {
          prop: 'customerTypeId',
          itemType: 'select',
          itemStyle: { 'width': '47%', 'marginRight': '0px' },
          label: '客户类型',
          rules: [commonChangeReg],
          dataSource: []
        },
        {
          itemType: 'view',
          text: '联系人信息',
          style: popStyle
        },
        {
          prop: 'contactName',
          itemType: 'input',
          itemStyle: { 'width': '47%', 'marginRight': '0px' },
          label: '姓名',
          readonly: true
        },
        {
          itemType: 'view',
          text: '商机信息',
          style: popStyle
        },
        {
          prop: 'name',
          itemType: 'input',
          itemStyle: { 'width': '47%', 'marginRight': '0px' },
          maxlength: 50,
          rules: [commonBlurReg],
          label: '商机名称',
          placeholder: '请输入商机名称'
        },
        {
          prop: 'salesAmount',
          itemType: 'input',
          labelWidth: '97px',
          itemStyle: { 'width': '53%', 'marginRight': '0px' },
          maxlength: 12,
          rules: [commonBlurReg, moneyReg],
          label: '销售金额',
          placeholder: '请输入销售金额'
        },
        {
          prop: 'endDate',
          itemType: 'date',
          itemStyle: { 'width': '47%', 'marginRight': '0px' },
          rules: [commonChangeReg],
          label: '结束日期',
          placeholder: '请选择结束日期'
        },
        {
          prop: 'businessStage',
          itemType: 'select',
          labelWidth: '97px',
          itemStyle: { 'width': '53%', 'marginRight': '0px' },
          label: '商机阶段',
          change: this.stageChange,
          rules: [commonChangeReg],
          dataSource: []
        },
        {
          prop: 'probability',
          itemType: 'input',
          itemStyle: { 'width': '47%', 'marginRight': '0px' },
          rules: [commonBlurReg],
          label: '赢单概率',
          disabled: true
          // readonly: true
        }
      ]
    }
    return {
      formOtions: {
        inline: true
      },
      cluePopOptions,
      OwnerPopOptions,
      transformPopOptions,
      searchData,
      clueFormDatas: {},
      activeName: 'detailed',
      visible: false,
      // fileTotal: 0,
      follower: null,
      businessOpportunityStage: [],
      clueStatus: [
        { value: 'U', label: '未跟进' },
        { value: 'F', label: '跟进中' },
        { value: 'T', label: '已转化' }
      ],
      closedState: -1,
      onGoingStatus: -1,
      clueStaus: ''
    }
  },
  computed: {
    routeId() {
      return this.$route.params.id
    }
  },
  watch: {
    // fileTotal() {
    //   this.$set(this.relevantEnclosureOptions, 'tip', this.fileTotal || 0)
    // }
  },
  created() {
    this.getClueSourceOptions()
    this.getCustomerLeveList()
    this.getCustomerTypeList()
    this.getBusinessOpportunityStage()
    this.routeId && this.getClueInfoDisplay({ id: this.routeId })
    // this.getfilePage()
  },
  methods: {
    // 编辑
    detailEdit() {
      this.PopDialogHandle(this.cluePopOptions, '编辑线索')
      this.getClueInfo({ id: this.routeId })
    },

    // 删除
    detailDelete() {
      this.$confirm(' 你确认要删除该线索吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      })
        .then(() => {
          this.deleteClue({ id: this.routeId }, true)
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },

    // 转化
    transform() {
      console.log(this.clueFormDatas)
      this.customerRepeat({ name: this.clueFormDatas.companyName })
      this.PopDialogHandle(this.transformPopOptions, '转化线索')
      this.getTransformClueInfo({ id: this.routeId })
    },

    handleClick(tab, event) {
      console.log(tab, event)
    },

    // 进行状态点击事件
    onGoingStatusChange(value) {
      console.log(value)
      if (this.clueStaus !== 'T') {
        if (value === 'T') {
          this.$message.warning('请点击右上角转化按钮')
        } else if (this.clueStaus !== value) {
          this.clueStausModify({ clueStaus: value })
        }
      }
    },

    // 点击关闭状态
    closedStateChange() {
      this.$confirm('此操作将关闭线索进度, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        if (this.clueStaus !== 'C') {
          this.clueStausModify({ clueStaus: 'C' })
        }
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消'
        })
      })
    }

    // visiblePopOption(data) {
    //   this.vis
    // }
  }
}
</script>

<style lang='scss' scoped>
.clue-details-page {
    margin:20px;
    background-color: #fff;

    .clueHeader {
        height: 60px;
        border-bottom: 1px solid #E9EFF2;
        display: flex;
        align-items: center;
        margin-bottom: 20px;
    }

    .clueText {
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
.clue-details-page {
  .detailSearch {
    // padding: 10px;
    padding: 0 40px 20px;

    .el-input__inner,.el-textarea__inner {
      border: 0;
      // border-bottom: 1px;
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

  .closedState {
    font-size: 14px;
    cursor: pointer;
    display: flex;
    justify-content: center;
    .el-step__main {
      flex-grow: inherit;
    }
  }
  .el-step__main {
    .el-step__title {
      font-size: 14px;
    }
  }

  // 状态样式
  .clueStatusLine {
    display: flex;
    align-items: center;
    justify-content: center;
    .dottedLine {
      height: 1px;
      width: 191px;
      border-bottom: 1px dotted  #D3D3D3;
    }
    .status {
      width: 62px;
      line-height: 62px;
      height: 62px;
      font-size: 14px;
      color: #BDBDBD;
      border-radius: 50%;
      cursor: pointer;
      background: #ECECEC;
      text-align: center;
    }
    .status.actived {
      background: #3ED7D9;
      color: #fff;
    }
    .close {
      color: #A5AEB7;
      font-size: 16px;
      margin: 0 12px 0 15px;
    }
    .closeTxt {
      cursor: pointer;
      font-size: 14px;
      color: #44494C;
    }
  }
  .closeStatus {
    display: flex;
    align-items: center;
    justify-content: center;
    .closeDottedLine {
      height: 1px;
      width: 380px;
      border-bottom: 1px dotted #B9B9B9;
    }
    .clueClosed {
      font-size: 14px;
      color: #BBC2D0;
      margin: 0 15px;
    }
  }
}
</style>

