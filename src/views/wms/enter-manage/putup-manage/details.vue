<template>
  <div class="page-main putupDetail">
    <!-- 上架信息 -->

    <div class="top">
      <div class="leftBox">单号：{{ shelfNo }}</div>
      <div class="rightBox" v-html="statusShow" />
    </div>
    <div class="form-main">
      <form-title :options="{ title: '上架信息' }" />
      <div class="form-box">
        <cs-custom-form
          ref="putStorageInfo"
          :form-datas="putStorageInfoFormDatas"
          :data-source="putStorageInfoData"
          :options="formOtions"
        />
      </div>
    </div>

    <!-- 上架明细明细列表 -->
    <div class="form-main">
      <!-- 待上架明细 -->
      <div v-if="status === '0'" class="m-b60">
        <form-title
          :options="{ title: '上架明细', formStyle: { borderBottom: 'none' } }"
        />
        <div class="form-box spe detail">
          <!--  待上架布类列表 -->
          <cs-custom-table
            v-if="putStorageInfoFormDatas.productType === 1"
            tooltip-effect="dark"
            :columns="waitingClothColumns"
            :autoresize="false"
            :data-source="detailsDataSource"
            :pagination="detailsPagination"
            highlight-current-indexrow
            :form-otions="formOtions"
          />
          <!--  待上架纱类列表 -->
          <cs-custom-table
            v-else-if="putStorageInfoFormDatas.productType === 2"
            tooltip-effect="dark"
            :columns="waitingGauzeColumns"
            :autoresize="false"
            :data-source="detailsDataSource"
            :pagination="detailsPagination"
            highlight-current-indexrow
            :form-otions="formOtions"
          />
        </div>
      </div>
      <!-- 已上架明细 -->
      <div v-else-if="status === '1'" class="m-b60">
        <form-title
          :options="{ title: '上架明细', formStyle: { borderBottom: 'none' } }"
        />
        <div class="form-box spe detail">
          <!-- 已上架布类列表 -->
          <cs-custom-table
            v-if="putStorageInfoFormDatas.productType === 1"
            tooltip-effect="dark"
            :columns="alreadyClothColumns"
            :autoresize="false"
            :data-source="detailsDataSource"
            :pagination="detailsPagination"
            :operates="detailInfoPopOperates"
            :form-otions="formOtions"
          />
          <!-- 已上架纱类列表 -->
          <cs-custom-table
            v-else-if="putStorageInfoFormDatas.productType === 2"
            tooltip-effect="dark"
            :columns="alreadyGauzeColumns"
            :autoresize="false"
            :operates="detailInfoPopOperates"
            :data-source="detailsDataSource"
            :pagination="detailsPagination"
            :form-otions="formOtions"
          />
        </div>
      </div>
    </div>
    <!-- 按钮 -->
    <bottomBar :config="barOptions" />
    <!-- 明细 -->
    <el-dialog
      title="明细"
      :visible.sync="dialogDetailInfoVisible"
      width="1500px"
    >
      <div class="form-box detail spe table-wrap">
        <!-- 添加上架明细布列表 -->
        <cs-custom-table
          v-if="putStorageInfoFormDatas.productType === 1"
          tooltip-effect="dark"
          :autoresize="false"
          :columns="detailInfoClothColumns"
          :data-source="alreadyDetailDataSource"
          :pagination="detailInfoPagination"
          highlight-current-indexrow
          :form-otions="formOtions"
          max-height="400"
        />
        <!-- 添加上架明细纱列表 -->
        <cs-custom-table
          v-if="putStorageInfoFormDatas.productType === 2"
          tooltip-effect="dark"
          :autoresize="false"
          :columns="detailInfoGauzeColumns"
          :data-source="alreadyDetailDataSource"
          :pagination="detailInfoPagination"
          highlight-current-indexrow
          :form-otions="formOtions"
          max-height="400"
        />
      </div>
      <div class="dialog-footer-btns">
        <el-button
          type="primary"
          size="small"
          @click="dialogDetailInfoVisible = false"
        >关闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { PublicWms } from '@/views/wms/public/index'
import { PutupManage } from './components/index'
import FormTitle from '@/views/wms/public/components/formTitle'
import popoverColumn from '@/components/cs-custom-table/columns/popover-column'
import propertyCard from '@/components/property-card/index.vue'
/* import { getProductDetailsListData } from './api/index' */
import { BOOKING_TYPE_OF_GOODS } from '@/views/wms/public/constants'
import bottomBar from '@/views/wms/public/components/bottomBar.vue'
export default {
  components: {
    FormTitle,
    bottomBar
  },
  mixins: [PublicWms, PutupManage],
  data() {
    const commonBlurReg = this.$getRules({ trigger: ['blur'] })
    const itemStyle = this.formItemStyle()

    /* 上架信息 */
    const putStorageInfoData = [
      {
        prop: 'shelfNo',
        itemStyle: itemStyle,
        disabled: true,
        itemType: 'input',
        label: '上架单号'
      },
      {
        prop: 'formNo',
        itemStyle: itemStyle,
        disabled: true,
        itemType: 'input',
        label: '关联入库单号'
      },
      {
        prop: 'shipperModel',
        itemStyle: itemStyle,
        disabled: true,
        itemType: 'input',
        label: '货主'
      },
      {
        prop: 'productType',
        itemStyle: itemStyle,
        disabled: true,
        itemType: 'select',
        label: '货物类型',
        dataSource: BOOKING_TYPE_OF_GOODS
      },
      {
        prop: 'stockIn',
        itemStyle: itemStyle,
        disabled: true,
        itemType: 'input',
        label: '入库件数'
      },
      {
        prop: 'upShelf',
        itemStyle: itemStyle,
        disabled: true,
        itemType: 'input',
        label: '上架件数'
      },
      {
        prop: 'createdTime',
        itemStyle: itemStyle,
        disabled: true,
        itemType: 'input',
        label: '上架生成时间'
      },
      {
        prop: 'shelfMan',
        disabled: true,
        itemStyle: itemStyle,
        itemType: 'select',
        valueType: 'object',
        label: '上架员',
        rules: this.$getRules({ trigger: ['blur'] }),
        // change: (obj) => {
        //   if (obj.label && obj.value) {
        //     this.confirmFinishParams.shelfManId = obj.value
        //     this.confirmFinishParams.shelfManName = obj.label
        //   }
        // },
        dataSource: []
      }
    ]

    /* 待上架明细列表（纱类） */
    const waitingGauzeColumns = [
      {
        prop: 'batchNo',
        label: '批次号',
        showOverflowTooltip: true,
        align: 'left',
        minWidth: 150
      },
      {
        prop: 'materiel',
        label: '产品编号',
        align: 'left',
        minWidth: 180,
        components: {
          popoverColumn
        },
        componentsOptions: {
          customOptions: {
            style: {
              color: '#0986FF',
              cursor: 'pointer',
              marginTop: '5px'
            },
            placement: 'right',
            width: '500',
            content: propertyCard,
            trigger: 'click',
            mouseleave: true,
            show: (scope) => {
              return scope.row['materiel']
            }
          }
        },
        showOverflowTooltip: true
      },
      {
        prop: 'numberInPlan',
        label: '待上架数',
        align: 'left',
        minWidth: 120,
        showOverflowTooltip: true
      },
      {
        prop: 'packingUnit',
        label: '包装单位',
        align: 'left',
        minWidth: 120,
        showOverflowTooltip: true
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
        label: '纱牌/批号',
        showOverflowTooltip: true,
        align: 'left',
        minWidth: 140
      },
      {
        prop: 'dyelot',
        label: '缸号',
        align: 'left',
        minWidth: 120,
        showOverflowTooltip: true
      },
      {
        prop: 'sellerTeamName',
        label: '销售组织',
        showOverflowTooltip: true,
        align: 'left',
        minWidth: 160
      }
    ]

    /* 待上架明细列表（布类） */
    const waitingClothColumns = [
      {
        prop: 'batchNo',
        label: '批次号',
        showOverflowTooltip: true,
        align: 'left',
        minWidth: 150
      },
      {
        prop: 'materiel',
        label: '产品编号',
        align: 'left',
        minWidth: 180,
        components: {
          popoverColumn
        },
        componentsOptions: {
          customOptions: {
            style: {
              color: '#0986FF',
              cursor: 'pointer',
              marginTop: '5px'
            },
            placement: 'right',
            width: '500',
            content: propertyCard,
            trigger: 'click',
            mouseleave: true,
            show: (scope) => {
              return scope.row['materiel']
            }
          }
        },
        showOverflowTooltip: true
      },
      {
        prop: 'numberInPlan',
        label: '待上架数',
        align: 'right',
        minWidth: 120,
        showOverflowTooltip: true
      },
      {
        prop: 'packingUnit',
        label: '包装单位',
        align: 'left',
        minWidth: 120,
        showOverflowTooltip: true
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
        minWidth: 120,
        showOverflowTooltip: true
      },
      {
        prop: 'sellerTeamName',
        label: '销售组织',
        showOverflowTooltip: true,
        align: 'left',
        minWidth: 160
      }
    ]

    /* 分页 */
    const detailsPagination = {
      currentChange: (val) => {
        this.getWaitingShelfProductList({
          pageSize: this.detailsPagination.pageSize,
          pageNum: val
        })
      },
      sizeChange: (val) => {
        this.getWaitingShelfProductList({
          pageNum: 1,
          pageSize: val
        })
      }
    }

    /* 已经上架明细列表（纱类） */
    const alreadyGauzeColumns = [
      {
        prop: 'batchNo',
        label: '批次号',
        showOverflowTooltip: true,
        align: 'left',
        minWidth: 150
      },
      {
        prop: 'materiel',
        label: '产品编号',
        align: 'left',
        minWidth: 180,
        components: {
          popoverColumn
        },
        componentsOptions: {
          customOptions: {
            style: {
              color: '#0986FF',
              cursor: 'pointer',
              marginTop: '5px'
            },
            placement: 'right',
            width: '500',
            // marginTop: '5px',
            content: propertyCard,
            trigger: 'click',
            mouseleave: true,
            show: (scope) => {
              return scope.row['materiel']
            }
          }
        },
        showOverflowTooltip: true
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
        prop: 'dyelot',
        label: '缸号',
        showOverflowTooltip: true,
        align: 'left',
        minWidth: 120
      },
      {
        prop: 'yarnCard',
        label: '纱牌/批号',
        showOverflowTooltip: true,
        align: 'left',
        minWidth: 120
      },
      {
        prop: 'sellerTeamName',
        label: '销售组织',
        showOverflowTooltip: true,
        align: 'left',
        minWidth: 160
      },
      {
        prop: 'numberInFact',
        label: '已上架件数',
        align: 'right',
        minWidth: 120,
        showOverflowTooltip: true
      },
      {
        prop: 'packingUnit',
        label: '包装单位',
        align: 'left',
        minWidth: 120,
        showOverflowTooltip: true
      }
    ]

    /* 已经上架明细列表（布类） */
    const alreadyClothColumns = [
      {
        prop: 'batchNo',
        label: '批次号',
        showOverflowTooltip: true,
        align: 'left',
        minWidth: 150
      },
      {
        prop: 'materiel',
        label: '产品编号',
        align: 'left',
        minWidth: 180,
        components: {
          popoverColumn
        },
        componentsOptions: {
          customOptions: {
            placement: 'right',
            style: {
              color: '#0986FF',
              cursor: 'pointer',
              marginTop: '5px'
            },
            width: '500',
            content: propertyCard,
            trigger: 'click',
            mouseleave: true,
            show: (scope) => {
              return scope.row['materiel']
            }
          }
        },
        showOverflowTooltip: true
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
        showOverflowTooltip: true,
        align: 'left',
        minWidth: 120
      },
      {
        prop: 'sellerTeamName',
        label: '销售组织',
        showOverflowTooltip: true,
        align: 'left',
        minWidth: 160
      },
      {
        prop: 'numberInFact',
        label: '已上架数',
        align: 'right',
        minWidth: 120,
        showOverflowTooltip: true
      },
      {
        prop: 'packingUnit',
        label: '包装单位',
        align: 'left',
        minWidth: 120,
        showOverflowTooltip: true
      }
    ]

    /* 新增搜索表单 */
    const detailInfoData = [
      {
        prop: 'serialNo',
        itemStyle: {
          width: '25%'
        },
        itemType: 'input',
        label: '扫描条码号',
        change: (value) => {
          if (value) {
            this.getProductDetails({
              serialNo: value,
              shelfNo: this.confirmFinishParams.shelfNo
            })
          }
        }
      },
      {
        prop: 'locationCode',
        itemStyle: {
          width: '25%'
        },
        itemType: 'select',
        label: '上架库位',
        dastaSource: [],
        rules: commonBlurReg
      },
      {
        itemType: 'operate',
        submitHandle: (params) => {
          if (params.locationCode) {
            this.alreadyDetailDataSource = this.bindLocationCode(params)
          }
        },
        submitText: '绑定库位号',
        resetHidden: true
      }
    ]

    /* 新增列表分页 */
    const detailInfoPagination = {
      currentChange: (val) => {
        this.getAlreadyShelfProductList({
          pageSize: this.detailInfoPagination.pageSize,
          pageNum: val
        })
      },
      sizeChange: (val) => {
        this.getAlreadyShelfProductList({
          pageNum: this.detailInfoPagination.currentPage,
          pageSize: val
        })
      }
    }

    /* 列表操作栏*/
    const detailInfoPopOperates = {
      label: '操作',
      fixed: 'right',
      align: 'left',
      width: 50,
      dataSource: [
        {
          label: '明细',
          isShow: true,
          permitTag: [''],
          handle: (params) => {
            this.shelfProductId = params.row.id
            this.getAlreadyShelfProductList({
              status: 1,
              shelfProductId: params.row.id,
              shelfNo: this.confirmFinishParams.shelfNo
            }).then(() => {
              this.dialogDetailInfoVisible = true
            })
          }
        }
      ]
    }

    /* 弹框明细列表（纱） */
    const detailInfoGauzeColumns = [
      {
        prop: 'locationCode',
        label: '库位',
        align: 'left',
        minWidth: 160,
        showOverflowTooltip: true
      },
      {
        prop: 'serialNo',
        label: '条码号',
        align: 'left',
        minWidth: 160,
        showOverflowTooltip: true
      },
      /*   {
          prop: 'batchNo',
          label: '批次号',
          align: 'left',
          minWidth: 120
        }, */
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
        prop: 'dyelot',
        label: '缸号',
        align: 'left',
        minWidth: 120,
        showOverflowTooltip: true
      },
      {
        prop: 'finishTime',
        label: '上架时间',
        align: 'left',
        minWidth: 160,
        showOverflowTooltip: true,
        formater: (scope) => {
          if (scope.row.finishTime) {
            return this.$utils.parseTime(scope.row.finishTime)
          }
        }
      },
      {
        prop: 'weightAvg',
        label: '重量(KG)',
        align: 'right',
        minWidth: 120,
        showOverflowTooltip: true
      },
      {
        prop: 'packingUnit',
        label: '包装单位',
        align: 'left',
        minWidth: 120,
        showOverflowTooltip: true
      },
      {
        prop: 'sellerTeamName',
        label: '销售组织',
        showOverflowTooltip: true,
        align: 'left',
        minWidth: 160
      },
      {
        prop: 'ballCountAvg',
        label: '球数',
        align: 'right',
        minWidth: 120,
        showOverflowTooltip: true
      }
    ]

    /* 弹框明细列表（布） */
    const detailInfoClothColumns = [
      {
        prop: 'locationCode',
        label: '库位',
        align: 'left',
        minWidth: 160,
        showOverflowTooltip: true
      },
      {
        prop: 'serialNo',
        label: '条码号',
        align: 'left',
        minWidth: 160,
        showOverflowTooltip: true
      },
      /*   {
          prop: 'batchNo',
          label: '批次号',
          align: 'left',
          minWidth: 120
        }, */
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
        minWidth: 120,
        showOverflowTooltip: true
      },
      {
        prop: 'finishTime',
        label: '上架时间',
        align: 'left',
        minWidth: 160,
        showOverflowTooltip: true,
        formater: (scope) => {
          if (scope.row.finishTime) {
            return this.$utils.parseTime(scope.row.finishTime)
          }
        }
      },
      {
        prop: 'weightAvg',
        label: '重量(KG)',
        align: 'right',
        showOverflowTooltip: true,
        minWidth: 120
      },
      {
        prop: 'packingUnit',
        label: '包装单位',
        align: 'left',
        minWidth: 120,
        showOverflowTooltip: true
      },
      {
        prop: 'sellerTeamName',
        label: '销售组织',
        align: 'left',
        showOverflowTooltip: true,
        minWidth: 160
      }
    ]

    const barOptions = {
      _edit: {
        type: 'primary',
        text: '上架确认',
        isHidden: () => {
          return !(
            this.$permission(['wms:stockIn:shelf:complete']) &&
            this.shelfDetail.status === 0
          )
        },
        submit: () => {
          this.$router.push({
            path: '/wms/enter-manage/putup-manage/putup-confirm',
            query: {
              shelfNo: this.shelfNo
            }
          })
        }
      },
      _print: {
        type: 'primary',
        text: '打印上架单',
        isHidden: () => {
          return !(
            this.$permission(['wms:stockIn:shelf:printShelf']) && this.shelfDetail.status === 0
          )
        },
        submit: () => {
          if (this.shelfNo) {
            this.$router.push({
              path: '/wms/enter-manage/putup-manage/print-putup-order',
              query: {
                shelfNo: this.shelfNo
              }
            })
          }
        }
      },
      _cancel: {
        type: '',
        text: '返回',
        submit: () => {
          this.$router.push('/wms/enter-manage/putup-manage')
        }
      }
    }

    return {
      active: 'waiting',
      insertActive: 'waitingProduct',
      formOtions: {
        inline: true,
        size: 'small'
      },
      /* 待上架明细*/
      waitingGauzeColumns,
      waitingClothColumns,
      detailsDataSource: [],
      detailsPagination,
      /* 已上架明细*/
      alreadyClothColumns,
      alreadyGauzeColumns,
      /* 预约信息 */
      putStorageInfoFormDatas: {},
      putStorageInfoData,
      dialogDetailInfoVisible: false,
      /* 新增弹框搜索表单 */
      detailInfoFormDatas: {},
      detailInfoData,
      detailInfoPopOperates,
      /* 弹窗添加上架明细列表 */
      detailInfoGauzeColumns,
      detailInfoClothColumns,
      detailInfoPagination,
      alreadyDetailDataSource: [],
      status: '',
      confirmFinishParams: {
        shelfNo: '',
        shelfManName: '',
        shelfManId: ''
      },
      shelfProductId: '',
      barOptions,
      shelfDetail: {}
    }
  },
  computed: {
    shelfNo() {
      return this.$route.query.shelfNo
    },
    statusShow() {
      var result = ''
      const status = this.status + ''
      if (status === '0') {
        result = '<span style="color:#FF9B02">待上架</span>'
      } else if (status === '1') {
        result = '<span style="color:#00BCC5">已上架</span>'
      }
      return result
    }
  },
  created() {
    this.status = this.$route.query['status'].toString()
    this.confirmFinishParams.shelfNo = this.$route.query['shelfNo']
    /* 详情信息 */
    this.getStockInShelfInfo({ shelfNo: this.confirmFinishParams.shelfNo })
    /* 上架列表 */
    this.getWaitingShelfProductList({
      shelfNo: this.confirmFinishParams.shelfNo
    })
  },
  methods: {
    // 货物类型
    getStatus(data) {
      let str = ''
      switch (data) {
        case '0101':
          str = '天然纤维'
          break
        case '0102':
          str = '化学纤维'
          break
        case '0103':
          str = '组合纱线'
          break
        case '0201':
          str = '坯布'
          break
        case '0202':
          str = '色布'
          break
        case '0203':
          str = '组合布'
          break
        case '0204':
          str = '花布'
          break
        default:
          break
      }
      return str
    }
    /*     async getDetailInfoDataList (params = {}) {
          const res = await getProductDetailsListData(params)
          if (this.$pub.responseValidate(res)) {
            const list = res.data.list
            if (list && list.length > 0) {
              this.alreadyDetailDataSource = list
              this.dialogDetailInfoVisible = true
            }
          }
        } */
  }
}
</script>
<style lang="scss">
.putupDetail {
  .form-box.spe {
    padding-top: 0;
    .el-table th {
      background-color: #f5f7fa;
    }
  }
}
</style>
<style lang="scss" scoped>
.putupDetail .top {
  display: flex;
  justify-content: space-between;
  .leftBox {
    font-size: 18px;
    color: #151222;
  }
  margin-bottom: 20px;
}
.dialog-footer-btns {
  text-align: center;
  padding-top: 30px;
}
.putupDetail{
  /deep/.el-table .cell{
  line-height: 16px;
}
}
</style>
