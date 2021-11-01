
<template>
  <div id="WeavingOrder" class="list">
    <div class="search">
      <cs-custom-form
        ref="searchForm"
        :data-source="searchData"
        :options="formOptions"
        :form-datas="searchFormDatas"
      />
    </div>
    <div class="bk" style="position: relative">
      <div
        v-if="activeName === 'W' && $permission(['pd:pdKnitOrder:submit'])"
        class="button spe"
      >
        <el-button
          size="small"
          type="primary"
          @click="submitForm"
        >提交</el-button>
      </div>
      <div class="tabs">
        <el-tabs v-model="activeName" @tab-click="tabChange">
          <el-tab-pane v-for="(i, index) in tabs" :key="index" :name="i.value">
            <span slot="label"> {{ `${i.label} (${i.count})` }}</span>
          </el-tab-pane>
        </el-tabs>
      </div>
      <div class="main">
        <transitionWarp
          class-name="weaving-order-transition"
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
                v-if="uuid && showMore"
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
                  'padding-left': '10px',
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
              <div class="" style="position: relative">
                <div class="title">
                  织订单详情
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
    <cs-custom-pop
      v-if="requisitionOptions.visible"
      ref="servePop"
      :options="requisitionOptions"
    />
  </div>
</template>

<script>
import transitionWarp from '@/components/transition-wrap/index.vue'
import detailBranch from './components/detailBranch.vue'
// import detas from './components/deta.vue'
import * as api from './api/index.js'
import { inputFilter } from '@/views/processing-manage/public/index.js'
import buttonBar from '@/components/button-bar/index.vue'
import { deepClone } from '@/utils'
import tableSummation from '@/components/table-summation/index.vue'
import { setOrderFun } from '@/views/processing-manage/printing/public/mou.js'
export default {
  name: 'WeavingOrder',
  components: { buttonBar, transitionWarp },
  mixins: [setOrderFun],
  data() {
    var validateQty = (rule, value, callback) => {
      const i = rule.field.split('.')[1]
      const row = this.validateObj.table[i]
      const sum = row.leftAllotQty || 0
      if (row.qtyNew > sum) {
        callback(new Error('调拨量不能大于未调拨量'))
      } else {
        callback()
      }
    }

    var validateYarnQty = (rule, value, callback) => {
      const i = rule.field.split('.')[1]
      const row = this.validateObj.table[i]
      const sum = row.leftSendQty || 0
      if (row.yarnQtyNew > sum) {
        callback(new Error('配纱量不能大于未配纱量'))
      } else {
        callback()
      }
    }
    const itemStyle = { width: '33%' }
    const searchData = {
      _knitOrderNo: {
        prop: 'knitOrderNo',
        itemType: 'input',
        label: '织订单号',
        placeholder: '请输入织订单号',
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
      _deliveryDate: {
        prop: 'deliveryDate',
        itemType: 'date',
        type: 'daterange',
        label: '织单交期',
        startPlaceholder: '开始日期',
        endPlaceholder: '结束日期',
        format: 'yyyy-MM-dd',
        valueFormat: 'timestamp',
        defaultTime: ['00:00:00', '23:59:59'],
        itemStyle
      },
      _submitTime: {
        prop: 'submitTime',
        itemType: 'date',
        type: 'daterange',
        label: '提交日期',
        startPlaceholder: '开始日期',
        endPlaceholder: '结束日期',
        format: 'yyyy-MM-dd',
        valueFormat: 'timestamp',
        defaultTime: ['00:00:00', '23:59:59'],
        itemStyle
      },
      _suppler: {
        prop: 'suppler',
        itemType: 'input',
        label: '织厂',
        placeholder: '请输入织厂',
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
            p.submitTimeStart = p.submitTime[0]
            p.submitTimeEnd = p.submitTime[1]
          }
          delete p.deliveryDate
          delete p.submitTime

          this.searchParams = p
          this.pagination.pageNum = 1
          this.pagination.pageSize = 20
          this.uuid = undefined
          this.showMore = false
          this.getList()
          this.getCount()
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
        // fixed: 'left',
        isShow: () => {
          return this.activeName === 'W'
        }
      },
      _index: {
        minWidth: '50',
        label: '序号',
        // fixed: 'left',
        formater: (scope) => {
          return scope.$index + 1
        }
      },
      _knitOrderNo: {
        prop: 'knitOrderNo',
        label: '织订单号',
        minWidth: 160,
        showOverflowTooltip: true
        // style: {
        //   color: 'rgb(24, 144, 255)',
        //   cursor: 'pointer'
        // }
      },
      _customerName: {
        prop: 'customerName',
        label: '客户',
        minWidth: 120,
        showOverflowTooltip: true,
        handle: (scope) => {}
      },
      _clothType: {
        prop: 'clothType',
        label: '布类',
        showOverflowTooltip: true,
        minWidth: 140,
        isShow: () => {
          return this.activeName === 'A'
        }
      },
      _customerColor: {
        prop: 'customerColor',
        label: '客户颜色',
        showOverflowTooltip: true,
        minWidth: 140,
        isShow: () => {
          return this.activeName === 'A'
        }
      },
      _skuId: {
        prop: 'skuId',
        label: '坯布编码',
        showOverflowTooltip: true,
        minWidth: 160,
        isShow: () => {
          return this.activeName === 'A'
        }
      },
      _yarnName: {
        prop: 'yarnName',
        label: '纱名',
        showOverflowTooltip: true,
        minWidth: 140,
        isShow: () => {
          return this.activeName === 'A'
        }
      },
      _yarnAttr: {
        prop: 'yarnAttr',
        label: '纱属性',
        showOverflowTooltip: true,
        minWidth: 140,
        isShow: () => {
          return this.activeName === 'A'
        }
      },
      _qty: {
        prop: 'qty',
        label: '坯布数量(KG)',
        showOverflowTooltip: true,
        align: 'right',
        minWidth: 140,
        isShow: () => {
          return this.activeName === 'A'
        }
      },
      _planDelivery: {
        prop: 'planDelivery',
        label: '计划交期',
        showOverflowTooltip: true,
        minWidth: 140,
        isShow: () => {
          return this.activeName === 'A'
        },
        formater: (scope) => {
          return this.$filters.parseTime(scope.row.planDelivery, '{y}-{m}-{d}')
        }
      },
      _supplerName: {
        prop: 'supplerName',
        label: '织厂',
        minWidth: 120,
        showOverflowTooltip: true,
        handle: (scope) => {}
      },
      _knitDelivery: {
        prop: 'knitDelivery',
        label: '织布交期',
        showOverflowTooltip: true,
        minWidth: 140,
        isShow: () => {
          return this.activeName === 'A'
        },
        formater: (scope) => {
          return this.$filters.parseTime(scope.row.knitDelivery, '{y}-{m}-{d}')
        }
      },
      _salesTeamName: {
        prop: 'salesTeamName',
        label: '销售组织',
        minWidth: 120,
        showOverflowTooltip: true
      },
      _status: {
        prop: 'status',
        label: '状态',
        minWidth: 120,
        showOverflowTooltip: true,
        formater: (scope) => {
          return this.getStatus(scope.row.status)
        },
        isShow: () => {
          return this.activeName === 'A'
        }
      }
    }
    // 状态S待提交M已提交R已撤回F已完工C已取消
    const tabs = {
      _all: { label: '全部', value: 'A', count: 0 },
      _wait: { label: '待提交', value: 'W', count: 0 },
      _submit: { label: '已提交', value: 'S', count: 0 },
      _recall: { label: '已撤回', value: 'R', count: 0 },
      _finish: { label: '已完工', value: 'F', count: 0 },
      _cancel: { label: '已取消', value: 'C', count: 0 }
    }
    const detailStyle = {
      width: '32%',
      height: '32px',
      'line-height': '32px',
      'margin-bottom': '0'
    }
    const detailData = {
      _knitOrderNo: {
        prop: 'knitOrderNo',
        itemType: 'itemview',
        label: '织订单号',
        title: true,
        renderContent: (val) => {
          return val
        },
        itemStyle: detailStyle
      },
      _supplerName: {
        prop: 'supplerName',
        itemType: 'itemview',
        label: '织厂',
        itemStyle: detailStyle,
        title: true,
        renderContent: (val) => {
          return val
        }
      },
      _planPersionName: {
        prop: 'planPersionName',
        itemType: 'itemview',
        label: '排厂人员',
        itemStyle: detailStyle
      },
      _planTime: {
        prop: 'planTime',
        itemType: 'itemview',
        label: '排厂时间',
        itemStyle: detailStyle,
        renderContent: (val) => {
          return this.$filters.parseTime(val, '{y}-{m}-{d}')
        }
      },
      // 状态S待提交M已提交R已撤回F已完工C已取消
      _status: {
        prop: 'status',
        itemType: 'itemview',
        label: '织订单状态',
        itemStyle: detailStyle,
        renderContent: (val) => {
          return this.getStatus(val)
        }
      },
      _pmUserName: {
        prop: 'pmUserName',
        itemType: 'itemview',
        label: '跟单人员',
        itemStyle: detailStyle
      },
      _submitUserName: {
        prop: 'submitUserName',
        itemType: 'itemview',
        label: '提交人员',
        itemStyle: detailStyle,
        isShow: () => {
          return this.activeName === 'S'
        }
      },
      _submitTime: {
        prop: 'submitTime',
        itemType: 'itemview',
        label: '提交时间',
        itemStyle: detailStyle,
        isShow: () => {
          return this.activeName === 'S'
        },
        renderContent: (val) => {
          return this.$filters.parseTime(val, '{y}-{m}-{d} {h}:{i}')
        }
      },
      _recallUserName: {
        prop: 'recallUserName',
        itemType: 'itemview',
        label: '撤回人员',
        itemStyle: detailStyle,
        isShow: () => {
          return this.activeName === 'R'
        }
      },
      _recallTime: {
        prop: 'recallTime',
        itemType: 'itemview',
        label: '撤回时间',
        itemStyle: detailStyle,
        isShow: () => {
          return this.activeName === 'R'
        },
        renderContent: (val) => {
          return this.$filters.parseTime(val, '{y}-{m}-{d} {h}:{i}')
        }
      },
      _finishUserName: {
        prop: 'finishUserName',
        itemType: 'itemview',
        label: '完工人员',
        itemStyle: detailStyle,
        isShow: () => {
          return this.activeName === 'F'
        }
      },
      _finishTime: {
        prop: 'finishTime',
        itemType: 'itemview',
        label: '完工时间',
        itemStyle: detailStyle,
        isShow: () => {
          return this.activeName === 'F'
        },
        renderContent: (val) => {
          return this.$filters.parseTime(val, '{y}-{m}-{d} {h}:{i}')
        }
      },
      _cancelUserName: {
        prop: 'cancelUserName',
        itemType: 'itemview',
        label: '取消人员',
        itemStyle: detailStyle,
        isShow: () => {
          return this.activeName === 'C'
        }
      },
      _cancelTime: {
        prop: 'cancelTime',
        itemType: 'itemview',
        label: '取消时间',
        itemStyle: detailStyle,
        isShow: () => {
          return this.activeName === 'C'
        },
        renderContent: (val) => {
          return this.$filters.parseTime(val, '{y}-{m}-{d} {h}:{i}')
        }
      },
      _qty: {
        prop: 'qty',
        itemType: 'itemview',
        label: '坯布总数',
        itemStyle: detailStyle,
        renderContent: (val) => {
          return `${val}KG`
        }
      },
      _productDetails: {
        // productDetails
        prop: 'productDetails',
        components: { detailBranch },
        componentsOptions: {
          productDetails: []
        }
      }
    }
    const requisitionOptions = {
      itemType: 'dialog',
      visible: false,
      title: '原料调拨通知',
      // width: '1200px',
      width: '90%',
      formDatas: {},
      formOptions: {
        className: 'detail requisition',
        popError: true,
        syncDataHandle: (c) => {
          // console.log(c.table, 'kkkkk')
          this.validateObj = deepClone(c)
        }
      },
      ok: () => {
        this.validateSubmit()
        // this.requisitionOptions.visible = false
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
            _yarnCode: {
              prop: 'yarnCode',
              label: '纱线编码',
              minWidth: 160,
              showOverflowTooltip: true,
              handle: (scope) => {}
            },
            _yarnBatchNumber: {
              prop: 'yarnBatchNumber',
              label: '纱牌/纱批',
              minWidth: 160,
              showOverflowTooltip: true,
              handle: (scope) => {}
            },
            _supplierName: {
              prop: 'supplierName',
              label: '仓库',
              minWidth: 160,
              showOverflowTooltip: true,
              handle: (scope) => {}
            },
            _yarnName: {
              prop: 'yarnName',
              label: '纱名',
              minWidth: 160,
              showOverflowTooltip: true,
              handle: (scope) => {}
            },
            _yarnAttr: {
              prop: 'yarnAttr',
              label: '纱属性',
              minWidth: 160,
              showOverflowTooltip: true,
              handle: (scope) => {}
            },
            _yarnNeedQty: {
              prop: 'yarnNeedQty',
              label: '纱需求量(KG)',
              minWidth: 160,
              align: 'right',
              showOverflowTooltip: true,
              handle: (scope) => {}
            },
            _qtyNew: {
              prop: 'qtyNew',
              label: '调拨量(KG)',
              minWidth: 160,
              // showOverflowTooltip: true,
              editOptions: {
                placeholder: '请输入调拨量',
                itemType: 'input',
                labelWidth: '0',
                itemProp: 'qtyNew',
                clearable: true,
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
                return scope.row.qtyNew
              }
            },
            _allotPlanDelivery: {
              prop: 'allotPlanDelivery',
              label: '计划送纱期',
              minWidth: 180,
              showOverflowTooltip: true,
              handle: (scope) => {},
              formater: (scope) => {
                this.$set(scope.row, 'edit', true)
                return scope.row.allotPlanDelivery
              },
              editOptions: {
                itemType: 'date',
                labelWidth: '0',
                itemProp: 'allotPlanDelivery',
                placeholder: '请选择送纱期',
                clearable: true,
                rules: [
                  {
                    message: '请选择送纱期',
                    trigger: ['change']
                  }
                ]
              }
            },
            _yarnQtyNew: {
              prop: 'yarnQtyNew',
              label: '配纱量(KG)',
              minWidth: 160,
              editOptions: {
                placeholder: '请输入配纱量',
                itemType: 'input',
                labelWidth: '0',
                itemProp: 'yarnQtyNew',
                clearable: true,
                trim: (val) => {
                  return inputFilter(val)
                },
                rules: [
                  {
                    validator: validateYarnQty,
                    trigger: ['change']
                  }
                ]
              },
              handle: (scope) => {},
              formater: (scope) => {
                this.$set(scope.row, 'edit', true)
                return scope.row.yarnQtyNew
              }
            },
            _yarnPlanDelivery: {
              prop: 'yarnPlanDelivery',
              label: '配纱期',
              minWidth: 180,
              handle: (scope) => {},
              formater: (scope) => {
                this.$set(scope.row, 'edit', true)
                return scope.row.yarnPlanDelivery
              },
              editOptions: {
                clearable: true,
                itemType: 'date',
                labelWidth: '0',
                itemProp: 'yarnPlanDelivery',
                placeholder: '请选择配纱期',
                rules: [
                  {
                    message: '请选择配纱期',
                    trigger: ['change']
                  }
                ]
              }
            },
            _allotQty: {
              prop: 'allotQty',
              label: '已调拨量(KG)',
              align: 'right',
              minWidth: 160,
              showOverflowTooltip: true,
              handle: (scope) => {}
            },
            _leftAllotQty: {
              prop: 'leftAllotQty',
              label: '未调拨量(KG)',
              align: 'right',
              minWidth: 160,
              showOverflowTooltip: true,
              handle: (scope) => {}
            },
            _sendQty: {
              prop: 'sendQty',
              label: '已配纱量(KG)',
              align: 'right',
              minWidth: 160,
              showOverflowTooltip: true,
              handle: (scope) => {}
            },
            _leftSendQty: {
              prop: 'leftSendQty',
              label: '未配纱量(KG)',
              align: 'right',
              minWidth: 160,
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
            _qtyNew: {
              title: '调拨总数(KG):',
              num: 0
            },
            _leftAllotQty: {
              title: '未调拨总数(KG):',
              num: 0,
              formater: (val) => {
                var sum = 0
                this.requisitionOptions.formDatas &&
                  this.requisitionOptions.formDatas.table &&
                  this.requisitionOptions.formDatas.table.forEach((i) => {
                    sum =
                      this.$utils.getFloat(sum, 2) +
                      this.$utils.getFloat(i.leftAllotQty, 2)
                    sum = this.$utils.getFloat(sum, 2)
                  })
                return sum || 0
              }
            },
            _yarnQtyNew: {
              title: '配纱总数(KG):',
              num: 0
            },
            _leftSendQty: {
              title: '未配纱总数(KG):',
              num: 0,
              formater: (val) => {
                var sum = 0
                this.requisitionOptions.formDatas &&
                  this.requisitionOptions.formDatas.table &&
                  this.requisitionOptions.formDatas.table.forEach((i) => {
                    sum =
                      this.$utils.getFloat(sum, 2) +
                      this.$utils.getFloat(i.leftSendQty, 2)
                    sum = this.$utils.getFloat(sum, 2)
                  })
                return sum || 0
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
        text: '原料调拨',
        buttonClass: 'sub-main',
        isShow: () => {
          return (
            this.status === 'S' &&
            this.aut &&
            this.$permission(['pd:pdKnitOrder:material:detail:submit'])
          )
        },
        submit: () => {
          this.requisitionOptions.visible = true
          this.getRequisition()
        }
      },
      _back: {
        text: '撤回',
        buttonClass: 'sub-main',
        isShow: () => {
          return (
            this.status === 'S' &&
            this.aut &&
            this.$permission(['pd:pdKnitOrder:withdraw'])
          )
        },
        submit: () => {
          this.back()
        }
      },
      _finish: {
        text: '完工',
        buttonClass: 'sub-main',
        isShow: () => {
          return (
            this.status === 'S' &&
            this.aut &&
            this.aut &&
            this.$permission(['pd:pdKnitOrder:finish'])
          )
        },
        submit: () => {
          this.$confirm('确认 完工 该订单？', '提示', {
            type: 'warning',
            customClass: 'WeavingOrder'
          })
            .then(() => {
              this.finish()
            })
            .catch(() => {})
        }
      },
      _cancel: {
        text: '取消',
        buttonClass: 'sub-main',
        buttonClassFun: () => {
          return this.status === 'R' ? 'sub-main' : ''
        },
        isShow: () => {
          return (
            (this.status === 'S' || this.status === 'R') &&
            this.aut &&
            this.aut &&
            this.$permission(['pd:pdKnitOrder:cancel'])
          )
        },
        submit: () => {
          this.$confirm('确认 取消 该订单？', '提示', {
            type: 'warning',
            customClass: 'WeavingOrder'
          })
            .then(() => {
              this.cancel()
            })
            .catch(() => {})
        }
      },
      _preview: {
        text: '打印预览',
        buttonClass: 'sub-main',
        isShow: () => {
          return (
            ['S', 'F'].includes(this.status) && this.aut
            // this.$permission(['pd:pdKnitOrder:material:detail:submit'])
          )
        },
        submit: () => {
          // if (this.$route.params && this.$route.params.id) {
          //   // const sk = this.$route.params.id

          // }
          const { uuid } = this.detailFormDatas
          this.$router.push({
            name: 'processing-manage-weaving-orderPrint',
            params: { id: uuid }
          })
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
      currentChange: (val) => {
        this.pagination.pageNum = val
        this.getList()
        this.getCount()
      },
      sizeChange: (val) => {
        this.pagination.pageSize = val
        this.pagination.pageNum = 1
        this.pagination.currentPage = 1
        this.getList()
        this.getCount()
      }
    }
    return {
      tableFooter,
      status: undefined,
      allotUuid: undefined,
      result: {},
      validateObj: null,
      versionOptions: [],
      showMore: false,
      pagination,
      barConfig,
      requisitionOptions,
      columns,
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
        className: 'weaving-order-detail-form'
      },
      detailFormDatas: {},
      selectResult: [],
      uuid: undefined,
      knitOrderNo: undefined
    }
  },
  computed: {
    aut() {
      if (
        this.versionOptions &&
        this.versionOptions.length &&
        this.versionOptions[this.versionOptions.length - 1].value
      ) {
        return (
          this.detailFormDatas.version ===
          this.versionOptions[this.versionOptions.length - 1].value
        )
      }
      return false
    },
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
    if (this.$route.params.knitOrderNo) {
      this.searchParams.knitOrderNo = this.$route.params.knitOrderNo
      this.searchFormDatas.knitOrderNo = this.$route.params.knitOrderNo
      this.pagination.pageNum = 1
      this.activeName = this.$route.params.orderStatus || 'A'
      this.getList(this.$route.params.knitOrderNo)
      this.getCount(this.$route.params.knitOrderNo)
    } else {
      this.getList()
      this.getCount()
    }
  },
  activated() {
    this.uuid = undefined
    this.showMore = false
    if (this.$route.params.knitOrderNo) {
      this.searchParams.knitOrderNo = this.$route.params.knitOrderNo
      this.searchFormDatas.knitOrderNo = this.$route.params.knitOrderNo
      this.pagination.pageNum = 1
      this.activeName = this.$route.params.orderStatus || 'A'
      this.getList(this.$route.params.knitOrderNo)
      this.getCount(this.$route.params.knitOrderNo)
    } else {
      this.getList()
      this.getCount()
    }
  },
  methods: {
    getSum(property) {
      var sum = 0
      this.validateObj &&
        this.validateObj.table &&
        this.validateObj.table.length &&
        this.validateObj.table.forEach((i) => {
          // sum = sum + parseFloat(i[property] || 0)
          sum =
            this.$utils.getFloat(sum, 2) +
            this.$utils.getFloat(i[property] || 0, 2)
          sum = this.$utils.getFloat(sum, 2)
        })
      return sum || 0
    },
    tabChange() {
      this.pagination.pageNum = 1
      this.getCount()
      this.getList()
      this.uuid = undefined
      this.showMore = false
    },
    changeVersion(val) {
      this.getInfo({ uuid: this.uuid, version: val })
    },
    selectionChange(val) {
      this.selectResult = val
    },
    async submitForm(row) {
      var obj = {}
      var arr = []
      if (this.selectResult.length) {
        this.selectResult.forEach((i) => {
          arr.push(i.uuid)
        })
        obj = { uuid: arr }
      } else {
        this.$message({
          message: '请选择至少一个订单',
          type: 'warning'
        })
        return
      }
      const res = await api.submit(obj)
      this.$message({
        message: res.code === 200 ? '提交成功' : res.message,
        type: res.code === 200 ? 'success' : 'error'
      })
      if (res.code === 200) {
        this.selectResult = []
        this.activeName = 'S'
        this.tabChange()
        this.$store.dispatch('app/fetchParamsLog', {
          opratorType: 'UPDATE',
          api: '/processingMgr/knitOrder/submit',
          description: {
            beforeText: `在'加工管理-织布-织布订单中修改订单 ${obj}状态`,
            afterText: { status: 'S' },
            beforeCode: { status: 'W' }
          },
          appId: 'processingMgr'
        })
      }
    },
    async back() {
      const res = await api.recall({ uuid: this.uuid })
      this.$message({
        message: res.code === 200 ? '撤回成功' : res.message,
        type: res.code === 200 ? 'success' : 'error'
      })
      if (res.code === 200) {
        this.activeName = 'R'
        this.tabChange()
        this.$store.dispatch('app/fetchParamsLog', {
          opratorType: 'UPDATE',
          api: '/processingMgr/knitOrder/recall',
          description: {
            beforeText: `在'加工管理-织布-织布订单中修改订单 ${this.knitOrderNo}状态`,
            afterText: { status: 'R' },
            beforeCode: { status: this.status }
          },
          appId: 'processingMgr'
        })
      }
    },
    async cancel() {
      const res = await api.cancel({ uuid: this.uuid })
      this.$message({
        message: res.code === 200 ? '取消成功' : res.message,
        type: res.code === 200 ? 'success' : 'error'
      })
      if (res.code === 200) {
        this.activeName = 'C'
        this.tabChange()
        this.$store.dispatch('app/fetchParamsLog', {
          opratorType: 'UPDATE',
          api: '/processingMgr/knitOrder/cancel',
          description: {
            beforeText: `在'加工管理-织布-织布订单中修改订单 ${this.knitOrderNo}状态`,
            afterText: { status: 'C' },
            beforeCode: { status: this.status }
          },
          appId: 'processingMgr'
        })
      }
    },
    async finish() {
      const res = await api.finish({ uuid: this.uuid })
      this.$message({
        message: res.code === 200 ? '完工成功' : res.message,
        type: res.code === 200 ? 'success' : 'error'
      })
      if (res.code === 200) {
        this.activeName = 'F'
        this.tabChange()
        this.$store.dispatch('app/fetchParamsLog', {
          opratorType: 'UPDATE',
          api: '/processingMgr/knitOrder/finish',
          description: {
            beforeText: `在'加工管理-织布-织布订单中修改订单 ${this.knitOrderNo}状态`,
            afterText: { status: 'F' },
            beforeCode: { status: this.status }
          },
          appId: 'processingMgr'
        })
      }
    },
    rowClick(row) {
      this.knitOrderNo = row.knitOrderNo
      this.getInfo({ uuid: row.uuid })
    },
    async getCount(knitOrderNo) {
      const res = await api.count({
        pageSize: this.pagination.pageSize || 20,
        pageNum: this.pagination.pageNum || 1,
        ...this.searchParams,
        knitOrderNo: knitOrderNo || this.searchParams.knitOrderNo,
        status: this.activeName
      })
      if (res.code === 200) {
        for (var i in res.data) {
          this.tabs[`_${i}`] ? (this.tabs[`_${i}`].count = res.data[i]) : ''
        }
        this.tableFooter.componentOptions.config._num.num = res.data.total || 0
      }
    },
    async getList(knitOrderNo) {
      const res = await api.list({
        pageSize: this.pagination.pageSize || 20,
        pageNum: this.pagination.pageNum || 1,
        ...this.searchParams,
        knitOrderNo: knitOrderNo || this.searchParams.knitOrderNo,
        status: this.activeName
      })
      if (res.code === 200) {
        this.dataSource = res.data.list || []
        this.pagination = {
          ...this.pagination,
          dataTotal: res.data.total || 0,
          currentPage: res.data.pageNum,
          pageNum: res.data.pageNum,
          pageSize: res.data.pageSize
        }
        if (knitOrderNo && this.dataSource[0]) {
          this.rowClick(this.dataSource[0])
        }
      } else {
        this.$message({
          message: res.message,
          type: 'error'
        })
      }
    },
    async getInfo(params) {
      const res = await api.info(params)
      if (res.code === 200) {
        this.status = res.data.status
        this.detailFormDatas = res.data || {}
        const options = this.detailData._productDetails.componentsOptions
        options.productDetails = res.data.productDetails || []
        this.versionOptions =
          (res.data.versions &&
            res.data.versions.length &&
            res.data.versions.map((i) => ({
              label: `V${i}`,
              value: i
            }))) ||
          []
        this.uuid = params.uuid
        this.showMore = true
      } else {
        this.$message({
          message: res.message,
          type: 'error'
        })
      }
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
        // for (var i = table.length - 1; i >= 0; i--) {
        for (var i = 0; i < table.length; i++) {
          if (!out) {
            var sameArr =
              table.filter(
                (k, p) =>
                  k.yarnCode === table[i].yarnCode && k.index !== table[i].index
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
      console.log(skuArr, 'skuArr')
      for (var k = 0; k < skuArr.length; k++) {
        var obj = skuArr[k]
        var skuSum = 0
        var needQty = 0
        for (var j = 0; j < obj.length; j++) {
          // 每个SKU
          var e = obj[j]
          if (e.leftAllotQty && e.leftAllotQty > 0) {
            // 未调拨量
            if (
              Boolean(parseFloat(e.qtyNew)) !== Boolean(e.allotPlanDelivery)
            ) {
              this.$message({
                // message: '请补充完成调拨量',
                message: `请补充完成第${e.index + 1}信息`,
                type: 'warning'
              })
              return
            } else if (
              Boolean(parseFloat(e.qtyNew)) &&
              Boolean(e.allotPlanDelivery)
            ) {
              skuSum =
                this.$utils.getFloat(skuSum, 2) +
                this.$utils.getFloat(e.qtyNew, 2)
              skuSum = this.$utils.getFloat(skuSum, 2)
            }
          }
          if (e.leftSendQty && e.leftSendQty > 0) {
            // 未配纱量
            if (
              Boolean(parseFloat(e.yarnQtyNew)) !== Boolean(e.yarnPlanDelivery)
            ) {
              this.$message({
                message: `请补充完成第${e.index + 1}信息`,
                type: 'warning'
              })
              return
            } else if (
              Boolean(parseFloat(e.yarnQtyNew)) &&
              Boolean(e.yarnPlanDelivery)
            ) {
              skuSum =
                this.$utils.getFloat(skuSum, 2) +
                this.$utils.getFloat(e.yarnQtyNew, 2)
              skuSum = this.$utils.getFloat(skuSum, 2)
            }
          }
          needQty = parseFloat(e.yarnNeedQty || 0)
        }
        if (skuSum > needQty) {
          // SKU之和不大于该SKU总需求
          this.$message({
            message: `纱线编码${skuArr[k][0].yarnCode}的调拨量总计超过总需求量`,
            type: 'warning'
          })
          return
        }
      }
      // 组装数据
      var details = []
      this.validateObj.table.forEach((i) => {
        var obj = {}
        if (i.qtyNew) {
          obj.allotQty = i.qtyNew
          obj.allotPlanDelivery = i.allotPlanDelivery
        }
        if (i.yarnQtyNew) {
          obj.yarnQty = i.yarnQtyNew
          obj.yarnPlanDelivery = i.yarnPlanDelivery
        }
        if (i.qtyNew || i.yarnQtyNew) {
          obj.stockUuids = i.stockUuids
          details.push(obj)
        }
      })
      if (!details.length) {
        this.$message({
          message: '至少添加一条有效数据',
          type: 'warning'
        })
        return
      }
      this.allotConfirm({ details: details, uuid: this.allotUuid }) // 校验成功
    },
    async allotConfirm(params) {
      const res = await api.allotConfirm(params)
      this.$message({
        message: res.code === 200 ? '调拨成功' : res.message,
        type: res.code === 200 ? 'success' : 'error'
      })
      res.code === 200 ? (this.requisitionOptions.visible = false) : ''
      if (res.code === 200) {
        this.$store.dispatch('app/fetchParamsLog', {
          opratorType: 'INSERT',
          api: '/processingMgr/knitOrder/allotConfirm',
          description: {
            beforeText: `在'加工管理-织布-织布订单中新增订单 ${this.knitOrderNo}原料调拨`,
            beforeCode: params
          },
          appId: 'processingMgr'
        })
      }
    },
    async getRequisition() {
      const res = await api.allot({ uuid: this.uuid })
      if (res.code === 200) {
        var allotQtyAll = 0
        var sendQtyAll = 0
        res.data.details &&
          res.data.details.forEach((n, i) => {
            n.index = i
            allotQtyAll =
              this.$utils.getFloat(n.allotQty, 2) +
              this.$utils.getFloat(allotQtyAll, 2)
            sendQtyAll =
              this.$utils.getFloat(n.sendQty, 2) +
              this.$utils.getFloat(sendQtyAll, 2)
          })
        this.requisitionOptions.formDatas = { table: res.data.details || {}}
        this.allotUuid = res.data.uuid
        this.sumObj[`_${'qtyNew'}`].num = this.$utils.getFloat(allotQtyAll, 2)
        this.sumObj[`_${'yarnQtyNew'}`].num = this.$utils.getFloat(
          sendQtyAll,
          2
        )
        this.requisitionOptions.visible = true
      } else {
        this.$message({
          message: res.message,
          type: 'error'
        })
      }
    }
  }
}
</script>

<style  lang="scss" >
@import "@/styles/base.scss";
.WeavingOrder {
  position: relative;
}
#WeavingOrder {
  .el-dialog__body {
    padding: 0 20px;
  }
  .weaving-order-pagination {
    height: 40px;
    line-height: 40px;
    margin-top: 20px;
  }
  .TableSummation .total {
    margin: 0 0 0 10px;
  }
  .el-pagination--small.pagination {
    margin-top: 0;
    text-align: left;
    margin-left: 5px;
  }
  .weaving-order-transition.transition-wrap {
    background-color: #eef5f9;
    .left-cont {
      background: #fff;
      border-right: 1px solid #eeeff0;
      .el-table {
        width: 100%;
        overflow: auto;
      }
    }
    .right-cont {
      border: none;
    }
  }
  .weaving-order-detail-form {
    background: #fff;
    padding-top: 20px;
    > div:not(.WeavingOrder-DetailBranch) {
      padding-left: 20px;
      .el-form-item__content {
        line-height: 32px;
      }
      .el-form-item__label {
        height: 32px;
        line-height: 32px;
      }
    }
    .el-form-item__label {
      color: #888e9e;
    }
    .el-form-item__content {
      color: #474747;
    }
    .el-form-item__label-wrap {
      margin-left: 0 !important;
      width: 88px;
      text-align: right;
    }
  }
  .detail {
    .el-table td {
      border-bottom: 1px solid #dfe6ec;
      height: 50px;
      padding: 0;
    }
    .el-table th.is-leaf {
      background: #f5f7fa;
      height: 44px;
      padding: 0;
    }
  }
}
</style>
<style lang="scss" scoped>
#WeavingOrder {
  position: relative;
  height: 100%;
  .main {
    .leftBox {
      position: relative;
    }
    .rightBox {
      // border-left: 1px solid #e9eff2;
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
  /deep/ .el-table::before {
    height: 0 !important;
  }
}
</style>
