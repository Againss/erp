<template>
  <el-row>
    <el-col :span="11">
      <el-form-item :rules="[numberReg]" :prop="prop('num')" label="">
        <el-popover
          v-model="a_err.isShow"
          :popper-class="getErrPopClass"
          :placement="popoverOptions.placement||'top'"
          :title="popoverOptions.title"
          :width="popoverOptions.width"
          :trigger="popoverOptions.trigger||'manual'"
          @hide="hide"
        >
          <div :style="getErrPopStyle" :class="popoverOptions.class" v-html="getErrHtml(a_err.errorMsg)" />
          <el-input slot="reference" v-model="scope.row.num" disabled size="mini" placeholder="请输入">
            <span slot="suffix" class="inputEndKG">KG</span>
          </el-input>
        </el-popover>
      </el-form-item>
    </el-col>
    <el-col :span="2">
      <div class="solidStyle" />
    </el-col>
    <el-col v-if="scope.row.process === '采购'" :span="11">
      <el-form-item :rules="[numberReg]" :prop="prop('bkYarnNum')" label="" label-width="0">
        <el-popover
          v-model="b_err.isShow"
          :popper-class="getErrPopClass"
          :placement="popoverOptions.placement||'top'"
          :title="popoverOptions.title"
          :width="popoverOptions.width"
          :trigger="popoverOptions.trigger||'manual'"
          @hide="hide"
        >
          <div :style="getErrPopStyle" :class="popoverOptions.class" v-html="getErrHtml(b_err.errorMsg)" />
          <el-input slot="reference" v-model="scope.row.bkYarnNum" disabled size="mini" placeholder="请输入">
            <span slot="suffix" class="inputEndKG">KG</span>
          </el-input>
        </el-popover>
      </el-form-item>
    </el-col>
  </el-row>

</template>

<script>
// import countryCode from '../config/country-code.js'
export default {
  components: {},
  props: {
    scope: {
      type: Object
    },
    formDatas: {
      type: Object
    },
    itemProp: {
      type: String
    },
    setFormDatas: {
      type: Function
    },
    column: {
      type: Object
    },
    errors: {
      type: Object
    }
  },
  data() {
    // 正则
    const ruleRequire = this.$getRules({})
    // 公用验证正则
    const commonBlurReg = this.$getRules({ trigger: ['blur'] })
    // 手机验证正则
    const phoneReg = this.$getRules({ type: 'phone', trigger: ['blur'] })
    // 数字验证正则
    const numberReg = this.$getRules({ type: 'number', trigger: ['blur'] })
    return {
      baseRule: '',
      ruleRequire,
      commonBlurReg,
      phoneReg,
      numberReg,
      dataSource: [],
      a_err: {
        isShow: false,
        errorMsg: ''
      },
      b_err: {
        isShow: false,
        errorMsg: ''
      }
    }
  },
  computed: {
    telValue() {
      return this.formDatas.mobile
    },
    areaNumValue() {
      return this.formDatas.areaCode
    },
    popoverOptions() {
      return this.column.popoverOptions || {}
    },
    getErrPopClass() {
      return this.popoverOptions.popperClass ? this.popoverOptions.popperClass + ' defaultPopperErrClass' : 'defaultPopperErrClass'
    },
    getErrPopStyle() {
      if (this.popoverOptions.errorStyle) {
        return { color: '#FE4949', ...this.popoverOptions.errorStyle }
      }
      return { color: '#FE4949' }
    }
  },
  watch: {
    errors: {
      handler(val, oldVal) {
        console.log(val)
        if (val && val[this.prop('num')]) {
          console.log(val)
          this.a_err.isShow = true
          this.a_err.errorMsg = val[this.prop('num')]
        } else {
          this.a_err.isShow = false
          this.a_err.errorMsg = ''
        }
        if (val && val[this.prop('bkYarnNum')]) {
          this.b_err.isShow = true
          this.b_err.errorMsg = val[this.prop('bkYarnNum')]
        } else {
          this.b_err.isShow = false
          this.b_err.errorMsg = ''
        }
      },
      deep: true,
      immediate: true
    }
  },
  created() {
    // this.configureCountryCode()
    // console.log(this.itemProp, this.scope)
  },
  mounted() {
  },
  methods: {
    getErrHtml(errmsg) {
      if (this.popoverOptions.formater) {
        return this.popoverOptions.formater(errmsg)
      }
      return errmsg
    },
    hide() {
      this.popoverOptions.hide && this.popoverOptions.hide()
    },
    prop(key) {
      if (!this.formDatas[this.itemProp]) {
        return undefined
      }
      //   console.log([this.itemProp] + '.' + [this.scope.$index] + '.' + key)
      return [this.itemProp] + '.' + [this.scope.$index] + '.' + key
    }
  }
}
</script>

<style lang="scss" scoped>
    .solidStyle{
        display: flex;justify-content: center;align-items: center; height: 100%;padding-top: 7px
    }

.success{
    border: 1px solid #2ac06d;
    padding: 2px 5px;
    color: #2ac06d;
    border-radius: 5px;
}
.danger{
    border: 1px solid #ff0000;
    padding: 2px 5px;
    color: #ff0000;
    border-radius: 5px;
}
</style>
