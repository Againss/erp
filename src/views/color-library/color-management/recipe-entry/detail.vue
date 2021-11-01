<!--
 * @Author: anthony
 * @Date: 2020-11-03 10:13:59
 * @LastEditors: zhengjin
 * @LastEditTime: 2021-07-09 17:20:10
 * @Descripttion: 色号配方录入
-->
<template>
  <div class="product-detail-content">
    <div class="product-detail-top">
      <div class="product-item-codeinfo">
        <div class="code-item">
          智布色号：{{ order.code }}
          <span v-show="!order.code" class="code-der">保存后自动生成</span>
        </div>
      </div>
      <div v-if="$route.path.includes('show')" class="description">
        <span>操作人：{{ order.caozuoName }}</span>
        <span
          class="ml-10"
        >操作时间：{{
          $filters.parseTime(order.caozuoTime || 0, "{y}-{m}-{d} {h}:{i}")
        }}</span>
        <span
          class="ml-10"
        >状态：
          <span v-if="getStatus === 3" class="Pending">{{ order.status }}</span>
          <span v-if="getStatus === 4" class="Audited">{{ order.status }}</span>
        </span>
      </div>
    </div>
    <div class="product-item-content">
      <div class="product-content-title">基本信息</div>
      <div class="product-content-info">
        <item
          ref="formfirstPart"
          :is-edit="hasEdit"
          :form-data="formDatafirstPart"
          :order="order"
        />
      </div>
    </div>
    <div class="product-item-content">
      <div class="color-mes">
        <el-tabs
          v-model="activeName"
          style="padding-left: 20px"
          @tab-click="handleClick"
        >
          <el-tab-pane label="色号配方" name="first">
            <div>
              <item
                ref="formfirstPart"
                :is-edit="isEdit ? true : false"
                :form-data="formDatasecPart"
                :order="order"
                class="qianchuli"
              />
            </div>
            <div class="recipe-title">
              <div class="title-div">配方内容</div>
              <el-button
                v-if="isEdit"
                type="primary"
                class="addBtn"
                size="small"
                @click="dialogHandler"
              >批量添加</el-button>
            </div>

            <div class="recipe-table">
              <div class="recipe-content">
                <cs-custom-form
                  ref="ratioTable"
                  tooltip-effect="dark"
                  :data-source="yarnDataSource"
                  class="table"
                  border
                />
              </div>
            </div>
            <div class="recipe-title">工艺参数</div>
            <div class="recipe-content">
              <cs-custom-form
                ref="processparameters"
                tooltip-effect="dark"
                :data-source="dataProcess"
                class="recipe-table process"
              />
            </div>
          </el-tab-pane>
          <el-tab-pane label="色牢度" name="second">
            <cs-custom-form
              ref="colorFastnessForm"
              tooltip-effect="dark"
              :data-source="colorFastnessData"
              :options="formOtions"
              :form-datas="formDatas"
              class="second-table"
            />
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
    <div class="product-btn-group">
      <div class="btn-groups">
        <el-button v-show="isEdit" size="small" @click="cancel">取消</el-button>
        <el-button
          v-show="isEdit"
          size="small"
          type="primary"
          @click="submitForm"
        >提交</el-button>
        <el-button
          v-show="!isEdit && getStatus === 3"
          v-permission="['color:Api:ColorManage:Formula:update']"
          size="small"
          type="primary"
          @click="setEdit"
        >编辑</el-button>
        <el-button
          v-show="!isEdit && (getStatus === 3 || getStatus === 4)"
          v-permission="['color:Api:ColorManage:ColorManage:copy']"
          size="small"
          type="primary"
          @click="copyOrder()"
        >复制</el-button>
        <el-button
          v-show="!isEdit && getStatus === 3"
          v-permission="['color:Api:ColorManage:ColorManage:approve']"
          size="small"
          @click="reviewBtn"
        >审核</el-button>
      </div>
    </div>
    <dialogs :options="dialogOptions" :form-otions="formOtions" />
  </div>
</template>
<script>
import item from '@/views/product-center/components/detaiItem'
import dialogs from '@/views/product-center/components/dialog'
import inputSelect from './components/input-select'
import logMethods from '@/views/product-center/mixin/log-methods'
import { colourClothList, dyeingIngredients, storePeifang, show, update, approve } from './api'
export default {
  components: {
    item,
    dialogs
  },
  mixins: [logMethods],
  data() {
    // 公用验证正则
    // const commonBlurReg = this.$getRules({ trigger: ['blur'], message: '两边不能同时为空' })
    const checkEmpty = (rule, value, callback) => {
      // 色牢度不能两边都为空的判断
      const str = rule.field.substr(0, rule.field.length - 3)
      const strLast = rule.field.substr(-3, 3)
      let strLeft = ''
      let strRight = ''
      if (strLast === 'Min') {
        strRight = str + 'Max'
        strLeft = rule.field
      } else {
        strLeft = str + 'Min'
        strRight = rule.field
      }
      if (!(this.colorFastness[strRight] - 0) && !(this.colorFastness[strLeft] - 0)) {
        callback(new Error('两边不能同时为空'))
      } else {
        this.$refs.colorFastnessForm.$refs.dynamicValidateForm.clearValidate(strLeft)
        this.$refs.colorFastnessForm.$refs.dynamicValidateForm.clearValidate(strRight)
        callback()
      }
    }
    const checkData = (rule, value, callback) => {
      // >0且≤5的数字，保留小数点后一位
      var reg = /^(([1-4])((\.\d)?)|(0\.[1-9])|5|5.0)$/
      if (!reg.test(value) && value) {
        callback(new Error('只能输入>0且≤5的一位小数'))
      } else {
        callback()
      }
    }
    const temNum = (rule, value, callback) => {
      // 正整数
      var reg = /^[+]{0,1}(\d+)$/
      if (!reg.test(value) && value) {
        callback(new Error('请输入正整数'))
      } else {
        callback()
      }
    }
    const checkedPH = (rule, value, callback) => {
      var reg = /^(([1-9]|(1[0-3]))((\.\d)?)|(0\.[1-9])|14|14.0|0|0.0)$/
      if (!reg.test(value) && value) {
        callback(new Error('请输入0-14的ph值，最多带一位小数'))
      } else {
        callback()
      }
    }
    // 添加染料助剂
    const dialogOptions = {
      tableSelection: true,
      visible: false,
      title: '染料助剂',
      okText: '确定',
      cancelText: '取消',
      closed: (params) => {
        this.dialogHandle(params)
      }, // 关闭选择
      ok: (params) => {
        this.addclothCombination(params)
        this.dialogHandle(false)
      }, // 确定选择
      searchFormDatas: {}, // 搜索默认参数
      searchData: [
        {
          prop: 'name',
          itemType: 'input',
          label: '染料助剂名称',
          itemStyle: { width: '50%' },
          placeholder: '请输入染料助剂名称'
        },
        {
          itemType: 'operate',
          submitHandle: (params) => {
            this.getList(params)
            this.searchFormDatas = params
          },
          submitText: '查询',
          resetHandle: () => {
            console.log('重置重置')
          }
        }
      ], // 搜索字段
      dataSource: [], // table数据
      columns: [
        {
          prop: 'dyestuffAssistType.name',
          label: '染料助剂类型',
          minWidth: '200',
          formater: (scope) => {
            return scope.row.dyestuffAssistType.name
          }
        },
        {
          prop: 'name',
          label: '染料助剂名称',
          minWidth: '140',
          showOverflowTooltip: true,
          formater: (scope) => {
            return scope.row.name
          }
        }
      ],
      pagination: {
        currentChange: (val) => {
          // 切换页数
          this.getList({
            pageSize: this.dialogOptions.pagination.pageSize || 10,
            page: val
          })
        },
        sizeChange: (val) => {
          // 切换条数
          this.getList({
            pageSize: val,
            page: this.dialogOptions.pagination.page || 1
          })
        }
      }
    }
    // 配方表格表头的配置信息
    const columns = [
      {
        prop: 'seq',
        label: '#',
        width: '60'
      },
      {
        prop: 'bdDyeIngredient',
        labelClassName: 'product-is-request',
        className: 'product-no-request',
        label: '染色成份',
        formDatas: {},
        valueKey: 'name',
        labelWidth: '0',
        editOptions: {
          itemType: 'select',
          filterable: true,
          labelWidth: '0',
          rules: [
            { required: true, message: '染色成份不能为空', trigger: ['blur'] }
          ],
          dataSource: [],
          visibleChange: (flag) => {
            if (flag) {
              this.setSelectData()
            }
          },
          change: (value, v1, v2, v3, scope) => {
            this.yarnDataSource[0].dataSource[scope.$index].bdDyeIngredientUuid = value
            const flag = this.yarnDataSource[0].columns[1].editOptions.dataSource.find(item => {
              return item.value === value
            })
            if (flag) {
              this.$set(this.yarnDataSource[0].dataSource[scope.$index], 'bdDyeIngredient', flag.name)
            }
            // const arrar = []
            // 新增成份都是一样的成份一样按照染料色光id 排序 染料色光id一致则按照染料助剂名称字母顺序 排序
            // this.sort(this.yarnDataSource[0].dataSource, [{ name: 'bdDyeIngredientUuid', sort: false }, { name: 'dyeColorCode', sort: true }, { name: 'bdDyestuffAssistName', sort: true }])
            // this.yarnDataSource[0].dataSource.forEach((item, index) => {
            //   // 序号
            //   if (index === 0) {
            //     // 选择第一个染色成份时，序号为1
            //     item.seq = 1
            //   } else {
            //     // 比对第一个和第二个的染色成份一致时，第二个数据的序号与第一个序号一样
            //     if (index > 0 && (item.bdDyeIngredientUuid === this.yarnDataSource[0].dataSource[index - 1].bdDyeIngredientUuid)) {
            //       item.seq = this.yarnDataSource[0].dataSource[index - 1].seq
            //     } else {
            //       if (!item.bdDyeIngredientUuid) {
            //         // 未选择染色成份时，序号为空
            //         item.seq = ''
            //       } else {
            //         // 比对第一个和第二个的染色成份不一致时，序号 +1
            //         item.seq = this.yarnDataSource[0].dataSource[index - 1].seq + 1
            //       }
            //     }
            //   }
            // })
            this.sortYarndataSource()
            this.sameArrpush()
          }
        }
      },
      {
        prop: 'bdDyestuffAssistName',
        label: '染料助剂名称',
        minWidth: '150'
      },
      {
        prop: 'value',
        label: '用量',
        minWidth: '140',
        components: {
          inputSelect
        },
        componentsOptions: {
          isSelect: true,
          Handler: (item, scope, quantity) => {
            this.$set(this.yarnDataSource[0].dataSource[scope.$index], quantity, item)
          }
        }
      },
      {
        prop: 'itemNo',
        label: '料号',
        minWidth: '100',
        editOptions: {
          itemType: 'input',
          maxlength: 20,
          labelWidth: '0',
          change: (value, v1, v2, v3, scope) => {
            this.$set(this.yarnDataSource[0].dataSource[scope.$index], 'itemNo', value)
            this.$refs.ratioTable.setDynamicValidateFormRuleForm({ tableForm: this.yarnDataSource[0].dataSource })
          }
        }
      }
    ]
    // 工艺参数表头信息
    const Processcolumns = [
      {
        prop: 'seq',
        label: '#',
        width: '60'
      },
      {
        prop: 'bdDyeIngredient',
        label: '染色成份',
        minWidth: '120'
      },
      {
        prop: 'liquor',
        label: '浴比',
        minWidth: '150',
        rules: [
          {
            validator: checkData,
            trigger: ['blur']
          }
        ],
        components: {
          inputSelect
        },
        componentsOptions: {
          Handler: (item, scope, type) => {
            this.$set(this.dataProcess[0].dataSource[scope.$index], type, item)
          }
        }
      },
      {
        prop: 'temperature',
        label: '温度(℃)',
        minWidth: '140',
        editOptions: {
          itemType: 'input',
          labelWidth: '0',
          rules: [
            {
              validator: temNum,
              trigger: ['blur']
            }
          ],
          change: (value, v1, v2, v3, scope) => {
            this.$set(this.dataProcess[0].dataSource[scope.$index], 'temperature', value)
            // oninput="if(this.value.length==1){this.value=this.value.replace(/[^1-9]/g,'')}else{this.value=this.value.replace(/\D/g,'')}"
            this.$refs.processparameters.setDynamicValidateFormRuleForm({ tableForm: this.yarnDataSource[0].dataSource })
          }
        }
      },
      {
        prop: 'time',
        label: '时间(min)',
        minWidth: '100',
        editOptions: {
          itemType: 'input',
          labelWidth: '0',
          rules: [
            {
              validator: temNum,
              trigger: ['blur']
            }
          ],
          change: (value, v1, v2, v3, scope) => {
            this.$set(this.dataProcess[0].dataSource[scope.$index], 'time', value)
            this.$refs.processparameters.setDynamicValidateFormRuleForm({ tableForm: this.yarnDataSource[0].dataSource })
          }
        }
      },
      {
        prop: 'ph',
        label: 'PH值',
        minWidth: '100',
        editOptions: {
          itemType: 'input',
          labelWidth: '0',
          maxlength: 4,
          rules: [
            {
              validator: checkedPH,
              trigger: ['change']
            }
          ],
          change: (value, v1, v2, v3, scope) => {
            this.$set(this.dataProcess[0].dataSource[scope.$index], 'ph', value)
            this.$refs.processparameters.setDynamicValidateFormRuleForm({ tableForm: this.yarnDataSource[0].dataSource })
          }
        }
      }
    ]

    // 工艺参数
    const dataProcess = [
      {
        prop: 'tableFormaProcess',
        itemType: 'table-form',
        size: 'mini',
        dataSource: [],
        columns: Processcolumns,
        headerCellStyle: {
          background: '#F5F7FA!important'
        }
      }
    ]
    const dataList = [
      {
        label: '删除',
        isShow: true,
        handle: params => {
          this.$confirm(' 你确认要删除该条配方数据吗？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          })
            .then(async(scope) => {
              this.deleteData(params)
            })
        }
      }
    ]
    // 表头操作栏的配置信息
    const operates = {
      label: '操作',
      width: '200',
      dataSource: dataList
    }
    // 色号配方
    const yarnDataSource = [
      {
        prop: 'tableForm',
        itemType: 'table-form',
        size: 'mini',
        dataSource: [],
        columns: columns,
        operates: operates,
        headerCellStyle: {
          background: '#F5F7FA!important'
        }
      }
    ]
    const colorFastnessData = [
      {
        prop: 'sunExposeMin',
        itemType: 'input',
        label: '日晒:',
        labelWidth: '80px',
        disabled: true,
        itemStyle: { width: '12%' },
        rules: [
          {
            required: true,
            validator: checkEmpty,
            trigger: ['blur']
          },
          {
            validator: checkData,
            trigger: ['change']
          }
        ],
        change: (value, v1, v2, v3, scope) => {
          this.colorFastness.sunExposeMin = value
        }
      },
      {
        prop: 'sunExposeMax',
        itemType: 'input',
        label: '~',
        disabled: true,
        itemStyle: { width: '10%', 'margin-right': '120px' },
        rules: [
          {
            validator: checkEmpty,
            trigger: ['change']
          },
          {
            validator: checkData,
            trigger: ['change']
          }
        ],
        change: (value, v1, v2, v3, scope) => {
          this.colorFastness.sunExposeMax = value
        }
      },

      {
        prop: 'washingMin',
        itemType: 'input',
        label: '水洗:',
        labelWidth: '80px',
        disabled: true,
        itemStyle: { width: '12%' },
        rules: [
          {
            required: true,
            validator: checkEmpty,
            trigger: ['change']
          },
          {
            validator: checkData,
            trigger: ['change']
          }
        ],
        change: (value, v1, v2, v3, scope) => {
          this.colorFastness.washingMin = value
        }
      },
      {
        prop: 'washingMax',
        itemType: 'input',
        label: '~',
        disabled: true,
        itemStyle: { width: '10%', 'margin-right': '120px' },
        rules: [
          {
            validator: checkEmpty,
            trigger: ['blur']
          },
          {
            validator: checkData,
            trigger: ['blur']
          }
        ],
        change: (value, v1, v2, v3, scope) => {
          this.colorFastness.washingMax = value
        }
      },
      {
        prop: 'waterStainMin',
        itemType: 'input',
        label: '水渍:',
        labelWidth: '80px',
        disabled: true,
        itemStyle: { width: '12%' },
        rules: [
          {
            validator: checkData,
            trigger: ['change']
          }
        ],
        change: (value, v1, v2, v3, scope) => {
          this.colorFastness.waterStainMin = value
        }
      },
      {
        prop: 'waterStainMax',
        itemType: 'input',
        label: '~',
        disabled: true,
        itemStyle: { width: '10%', 'margin-right': '120px' },
        rules: [
          {
            validator: checkData,
            trigger: ['change']
          }
        ],
        change: (value, v1, v2, v3, scope) => {
          this.colorFastness.waterStainMax = value
        }
      },

      {
        prop: 'sweatStainMin',
        itemType: 'input',
        label: '汗渍:',
        labelWidth: '80px',
        disabled: true,
        itemStyle: { width: '12%' },
        rules: [
          {
            validator: checkData,
            trigger: ['change']
          }
        ],
        change: (value, v1, v2, v3, scope) => {
          this.colorFastness.sweatStainMin = value
        }
      },
      {
        prop: 'sweatStainMax',
        itemType: 'input',
        label: '~',
        disabled: true,
        itemStyle: { width: '10%', 'margin-right': '120px' },
        rules: [
          {
            validator: checkData,
            trigger: ['change']
          }
        ],
        change: (value, v1, v2, v3, scope) => {
          this.colorFastness.sweatStainMax = value
        }
      },

      {
        prop: 'wetFrictionMin',
        itemType: 'input',
        label: '湿摩擦:',
        labelWidth: '80px',
        disabled: true,
        itemStyle: { width: '12%' },
        rules: [
          {
            required: true,
            validator: checkEmpty,
            trigger: ['change']
          },
          {
            validator: checkData,
            trigger: ['change']
          }
        ],
        change: (value, v1, v2, v3, scope) => {
          this.colorFastness.wetFrictionMin = value
        }
      },
      {
        prop: 'wetFrictionMax',
        itemType: 'input',
        label: '~',
        disabled: true,
        itemStyle: { width: '10%', 'margin-right': '120px' },
        rules: [
          {
            validator: checkEmpty,
            trigger: ['blur']
          },
          {
            validator: checkData,
            trigger: ['blur']
          }
        ],
        change: (value, v1, v2, v3, scope) => {
          this.colorFastness.wetFrictionMax = value
        }
      },

      {
        prop: 'nonChlorineBleachingMin',
        itemType: 'input',
        label: '(非)氯漂:',
        labelWidth: '80px',
        disabled: true,
        itemStyle: { width: '12%' },
        rules: [
          {
            validator: checkData,
            trigger: ['change']
          }
        ],
        change: (value, v1, v2, v3, scope) => {
          this.colorFastness.nonChlorineBleachingMin = value
        }
      },
      {
        prop: 'nonChlorineBleachingMax',
        itemType: 'input',
        label: '~',
        disabled: true,
        itemStyle: { width: '10%', 'margin-right': '120px' },
        rules: [
          {
            validator: checkData,
            trigger: ['change']
          }
        ],
        change: (value, v1, v2, v3, scope) => {
          this.colorFastness.nonChlorineBleachingMax = value
        }
      },

      {
        prop: 'salivaMin',
        itemType: 'input',
        label: '唾液:',
        labelWidth: '80px',
        disabled: true,
        itemStyle: { width: '12%' },
        rules: [
          {
            validator: checkData,
            trigger: ['change']
          }
        ],
        change: (value, v1, v2, v3, scope) => {
          this.colorFastness.salivaMin = value
        }
      },
      {
        prop: 'salivaMax',
        itemType: 'input',
        label: '~',
        disabled: true,
        itemStyle: { width: '10%', 'margin-right': '120px' },
        rules: [
          {
            validator: checkData,
            trigger: ['change']
          }
        ],
        change: (value, v1, v2, v3, scope) => {
          this.colorFastness.salivaMax = value
        }
      },

      {
        prop: 'chlorineResistanceMin',
        itemType: 'input',
        label: '耐氯:',
        labelWidth: '80px',
        disabled: true,
        itemStyle: { width: '12%' },
        rules: [
          {
            validator: checkData,
            trigger: ['change']
          }
        ],
        change: (value, v1, v2, v3, scope) => {
          this.colorFastness.chlorineResistanceMin = value
        }
      },
      {
        prop: 'chlorineResistanceMax',
        itemType: 'input',
        label: '~',
        disabled: true,
        itemStyle: { width: '10%', 'margin-right': '120px' },
        rules: [
          {
            validator: checkData,
            trigger: ['change']
          }
        ],
        change: (value, v1, v2, v3, scope) => {
          this.colorFastness.chlorineResistanceMax = value
        }
      },

      {
        prop: 'seawaterResistanceMin',
        itemType: 'input',
        label: '耐海水:',
        labelWidth: '80px',
        disabled: true,
        itemStyle: { width: '12%' },
        rules: [
          {
            validator: checkData,
            trigger: ['change']
          }
        ],
        change: (value, v1, v2, v3, scope) => {
          this.colorFastness.seawaterResistanceMin = value
        }
      },
      {
        prop: 'seawaterResistanceMax',
        itemType: 'input',
        label: '~',
        disabled: true,
        itemStyle: { width: '10%', 'margin-right': '120px' },
        rules: [
          {
            validator: checkData,
            trigger: ['change']
          }
        ],
        change: (value, v1, v2, v3, scope) => {
          this.colorFastness.seawaterResistanceMax = value
        }
      },

      {
        prop: 'lightPerspirationMin',
        itemType: 'input',
        label: '光汗:',
        labelWidth: '80px',
        disabled: true,
        itemStyle: { width: '12%' },
        rules: [
          {
            validator: checkData,
            trigger: ['change']
          }
        ],
        change: (value, v1, v2, v3, scope) => {
          this.colorFastness.lightPerspirationMin = value
        }
      },
      {
        prop: 'lightPerspirationMax',
        itemType: 'input',
        label: '~',
        disabled: true,
        itemStyle: { width: '10%', 'margin-right': '120px' },
        rules: [
          {
            validator: checkData,
            trigger: ['change']
          }
        ],
        change: (value, v1, v2, v3, scope) => {
          this.colorFastness.lightPerspirationMax = value
        }
      },

      {
        prop: 'oxygenBleachingMin',
        itemType: 'input',
        label: '氧漂:',
        labelWidth: '80px',
        disabled: true,
        itemStyle: { width: '12%' },
        rules: [
          {
            validator: checkData,
            trigger: ['change']
          }
        ],
        change: (value, v1, v2, v3, scope) => {
          this.colorFastness.oxygenBleachingMin = value
        }
      },
      {
        prop: 'oxygenBleachingMax',
        itemType: 'input',
        label: '~',
        disabled: true,
        itemStyle: { width: '10%', 'margin-right': '120px' },
        rules: [
          {
            validator: checkData,
            trigger: ['change']
          }
        ],
        change: (value, v1, v2, v3, scope) => {
          this.colorFastness.oxygenBleachingMax = value
        }
      },

      {
        prop: 'soakWaterMin',
        itemType: 'input',
        label: '泡水:',
        labelWidth: '80px',
        disabled: true,
        itemStyle: { width: '12%' },
        rules: [
          {
            validator: checkData,
            trigger: ['change']
          }
        ],
        change: (value, v1, v2, v3, scope) => {
          this.colorFastness.soakWaterMin = value
        }
      },
      {
        prop: 'soakWaterMax',
        itemType: 'input',
        label: '~',
        disabled: true,
        itemStyle: { width: '10%', 'margin-right': '120px' },
        rules: [
          {
            validator: checkData,
            trigger: ['change']
          }
        ],
        change: (value, v1, v2, v3, scope) => {
          this.colorFastness.soakWaterMax = value
        }
      }

    ]
    const formDatasecPart = [
      {
        name: 'bdPretreatmentIdName',
        type: 'select-search',
        label: '前处理',
        searchValue: 'name',
        valueKey: 'name',
        notEdit: false,
        placeholder: '请选择前处理',
        apiUrl: 'color/api/colorBd/pretreatment/all',
        optionsLabel: 'name',
        optionsValue: 'id',
        requestFormat: 'list',
        requestMode: 'post',
        changeSelectVal: (e) => {
          this.$refs['formfirstPart'].resetData({
            bdPretreatmentIdName: e.data.name
          })
          this.order.bdPretreatmentIdName = e.data.name
          this.order.bdPretreatmentUuid = e.data.uuid
        }
      }
    ]
    // 附加信息编辑
    const formDatafirstPart = [
      // {
      //   name: 'code',
      //   type: 'input',
      //   label: '智布色号',
      //   valueKey: 'code'
      // },
      {
        name: 'colorPlateOrderCode',
        type: 'input',
        label: '色板单号'
      },
      {
        name: 'customerColor',
        type: 'input',
        label: '客户颜色'
      },
      {
        name: 'clothName',
        type: 'input',
        label: '布类',
        valueKey: 'code'
      },
      {
        name: 'ingredientRatio',
        type: 'input',
        label: '成份比例'
      },
      {
        name: 'requirmentValue',
        type: 'input',
        label: '工艺要求'
      },
      {
        name: 'purposeValue',
        type: 'input',
        label: '用途'
      },
      {
        name: 'firstLightValue',
        type: 'input',
        label: '1st对色光源'
      },
      {
        name: 'secondLightValue',
        type: 'input',
        label: '2nd对色光源'
      },
      {
        name: 'thirdLightValue',
        type: 'input',
        label: '3rd对色光源'
      },
      {
        name: 'colorManageYarnValue',
        type: 'input',
        label: '纱信息'
      },
      {
        name: 'dyeType',
        type: 'input',
        label: '染色类型'
      },
      {
        name: 'colorGrade',
        type: 'input',
        label: '色级'
      }
    ]
    return {
      formDatafirstPart,
      formDatasecPart,
      hasEdit: false,
      order: {},
      activeName: 'first',
      colorFastnessData,
      yarnDataSource,
      dataProcess,
      isEdit: false,
      getStatus: 0,
      formOtions: {
        inline: true
      },
      formDatas: {},
      dialogOptions,
      colorFastness: {}, // 色牢度
      operates
    }
  },
  created() {
    this.initOrder()
    if (this.$route.params.id && this.$route.path.includes('edit') || this.$route.params.id && this.$route.path.includes('add')) {
      this.isEdit = true
      this.colorFastnessData.map((item) => {
        item.disabled = false
        return item
      }) || []
    }
    if (this.$route.params.id && this.$route.path.includes('show')) {
      this.yarnDataSource[0].operates = null
    }
    if (this.$route.params.id) {
      this.getOrder(this.$route.params.id)
    }
  },
  methods: {
    // 处理添加删除操作工艺参数数据显示
    sameArrpush() {
      const arrar = []
      this.yarnDataSource[0].dataSource.forEach((val, index) => {
        if (arrar.every(o => o.bdDyeIngredientUuid !== val.bdDyeIngredientUuid)) {
          const objs = { ...val }
          objs.liquorRatioLower = 0
          objs.liquorRatioUpper = 0
          // objs.liquor = {
          //   liquorRatioLower: 0,
          //   liquorRatioUpper: 0
          // }
          arrar.push(objs)
        }
      })
      const ARR = []
      arrar.forEach((item) => {
        if (item.bdDyeIngredientUuid) {
          const flag = this.dataProcess[0].dataSource.find((value) => {
            if (value.bdDyeIngredientUuid === item.bdDyeIngredientUuid) {
              value.seq = item.seq
            }
            return value.bdDyeIngredientUuid === item.bdDyeIngredientUuid
          })
          if (flag) {
            ARR.push(flag)
          } else {
            ARR.push(item)
          }
        }
      })
      // 工艺参数数据
      this.dataProcess[0].dataSource = []
      this.dataProcess[0].dataSource.push(...ARR)
    },
    // 初始化
    initOrder() {
      this.order = {
        code: '',
        colorPlateTypeValue: '',
        requirmentValue: '',
        purposeValue: '', // 用途
        firstLightValue: '', // 1st对色光源
        secondLightValue: '', // 2nd对色光源
        thirdLightValue: '', // 3rd对色光源
        ingredientRatio: '', // 成分比例
        dyeType: '', // 染色类型
        bdDyestuffAssistUuid: [],
        status: '',
        colorManageYarn: [], // 纱信息
        colorManageYarnValue: '',
        bdPretreatmentIdName: '',
        bdPretreatmentUuid: '',
        caozuoName: '',
        caozuoTime: '',
        customerColor: '', // 客户颜色
        colorPlateOrderCode: ''// 色板单号
      }
    },
    async getOrder(id) {
      const res = await show({ id })
      this.order = Object.assign({}, res.data)
      this.setOrder(this.order)
    },
    setOrder(order) {
      this.colorFastnessData.forEach((item) => {
        item.disabled = !this.isEdit
      })
      this.order.code = order.colorManage.code || '' // 智布色号
      this.order.customerColor = order.colorManage.customerColor || '' // 客户颜色
      this.order.colorPlateOrderCode = order.colorManage.colorPlateOrderCode || '' // 色板单号
      this.order.status = order.colorManage.status === 3 ? '待审核' : (order.colorManage.status === 4 ? '已审核' : '') || '' // 状态
      this.getStatus = order.colorManage.status
      this.order.clothName = (order.colorManage.cloth && order.colorManage.cloth.name) || '' // 布类
      this.order.ingredientRatio = order.colorManage.ingredientRatio || '' // 成份比例
      const requirement = [...order.colorManage.requirement.function, ...order.colorManage.requirement.normal, ...order.colorManage.requirement.print, ...order.colorManage.requirement.styleFeel]
      this.order.requirmentValue = requirement.reduce((str, item) => {
        if (str) {
          // 普通已经拼好
          str += ',' + (item && (item.parent && item.type !== 1 ? (item.parent.name + '-' + item.name) : item.name))
        } else {
          str = (item && (item.parent && item.type !== 1 ? (item.parent.name + '-' + item.name) : item.name))
        }
        return str
      }, '') || ''
      // this.order.requirmentValue = order.colorManage.requirement && order.colorManage.requirement.data && order.colorManage.requirement.data.reduce((str, item) => {
      //   if (str) {
      //     str += ',' + (item && item.name)
      //   } else {
      //     str = item && item.name
      //   }
      //   return str
      // }, '') || '' // 工艺要求
      this.order.purposeValue = order.colorManage.purpose === 1 ? '衫身' : (order.colorManage.purpose === 2 ? '下栏' : '') // 用途
      this.order.firstLightValue = (order.colorManage.firstLight && order.colorManage.firstLight.name) || '' // 1st对色光源
      this.order.secondLightValue = (order.colorManage.secondLight && order.colorManage.secondLight.name) || '' // 2nd对色光源
      this.order.thirdLightValue = (order.colorManage.thirdLight && order.colorManage.thirdLight.name) || '' // 3rd对色光源
      // 纱信息
      this.order.colorManageYarnValue =
        order.colorManage.colorManageYarn.reduce((str, cru) => {
          const ingredientVal = cru.yarnElement && cru.yarnElement.reduce((s, c) => {
            const sv = ((c.ingredient && c.ingredient.name) || '') +
              c.ingredientRatio +
              '%'
            if (s) {
              s += '/' + sv
            } else {
              s = sv
            }
            return s
          }, '')
          const strv = ((cru.yarnType && cru.yarnType.name) || '') +
            ' ' +
            (cru.element && cru.element.name || '') +
            (cru.ingredientType === 1 ? ingredientVal : '100%')
          if (str) {
            str += '\n' + strv
          } else {
            str = strv
          }
          return str
        }, ''
        )
      this.order.dyeType = order.colorManage.dyeType && order.colorManage.dyeType.name
      this.order.colorGrade = order.formula && order.formula.bdColorGradeUuid === '0' ? '白色' : (order.formula && order.formula.colorGrade === '-1' ? '' : order.formula && order.formula.colorGrade && order.formula.colorGrade.name)// 色级
      if (order.formula && order.formula.colorFastness) {
        for (var i in order.formula.colorFastness) {
          order.formula.colorFastness[i] = (order.formula.colorFastness[i] - 0) || ''
        }
      }
      const arr1 = []
      if (order.formula) {
        order.formula.formulaContent.forEach((item, index) => {
          arr1.push(item.bdDyestuffAssistUuid)
        })
      }
      this.order.bdDyestuffAssistUuid = arr1
      this.formDatas = order.formula && order.formula.colorFastness || {} // 色牢度
      this.colorFastness = order.formula && order.formula.colorFastness || {} // 色牢度
      this.yarnDataSource[0].dataSource = order.formula && order.formula.formulaContent.map((item) => {
        item.edit = this.isEdit
        // item.value = {
        //   quantity: item.quantity,
        //   unit: item.unit
        // }
        return item
      }) || [] // 配方内容
      this.dataProcess[0].dataSource = []
      const arr = order.formula && order.formula.technologyParameter.map((item) => {
        item.temperature = item.temperature || ''
        item.time = item.time || ''
        item.ph = (!item.ph || item.ph === '0.0') ? '' : item.ph
        item.edit = this.isEdit
        // item.liquor = {
        //   liquorRatioLower: item.liquorRatioLower || 0,
        //   liquorRatioUpper: item.liquorRatioUpper || 0
        // }
        item.bdDyeIngredient = (item.dyeIngredient && item.dyeIngredient.name) || ''
        return item
      }) || [] // 工艺参数
      this.dataProcess[0].dataSource.push(...arr)
      this.order.bdPretreatmentIdName = order.formula && order.formula.pretreatment && order.formula.pretreatment.name || ''
      this.order.bdPretreatmentUuid = order.formula && order.formula.pretreatment && order.formula.pretreatment.id || ''
      this.order.caozuoName = order.colorManage && ((order.colorManage.updator && order.colorManage.updator.realName) ||
        (order.colorManage.creator && order.colorManage.creator.realName)) || ''
      this.order.caozuoTime = order.colorManage && order.colorManage.operatedTime || ''
    },
    // 审核
    reviewBtn() {
      this.$confirm(' 你确认要审核该数据吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async() => {
          const res = await approve({ id: this.$route.params.id })
          if (res.code === 200) {
            this.getOrder(this.$route.params.id)
            this.$message({
              message: '审核成功',
              type: 'success'
            })
            this.fetchLog(
              this.getLogMessages('UPDATE', '/color/api/color/colorManage/approve', 'color'),
              { id: this.$route.params.id, code: this.order.code },
              JSON.stringify({
                beforeText: `在'色号花号库-色号管理-配方录入'审核一条记录`,
                beforeCode: { id: this.$route.params.id, code: this.order.code }
              })
            )
          } else {
            this.$message({
              message: '审核失败',
              type: 'error'
            })
          }
        })
    },
    // 复制
    copyOrder() {
      this.$router.push(`/color-library/color-management/color-code/${this.$route.params.id}/copy`)
    },
    // 编辑
    setEdit() {
      this.isEdit = true
      this.colorFastnessData.forEach((item) => {
        item.disabled = false
      })
      // 重新渲染数据状态
      this.yarnDataSource[0].dataSource = this.yarnDataSource[0].dataSource.map((item) => {
        item.edit = true
        return item
      }) || [] // 配方内容
      this.dataProcess[0].dataSource = this.dataProcess[0].dataSource.map((item) => {
        item.edit = true
        return item
      }) || [] // 工艺参数
      if (this.isEdit) {
        this.yarnDataSource[0].operates = this.operates
      }
    },
    // 染色成份下拉数据
    async setSelectData(typeName, index, init = false) {
      let res = null
      res = await dyeingIngredients() // 染色成份
      // res = await colourClothList() // 随便走一个接口测试
      let data = []
      if (res.data && res.data.list.length) {
        data = res.data.list.map((item) => {
          item.label = item.name
          item.value = item.uuid
          return item
        })
      }
      this.colorYarnColorList = data
      this.$set(
        this.yarnDataSource[0].columns[1].editOptions,
        'dataSource',
        data
      )
    },
    // 获取列表
    async getList(data = {}) {
      const res = await colourClothList({
        ...this.dialogOptions.searchFormDatas,
        ...data
      })
      const userList = res.data.list || []
      this.$set(this.dialogOptions, 'dataSource', userList)
      this.$set(this.dialogOptions, 'pagination', {
        ...this.dialogOptions.pagination,
        dataTotal: res.data ? res.data.total : 0,
        ...data,
        currentPage: res.data.page,
        pageSize: res.data.pageSize
      })
    },
    // 根据多个字段排序
    sort(arr, fields) {
      const checkOrder = (left, right, fields) => {
        const field = fields.shift()
        if (field === undefined) return 0
        return left[field.name] === right[field.name] ? checkOrder(left, right, fields) : (field.sort ? (left[field.name] < right[field.name] ? -1 : 1) : (left[field.name] > right[field.name] ? -1 : 1))
      }
      return arr.sort((left, right) => {
        return checkOrder(left, right, JSON.parse(JSON.stringify(fields)))
      })
    },
    // 排序配方内容
    sortYarndataSource() {
      // 新增成份都是一样的成份一样按照染料色光id 排序 染料色光id一致则按照染料助剂名称字母顺序 排序
      this.sort(this.yarnDataSource[0].dataSource, [{ name: 'bdDyeIngredientUuid', sort: false }, { name: 'dyeColorCode', sort: true }, { name: 'bdDyestuffAssistName', sort: true }])
      this.yarnDataSource[0].dataSource.forEach((item, index) => {
        // 序号
        if (index === 0) {
          // 选择第一个染色成份时，序号为1
          item.seq = 1
        } else {
          // 比对第一个和第二个的染色成份一致时，第二个数据的序号与第一个序号一样
          if (index > 0 && (item.bdDyeIngredientUuid === this.yarnDataSource[0].dataSource[index - 1].bdDyeIngredientUuid)) {
            item.seq = this.yarnDataSource[0].dataSource[index - 1].seq
          } else {
            if (!item.bdDyeIngredientUuid) {
              // 未选择染色成份时，序号为空
              item.seq = ''
            } else {
              // 比对第一个和第二个的染色成份不一致时，序号 +1
              item.seq = this.yarnDataSource[0].dataSource[index - 1].seq + 1
            }
          }
        }
      })
    },
    // 染料助剂弹窗确定
    addclothCombination(params) {
      if (params && params.length) {
        const array = params.map((val, index) => {
          const objs = {
            bdDyeIngredient: '', // 染色成份
            bdDyeIngredientUuid: 0, // 染色成分id
            bdDyestuffAssistUuid: val.uuid, // 染色助剂名称id
            bdDyestuffAssistName: val.name, // 染色助剂名称
            edit: true,
            seq: '', // 序号
            itemNo: '', // 料号
            quantity: '',
            unit: val.dyestuffAssistType.name !== '助剂' ? '%' : '',
            // value: {
            //   quantity: '',
            //   unit: val.dyestuffAssistType.name !== '助剂' ? '%' : ''
            // }, // 数量
            dyeColor: val.dyeColor, // 染料色光
            dyeColorCode: val.dyeColor.code
          }
          return objs
        })
        // 新增成份都是一样的成份一样按照染料色光id 排序 染料色光id一致则按照染料助剂名称字母顺序 排序
        this.sort(array, [{ name: 'dyeColorCode', sort: true }, { name: 'bdDyestuffAssistName', sort: true }])
        this.order.bdDyestuffAssistUuid = []
        this.yarnDataSource[0].dataSource.push(...array)
        this.yarnDataSource[0].dataSource.forEach((item, index) => {
          this.order.bdDyestuffAssistUuid.push(item.bdDyestuffAssistUuid)
        })
        this.sameArrpush()
      }
    },
    // 删除配方内容
    deleteData(row) {
      this.order.bdDyestuffAssistUuid = []
      this.yarnDataSource[0].dataSource.splice(
        row.$index, 1
      )
      this.yarnDataSource[0].dataSource.forEach((item, index) => {
        this.order.bdDyestuffAssistUuid.push(item.bdDyestuffAssistUuid)
      })
      this.sortYarndataSource()
      this.sameArrpush()
      // const arrar = []
      // this.yarnDataSource[0].dataSource.forEach((val, index) => {
      //   if (arrar.every(o => o.bdDyeIngredientUuid !== val.bdDyeIngredientUuid)) {
      //     arrar.push(val)
      //   }
      // })
      // let ARR = []
      // arrar.forEach((item) => {
      //   let flag = this.dataProcess[0].dataSource.find((value)=> {
      //     return value.bdDyeIngredientUuid === item.bdDyeIngredientUuid
      //   })
      //   if(flag) {
      //     ARR.push(flag)
      //   } else {
      //     ARR.push(item)
      //   }
      // })
      // // 工艺参数数据
      // this.dataProcess[0].dataSource = []
      // this.dataProcess[0].dataSource.push(...ARR)
    },
    handleClick(tab, event) {
      console.log(tab, event)
    },
    dialogHandle(flag) {
      this.$set(this.dialogOptions, 'visible', flag)
    },
    dialogHandler() {
      this.getList()
      this.$set(this.dialogOptions, 'visible', true)
    },
    // 取消
    cancel() {
      this.$confirm(' 你确认要取消吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async() => {
          if (this.$route.path.includes('add')) {
            this.$router.push('/color-library/color-management/list')
          } else {
            this.isEdit = false
            // this.colorFastnessData.forEach((item) => {
            //   item.disabled = true
            // })
            // this.yarnDataSource[0].dataSource = this.yarnDataSource[0].dataSource.map((item) => {
            //   item.edit = false
            //   return item
            // }) || [] // 配方内容
            // this.dataProcess[0].dataSource = this.dataProcess[0].dataSource.map((item) => {
            //   item.edit = false
            //   return item
            // }) || [] // 工艺参数
            // this.yarnDataSource[0].operates = null
            this.getOrder(this.$route.params.id)
          }
        })
    },
    // 提交
    submitForm() {
      let pass = false
      let colorFastnessFormpass = false
      // 色牢度校验
      this.$refs.colorFastnessForm.form.validate(async(valid) => {
        if (valid) {
          colorFastnessFormpass = true
        } else {
          colorFastnessFormpass = false
          this.$message({
            message: '请正确填写色牢度',
            type: 'warning'
          })
          return
        }
      })
      // 工艺参数校验
      let processparameterspass = false
      this.$refs.processparameters.form.validate(async(valid) => {
        if (valid) {
          processparameterspass = true
        } else {
          processparameterspass = false
          this.$message({
            message: '请正确填写工艺参数信息',
            type: 'warning'
          })
          return
        }
      })
      if (this.yarnDataSource[0].dataSource.length > 0) {
        // 配方内容校验
        this.$refs.ratioTable.form.validate(async(valid) => {
          if (valid) {
            pass = true
          } else {
            pass = false
            // this.$message({
            //   message: '请选择染色成份',
            //   type: 'warning'
            // })
            return
          }
        })
      } else {
        this.$message({
          message: '请添加配方内容',
          type: 'warning'
        })
        return
      }
      // 校验工艺参数的浴比不能只填写一边
      const flagArr = []
      if (this.dataProcess[0].dataSource.length > 0) {
        this.dataProcess[0].dataSource.forEach((item, index) => {
          if ((item.liquorRatioLower && !item.liquorRatioUpper) || (!item.liquorRatioLower && item.liquorRatioUpper)) {
            flagArr.push(true)
          } else {
            flagArr.push(false)
          }
        })
        const flag = flagArr.find((val) => {
          return val === true
        })
        if (flag) {
          return
        }
      }
      // 校验配方内容的用量不能只填写数量不选单位
      const flagArrValue = []
      let quantityEmpty = false
      if (this.yarnDataSource[0].dataSource.length > 0) {
        this.yarnDataSource[0].dataSource.forEach((item, index) => {
          if (!item.quantity || isNaN(item.quantity) || item.quantity - 0 <= 0 || item.quantity && (String(item.quantity).split('.').length > 2 || String(item.quantity).split('.').length === 2 && (String(item.quantity).split('.')[1].length > 4 || String(item.quantity).split('.')[1].length === 0))) {
            quantityEmpty = true
          }
          if (item.quantity && item.unit === '') {
            flagArrValue.push(true)
          } else {
            flagArrValue.push(false)
          }
        })
        const flagValue = flagArrValue.find((val) => {
          return val === true
        })
        if (flagValue) {
          return
        }
        if (quantityEmpty) {
          return
        }
      }
      if (this.$route.params.id && (this.$route.path.includes('edit') || this.$route.path.includes('show'))) {
        // 编辑
        if (pass && colorFastnessFormpass && processparameterspass) {
          this.$confirm(' 你确认要提交该数据吗？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          })
            .then(async() => {
              // 保存之后需重新请求接口数据
              const res = await update({
                colorId: this.$route.params.id,
                colorFastness: this.colorFastness, // 色牢度对象
                bdPretreatmentUuid: this.order.bdPretreatmentUuid, // 前处理id
                formulaContent: this.yarnDataSource[0].dataSource.map((item, index) => {
                  item.bdDyestuffAssistUuid = this.order.bdDyestuffAssistUuid[index] // 染色助剂名称id
                  item.value = {
                    quantity: item.quantity || 0,
                    unit: item.unit
                  }
                  return item
                }), // 配色内容[]
                technologyParameter: this.dataProcess[0].dataSource.map((item, index) => {
                  item.bdDyestuffAssistUuid = this.order.bdDyestuffAssistUuid[index] // 染色助剂名称id
                  item.liquor = {
                    liquorRatioLower: item.liquorRatioLower || 0,
                    liquorRatioUpper: item.liquorRatioUpper || 0
                  }
                  return item
                }) // 工艺参数[]
              })
              if (res.code !== 200) {
                return
              }
              this.$message({
                type: 'success',
                message: '提交成功'
              })
              this.fetchLog(
                this.getLogMessages('UPDATE', '/color/api/formula/update', 'color'),
                { id: this.$route.params.id, code: this.order.code },
                JSON.stringify({
                  beforeText: `在'色号花号库-色号管理-配方录入'编辑一条记录`,
                  beforeCode: { id: this.$route.params.id, code: this.order.code }
                })
              )
              this.isEdit = false
              if (this.$route.path.includes('edit')) {
                this.$router.push(`/color-library/color-management/recipe-entry/${this.$route.params.id}/show`)
              } else if (this.$route.path.includes('show')) {
                this.getOrder(this.$route.params.id)
                this.yarnDataSource[0].operates = null
              }
              // 编辑保存重新走接口会出现浴比再次输入无法输入的情况

              // this.yarnDataSource[0].dataSource = this.yarnDataSource[0].dataSource.map((item) => {
              //   item.edit = false
              //   return item
              // }) || [] // 配方内容
              // this.dataProcess[0].dataSource = this.dataProcess[0].dataSource.map((item) => {
              //   item.edit = false
              //   return item
              // }) || [] // 工艺参数
              // 隐藏配方内容的删除按钮
            })
        }
      } else {
        // 新增
        if (pass && colorFastnessFormpass && processparameterspass) {
          this.$confirm(' 你确认要提交该数据吗？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          })
            .then(async() => {
              // 保存之后需重新请求接口数据
              const res = await storePeifang({
                colorId: this.$route.params.id,
                colorFastness: this.colorFastness, // 色牢度对象
                bdPretreatmentUuid: this.order.bdPretreatmentUuid, // 前处理id
                formulaContent: this.yarnDataSource[0].dataSource.map((item) => {
                  item.value = {
                    quantity: item.quantity || 0,
                    unit: item.unit
                  }
                  return item
                }), // 配色内容[]
                technologyParameter: this.dataProcess[0].dataSource.map((item) => {
                  item.liquor = {
                    liquorRatioLower: item.liquorRatioLower || 0,
                    liquorRatioUpper: item.liquorRatioUpper || 0
                  }
                  return item
                }) // 工艺参数[]
              })
              if (res.code !== 200) {
                return
              }
              this.$message({
                type: 'success',
                message: '提交成功'
              })
              this.fetchLog(
                this.getLogMessages('UPDATE', '/color/api/formula/store', 'color'),
                { id: this.$route.params.id, code: this.order.code },
                JSON.stringify({
                  beforeText: `在'色号花号库-色号管理-配方录入'编辑一条记录`,
                  beforeCode: { id: this.$route.params.id, code: this.order.code }
                })
              )
              this.$router.push(`/color-library/color-management/recipe-entry/${this.$route.params.id}/show`)
              this.isEdit = false
              this.colorFastnessData.forEach((item) => {
                item.disabled = true
              })
              this.yarnDataSource[0].dataSource = this.yarnDataSource[0].dataSource.map((item) => {
                item.edit = false
                return item
              }) || [] // 配方内容
              this.dataProcess[0].dataSource = this.dataProcess[0].dataSource.map((item) => {
                item.edit = false
                return item
              }) || [] // 工艺参数
            })
        }
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.second {
  margin-left: 100px;
}
.recipe-content {
  // display: flex;
  // flex-direction: row;
  // margin-left: 52px;
  margin-bottom: 30px;
  // width: 65%;
}
.recipe-table {
  margin-left: 10px;
  width: 97%;
  /deep/.el-input {
    width: 50%!important;
  }
}
.addBtn {
  margin-right: 35px;
}
.product-btn-group {
  display: flex;
  // justify-content: center;
}
.product-btn-group {
  bottom: 0;
  z-index: 1000;
  padding: 10px;
  width: 100%;
  background: #fff;
  position: fixed;
  border-top: 1px solid #ecf0f3;
  .btn-groups {
    position: relative;
    left: 40%;
  }
}
.description {
  display: flex;
  justify-content: flex-end;
  line-height: 28px;
  height: 28px;
  padding: 20px 20px 12px 20px;
  font-size: 12px;
  color: #777777;
}
/deep/ .el-form-item__label-wrap {
  margin-left: 0 !important;
}
/deep/ .process .el-form-item__content {
  margin-bottom: 20px;
}
/deep/ .el-tabs__nav-wrap::after {
  height: 1px;
}
.ml-10 {
  margin-left: 15px;
}
/deep/.table tr:nth-child(even) {
  background-color: #ffffff;
}
.title-div {
  height: 32px;
  line-height: 32px;
  margin-right: 15px;
}
.recipe-title {
  display: flex;
  padding-left: 10px;
  padding-bottom: 15px;
  justify-content: space-between;
}
.product-detail-top {
  display: flex;
  justify-content: space-between;
}
.code-item {
  font-size: 18px;
  color: #151222;
  line-height: 26px;
  height: 26px;
  padding: 0 0 0 20px;
}
.Description {
  display: flex;
  justify-content: flex-end;
}
.qianchuli /deep/.el-form-item__label {
  // width: 70px !important;
  text-align: right;
}
.color-mes /deep/.qianchuli .el-form-item {
  width: 240px !important;
}
/deep/.el-tabs__nav-scroll {
  height: 60px;
  line-height: 60px;
}
.product-item-codeinfo {
  padding-top: 20px;
  padding-bottom: 12px;
  padding-left: 0;
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-pack: justify;
  -ms-flex-pack: justify;
  justify-content: space-between;
}
</style>
