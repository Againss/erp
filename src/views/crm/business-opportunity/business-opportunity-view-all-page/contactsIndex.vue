<template>
  <div class="contacts-view-all-page">
    <div class="contactsHeader">
      <span v-if="contactsName" class="contactsText">{{ contactsName }}</span>
      <div class="details-button">
        <el-button size="mini" @click="viewAllAdd">新建</el-button>
        <!-- <el-button @click="$router.back()">返回</el-button> -->
      </div>
    </div>
    <!-- table表格 -->
    <div class="page-table">
      <cs-custom-table
        :columns="contactsColumns"
        :data-source="opinionDataSource"
        :operates="contactsPopOperates"
        :pagination="pagination"
        edit-type="pop"
        highlight-current-row
      />
    </div>
    <!-- 导入更改所有人pop弹出层 -->
    <div class="pop">
      <cs-custom-pop :options="contactsPopOptions" />
    </div>
  </div>
</template>

<script>
import { PublicCrm } from '@/views/crm/public/index'
import { RelevantContacts } from '../components/relevantContacts'
import { businessOpportunityInfo } from '../api/index.js'
export default {
  mixins: [PublicCrm, RelevantContacts],
  data() {
    // 公用验证正则
    const commonChangeReg = this.$getRules({})
    // 公用验证正则
    // const commonBlurReg = this.$getRules({ trigger: ['blur'] })

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

    // 分页配置信息
    const pagination = {
      // currentPage: 1,
      // pageSize: 20,
      // dataTotal: dataSource.length,
      currentChange: val => {
        // console.log('currentChange', this.pagination)
        this.getOpinionPage({ pageSize: this.pagination.pageSize || 20, pageNum: val })
      },
      sizeChange: val => {
        // console.log('sizeChange', this.pagination)
        this.getOpinionPage({ pageNum: this.pagination.pageNum || 1, pageSize: val })
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
          style: { 'color': '#FE4949' },
          // permitTag: ['userCenter:sysDataMaskingRule:modify'],
          isShow: true,
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
    // 商机表格头部列表
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
        minWidth: '60'
        // formater: scope => {
        //   return scope.row[scope.column.property] === 'M' ? '男' : '女'
        // }
      },
      {
        prop: 'position',
        label: '立场',
        minWidth: '80'
        // handle: scope => {
        //   console.log('scope', scope)
        //   // this.$router.push(`/crm/business-opportunity/business-opportunity-details-page/${scope.row.id}`)
        // },
        // style: {
        //   color: '#1890ff',
        //   cursor: 'pointer'
        // }
      },
      {
        prop: 'familiarity',
        label: '熟悉度',
        minWidth: '70'
      },
      {
        prop: 'disposition',
        label: '性格特征',
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
    return {
      contactsPopOptions,
      contactsColumns,
      opinionDataSource: [],
      contactsPopOperates,
      pagination,
      contactsName: '',
      type: 'add'
    }
  },
  computed: {
    routeId() {
      return this.$route.params.id
    }
  },
  created() {
    this.getOpinionPage()
    this.getBusinessOpportunityInfo({ id: this.routeId })
  },
  methods: {
    viewAllAdd() {
      this.type = 'add'
      this.PopDialogHandle(this.contactsPopOptions, '新建联系人')
    },
    // 获取商机详情
    async getBusinessOpportunityInfo(data = {}) {
      const res = await businessOpportunityInfo(data)
      console.log('详情', res)
      this.contactsName = res.data.name
      // const endDate = res.data.endDate ? this.$filters.parseTime(res.data.endDate + '', '{y}-{m}-{d}') : null
      // this.setFormDatas(this.businessPopOptions, { ...res.data, endDate })
      // this.stageChange(res.data.businessStageId)
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
