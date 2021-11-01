<!--
 * @Author: Sanmao
 * @Date: 2020-09-27 15:25:42
 * @LastEditors: zhengjin
 * @LastEditTime: 2021-07-26 11:36:25
 * @Descripttion: 化学纤维详情
-->
<template>
  <div class="product-detail-content">
    <div v-show="!$route.params.id" class="product-item-content">
      <div class="product-content-info">
        <div class="content-item">
          <span class="label">坯纱编码</span>
          <el-input
            v-model.trim="order.embryoCode"
            :title="order.embryoCode"
            :disabled="$route.params.id ? true : false"
            placeholder="请输入坯纱编码"
          />
          <div>
            <el-button
              class="pointer"
              size="small"
              @click="yinruCode"
            >引入</el-button>
          </div>
        </div>
      </div>
    </div>
    <div v-show="$route.params.id" class="product-item-top">
      <div class="product-item-codeinfo">
        <div class="code-item">纱线编码：{{ order.code }}</div>
        <!-- <div v-show="!$route.params.id" class="content-item">
          <span class="label">坯纱编码</span>
          <el-input
            v-model.trim="order.embryoCode"
            :title="order.embryoCode"
            :disabled="$route.params.id ? true : false"
            placeholder="请输入坯纱编码"
          />
          <span class="pointer" @click="yinruCode">引入</span>
        </div> -->
      </div>
    </div>
    <div v-show="$route.params.id" class="product-item-content">
      <div class="product-content-title">基本信息</div>
      <div class="product-content-info">
        <item
          ref="formOnePart"
          :is-edit="false"
          :form-data="formDataOnePart"
          :order="order"
        />
      </div>
    </div>
    <!-- <div class="product-item-codeinfo chemicalfibercreate-top">
      <item
        ref="formOnePart"
        :is-edit="$route.params.id ? false : true"
        :form-data="
          $route.params.id ? formDataOnePartShow : formDataOnePartStore
        "
        :order="order"
      />
      <div v-if="isEdit" class="yinru" @click="yinruCode">引入</div>
    </div> -->
    <div class="product-item-content">
      <div class="product-content-title">坯纱信息</div>
      <div class="product-content-info">
        <item
          ref="formTwoPart"
          :is-edit="isEdit"
          :rules="rulesTwoPart"
          :form-data="formDataTwoPart"
          :order="order"
        />
      </div>
    </div>
    <div v-if="$route.query.type === '2'" class="product-item-content">
      <div class="product-content-title">色纱信息</div>
      <div class="product-content-info">
        <item
          ref="formThreePart"
          :is-edit="true"
          :form-data="formDataThreePart"
          :order="order"
        />
      </div>
    </div>
    <div
      v-if="!$route.params.id || $route.query.isEdit"
      class="product-btn-group"
    >
      <div class="btn-groups">
        <el-button @click="cancel">取消</el-button>
        <el-button type="primary" @click="submitForm">提交</el-button>
      </div>
    </div>
    <el-dialog
      width="400px"
      title="色号信息"
      :visible.sync="dialogTableVisible"
    >
      <div :style="colorstyle" />
    </el-dialog>
  </div>
</template>
<script>
import item from '@/views/product-center/components/detaiItem'
import configData from '@/views/product-center/configDock/index.js'
import {
  chemicalFiberShow,
  getEmbryoCode,
  chemicalFiberStore,
  chemicalFiberUpdate
} from './api'
import logMethods from '@/views/product-center/mixin/log-methods'
import { debounce } from '@/utils'
import colorShow from '@/views/product-center/product-management/grey-cloth/components/colorShow'

export default {
  name: 'ChemicalFiberCreate',
  components: {
    item
  },
  mixins: [logMethods],
  data() {
    // 组合方式验证
    // const composeMethod = (rule, value, callback) => {
    //   if (!value) {
    //     return callback(new Error('请输入组合方式'))
    //   }
    //   setTimeout(() => {
    //     if (!/^(1|([1-9]\d{0,1})|100)$/.test(value)) {
    //       callback(new Error('请输入整数并且范围是1-100'))
    //     } else {
    //       callback()
    //     }
    //   }, 300)
    // }
    // 验证字段
    const rulesTwoPart = {
      ingredientName: [
        { message: '请选择成分', required: true, trigger: 'change' }
      ],
      finenessName: [
        { message: '请选择细度', required: true, trigger: 'change' }
      ],
      productAbbrName: [
        { message: '请选择丝类', required: true, trigger: 'change' }
      ],
      silkName: [{ message: '请选择特殊丝', required: true, trigger: 'change' }],
      networkDegreeName: [
        { message: '请选择网络度', required: true, trigger: 'change' }
      ],
      glossName: [
        { message: '请选择光泽度', required: true, trigger: 'change' }
      ],
      sectionShapeName: [
        { message: '请选择截面形状', required: true, trigger: 'change' }
      ],
      wistDirectionName: [
        { message: '请选择捻向', required: true, trigger: 'change' }
      ],
      stretchName: [
        { message: '请选择弹力程度', required: true, trigger: 'change' }
      ],
      functionName: [
        { message: '请选择功能', required: true, trigger: 'change' }
      ],
      colorMethodName: [{ message: '请选择颜色', required: true, trigger: 'change' }]
      // bdYarnLevel: [
      //   { message: '请选择纱线等级', required: true, trigger: 'change' }
      // ]
    }
    // 字段信息 （根据页面结构需分段）
    const formDataOnePartStore = [
      {
        name: 'embryoCode',
        type: 'input',
        label: '坯纱编码',
        blurHandler: (value) => {
          this.order.embryoCode = value.target.value
        }
      }
    ]
    const formDataOnePartShow = [
      {
        name: 'code',
        type: 'input',
        label: '纱线编码'
      },
      {
        name: 'embryoCode',
        type: 'input',
        label: '坯纱编码'
      },
      {
        name: 'updatore',
        type: 'input',
        label: '更新人'
      },
      {
        name: 'operatedTime',
        type: 'input',
        label: '更新时间'
      }
    ]
    // 字段信息 （根据页面结构需分段）
    const formDataOnePart = [
      {
        name: 'embryoCode',
        notEdit: 'true',
        type: 'input',
        label: '坯纱编码'
      },
      {
        name: 'dataSourceValue',
        notEdit: 'true',
        type: 'input',
        label: '数据来源'
      },
      {
        showValue: 'sourceOrderTypeName',
        notEdit: 'true',
        type: 'input',
        label: '来源订单类型'
      },
      {
        name: 'sourceOrder',
        notEdit: 'true',
        type: 'input',
        label: '来源单号'
      },
      {
        name: 'creater',
        notEdit: 'true',
        type: 'input',
        label: '创建人'
      },
      {
        name: 'creaTime',
        notEdit: 'true',
        type: 'input',
        label: '创建时间'
      },
      {
        name: 'updatore',
        notEdit: 'true',
        type: 'input',
        label: '更新人'
      },
      {
        name: 'operatedTime',
        notEdit: 'true',
        type: 'input',
        label: '更新时间'
      },
      {
        name: 'skuStatus',
        showValue: 'skuStatusName',
        type: 'select',
        label: '状态',
        disabled: true,
        optionsValue: 'id',
        options: [{ id: 1, name: '正式' }, { id: 2, name: '临时' }],
        changeHandler: (data) => {
          this.order.skuStatus = data
        }
      }
    ]
    const formDataTwoPart = [
      {
        name: 'ingredientName',
        type: 'select-search',
        label: '成份',
        placeholder: '请选择成分',
        searchValue: 'name', // 搜索比如name='智布'
        valueKey: 'uuid',
        apiUrl: `${configData.productRequestPrefix}/api/bd/ingredientsType/all`,
        optionsLabel: 'name',
        optionsValue: 'uuid',
        requestFormat: 'list',
        optionsKey: 'idNum',
        requestMode: 'post',
        clearable: true,
        changeSelectVal: (data) => {
          this.order.ingredientName = data && data.data ? data.data.name : ''
          this.order.bdIngredientsUuid = data && data.data ? data.data.uuid : 0
          // this.order.ingredientsType = data.data.type
          // this.order.ingredientsType = 1;
          this.$refs['formTwoPart'].resetData({
            ingredientName: data && data.data ? data.data.name : ''
          })
        }
      },
      {
        name: 'finenessName',
        type: 'select-search',
        label: '细度',
        placeholder: '请选择细度',
        valueKey: 'uuid',
        requestParam: { categoryId: 12 },
        apiUrl: `basis/api/yarnTypes/option`,
        optionsLabel: 'name',
        optionsValue: 'uuid',
        requestFormat: 'list',
        requestMode: 'post',
        clearable: true,
        changeSelectVal: (data) => {
          this.order.finenessName = data && data.data ? data.data.name : ''
          this.order.bdFinenessUuid = data && data.data ? data.data.uuid : 0
          this.order.composeMethod = data && data.data ? data.data.composeMethod : ''
          this.$refs['formTwoPart'].resetData({
            finenessName: data && data.data ? data.data.name : '',
            composeMethod: data && data.data ? data.data.composeMethod : null
          })
        }
      },
      {
        name: 'productAbbrName',
        type: 'select-search',
        label: '丝类',
        placeholder: '请选择丝类',
        valueKey: 'uuid',
        requestParam: { categoryId: 4 },
        apiUrl: `basis/api/yarnTypes/option`,
        optionsLabel: 'name',
        optionsValue: 'uuid',
        requestFormat: 'list',
        requestMode: 'post',
        filterable: false,
        changeSelectVal: (data) => {
          this.order.productAbbrName = data.data.name
          this.order.bdProductNameUuid = data.data.uuid
          this.$refs['formTwoPart'].resetData({
            productAbbrName: data.data.name
          })
        }
      },
      {
        name: 'silkName',
        type: 'select-search',
        label: '特殊丝',
        placeholder: '请选择特殊丝',
        valueKey: 'uuid',
        requestParam: { categoryId: 13 },
        apiUrl: `basis/api/yarnTypes/option`,
        optionsLabel: 'name',
        optionsValue: 'uuid',
        requestFormat: 'list',
        requestMode: 'post',
        filterable: false,
        changeSelectVal: (data) => {
          this.order.silkName = data.data.name
          this.order.bdSilkUuid = data.data.uuid
          this.$refs['formTwoPart'].resetData({
            silkName: data.data.name
          })
        }
      },
      {
        name: 'networkDegreeName',
        type: 'select-search',
        label: '网络度',
        placeholder: '请选择网络度',
        valueKey: 'uuid',
        requestParam: { categoryId: 15 },
        apiUrl: `basis/api/yarnTypes/option`,
        optionsLabel: 'name',
        optionsValue: 'uuid',
        requestFormat: 'list',
        requestMode: 'post',
        filterable: false,
        changeSelectVal: (data) => {
          this.order.networkDegreeName = data.data.name
          this.order.bdNetworkDegreeUuid = data.data.uuid
          this.$refs['formTwoPart'].resetData({
            networkDegreeName: data.data.name
          })
        }
      },
      {
        name: 'glossName',
        type: 'select-search',
        label: '光泽度',
        placeholder: '请选择光泽度',
        valueKey: 'uuid',
        requestParam: { categoryId: 5 },
        apiUrl: `basis/api/yarnTypes/option`,
        optionsLabel: 'name',
        optionsValue: 'uuid',
        requestFormat: 'list',
        requestMode: 'post',
        filterable: false,
        changeSelectVal: (data) => {
          this.order.glossName = data.data.name
          this.order.bdGlossUuid = data.data.uuid
          this.$refs['formTwoPart'].resetData({
            glossName: data.data.name
          })
        }
      },
      {
        name: 'sectionShapeName',
        type: 'select-search',
        label: '截面形状',
        placeholder: '请选择截面形状',
        valueKey: 'uuid',
        requestParam: { categoryId: 16 },
        apiUrl: `basis/api/yarnTypes/option`,
        optionsLabel: 'name',
        optionsValue: 'uuid',
        requestFormat: 'list',
        requestMode: 'post',
        clearable: true,
        changeSelectVal: (data) => {
          this.order.sectionShapeName = data && data.data ? data.data.name : ''
          this.order.bdSectionShapeUuid = data && data.data ? data.data.uuid : 0
          this.$refs['formTwoPart'].resetData({
            sectionShapeName: data && data.data ? data.data.name : ''
          })
        }
      },
      {
        name: 'wistDirectionName',
        type: 'select-search',
        label: '捻向',
        placeholder: '请选择捻向',
        valueKey: 'uuid',
        requestParam: { categoryId: 17 },
        apiUrl: `basis/api/yarnTypes/option`,
        optionsLabel: 'name',
        optionsValue: 'uuid',
        requestFormat: 'list',
        requestMode: 'post',
        filterable: false,
        changeSelectVal: (data) => {
          this.order.wistDirectionName = data.data.name
          this.order.bdWistDirectionUuid = data.data.uuid
          this.$refs['formTwoPart'].resetData({
            wistDirectionName: data.data.name
          })
        }
      },
      {
        name: 'stretchName',
        type: 'select-search',
        label: '弹力程度',
        placeholder: '请选择弹力程度',
        valueKey: 'uuid',
        requestParam: { categoryId: 19 },
        apiUrl: `basis/api/yarnTypes/option`,
        optionsLabel: 'name',
        optionsValue: 'uuid',
        requestFormat: 'list',
        requestMode: 'post',
        filterable: false,
        changeSelectVal: (data) => {
          this.order.stretchName = data.data.name
          this.order.bdStretchUuid = data.data.uuid
          this.$refs['formTwoPart'].resetData({
            stretchName: data.data.name
          })
        }
      },
      {
        name: 'functionName',
        type: 'select-search',
        label: '功能',
        placeholder: '请选择功能',
        valueKey: 'uuid',
        requestParam: { categoryId: 14 },
        apiUrl: `basis/api/yarnTypes/option`,
        optionsLabel: 'name',
        optionsValue: 'uuid',
        requestFormat: 'list',
        requestMode: 'post',
        filterable: false,
        changeSelectVal: (data) => {
          this.order.functionName = data.data.name
          this.order.bdFunctionUuid = data.data.uuid
          this.$refs['formTwoPart'].resetData({
            functionName: data.data.name
          })
        }
      },
      {
        name: 'colorMethodName',
        type: 'select-search',
        label: '颜色',
        placeholder: '请选择颜色',
        valueKey: 'uuid',
        requestParam: { categoryId: 18 },
        apiUrl: `basis/api/yarnTypes/option`,
        optionsLabel: 'name',
        optionsValue: 'uuid',
        requestFormat: 'list',
        requestMode: 'post',
        filterable: false,
        changeSelectVal: (data) => {
          this.order.colorMethodName = data.data.name
          this.order.bdColorUuid = data.data.uuid
          this.$refs['formTwoPart'].resetData({
            colorMethodName: data.data.name
          })
        }
      },
      {
        name: 'composeMethod',
        type: 'input',
        label: '组合方式',
        // placeholder: "请输入组合方式",
        disabled: true,
        blurHandler: (value) => {
          if (!value.target.value) {
            this.order.composeMethod = ''
          } else {
            this.order.composeMethod = value.target.value
          }
          // setTimeout(() => {
          // console.log(
          //   this.$refs["formTwoPart"].$refs["composeMethod"][0][
          //     "validateState"
          //   ]
          // );
          // console.log(this.$refs["formTwoPart"].$refs["composeMethod"][0]);
          //   if (
          //     this.$refs["formTwoPart"].$refs["composeMethod"][0][
          //       "validateState"
          //     ] === "success"
          //   ) {
          //     this.order.composeMethod = value.target.value;
          //   }
          // }, 400);
        }
      }
      // {
      //   name: 'bdYarnLevel',
      //   type: 'select',
      //   label: '纱线等级',
      //   placeholder: '请选择纱线等级',
      //   options: ['A', 'B', 'C', 'D', 'E'],
      //   changeHandler: (data) => {
      //     this.order.bdYarnLevel = data
      //   }
      // }
    ]
    const formDataThreePart = [
      {
        name: 'colorYarnColorCode',
        type: 'select-search',
        label: '染纱色号',
        placeholder: '请选择染纱色号',
        showComponent: {
          colorShow
        },
        notEdit: false,
        searchValue: 'code', // 搜索比如name='智布'
        valueKey: 'uuid',
        apiUrl: `color/api/color/droplist`,
        optionsLabel: 'code',
        requestFormat: 'list',
        requestMode: 'post',
        clearable: true,
        requestParam: { type: 1 },
        changeSelectVal: (data) => {
          this.order.colorYarnColorCode = data && data.data ? data.data.code : ''
          this.order.colorYarnColorUuid = data && data.data ? data.data.uuid : ''
          this.$refs['formThreePart'].resetData({
            colorYarnColorCode: data && data.data ? data.data.code : ''
          })
          if (data && data.data) {
            this.formDataThreePart[1].disabled = false
          } else {
            this.formDataThreePart[1].disabled = true
            this.order.techYarnTechCode = ''
            this.order.techYarnTechUuid = 0
            this.$refs['formThreePart'].resetData({
              techYarnTechCode: ''
            })
          }
        }
      },
      {
        name: 'techYarnTechCode',
        type: 'select-search',
        label: '染纱工艺编码',
        placeholder: '请选择染纱工艺编码',
        notEdit: false, // 在编辑状态下是否不能编辑
        searchValue: 'name', // 搜索比如name='智布'
        valueKey: 'uuid',
        apiUrl: `${configData.productRequestPrefix}/api/tech/yarnTechnologyCode/all`,
        optionsLabel: 'name',
        disabled: true,
        clearable: true,
        changeSelectVal: (data) => {
          this.order.techYarnTechCode = data && data.data ? data.data.name : ''
          this.order.techYarnTechUuid = data && data.data ? data.data.uuid : ''
          this.$refs['formThreePart'].resetData({
            techYarnTechCode: data && data.data ? data.data.name : ''
          })
        }
      }
    ]
    return {
      order: {},
      beforeCode: {}, // 日志数据
      isEdit: true,
      rulesTwoPart,
      formDataOnePartShow,
      formDataOnePartStore,
      formDataTwoPart,
      formDataThreePart,
      formDataOnePart,
      dialogTableVisible: false,
      colorstyle: {
        display: 'none'
      }
    }
  },
  created() {
    this.initOrder()
    if (this.$route.params.id) {
      this.isEdit = false
      // this.formDataTwoPart.unshift({
      //   name: 'embryoCode',
      //   notEdit: 'true',
      //   type: 'input',
      //   label: '坯纱编码'
      // })
      this.formDataThreePart.forEach((item) => {
        item.notEdit = true
      })
      this.getOrder(this.$route.params.id)
      this.formDataThreePart[0].placeholder = ''
      // 编辑
      if (this.$route.query.isEdit) {
        // 查看时，染纱色号不能编辑，染纱工艺编码一直可以编辑
        this.formDataThreePart[1].notEdit = false
      }
    }
  },
  methods: {
    /**
     * @description 获取单据数据
     */
    async getOrder(id) {
      const res = await chemicalFiberShow({ id })
      this.order = Object.assign(this.order, res.data)
      this.setOrder(this.order)
    },
    /**
     * @description 初始化
     */
    initOrder() {
      this.order = {
        code: '',
        dataSource: 1, // 数据来源
        sourceOrderTypeName: '-', // 来源订单类型 查看时的值
        sourceOrder: '', // 来源单号
        creater: '', // 创建人
        creaTime: '', // 创建时间
        embryoCode: '', // 坯纱编码
        ingredientName: '', // 成分
        bdIngredientsUuid: 0, // 成分id
        ingredientsType: 1, // 成分类型: 1 组合成分 2 成分
        finenessName: '', // 细度
        bdFinenessUuid: 0, // 细度id
        productAbbrName: '', // 品名
        bdProductNameUuid: 0, // 品名id
        silkName: '', // 丝类
        bdSilkUuid: 0, // 丝类id
        networkDegreeName: '', // 网络度
        bdNetworkDegreeUuid: 0, // 网络度id
        glossName: '', // 光泽度
        bdGlossUuid: 0, // 光泽度id
        sectionShapeName: '', // 截面形状
        bdSectionShapeUuid: 0, // 截面形状id
        wistDirectionName: '', // 捻向
        bdWistDirectionUuid: 0, // 捻向id
        stretchName: '', // 弹力程度
        bdStretchUuid: 0, // 弹力程度id
        functionName: '', // 功能
        bdFunctionUuid: 0, // 功能id
        colorMethodName: '', // 颜色
        bdColorUuid: 0, // 颜色id
        composeMethod: '', // 组合方式
        // bdYarnLevel: '', // 纱线等级
        colorYarnColorUuid: '', // 染纱色号id
        colorYarnColorCode: '', // 染纱色号编码
        techYarnTechCode: '', // 染纱工艺编码
        techYarnTechUuid: '', // 染纱工艺编码id
        skuStatus: 1, // 状态
        type: 2,
        skuStatusName: '正式' // 状态查看时的值
      }
    },
    /**
     * @description 引入坯布编码
     */
    yinruCode: debounce(
      async function() {
        if (!this.order.embryoCode) {
          this.$message({
            message: '请输入坯布编码！',
            type: 'warning'
          })
          return
        }
        const res = await getEmbryoCode({ code: this.order.embryoCode })
        if (res.code === 200) {
          this.$message({
            message: '引入成功！',
            type: 'success'
          })

          // 删除不需要传给后端的对象
          const delOrderArr = [
            'id',
            'code',
            'techYarnTechCode',
            'techYarnTechUuid',
            'colorYarnColorCode',
            'colorYarnColorUuid',
            'creator',
            'updator',
            'operatedTime',
            'rawUpdateTime'
          ]
          delOrderArr.forEach((item) => {
            delete res.data[item]
          })
          // delete res.data.id;
          // delete res.data.code;
          // delete res.data.techYarnTechCode;
          // delete res.data.techYarnTechUuid;
          // delete res.data.colorYarnColorCode;
          // delete res.data.colorYarnColorUuid;

          this.order = Object.assign(this.order, res.data)
          // 引入成功，清空坯布编码
          this.order.embryoCode = ''
          delete this.order.embryoCode

          this.setOrder(this.order)
          this.$refs.formOnePart.resetData({ embryoCode: '' })
        }
      },
      300,
      true
    ),
    /**
     * @description 设置order
     */
    setOrder(order) {
      // 处理查看时，染纱色号不显示
      // this.$refs.formThreePart && this.$refs.formThreePart.resetData({
      //   techYarnTechCode: this.order.techYarnTechCode
      // })
      this.order.ingredientName = order.ingredients
        ? order.ingredients.name
        : ''
      this.order.finenessName = order.fineness ? order.fineness.name : ''
      this.order.productAbbrName = order.productName
        ? order.productName.name
        : ''
      this.order.silkName = order.silk ? order.silk.name : ''
      this.order.networkDegreeName = order.networkDegree
        ? order.networkDegree.name
        : ''
      this.order.glossName = order.gloss ? order.gloss.name : ''
      this.order.sectionShapeName = order.sectionShape
        ? order.sectionShape.name
        : ''
      this.order.wistDirectionName = order.longWistDirection
        ? order.longWistDirection.name
        : ''
      this.order.stretchName = order.stretch ? order.stretch.name : ''
      this.order.functionName = order.functions ? order.functions.name : ''
      this.order.colorMethodName = order.colorMethod ? order.colorMethod.name : ''
      this.order.sourceOrder = order.sourceOrder || '' // 来源单号
      // 数据来源
      switch (order.dataSource) {
        case 1:
          this.order.dataSourceValue = '产品目录库'
          break
        case 2:
          this.order.dataSourceValue = '样板开发'
          break
        case 3:
          this.order.dataSourceValue = '客户订单'
          break
        case 4:
          this.order.dataSourceValue = '采购订单'
          break
        case 5:
          this.order.dataSourceValue = '工艺总结'
          break
        default:
          this.order.dataSourceValue = ''
      }
      if (order.id) {
        // 编辑时避开坯纱信息rulesTwoPart验证
        this.$refs.formTwoPart.resetData(this.order)
        this.order.skuStatusName = order.skuStatus === 1 ? '正式' : '临时'
        order.sourceOrderType = order.sourceOrderType || 0
        let sourceOrderTypeName = '-'
        switch ((order.sourceOrderType - 0)) {
          case 0:
            sourceOrderTypeName = '-'
            break
          case 1:
            sourceOrderTypeName = '大货订单'
            break
          case 2:
            sourceOrderTypeName = '样板订单'
            break
          case 3:
            sourceOrderTypeName = '备坯单'
            break
          case 4:
            sourceOrderTypeName = '备纱单'
            break
          case 5:
            sourceOrderTypeName = '采购单'
            break
          case 6:
            sourceOrderTypeName = '补布单'
            break
          default:
            sourceOrderTypeName = '-'
        }
        this.order.sourceOrderTypeName = sourceOrderTypeName // 来源订单类型
        this.order.operatedTime = order.updatedTime ? this.$filters.parseTime(
          order.updatedTime,
          '{y}-{m}-{d} {h}:{i}'
        ) : ''
        // 创建时间
        this.order.creaTime = this.$filters.parseTime(
          order.createdTime,
          '{y}-{m}-{d} {h}:{i}'
        ) || ''
        // 创建人
        this.order.creater = this.order.creator
          ? this.order.creator.name
            ? this.order.creator.name + '/' + this.order.creator.realName
            : this.order.creator.realName
          : ''
        this.order.updatore = order.updator
          ? order.updator.name
            ? order.updator.name + '/' + order.updator.realName
            : order.updator.realName
          : '' // 更新人处理
        this.order.colorYarnColorCode =
        order.colorYarnColorCode && (order.colorYarnColorCode + (order.colorName ? '-' + order.colorName : '')) // 色号拼接颜色
        this.beforeCode = {
          id: this.order.id,
          code: this.order.code,
          techYarnTechCode: this.order.techYarnTechCode, // 染纱工艺编码
          techYarnTechUuid: this.order.techYarnTechUuid // 染纱工艺编码id
        }
      }
      if (this.order.type === 2 && this.order.colorYarnColorCode) {
        this.formDataThreePart[1].disabled = false
      }
    },
    // 取消
    cancel() {
      this.$router.go(-1)
    },
    // 提交
    submitForm() {
      this.$refs.formTwoPart.$refs.form.validate((valid) => {
        if (valid) {
          this.$confirm(' 你确认要提交该数据吗？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          })
            .then(async() => {
              // 保存之后需重新请求接口数据
              let res = null
              if (this.order.id) {
                // 编辑
                res = await chemicalFiberUpdate({
                  id: this.order.id,
                  techYarnTechCode: this.order.techYarnTechCode,
                  techYarnTechUuid: this.order.techYarnTechUuid
                })
                const { beforeCode, afterCode } = this.compareData(
                  this.beforeCode,
                  {
                    id: this.order.id,
                    code: this.order.code,
                    techYarnTechCode: this.order.techYarnTechCode, // 染纱工艺编码
                    techYarnTechUuid: this.order.techYarnTechUuid // 染纱工艺编码id
                  },
                  'id'
                )
                const flag =
                  JSON.stringify(beforeCode) !== JSON.stringify(afterCode)
                flag &&
                  this.fetchLog(
                    this.getLogMessages(
                      'UPDATE',
                      `${configData.productRequestPrefix}/api/cloth/productFabric/update`
                    ),
                    afterCode,
                    JSON.stringify({
                      beforeText: `在'产品目录库-纱线管理-化学纤维'将化学纤维编码:${this.order.code}`,
                      afterText: '修改为',
                      ...{ beforeCode, afterCode }
                    })
                  )
              } else {
                // 新增
                res = await chemicalFiberStore({ ...this.order })

                if (res.data && res.data.length) {
                  res.data.forEach(async(item) => {
                    if (item.embryoYarn) {
                      // 新建一条正式状态的色纱时，其关联的坯纱状态如果为临时，状态也改为正式
                      await this.fetchLog(
                        this.getLogMessages(
                          'UPDATE',
                          `${configData.productRequestPrefix}/api/yarn/chemicalFiber/update`
                        ),
                        { skuStatus: item.embryoYarn.oldStatus },
                        JSON.stringify({
                          beforeText: `在'产品目录库-纱线管理-化学纤维'将化学纤维编码：${item.embryoYarn.code}`,
                          afterText: '修改为',
                          ...{ beforeCode: { skuStatus: item.embryoYarn.oldStatus }, afterCode: { skuStatus: item.embryoYarn.newStatus }}
                        })
                      )
                    }
                    await this.fetchLog(
                      this.getLogMessages(
                        'INSERT',
                        `${configData.productRequestPrefix}/api/yarn/chemicalFiber/store`
                      ),
                      this.order,
                      JSON.stringify({
                        beforeText: `在'产品目录库-纱线管理-化学纤维'新增一条记录编码：${item.code ? item.code : ''}`,
                        beforeCode: this.order
                      })
                    )
                  })
                }
              }
              if (res.code === 200) {
                this.$message({
                  type: 'success',
                  message: res.message
                })
                this.$router.push({ name: 'ChemicalFiberList' })
              }
            })
            .catch(() => {
              console.log('已取消提交')
            })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.chemicalfibercreate-top {
  /deep/.el-form .el-form-item {
    margin-bottom: 0;
  }
  /deep/.form {
    width: auto;
  }
  .yinru {
    width: 70px;
    align-self: center;
    text-align: center;
    cursor: pointer;
  }
  // .embryo-code {
  //   display: flex;
  //   align-items: center;
  //   font-size: 14px;
  //   color: #606266;
  //   /deep/.el-input.is-disabled .el-input__inner {
  //     color: #777474;
  //   }
  //   .label {
  //     width: 130px;
  //     padding-right: 12px;
  //     text-align: right;
  //     box-sizing: border-box;
  //   }
  //   .el-input {
  //     width: 170px;
  //   }
  // }
}
.content-item {
  display: flex;
  align-items: center;
  font-size: 14px;
  color: #606266;
  .label {
    width: 130px;
    padding-right: 12px;
    text-align: right;
    box-sizing: border-box;
  }
  .el-input {
    width: 170px;
  }
  /deep/.el-input.is-disabled .el-input__inner {
    color: #777474;
  }
  .pointer {
    height: 32px;
    cursor: pointer;
    margin-left: 5px;
  }
}
.code-sourceOrder {
  margin-left: 50px;
}
</style>
