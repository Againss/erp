<template>
  <div id="printOrder" class="list">
    <div class="search">
      <cs-custom-form
        ref="searchForm"
        :data-source="searchData"
        :options="formOptions"
        :form-datas="searchFormDatas"
      />
    </div>

    <div class="bk" style="position: relative">
      <div v-if="activeName === 'W' && (nowVersion === lastVersion) && $permission(['pd:pdPrintOrder:submit'])" class="button spe">
        <el-button
          size="small"
          type="primary"
          @click="saveBtn"
        >{{ selectUuids.length > 1 ? '批量提交' : '提交' }}</el-button>
      </div>
      <div class="tabs">
        <el-tabs v-model="activeName" @tab-click="handleClick">
          <el-tab-pane v-for="(i, index) in tabs" :key="index" :name="i.value">
            <span slot="label"> {{ `${i.label} (${i.count})` }}</span>
          </el-tab-pane>
        </el-tabs>
      </div>
      <div class="main">
        <transitionWarp
          height="256px"
          width="288px"
          :is-show="showMore"
          class-name="print-order-transition"
          @isShow="
            (val) => {
              showMore = val;
            }
          "
        >
          <!-- 列表 -->
          <template v-slot:left>
            <div class="leftBox">
              <div
                v-if="getUuid&&showMore"
                class="close-right"
                @click="showMore = !showMore"
              >
                <i
                  :class="{
                    'el-icon-arrow-right': showMore,
                    'padding-left':'10px'
                  }"
                />
              </div>
              <div
                class="detail"
                :class="{ 'page-table': !showMore }"
                :style="{
                  height: !showMore ? '100%' : 'calc((100vh - 256px}))',
                  'padding-left':'10px'
                }"
              >
                <cs-custom-table
                  :key="activeName"
                  :max-height="!showMore ? '100%' : ' calc((100vh - 350px}))'"
                  :height="!showMore ? null : 'calc((100vh - 330px}))'"
                  :table-footer="tableFooter"
                  :highlight-current-row="true"
                  :table-scrollx="true"
                  :row-style="{ cursor: 'pointer' }"
                  class="detail detail-table"
                  :columns="columns"
                  :pagination="pagination"
                  :data-source="dataSource"
                  @row-click="rowClick"
                  @selection-change="selectArr"
                />
              </div>
            </div>
          </template>
          <!-- 详情 -->
          <template v-slot:right>
            <div class="rightBox">
              <div class="clearfix" style="position: relative">
                <div class="title">
                  印花订单详情
                  <el-select
                    v-model="detailFormDatas.version"
                    placeholder="请选择"
                    @change="changeVersion"
                  >
                    <el-option
                      v-for="item in versionOptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    />
                  </el-select>
                </div>
                <div class="button spe">
                  <buttonBar :config="barConfig" :wipe-class="true" />
                </div>
              </div>
              <cs-custom-form
                :data-source="detailData"
                :options="detailFormOptions"
                :form-datas="detailFormDatas"
              />
            </div>
          </template>
        </transitionWarp>
      </div>
    </div>
    <!-- 弹框 -->
    <cs-custom-pop ref="servePop" :options="requisitionOptions" />
  </div>
</template>

<script>
import transitionWarp from '@/components/transition-wrap/index.vue'
import detailBranch from './components/detailBranch.vue'
import * as api from './api/index.js'
import { inputFilter } from '@/views/processing-manage/public/index.js'
import buttonBar from '@/components/button-bar/index.vue'
import { deepClone } from '@/utils'
import tableSummation from '@/components/table-summation/index.vue'
import { setOrderFun } from '../public/mou'
export default {
  components: { buttonBar, transitionWarp },
  mixins: [setOrderFun],
  data() {
    var validateQty = (rule, value, callback) => {
      const i = rule.field.split('.')[1]
      const row = this.validateObj.table[i]
      const sum = row.nonAllotQty || 0
      if (row.planQty > sum) {
        callback(new Error('调拨量不能大于未调拨量'))
      } else if (row.planQty > row.allotQty) {
        callback(new Error('调拨量不能大于色布需求量'))
      } else {
        this.sumObj[`_${'planQty'}`].num = this.getSum('planQty')
        callback()
      }
    }
    const itemStyle = { width: '33%' }
    const searchData = {
      _printNo: {
        prop: 'printNo',
        itemType: 'input',
        label: '印花单号',
        placeholder: '请输入印花单号',
        clearable: true,
        itemStyle
      },
      _customerName: {
        prop: 'customerName',
        itemType: 'input',
        label: '客户',
        placeholder: '请输入客户',
        clearable: true,
        itemStyle
      },
      _salesTeamName: {
        prop: 'salesTeamName',
        itemType: 'input',
        label: '销售组织',
        placeholder: '请输入销售组织',
        clearable: true,
        itemStyle
      },
      _submitTime: {
        prop: 'submitTime',
        itemType: 'date',
        type: 'daterange',
        label: '印花交期',
        startPlaceholder: '开始日期',
        endPlaceholder: '结束日期',
        format: 'yyyy-MM-dd',
        valueFormat: 'timestamp',
        defaultTime: ['00:00:00', '23:59:59'],
        itemStyle
      },
      _supplierName: {
        prop: 'supplierName',
        itemType: 'input',
        label: '印花厂',
        placeholder: '请输入印花厂',
        clearable: true,
        itemStyle
      },
      _pmUserName: {
        prop: 'pmUserName',
        itemType: 'input',
        label: '跟单人',
        placeholder: '请输入跟单人',
        clearable: true,
        itemStyle
      },
      _operate: {
        itemType: 'operate',
        submitText: '查询',
        submitHandle: (params) => {
          const p = deepClone(params)
          // 织单交期
          if (p.hasOwnProperty('deliveryDate') && p.deliveryDate) {
            p.deliveryDateStart = p.deliveryDate[0]
            p.deliveryDateEnd = p.deliveryDate[1]
          }
          // 提交时间
          if (p.hasOwnProperty('submitTime') && p.submitTime) {
            p.startDateTime = p.submitTime[0]
            p.endDateTime = p.submitTime[1]
          }
          delete p.deliveryDate
          delete p.submitTime

          this.searchParams = p
          this.pagination.pageNum = 1
          this.pagination.pageSize = 20
          this.getList()
        },
        resetHandle: () => {
          this.searchFormDatas = {}
          this.searchParams = {}
        }
      }
    }
    const columns = {
      _selection: {
        minWidth: '50',
        type: 'selection',
        isShow: () => {
          return this.activeName === 'W'
        }
      },
      _index: {
        minWidth: '50',
        label: '序号',
        formater: (scope) => {
          return scope.$index + 1
        }
      },
      _knitOrderNo: {
        prop: 'printNo',
        label: '印花订单号',
        minWidth: 160,
        showOverflowTooltip: true,
        handle: (scope) => {}
      },
      _createdTime: {
        prop: 'createdTime',
        label: '订单创建日期',
        minWidth: 140,
        isShow: () => {
          return this.activeName === 'A'
        },
        // minWidth: '150',
        showOverflowTooltip: true,
        handle: (scope) => {},
        formater: (scope) => {
          return scope.row.createdTime ? this.$filters.parseTime(scope.row.createdTime + '', '{y}-{m}-{d} {h}:{i}') : '-'
        }
      },
      _dyeQty: {
        prop: 'dyeQty',
        label: '色布数量(KG)',
        minWidth: 140,
        isShow: () => {
          return this.activeName === 'A'
        },
        align: 'right',
        // minWidth: '150',
        showOverflowTooltip: true,
        handle: (scope) => {}
      },
      _planQty: {
        prop: 'planQty',
        label: '印花布数量(KG)',
        minWidth: 140,
        align: 'right',
        isShow: () => {
          return this.activeName === 'A'
        },
        // minWidth: '150',
        showOverflowTooltip: true,
        handle: (scope) => {}
      },
      _planDelivery: {
        prop: 'planDelivery',
        label: '印花计划交期',
        minWidth: 140,
        isShow: (scope) => {
          return this.activeName === 'A'
        },
        showOverflowTooltip: true,
        formater: (scope) => {
          return scope.row.planDelivery ? this.$filters.parseTime(scope.row.planDelivery + '', '{y}-{m}-{d} {h}:{i}') : '-'
        }
      },
      _printDelivery: {
        prop: 'printDelivery',
        label: '印花交期',
        minWidth: 140,
        isShow: (scope) => {
          return this.activeName === 'A'
        },
        showOverflowTooltip: true,
        formater: (scope) => {
          return scope.row.printDelivery ? this.$filters.parseTime(scope.row.printDelivery + '', '{y}-{m}-{d} {h}:{i}') : '-'
        }
      },
      _customerName: {
        prop: 'customerName',
        label: '客户',
        isShow: (scope) => {
          return this.activeName !== 'A'
        },
        minWidth: 140,
        showOverflowTooltip: true,
        formater: (scope) => {
          return scope.row.customer ? scope.row.customer.label : ''
        }
      },
      _supplierName: {
        prop: 'supplier',
        label: '印花厂',
        minWidth: 140,
        showOverflowTooltip: true,
        formater: (scope) => {
          return scope.row.supplier ? scope.row.supplier.label : ''
        }
      },
      _pmUserName: {
        prop: 'pmUser',
        label: '跟单人',
        minWidth: 140,
        isShow: (scope) => {
          return this.activeName === 'A'
        },
        showOverflowTooltip: true,
        formater: (scope) => {
          return scope.row.pmUser ? scope.row.pmUser.label : ''
        }
      },
      _salesTeam: {
        prop: 'salesTeam',
        label: '销售组织',
        minWidth: 140,
        showOverflowTooltip: true,
        formater: (scope) => {
          return scope.row.salesTeam ? scope.row.salesTeam.label : ''
        }
      },
      _status: {
        prop: 'status',
        label: '状态',
        minWidth: 120,
        isShow: (scope) => {
          return this.activeName === 'A'
        },
        showOverflowTooltip: true,
        formater: (scope) => {
          return this.getStatus(scope.row.status)
        }
      }
    }
    // 状态S待提交M已提交R已撤回F已完工C已取消
    const tabs = {
      _total: { label: '全部', value: 'A', count: 0 },
      _W: { label: '待提交', value: 'W', count: 0 },
      _S: { label: '已提交', value: 'S', count: 0 },
      _R: { label: '已撤回', value: 'R', count: 0 },
      _F: { label: '已完工', value: 'F', count: 0 },
      _C: { label: '已取消', value: 'C', count: 0 }
    }
    const detailStyle = {
      width: '32%',
      height: '32px',
      'line-height': '32px',
      'margin': '0!important',
      'padding-left': '30px'
    }
    const detailData = {
      _printNo: {
        prop: 'printNo',
        itemType: 'itemview',
        label: '印花单号：',
        itemStyle: { width: '32%',
          height: '32px',
          'line-height': '32px',
          'margin': '0!important', 'padding-left': '20px' }
      },
      _supplierName: {
        prop: 'supplier',
        itemType: 'itemview',
        label: '印花厂：',
        itemStyle: detailStyle,
        renderContent(value, options, form, formDatas, setFormDatas, scope) {
          return value ? value.label : ''
        }
      },
      _createdBy: {
        prop: 'createdBy',
        itemType: 'itemview',
        label: '排厂人员：',
        itemStyle: detailStyle
      },
      _planTime: {
        prop: 'planTime',
        itemType: 'itemview',
        label: '排厂时间：',
        itemStyle: { width: '32%',
          height: '32px',
          'line-height': '32px',
          'margin': '0!important',
          'padding-left': '20px' },
        renderContent: (
          value,
          options,
          form,
          formDatas,
          setFormDatas,
          scope
        ) => {
          if (value) {
            return `<div class='yarn-style'>${
              value
                ? this.$filters.parseTime(value + '', '{y}-{m}-{d} {h}:{i}')
                : '-'
            }</div>`
          } else {
            return ''
          }
        }
      },
      // 状态S待提交M已提交R已撤回F已完工C已取消
      _status: {
        prop: 'status',
        itemType: 'itemview',
        label: '印花订单状态：',
        itemStyle: detailStyle,
        renderContent: (value, options, form, formDatas, setFormDatas, scope) => {
          if (value) {
            return this.getStatus(value)
          } else {
            return ''
          }
        }
      },
      _pmUserName: {
        prop: 'pmUser',
        itemType: 'itemview',
        label: '跟单人员：',
        itemStyle: detailStyle,
        renderContent(value, options, form, formDatas, setFormDatas, scope) {
          return value ? value.label : ''
        }
      },
      _submitUserName: {
        prop: 'option',
        itemType: 'itemview',
        label: '提交人员：',
        itemStyle: { width: '32%',
          height: '32px',
          'line-height': '32px',
          'margin': '0!important', 'padding-left': '20px' },
        isShow: () => {
          return this.getStatusInfo === 'S'
        },
        renderContent(value, options, form, formDatas, setFormDatas, scope) {
          return value ? value.label : ''
        }
      },
      _submitTime: {
        prop: 'optionUserTime',
        itemType: 'itemview',
        label: '提交时间：',
        itemStyle: detailStyle,
        isShow: () => {
          return this.getStatusInfo === 'S'
        },
        renderContent: (val) => {
          return this.$filters.parseTime(val, '{y}-{m}-{d} {h}:{i}')
        }
      },
      _recallUserName: {
        prop: 'option',
        itemType: 'itemview',
        label: '撤回人员：',
        itemStyle: { width: '32%',
          height: '32px',
          'line-height': '32px',
          'margin': '0!important', 'padding-left': '20px' },
        isShow: () => {
          return this.getStatusInfo === 'R'
        },
        renderContent(value, options, form, formDatas, setFormDatas, scope) {
          return value ? value.label : ''
        }
      },
      _recallUserTime: {
        prop: 'optionUserTime',
        itemType: 'itemview',
        label: '撤回时间：',
        itemStyle: detailStyle,
        isShow: () => {
          return this.getStatusInfo === 'R'
        },
        renderContent: (val) => {
          return this.$filters.parseTime(val, '{y}-{m}-{d} {h}:{i}')
        }
      },
      _finishUserName: {
        prop: 'option',
        itemType: 'itemview',
        label: '完工人员：',
        itemStyle: { width: '32%',
          height: '32px',
          'line-height': '32px',
          'margin': '0!important', 'padding-left': '20px' },
        isShow: () => {
          return this.getStatusInfo === 'F'
        },
        renderContent(value, options, form, formDatas, setFormDatas, scope) {
          return value ? value.label : ''
        }
      },
      _finishUserTime: {
        prop: 'optionUserTime',
        itemType: 'itemview',
        label: '完工时间：',
        itemStyle: detailStyle,
        isShow: () => {
          return this.getStatusInfo === 'F'
        },
        renderContent: (val) => {
          return this.$filters.parseTime(val, '{y}-{m}-{d} {h}:{i}')
        }
      },
      _cancelUserName: {
        prop: 'option',
        itemType: 'itemview',
        label: '取消人员：',
        itemStyle: { width: '32%',
          height: '32px',
          'line-height': '32px',
          'margin': '0!important', 'padding-left': '20px' },
        isShow: () => {
          return this.getStatusInfo === 'C'
        },
        renderContent(value, options, form, formDatas, setFormDatas, scope) {
          return value ? value.label : ''
        }
      },
      _cancelUserTime: {
        prop: 'optionUserTime',
        itemType: 'itemview',
        label: '取消时间：',
        itemStyle: detailStyle,
        isShow: () => {
          return this.getStatusInfo === 'C'
        },
        renderContent: (val) => {
          return this.$filters.parseTime(val, '{y}-{m}-{d} {h}:{i}')
        }
      },
      _planQty1: {
        prop: 'planQty',
        itemType: 'itemview',
        label: '印花布总数1：',
        isShow: () => {
          return this.getStatusInfo === 'S' || this.getStatusInfo === 'R' || this.getStatusInfo === 'F' || this.getStatusInfo === 'C'
        },
        itemStyle: { width: '32%',
          height: '32px',
          'line-height': '32px',
          'margin': '0!important', 'padding-left': '30px' }
      },
      _planQty: {
        prop: 'planQty',
        itemType: 'itemview',
        label: '印花布总数：',
        isShow: () => {
          return this.getStatusInfo === 'W'
        },
        itemStyle: { width: '32%',
          height: '32px',
          'line-height': '32px',
          'margin': '0!important', 'padding-left': '20px' }
      },
      _productDetails: {
        prop: 'productDetails',
        itemStyle: { width: '100%' },
        components: { detailBranch },
        componentsOptions: { data: [] }
      }
    }
    const requisitionOptions = {
      itemType: 'dialog',
      visible: false,
      title: '色布调拨通知',
      width: '1200px',
      formDatas: {},
      formOptions: {
        className: 'print-order-requisition detail',
        popError: true,
        syncDataHandle: (c) => {
          this.validateObj = deepClone(c)
        }
      },
      ok: () => {
        this.validateSubmit()
        // this.requisitionOptions.visible = false
        // this.allotConfirm()
      },
      cancel: () => {
        this.requisitionOptions.visible = false
      },
      close: () => {
        this.requisitionOptions.visible = false
      },
      content: {
        _table: {
          className: 'detail',
          itemType: 'table-form',
          dataSource: [],
          prop: 'table',
          columns: {
            _index: {
              minWidth: '50',
              label: '序号',
              formater: (scope) => {
                return (
                  (this.pagination.currentPage - 1) * this.pagination.pageSize +
                  (scope.$index + 1)
                )
              }
            },
            _skuId: {
              prop: 'skuId',
              label: '色布编码',
              // minWidth: '150',
              showOverflowTooltip: true,
              handle: (scope) => {}
            },
            _warehouse: {
              prop: 'warehouse',
              label: '仓库',
              // minWidth: '150',
              showOverflowTooltip: true,
              handle: (scope) => {},
              formater: (scope) => {
                return scope.row.warehouse ? scope.row.warehouse.label : ''
              }
            },
            _cloth: {
              prop: 'cloth',
              label: '布类',
              // minWidth: '150',
              showOverflowTooltip: true,
              handle: (scope) => {},
              formater: (scope) => {
                return scope.row.cloth ? scope.row.cloth.label : ''
              }
            },
            _allotQty: {
              prop: 'allotQty',
              label: '色布需求量(KG)',
              align: 'right',
              // minWidth: '150',
              showOverflowTooltip: true,
              handle: (scope) => {}
            },
            _planQty: {
              prop: 'planQty',
              label: '调拨量(KG)',
              align: 'right',
              // minWidth: '150',
              showOverflowTooltip: true,
              editOptions: {
                itemType: 'input',
                labelWidth: '0',
                size: 'mini',
                itemProp: 'planQty',
                trim: (val) => {
                  return inputFilter(val)
                },
                rules: [
                  {
                    trigger: ['change'],
                    validator: validateQty
                  }
                ]
              },
              handle: (scope) => {},
              formater: (scope) => {
                this.$set(scope.row, 'edit', true)
                return scope.row.planQty
              }
            },
            _sendDelivery: {
              prop: 'sendDelivery',
              label: '计划送布期',
              minWidth: '155',
              showOverflowTooltip: true,
              editOptions: {
                itemType: 'date',
                labelWidth: '0',
                size: 'mini',
                itemProp: 'sendDelivery',
                rules: [
                  {
                    trigger: ['change']
                  }
                ]
              },
              handle: (scope) => {},
              formater: (scope) => {
                return scope.row.sendDelivery
                  ? this.$filters.parseTime(
                    scope.row.sendDelivery + '',
                    '{y}-{m}-{d}'
                  )
                  : '-'
              }
            },
            _planAllotQty: {
              prop: 'planAllotQty',
              label: '已调拨量(KG)',
              align: 'right',
              // minWidth: '150',
              showOverflowTooltip: true
            },
            _nonAllotQty: {
              prop: 'nonAllotQty',
              label: '未调拨量(KG)',
              align: 'right',
              // minWidth: '150',
              showOverflowTooltip: true,
              handle: (scope) => {}
            }
          }
        },
        _sum: {
          dataSource: [],
          prop: 'sum',
          components: {
            tableSummation
          },
          componentsOptions: {
            _planQty: {
              title: '调拨总数(KG):',
              num: 0,
              formater: (val) => {
                var sum = 0
                this.validateObj.table.forEach((i) => {
                  sum = this.$utils.getFloat(sum, 2) + this.$utils.getFloat(i.planAllotQty, 2)
                  sum = this.$utils.getFloat(sum, 2)
                })
                return sum
              }
            },
            _nonAllotQty: {
              title: '未调拨总数(KG):',
              num: 0,
              formater: (val) => {
                var sum = 0
                this.requisitionOptions.formDatas &&
                  this.requisitionOptions.formDatas.table &&
                  this.requisitionOptions.formDatas.table.forEach((i) => {
                    sum = this.$utils.getFloat(sum, 2) + this.$utils.getFloat(i.nonAllotQty, 2)
                    sum = this.$utils.getFloat(sum, 2)
                  })
                return sum
              }
            }
          }
        }
      },
      popDialogHandle: () => {
        this.servePopDialogHandle()
      }
      // component: PopDialog
    }
    // 状态S待提交M已提交R已撤回F已完工C已取消
    const barConfig = {
      _allot: {
        text: '色布调拨通知',
        buttonClass: 'sub-main',
        isShow: () => {
          return this.getStatusInfo === 'S' && (this.nowVersion === this.lastVersion) && this.$permission(['pd:pdPrintOrder:material:detail:submit'])
        },
        submit: () => {
          this.getRequisition()
          this.requisitionOptions.visible = true
        }
      },
      _back: {
        text: '撤回',
        buttonClass: 'sub-main',
        isShow: () => {
          return this.getStatusInfo === 'S' && (this.nowVersion === this.lastVersion) && this.$permission(['pd:pdPrintOrder:withdraw'])
        },
        submit: () => {
          this.reBackBtn()
        }
      },
      _finished: {
        text: '完工',
        buttonClass: 'sub-main',
        isShow: () => {
          return this.getStatusInfo === 'S' && (this.nowVersion === this.lastVersion) && this.$permission(['pd:pdPrintOrder:finish'])
        },
        submit: () => {
          this.$confirm('确认 完工 该订单？', '提示', {
            type: 'warning',
            customClass: 'WeavingOrder'
          })
            .then(() => {
              this.finishedBtn()
            })
            .catch(() => {})
        }
      },
      _print: {
        text: '打印预览',
        buttonClass: 'sub-main',
        isShow: () => {
          return (this.getStatusInfo === 'S' || this.getStatusInfo === 'F') && (this.nowVersion === this.lastVersion)
        },
        submit: () => {
          this.printPreview()
        }
      },
      _cancel: {
        text: '取消',
        buttonClass: 'sub-main',
        isShow: () => {
          return (this.getStatusInfo === 'S' || this.getStatusInfo === 'R') && (this.nowVersion === this.lastVersion) && this.$permission(['pd:pdPrintOrder:cancel'])
        },
        submit: () => {
          this.$confirm('确认 取消 该订单？', '提示', {
            type: 'warning',
            customClass: 'WeavingOrder'
          })
            .then(() => {
              this.closeBtn()
            })
            .catch(() => {})
        }
      }
    }
    const pagination = {
      small: false,
      layout: 'total, prev, pager, next,sizes, jumper',
      currentChange: (val) => {
        this.pagination.pageNum = val
        this.getList()
      },
      sizeChange: (val) => {
        this.pagination.pageSize = val
        this.pagination.pageNum = 1
        this.pagination.currentPage = 1
        this.getList()
      }
    }
    const tableFooter = {
      leftClass: 'weaving-order-pagination',
      span: undefined,
      component: tableSummation,
      componentOptions: {
        config: {
          _num: {
            title: '数量:',
            num: 0
          }
        }
      }
    }
    return {
      validateObj: null,
      versionOptions: [],
      showMore: false,
      tableFooter,
      pagination,
      barConfig,
      requisitionOptions,
      columns,
      getUuid: '',
      pdPrintAllotDetailObj: {},
      printNo: '',
      dataSource: [],
      searchData,
      formOptions: {
        size: 'small',
        layout: true,
        inline: true
      },
      searchFormDatas: {},
      searchParams: {},
      activeName: 'W',
      tabs,
      detailData,
      detailFormOptions: {
        inline: true,
        className: 'print-order-detail-form'
      },
      detailFormDatas: {
        knitOrderNo: 1
      },
      totalObj: {},
      selectUuids: [],
      getStatusInfo: '',
      lastVersion: 0,
      nowVersion: 0
    }
  },
  computed: {
    sumObj() {
      return this.requisitionOptions.content._sum.componentsOptions
    }
  },
  watch: {
    showMore(val) {
      if (val) {
        this.tableFooter.span = 24
        this.pagination.layout = 'prev, pager, next'
      } else {
        this.tableFooter.span = undefined
        this.pagination.layout = 'total, prev, pager, next,sizes, jumper'
      }
      this.pagination.small = val
    }
  },
  created() {
    this.getList()
    // this.listTotalNum()
    this.activeName = 'W'
  },
  methods: {
    // tab页签切换
    async handleClick() {
      await this.getList({}, false)
      // 切换页签，自动获取每个页签下第一条数据的详情
      // await this.listTotalNum()
      this.detailFormDatas = {}
      this.detailData._productDetails.componentsOptions.data = []
      this.showMore = false
    },
    changeVersion(val) {
      this.getInfo({ printNo: this.printNo, version: val })
    },
    // 获取详情
    rowClick(row) {
      this.showMore = true
      this.printNo = row.printNo
      this.getUuid = row.uuid
      const obj = {}
      obj.taskNo = row.taskNo
      obj.printNo = row.printNo
      obj.version = row.version
      this.pdPrintAllotDetailObj = obj
      this.getInfo({ uuid: row.uuid, version: row.version, printNo: row.printNo })
    },
    selectArr(row) {
      this.selectUuids = row
    },
    async getList() {
      this.getUuid = ''
      this.showMore = false
      const res = await api.list({
        pageSize: this.pagination.pageSize || 20,
        pageNum: this.pagination.pageNum || 1,
        ...this.searchParams,
        status: this.activeName === 'A' ? '' : this.activeName
      })
      if (res.code === 200) {
        this.dataSource = res.data && res.data.list || []
        this.pagination = {
          ...this.pagination,
          dataTotal: res.data.total || 0,
          currentPage: res.data.pageNum,
          pageNum: res.data.pageNum,
          pageSize: res.data.pageSize
        }
        const amountRes = await api.listTotal({
          pageSize: this.pagination.pageSize || 20,
          pageNum: this.pagination.pageNum || 1,
          ...this.searchParams,
          status: this.activeName === 'A' ? '' : this.activeName
        })
        if (amountRes.code === 200) {
          for (var i in amountRes.data) {
            this.tabs[`_${i}`] ? (this.tabs[`_${i}`].count = amountRes.data[i]) : ''
          }
          this.tabs._total.count = amountRes.data.total || 0
          this.tableFooter.componentOptions.config._num.num = amountRes.data.amount || 0
        }
      } else {
        this.$message({
          message: res.message,
          type: 'error'
        })
      }
    },
    // 获取详情
    async getInfo(params) {
      const obj = {}
      obj.printNo = params.printNo
      obj.version = params.version
      const res = await api.info(obj)
      if (res.code === 200) {
        this.detailFormDatas = res.data || {}
        this.getStatusInfo = res.data.status
        this.detailData._productDetails.componentsOptions.data = res.data && res.data.pdPrintOrderDetailRespList
        const comData = this.detailData._productDetails.componentsOptions.data || []
        comData.forEach((item) => {
          // 写死测试，后端还没返回
          item.colorPath = 'https://oss-exhibition.sfabric.com/customerOrder/so_print/dT0xMTgwOTkxNjA3LDI2NDU3NTgzMDQmZm09MjYmZ3A9MA==_1608863703069-IxxEGE.jpg'
        })
        this.versionOptions =
          (res.data.versionList &&
            res.data.versionList.length &&
            res.data.versionList.map((i) => ({
              label: `V${i}`,
              value: i
            }))) ||
          []
        this.nowVersion = params.version
        this.lastVersion = res.data.versionList.pop()
      } else {
        this.$message({
          message: res.message,
          type: 'error'
        })
      }
    },
    getSum(property) {
      var sum = 0
      this.validateObj &&
        this.validateObj.table &&
        this.validateObj.table.length &&
        this.validateObj.table.forEach((i) => {
          sum = sum + this.$utils.getFloat(i[property] || 0, 2)
          // sum = sum + parseFloat(i[property] || 0)
        })
      return sum || 0
    },
    diff(arr1, arr2) {
      var set1 = new Set(arr1)
      var set2 = new Set(arr2)
      var subset = []
      for (const item of set1) {
        if (!set2.has(item)) {
          subset.push(item)
        }
      }
      return subset
    },
    validateSubmit() {
      const table0 = deepClone(this.validateObj.table)
      // 纵向相同的sku会有多行，然后按照sku分组，组内调拨+配纱 < 单一sku的需求
      var skuArr = []
      const fun = (table) => {
        var out = false
        for (var i = 0; i < table.length; i++) {
          if (!out) {
            var sameArr =
              table.filter((k, p) =>
                k.skuId === table[i].skuId && k.index !== table[i].index
              ) || []
            var diffArr = []
            if (sameArr.length) {
              skuArr.push([...sameArr, table[i]])
              diffArr = this.diff(table, [...sameArr, table[i]])
            } else {
              skuArr.push([table[i]])
              diffArr = this.diff(table, [table[i]])
            }
            if (diffArr.length && diffArr.length > 1) {
              fun(diffArr)
            } else if (diffArr.length && diffArr.length === 1) {
              skuArr.push(diffArr)
              out = true
            } else {
              out = true
            }
          }
          break
        }
      }
      fun(table0) // sku分组
      for (var k = 0; k < skuArr.length; k++) {
        var obj = skuArr[k]
        let tatalll = 0
        const pickFlag = []
        obj.forEach((val, ind) => {
          tatalll = parseFloat(tatalll) + parseFloat(val.planQty)// 相同skuid将输入值汇总
          if ((val.planQty && !val.sendDelivery) || (!val.planQty && val.sendDelivery)) {
            pickFlag.push(true)
          }
        })
        if (pickFlag.length) {
          this.$message({
            message: `请同时填写调拨量与计划送布期信息`,
            type: 'warning'
          })
          return
        }
        if (tatalll > obj[0].allotQty) {
          this.$message({
            message: `色布编码${obj[0].skuId}的调拨量总计超过色布需求量`,
            type: 'warning'
          })
          return
        }
      }
      const arr = []
      for (var j = 0; j < this.validateObj.table.length; j++) {
        if (!this.validateObj.table[j].planQty && !this.validateObj.table[j].sendDelivery) {
          arr.push(true)
        }
      }
      if (arr.length === this.validateObj.table.length) {
        this.$message({
          message: `请至少填写一条数据再提交!`,
          type: 'error'
        })
        return
      }
      this.allotConfirm() // 校验成功
    },
    // 调拨通知单确定
    async allotConfirm(params) {
      let arr = deepClone(this.validateObj.table) || []
      arr = arr.filter(val => parseFloat(val.planQty) && val.sendDelivery)
      arr.forEach((val, index) => {
        var date = new Date(val.sendDelivery)
        val.sendDelivery = date.getTime()
      })
      const res = await api.allotConfirm({ uuid: this.getUuid, pdOrderAllotDetailReqList: arr })
      this.$message({
        message: '调拨成功!',
        type: res.code === 200 ? 'success' : 'error'
      })
      if (res.code === 200) {
        this.requisitionOptions.visible = false
        this.$store.dispatch('app/fetchParamsLog', {
          opratorType: 'INSERT',
          api: '/processingMgr/pdPrintAllotDetail/save',
          description: {
            beforeText: `在'加工管理-印花-印花订单中新增订单 ${this.getUuid}原料调拨`,
            beforeCode: arr
          },
          appId: 'processingMgr'
        })
      }
    },
    // 调拨通知单数据
    async getRequisition(params) {
      const res = await api.allot({
        taskNo: this.pdPrintAllotDetailObj.taskNo,
        printNo: this.pdPrintAllotDetailObj.printNo,
        version: this.pdPrintAllotDetailObj.version
      })
      if (res.code === 200) {
        res.data.pdAllotOrderChildRespList && res.data.pdAllotOrderChildRespList.forEach((n, i) => {
          n.index = i
        })
        this.requisitionOptions.formDatas = { table: res.data.pdAllotOrderChildRespList || {}}
        this.requisitionOptions.visible = true
      } else {
        this.$message({
          message: res.message,
          type: 'error'
        })
      }
    },
    // 提交按钮
    async saveBtn() {
      if (this.selectUuids.length < 1) {
        this.$message({
          message: '请选择数据提交！',
          type: 'warning'
        })
        return
      }
      const obj = {}
      const arr = []
      this.selectUuids.forEach((val, index) => {
        arr.push(val.uuid)
      })
      obj.uuidList = arr
      const res = await api.save(obj)
      if (res.code === 200) {
        this.activeName = 'S'
        this.pagination = {
          pageNum: 1,
          pageSize: res.data.pageSize
        }
        await this.getList({}, false)
        this.$store.dispatch('app/fetchParamsLog', {
          opratorType: 'UPDATE',
          api: '/processingMgr/pdPrintOrder/submit',
          description: {
            beforeText: `在'加工管理-印花-印花订单中修改订单 ${arr}状态`,
            afterText: { status: 'S' },
            beforeCode: { status: 'W' }
          },
          appId: 'processingMgr'
        })
        // await this.listTotalNum()
        this.showMore = false
        this.detailFormDatas = {}
        this.detailData._productDetails.componentsOptions.data = []
      }
    },
    // 撤回
    async reBackBtn() {
      const obj = {}
      const arr = []
      arr.push(this.getUuid)
      obj.uuidList = arr
      const res = await api.reBack(obj)
      if (res.code === 200) {
        this.activeName = 'R'
        this.pagination = {
          pageNum: 1,
          pageSize: res.data.pageSize
        }
        await this.getList({}, false)
        this.$store.dispatch('app/fetchParamsLog', {
          opratorType: 'UPDATE',
          api: '/processingMgr/pdPrintOrder/recall',
          description: {
            beforeText: `在'加工管理-印花-印花订单中修改订单 ${arr}状态`,
            afterText: { status: 'C' },
            beforeCode: { status: 'R' }
          },
          appId: 'processingMgr'
        })
        // await this.listTotalNum()
        this.showMore = false
        this.detailFormDatas = {}
        this.detailData._productDetails.componentsOptions.data = []
      }
    },
    // 完工
    async finishedBtn() {
      const obj = {}
      const arr = []
      arr.push(this.getUuid)
      obj.uuidList = arr
      const res = await api.finish(obj)
      if (res.code === 200) {
        this.activeName = 'F'
        this.pagination = {
          pageNum: 1,
          pageSize: res.data.pageSize
        }
        await this.getList({}, false)
        this.$store.dispatch('app/fetchParamsLog', {
          opratorType: 'UPDATE',
          api: '/processingMgr/pdPrintOrder/finish',
          description: {
            beforeText: `在'加工管理-印花-印花订单中修改订单 ${arr}状态`,
            afterText: { status: 'F' },
            beforeCode: { status: 'R' }
          },
          appId: 'processingMgr'
        })
        // await this.listTotalNum()
        this.showMore = false
        this.detailFormDatas = {}
        this.detailData._productDetails.componentsOptions.data = []
      }
    },
    // 取消
    async closeBtn() {
      const obj = {}
      const arr = []
      arr.push(this.getUuid)
      obj.uuidList = arr
      const res = await api.closeFlag(obj)
      if (res.code === 200) {
        this.activeName = 'C'
        this.pagination = {
          pageNum: 1,
          pageSize: res.data.pageSize
        }
        await this.getList({}, false)
        this.$store.dispatch('app/fetchParamsLog', {
          opratorType: 'UPDATE',
          api: '/processingMgr/pdPrintOrder/cancel',
          description: {
            beforeText: `在'加工管理-印花-印花订单中修改订单 ${arr}状态`,
            afterText: { status: 'C' },
            beforeCode: { status: 'R' }
          },
          appId: 'processingMgr'
        })
        // await this.listTotalNum()
        this.showMore = false
        this.detailFormDatas = {}
        this.detailData._productDetails.componentsOptions.data = []
      }
    },
    // 打印预览
    async printPreview() {
      this.$router.push(`/processing/printing/print?uuid=${this.getUuid}&version=${this.lastVersion}&printNo=${this.printNo}`)
    }
  }
}
</script>

<style  lang="scss">
@import "@/styles/base.scss";
#printOrder {
  .weaving-order-pagination {
    height: 40px;
    line-height: 40px;
    margin-top:20px;
    .TableSummation .total {
      margin: 0 0 0 10px;
    }
  }
  .el-pagination--small.pagination {
    margin-top: 0;
    text-align: left;
    margin-left: 5px;
  }
  .print-order-transition{
    background-color: #eef5f9;
    .left-cont {
      background: #fff;
      .el-table {
        width: 100%;
        overflow: auto;
      }
    }
  }
  .print-order-detail-form {
      padding-top:20px;
        background: #fff;
    > :nth-child(3n + 1) {
      // padding-left: 55px;
    }
    // .el-form-item{
    //   .el-form-item__content {
    //     line-height: 32px;
    //   }
    // }
    .el-form-item__label {
      color: #888e9e;
    }
    .el-form-item__content {
      color: #474747;
    }
  }
  .detail {
    .el-table td {
      border-bottom: 1px solid #dfe6ec;
      height: 50px;;
    }
    .el-table th.is-leaf {
      background: #f5f7fa;
      height: 44px;
    }
  }
  .print-order-requisition{
    >div:not(.TableSummation){
      margin-bottom:0
    }
    .el-form-item.el-form-item--mini{
      margin-bottom: 0;
    }

  }
  .detail-table {
    //表格
    margin-bottom: 10px;
    // padding: 0 10px;
    tr:nth-child(even) {
      background: #fff;
    }
    th.is-leaf {
      background: #f5f7fa;
      height: 50px;
    }
    th.is-leaf,
    td {
      border-bottom: 1px solid #dfe6ec;
    }
  }
}
</style>
<style lang="scss" scoped>
#printOrder {
  .main {
    .leftBox {
      position: relative;
    }
    .rightBox {
      border-left: 1px solid #e9eff2;
      .title {
        background: #fff;
        font-size: 18px;
        color: #15112b;
        height: 65px;
        line-height: 65px;
        padding-left: 20px;
        border-bottom: 1px solid #e9eff2;
        .el-select {
          margin-left: 10px;
          width: 100px;
          /deep/.el-input--medium .el-input__inner {
            height: 32px;
            line-height: 32px;
          }
        }
      }
      /deep/ .el-form-item__label-wrap {
        text-align: right;
        margin: 0!important;
        width: 100px;
      }
    }
  }
  /deep/.el-table__row {
    height: 50px;
  }
  .button.spe {
    position: absolute;
    right: 20px;
    top: 14px;
    z-index: 3;
  }
  .close-right {
    position: absolute;
    right: 8px;
    top: 10px;
    width: 22px;
    height: 22px;
    z-index: 2;
    background: #fff;
    border-radius: 50px;
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-pack: center;
    -ms-flex-pack: center;
    justify-content: center;
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;
    color: #7c7c7c;
    font-size: 14px;
    cursor: pointer;
    border: 1px solid #afafaf;
    :hover {
      color: #1890ff;
    }
  }
  .saveBtn {
    margin-right: 20px;
    margin-top: 15px;
  }
  .tabs {
    // border-bottom: 1px solid #ddd;
  }
  /deep/ .el-table::before {
    height: 0 !important;
  }
  /deep/.el-table--medium th, .el-table--medium td {
    padding: 0
  }
  /deep/.search .el-form-item__label-wrap {
    text-align: right;
    // margin: 0!important;
    width: auto;
  }
}
</style>
