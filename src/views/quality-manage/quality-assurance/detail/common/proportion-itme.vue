<!--
 * @Author: ll
 * @Date: 2021-01-06 11:22:13
 * @LastEditTime: 2021-01-09 16:34:59
-->
<template>
  <div class="ratio-form">
    <div style="width: 150px;padding-right: 12px;">
      <div class="ratio-label" :style="{color:formDatas.ieEdit?'#606266':'#888'}"><span v-if="formDatas.ieEdit">*</span>比例</div>
    </div>
    <div style="flex: 1;display: flex;">
      <template v-if="proportionArr.length > 1 && formDatas.ieEdit">
        <div v-for="(item, i) in proportionArr" :key="i" style="flex: 1;display: flex;">
          <el-form-item :rules="ruleRequire" :prop="prop(i)" style="flex: 1;" :style="i===proportionArr.length-1?{'margin-right': '0'}:{'margin-right': '10px'}">
            <el-input :value="getValue(i)" @input="inputChange(i,$event)" /></el-form-item>
          <!-- <el-input :disabled="formDatas.ieEdit==='edit'?true:false" :value="getValue(i)" @input="inputChange(i,$event)" /></el-form-item> -->
        </div>
      </template>
      <template v-else>
        <div style="flex: 1;display: flex;">
          <el-form-item style="flex: 1;margin-right: 0;">
            <el-input :value="val" disabled />
          </el-form-item>
        </div>
      </template>
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
    componentsOptions: {
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
      let num = 0
      const arr = this.formDatas.proportion ? this.formDatas.proportion.split('/') : []
      arr.forEach(v => {
        num += v * 1
        num = this.$utils.getFloat(num, 2)
      })
      if (value === '' || newV.length !== this.proportionArr.length || num !== 100) {
        callback(new Error('计算总和100'))
      } else if (testArr.length !== newV.length) {
        callback(new Error('存在超过两位小数'))
      } else {
        // debugger
        // console.log(this.form)
        this.form.clearValidate()
        // this.$set(this.commonContent[3], 'error', '')
        callback()
      }
    }
    const ruleRequire = [{ validator: validate, trigger: 'blur' }]
    return {
      defaultRatio: '100',
      ruleRequire,
      proportionArr: [],
      flag: true
    }
  },
  computed: {
    val() {
      return this.proportionArr.length ? (this.formDatas.proportion ? this.formDatas.proportion : this.defaultRatio) : ''
    }
  },
  watch: {
    'formDatas.ingredients': {
      handler(data) {
        if (data) {
          let ratioArr = []
          if (data.label) {
            if (this.formDatas.proportion && this.formDatas.ieEdit && this.flag) {
              ratioArr = this.formDatas.proportion.split('/')
            } else if (this.formDatas.ingredients.names) {
              ratioArr = this.formDatas.ingredients.names.split('/')
            } else if (this.formDatas.proportion) {
              ratioArr = this.formDatas.proportion.split('/')
            } else {
              ratioArr = this.formDatas.proportion.label.split('/')
            }
          } else {
            ratioArr = []
          }
          this.proportionArr = ratioArr
        } else {
          this.proportionArr = []
        }
      },
      deep: true,
      immediate: true
    }
  },
  mounted() {
    // console.log(this.formDatas)
  },
  methods: {
    prop(key) {
      return 'proportion'
    },
    getValue(index) {
      // console.log(index)
      const proportion = this.formDatas['proportion']
      const data = proportion ? this.formDatas['proportion'].split('/') : []
      return data[index]
    },
    inputChange(i, $event) {
      this.flag = false
      const proportion = this.formDatas['proportion']
      const data = proportion ? this.formDatas['proportion'].split('/') : []
      data[i] = $event
      this.setFormDatas({ 'proportion': data.join('/') })
    }
  }
}
</script>

<style lang="scss" scoped>
.ratio-form {
  width: 30%;
  padding-left: 20px;
  display: flex;
	// height: 36px;
  .ratio-label {
    width: 100%;
    line-height: 36px;
    display: flex;
    justify-content: flex-end;
    font-size: 14px;
    color: #606266;
    span {
      margin-right: 4px;
      color: #ff4949;
    }
  }
}
</style>
