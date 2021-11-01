<!--
 * @Author: hzq
 * @Description: 染整订单
 * @Date: 2021-06-01 14:59:56
 * @LastEditors: anthony
 * @LastEditTime: 2021-07-19 15:45:46
 * @FilePath: e:\erpmu\erp2-processing-v2.0.0\src\views\processing-manage\dyeing\order\index.vue
-->

<template>
  <div id="DyeingOrder" class="list">
    <div class="search">
      <cs-custom-form
        ref="searchForm"
        :data-source="searchData"
        :options="formOptions"
        :form-datas="searchFormDatas"
      />
    </div>

    <div class="bk" style="position: relative">
      <div v-if="activeName === 'W' && (nowVersion === lastVersion) && $permission(['pd:pdDyeOrder:submit'])" class="button spe">
        <el-button
          size="small"
          type="primary"
          @click="submitBtn"
        >{{ selectResult.length > 1 ? '批量提交' : '提交' }}</el-button>
      </div>
      <div class="tabs">
        <el-tabs v-model="activeName" @tab-click="handleClick">
          <el-tab-pane v-for="(i, index) in tabs" :key="index" :name="i.value">
            <span slot="label" :name="i.value">
              {{ `${i.label} (${i.count})` }}</span>
          </el-tab-pane>
        </el-tabs>
      </div>

      <div class="main">
        <transitionWarp
          class-name="dyeing-order-transition"
          height="256px"
          width="288px"
          :is-show="showMore"
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
                v-if="
                  getUuid&&showMore"
                class="close-right"
                @click="showMore = !showMore"
              >
                <i
                  :class="{
                    'el-icon-arrow-right': showMore,
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
                  :columns="columns"
                  :data-source="dataSource"
                  :pagination="pagination"
                  @row-click="rowClick"
                  @selection-change="selectionChange"
                />
              </div>
            </div>
          </template>
          <!-- 详情 -->
          <template v-slot:right>
            <div class="rightBox">
              <div class="clearfix" style="position: relative">
                <div class="title">
                  染订单详情
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
import { setOrderFun } from '../public/mou'
import transitionWarp from '@/components/transition-wrap/index.vue'
import detailBranch from './components/detailBranch.vue'
import * as api from './api/index.js'
import { inputFilter } from '@/views/processing-manage/public/index.js'
import { deepClone } from '@/utils'
import tableSummation from '@/components/table-summation/index.vue'
import buttonBar from '@/components/button-bar/index.vue'
export default {
  name: 'DyeingOrder',
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
        callback(new Error('调拨量不能大于坯布需求量'))
      } else {
        this.sumObj[`_${'planQty'}`].num = this.getSum('planQty')
        callback()
      }
    }
    const itemStyle = { width: '33%' }
    const searchData = {
      _dyeNo: {
        prop: 'dyeNo',
        itemType: 'input',
        label: '染订单号',
        placeholder: '请输入染订单号',
        clearable: true,
        itemStyle,
        clear: (form, formDatas, setFormDatas, scope) => {
          this.searchFormDatas.dyeNo = ''
        }
      },
      // 字段待定
      _customerName: {
        prop: 'customerName',
        itemType: 'input',
        label: '客户',
        placeholder: '请输入客户',
        clearable: true,
        itemStyle,
        clear: (form, formDatas, setFormDatas, scope) => {
          this.searchFormDatas.customerName = ''
        }
      },
      // 字段待定
      _salesTeamName: {
        prop: 'salesTeamName',
        itemType: 'input',
        label: '销售组织',
        placeholder: '请输入销售组织',
        clearable: true,
        itemStyle,
        clear: (form, formDatas, setFormDatas, scope) => {
          this.searchFormDatas.salesTeamName = ''
        }
      },
      // 字段待定
      _submitTime: {
        prop: 'submitTime',
        itemType: 'date',
        type: 'daterange',
        label: '染整交期',
        startPlaceholder: '开始日期',
        endPlaceholder: '结束日期',
        format: 'yyyy-MM-dd',
        valueFormat: 'timestamp',
        defaultTime: ['00:00:00', '23:59:59'],
        itemStyle
      },
      // 字段待定
      _supplierName: {
        prop: 'supplierName',
        itemType: 'input',
        label: '染厂',
        placeholder: '请输入染厂',
        clearable: true,
        itemStyle,
        clear: (form, formDatas, setFormDatas, scope) => {
          this.searchFormDatas.supplierName = ''
        }
      },
      // 字段待定
      _pmUserName: {
        prop: 'pmUserName',
        itemType: 'input',
        label: '跟单人',
        placeholder: '请输入跟单人',
        clearable: true,
        itemStyle,
        clear: (form, formDatas, setFormDatas, scope) => {
          this.searchFormDatas.pmUserName = ''
        }
      },
      _operate: {
        itemType: 'operate',
        submitText: '查询',
        submitHandle: params => {
          const p = deepClone(params)
          // 提交时间
          if (p.hasOwnProperty('submitTime') && p.submitTime) {
            p.startDateTime = p.submitTime[0]
            p.endDateTime = p.submitTime[1]
          }
          delete p.submitTime

          this.searchParams = p
          this.pagination.pageNum = 1
          this.pagination.pageSize = 20
          this.list()
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
        formater: scope => {
          return scope.$index + 1
        }
      },
      _dyeNo: {
        prop: 'dyeNo',
        label: '染订单号',
        minWidth: 160,
        showOverflowTooltip: true,
        handle: scope => {}
      },
      _createdTime: {
        prop: 'createdTime',
        label: '订单生成日期',
        minWidth: 140,
        showOverflowTooltip: true,
        isShow: (scope) => {
          return this.activeName === 'A'
        },
        formater: (scope) => {
          return scope.row.createdTime ? this.$filters.parseTime(scope.row.createdTime + '', '{y}-{m}-{d} {h}:{i}') : '-'
        }
      },
      _planQty: {
        prop: 'planQty',
        label: '色布数量(KG)',
        align: 'right',
        minWidth: 140,
        showOverflowTooltip: true,
        isShow: (scope) => {
          return this.activeName === 'A'
        },
        handle: scope => {}
      },
      _planTime: {
        prop: 'planTime',
        label: '染计划交期',
        minWidth: 140,
        showOverflowTooltip: true,
        isShow: (scope) => {
          return this.activeName === 'A'
        },
        handle: scope => {},
        formater: (scope) => {
          return scope.row.planTime ? this.$filters.parseTime(scope.row.planTime + '', '{y}-{m}-{d} {h}:{i}') : '-'
        }
      },
      _customerName: {
        prop: 'customerName',
        label: '客户',
        minWidth: 140,
        showOverflowTooltip: true,
        handle: scope => {}
      },
      _supplierName: {
        prop: 'supplierName',
        label: '染厂',
        minWidth: 140,
        showOverflowTooltip: true,
        handle: scope => {}
      },
      _pmUserName: {
        prop: 'pmUserName',
        label: '跟单人',
        minWidth: 120,
        showOverflowTooltip: true,
        isShow: (scope) => {
          return this.activeName === 'A'
        },
        handle: scope => {}
      },
      _salesTeamName: {
        prop: 'salesTeamName',
        label: '销售组织',
        minWidth: 140,
        showOverflowTooltip: true,
        handle: scope => {}
      },
      _status: {
        prop: 'status',
        label: '状态',
        showOverflowTooltip: true,
        isShow: (scope) => {
          return this.activeName === 'A'
        },
        handle: scope => {},
        formater: (scope) => {
          return this.getStatus(scope.row.status)
        }
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
    const pagination = {
      small: false,
      layout: 'total, prev, pager, next,sizes, jumper',
      currentChange: val => {
        const com = { pageSize: this.pagination.pageSize || 20, pageNum: val }
        this.list(com, false)
      },
      sizeChange: val => {
        this.$set(this.pagination, 'currentPage', 1)
        const com = { pageNum: 1, pageSize: val }
        this.list(com, false)
      }
    }
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
      'margin-bottom': '0',
      'padding-left': '10px'
    }
    const detailData = {
      _dyeNo: {
        prop: 'dyeNo',
        itemType: 'itemview',
        label: '染订单号：',
        itemStyle: {
          width: '32%',
          height: '32px',
          'line-height': '32px',
          'margin-bottom': '0',
          'padding-left': '20px'
        },
        itemClassName: 'dyeing-order-detail'
      },
      _supplier: {
        prop: 'supplier',
        itemType: 'itemview',
        label: '染厂：',
        itemStyle: detailStyle,
        renderContent: (value, options, form, formDatas, setFormDatas, scope) => {
          return value ? value.label : ''
        }
      },
      _pmUser: {
        prop: 'pmUser',
        itemType: 'itemview',
        label: '跟单人员：',
        itemStyle: {
          width: '32%',
          height: '32px',
          'line-height': '32px',
          'margin-bottom': '0'
        },
        renderContent: (value, options, form, formDatas, setFormDatas, scope) => {
          return value ? value.label : ''
        }
      },
      _status: {
        prop: 'status',
        itemType: 'itemview',
        label: '染订单状态：',
        itemStyle: {
          width: '32%',
          height: '32px',
          'line-height': '32px',
          'margin-bottom': '0',
          'padding-left': '20px'
        },
        itemClassName: 'dyeing-order-detail',
        renderContent: (value, options, form, formDatas, setFormDatas, scope) => {
          if (value) {
            return this.getStatus(value)
          } else {
            return ''
          }
        }
      },
      _createdBy: {
        prop: 'createdBy',
        itemType: 'itemview',
        label: '排厂人：',
        itemStyle: detailStyle
      },
      _planTime: {
        prop: 'planTime',
        itemType: 'itemview',
        label: '排厂时间：',
        itemStyle: {
          width: '32%',
          height: '32px',
          'line-height': '32px',
          'margin-bottom': '0'
        },
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
      _submitUserName: {
        prop: 'option',
        itemType: 'itemview',
        label: '提交人员：',
        itemStyle: {
          width: '32%',
          height: '32px',
          'line-height': '32px',
          'margin-bottom': '0',
          'padding-left': '20px'
        },
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
        itemStyle: {
          width: '32%',
          height: '32px',
          'line-height': '32px',
          'margin-bottom': '0',
          'padding-left': '20px'
        },
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
        itemStyle: {
          width: '32%',
          height: '32px',
          'line-height': '32px',
          'margin-bottom': '0',
          'padding-left': '20px'
        },
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
        itemStyle: {
          width: '32%',
          height: '32px',
          'line-height': '32px',
          'margin-bottom': '0',
          'padding-left': '20px'
        },
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
      _planQty: {
        prop: 'planQty',
        itemType: 'itemview',
        label: '色布总数：',
        itemStyle: {
          width: '32%',
          height: '32px',
          'line-height': '32px',
          'margin-bottom': '0',
          'padding-left': '20px'
        },
        itemClassName: 'dyeing-order-detail',
        isShow: () => {
          return this.getStatusInfo === 'W'
        }
      },
      _planQty11: {
        prop: 'planQty',
        itemType: 'itemview',
        label: '色布总数：',
        itemStyle: {
          width: '32%',
          height: '32px',
          'line-height': '32px',
          'margin-bottom': '0'
        },
        itemClassName: 'dyeing-order-detail',
        isShow: () => {
          return this.getStatusInfo === 'S' || this.getStatusInfo === 'R' || this.getStatusInfo === 'F' || this.getStatusInfo === 'C'
        }
      },
      _productDetails: {
        prop: 'productDetails',
        components: { detailBranch },
        componentsOptions: { data: [] }
      }
    }
    // 坯布调拨通知单
    const requisitionOptions = {
      itemType: 'dialog',
      visible: false,
      title: '坯布调拨通知单',
      width: '1200px',
      formDatas: {},
      formOptions: {
        className: 'dyeing-order-requisition detail',
        // className: 'detail requisition',
        popError: true,
        syncDataHandle: (c) => {
          this.validateObj = c
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
              formater: scope => {
                return (
                  (this.pagination.currentPage - 1) * this.pagination.pageSize +
                  (scope.$index + 1)
                )
              }
            },
            _skuId: {
              prop: 'skuId',
              label: '坯布编码',
              showOverflowTooltip: true,
              handle: scope => {}
            },
            _warehouse: {
              prop: 'warehouse',
              label: '仓库地址',
              showOverflowTooltip: true,
              handle: scope => {},
              formater: (scope) => {
                return scope.row.warehouse ? scope.row.warehouse.label : ''
              }
            },
            _cloth: {
              prop: 'cloth',
              label: '布类',
              showOverflowTooltip: true,
              handle: scope => {},
              formater: (scope) => {
                return scope.row.cloth ? scope.row.cloth.label : ''
              }
            },
            _allotQty: {
              prop: 'allotQty',
              label: '坯布需求量(KG)',
              align: 'right',
              showOverflowTooltip: true,
              handle: scope => {}
            },
            _planQty: {
              prop: 'planQty',
              label: '调拨量(KG)',
              align: 'right',
              showOverflowTooltip: true,
              editOptions: {
                itemType: 'input',
                itemProp: 'planQty',
                size: 'mini',
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
                itemProp: 'sendDelivery',
                size: 'mini',
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
              showOverflowTooltip: true,
              handle: scope => {}
            },
            _nonAllotQty: {
              prop: 'nonAllotQty',
              align: 'right',
              label: '未调拨量(KG)',
              // minWidth: '150',
              showOverflowTooltip: true,
              handle: scope => {}
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
    const barConfig = {
      _allot: {
        text: '坯布调拨通知',
        buttonClass: 'sub-main',
        isShow: () => { return this.getStatusInfo === 'S' && (this.nowVersion === this.lastVersion) && this.$permission(['pd:pdDyeOrder:material:detail:submit']) },
        submit: () => {
          this.requisitionOptions.visible = true
          this.getRequisition()
        }
      },
      _withdraw: {
        text: '撤回',
        buttonClass: 'sub-main',
        isShow: () => { return this.getStatusInfo === 'S' && (this.nowVersion === this.lastVersion) && this.$permission(['pd:pdDyeOrder:withdraw']) },
        submit: () => {
          this.withdrawBtn()
        }
      },
      _finish: {
        text: '完工',
        buttonClass: 'sub-main',
        isShow: () => { return this.getStatusInfo === 'S' && (this.nowVersion === this.lastVersion) && this.$permission(['pd:pdDyeOrder:finish']) },
        submit: () => {
          this.$confirm('确认 完工 该订单？', '提示', {
            type: 'warning',
            customClass: 'DyeingOrder'
          })
            .then(() => {
              this.finishBtn()
            })
            .catch(() => {})
        }
      },
      _cancel: {
        text: '取消',
        buttonClass: 'sub-main',
        isShow: () => { return (this.getStatusInfo === 'S' || this.getStatusInfo === 'R') && (this.nowVersion === this.lastVersion) && this.$permission(['pd:pdDyeOrder:cancel']) },
        submit: () => {
          this.$confirm('确认 取消 该订单？', '提示', {
            type: 'warning',
            customClass: 'DyeingOrder'
          })
            .then(() => {
              this.cancelBtn()
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
      }
    }
    return {
      tableFooter,
      validateObj: null,
      versionOptions: [],
      showMore: false,
      barConfig,
      requisitionOptions,
      columns,
      getUuid: '',
      pdDyeAllotDetailObj: {},
      dyeNo: '',
      pagination,
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
        className: 'dyeing-order-detail-form'
      },
      detailFormDatas: {},
      selectResult: [],
      showRightFlag: false,
      totalObj: {},
      lastVersion: 0,
      nowVersion: 0,
      getStatusInfo: ''
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
    this.list()
  },
  activated() {
    this.list()
  },
  methods: {
    // tab页签切换
    async handleClick() {
      this.clearType()
      this.showMore = false
      // 清空详情信息数据
      await this.list({}, false)
      // 切换页签，自动获取每个页签下第一条数据的详情
    },
    clearType() {
      this.detailFormDatas = {}
      this.detailData._productDetails.componentsOptions.data = []
    },
    // 获取列表数据
    async list() {
      this.clearType()
      this.getUuid = ''
      this.showMore = false
      this.dataSource = []
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
        const amountRes = await api.count({
          ...this.searchParams,
          pageSize: this.pagination.pageSize || 20,
          pageNum: this.pagination.pageNum || 1,
          status: this.activeName === 'A' ? '' : this.activeName
        })
        if (amountRes.code === 200) {
          for (var i in amountRes.data) {
            this.tabs[`_${i}`] ? (this.tabs[`_${i}`].count = amountRes.data[i]) : ''
          }
          this.tableFooter.componentOptions.config._num.num = amountRes.data.amount || 0
        }
      } else {
        this.$message({
          message: res.message,
          type: 'error'
        })
      }
    },
    // 列表单元点击事件
    rowClick(row) {
      this.showMore = true
      this.dyeNo = row.dyeNo
      this.getUuid = row.uuid
      const obj = {}
      obj.taskNo = row.taskNo
      obj.dyeNo = row.dyeNo
      obj.version = row.version
      this.pdDyeAllotDetailObj = obj
      this.info({ uuid: row.uuid, version: row.version, dyeNo: row.dyeNo })
    },
    // 待提交页签多选
    selectionChange(val) {
      this.selectResult = val
    },
    // 版本详情切换
    changeVersion(val) {
      this.info({ dyeNo: this.dyeNo, version: val })
    },
    // 获取详情信息
    async info(params) {
      const obj = {}
      obj.dyeNo = params.dyeNo
      obj.version = params.version
      const res = await api.info(obj)
      if (res.code === 200) {
        this.detailFormDatas = res.data || {}
        this.getStatusInfo = res.data.status
        console.log(this.getStatusInfo, 'this.getStatusInfo---')
        this.detailData._productDetails.componentsOptions.data = res.data && res.data.pdDyeOrderDetailRespList
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
          tatalll = parseFloat(tatalll) + parseFloat(val.planQty) // 相同skuid将输入值汇总
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
      arr = arr.filter(val =>
        val.planQty && val.sendDelivery)
      arr.forEach((val, index) => {
        var date = new Date(val.sendDelivery)
        val.sendDelivery = date.getTime()
      })
      const res = await api.allotConfirm({ uuid: this.getUuid, pdDyeOrderAllotDetailReqList: arr })
      this.$message({
        message: '调拨成功!',
        type: res.code === 200 ? 'success' : 'error'
      })
      if (res.code === 200) {
        this.requisitionOptions.visible = false
        this.$store.dispatch('app/fetchParamsLog', {
          opratorType: 'INSERT',
          api: '/processingMgr/pdDyeAllotNotice/save',
          description: {
            beforeText: `在'加工管理-染整-染整订单中新增订单 ${this.getUuid}原料调拨`,
            beforeCode: arr
          },
          appId: 'processingMgr'
        })
      }
    },
    // 调拨通知单数据
    async getRequisition(params) {
      const res = await api.allot({
        taskNo: this.pdDyeAllotDetailObj.taskNo,
        dyeNo: this.pdDyeAllotDetailObj.dyeNo,
        version: this.pdDyeAllotDetailObj.version
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
    async submitBtn() {
      if (this.selectResult.length < 1) {
        this.$message({
          message: '请选择数据提交！',
          type: 'warning'
        })
        return
      }
      var obj = {}
      var arr = []
      this.selectResult.forEach((val, index) => {
        arr.push(val.uuid)
      })
      obj.uuidList = arr
      const res = await api.submit(obj)
      if (res.code === 200) {
        this.activeName = 'S'
        this.pagination = {
          pageNum: 1,
          pageSize: res.data.pageSize
        }
        await this.list({}, false)
        this.$store.dispatch('app/fetchParamsLog', {
          opratorType: 'UPDATE',
          api: '/processingMgr/pdDyeOrder/submit',
          description: {
            beforeText: `在'加工管理-染整-染整订单中修改订单 ${arr}状态`,
            afterText: { status: 'S' },
            beforeCode: { status: 'W' }
          },
          appId: 'processingMgr'
        })
        this.showMore = false
        this.detailFormDatas = {}
        this.detailData._productDetails.componentsOptions.data = []
      }
    },
    // 完工
    async finishBtn() {
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
        await this.list({}, false)
        this.$store.dispatch('app/fetchParamsLog', {
          opratorType: 'UPDATE',
          api: '/processingMgr/pdDyeOrder/finish',
          description: {
            beforeText: `在'加工管理-染整-染整订单中修改订单 ${arr}状态`,
            afterText: { status: 'F' },
            beforeCode: { status: 'R' }
          },
          appId: 'processingMgr'
        })
        this.showMore = false
        this.detailFormDatas = {}
        this.detailData._productDetails.componentsOptions.data = []
      }
    },
    // 撤回
    async withdrawBtn() {
      const obj = {}
      const arr = []
      arr.push(this.getUuid)
      obj.uuidList = arr
      const res = await api.withdraw(obj)
      if (res.code === 200) {
        this.activeName = 'R'
        this.pagination = {
          pageNum: 1,
          pageSize: res.data.pageSize
        }
        await this.list({}, false)
        this.showMore = false
        this.$store.dispatch('app/fetchParamsLog', {
          opratorType: 'UPDATE',
          api: '/processingMgr/pdDyeOrder/recall',
          description: {
            beforeText: `在'加工管理-染整-染整订单中修改订单 ${arr}状态`,
            afterText: { status: 'C' },
            beforeCode: { status: 'R' }
          },
          appId: 'processingMgr'
        })
        this.detailFormDatas = {}
        this.detailData._productDetails.componentsOptions.data = []
      }
    },
    // 取消
    async cancelBtn() {
      const obj = {}
      const arr = []
      arr.push(this.getUuid)
      obj.uuidList = arr
      const res = await api.cancel(obj)
      if (res.code === 200) {
        this.activeName = 'C'
        this.pagination = {
          pageNum: 1,
          pageSize: res.data.pageSize
        }
        await this.list({}, false)
        this.$store.dispatch('app/fetchParamsLog', {
          opratorType: 'UPDATE',
          api: '/processingMgr/pdDyeOrder/cancel',
          description: {
            beforeText: `在'加工管理-染整-染整订单中修改订单 ${arr}状态`,
            afterText: { status: 'C' },
            beforeCode: { status: 'R' }
          },
          appId: 'processingMgr'
        })
        this.showMore = false
        this.detailFormDatas = {}
        this.detailData._productDetails.componentsOptions.data = []
      }
    },
    // 打印预览
    async printPreview() {
      this.$router.push(`/processing/dyeing/print?uuid=${this.getUuid}&version=${this.lastVersion}`)
    }
  }
}
</script>

<style lang="scss">
@import "@/styles/base.scss";
.DyeingOrder {
  position: relative;
  .el-message-box__status {
    top: 0;
  }
}
#DyeingOrder {
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
    .dyeing-order-transition.transition-wrap {
    background-color: #eef5f9;
    .left-cont {
      background: #fff;
      .el-table {
        width: 100%;
        overflow: auto;
      }
    }
  }
  .dyeing-order-detail-form {
    padding-top: 20px;
    background: #fff;
    // .el-form-item__content {
    //   line-height: 32px;
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
  .dyeing-order-requisition{
    >div:not(.TableSummation){
      margin-bottom:0
    }
    .el-form-item.el-form-item--mini{
      margin-bottom: 0;
    }

  }
}
</style>
<style lang="scss" scoped>
#DyeingOrder {
  position: relative;
  height: 100%;
  /deep/ .el-form-item__label-wrap {
    text-align: right;
    margin: 0!important;
    width: 100px;
  }
  .main {
    .leftBox{position: relative;}
    .rightBox {
      border-left: 1px solid #e9eff2;
      .title {background: #fff;
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
    }
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
  /deep/.el-table__row {
    height: 50px;
  }
  /deep/ .el-table::before {
    height: 0 !important;
  }
  /deep/ .el-dialog__body {
    padding: 0 20px;
  }
  /deep/.el-table--medium th, .el-table--medium td {
    padding: 0
  }
  /deep/.search .el-form-item__label-wrap {
    text-align: right;
    // margin: 0!important;
    width: 70px;
  }
}
</style>
