<template>
  <div class="brand-business-view-all-page">
    <div class="brandBusinessHeader">
      <span v-if="brandName" class="brandBusinessText">{{ brandName }}</span>
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
        :data-source="brandBusinessCustomerDataSource"
        :pagination="pagination"
        :operates="customerPopOperates"
        edit-type="pop"
        highlight-current-row
      />
    </div>
    <!-- 导入pop弹出层 -->
    <div class="pop">
      <cs-custom-pop :options="customerPopOptions" />
    </div>
  </div>
</template>

<script>
import { BrandBusiness } from '../components/index.js'
import { PublicCrm } from '@/views/crm/public/index'
import { brandInfo } from '../../brand-business/api/index.js'
export default {
  mixins: [BrandBusiness, PublicCrm],
  data() {
    // 公用验证正则
    const commonChangeReg = this.$getRules({})
    // 公用验证正则
    // const commonBlurReg = this.$getRules({ trigger: ['blur'] })
    // 金额数字正则
    // const moneyReg = this.$getRules({ type: 'number', pattern: /^(([1-9]{1}\d{0,8})|(0{1}))(\.\d{1,2})?$/, message: '请输入最多9位整数或保留1到2位小数', trigger: ['blur'] })

    // 远程客户搜索
    const remoteCustomerSearch = (value) => {
      console.log(value)
      if (value === '') {
        this.$set(this.customerPopOptions.content[0], 'dataSource', [])
      } else {
        if (!this.getData1) {
          this.getData1 = this.$utils.debounce(this.remoteCustomerPage, 300)
        }
        this.getData1({ name: value, dataTag: 'ALL' }, 0, this.customerPopOptions)
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
          return scope.$index + 1
        // return scope.$index + 1
        }
      },
      {
        prop: 'name',
        label: '客户名称',
        showOverflowTooltip: true,
        minWidth: '80',
        handle: scope => {
          console.log('scope', scope)
          this.$router.push(`/crm/customer/customer-details-page/${scope.row.id}`)
        },
        style: {
          color: '#1890ff',
          cursor: 'pointer'
        }
      },
      {
        prop: 'shortName',
        label: '中文简称',
        showOverflowTooltip: true,
        width: '120'
      },
      {
        prop: 'ename',
        label: '英文简称',
        showOverflowTooltip: true,
        width: '120'
      },
      {
        prop: 'customerTypeName',
        label: '客户类型',
        showOverflowTooltip: true,
        width: '120'
      },
      {
        prop: 'levelName',
        label: '客户级别',
        showOverflowTooltip: true,
        width: '120'
      }
    ]
    // 分页配置信息
    const pagination = {
      // currentPage: 1,
      // pageSize: 20,
      // dataTotal: dataSource.length,
      currentChange: val => {
        // console.log('currentChange', this.pagination)
        this.getBrandBusinessPage({ pageSize: this.pagination.pageSize || 20, pageNum: val })
      },
      sizeChange: val => {
        // console.log('sizeChange', this.pagination)
        this.getBrandBusinessPage({ pageNum: this.pagination.pageNum || 1, pageSize: val })
      }
    }
    let handleConf = [
      {
        label: '取消关联',
        // permitTag: ['userCenter:sysDataMaskingRule:modify'],
        isShow: true,
        handle: params => {
          this.$confirm(' 你确认要取消关联该客户吗？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
            center: true
          })
            .then(() => {
              this.brandUnlinkCustomer({ id: params.row.customerBrandId })
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
    const customerPopOperates = {
      label: '操作',
      width: '100',
      dataSource: handleConf
    }

    // pop弹出框配置信息
    const customerPopOptions = {
      itemType: 'dialog',
      visible: false,
      title: '修改',
      //   width: '720px',
      // okText: '保存',
      customClass: 'popOptionsClass',
      ok: params => {
        console.log('确认', params)
        // delete params.follower
        // const salesAmount = params.salesAmount && params.salesAmount * 10000
        // const customerId = params.brandName
        this.brandLinkCustomer({ ...params, brandId: this.routeId })
        // this.addOrEditBusinessOpportunity({ ...params, salesAmount })
      },
      cancel: params => {
        this.closePopDialogHandle(this.customerPopOptions)
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
          prop: 'customerId',
          itemType: 'select',
          filterable: true,
          className: 'commonRemoteSearch',
          remote: true,
          remoteMethod: remoteCustomerSearch,
          loading: false,
          rules: [commonChangeReg],
          // itemStyle: { 'width': '50%', 'marginRight': 0 },
          label: '客户',
          dataSource: [],
          placeholder: '关联客户'
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
      customerPopOperates,
      brandBusinessCustomerDataSource: [],
      type: 'edit',
      customerPopOptions,
      searchFormDatas: {
        brandId: this.$route.params.id
      },
      brandName: ''
    }
  },
  computed: {
    routeId() {
      return this.$route.params.id
    }
  },
  created() {
    this.getBrandBusinessCustomerPage()
    this.getBrandBusinessInfo({ id: this.routeId })
  },
  methods: {
    viewAllAdd() {
      this.type = 'add'
      this.PopDialogHandle(this.customerPopOptions, '新建商机')
    },
    // 获取品牌商详情
    async getBrandBusinessInfo(data = {}) {
      const res = await brandInfo(data)
      console.log('详情', res)
      this.brandName = res.data.name
      // this.setFormDatas(this.brandBusinessPopOptions, res.data)
    }
  }
}
</script>

<style lang='scss' scoped>
.brand-business-view-all-page {
    padding:20px;

    .brandBusinessHeader {
        height: 60px;
        border-bottom: 1px solid #E9EFF2;
        background-color: #fff;
        display: flex;
        align-items: center;
    }

    .brandBusinessText {
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
