<!--
 * @Author: Do not edit
 * @Date: 2020-12-03 09:13:35
 * @LastEditTime: 2019-10-15 15:00:45
 * @LastEditors: Aurnm
 **  移库管理列表详情页面
 -->
<template>
  <div class="move-details-page">
    <header class="move-details-header">
      <span class="move-code">移库单号：{{ detailsData.moveStockId }}</span>
      <span class="move-address">{{ detailsData.stockAddress }}</span>
      <span class="move-status">{{ getStatus() }}</span>
    </header>
    <div class="move-details-first">
      <div class="move-words">移库明细</div>
      <div class="move-tabs-details">
        <el-tabs v-model="activeName" @tab-click="handleClick">
          <!-- 纱表格 -->
          <el-tab-pane name="2">
            <span slot="label" class="label tab-label">纱</span>
            <div class="table-detail detail">
              <cs-custom-table
                tooltip-effect="dark"
                :columns="columns"
                :data-source="dataSource"
                edit-type="pop"
              />
            </div>
          </el-tab-pane>
          <!-- 布 -->
          <el-tab-pane name="1">
            <span slot="label" class="tab-label">布</span>
            <div class="table-detail detail">
              <cs-custom-table
                tooltip-effect="dark"
                :columns="clothColumns"
                :data-source="clothDataSource"
                edit-type="pop"
              />
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>
      <!-- 总量、重量 -->
      <div class="totalNum">
        <span style="font-size: 16px; font-weight: bold">总计：</span>
        <span style="font-size: 14px">
          预计移库数 ：
          <span v-if="activeName === '2'" class="tipFirst">{{
            yarnAmount
          }}</span>
          <span v-if="activeName === '1'" class="tipFirst">{{
            moveAmount
          }}</span>
        </span>
      </div>
      <div />
    </div>
    <!-- 移库原因部分 -->
    <div class="move-reason">
      <cs-custom-form
        ref="remarkForm"
        class="clearfix"
        :form-datas="remarkFormDatas"
        :data-source="remarkDataSource"
        :options="remarkFormOtions"
      />
    </div>
    <!-- 按钮位置 -->
    <bottomBar :config="barOptions" />
  </div>
</template>

<script>
import popoverColumn from '@/components/cs-custom-table/columns/popover-column'
import propertyCard from '@/components/property-card/index.vue'
import { detailList, batchGet } from '../api/index.js'
import bottomBar from '@/views/wms/public/components/bottomBar.vue'
import { fetchLog } from '@/views/wms/public/fetchLog'
export default {
  components: { bottomBar },
  mixins: [fetchLog],
  data() {
    // 纱表格表头的配置信息
    const columns = [
      {
        prop: 'serialNo',
        label: '条码号',
        minWidth: '180'
      },
      {
        prop: 'materiel',
        label: '产品编号',
        minWidth: '180',
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
        }
      },
      {
        prop: 'moveOut',
        label: '移出库位',
        minWidth: '130'
      },
      {
        prop: 'moveIn',
        label: '移入库位',
        minWidth: '130'
      },
      {
        prop: 'sellerTeamName',
        label: '销售组织',
        minWidth: '120'
      },
      {
        prop: 'yarnName',
        label: '纱名',
        minWidth: '160',
        showOverflowTooltip: true
      },
      {
        prop: 'yarnProperty',
        label: '纱属性',
        minWidth: '160',
        showOverflowTooltip: true
      },
      {
        prop: 'materielType',
        label: '物料类型',
        minWidth: '80',
        formater: (scope) => {
          return this.getType(scope.row.materielType)
        }
      },
      {
        prop: 'yarnCard',
        label: '纱牌纱批',
        minWidth: '120'
      },
      {
        prop: 'dyelot',
        label: '缸号',
        minWidth: '150'
      },
      {
        prop: 'ballCount',
        label: '球数',
        minWidth: '100'
      },
      {
        prop: 'weight',
        label: '重量(KG)',
        minWidth: '80'
      }
    ]
    // 布表格表头的配置信息
    const clothColumns = [
      {
        prop: 'serialNo',
        label: '条码号',
        minWidth: '180'
      },
      {
        prop: 'materiel',
        label: '产品编号',
        minWidth: '180',
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
        }
      },
      {
        prop: 'moveOut',
        label: '移出库位',
        minWidth: '130'
      },
      {
        prop: 'moveIn',
        label: '移入库位',
        minWidth: '130'
      },
      {
        prop: 'sellerTeamName',
        label: '销售组织',
        minWidth: '120'
      },
      {
        prop: 'productInfo',
        label: '产品信息',
        showOverflowTooltip: true,
        minWidth: '160'
      },
      {
        prop: 'materielType',
        label: '物料类型',
        minWidth: '80',
        formater: (scope) => {
          return this.getType(scope.row.materielType)
        }
      },
      {
        prop: 'dyelot',
        label: '缸号',
        minWidth: '150'
      },
      {
        prop: 'yarnName',
        label: '纱名',
        minWidth: '150'
      },
      {
        prop: 'yarnProperty',
        label: '纱属性',
        minWidth: '150'
      },
      {
        prop: 'machineNo',
        label: '机台号',
        minWidth: '150'
      },
      {
        prop: 'stitchNum',
        label: '针数',
        minWidth: '150'
      },
      {
        prop: 'inchNum',
        label: '寸数',
        minWidth: '150'
      },
      // {
      //   prop: 'color',
      //   label: '成品颜色',
      //   minWidth: '150'
      // },
      // {
      //   prop: 'printing',
      //   label: '印花色号',
      //   minWidth: '150'
      // },
      {
        prop: 'weight',
        label: '重量(KG)',
        minWidth: '80'
      }
    ]
    // 移库原因部分
    const remarkDataSource = [
      {
        prop: 'moveReason',
        itemType: 'input',
        label: '移库原因',
        type: 'textarea',
        rows: 6,
        itemStyle: {
          width: '100%',
          marginRight: '10%',
          paddingTop: '10px',
          float: 'left'
        },
        trim: (value) => {
          return value
        },
        disabled: true,
        maxlength: 500
      }
    ]
    const barOptions = {
      _cancel: {
        type: '',
        text: '返回',
        submit: () => {
          this.$router.push(`/wms/inventory-manage/move-store/index`)
        }
      },
      _edit: {
        type: 'primary',
        text: '编辑',
        isHidden: () => {
          return !(
            this.$permission(['wms:inner:moveStock:modify']) &&
            this.detailsData.status === 2
          )
        },
        submit: () => {
          this.$router.push({
            path: '/wms/inventory-manage/move-store/components/create/',
            query: { moveStockId: this.$route.query.moveStockId, type: 'edit' }
          })
        }
      },
      _print: {
        type: 'primary',
        text: '打印',
        isHidden: () => {
          return !(
            this.$permission(['wms:inner:moveStock:print']) &&
            this.detailsData.status === 0
          )
        },
        submit: () => {
          this.$router.push({
            path: '/wms/inventory-manage/move-store/components/print',
            query: {
              moveStockId: this.$route.query.moveStockId,
              type: 'print'
            }
          })
        }
      },
      _confirm: {
        type: 'primary',
        text: '完成移库',
        isHidden: () => {
          return !(
            this.$permission(['wms:inner:moveStock:status:modify']) &&
            this.detailsData.status === 0
          )
        },
        submit: () => {
          // 完成移库操作
          this.$confirm('确认移库当前数据吗？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
            customClass: 'customClass'
          })
            .then(() => {
              this.getMove(this.$route.query.moveStockId)
            })
            .catch(() => {
              this.$message({
                type: 'info',
                message: '已取消移库'
              })
            })
        }
      }
    }
    return {
      barOptions,
      activeName: '2',
      formOtions: {
        size: 'small',
        inline: true
      },
      formDatas: {},
      // 纱
      columns,
      dataSource: [],
      // 布
      clothColumns,
      clothDataSource: [],
      detailsData: {},
      moveAmount: '',
      yarnAmount: '',
      /* 移库原因部分*/
      remarkFormDatas: {},
      remarkDataSource,
      remarkFormOtions: {
        inline: false,
        size: 'small',
        labelPosition: 'top'
      }
    }
  },
  created() {
    this.detailsList({ moveStockId: this.$route.query.moveStockId })
  },
  mounted() {},
  methods: {
    // 完成移库
    async getMove(moveStockId) {
      const res = await batchGet({ moveStockId: moveStockId })
      if (res.code !== 200) {
        return false
      }
      // 日志--完成移库
      this.fetchLog(
        this.getLogMessages('UPDATE', '/wms/moveStock//status/modify'),
        moveStockId,
        JSON.stringify({
          beforeText: `在'仓储管理-库内管理-移库管理', 完成移库一条记录`,
          afterCode: { moveStockId: moveStockId }
        })
      )
      this.$message({
        type: 'success',
        message: '移库成功!'
      })
      this.$router.push('/wms/inventory-manage/move-store/index')
    },
    getStatus() {
      let str = ''
      switch (this.detailsData.status) {
        case 0:
          str = '待移库'
          break
        case 1:
          str = '已移库'
          break
        case 2:
          str = '待审核'
          break
        default:
          break
      }
      return str
    },
    // 货物类型
    getType(data) {
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
    },
    handleClick(val) {
      this.detailsList({ moveStockId: this.$route.query.moveStockId })
    },
    // 列表查询
    async detailsList(id) {
      const res = await detailList(id)
      if (!res || res.code !== 200) {
        return false
      }
      this.detailsData = res.data || {}
      // 移库原因
      this.remarkFormDatas = {
        moveReason: this.detailsData.moveReason
      }
      const listData = res.data ? res.data.moveStockDetails : []
      listData.forEach((item) => {
        // 1--布 ， 2--纱
        if (item.productType === 1) {
          this.clothDataSource.push(item)
          // 去重
          const data = {}
          this.clothDataSource = this.clothDataSource.reduce((cur, next) => {
            data[next.productId]
              ? ''
              : (data[next.productId] = true && cur.push(next))
            return cur
          }, [])
          this.moveAmount = this.clothDataSource.length
        } else if (item.productType === 2) {
          this.dataSource.push(item)
          // 去重
          const data = {}
          this.dataSource = this.dataSource.reduce((cur, next) => {
            data[next.productId]
              ? ''
              : (data[next.productId] = true && cur.push(next))
            return cur
          }, [])
          this.yarnAmount = this.dataSource.length
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.move-details-page {
  .move-details-header {
    margin: 20px;
    font-family: PingFangSC-Regular;
    .move-code {
      margin-right: 20px;
      font-weight: 510;
      font-size: 18px;
      color: #151222;
    }
    .move-address {
      margin-right: 20px;
      font-size: 14px;
      color: #777777;
    }
    .move-status {
      position: absolute;
      top: 120px;
      right: 20px;
      font-family: SourceHanSansCN-Normal;
      font-size: 12px;
      color: #ff9214;
    }
  }
  // 基本信息的样式
  .move-details-first {
    padding-top: 20px;
    margin: 20px;
    padding-bottom: 20px;
    background-color: #fff;

    .move-words {
      font-size: 16px;
      padding-left: 15px;
      padding-bottom: 15px;
      border-bottom: 1px solid #dfe4ed;
    }
    .move-tabs-details {
      padding-left: 16px;
      padding-right: 16px;

      .tab-label {
        display: inline-block;
        text-align: center;
        width: 40px;
      }
      .el-tabs__header {
        margin: 0px;
      }

      .el-tabs__nav-wrap::after {
        height: 1px;
      }
      .table-detail {
        .el-table th {
          background-color: #f5f7fa;
        }
      }
    }

    .totalNum {
      padding-left: 16px;
      color: #666666;
      margin: 24px 0 12px;
      .tipFirst {
        margin-right: 15px;
        color: #ff9b02;
        font-size: 16px;
      }
      .tipSecond {
        color: #ff9b02;
        font-size: 16px;
      }
    }
  }
  // 移库原因部分
  .move-reason {
    margin: 20px;
    // padding: 20px 20px;
    padding-left: 20px;
    padding-right: 20px;
    background-color: #fff;
    font-family: PingFangSC-Regular;
    padding-bottom: 40px;

    .reason-p {
      padding-top: 20px;
      font-size: 16px;
      font-weight: bold;
      color: #666666;
    }
    .reason-text {
      width: 99.9%;
      color: #666666;
      margin-bottom: 20px;
      border: 1px solid #666666;
      font-family: PingFangSC-Regular;
    }
  }
  // 按钮的样式
  .button-groups {
    display: flex;
  }
  .button-groups {
    bottom: 0;
    z-index: 1000;
    padding: 10px;
    width: 100%;
    background: #fff;
    position: fixed;
    border-top: 1px solid #ecf0f3;
    .btn-all {
      position: relative;
      left: 40%;
    }
  }
}

.span {
  display: inline-block;
  text-align: center;
  width: 200px;
}
</style>
