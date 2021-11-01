<!--
 * @Author: xj
 * @Date: 2021-01-06 11:22:13
 * @LastEditTime: 2021-01-21 14:36:04
 *@ 只适合色板申请单
-->

<template>
  <div class="ratio-form">
    <div class="ratio-form2">
      <div class="ratio-form3">成份比例:</div>
      <div class="ratio-form4">
        <!-- 组合 -->
        <template v-if="elementRatioArr.length > 1">
          <div
            v-for="(item, i) in elementRatioArr"
            :key="i + '成份比例'"
            class="ratio-form4-lnks"
          >
            <el-form-item :rules="ruleRequire" :prop="prop(i)">
              <div class="ratio-lnks">{{ item.name }} :</div>
              <el-input
                class="inputs ratio-lnks-el"
                :value="getValue(i)"
                @input="inputChange(i, $event)"
              />
              <span class="ratio-bia">%</span>
            </el-form-item>
          </div>
        </template>
        <!-- 单一 -->
        <template v-else-if="elementRatioArr.length === 1">
          <div
            v-for="(item, i) in elementRatioArr"
            :key="i + '成例'"
            class="ratio-form4-lnks"
          >
            <el-form-item :prop="prop(i)" :inline="true">
              <el-input class="inputs ratio-lnks-el" :value="val" disabled />
              <span class="ratio-bia">%</span>
            </el-form-item>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PopProportion',
  inheritAttrs: false,
  props: {
    scope: {
      type: Object
    },
    formDatas: {
      type: Object
    },
    form: {
      type: Object
    },
    setFormDatas: {
      type: Function
    },
    statusType: {
      type: String
    }
  },
  data() {
    const validate = (rule, value, callback) => {
      const reg = /^\d+\.?\d{0,2}$/
      let newV = value ? value.split('/') : []
      newV = newV.filter(v => { if (v) { return true } })
      const testArr = newV.filter(v => { if (reg.test(v)) { return true } }) || []
      let num = 0
      const arr = this.formDatas.elementScale ? this.formDatas.elementScale.split('/') : []
      arr.forEach(v => {
        num += v * 1
        num = this.$utils.getFloat(num, 2)
      })
      // if (value && !reg.test(value)) {
      //   return callback(new Error('数字类型,大于0最多两位小数'))
      // } else if (parseInt(value) > 100) {
      //   return callback(new Error('最大值不能超过100'))
      // } else if (!(value > 0)) {
      //   return callback(new Error('纱比请输入大于0的有效数值'))
      // }   else
      if (value === '' || newV.length !== this.elementRatioArr.length || num !== 100) {
        callback(new Error(' 计算总和100'))
      } else if (testArr.length !== newV.length) {
        callback(new Error('存在超过两位小数项'))
      } else {
        this.form.clearValidate()
        callback()
      }
    }
    const ruleRequire = [{ validator: validate, trigger: 'blur' }]
    return {
      defaultRatio: '100',
      ruleRequire,
      elementRatioArr: []
    }
  },
  computed: {
    val() {
      return this.elementRatioArr.length ? (this.formDatas.elementScale ? this.formDatas.elementScale : this.defaultRatio) : ''
    }
  },
  watch: {
    'formDatas.element': {
      handler(data) {
        if (data && data.ingredients) {
          let ratioArr = []
          if (data.ingredients.length > 1) {
            ratioArr = this.formDatas.element.ingredients
          } else {
            ratioArr = this.formDatas.element.ingredients
          }
          this.elementRatioArr = ratioArr
        } else {
          this.elementRatioArr = []
        }
      },
      deep: true,
      immediate: true
    }
  },
  mounted() { },
  methods: {
    prop(key) {
      return 'elementScale'
    },
    getValue(index) {
      const elementRatio = this.formDatas['elementScale']
      const data = elementRatio ? this.formDatas['elementScale'].split('/') : []
      return data[index]
    },
    inputChange(i, $event) {
      const elementRatio = this.formDatas['elementScale']
      const data = elementRatio ? this.formDatas['elementScale'].split('/') : []
      data[i] = $event.trim()
      this.setFormDatas({ 'elementScale': data.join('/') })
    }
  }
}
</script>

<style lang="scss" scoped>
.ratio-form2 {
  display: flex;
  width: 100%;
  margin-bottom: 22px;
  .ratio-form3 {
    text-align: right;
    vertical-align: middle;
    float: left;
    max-width: 99px;
    overflow: hidden;
    font-size: 14px;
    color: #606266;
    line-height: 36px;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    margin-left: 9px;
    margin-right: 12px;
  }
  .ratio-form4 {
    display: flex;
    flex: 1;
    border-radius: 4px;
    // border: 1px solid #DCDFE6;
    line-height: 36px;
    min-height: 36px;
    flex-wrap: wrap;
  }
  .ratio-form4-lnks {
    display: flex;
    margin-left: 10px;
    flex-wrap: wrap;
    line-height: 28px;
    margin-top: 5px;
    flex: 1;
    // margin-bottom: 5px;
    .ratio-lnks {
      width: auto;
      margin-right: 5px;
      min-width: 50px;
      color: #606266;
      position: relative;
    }
    .ratio-bia {
      position: absolute;
      display: block;
      width: 18px;
      color: #bbc2d0;
      height: 28px;
      right: 0;
      top: 0;
    }
    .el-form-item {
      margin-bottom: 16px;
    }
    .ratio-lnks-el {
      width: 85px;
      /deep/ .el-input__inner {
        padding-right: 20px;
      }
    }
    .inputs {
      //限制小输入框
      height: 30px;
      line-height: 30px;
      /deep/ .el-input__inner {
        height: 28px;
        line-height: 28px;
      }
    }
    /deep/ .el-form-item__content {
      //平铺
      margin-left: 0 !important;
      display: flex;
    }
    /deep/ .el-form-item--medium .el-form-item__content {
      line-height: 30px;
    }
  }
  .ratio-lnkst {
    margin-top: 0px;
  }
}
</style>
