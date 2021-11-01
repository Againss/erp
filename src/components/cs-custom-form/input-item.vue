/**
 * @Description:输入框单元格
 * @author Roman
 * @date 2020/5/20
*/
<template>
  <el-input
    :value="value"
    :style="options.style||defaultWidth"
    :class="options.className"
    :suffix-icon="options.suffixIcon"
    :readonly="options.readonly"
    :title="title"
    :disabled="options.disabled"
    :clearable="options.clearable"
    :placeholder="options.placeholder"
    :maxlength="options.maxlength"
    :minlength="options.minlength"
    :show-word-limit="options.showWordLimit"
    :show-password="options.showPassword"
    :size="options.size"
    :prefix-icon="options.prefixIcon"
    :rows="options.rows"
    :autosize="options.autosize"
    :autofocus="options.autofocus"
    :tabindex="options.tabindex"
    :validate-event="options.validateEvent"
    :type="options.type"
    :spellcheck="false"
    @input="inputChange"
    @clear="clear"
    @change="rawChange"
    @blur="blur"
    @focus="focus"
  >
    <template v-if="options.prefix" slot="prefix" :class="options.prefixClass">{{ options.prefix }}</template>
    <template v-if="options.suffix" slot="suffix" :class="options.suffixClass">{{ options.suffix }}</template>
    <template v-if="options.prepend" slot="prepend" :class="options.prependClass">{{ options.prepend }}</template>
    <template v-if="options.append" slot="append" :class="options.appendClass">{{ options.append }}</template>
  </el-input>
</template>

<script>
export default {
  name: 'InputItem',
  components: {

  },
  inheritAttrs: false,
  props: {
    options: {
      type: Object
    },
    title: {
      type: String
    },
    formDatas: {
      type: [Object, Array]
    },
    form: {
      type: Object
    },
    setFormDatas: {
      type: Function
    },
    scope: {
      type: Object
    },
    value: {
      type: [String, Number, Array]
    },
    change: {
      type: Function
    }
  },
  data() {
    return {
      defaultWidth: { width: '100%' }
    }
  },
  computed: {

  },
  mounted() {

  },
  methods: {
    trim(value) {
      return value.replace(/^\s\s*/, '').replace(/\s\s*$/, '')
    },
    inputChange(value) {
      let val = value
      if (this.options.trim) {
        val = this.options.trim(value)
      }
      this.change(val)
    },
    clear() {
      this.options.clear && this.options.clear(this.form, this.formDatas, this.setFormDatas, this.scope)
    },
    rawChange(value) {
      let val = value
      if (Object.prototype.toString.call(this.options.rawChangeTrim) === '[object Function]') {
        this.options.rawChangeTrim(value, this.form, this.formDatas, this.setFormDatas, this.scope)
      } else {
        val = this.trim(value)
        this.change(val)
      }
      this.options.rawChange && this.options.rawChange(val, this.form, this.formDatas, this.setFormDatas, this.scope)
    },
    blur(event) {
      this.options.blur && this.options.blur(event, this.form, this.formDatas, this.setFormDatas, this.scope)
    },
    focus(event) {
      this.options.focus && this.options.focus(event, this.form, this.formDatas, this.setFormDatas, this.scope)
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
