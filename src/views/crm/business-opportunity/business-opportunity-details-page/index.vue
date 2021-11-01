<template>
  <div class="business-opportunity-details-page">
    <div class="businessOpportunityHeader">
      <span class="businessOpportunityText">商机</span>
      <div class="details-button">
        <el-button v-if="lostOrder !== 0" size="mini" @click="detailEdit">编辑</el-button>
        <el-button size="mini" type="danger" plain @click="detailDelete">删除</el-button>
        <el-button size="mini" @click="changeOwnerClick">更改所有人</el-button>
        <!-- <change-owner :ok-click="okClick" :visible="visible" @visibleClick="visiblePopOption" /> -->
        <!-- <el-button @click="$router.back()">返回</el-button> -->
      </div>
    </div>
    <div v-if="businessOpportunityStage.length" class="businessStage">
      <div v-if="lostOrder !== 0" class="businessRateStage">
        <div class="rateStage">
          <template v-for="(item, index) in businessOpportunityStage">
            <div v-if="item.rate !== '0'" :key="index" class="stage" :class="{actived:item.id < businessStage+2}" @click="stepChange(item)">{{ item.businessStage + item.rate + '%' }}<i v-if="item.id !== businessOpportunityStage.length - 1" class="el-icon-arrow-right rightIcon" :class="{actived:item.id < businessStage+2}" /></div>
          </template>
        </div>
        <div class="loseStage" @click="lostStepChange">输单</div>
      </div>
      <div v-else class="closeStatus">
        <div class="closeDottedLine" />
        <div class="clueClosed">输单</div>
        <div class="closeDottedLine" />
      </div>
    </div>
    <!-- <div style="display: flex; justify-content: space-between;">
      <el-steps v-if="lostOrder !== 0" :active="businessStage" process-status="success" finish-status="success" align-center simple style="margin: 0px 10px 20px 0; width: 80%; font-size: 14px;">
        <template v-for="(item, index) in businessOpportunityStage">
          <el-step v-if="item.rate !== '0'" :key="index" style="cursor: pointer;" :title="item.businessStage + item.rate + '%'" @click.native="stepChange(item)" />
        </template>
      </el-steps>
      <el-steps :active="lostOrder" process-status="success" finish-status="success" align-center simple style="margin: 0px 0 20px 0;flex: 1;">
        <el-step class="closedState" :title="businessOpportunityStage.length !==0 ? businessOpportunityStage.filter(item => item.rate === '0')[0].businessStage : ''" @click.native="lostStepChange" />
      </el-steps>
    </div> -->
    <el-tabs v-model="activeName" class="commonTabs" @tab-click="handleClick">
      <el-tab-pane label="详细信息" name="detailed">
        <!-- 搜索表单 -->
        <div class="detailSearch">
          <cs-custom-form ref="searchForm" :data-source="searchData" :options="formOtions" :form-datas="businessFormDatas" />
        </div>
      </el-tab-pane>
      <el-tab-pane label="相关" name="relevant">
        <relevantTable :relevant-options="relevantContactsOptions" />
        <relevantTable :relevant-options="relevantContractOptions" />
        <relevantTable :relevant-options="relevantCompetitorOptions" />
        <relevantTable :relevant-options="relevantAnalysisOptions" />
      </el-tab-pane>
    </el-tabs>
    <!-- 导入pop弹出层 -->
    <div class="pop">
      <cs-custom-pop :options="businessPopOptions" />
    </div>
    <!-- 导入更改所有人pop弹出层 -->
    <div class="pop">
      <cs-custom-pop :options="OwnerPopOptions" />
    </div>
  </div>
</template>

<script>
// import changeOwner from '@/views/crm/public/components/change-owner.vue'
import relevantTable from '@/views/crm/public/components/relevant-table.vue'
import { BusinessOpportunity } from '../components/index'
import { BusinessOpportunityRelevant } from '../components/relevantIndex.js'
import { RelevantContacts } from '../components/relevantContacts'
import { RelevantCompetitor } from '../components/relevantCompetitor'
import { ContractRelevant } from '../../contract/components/relevantIndex.js'
import { SampleAnalysisRelevant } from '../../customer-sample-analysis/components/relevantIndex.js'
import { PublicCrm } from '@/views/crm/public/index'
import lineJump from '@/views/crm/public/components/line-jump.vue'
import status from '@/views/crm/public/config/status.js'
export default {
  components: {
    // changeOwner,
    relevantTable
  },
  mixins: [BusinessOpportunity, PublicCrm, BusinessOpportunityRelevant, RelevantContacts, ContractRelevant, RelevantCompetitor, SampleAnalysisRelevant],
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
        this.$set(this.contractPopOptions.content[0], 'dataSource', [])
      } else {
        if (!this.getData3) {
          this.getData3 = this.$utils.debounce(this.remoteUserList, 300)
        }
        this.getData3({ realName: value, name: value }, 9, this.contractPopOptions)
      }
    }
    // 联系人搜索
    const remoteSearch = value => {
      console.log(value)
      if (value === '') {
        this.$set(this.contactsPopOptions.content[0], 'dataSource', [])
      } else {
        if (!this.getData) {
          this.getData = this.$utils.debounce(this.remoteContactsPage, 300)
        }
        this.getData({ name: value, dataTag: 'ALL' }, 0, this.contactsPopOptions)
      }
    }

    // 竞争对手搜索
    const competitorSearch = value => {
      console.log(value)
      if (value === '') {
        this.$set(this.competitorPopOptions.content[0], 'dataSource', [])
      } else {
        if (!this.getData4) {
          this.getData4 = this.$utils.debounce(this.remoteCompetitorPage, 300)
        }
        this.getData4({ name: value, dataTag: 'ALL' }, 0, this.competitorPopOptions)
      }
    }

    // 相关联系人操作栏
    const contactsPopOperates = {
      label: '操作',
      width: '100',
      dataSource: [
        {
          label: '编辑',
          // permitTag: ['userCenter:sysDataMaskingRule:modify'],
          isShow: true,
          handle: params => {
            this.type = 'edit'
            console.log('编辑', params)
            this.PopDialogHandle(this.contactsPopOptions, '编辑联系人角色')
            this.getOpinionInfo({ id: params.row.id })
          }
        },
        {
          label: '删除',
          // permitTag: ['userCenter:sysDataMaskingRule:modify'],
          isShow: true,
          style: { 'color': '#FE4949' },
          handle: params => {
            this.$confirm(' 你确认要删除该联系人角色吗？', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning',
              center: true
            })
              .then(() => {
                this.deleteOpinion({ id: params.row.id })
              })
              .catch(() => {
                this.$message({
                  type: 'info',
                  message: '已取消删除'
                })
              })
          }
        }
      ]
    }
    // 联系人表格头部列表
    const contactsColumns = [
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
        prop: 'contactName',
        label: '联系人',
        minWidth: '80',
        showOverflowTooltip: true,
        handle: scope => {
          console.log('scope', scope)
          this.$router.push(`/crm/contacts/contacts-details-page/${scope.row.contactId}`)
        },
        style: {
          color: '#1890ff',
          cursor: 'pointer'
        }
      },
      {
        prop: 'role',
        label: '角色',
        minWidth: '60',
        formater: scope => {
          return scope.row[scope.column.property] ? this.contactsPopOptions.content[1].dataSource.filter(item => item.value === scope.row[scope.column.property])[0].label : ''
        }
      },
      {
        prop: 'position',
        label: '立场',
        minWidth: '80',
        formater: scope => {
          return scope.row[scope.column.property] ? this.contactsPopOptions.content[2].dataSource.filter(item => item.value === scope.row[scope.column.property])[0].label : ''
        }
      },
      {
        prop: 'familiarity',
        label: '熟悉度',
        minWidth: '70',
        formater: scope => {
          return scope.row[scope.column.property] ? this.contactsPopOptions.content[3].dataSource.filter(item => item.value === scope.row[scope.column.property])[0].label : ''
        }
      },
      {
        prop: 'disposition',
        label: '性格特征',
        minWidth: '80',
        formater: scope => {
          return scope.row[scope.column.property] ? this.contactsPopOptions.content[4].dataSource.filter(item => item.value === scope.row[scope.column.property])[0].label : ''
        }
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
        minWidth: '70',
        showOverflowTooltip: true
      }
    ]
    // 联系人弹出框
    const contactsPopOptions = {
      itemType: 'dialog',
      visible: false,
      title: '修改',
      width: '720px',
      // okText: '保存',
      customClass: 'popOptionsClass',
      ok: params => {
        console.log('确认', params)
        // const contactId = params.contactName
        // delete params.contactName
        delete params.follower
        this.addOrEditOpinion({ ...params })
        // this.addOrEditBusinessOpportunity(params)
      },
      cancel: params => {
        this.closePopDialogHandle(this.contactsPopOptions)
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
          prop: 'contactId',
          itemType: 'select',
          itemStyle: { 'width': '47%', 'marginRight': '0px' },
          label: '联系人',
          filterable: true,
          className: 'commonRemoteSearch',
          remote: true,
          remoteMethod: remoteSearch,
          rules: [commonChangeReg],
          placeholder: '请查找联系人',
          dataSource: []
        },
        {
          prop: 'role',
          itemType: 'select',
          labelWidth: '97px',
          itemStyle: { 'width': '53%', 'marginRight': '0px' },
          label: '角色',
          rules: [commonChangeReg],
          dataSource: [
            {
              value: 'D',
              label: '决策者'
            },
            {
              value: 'J',
              label: '审批者'
            },
            {
              value: 'E',
              label: '评估者'
            },
            {
              value: 'U',
              label: '用户'
            },
            {
              value: 'R',
              label: '权利支持者'
            }
          ]
        },
        {
          prop: 'position',
          itemType: 'select',
          itemStyle: { 'width': '47%', 'marginRight': '0px' },
          label: '立场',
          // rules: [commonChangeReg],
          dataSource: [
            {
              value: 'S',
              label: '支持'
            },
            {
              value: 'Z',
              label: '中立'
            },
            {
              value: 'O',
              label: '反对'
            },
            {
              value: 'U',
              label: '未知'
            }
          ]
        },
        {
          prop: 'familiarity',
          itemType: 'select',
          labelWidth: '97px',
          itemStyle: { 'width': '53%', 'marginRight': '0px' },
          label: '熟悉度',
          // rules: [commonChangeReg],
          dataSource: [
            {
              value: 'U',
              label: '无联系'
            },
            {
              value: 'S',
              label: '简短联系'
            },
            {
              value: 'M',
              label: '多次接触'
            },
            {
              value: 'D',
              label: '深度接触'
            }
          ]
        },
        {
          prop: 'disposition',
          itemType: 'select',
          itemStyle: { 'width': '47%', 'marginRight': '0px' },
          label: '性格特征',
          // rules: [commonChangeReg],
          dataSource: [
            {
              value: 'F',
              label: '远见'
            },
            {
              value: 'I',
              label: '创新'
            },
            {
              value: 'P',
              label: '务实'
            },
            {
              value: 'C',
              label: '保守'
            },
            {
              value: 'B',
              label: '落后'
            },
            {
              value: 'U',
              label: '未知'
            }
          ]
        }
      ]
    }
    // relevantContactsOptions表格弹框配置信息
    const relevantContactsOptions = {
      relevantAddText: '新建',
      title: '联系人角色',
      tip: 0,
      isTwo: true,
      viewAll: () => {
        this.$router.push(`/crm/business-opportunity/business-opportunity-contacts-index-page/${this.$route.params.id}`)
      },
      relevantAdd: () => {
        this.type = 'add'
        this.PopDialogHandle(this.contactsPopOptions, '新建联系人角色')
      },
      dataSource: [],
      popOperates: contactsPopOperates,
      columns: contactsColumns,
      popOptions: contactsPopOptions
    }

    // 合同pop弹出框配置信息
    const contractPopOptions = {
      itemType: 'dialog',
      visible: false,
      title: '修改',
      width: '720px',
      // okText: '保存',
      customClass: 'popOptionsClass',
      ok: params => {
        console.log('确认', params)
        // const businessOpportunityId = params.businessOpportunityName
        // const customerId = params.customerName
        delete params.follower
        const ourSignatoryName = this.userList.length !== 0 ? this.userList.filter(item => item.userId === params.ourSignatory)[0].realName : params.ourSignatoryName
        const totalAmount = params.totalAmount && (params.totalAmount * 10000).toFixed()
        this.addOrEditContract({ ...params, ourSignatoryName, totalAmount })
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
          disabled: true,
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
          disabled: true,
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
          labelWidth: '121px',
          change: (value, form, formDatas, setFormDatas) => {
            if (formDatas.startTime) {
              if (new Date(value) < new Date(formDatas.startTime)) {
                this.$message.warning('结束日期不能早于开始日期')
                setFormDatas({ endTime: '' })
              }
            }
          },
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
    // 合同表格表头配置信息/以下五个都是table的配置信息
    const contractColumns = [
      {
        prop: 'id',
        label: '序号',
        width: '60',
        formater: scope => {
          // console.log('scope', scope, this.pagination)
          return this.pagination.currentPage && (this.pagination.currentPage - 1) * 20 + scope.$index + 1
        // return scope.$index + 1
        }
      },
      {
        prop: 'name',
        label: '合同名称',
        minWidth: '80',
        showOverflowTooltip: true,
        handle: scope => {
          console.log('scope', scope)
          this.$router.push(`/crm/contract/contract-details-page/${scope.row.id}`)
        },
        style: {
          color: '#1890ff',
          cursor: 'pointer'
        }
      },
      // {
      //   prop: 'customerName',
      //   label: '客户',
      //   minWidth: '60',
      //   showOverflowTooltip: true,
      //   handle: scope => {
      //     console.log('scope', scope)
      //     this.$router.push(`/crm/customer/customer-details-page/${scope.row.customerId}`)
      //   },
      //   style: {
      //     color: '#1890ff',
      //     cursor: 'pointer'
      //   }
      // },
      // {
      //   prop: 'businessOpportunityName',
      //   label: '商机',
      //   showOverflowTooltip: true,
      //   minWidth: '80'
      //   // handle: scope => {
      //   //   console.log('scope', scope)
      //   // }
      // },
      {
        prop: 'contractDate',
        label: '签约日期',
        width: '120',
        formater: scope => {
          return scope.row[scope.column.property] ? this.$filters.parseTime(scope.row[scope.column.property] + '', '{y}-{m}-{d}') : ''
        }
      },
      {
        prop: 'totalAmount',
        label: '总金额',
        align: 'right',
        width: '120',
        formater: scope => {
          const number = scope.row[scope.column.property]
          return number && this.numRecursion(number / 10000)
        }
      },
      {
        prop: 'status',
        label: '合同状态',
        minWidth: '80',
        formater: scope => {
          const status = scope.row[scope.column.property]
          return status === 'E' ? '执行中' : status === 'C' ? '结束' : status === 'D' ? '意外终止' : ''
        }
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
    // 合同操作栏
    const contractPopOperates = {
      label: '操作',
      width: '100',
      dataSource: [
        {
          label: '编辑',
          // permitTag: ['userCenter:sysDataMaskingRule:modify'],
          isShow: true,
          handle: params => {
            this.type = 'edit'
            console.log('编辑', params)
            this.PopDialogHandle(this.contractPopOptions, '编辑合同')
            this.getContractInfo({ id: params.row.id })
          }
        },
        {
          label: '删除',
          style: { 'color': '#FE4949' },
          // permitTag: ['userCenter:sysDataMaskingRule:modify'],
          isShow: true,
          handle: params => {
            this.$confirm(' 你确认要删除该合同吗？', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning',
              center: true
            })
              .then(() => {
                this.deleteContract({ id: params.row.id })
              })
              .catch(() => {
                this.$message({
                  type: 'info',
                  message: '已取消删除'
                })
              })
          }
        }
      ]
    }
    // relevantContractOptions表格弹框配置信息
    const relevantContractOptions = {
      relevantAddText: '新建',
      title: '合同',
      tip: 0,
      isTwo: true,
      viewAll: () => {
        this.$router.push(`/crm/business-opportunity/business-opportunity-contract-index-page/${this.$route.params.id}`)
      },
      relevantAdd: () => {
        this.type = 'add'
        this.PopDialogHandle(this.contractPopOptions, '新建合同')
        const businessFormDatas = this.businessFormDatas
        businessFormDatas.customerName && this.$set(this.contractPopOptions.content[1], 'dataSource', [{ label: businessFormDatas.customerName, value: businessFormDatas.customerId }])
        businessFormDatas.name && this.$set(this.contractPopOptions.content[2], 'dataSource', [{ label: businessFormDatas.name, value: businessFormDatas.id }])
        this.setFormDatas(this.contractPopOptions, { customerId: businessFormDatas.customerId, businessOpportunityId: businessFormDatas.id })
      },
      dataSource: [],
      popOperates: contractPopOperates,
      columns: contractColumns,
      popOptions: contractPopOptions
    }

    // 竞争对手pop弹出框配置信息
    const competitorPopOptions = {
      itemType: 'dialog',
      visible: false,
      title: '修改',
      // width: '720px',
      // okText: '保存',
      customClass: 'popOptionsClass',
      ok: params => {
        console.log('确认', params)
        // const businessOpportunityId = params.businessOpportunityName
        // const customerId = params.customerName
        delete params.follower
        this.relationCompetitor({ ...params, businessOpportunityId: this.routeId })
      },
      cancel: params => {
        this.closePopDialogHandle(this.competitorPopOptions)
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
          prop: 'competitorId',
          itemType: 'select',
          filterable: true,
          className: 'commonRemoteSearch',
          remote: true,
          remoteMethod: competitorSearch,
          // itemStyle: { 'width': '50%', 'marginRight': 0 },
          label: '竞争对手',
          rules: [commonChangeReg],
          dataSource: [],
          placeholder: '查找竞争对手'
        }
      ]
    }
    // 竞争对手表格表头配置信息
    const competitorColumns = [
      {
        prop: 'id',
        label: '序号',
        width: '60',
        formater: scope => {
          // console.log('scope', scope, this.pagination)
          return this.pagination.currentPage && (this.pagination.currentPage - 1) * 20 + scope.$index + 1
          // return scope.$index + 1
        }
      },
      {
        prop: 'name',
        label: '竞争对手名称名称',
        minWidth: '80',
        showOverflowTooltip: true,
        handle: scope => {
          console.log('scope', scope)
          this.$router.push(`/crm/competitor/competitor-details-page/${scope.row.competitorId}`)
        },
        style: {
          color: '#1890ff',
          cursor: 'pointer'
        }
      },
      {
        prop: 'provinceId',
        label: '省',
        minWidth: '60',
        showOverflowTooltip: true,
        formater: scope => {
          // console.log(scope.row[scope.column.property], this.areaList.filter(item => item.id === scope.row[scope.column.property]))
          const array = this.areaList.filter(item => item.id === scope.row[scope.column.property] * 1)
          return array.length !== 0 ? array[0].name : ''
        }
      },
      {
        prop: 'cityId',
        label: '市',
        minWidth: '60',
        showOverflowTooltip: true,
        formater: scope => {
          const array = this.areaList.filter(item => item.id === scope.row[scope.column.property] * 1)
          return array.length !== 0 ? array[0].name : ''
        }
      },
      {
        prop: 'areaId',
        label: '区',
        minWidth: '60',
        showOverflowTooltip: true,
        formater: scope => {
          const array = this.areaList.filter(item => item.id === scope.row[scope.column.property] * 1)
          return array.length !== 0 ? array[0].name : ''
        }
      },
      {
        prop: 'remark',
        label: '备注',
        showOverflowTooltip: true,
        minWidth: '80'
      }
    ]
    // 竞争对手操作栏
    const competitorPopOperates = {
      label: '操作',
      width: '100',
      dataSource: [
        {
          label: '取消关联',
          // permitTag: ['userCenter:sysDataMaskingRule:modify'],
          isShow: true,
          handle: params => {
            this.$confirm(' 你确认要取消关联该竞争对手吗？', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning',
              center: true
            })
              .then(() => {
                this.disassociateCompetitor({ id: params.row.id })
              })
              .catch(() => {
                this.$message({
                  type: 'info',
                  message: '已取消删除'
                })
              })
          }
        }
      ]
    }
    // relevantContractOptions表格弹框配置信息
    const relevantCompetitorOptions = {
      relevantAddText: '关联',
      title: '竞争对手',
      tip: 0,
      isTwo: true,
      viewAll: () => {
        this.$router.push(`/crm/business-opportunity/business-opportunity-competitor-index-page/${this.$route.params.id}`)
      },
      relevantAdd: () => {
        this.type = 'add'
        this.PopDialogHandle(this.competitorPopOptions, '新建竞争对手')
      },
      dataSource: [],
      popOperates: competitorPopOperates,
      columns: competitorColumns,
      popOptions: competitorPopOptions
    }

    // 客样分析表格表头配置信息
    const analysisColumns = [
      {
        prop: 'id',
        label: '序号',
        width: '60',
        formater: scope => {
          // console.log('scope', scope, this.pagination)
          return this.pagination.currentPage && (this.pagination.currentPage - 1) * 20 + scope.$index + 1
        // return scope.$index + 1
        }
      },
      {
        prop: 'customerRequireId',
        label: '客样分析申请编号',
        width: '140',
        showOverflowTooltip: true,
        handle: scope => {
          console.log('scope', scope)
          this.$router.push(`/crm/customer-sample-analysis/customer-sample-analysis-details-page/${scope.row.customerRequireId}`)
        },
        style: {
          color: '#1890ff',
          cursor: 'pointer'
        }
      },
      // {
      //   prop: 'businessOpportunityName',
      //   label: '商机',
      //   minWidth: '80',
      //   showOverflowTooltip: true,
      //   handle: scope => {
      //     console.log('scope', scope)
      //     this.$router.push(`/crm/business-opportunity/business-opportunity-details-page/${scope.row.id}`)
      //   },
      //   style: {
      //     color: '#1890ff',
      //     cursor: 'pointer'
      //   }
      // },
      {
        prop: 'endTime',
        label: '要求完成日期',
        width: '140',
        formater: scope => {
          return scope.row[scope.column.property] ? this.$filters.parseTime(scope.row[scope.column.property] + '', '{y}-{m}-{d} {h}:{i}') : ''
        }
      },
      {
        prop: 'sellerTeamName',
        label: '销售部门',
        minWidth: '80',
        showOverflowTooltip: true
        // formater: scope => {
        //   return scope.row[scope.column.property] === 'M' ? '男' : scope.row[scope.column.property] === 'W' ? '女' : ''
        // }
      },
      {
        prop: 'sellerName',
        label: '销售员',
        minWidth: '70',
        showOverflowTooltip: true
      },
      {
        prop: 'status',
        label: '客样分析状态',
        width: '120',
        formater: scope => {
          // const tempArray = []
          return scope.row[scope.column.property] ? status[scope.row[scope.column.property]] : ''
        }
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
    // relevantContractOptions表格弹框配置信息
    const relevantAnalysisOptions = {
      relevantAddText: '关联',
      title: '客样分析申请',
      tip: 0,
      isTwo: true,
      hiddenAddButton: true,
      viewAll: () => {
        this.$router.push(`/crm/business-opportunity/business-opportunity-analysis-index-page/${this.$route.params.id}`)
      },
      relevantAdd: () => {
        this.type = 'add'
        this.PopDialogHandle(this.competitorPopOptions, '新建竞争对手')
      },
      dataSource: [],
      // popOperates: analysisPopOperates,
      columns: analysisColumns
      // popOptions: analysisPopOptions
    }

    // pop弹出框配置信息
    const businessPopOptions = {
      itemType: 'dialog',
      visible: false,
      title: '修改',
      width: '720px',
      // okText: '保存',
      customClass: 'popOptionsClass',
      ok: params => {
        console.log('确认', params)
        delete params.follower
        const salesAmount = params.salesAmount && (params.salesAmount * 10000).toFixed()
        this.editBusinessOpportunity({ ...params, salesAmount }, true)
      },
      cancel: params => {
        this.closePopDialogHandle(this.businessPopOptions)
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
          label: '商机名称',
          rules: [commonBlurReg],
          placeholder: '请输入商机名称'
        },
        {
          prop: 'customerId',
          itemType: 'select',
          labelWidth: '97px',
          itemStyle: { 'width': '53%', 'marginRight': '0px' },
          label: '客户',
          className: 'commonRemoteSearch',
          filterable: true,
          remote: true,
          remoteMethod: this.remoteSearch,
          rules: [commonChangeReg],
          placeholder: '请查找客户',
          dataSource: []
        },
        {
          prop: 'salesAmount',
          itemType: 'input',
          itemStyle: { 'width': '47%', 'marginRight': '0px' },
          maxlength: 12,
          label: '销售金额',
          rules: [commonBlurReg, moneyReg],
          placeholder: '请输入销售金额'
        },
        {
          itemType: 'date',
          prop: 'endDate',
          labelWidth: '97px',
          itemStyle: { 'width': '53%', 'marginRight': '0px' },
          label: '结束日期',
          rules: [commonChangeReg],
          placeholder: '请选择日期'
        },
        {
          prop: 'businessStageId',
          itemType: 'select',
          itemStyle: { 'width': '47%', 'marginRight': '0px' },
          label: '商机阶段',
          change: this.stageChange,
          rules: [commonChangeReg],
          // placeholder: '请输入商机阶段',
          dataSource: []
        },
        {
          prop: 'probability',
          itemType: 'input',
          labelWidth: '97px',
          itemStyle: { 'width': '53%', 'marginRight': '0px' },
          label: '赢单概率',
          readonly: true,
          disabled: true,
          rules: [commonBlurReg]
          // placeholder: '请输入座机号'
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
    // pop弹出框配置信息
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
          // itemStyle: { 'width': '47%', 'marginRight': '20px' },
          label: '用户',
          dataSource: [],
          placeholder: '查找用户'
        }
      ]
    }

    // 详情显示
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
        label: '商机名称:',
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
        prop: 'salesAmount',
        itemType: 'input',
        itemStyle: { 'width': '50%', 'marginRight': 0 },
        label: '销售金额:',
        // disabled: true
        readonly: true
      },
      {
        prop: 'endDate',
        itemType: 'input',
        itemStyle: { 'width': '50%', 'marginRight': 0 },
        label: '结束日期:',
        // disabled: true
        readonly: true
      },
      {
        prop: 'businessStageId',
        itemType: 'input',
        itemStyle: { 'width': '50%', 'marginRight': 0 },
        label: '商机阶段:',
        // disabled: true
        readonly: true
      },
      {
        prop: 'probability',
        itemType: 'input',
        itemStyle: { 'width': '50%', 'marginRight': 0 },
        label: '赢单概率:',
        // disabled: true
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
        readonly: true
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
    return {
      formOtions: {
        // labelPosition: 'left',
        inline: true
      },
      relevantContactsOptions,
      relevantContractOptions,
      relevantCompetitorOptions,
      relevantAnalysisOptions,
      // relevantOptions,
      businessPopOptions,
      contactsPopOptions,
      contractPopOptions,
      competitorPopOptions,
      OwnerPopOptions,
      searchData,
      businessFormDatas: {},
      formDatas: {
        dataTag: 'ALL'
      },
      activeName: 'detailed',
      visible: false,
      businessOpportunityStage: [],
      businessStage: -1,
      lostOrder: -1,
      opiniontTotal: 0,
      contractTotal: 0,
      competitorTotal: 0,
      sampleAnalysisTotal: 0,
      areaList: [],
      userList: [],
      searchFormDatas: {
        businessOpportunityId: this.$route.params.id
      }
    }
  },
  computed: {
    routeId() {
      return this.$route.params.id
    },
    customerId() {
      return this.businessFormDatas.customerId
    }
  },
  watch: {
    opiniontTotal() {
      this.$set(this.relevantContactsOptions, 'tip', this.opiniontTotal || 0)
    },
    contractTotal() {
      this.$set(this.relevantContractOptions, 'tip', this.contractTotal || 0)
    },
    competitorTotal() {
      this.$set(this.relevantCompetitorOptions, 'tip', this.competitorTotal || 0)
    },
    sampleAnalysisTotal() {
      this.$set(this.relevantAnalysisOptions, 'tip', this.sampleAnalysisTotal || 0)
    },
    customerId(newVal, oldNew) {
      this.$set(this.searchData[2].componentsOptions, 'url', `/crm/customer/customer-details-page/${newVal}`)
    }
  },
  created() {
    this.getAreaSearch()
    this.routeId && this.getBusinessOpportunityInfoDisplay({ id: this.routeId })
    this.getOpinionPage()
    this.getCompetitorPage()
    this.routeId && this.getContractPage({ businessOpportunityId: this.routeId })
    this.routeId && this.getSampleAnalysisPage({ businessOpportunityId: this.routeId })
  },
  methods: {
    // 编辑
    detailEdit() {
      this.PopDialogHandle(this.businessPopOptions, '编辑商机')
      this.getBusinessOpportunityInfo({ id: this.routeId })
    },

    // 删除
    detailDelete() {
      this.$confirm(' 你确认要删除该商机吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      })
        .then(() => {
          this.deleteBusinessOpportunity({ id: this.routeId }, true)
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
    },

    // 前面步骤点击事件
    async stepChange(item) {
      console.log(item)
      if (this.businessStage !== item.id - 1) {
        this.changeBusinessStage({ businessStageId: item.id })
      }
    },

    // 输单点击事件
    async lostStepChange() {
      // console.log(111)
      this.$confirm('此操作将修改商机状态为输单, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        if (this.lostOrder !== 0) {
          this.changeBusinessStage({ businessStageId: this.businessOpportunityStage.length })
        }
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消'
        })
      })
    }
  }
}
</script>

<style lang='scss' scoped>
.business-opportunity-details-page {
    margin:20px;
    background-color: #fff;

    .businessOpportunityHeader {
        height: 60px;
        border-bottom: 1px solid #E9EFF2;
        display: flex;
        align-items: center;
        margin-bottom: 20px;
    }

    .businessOpportunityText {
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
.business-opportunity-details-page {
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

  // 商机阶段的样式
  .businessStage {
    .businessRateStage {
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 22px;
      .rateStage {
        height: 30px;
        display: flex;
        font-size: 14px;
        overflow: hidden;
        // align-items: center;
        justify-content: space-around;
        border-radius: 4px;
        width: 90%;
        color: #777777;
        border: 1px solid #D0D9E1;
        .stage {
          cursor: pointer;
          position: relative;
          text-align: center;
          width: 100%;
          height: 30px;
          line-height: 30px;
        }
        .stage.actived {
          background-color: #3ED7D9;
          color: #fff;
        }
        .stage.actived:not(:last-child):after {
          position: absolute;
          content: '';
          right: -8px;
          width: 0;
          height: 0;
          border-top: 15px solid transparent;
          border-left: 8px solid #3ED7D9;
          border-bottom: 15px solid transparent;
        }
        .rightIcon {
          position: absolute;
          z-index: 1;
          transform:scaleX(.5);
          right: -12px;
          color: #D0D9E1;
          width: 23px;
          line-height: 30px;
          font-size: 40px;
        }
        .rightIcon.actived {
          color: #fff;
        }
      }
      .loseStage {
        cursor: pointer;
        margin-left: 15px;
        border: 1px solid #D0D9E1;
        font-size: 14px;
        border-radius: 4px;
        height: 30px;
        color: #777777;
        line-height: 30px;
        padding: 0 15px;
      }
      .loseStage.actived {
        background-color: #888E9E;
        color: #fff;
      }
    }
    // 输单
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

  .el-step.is-simple .el-step__title {
    font-size: 14px;
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
}
</style>

