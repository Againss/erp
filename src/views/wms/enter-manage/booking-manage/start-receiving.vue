<template>
  <div class="page-main">
    <!-- 预约信息 -->
    <div class="form-main">
      <form-title :options="{ title: '预约信息' }">
        <template slot="content">
          <span>单号：{{ detailsInfoFormData.reservationNo }}</span>
        </template>
      </form-title>
      <div class="form-box">
        <cs-custom-form
          ref="reserveInformation"
          :form-datas="detailsInfoFormData"
          :data-source="reserveInfoData"
          :options="formOtions"
        />
      </div>
    </div>

    <!-- 送货信息 -->
    <div class="form-main">
      <form-title :options="{ title: '送货信息' }" />
      <div class="form-box">
        <cs-custom-form
          ref="reserveInformation"
          :form-datas="deliverInfoFormDatas"
          :data-source="deliverInfoData"
          :options="formOtions"
        />
      </div>
    </div>

    <!-- 货物明细列表 -->
    <div class="form-main">
      <form-title
        :options="{ title: '货物明细', formStyle: { borderBottom: 'none' } }"
      />
      <div class="page-table">
        <!-- 布类列表 -->
        <cs-custom-table
          v-if="detailsInfoFormData.productType === 1"
          tooltip-effect="dark"
          :columns="clothColumns"
          :autoresize="false"
          :data-source="clothDataSource"
          :pagination="clothPagination"
          :operates="clothPopOperates"
          highlight-current-indexrow
          :form-otions="formOtions"
        />
        <!-- 纱类列表 -->
        <cs-custom-table
          v-if="detailsInfoFormData.productType === 2"
          tooltip-effect="dark"
          :columns="gauzeColumns"
          :autoresize="false"
          :data-source="gauzeDataSource"
          :pagination="gauzePagination"
          :operates="gauzePopOperates"
          highlight-current-indexrow
          :form-otions="formOtions"
        />
      </div>
    </div>
    <!-- 备注说明、附件上传 -->
    <div class="form-main m-b60">
      <div class="form-box">
        <cs-custom-form
          ref="remarkForm"
          class="clearfix"
          :form-datas="remarkFormDatas"
          :data-source="remarkDataSource"
          :options="remarkFormOtions"
        />
      </div>
    </div>

    <!-- 按钮 -->
    <div class="btn-rows">
      <el-button v-permission="" type="primary" size="small">完成</el-button>
      <el-button v-permission="" size="small">暂停</el-button>
      <el-button v-permission="" size="small" @click="backPage">返回</el-button>
    </div>
  </div>
</template>
<script>
import { PublicWms } from '@/views/wms/public/index'
import { BookingDetails } from './components/booking-details.js'
import FormTitle from '@/views/wms/public/components/formTitle'
import CustomUpload from './components/custom-upload.vue'
export default {
  components: {
    FormTitle
  },
  mixins: [PublicWms, BookingDetails],
  data() {
    const itemStyle = this.formItemStyle()
    /* 预约信息 */
    const reserveInfoData = [
      {
        prop: 'stockType',
        itemStyle: itemStyle,
        disabled: true,
        itemType: 'input',
        label: '入库类型',
        formater: (row) => {
          console.log('row', row)
        }
      },
      {
        prop: 'deliveryNo',
        itemStyle: itemStyle,
        disabled: true,
        itemType: 'input',
        label: '关联单号'
      },
      {
        prop: 'productType',
        itemStyle: itemStyle,
        disabled: true,
        itemType: 'input',
        label: '货物类型'
      },
      {
        prop: 'warehouseName',
        itemStyle: itemStyle,
        disabled: true,
        itemType: 'input',
        label: '预约入库仓库'
      },
      {
        prop: 'sentInPlan',
        itemStyle: itemStyle,
        disabled: true,
        itemType: 'input',
        label: '预约送仓时间'
      },
      {
        prop: 'sentInFact',
        itemStyle: itemStyle,
        disabled: true,
        itemType: 'input',
        label: '实际送仓时间'
      },
      {
        prop: 'numberInPlan',
        itemStyle: itemStyle,
        disabled: true,
        itemType: 'input',
        label: '预约入库件数'
      },
      {
        prop: 'numberInFact',
        itemStyle: itemStyle,
        disabled: true,
        itemType: 'input',
        label: '实际入库件数'
      },
      {
        prop: 'weightInPlan',
        itemStyle: itemStyle,
        disabled: true,
        itemType: 'input',
        label: '预约入库重量（KG）'
      },
      {
        prop: 'weightInFact',
        itemStyle: itemStyle,
        itemType: 'input',
        disabled: true,
        label: '实际入库重量（KG）'
      },
      {
        prop: 'consigneeName',
        itemStyle: itemStyle,
        itemType: 'select',
        label: '收货员'
      }
    ]

    /* 送货信息 */
    const deliverInfoData = [
      {
        prop: 'shipper',
        itemStyle: itemStyle,
        itemType: 'input',
        disabled: true,
        label: '货主'
      },
      {
        prop: 'fabricStore',
        itemStyle: itemStyle,
        disabled: true,
        itemType: 'input',
        label: '布行'
      },
      {
        prop: 'supplier',
        itemStyle: itemStyle,
        disabled: true,
        itemType: 'input',
        label: '供应商'
      },
      {
        prop: 'deliveryman',
        itemStyle: itemStyle,
        disabled: true,
        itemType: 'input',
        label: '司机姓名'
      },
      {
        prop: 'deliverymanPhone',
        itemStyle: itemStyle,
        disabled: true,
        itemType: 'input',
        label: '联系电话'
      },
      {
        prop: 'licenseNumber',
        itemStyle: itemStyle,
        disabled: true,
        itemType: 'input',
        label: '车牌号'
      }
    ]

    /* 货物明细列表（布类） */
    const clothColumns = [
      {
        prop: 'materiel',
        label: '产品编号',
        align: 'left',
        minWidth: 110
      },
      {
        prop: 'sellerTeamName',
        label: '销售组织',
        align: 'left',
        minWidth: 110
      },
      {
        prop: 'materielType',
        label: '物料类型',
        showOverflowTooltip: true,
        width: 120,
        formater: scope => {
          return this.getStatus(scope.row.materielType)
        }
      },
      {
        prop: 'yarnName',
        label: '纱名',
        showOverflowTooltip: true,
        minWidth: 120
      },
      {
        prop: 'yarnProperty',
        label: '纱属性',
        showOverflowTooltip: true,
        minWidth: 120
      },
      {
        prop: 'yarnCard',
        label: '纱牌/纱批',
        align: 'left',
        minWidth: 110
      },
      {
        prop: 'dyelot',
        label: '缸号',
        align: 'left',
        minWidth: 110
      },
      {
        prop: '1',
        label: '预计入库件(卷)数',
        align: 'left',
        minWidth: 140
      },
      {
        prop: '',
        label: '预计入库重量(KG)',
        align: 'left',
        minWidth: 110
      }
    ]

    /* 操作 */
    const clothPopOperates = {
      label: '操作',
      fixed: 'right',
      align: 'left',
      width: 150,
      dataSource: [
        {
          label: '抽磅',
          isShow: true,
          permitTag: [''],
          handle: (params) => {

          }
        },
        {
          label: '抽磅记录',
          isShow: true,
          permitTag: [''],
          handle: (params) => {

          }
        }
      ]
    }

    /* 分页 */
    const clothPagination = {
      currentChange: (val) => {
      },
      sizeChange: (val) => {
      }
    }
    // 布列表
    const gauzeColumns = [
      {
        prop: 'materiel',
        label: '产品编号',
        align: 'left',
        minWidth: 110
      },
      {
        prop: 'sellerTeamId',
        label: '销售组织',
        align: 'left',
        minWidth: 110
      },
      {
        prop: 'materielType',
        label: '物料类型',
        showOverflowTooltip: true,
        width: 120,
        formater: scope => {
          return this.getStatus(scope.row.materielType)
        }
      },
      {
        prop: 'yarnName',
        label: '纱名',
        showOverflowTooltip: true,
        minWidth: 120
      },
      {
        prop: 'yarnProperty',
        label: '纱属性',
        showOverflowTooltip: true,
        minWidth: 120
      },
      {
        prop: 'productInfo',
        label: '产品信息',
        showOverflowTooltip: true,
        minWidth: 120
      },
      {
        prop: 'machineNo',
        label: '机台号',
        showOverflowTooltip: true,
        minWidth: 120
      },
      {
        prop: 'stitchNum',
        label: '针数',
        showOverflowTooltip: true,
        minWidth: 120
      },
      {
        prop: 'inchNum',
        label: '寸数',
        showOverflowTooltip: true,
        minWidth: 120
      },
      {
        prop: 'dyelot',
        label: '缸号',
        align: 'left',
        minWidth: 140
      },
      {
        prop: '',
        label: '预计入库件(卷)数',
        align: 'left',
        minWidth: 110
      },
      {
        prop: '',
        label: '预计入库重量(KG)',
        align: 'left',
        minWidth: 110
      }
    ]

    /* 操作 */
    const gauzePopOperates = {
      label: '操作',
      fixed: 'right',
      align: 'left',
      width: 200,
      dataSource: [
        {
          label: '抽磅',
          isShow: true,
          permitTag: [''],
          handle: (params) => {

          }
        },
        {
          label: '拆分',
          isShow: true,
          permitTag: [''],
          handle: (params) => {

          }
        },
        {
          label: '抽磅记录',
          isShow: true,
          permitTag: [''],
          handle: (params) => {
          }
        }
      ]
    }

    /* 分页 */
    const gauzePagination = {
      currentChange: (val) => {
      },
      sizeChange: (val) => {
      }
    }

    /* 附件上传 */
    const remarkDataSource = [
      {
        prop: 'remark',
        type: 'textarea',
        disabled: true,
        rows: 9,
        height: '180px',
        itemStyle: {
          width: '600px',
          marginRight: '10%',
          float: 'left'
        },
        itemType: 'input',
        label: '备注说明'
      },
      {
        components: {
          CustomUpload
        },
        componentsOptions: {
          type: 'upload',
          style: {

          },
          filelist: []
        }
      },
      {
        prop: 'remark',
        disabled: true,
        type: 'textarea',
        rows: 6,
        itemStyle: {
          width: '100%',
          marginRight: '10%',
          float: 'left'
        },
        itemType: 'input',
        label: '拒收原因'
      }
    ]

    return {
      active: 'cloth',
      /* 货物明细列表（布类）*/
      clothColumns,
      clothDataSource: [],
      clothPagination,
      clothPopOperates,
      /* 货物明细列表（纱类）*/
      gauzeColumns,
      gauzeDataSource: [],
      gauzePagination,
      gauzePopOperates,
      /* 预约信息 */
      detailsInfoFormData: {},
      reserveInfoData,
      formOtions: {
        inline: true,
        size: 'small'
      },
      /* 送货信息 */
      deliverInfoFormDatas: {},
      deliverInfoData,
      /* 备注说明*/
      remarkFormDatas: [],
      remarkDataSource,
      remarkFormOtions: {
        inline: false,
        size: 'small',
        labelPosition: 'top'
      }
    }
  }
}
</script>
