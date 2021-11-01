<template>
  <div class="OrderDetail details" style="margin-top: 0">
    <div class="head-base">
      <div class="msg-lf">
        采购订单号：
        {{ msg && msg.purchaseOrderNumber ? msg.purchaseOrderNumber : "" }}
      </div>
      <div v-if="id" class="msg-lr">
        <div v-if="msg && msg.submitterName">
          {{ `下单：${msg.submitterName}` }}
          <template v-if="msg && msg.submitDate">{{
            `${parseTime(msg.submitDate)}`
          }}</template>
        </div>
        <div v-if="msg && msg.uploaderName">
          {{ `上传合同：${msg.uploaderName}` }}
          <template v-if="msg && msg.uploadDate">{{
            `${parseTime(msg.uploadDate)}`
          }}</template>
        </div>
        <div v-if="msg && msg.cancellerName">
          {{ `取消：${msg.cancellerName}` }}
          <template v-if="msg && msg.cancelDate">
            {{ `${parseTime(msg.cancelDate)}` }}</template>
        </div>
      </div>
    </div>
    <div class="card">
      <!-- <div class="card-title">基本信息</div> -->
      <div class="basic-top">
        <span>基本信息</span>
        <div v-if="versionInfoArray && versionInfoArray.length && type === 'detail'" class="versionClass">
          <el-select v-model="versionInfoLength" filterable placeholder="请选择" @change="versionInfoChange">
            <el-option
              v-for="item in versionInfoArray"
              :key="item"
              :label="item"
              :value="item"
            />
          </el-select>
        </div>
      </div>
      <cs-custom-form
        :data-source="baseDataSource"
        :options="baseOptions"
        :form-datas="baseDatas"
      />
    </div>
    <div class="edit-base">
      <cs-custom-form
        ref="searchForm"
        :data-source="formDataSource"
        :options="formOptions"
        :form-datas="formDatas"
      />
    </div>
    <div class="edit-table card">
      <div
        class="card-title"
        :style="{
          'border-bottom':
            type === 'detail' && status !== 1 ? '1px solid #e9eff2' : 'none',
        }"
      >
        采购清单
        <div v-if="type !== 'detail'" class="fr btnGroup">
          <el-button size="small" @click="del">删除</el-button>
          <el-button type="primary" :disabled="type === 'change'" size="small" @click="add">新增</el-button>
        </div>
      </div>

      <el-button-group
        v-if="type === 'detail' && status !== 1"
        class="sumBtnGroup"
      >
        <el-button
          size="small"
          :class="{ activeBtn: activeName === '0' }"
          @click="handleClick('0')"
        >汇总</el-button>
        <el-button
          size="small"
          :class="{ activeBtn: activeName === '1' }"
          @click="handleClick('1')"
        >明细</el-button>
      </el-button-group>
      <div
        class="table-detail"
        :class="{
          edit: type !== 'detail',
        }"
      >
        <cs-custom-form
          ref="table"
          :data-source="tableDataSource"
          :form-datas="tableFormDatas"
          style="margin: 0 20px"
          edit-type="pop"
          :options="tableOptions"
        />
      </div>
      <tableSummation
        :config="sumConfig"
        style="padding-left: 20px; margin-top: -22px"
      />
    </div>
    <cs-custom-pop
      v-if="popOptions.visible"
      :options="popOptions"
      @close="popOptions.visible = false"
    />
    <bottomBar
      :config="type === 'detail' && versionInfoLength !== versionInfoArray[0] ? {} : barConfig"
    />
    <approve
      v-if="approveConfig.visible"
      :config="approveConfig"
      @close="approveConfig.visible = false"
    />
  </div>
</template>

<script>
import approve from '@/components/approve/index.vue'
import tableSummation from '@/components/table-summation/index.vue'
import bottomBar from '@/components/button-bar/index.vue'
import progressDetail from './components/progress-detail.vue'
import * as api from './api/index.js'
import { deepClone, parseTime } from '@/utils'
import * as apiPub from '@/views/pms/public/api/index.js'
import * as demandList from '@/views/pms/demand-management/api/index.js'
import { fetchLog } from '@/views/pms/public/fetchLog.js'
import popoverColumn from '@/components/cs-custom-table/columns/popover-column'
import propertyCard from '@/components/property-card/index.vue'
export default {
  name: 'OrderDetail',
  components: { tableSummation, bottomBar, approve },
  mixins: [fetchLog],
  data() {
    const itemStyle = { width: '25%' }
    // 输入一个数字, 每三位之间加一个逗号, 且保留两位小数
    const numRecursion = (num, newStr = '') => {
      function zzz(num) {
        if (num / 1000 >= 1) {
          zzz(parseInt(num / 1000))
          const temp = ((num % 1000) + '').padStart(3, '0')
          newStr = newStr + ',' + temp
        } else {
          newStr = num % 1000
        }
        return newStr
      }
      if (num) {
        num = parseFloat(num, 2) || 0.0
        return zzz(parseInt(num)) + '.' + num.toFixed(2).split('.')[1]
      }
    }
    // 输入过滤
    var filterVal = (val) => {
      val = val.replace(/[^\d.]/g, '') // 清除“数字”和“.”以外的字符
      val = val.replace(/\.{2,}/g, '.') // 只保留第一个. 清除多余的
      val = val.replace('.', '$#$').replace(/\./g, '').replace('$#$', '.')
      val = val.replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3') // 只能输入两个小数
      if (val.indexOf('.') < 0 && val !== '') {
        // 以上已经过滤，此处控制的是如果没有小数点，首位不能为类似于 01、02的金额
        val = parseFloat(val)
      }
      return val
    }
    var validRuleExchangeRate = (rule, value, callback) => {
      const reg = /^\d+\.?\d{0,2}$/
      const tip = this.formDataSource['_elRow']['children']['_tip']
      if (!value || parseFloat(value) === 0) {
        this.$set(tip, 'isShow', false)
        return callback(new Error('请输入大于0的汇率'))
      } else if (value && !reg.test(value)) {
        this.$set(tip, 'isShow', false)
        return callback(new Error('请输入大于0的两位数值'))
      } else if (value > 99999999.99) {
        this.$set(tip, 'isShow', false)
        return callback(new Error('请输入小于99999999.99的两位数值'))
      }
      this.$set(tip, 'isShow', true)
      return callback()
    }
    var validRule = (rule, value, callback) => {
      const reg = /^\d+\.?\d{0,2}$/
      if (!value || parseFloat(value) === 0) {
        return callback(new Error('请输入大于0的数值'))
      } else if (value && !reg.test(value)) {
        return callback(new Error('请输入大于0的两位数值'))
      } else if (value > 99999999.99) {
        return callback(new Error('请输入小于99999999.99的两位数值'))
      } else {
        return callback()
      }
    }
    // 清单以及弹框中公共字段
    const publicColumns = {
      _index: {
        type: 'index',
        label: '序号',
        width: '70',
        formater: (scope) => {
          if (this.addConfig.visible) {
            const pages = this.addConfig.content._demandTable.pagination
            if (pages) {
              return (
                (pages.currentPage - 1) * pages.pageSize + (scope.$index + 1)
              )
            }
          } else {
            const pages = this.tableDataSource._tableForm.pagination
            if (pages) {
              return (
                (pages.currentPage - 1) * pages.pageSize + (scope.$index + 1)
              )
            }
          }
          return scope.$index + 1
        }
      },
      _demandNumber: {
        prop: 'demandNumber',
        label: '采购需求号',
        minWidth: '150',
        isShow: () => {
          return this.activeName !== '0'
        }
      },
      _materiel: {
        prop: 'materielInfo.materiel',
        label: '纱线编码',
        minWidth: '140',
        edit: () => {
          return false
        },
        components: {
          popoverColumn
        },
        componentsOptions: {
          customOptions: {
            placement: 'right',
            style: {
              color: '#0986FF',
              cursor: 'pointer'
            },
            width: '500',
            content: propertyCard,
            contentOptions: {},
            trigger: 'click',
            mouseleave: true,
            formDatas: {},
            show: (scope) => {
              return scope.row['materielInfo'].materiel
            },
            showContent: (scope) => {
              return scope.row.materielInfo && scope.row.materielInfo.materiel
                ? scope.row.materielInfo.materiel
                : '-'
            }
          }
        }
      },
      _materielName: {
        prop: 'materielName',
        label: '纱名',
        minWidth: '160',
        showOverflowTooltip: true,
        formater: (scope) => {
          return scope.row.materielInfo && scope.row.materielInfo.materielName
            ? scope.row.materielInfo.materielName
            : ''
        }
      },
      _materielProperty: {
        prop: 'materielProperty',
        label: '纱属性',
        minWidth: '160',
        showOverflowTooltip: true,
        formater: (scope) => {
          return scope.row.materielInfo &&
            scope.row.materielInfo.materielProperty
            ? scope.row.materielInfo.materielProperty
            : ''
        }
      },
      _demandWeight: {
        prop: 'demandWeight',
        label: '需求重量(KG)',
        minWidth: '110',
        showOverflowTooltip: true,
        align: 'right',
        isShow: () => {
          return this.addConfig.visible
        }
      },
      _purchaseDate: {
        prop: 'purchaseDate',
        label: '需求交期',
        minWidth: '100',
        formater: (scope) => {
          return scope.row.purchaseDate
            ? parseTime(scope.row.purchaseDate, '{y}-{m}-{d}')
            : ''
        },
        isShow: () => {
          return this.activeName !== '0'
        }
      },
      _stayPurchaseWeight: {
        prop: 'stayPurchaseWeight',
        label: '待采重量(KG)',
        minWidth: '120',
        align: 'right',
        isShow: () => {
          return this.activeName !== '0'
        }
      }
    }
    // 基本信息编辑区
    const formDataSource = {
      _supplier: {
        prop: 'supplier',
        itemType: 'select',
        label: '供应商',
        dataSource: [],
        clearable: true,
        disabled: false,
        valueType: 'object',
        valueKey: 'id',
        filterable: true,
        props: {
          label: 'supplierName',
          value: 'id'
        },
        rules: [{ required: true, message: '请选择供应商', trigger: 'blur' }],
        change: (val) => {
          var o = {}
          if (this.formDatas.supplier && this.list.length) {
            if (!val || String(val.id) !== String(this.formDatas.supplier.id)) {
              this.tableDataSource._tableForm.dataSource = []
            }
          }
          if (val) {
            o = {
              supplier: {
                label: val.supplierName,
                value: val.id,
                supplierName: val.supplierName,
                id: val.id
              },
              supplierMan: null,
              supplierPhone: '',
              supplierAddr: null
            }
            var el = -1
            if (val.payMode) {
              /* eslint-disable */
              el =
                this.payList &&
                this.payList.findIndex((i) => i.id == val.payMode);
            }
            el !== -1 ? (o.payType = this.payList[el].payWay) : "";
            this.getSupplierInfo(val.id);
          } else {
            o = {
              supplier: null,
              supplierMan: null,
              supplierPhone: "",
              supplierAddr: null,
              payMode: "",
            };
          }
          this.formDatas = { ...this.formDatas, ...o };
        },
      },
      _supplierMan: {
        prop: "supplierMan",
        itemType: "select",
        dataSource: [],
        valueType: "object",
        valueKey: "id",
        disabled: true,
        label: "联系人",
        props: {
          label: "name",
          value: "id",
        },
        placeholder: "请先选择供应商",
        change: (val) => {
          var o = {};
          if (val) {
            o = {
              supplierMan: {
                label: val.name,
                value: val.id,
                name: val.name,
                id: val.id,
              },
            };
          } else {
            o = {
              supplierMan: null,
            };
          }
          o.supplierPhone = val.phone || "";
          this.formDatas = { ...this.formDatas, ...o };
        },
      },
      _supplierPhone: {
        prop: "supplierPhone",
        itemType: "input",
        disabled: true,
        label: "联系方式",
        placeholder: "联系人选择后生成",
      },
      _supplierAddr: {
        prop: "supplierAddr",
        itemType: "select",
        dataSource: [],
        disabled: true,
        label: "供应商地址",
        placeholder: "请先选择供应商",
        valueType: "object",
        valueKey: "id",
        props: {
          label: "address",
          value: "id",
        },
        change: (val) => {
          var o = {};
          if (val) {
            o.supplierAddr = {
              label: val.address,
              value: val.id,
              address: val.address,
              id: val.id,
            };
          } else {
            o.supplierAddr = null;
          }
          this.formDatas = { ...this.formDatas, ...o };
        },
      },
      _payType: {
        prop: "payType",
        itemType: "input",
        disabled: true,
        label: "付款方式",
        placeholder: "供应商选择后生成",
      },
      _contractNumber: {
        prop: "contractNumber",
        itemType: "input",
        disabled: true,
        label: "合同编号",
        placeholder: "采购订单提交后生成",
      },
      _payCurrency: {
        prop: "payCurrency",
        itemType: "select",
        label: "付款币别",
        valueType: "object",
        valueKey: "id",
        dataSource: [],
        props: {
          label: "name",
          value: "id",
          disabled: "disabled",
        },
        itemStyle: "height:36px",
        rules: [
          { required: true, message: "请选择付款币别", trigger: "change" },
        ],
        clearable: true,
        disabled: false,
        change: (val) => {
          var o = {};
          if (val) {
            o.payCurrency = val;
            if (val.id === 1) {
              o.exchangeRate = 1;
              // 付款币种为人民币，显示为1，且不可编辑
            } else {
              this.$delete(this.formDatas, "exchangeRate");
            }
          } else {
            o.payCurrency = null;
            o.exchangeRate = undefined;
          }
          this.formDataSource["_elRow"]["children"]["_exchangeRate"].disabled =
            val.id === 1;
          this.formDatas = { ...this.formDatas, ...o }
        },
      },
      _elRow: {
        children: {
          _exchangeRate: {
            span: 24,
            prop: "exchangeRate",
            itemType: "input",
            label: "汇率",
            placeholder: "1美元($)=汇率*人民币(￥)",
            clearable: true,
            disabled: false,
            rules: [
              {
                required: true,
                trigger: "blur",
                validator: validRuleExchangeRate,
              },
            ],
            trim: (val) => {
              return filterVal(val);
            },
            change: (val) => {
              const reg = /^\d+\.?\d{0,2}$/;
              if (val && parseFloat(val) !== 0 && reg.test(val)) {
                this.resetBill();
              } else {
              }
            },
          },
          _tip: {
            span: 24,
            itemType: "view",
            className: "el-form-item",
            text: "",
            style: {
              color: "#0986FF",
              "font-size": "12px",
              "margin-bottom": "10px",
              "margin-top": "-18px",
              "padding-left": "30%",
            },
          },
        },
      },
    };
    // 基本信息
    const baseDataSource = {
      _classification: {
        prop: "classification", // 第一版默认纱
        itemType: "input",
        label: "采购类型：",
        readonly: true,
        formater: (scope) => {
          return "纱";
        },
      },
      _payer: {
        prop: "payer",
        itemType: "input",
        label: "付款方：",
        readonly: true,
      },
      _shipperName: {
        prop: "shipperName",
        itemType: "input",
        label: "货主：",
        readonly: true,
      },
    };
    // 采购清单
    const columns = {
      _selection: {
        type: "selection",
        // fixed: "left",
        isShow: () => {
          return this.type !== "detail";
        },
      },
      ...publicColumns,
      ...{
        _purchaseWeight: {
          labelClassName: "product-is-request",
          className: "product-no-request",
          label: "本次采购重量(KG)",
          width: "160px",
          index: () => {
            return 1;
          },
          prop: "purchaseWeight",
          editOptions: {
            itemType: "input",
            labelWidth: "0",
            itemProp: "purchaseWeight",
            rules: [
              {
                required: true,
                trigger: ["change"],
                validator: validRule,
              },
            ],
            trim: (val) => {
              return filterVal(val);
            },
            change: (value, v1, v2, v3, scope) => {
              scope.row.purchaseWeight = value;
              const reg = /^\d+\.?\d{0,2}$/;
              if (value && parseFloat(value) !== 0 && reg.test(value)) {
                this.getSum({
                  obj: this.tableDataSource._tableForm.dataSource[scope.$index],
                  property: "purchaseWeight",
                  val: value,
                  index: scope.$index,
                });
              }
            },
          },
          align: "right",
          formater: (scope) => {
            this.$set(scope.row, "edit", this.type !== "detail");
            if (this.type === "detail") {
              return numRecursion(scope.row.purchaseWeight);
            } else {
              return scope.row.purchaseWeight;
            }
          },
        },
        _deliveryDate: {
          prop: "deliveryDate",
          labelClassName: "product-is-request",
          className: "product-no-request",
          label: "交期",
          width: "160px",
          editOptions: {
            type: "date",
            itemType: "date",
            format: "yyyy-MM-dd",
            valueFormat: "timestamp",
            placeholder: "请选择交期",
            labelWidth: "0",
            pickerOptions: {
              disabledDate(time) {
                return time.getTime() < Date.now() - 1 * 24 * 60 * 60 * 1000;
              },
            },
            rules: [
              {
                required: true,
                message: "请选择交期",
                trigger: ["change"],
              },
            ],
            change: (val, v1, v2, v3, scope) => {
              this.$set(
                this.tableDataSource._tableForm.dataSource[scope.$index],
                "deliveryDate",
                val
              );
            },
          },
          formater: (scope) => {
            this.$set(scope.row, "edit", this.type !== "detail");
            return scope.row.deliveryDate
              ? parseTime(scope.row.deliveryDate, "{y}-{m}-{d}")
              : "";
          },
        },
        _unitPrice: {
          prop: "unitPrice",
          labelClassName: "product-is-request",
          className: "product-no-request",
          label: "含税单价",
          width: "160px",
          editOptions: {
            itemType: "input",
            labelWidth: "0",
            rules: [
              {
                required: true,
                trigger: ["change"],
                validator: validRule,
              },
            ],
            trim: (val) => {
              return filterVal(val);
            },
            change: (value, v1, v2, v3, scope, index) => {
              scope.row.unitPrice = value;
              const reg = /^\d+\.?\d{0,2}$/;
              if (value && parseFloat(value) !== 0 && reg.test(value)) {
                // 单价*汇率
                const j = this.form.exchangeRate
                  ? this.$utils.getFloat(value, 2) *
                    this.$utils.getFloat(this.form.exchangeRate, 2)
                  : 0;
                this.$set(
                  this.tableDataSource._tableForm.dataSource[scope.$index],
                  "rmbUnitPrice",
                  this.$utils.getFloat(j, 2)
                );
                // 总价*汇率
                this.getSum({
                  obj: this.tableDataSource._tableForm.dataSource[scope.$index],
                  property: "unitPrice",
                  val: value,
                  index: scope.$index,
                });
              }
            },
          },
          align: "right",
          formater: (scope) => {
            this.$set(scope.row, "edit", this.type !== "detail");
            if (this.type === "detail") {
              return numRecursion(scope.row.unitPrice);
            } else {
              return scope.row.unitPrice;
            }
          },
        },
        _rmbUnitPrice: {
          prop: "rmbUnitPrice",
          label: "含税单价(￥)",
          width: "160px",
          editOptions: {
            itemType: "input",
            labelWidth: "0",
            disabled: true,
          },
          align: "right",
          formater: (scope) => {
            this.$set(scope.row, "edit", this.type !== "detail");
            if (this.type === "detail") {
              return numRecursion(scope.row.rmbUnitPrice);
            } else {
              return scope.row.rmbUnitPrice;
            }
          },
        },
        _totalPrice: {
          prop: "totalPrice",
          label: "总价",
          width: "160px",
          editOptions: {
            itemType: "input",
            labelWidth: "0",
            disabled: true,
          },
          align: "right",
          formater: (scope) => {
            this.$set(scope.row, "edit", this.type !== "detail");
            if (this.type === "detail") {
              return numRecursion(scope.row.totalPrice);
            } else {
              return scope.row.totalPrice;
            }
          },
        },
        _rmbTotalPrice: {
          prop: "rmbTotalPrice",
          label: "总价(￥)",
          width: "160px",
          editOptions: {
            itemType: "input",
            labelWidth: "0",
            disabled: true,
          },
          align: "right",
          formater: (scope) => {
            this.$set(scope.row, "edit", this.type !== "detail");
            if (this.type === "detail") {
              return numRecursion(scope.row.rmbTotalPrice);
            } else {
              return scope.row.rmbTotalPrice;
            }
          },
        },
      },
    };
    const sumConfig = {
      m1: {
        title: "本次采购重量(KG)：",
        num: 0,
        tipStyle: "color:#0986FF",
        formater: (val) => {
          return numRecursion(val)
        }
      },
      m2: {
        title: "总价(元)：",
        num: 0,
        formater: (val) => {
          return numRecursion(val)
        }
      },
      m3: {
        title: "总价：",
        num: 0,
        formater: (val) => {
          return numRecursion(val)
        }
      }
    }
    const progressConfig = {
      itemType: "dialog",
      visible: false,
      title: "采购进度",
      width: "520px",
      cancelHidden: true,
      okHidden: true,
      saveAndaddText: "我知道了",
      saveAndadd: () => {
        this.popOptions.visible = false;
      },
      close: () => {
        this.popOptions.visible = false;
      },
      components: { progressDetail },
      componentsOptions: {
        id: undefined,
      },
    };
    const operates = {
      label: "操作",
      isShow: () => {
        return this.type === "detail" && this.activeName === "0";
      },
      dataSource: [
        {
          isShow: () => false,
          label: "采购进度",
          handle: (scope, form, formDatas, setFormDatas) => {
            this.progressConfig.componentsOptions.id = scope.row.id;
            this.dialogType = "progress";
            this.popOptions.visible = true;
          },
        },
      ],
    };
    // 新增弹框操作按钮
    const addConfig = {
      itemType: "dialog",
      visible: false,
      title: "采购需求",
      width: "1160px",
      okText: "添加至采购清单",
      ok: () => {
        if (!this.addList.length) {
          this.$message({
            message: "请选择采购需求数据",
            type: "warning",
          });
          return;
        }
        var addArr = deepClone(this.addList);
        addArr.forEach((k) => {
          k.purchaseWeight = k.stayPurchaseWeight;
        });
        const arr = deepClone([
          ...this.tableDataSource._tableForm.dataSource,
          ...addArr,
        ]);
        this.tableDataSource._tableForm.dataSource = arr;
        this.addConfig.visible = false
      },
      close: () => {
        this.popOptions.visible = false;
      },
      cancel: (params) => {
        this.popOptions.visible = false;
      },
      formDatas: {},
      formOptions: {
        inline: true,
        className: "detail",
      },
      content: {
        _materiel: {
          prop: "materiel",
          itemType: "input",
          label: "纱线编码",
          clearable: true,
          placeholder: "请输入纱线编码",
          itemStyle,
        },
        _materielName: {
          prop: "materielName",
          itemType: "input",
          label: "纱名",
          clearable: true,
          placeholder: "请输入纱名",
          itemStyle,
          formater: (scope) => {
            return scope.row.materielInfo && scope.row.materielInfo.materielName
              ? scope.row.materielInfo.materielName
              : "-";
          },
        },
        _materielProperty: {
          prop: "materielProperty",
          itemType: "input",
          label: "纱属性",
          clearable: true,
          placeholder: "请输入纱属性",
          itemStyle,
          formater: (scope) => {
            return scope.row.materielInfo &&
              scope.row.materielInfo.materielProperty
              ? scope.row.materielInfo.materielProperty
              : "";
          },
        },
        _operate: {
          itemType: "operate",
          submitText: "查询",
          submitHandle: (params) => {
            var purchaseBeginDate = "";
            var purchaseEndDate = "";
            if (params.hasOwnProperty("purchaseDate") && params.purchaseDate) {
              purchaseBeginDate = params.purchaseDate[0];
              purchaseEndDate = params.purchaseDate[1];
            }
            const result = purchaseBeginDate
              ? { ...params, purchaseBeginDate, purchaseEndDate }
              : params;
            delete result.purchaseDate;
            this.addSearch = result;
            const pages = this.addConfig.content._demandTable.pagination;
            pages.pageSize = 20;
            pages.pageNum = 1;
            this.getAddList();
          },
          resetHandle: () => {
            this.addSearch = {};
          },
        },
        _purchaseDate: {
          prop: "purchaseDate",
          itemType: "date",
          type: "daterange",
          label: "需求交期",
          startPlaceholder: "开始日期",
          endPlaceholder: "结束日期",
          format: "yyyy-MM-dd",
          valueFormat: "timestamp",
          itemStyle,
          formater: (scope) => {
            const time = scope.row.purchaseDate
              ? parseTime(scope.row.purchaseDate, "{y}-{m}-{d}")
              : "";
            return time;
          },
        },
        _demandTable: {
          width: "1200px",
          height: "300px",
          layout: true,
          prop: "demandTable",
          itemType: "table",
          pagination: {
            currentChange: (val) => {
              const pages = this.addConfig.content._demandTable.pagination;
              pages.pageNum = val;
              this.getAddList();
            },
            sizeChange: (val) => {
              const pages = this.addConfig.content._demandTable.pagination;
              pages.pageSize = val;
              pages.pageNum = 1;
              this.getAddList();
            },
          },
          selectionChange: (val) => {
            this.addList = val;
          },
          columns: {
            _selection: {
              type: "selection",
              prop: "selection"
            },
            ...publicColumns,
          },
          dataSource: [],
          itemStyle: {
            width: "100%",
            'margin-bottom':0
          },
        },
      },
    };
    const barConfig = {
      _audit: {
        type: "primary",
        text: "审核",
        submit: () => {
          this.approveConfig.visible = true;
        },
        isShow: () => {
          return (
            (this.status === 2 || this.status === 8) &&
            this.type === "detail" &&
            this.$permission(["pms:purchaseOrder:audit"])
          );
        },
      },
      _submit: {
        type: "primary",
        text: "提交",
        submit: () => {
          this.$refs.searchForm.$refs.dynamicValidateForm.validate((valid) => {
            if (valid) {
              if (!this.list.length) {
                this.$message({
                  message: "采购清单不能为空",
                  type: "warning",
                });
                return;
              }
              this.$refs.table.$refs.dynamicValidateForm.validate(
                valid1 => {
                  if (valid1) {
                    if (this.type === 'change') {
                      const index = this.$refs.table.dynamicValidateFormRuleForm._privateTableForm.findIndex(e => {
                        const obj = this.changeOrder && this.changeOrder.list.find(ele => ele.id === e.id)
                        return e.purchaseWeight > obj.purchaseWeight
                      })
                      if (index > -1) {
                        this.$message.error(`清单第${index + 1}行本次采购重量不能大于原始数据`)
                        return
                      }
                    }
                    if (this.type === "detail") {
                      const reg = /^\d+\.?\d{0,2}$/;
                      for (var j = 0; j < this.list.length; j++) {
                        const k = this.list[j];
                        const purchaseWeight = !!(
                          k.purchaseWeight &&
                          parseFloat(k.purchaseWeight) !== 0 &&
                          reg.test(k.purchaseWeight)
                        )
                        const unitPrice = !!(
                          k.unitPrice &&
                          parseFloat(k.unitPrice) !== 0 &&
                          reg.test(k.unitPrice)
                        )
                        if (
                          !(k.deliveryDate && purchaseWeight && unitPrice)
                        ) {
                          this.$message({
                            message: "请前往编辑页补充采购清单数据",
                            type: "warning"
                          })
                          return
                        }
                      }
                      this.submit("submit")
                    } else {
                      // 变更 做数据是否校验
                      if (this.type === 'change') {
                        this.changeFn()
                      } else {
                        this.submit("submit")
                      }
                    }
                  } else {
                    this.$message({
                      message: "请检查清单信息",
                      type: "warning"
                    })
                  }
                }
              )
            } else {
              this.$message({
                message: "请前往编辑页补充必填信息",
                type: "warning",
              });
            }
          })
        },
        isShow: () => {
          return (
            (this.status === 1 || this.status === 0 || this.type === 'change') &&
            this.$permission(["pms:purchaseOrder:submit"])
          )
        }
      },
      _revoke: {
        type: "",
        text: "撤回",
        submit: () => {
          this.$confirm("确认撤回该采购订单？", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning",
            customClass: "OrderDetail",
          })
            .then(() => {
              this.revokeHandle();
            })
            .catch(() => {});
        },
        isShow: () => {
          return (
            (this.status === 2 || this.status === 8) &&
            this.type === "detail" &&
            this.$permission(["pms:purchaseOrder:revoke"])
          );
        },
      },
      _edit: {
        type: "primary",
        text: "编辑",
        submit: () => {
          this.$router.push({
            path: "/pms/order-management/edit",
            query: { id: this.purchaseOrderNumber },
          });
        },
        isShow: () => {
          return (
            this.status === 1 &&
            this.type === "detail" &&
            this.$permission(["pms:purchaseOrder:add"])
          );
        },
      },
      _del: {
        type: "",
        text: "删除",
        submit: (row) => {
          this.$confirm("确认删除该采购订单？", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning",
            customClass: "OrderDetail",
          })
            .then(() => {
              this.delOrder();
            })
            .catch(() => {});
        },
        isShow: () => {
          return (
            this.status === 1 &&
            this.type === "detail" &&
            this.$permission(["pms:purchaseOrder:delete"])
          );
        },
      },
      _upload: {
        type: "primary",
        upload: {
          options: {
            customText: "上传合同",
            action: "/common/file/upload",
            showFileList: false,
            data: {
              bizType: "PMS_PURCHASE_ORDER",
              bizId: this.id || "",
            },
            uploadChange: () => {}, // 勿删
            onSuccess: (res) => {
              const keyId = res.data.id;
              this.uploadFile(keyId, {
                bizType: res.data.bizType,
                file: res.data.viewUrl,
              });
            },
            accept: ".png,.PNG,.jpg,.JPG,.pdf,.PDF",
            beforeUpload: (file) => {
              const types = [
                "image/jpg",
                "image/png",
                "application/pdf",
                "image/jpeg",
              ];
              const isJPG = types.includes(file.type);
              if (!isJPG) {
                this.$message.error("仅支持上传格式为PDF、JPG、PNG的合同!");
                return false;
              }
            },
          },
        },
        submit: () => {},
        isShow: () => {
          return (
            this.status === 3 &&
            this.type === "detail" &&
            this.$permission(["pms:purchaseOrder:upload"])
          );
        },
      },
      _cancel: {
        type: "",
        text: "取消",
        submit: () => {
          this.$confirm("确认取消该采购订单？", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning",
            customClass: "OrderDetail",
          })
            .then(() => {
              this.cancelHandle();
            })
            .catch(() => {});
        },
        isShow: () => {
          return (
            (this.status === 2 || this.status === 3) &&
            this.type === "detail" &&
            this.$permission(["pms:purchaseOrder:cancel"])
          );
        },
      },
      _down: {
        type: "",
        text: "下载",
        submit: () => {},
        isShow: () => {
          return false;
          // && !this.$permission(["pms:purchaseOrder:download"]); //本次迭代不做
        },
      },
      _save: {
        text: "保存",
        submit: () => {
          this.submit("add");
        },
        isShow: () => {
          return (
            (this.status === 1 || this.status === 0) &&
            this.type !== "detail" &&
            this.$permission(["pms:purchaseOrder:add"])
          );
        },
      },
      _chenge: {
        type: "primary",
        text: "变更",
        submit: () => {
          this.$router.push({
            path: "/pms/order-management/change",
            query: { id: this.purchaseOrderNumber }
          })
        },
        isShow: () => this.status === 4 && this.type === 'detail' && this.$permission(["pms:purchaseOrder:change"])
      },
      _cancelform: {
        type: "",
        text: "取消",
        isShow: () => {
          return (
            (this.status === 1 || this.status === 0 || this.type === 'change') && this.type !== "detail"
          )
        },
        submit: () => {
          this.$router.go(-1)
        }
      },
      _back: {
        type: "",
        text: "返回",
        isShow: () => {
          return this.type === "detail";
        },
        submit: () => {
          this.$router.push("/pms/order-management/list");
        }
      }
    }
    const pagination = {
      currentChange: (val) => {
        const pages = this.tableDataSource._tableForm.pagination;
        pages.pageNum = val;
        this.getList(this.activeName === "1" ? "detailPage" : "billPage");
      },
      sizeChange: (val) => {
        const pages = this.tableDataSource._tableForm.pagination;
        pages.pageSize = val;
        pages.pageNum = 1;
        this.getList(this.activeName === "1" ? "detailPage" : "billPage");
      },
    };
    const approveConfig = {
      visible: false,
      pass: () => {
        this.onload();
      },
      back: () => {
        this.onload();
      },
    };
    return {
      approveConfig,
      barConfig,
      addConfig,
      progressConfig,
      sumConfig,
      columns,
      activeName: "1",
      tableOptions: {
        validate: (prop, flag, errmsg) => {},
        popError: (prop, flag, errmsg) => {},
      },
      tableDataSource: {
        _tableForm: {
          // editType:'pop',
          className: "detail",
          prop: "_privateTableForm",
          itemType: "table-form",
          // tooltipEffect: "light",
          dataSource: [],
          selectionChange: (val) => {
            this.listDel = val;
          },
          rowClick: (row, column, event) => {},
          columns,
          operates,
          pagination: null,
        },
      },
      tableFormDatas: {},
      formDataSource,
      formDatas: {},
      formOptions: {
        inline: true,
        className: "edit-base-form",
        syncDataHandle: (val) => {
          this.form = deepClone(val);
          this.isShowTip();
          this.isShowCode();
        },
      },
      baseDataSource,
      baseDatas: {
        classification: "纱",
        payer: "佛山市智布互联纺织有限公司",
        shipperName: "佛山市智布互联纺织有限公司",
      },
      baseOptions: {
        inline: true,
        className: "msg-content",
      },
      dialogType: "new",
      listDel: [],
      msg: {},
      payList: [],
      addList: [],
      parseTime,
      pagination,
      addSearch: {},
      id: "",
      form: {},
      versionInfoLength: '',
      versionInfoArray: [],
      changeOrder: null
    };
  },
  computed: {
    pages() {
      return this.tableDataSource._tableForm.pagination;
    },
    status() {
      return this.msg && this.msg.status ? this.msg.status : 0;
    },
    list() {
      return this.tableDataSource._tableForm.dataSource || [];
    },
    type() {
      const arr = [
        this.formDataSource._supplier,
        this.formDataSource._payCurrency,
        this.formDataSource._supplierMan,
        this.formDataSource._supplierAddr,
        this.formDataSource._elRow.children._exchangeRate,
      ];
      arr.forEach((el) => {
        this.$set(el, "disabled", this.$route.params.type === "detail");
      });
      if (this.$route.params.type === "detail") {
        for (const key in this.formDataSource) {
          this.$set(this.formDataSource[key], "placeholder", "");
        }
        this.pagination.pageNum = 1;
        this.pagination.pageSize = 20;
        this.$set(
          this.tableDataSource._tableForm,
          "pagination",
          this.pagination
        );
      } else {
        if (this.$route.params.type === "change") {
          const data = [
            ['_supplier', true],
            ['_supplierMan', true],
            ['_supplierAddr', true]
          ]
          data.forEach(e => {
            this.formDataSource[e[0]].disabled = e[1]
          })
        }
        this.$set(this.tableDataSource._tableForm, "pagination", null);
      }
      this.formOptions.showMessage = this.$route.params.type !== "detail";
      return this.$route.params.type;
    },
    popOptions() {
      return this.dialogType === "progress"
        ? this.progressConfig
        : this.addConfig;
    },
    purchaseOrderNumber() {
      return this.$route.query.id;
    },
    supplier() {
      if (!this.form.supplier) {
        return null;
      }
      return {
        label: this.form.supplier.supplierName,
        value: this.form.supplier.id,
      };
    },
    supplierAddr() {
      if (!this.form.supplierAddr) {
        return null;
      }
      return {
        label: this.form.supplierAddr.address,
        value: this.form.supplierAddr.id,
      };
    },
    supplierMan() {
      if (!this.form.supplierMan) {
        return null;
      }
      return {
        label: this.form.supplierMan.name,
        value: this.form.supplierMan.id,
      };
    },
    payCurrency() {
      if (!this.form.payCurrency) {
        return null;
      }
      return {
        label: this.form.payCurrency.name,
        value: this.form.payCurrency.id,
      };
    },
  },
  created() {
    this.getConstant();
  },
  methods: {
    async versionInfoChange(val) {
      this.versionInfoLength = val
      const res = await api.info({
        revisionNum: val,
        purchaseOrderNumber: this.purchaseOrderNumber
      });
      this.getInfo(res)
    },
    //显示汇率转换
    isShowTip() {
      if (
        this.form &&
        this.form.payCurrency &&
        this.form.payCurrency.unit &&
        this.form.exchangeRate
      ) {
        this.getTip();
      }
    },
    isShowCode() {
      if (this.form && this.form.payCurrency && this.form.payCurrency.code) {
        // 选择汇率后表头单位
        var columns = this.tableDataSource._tableForm.columns;
        this.$set(
          columns["_unitPrice"],
          "label",
          `含税单价(${this.form.payCurrency.code})`
        );
        this.$set(
          columns["_totalPrice"],
          "label",
          `总价(${this.form.payCurrency.code})`
        );
      }
    },
    add() {
      if (!this.formDatas.supplier) {
        this.$message.warning('请先选择供应商')
        return
      }
      const fun = () => {
        this.dialogType = "new";
        this.popOptions.visible = true;
        this.addList = [];
      };
      const pages = this.addConfig.content._demandTable.pagination;
      pages.pageSize = 20;
      pages.pageNum = 1;
      this.getAddList(fun);
    },
    onload() {
      this.$router.push({
        path: "/pms/order-management/detail",
        query: {
          id: this.purchaseOrderNumber,
          timestamp: new Date().getTime(),
        },
      });
    },
    getTip() {
      const tip = `1${this.form.payCurrency.unit}(${
        this.form.payCurrency.code
      })=${this.form.exchangeRate || ""}人民币(￥)`;
      // 1（付款币种）=（汇率）人民币，如1美元=6.83人民币
      this.$set(this.formDataSource["_elRow"]["children"]["_tip"], "text", tip);
    },
    async delOrder() {
      const res = await api.del(this.id);
      if (res.code === 200) {
        this.$message({
          message: "删除成功",
          type: "success",
        });
        this.outFun({
          type: "DEL",
          url: "/pms/purchaseOrder/delete/",
          pro: "purchaseOrderNumber",
          remark: this.msg,
          beforeText: `在'采购管理-采购订单'删除一条记录`,
          beforeCode: `: 删除的id对象${{ id: this.id }}`,
        });
        this.$router.push("/pms/order-management/list");
      } else {
        this.$message({
          message: res.message,
          type: "error",
        });
      }
    },
    resetBill() {
      this.list.forEach((i, index) => {
        const j =
          this.$utils.getFloat(i.unitPrice, 2) *
            this.$utils.getFloat(this.form.exchangeRate, 2) || 0;
        this.$set(i, "rmbUnitPrice", this.$utils.getFloat(j, 2));
        this.getSum({
          obj: i,
          property: "unitPrice",
          val: i.unitPrice,
          index: index,
        });
      });
      this.getTotal();
    },
    getSum(params) {
      const { obj, property, val, index } = params;
      this.$set(obj, property, val);
      const o = this.tableDataSource._tableForm.dataSource[index];

      const i =
        val *
          o[property === "purchaseWeight" ? "unitPrice" : "purchaseWeight"] ||
        0;
      this.$set(o, "totalPrice", this.$utils.getFloat(i, 2));
      // 换算RMB
      var k = this.form.exchangeRate
        ? this.$utils.getFloat(i, 2) *
          this.$utils.getFloat(this.form.exchangeRate, 2)
        : 0;
      this.$set(o, "rmbTotalPrice", this.$utils.getFloat(k, 2));
      this.getTotal();
    },
    getTotal() {
      // 两个合计计算
      var sum = 0;
      var rmbSum = 0;
      var totalWeight = 0;
      this.list.forEach((i) => {
        sum =
          this.$utils.getFloat(sum, 2) + this.$utils.getFloat(i.totalPrice, 2);
        rmbSum =
          this.$utils.getFloat(rmbSum, 2) +
          this.$utils.getFloat(i.rmbTotalPrice, 2);
        totalWeight =
          this.$utils.getFloat(totalWeight, 2) +
          this.$utils.getFloat(i.purchaseWeight, 2);
      });
      this.$set(this.sumConfig.m1, "num", this.$utils.getFloat(totalWeight, 2));
      this.$set(this.sumConfig.m2, "num", this.$utils.getFloat(rmbSum, 2));
      this.$set(this.sumConfig.m3, "num", this.$utils.getFloat(sum, 2));
    },
    getParams() {
      const res = {
        id: this.id || undefined,
        supplier: this.supplier, // 供应商
        supplierAddr: this.supplierAddr, // 供应商地址
        supplierMan: this.supplierMan, // 供应商联系人
        supplierPhone: this.form.supplierPhone || undefined, // 供应商电话
        payType: this.form.payType || undefined, // 付款方式
        payCurrency: this.payCurrency, // ??? 币别
        exchangeRate: this.form.exchangeRate, // 汇率
        purchaseWeight: this.sumConfig.m1.num || 0, // 采购重量
        totalPrice: this.sumConfig.m2.num || 0, // 总价
        rmbTotalPrice: this.sumConfig.m3.num || 0, // 总价（元）
        shipperName: "佛山市智布互联纺织有限公司",
        payer: "佛山市智布互联纺织有限公司",
        classification: 1,
      };
      return res;
    },
    async changeFn(data) {
      const formDatas = this.$refs.searchForm.dynamicValidateFormRuleForm
      const arr = ['id', 'field_1', 'deliveryDate', 'purchaseWeight', 'unitPrice']
      const res = this.changeOrder.list.every(e => {
        const strFn = obj => arr.reduce((a, n) => a += obj[n] || '', '')
        return this.$refs.table.dynamicValidateFormRuleForm._privateTableForm.find(ele => strFn(e) === strFn(ele))
      })
      const isChange1 = formDatas.exchangeRate * 1 !== this.changeOrder.exchangeRate * 1
      const isChange2 = formDatas.payCurrency.id * 1 !== this.changeOrder.payCurrency.value * 1
      if (!(!res || isChange1 || isChange2)) {
        this.$message.warning('当前没有变更， 无需提交')
        return
      } else {
        const list = this.$refs.table.dynamicValidateFormRuleForm._privateTableForm
        const parmas = {
          purchaseOrderNumber: this.purchaseOrderNumber,
          payCurrency: {
            label: formDatas.payCurrency.name,
            value: formDatas.payCurrency.id
          },
          exchangeRate: formDatas.exchangeRate,
          billDetailList: this.changeOrder.list.map(e => {
            const obj = list.find(ele => e.id === ele.id)
            return obj && { ...obj, changeType: 1 } || { ...e, changeType: 2 }
          })
        }
        await api.change(parmas)
        this.$message.success('保存成功')
        this.outFun({
          oldData: { ...this.changeOrder.msg, billDetailList: this.changeOrder.list },
          newData: parmas,
          type: "UPDATE",
          url: "/pms/purchaseOrder/change",
          pro: "id",
          beforeText: `在'采购管理-采购订单'变更了${this.purchaseOrderNumber}`,
          beforeCode: { ...this.changeOrder.msg, billDetailList: this.changeOrder.list },
          afterCode: parmas,
        })
        this.onload()
      }
    },
    async submit(type) {
      const res = await api[type]({
        ...this.getParams(),
        ...{ billDetailList: this.tableDataSource._tableForm.dataSource },
      });
      if (res.code === 200) {
        this.$message({
          type: "success",
          message: type === "add" ? "保存成功" : "提交成功",
        });
        if (this.type === "new") {
          this.$router.push({
            path: "/pms/order-management/detail",
            query: { id: res.data.purchaseOrderNumber },
          });
          // description内容描述: {beforeText: '在'用户中心-角色管理'新增一条记录', beforeCode: 成功参数{}}, 后面beforeCode改为传返回id对象
          this.outFun({
            type: "INSERT",
            url: "/pms/purchaseOrder/add",
            pro: "id",
            remark: res.data,
            beforeText: `在'采购管理-采购订单'新增一条记录`,
            beforeCode: `: 成功新增${res.data}`,
          });
        } else {
          this.outFun({
            oldData: this.msg,
            newData: {
              ...this.getParams(),
              ...{ billDetailList: this.tableDataSource._tableForm.dataSource },
            },
            type: "UPDATE",
            url: "/pms/purchaseOrder/submit",
            pro: "id",
            remark: res.data,
            beforeText: `在'采购管理-采购订单'提交审核了一条记录`,
            beforeCode: `: 成功提交采购订单${res.data}}`,
          });
          this.type === "edit"
            ? this.$router.push({
                path: "/pms/order-management/detail",
                query: { id: this.purchaseOrderNumber },
              })
            : this.onload();
        }
      } else {
      }
    },
    async getSupplierInfo(id, callback) {
      const res = await api.getSupplier({ id: id });
      if (res.code === 200) {
        const supplierExtra = res.data.supplierExtra || {};
        const contact = supplierExtra.contact || [];
        const address = supplierExtra.address || [];
        this.$set(this.formDataSource._supplierMan, "dataSource", contact);
        this.$set(this.formDataSource._supplierAddr, "dataSource", address);
        if (callback) {
          const res = await callback();
          this.formDatas = { ...this.formDatas, ...(res.data || {}) };
        }
      }
    },
    async getConstant() {
      // 供应商、币别、付款方式
      const res0 = await Promise.all([
        apiPub.getSupplier({ supplierCategory: 0 }),
        apiPub.getCurrency(),
        api.getPayMode(),
      ]);
      const res = res0[0];
      const resCurrency = res0[1];
      const resPay = res0[2];

      this.formDataSource._supplier.dataSource = res.data || []; //供应商
      if (resCurrency && resCurrency.data) {
        //币别
        var arr = resCurrency.data || [];
        arr.forEach((j) => {
          j.disabled = j.enabled === "N" ? true : false;
        });
        this.formDataSource._payCurrency.dataSource = arr;
      }
      this.payList = resPay.data.list || []; //付款方式

      if (this.purchaseOrderNumber) {
        const res = await api.info({ 
          revisionNum: '',
          purchaseOrderNumber: this.purchaseOrderNumber
         });
        this.getInfo(res)
        const revision = await api.revision(this.purchaseOrderNumber)
        this.versionInfoArray = revision.data || []
        this.versionInfoLength = this.versionInfoArray[0] || ''
      } else {
        const a = localStorage.getItem("pmsDemandList");
        if (a) {
          const arr =
            JSON.parse(a) && JSON.parse(a).result.length
              ? JSON.parse(a).result
              : [];
          arr.length &&
            arr.forEach((k) => {
              k.purchaseWeight = k.stayPurchaseWeight;
            });
          this.tableDataSource._tableForm.dataSource = arr;
        }
      }
      localStorage.removeItem("pmsDemandList");
    },
    async getAddList(callback) {
      var pages = this.addConfig.content._demandTable.pagination;
      const res = await demandList.list({ ...this.addSearch, supplierId: this.formDatas.supplier.value }, {
        pageSize: pages.pageSize || 20,
        pageNum: pages.pageNum || 1,
        status: 3,
      });
      if (res.code === 200) {
        this.$set(
          this.addConfig.content._demandTable,
          "dataSource",
          res.data.list
        );
        this.addConfig.content._demandTable.pagination = {
          ...this.addConfig.content._demandTable.pagination,
          dataTotal: res.data.total || 0,
          currentPage: res.data.pageNum,
          pageNum: res.data.pageNum,
          pageSize: res.data.pageSize,
        };
        callback && callback();
      }
    },
    async getList(property) {
      const res = await api[property](
        {
          purchaseOrderNumber: this.msg.purchaseOrderNumber,
          revisionNum: this.versionInfoLength
        },
        this.pages
          ? { pageSize: this.pages.pageSize, pageNum: this.pages.pageNum }
          : null
      );
      if (res.code === 200) {
        this.$set(
          this.tableDataSource._tableForm,
          "dataSource",
          res.data.list || []
        );
        if (this.type === 'change') {
          this.changeOrder = JSON.parse(JSON.stringify({ ...this.msg, list: [...res.data.list] || [] }))
        }
        if (this.pages) {
          this.tableDataSource._tableForm.pagination = {
            ...this.tableDataSource._tableForm.pagination,
            dataTotal: res.data.total || 0,
            currentPage: res.data.pageNum,
            pageNum: res.data.pageNum,
            pageSize: res.data.pageSize,
          };
        }
        this.getTotal()
      } else {
        this.$message({
          type: "error",
          message: res.message,
        });
      }
    },
    handleClick(val) {
      this.activeName = val;
      const pages = this.tableDataSource._tableForm.pagination;
      if (pages) {
        pages.pageSize = 20;
        pages.pageNum = 1;
      }
      var property = "billPage";
      if (this.activeName === "1") {
        property = "detailPage";
      }
      if (this.pages) {
        this.tableDataSource._tableForm.pagination.pageNum = 1;
        this.tableDataSource._tableForm.pagination.pageSize = 20;
      }
      this.getList(property);
    },
    del() {
      if (this.listDel.length) {
        this.listDel.forEach((i) => {
          const k = this.tableDataSource._tableForm.dataSource.findIndex(
            (j) => j.id === i.id
          );
          if (k !== -1) {
            this.tableDataSource._tableForm.dataSource[k]["del"] = true;
          }
        });
        this.tableDataSource._tableForm.dataSource = this.tableDataSource._tableForm.dataSource.filter(
          (i) => !i.del
        );
        this.getTotal();
      } else {
        this.$message({
          type: "info",
          message: "请选择数据",
        });
      }
    },
    getInfo(res) {
      if (res.code === 200) {
        this.id = res.data.id;
        this.msg = res.data || {};
        this.approveConfig.procInstId = this.msg.status === 8 ? this.msg.changeApprovalProcessKey : this.msg.approvalProcessKey
        this.approveConfig.workflowId = this.msg.purchaseOrderNumber
        res.data.classification = "纱"

        const property = (obj, pro, val, label) => {
          // select返回值增加属性
          if (obj[pro] && obj[pro].value) {
            obj[pro][val] = obj[pro]["value"] = parseInt(obj[pro]["value"]);
            obj[pro][label] = obj[pro]["label"];
          } else {
            obj[pro] = null;
          }
        };
        property(res.data, "supplier", "id", "supplierName"); // 供应商
        const fun = (res, property) => {
          //返回值是label,value与获取列表不一致,初始赋值
          return function () {
            property(res.data, "supplierMan", "id", "name"); // 联系人
            property(res.data, "supplierAddr", "id", "address"); // 地址
            property(res.data, "payCurrency", "id", "name"); // 币别
            return res;
          };
        };
        // 表头处理
        var columns = this.tableDataSource._tableForm.columns;
        var payCurrency = this.formDataSource._payCurrency.dataSource;
        var i = -1;
        if (res.data.payCurrency && res.data.payCurrency.value) {
          i = payCurrency.findIndex((j) => j.id == res.data.payCurrency.value);
          if (i !== -1) {
            this.$set(
              columns["_unitPrice"],
              "label",
              `含税单价(${payCurrency[i].code})`
            );
            this.$set(
              columns["_totalPrice"],
              "label",
              `总价(${payCurrency[i].code})`
            );
          }
        }
        // 供应商关联详情
        if (res.data.supplier && res.data.supplier.id) {
          this.getSupplierInfo(res.data.supplier.id, fun(res, property));
        } else {
          this.formDatas = {
            ...this.formDatas,
            ...res.data,
            ...{ payCurrency: payCurrency[i] },
          };
        }
        // 表格总计
        this.sumConfig.m1.num = res.data.purchaseWeight || 0;
        this.sumConfig.m2.num = res.data.rmbTotalPrice || 0;
        this.sumConfig.m3.num = res.data.totalPrice || 0;
        if (this.pages) {
          //详情显示页码，编辑页全量显示
          this.tableDataSource._tableForm.pagination.pageNum = 1;
          this.tableDataSource._tableForm.pagination.pageSize = 20;
        }
        this.getList("detailPage");
      }
    },
    async revokeHandle() {
      const res = await api.revoke(this.id);
      if (res.code === 200) {
        this.outFun({
          oldData: this.msg,
          newData: {
            ...this.msg,
            ...{ status: 1 },
          },
          type: "EXAMINE",
          url: "/pms/purchaseOrder/cancel/",
          pro: "id",
          remark: {
            ...this.msg,
            ...{ status: 1 },
          },
          beforeText: `在'采购管理-采购订单' 撤回了采购订单${JSON.stringify({
            id: this.id,
          })}}`,
        });
        this.$message({
          type: "success",
          message: "撤回成功",
        });
        this.onload();
      } else {
        this.$message({
          type: "error",
          message: res.message,
        });
      }
    },
    async cancelHandle() {
      const res = await api.cancel(this.id);
      if (res.code === 200) {
        this.outFun({
          oldData: this.msg,
          newData: {
            ...this.msg,
            ...{ status: 5 },
          },
          type: "UPDATE",
          url: "/pms/purchaseOrder/cancel/",
          pro: "id",
          remark: {
            ...this.msg,
            ...{ status: 5 },
          },
          beforeText: `在'采购管理-采购订单' 取消了采购订单${JSON.stringify({
            id: this.id,
          })}}`,
        });
        this.$message({
          type: "success",
          message: "取消成功",
        });
        this.onload();
      } else {
        this.$message({
          type: "error",
          message: res.message,
        });
      }
    },
    async uploadFile(key, remark) {
      const res = await api.upload({ contractKey: key }, this.id);
      if (res.code === 200) {
        this.outFun({
          type: "IMPORT",
          url: "/pms/purchaseOrder/upload/",
          remark: remark,
          beforeText: `在'采购管理-采购订单'上传一条记录`,
        });
        this.$message({
          type: "success",
          message: "上传文件成功",
        });
        this.onload();
      } else {
        this.$message({
          type: "error",
          message: res.message,
        });
      }
    },
  },
};
</script>

<style scoped lang="scss">
.OrderDetail {
  padding: 0 20px;
  .activeBtn {
    border: 1px solid #0986ff;
    color: #0986ff;
    z-index: 2;
  }
  .head-base {
    display: flex;
    line-height: 65px;
    justify-content: space-between;
    .msg-lf {
      font-size: 18px;
      color: #151222;
    }
    .msg-lr {
      display: flex;
      font-size: 12px;
      color: #666666;
      > div {
        margin-left: 20px;
      }
    }
  }
  .card {
    .btnGroup {
      margin-right: 20px;
      /deep/.el-button {
        margin-top: -12px;
      }
    }
  }
  .edit-table {
    .sumBtnGroup {
      padding: 16px 0 16px 20px;
    }
  }
}
</style>
<style lang='scss'>
@import "@/styles/base.scss";
.OrderDetail {
  .el-message-box__status {
    top: 0;
  }
  .detail {
    width: 100%;
    .el-table th {
      background-color: #f5f7fa;
      padding: 0;
      .cell {
        height: 40px;
        line-height: 40px;
      }
    }
    .el-table td {
      height: 40px;
      line-height: 40px;
      padding: 0;
    }
  }
  .card {
    .basic-top {
      display: flex;
      align-items: center;
      padding: 20px 20px 0;
      .versionClass {
        margin-left: 12px;
        width: 100px;
      }
    }
    .msg-content {
      background: #fff;
      padding: 0 20px 0;
      margin: 16px 0;
      > div {
        width: 30%;
      }
      .el-form-item {
        margin-bottom: 18px;
      }
      .el-input__inner {
        border: none;
      }
      .el-form-item__label {
        color: #888e9e;
        padding: 0;
      }
      .el-form-item__content {
        .el-input__inner {
          color: #474747;
          padding: 0;
        }
      }
    }
  }
  .edit-base {
    .edit-base-form {
      background: #fff;
      padding: 20px 20px 0 10px;
      margin: 16px 0;
      > div {
        width: 24%;
      }
      .el-row {
        .el-form-item {
          width: 100%;
        }
      }
    }
  }
}
</style>
