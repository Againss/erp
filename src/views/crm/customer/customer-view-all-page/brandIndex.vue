<template>
  <div class="brand-view-all-page">
    <div class="brandHeader">
      <span v-if="customerName" class="brandText">{{ customerName }}</span>
      <div class="details-button">
        <el-button size="mini" @click="viewAllAdd">关联</el-button>
      <!-- <el-button @click="$router.back()">返回</el-button> -->
      </div>
    </div>
    <!-- table表格 -->
    <div class="page-table">
      <cs-custom-table
        tooltip-effect="dark"
        :columns="columns"
        :data-source="brandDataSource"
        :pagination="pagination"
        :operates="brandPopOperates"
        edit-type="pop"
        highlight-current-row
      />
    </div>
    <!-- 导入pop弹出层 -->
    <div class="pop">
      <cs-custom-pop :options="brandPopOptions" />
    </div>
  </div>
</template>

<script>
import { RelevantBrand } from '../components/brandIndex.js'
import { PublicCrm } from '@/views/crm/public/index'
import { customerInfo } from '../../customer/api/index.js'
export default {
  mixins: [RelevantBrand, PublicCrm],
  data() {
    // 公用验证正则
    const commonChangeReg = this.$getRules({})

    // 远程品牌商搜索
    const remoteBrandSearch = (value) => {
      console.log(value)
      if (value === '') {
        this.$set(this.brandPopOptions.content[0], 'dataSource', [])
      } else {
        if (!this.getData1) {
          this.getData1 = this.$utils.debounce(this.remoteBrandPage, 300)
        }
        this.getData1({ name: value, dataTag: 'ALL' }, 0, this.brandPopOptions)
      }
    }

    // 格表头配置信息/以下五个都是table的配置信息
    const columns = [
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
        label: '品牌商名称',
        minWidth: '80',
        showOverflowTooltip: true,
        handle: scope => {
          console.log('scope', scope)
          this.$router.push(`/crm/brand-business/brand-business-details-page/${scope.row.id}`)
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
      }
    ]
    // 分页配置信息
    const pagination = {
      // currentPage: 1,
      // pageSize: 20,
      // dataTotal: dataSource.length,
      currentChange: val => {
        // console.log('currentChange', this.pagination)
        this.getBrandPage({ pageSize: this.pagination.pageSize || 20, pageNum: val })
      },
      sizeChange: val => {
        // console.log('sizeChange', this.pagination)
        this.getBrandPage({ pageNum: this.pagination.pageNum || 1, pageSize: val })
      }
    }
    let handleConf = [
      {
        label: '取消关联',
        // style: { 'color': '#FE4949' },
        // permitTag: ['userCenter:sysDataMaskingRule:modify'],
        isShow: true,
        handle: params => {
          this.$confirm(' 你确认要取消关联该品牌商吗？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          })
            .then(() => {
              this.disassociateBrand({ id: params.row.brandCustomerId })
            })
            .catch(() => {
              this.$message({
                type: 'info',
                message: '已取消'
              })
            })
        }
      }
    ]
    handleConf = this.$filterPermission(handleConf)
    // 表格操作栏里面的配置信息
    const brandPopOperates = {
      label: '操作',
      width: '100',
      dataSource: handleConf
    }

    // pop弹出框配置信息
    const brandPopOptions = {
      itemType: 'dialog',
      visible: false,
      title: '修改',
      // width: '720px',
      // okText: '保存',
      customClass: 'popOptionsClass',
      ok: params => {
        console.log('确认', params)
        this.relationBrand({ ...params, customerId: this.routeId })
      },
      cancel: params => {
        this.closePopDialogHandle(this.brandPopOptions)
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
          prop: 'brandId',
          itemType: 'select',
          filterable: true,
          className: 'commonRemoteSearch',
          remote: true,
          remoteMethod: remoteBrandSearch,
          loading: false,
          rules: [commonChangeReg],
          // itemStyle: { 'width': '50%', 'marginRight': 0 },
          label: '品牌商',
          dataSource: [],
          placeholder: '关联品牌商'
        }
      ]
    }
    return {
      formDatas: {
        dataTag: 'ALL'
      },
      formOtions: {
        inline: true
      },
      columns,
      pagination,
      brandPopOperates,
      brandDataSource: [],
      type: 'edit',
      brandPopOptions,
      searchFormDatas: {
        id: this.$route.params.id
      },
      customerName: '',
      areaList: []
    }
  },
  computed: {
    routeId() {
      return this.$route.params.id
    }
  },
  created() {
    this.getBrandPage()
    this.getAreaSearch({})
    this.getCustomerInfo({ customerId: this.routeId })
  },
  methods: {
    viewAllAdd() {
      this.type = 'add'
      this.PopDialogHandle(this.brandPopOptions, '新建商机')
    },
    // 获取客户详情
    async getCustomerInfo(data = {}) {
      const res = await customerInfo(data)
      console.log('详情', res)
      this.customerName = res.data.name
      // this.setFormDatas(this.brandPopOptions, res.data)
    }
  }
}
</script>

<style lang='scss' scoped>
.brand-view-all-page {
    padding:20px;

    .brandHeader {
        height: 60px;
        border-bottom: 1px solid #E9EFF2;
        background-color: #fff;
        display: flex;
        align-items: center;
    }

    .brandText {
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
