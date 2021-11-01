<template>
  <div class="competitor-view-all-page">
    <div class="competitorHeader">
      <span v-if="competitorName" class="competitorText">{{ competitorName }}</span>
      <div class="details-button">
        <el-button size="mini" @click="viewAllAdd">关联</el-button>
        <!-- <el-button @click="$router.back()">返回</el-button> -->
      </div>
    </div>
    <!-- table表格 -->
    <div class="page-table">
      <cs-custom-table
        :columns="competitorColumns"
        :data-source="competitorDataSource"
        :operates="competitorPopOperates"
        :pagination="pagination"
        edit-type="pop"
        highlight-current-row
      />
    </div>
    <!-- 导入更改所有人pop弹出层 -->
    <div class="pop">
      <cs-custom-pop :options="competitorPopOptions" />
    </div>
  </div>
</template>

<script>
import { PublicCrm } from '@/views/crm/public/index'
import { RelevantCompetitor } from '../components/relevantCompetitor'
import { businessOpportunityInfo } from '../api/index.js'
export default {
  mixins: [PublicCrm, RelevantCompetitor],
  data() {
    // 公用验证正则
    const commonChangeReg = this.$getRules({})
    // 公用验证正则
    // const commonBlurReg = this.$getRules({ trigger: ['blur'] })

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

    // 分页配置信息
    const pagination = {
      // currentPage: 1,
      // pageSize: 20,
      // dataTotal: dataSource.length,
      currentChange: val => {
        // console.log('currentChange', this.pagination)
        this.getCompetitorPage({ pageSize: this.pagination.pageSize || 20, pageNum: val })
      },
      sizeChange: val => {
        // console.log('sizeChange', this.pagination)
        this.getCompetitorPage({ pageNum: this.pagination.pageNum || 1, pageSize: val })
      }
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
          // return this.pagination.currentPage && (this.pagination.currentPage - 1) * 20 + scope.$index + 1
          return scope.$index + 1
        }
      },
      {
        prop: 'name',
        label: '竞争对手名称名称',
        showOverflowTooltip: true,
        minWidth: '80',
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
    return {
      competitorPopOptions,
      competitorColumns,
      competitorDataSource: [],
      competitorPopOperates,
      pagination,
      competitorName: '',
      type: 'add',
      areaList: []
    }
  },
  computed: {
    routeId() {
      return this.$route.params.id
    }
  },
  created() {
    this.getAreaSearch()
    this.getCompetitorPage()
    this.getBusinessOpportunityInfo({ id: this.routeId })
  },
  methods: {
    viewAllAdd() {
      this.type = 'add'
      this.PopDialogHandle(this.competitorPopOptions, '关联竞争对手')
    },
    // 获取商机详情
    async getBusinessOpportunityInfo(data = {}) {
      const res = await businessOpportunityInfo(data)
      console.log('详情', res)
      this.competitorName = res.data.name
      // const endDate = res.data.endDate ? this.$filters.parseTime(res.data.endDate + '', '{y}-{m}-{d}') : null
      // this.setFormDatas(this.businessPopOptions, { ...res.data, endDate })
      // this.stageChange(res.data.businessStageId)
    }
  }
}
</script>

<style lang='scss' scoped>
.competitor-view-all-page {
    padding:20px;

    .competitorHeader {
        height: 60px;
        border-bottom: 1px solid #E9EFF2;
        background-color: #fff;
        display: flex;
        align-items: center;
    }

    .competitorText {
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
