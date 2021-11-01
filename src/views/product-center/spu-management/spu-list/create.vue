<!--
 * @Author: Sanmao
 * @Date: 2020-09-27 16:05:02
 * @LastEditors: zhengjin
 * @LastEditTime: 2021-07-26 11:38:07
 * @Descripttion: spu管理新增
-->
<template>
  <div class="product-detail-content">
    <div class="product-item-content">
      <div class="product-content-info">
        <item
          ref="formOnePart"
          :is-edit="true"
          :rules="rulesOnePart"
          :form-data="formDataOnePart"
          :order="order"
        />
      </div>
    </div>

    <div class="product-item-content spu-created">
      <div class="product-content-title">主要信息</div>
      <div class="product-content-info">
        <item
          ref="formTwoPart"
          :is-edit="true"
          :rules="rulesTwoPart"
          :form-data="formDataTwoPart"
          :order="order"
        />
      </div>
    </div>
    <div class="product-btn-group">
      <div class="btn-groups">
        <el-button @click="cancel">取消</el-button>
        <el-button type="primary" @click="submitForm">提交</el-button>
      </div>
    </div>
  </div>
</template>
<script>
import item from '@/views/product-center/components/detaiItem'
import logMethods from '@/views/product-center/mixin/log-methods'
import configData from '@/views/product-center/configDock/index.js'
import { spuStore, getFabricWeight } from './api'
export default {
  name: 'SpuManageAdd',
  components: {
    item
  },
  mixins: [logMethods],
  data() {
    const kezhong = (rule, value, callback) => {
      // setTimeout(() => {
      if (!/(^[1-9]\d*$)/.test(value)) {
        callback(new Error('请输入正整数'))
      } else {
        if (value > 10000) {
          callback(new Error('请输入小于10000正整数'))
        } else {
          callback()
        }
      }
      // }, 300);
    }

    // 主纱支/细度/细度验证
    const mainYarn = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('请输入主纱支/细度'))
      }
      // setTimeout(() => {
      if (!/(^[1-9]\d*$)/.test(value)) {
        callback(new Error('请输入正整数'))
      } else {
        if (value > 10000) {
          callback(new Error('请输入小于10000正整数'))
        } else {
          callback()
        }
      }
      // }, 300);
    }
    // 密度下拉数据
    const miduOptions = [
      { name: 'S', id: 1 },
      { name: 'N', id: 2 },
      { name: 'D', id: 3 }
    ]
    // 是否抓毛下拉数据
    const zhuamaoOptions = [
      { name: '轻抓毛', id: 2 },
      { name: '重抓毛', id: 3 },
      { name: '无抓毛', id: 1 }
    ]
    // 是否磨毛下拉数据
    const momaoOptions = [
      { name: '是', id: 1 },
      { name: '否', id: 0 }
    ]
    // 是否刷毛下拉数据
    const shuamaoOptions = [
      { name: '是', id: 1 },
      { name: '否', id: 0 }
    ]
    // 是否摇粒下拉数据
    const yaoliOptions = [
      { name: '是', id: 1 },
      { name: '否', id: 0 }
    ]
    const rulesOnePart = {
      clothMaterialName: [
        { message: '请选择面料大类', required: true, trigger: 'change' }
      ],
      fabricCatName: [
        { message: '请选择布种大类', required: true, trigger: 'change' }
      ],
      mainIngredientsName: [
        { message: '请选择主成分', required: true, trigger: 'change' }
      ],
      minorIngredientsName: [
        { message: '请选择次成分', required: true, trigger: 'change' }
      ]
    }
    const formDataOnePart = [
      {
        name: 'clothMaterialName',
        type: 'select-search',
        label: '面料大类',
        placeholder: '请选择面料大类',
        searchValue: 'name', // 搜索比如name='智布'
        valueKey: 'uuid',
        apiUrl: `basis/api/fabricCategory/option`,
        optionsLabel: 'name',
        optionsValue: 'uuid',
        requestFormat: 'list',
        requestMode: 'post',
        clearable: true,
        changeSelectVal: (data) => {
          this.order.clothMaterialName = data && data.data ? data.data.name : ''
          this.order.bdClothMaterialUuid = data && data.data ? data.data.uuid : 0
          this.order.clothMaterial = data && data.data ? data.data : null
          this.$refs['formOnePart'].resetData({
            clothMaterialName: data && data.data ? data.data.name : ''
          })
        }
      },
      {
        name: 'fabricCatName',
        type: 'select-search',
        label: '布种大类',
        placeholder: '请选择布种大类',
        searchValue: 'name', // 搜索比如name='智布'
        valueKey: 'uuid',
        apiUrl: `basis/api/clothCategory/option`,
        optionsLabel: 'name',
        optionsValue: 'uuid',
        requestFormat: 'list',
        requestMode: 'post',
        clearable: true,
        changeSelectVal: (data) => {
          this.order.fabricCatName = data && data.data ? data.data.name : ''
          this.order.bdFabricCatUuid = data && data.data ? data.data.uuid : 0
          this.order.fabricCat = data && data.data ? data.data : null
          this.$refs['formOnePart'].resetData({
            fabricCatName: data && data.data ? data.data.name : ''
          })
        }
      },
      {
        name: 'mainIngredientsName',
        type: 'select-search',
        label: '主成分',
        placeholder: '请选择主成分',
        searchValue: 'name', // 搜索比如name='智布'
        valueKey: 'uuid',
        apiUrl: `basis/api/classifications/option`,
        optionsLabel: 'name',
        optionsValue: 'uuid',
        requestFormat: 'list',
        requestMode: 'post',
        clearable: true,
        changeSelectVal: (data) => {
          this.order.mainIngredientsName = data && data.data ? data.data.name : ''
          this.order.bdMainIngredientsUuid = data && data.data ? data.data.uuid : 0
          this.order.mainIngredients = data && data.data ? data.data : null
          this.$refs['formOnePart'].resetData({
            mainIngredientsName: data && data.data ? data.data.name : ''
          })
        }
      },
      {
        name: 'minorIngredientsName',
        type: 'select-search',
        label: '次成分',
        placeholder: '请选择次成分',
        searchValue: 'name', // 搜索比如name='智布'
        valueKey: 'uuid',
        apiUrl: `basis/api/classifications/option`,
        optionsLabel: 'name',
        optionsValue: 'uuid',
        requestFormat: 'list',
        requestMode: 'post',
        clearable: true,
        changeSelectVal: (data) => {
          this.order.minorIngredientsName = data && data.data ? data.data.name : ''
          this.order.bdMinorIngredientsUuid = data && data.data ? data.data.uuid : 0
          this.order.minorIngredients = data && data.data ? data.data : null
          this.$refs['formOnePart'].resetData({
            minorIngredientsName: data && data.data ? data.data.name : ''
          })
        }
      }
    ]
    const rulesTwoPart = {
      dyePrintTypeName: [
        { message: '请选择染整类型', required: true, trigger: 'change' }
      ],
      bdMainYarn: [{ validator: mainYarn, trigger: 'blur', required: true }],
      fabricWeight: [{ message: '请输入克重', required: true, trigger: 'change' }, { validator: kezhong, trigger: 'change' }],
      materialQualityName: [
        { message: '请选择原料品质', required: true, trigger: 'change' }
      ],
      // bdSpecialTechName: [
      //   { message: '请选择特殊功能', required: true, trigger: 'change' }
      // ],
      // handleName: [
      //   { message: '请选择手感', required: true, trigger: 'change' }
      // ],
      // hairinessName: [
      //   { message: '请选择毛羽', required: true, trigger: 'change' }
      // ],
      beltloopName: [
        { message: '请选择毛圈', required: true, trigger: 'change' }
      ],
      isCatchHair: [
        { message: '请选择抓毛', required: true, trigger: 'change' }
      ],
      isSuede: [{ message: '请选择磨毛', required: true, trigger: 'change' }],
      isBrushed: [{ message: '请选择刷毛', required: true, trigger: 'change' }],
      isPolarFleece: [
        { message: '请选择摇粒', required: true, trigger: 'change' }
      ]
    }
    const formDataTwoPart = [
      {
        name: 'dyePrintTypeName',
        type: 'select-search',
        label: '染整类型',
        placeholder: '请选择染整类型',
        searchValue: 'name', // 搜索比如name='智布'
        valueKey: 'uuid',
        apiUrl: `basis/api/printingDyeingType/option`,
        optionsLabel: 'name',
        optionsValue: 'uuid',
        requestFormat: 'list',
        requestMode: 'post',
        filterable: false, // 不需要搜索
        changeSelectVal: (data) => {
          this.order.dyePrintTypeName = data.data.name
          this.order.bdDyePrintTypeUuid = data.data.uuid
          this.$refs['formTwoPart'].resetData({
            dyePrintTypeName: data.data.name
          })
        }
      },
      {
        name: 'materialQualityName',
        type: 'select-search',
        label: '原料品质',
        placeholder: '请选择原料品质',
        searchValue: 'name', // 搜索比如name='智布'
        valueKey: 'uuid',
        requestParam: { categoryId: 3 },
        apiUrl: `basis/api/yarnTypes/option`,
        optionsLabel: 'name',
        optionsValue: 'uuid',
        requestMode: 'post',
        filterable: false, // 不需要搜索
        changeSelectVal: (data) => {
          this.order.materialQualityName = data.data.name
          this.order.bdMaterialQualityUuid = data.data.uuid
          this.$refs['formTwoPart'].resetData({
            materialQualityName: data.data.name
          })
        }
      },
      {
        type: 'mutInput',
        label: '主纱支/细度',
        leftPart: {
          name: 'bdMainYarn',
          type: 'input',
          placeholder: '请输入主纱支',
          blurHandler: (e) => {
            // console.log(/(^[1-9]\d*$)/.test(e.target.value), "e");
            // if (/(^[1-9]\d*$)/.test(e.target.value)) {
            //   this.order.bdMainYarn = e.target.value;
            // }
            if (!e.target.value) {
              this.order.bdMainYarn = ''
            } else {
              this.order.bdMainYarn = e.target.value
            }
          }
        },
        rightPart: {
          name: 'bdMainYarnUnit',
          type: 'select',
          placeholder: '请选择细度',
          options: miduOptions,
          optionsValue: 'id',
          changeHandler: (e) => {
            this.order.bdMainYarnUnit = e
          }
        }
      },
      {
        type: 'mutInput',
        label: '克重',
        leftPart: {
          name: 'fabricWeight',
          type: 'input',
          placeholder: '请输入克重',
          blurHandler: async(e) => {
            if (isNaN(e.target.value) || e.target.value === '') {
              this.order.fabricWeight = e.target.value
              this.$refs['formTwoPart'].resetData({
                fabricWeight: e.target.value
              })
              return
            }
            // 获取花布克重进行替换
            const data = await getFabricWeight({
              search_value: e.target.value
            })
            this.order.fabricWeight = data.data.midVal || ''
            this.$refs['formTwoPart'].resetData({
              fabricWeight: this.order.fabricWeight
            })
          }
        },
        rightPart: {
          isText: true,
          value: 'g/m²'
          // style: "cursor: pointer;",
          // changeHandler: () => {
          //   console.log("验证");
          // },
        }
      },

      {
        name: 'beltloopName',
        type: 'select-search',
        label: '毛圈',
        placeholder: '请选择毛圈',
        searchValue: 'name', // 搜索比如name='智布'
        valueKey: 'uuid',
        requestParam: { typical: 'MQ' },
        apiUrl: `basis/api/finishedFabric/option`,
        optionsLabel: 'name',
        optionsValue: 'uuid',
        requestFormat: 'list',
        requestMode: 'post',
        filterable: false, // 不需要搜索
        changeSelectVal: (data) => {
          this.order.beltloopName = data.data.name
          this.order.bdBeltloopUuid = data.data.uuid
          this.$refs['formTwoPart'].resetData({
            beltloopName: data.data.name
          })
        }
      },
      {
        name: 'isCatchHair',
        type: 'select',
        label: '是否抓毛',
        placeholder: '请选择是否抓毛',
        options: zhuamaoOptions,
        optionsValue: 'id',
        changeHandler: (data) => {
          this.order.isCatchHair = data
        }
      },
      {
        name: 'isSuede',
        type: 'select',
        label: '是否磨毛',
        placeholder: '请选择是否磨毛',
        options: momaoOptions,
        optionsValue: 'id',
        changeHandler: (data) => {
          this.order.isSuede = data
        }
      },
      {
        name: 'isBrushed',
        type: 'select',
        label: '是否刷毛',
        placeholder: '请选择是否刷毛',
        options: shuamaoOptions,
        optionsValue: 'id',
        changeHandler: (data) => {
          this.order.isBrushed = data
        }
      },
      {
        name: 'isPolarFleece',
        type: 'select',
        label: '是否摇粒',
        placeholder: '请选择是否摇粒',
        options: yaoliOptions,
        optionsValue: 'id',
        changeHandler: (data) => {
          this.order.isPolarFleece = data
        }
      },
      {
        name: 'bdSpecialTechName',
        type: 'select-search',
        label: '特殊功能',
        placeholder: '请选择特殊功能',
        multiple: true,
        searchValue: 'name', // 搜索比如name='智布'
        valueKey: 'uuid',
        requestParam: { isSpecial: 'Y', level: 1 },
        apiUrl: `basis/api/requirementsDye/option`,
        optionsLabel: 'name',
        optionsValue: 'name',
        requestFormat: 'list',
        requestMode: 'post',
        optionsKey: 'idNum',
        clearable: true,
        changeSelectVal: (data) => {
          // 多选需要让后端给两个字段，一个放name 一个放id
          this.$refs['formTwoPart'].resetData({ bdSpecialTechName: data && data.data ? data.data : [] })
          this.order.bdSpecialTechUuid = []
          this.order.bdSpecialTechName = data && data.data ? data.data : []
          data.multipleData.forEach((ele) => {
            this.order.bdSpecialTechUuid.push(ele.uuid)
          })
        }
      },
      {
        name: 'handleName',
        type: 'select-search',
        label: '手感',
        placeholder: '请选择手感',
        searchValue: 'name', // 搜索比如name='智布'
        valueKey: 'uuid',
        requestParam: { sortClassify: 4, level: 1 },
        apiUrl: `basis/api/requirementsDye/option`,
        optionsLabel: 'name',
        optionsValue: 'uuid',
        requestFormat: 'list',
        requestMode: 'post',
        filterable: false, // 不需要搜索
        changeSelectVal: (data) => {
          this.order.handleName = data.data.name
          this.order.bdHandleUuid = data.data.uuid
          this.$refs['formTwoPart'].resetData({
            handleName: data.data.name
          })
        }
      },
      {
        name: 'hairinessName',
        type: 'select-search',
        label: '毛羽',
        placeholder: '请选择毛羽',
        searchValue: 'name', // 搜索比如name='智布'
        valueKey: 'uuid',
        requestParam: { typical: 'MY' },
        apiUrl: `basis/api/finishedFabric/option`,
        optionsLabel: 'name',
        optionsValue: 'uuid',
        requestFormat: 'list',
        requestMode: 'post',
        filterable: false, // 不需要搜索
        changeSelectVal: (data) => {
          this.order.hairinessName = data.data.name
          this.order.bdHairinessUuid = data.data.uuid
          this.$refs['formTwoPart'].resetData({
            hairinessName: data.data.name
          })
        }
      }
    ]
    return {
      order: {},
      rulesOnePart,
      formDataOnePart,
      rulesTwoPart,
      formDataTwoPart
    }
  },
  created() {
    this.initOrder()
  },
  methods: {
    /**
     * @description 初始化
     */
    initOrder() {
      this.order = {
        clothMaterialName: '', // 面料大类
        bdClothMaterialUuid: 0, // 面料大类id
        clothMaterial: null, // 面料大类；后端需要此字段
        bdFabricCatUuid: 0, // 布种大类id
        fabricCatName: '', // 布种大类
        fabricCat: null, // 布种大类；后端需要此字段
        mainIngredientsName: '', // 主成分
        bdMainIngredientsUuid: 0, // 主成分id
        mainIngredients: null, // 主成分；后端需要此字段
        minorIngredientsName: '', // 次成分
        bdMinorIngredientsUuid: 0, // 次成分id
        minorIngredients: null, // 次成分；后端需要此字段
        dyePrintTypeName: '', // 染整类型
        bdDyePrintTypeUuid: 0, // 染整类型id
        materialQualityName: '', // 原料品质
        bdMaterialQualityUuid: 0, // 原料品质id
        bdMainYarn: '', // 主纱支
        bdMainYarnUnit: 1, // 主纱支单位1：S，2：N，3：D
        bdSpecialTechUuid: [], // 特殊功能id
        bdSpecialTechName: [], // 特殊功能
        fabricWeight: '', // 克重
        handleName: '', // 手感
        bdHandleUuid: '', // 手感id
        hairinessName: '', // 毛羽
        bdHairinessUuid: '', // 毛羽id
        beltloopName: '', // 毛圈
        bdBeltloopUuid: 0, // 毛圈id
        isCatchHair: '', // 抓毛
        isSuede: '', // 磨毛
        isBrushed: '', // 刷毛
        isPolarFleece: '' // 摇粒
      }
    },
    changeSelectVal(data) {
      this.value = data.data
    },
    // 取消
    cancel() {
      this.$router.go(-1)
    },
    // 提交
    submitForm() {
      let flag = false
      // this.$refs.formOnePart.$refs.form.validate((valid) => {
      //   if (valid) {
      //     flag = true;
      //   } else {
      //     flag = false;
      //   }
      // });
      // this.$refs.formTwoPart.$refs.form.validate((valid) => {
      //   if (valid) {
      //     flag = true;
      //   } else {
      //     flag = false;
      //   }
      // });
      const refArr = ['formOnePart', 'formTwoPart']

      for (let j = 0; j < refArr.length; j++) {
        this.$refs[refArr[j]].$refs.form.validate((valid) => {
          if (valid) {
            flag = true
          } else {
            flag = false
          }
        })
        if (!flag) {
          break
        }
      }
      if (!flag) {
        return false
      }
      if (flag) {
        this.$confirm(' 你确认要提交该数据吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(async() => {
            // 保存之后需重新请求接口数据
            const res = await spuStore({ ...this.order })
            this.fetchLog(
              this.getLogMessages('INSERT', `${configData.productRequestPrefix}/api/spu/store`),
              this.order,
              JSON.stringify({
                beforeText: `在'产品中心-SPU管理-SPU'新增一条记录`,
                beforeCode: this.order
              })
            )
            if (res.code === 200) {
              this.$message({
                type: 'success',
                message: '提交成功！'
              })
              this.$router.push({ name: 'SpuManagementList' })
            }
          }).catch(() => {
            console.log('已取消提交')
          })
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.formOnePart {
  // border: 1px solid #dcdfe6;
  border-color: #fff;
}
.spu-created {
  margin-top: 0;
}
</style>
