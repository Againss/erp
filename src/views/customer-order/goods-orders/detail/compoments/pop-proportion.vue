<!--
 * @Author: ll
 * @Date: 2021-01-06 11:22:13
 * @LastEditTime: 2021-04-24 14:14:54
-->

<template>
  <div class="ratio-formIndex ratio-form-order" :class="getClss(allText)">
    <div class="ratio-label"><span>*</span>比例</div>
    <div v-if="elementRatioArr.length > 1" class="ratio-inputs">
      <div v-for="(item, i) in elementRatioArr" :key="i" class="ratio-form4-lnks">
        <el-form-item
          :rules="ruleRequire"
          :prop="prop(i)"
          class="inputsyu"
        >
          <el-input
            class="inputs"
            style="width: 100%;"
            :value="getValue(i)"
            @input="inputChange(i,$event)"
          />
        </el-form-item>
      </div>
    </div>
    <div v-else class="ratio-inputs" style="flex:1">
      <el-form-item style="width: 100%;">
        <el-input
          style="width: 100%;"
          :value="defaultRatio"
          class="inputs"
        />
      </el-form-item>
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
    componentsOptions: {
      type: Object
    }
  },
  data() {
    const validate = (rule, value, callback) => {
      const reg = /^\d+\.?\d{0,2}$/
      let newV = value ? value.split('/') : []
      newV = newV.filter(v => { if (v) { return true } })
      const testArr = newV.filter(v => { if (reg.test(v)) { return true } }) || []
      // console.log(newV)
      let num = 0
      let nsum = true
      const arr = this.formDatas.elementRatio ? this.formDatas.elementRatio.split('/') : []
      arr.forEach(v => {
        if (!v || v * 1 <= 0) { nsum = false }
        num += v * 1
        num = this.$utils.getFloat(num, 2)
      })
      if (!nsum) {
        callback(new Error('存在小于等于0的数项'))
      } else if (value === '' || newV.length !== this.elementRatioArr.length || num !== 100) {
        callback(new Error('计算总和100'))
      } else if (testArr.length !== newV.length) {
        callback(new Error('存在超过两位小数项'))
      } else {
        this.form.clearValidate()
        callback()
      }
    }
    // const commonBlurReg = this.$getRules({ trigger: ['blur'] })
    const ruleRequire = [{ validator: validate, trigger: 'blur' }]
    return {
      defaultRatio: '100',
      ruleRequire,
      elementRatioArr: [],
      TabType: 0
    }
  },
  computed: {
    allText() {
      console.log('|ssssss', this.componentsOptions.textType)
      return this.componentsOptions.textType + '' || '0'
    },
    allfileNames() {
      return (this.formDatas)
    }
  },
  watch: {
    // 'formDatas.element': {
    //   handler(data) {
    //     console.log('sssssss', data,)
    //     if (data) {
    //       let ratioArr = []
    //       if (data.label) {
    //         if (this.formDatas.elementRatio && this.formDatas.element.names === '4') {
    //           ratioArr = ('' + this.formDatas.elementRatio).split('/')
    //         } else if (data.names) {
    //           ratioArr = this.formDatas.element.names.split('/')
    //         }
    //       } else {
    //         ratioArr = []
    //       }
    //       this.elementRatioArr = ratioArr
    //     } else {
    //       this.elementRatioArr = []
    //     }
    //   },
    //   deep: true,
    //   immediate: true
    // },
    'formDatas.element': {
      handler(data) {
        if (data) {
          let ratioArr = []
          if (data.label) {
            if (this.formDatas.elementRatio && this.formDatas.ieEdit && this.flag) {
              ratioArr = ('' + this.formDatas.elementRatio).split('/')
            } else if (this.formDatas.element && this.formDatas.element.names) {
              ratioArr = this.formDatas.element.names.split('/')
            } else if (this.formDatas.elementRatio) {
              ratioArr = ('' + this.formDatas.elementRatio).split('/')
            } else {
              ratioArr = this.formDatas.element && this.formDatas.element.label && this.formDatas.element.label.split('/') || []
            }
          } else {
            ratioArr = []
          }
          this.elementRatioArr = ratioArr
        } else {
          this.elementRatioArr = []
        }
      },
      deep: true,
      immediate: true
    },
    'formDatas.tab': {
      handler(data) {
        console.log(this.formDatas)
      },
      deep: true,
      immediate: true
    }
  },
  mounted() {},
  methods: {
    prop(key) {
      return 'elementRatio'
    },
    getValue(index) {
      const elementRatio = this.formDatas['elementRatio']
      const data = elementRatio ? this.formDatas['elementRatio'].split('/') : []
      return data[index]
    },
    inputChange(i, $event) {
      const elementRatio = this.formDatas['elementRatio']
      const data = elementRatio ? this.formDatas['elementRatio'].split('/') : []
      data[i] = $event
      this.setFormDatas({ 'elementRatio': data.join('/') })
    },
    getClss(type) {
      if (type === '0') {
        return 'classIndexone'
      } else if (type === '2') {
        return 'classIndexTwo'
      }
    }
  }
}
</script>

<style lang="scss" >
.ratio-formIndex{
  display: flex;
  flex-direction: row;
  margin-bottom: 22px;
  .ratio-label {
    min-width: 80px;
    line-height: 36px;
    display: flex;
    font-size: 14px;
    color: #606266;
    padding-right: 12px;
    justify-content: flex-end;
    span {
      margin-right: 4px;
      color: #ff4949;
    }
  }
  .ratio-inputs {
    display: flex;
    width: 100%;
    .el-form-item {
      margin-bottom: 0;
      .el-form-item__content {
        margin-left: 0!important;
      }
    }
  }
}
.ratio-form-order{
  &.classIndexone {
    .ratio-label{
      width: 110px!important;
      flex: 0 0 110px!important;
    }
  }

  &.classIndexTwo{
    .ratio-label{
      min-width: 50px!important;
      width: 50px!important;
      flex: 0 0 50px!important;
    }
  }

  .ratio-form4-lnks {
    display: flex;
    margin-left: 10px;
    flex-wrap: wrap;
    line-height: 28px;
    margin-top: 5px;
    flex: 1;
    .inputsyu{
      width: 100%;
    }
    &:nth-child(1){
      margin-left: 0;
    }
    }
}

</style>
