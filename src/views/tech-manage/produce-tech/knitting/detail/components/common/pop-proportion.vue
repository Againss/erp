<!--
 * @Author: ll
 * @Date: 2021-01-06 11:22:13
 * @LastEditTime: 2021-01-11 20:19:28
-->

<template>
  <div class="ratio-form">
    <div class="ratio-label"><span>*</span>比例</div>
    <div v-if="elementRatioArr.length > 1" class="ratio-inputs">
      <div v-for="(item, i) in elementRatioArr" :key="i">
        <el-form-item
          :rules="ruleRequire"
          :prop="prop(i)"
        >
          <el-input
            class="inputs"
            :value="getValue(i)"
            @input="inputChange(i,$event)"
          />
        </el-form-item>
      </div>
    </div>
    <div v-else class="ratio-inputs">
      <el-form-item>
        <el-input
          style="width: 356px;"
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
      const arr = this.formDatas.elementRatio ? this.formDatas.elementRatio.split('/') : []
      arr.forEach(v => {
        num += v * 1
        num = this.$utils.getFloat(num, 2)
      })
      if (value === '' || newV.length !== this.elementRatioArr.length || num !== 100) {
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
      elementRatioArr: []
    }
  },
  computed: {
    // elementRatio() {
    //   let ratioArr = []
    //   console.log(this.formDatas)
    //   if (this.formDatas.id) {
    //     ratioArr = this.formDatas.elementRatio.split('/')
    //   } else {
    //     if (this.formDatas.element && this.formDatas.element.label) {
    //       ratioArr = this.formDatas.element.label.split('/')
    //     } else {
    //       ratioArr = []
    //     }
    //   }
    //   // if (this.formDatas.element && this.formDatas.element.label) {
    //   //   ratioArr = this.formDatas.element.label.split('/')
    //   // }
    //   return ratioArr.length
    // }
  },
  watch: {
    'formDatas.elementInfo': {
      handler(data) {
        if (data) {
          let ratioArr = []
          if (data.label) {
            ratioArr = this.formDatas.elementInfo.label.split('/')
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
      // console.log(data)
      this.setFormDatas({ 'elementRatio': data.join('/') })
    }
  }
}
</script>

<style lang="scss">
.ratio-form {
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
    .el-form-item {
      margin-bottom: 0;
      .el-form-item__content {
        margin-left: 0!important;
      }
    }
  }
}
</style>
