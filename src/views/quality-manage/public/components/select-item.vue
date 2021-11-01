/**
 * @Description:自定义状态单元格
 * @author Roman
 * @date 2020/5/20
*/
<template>
  <div v-if="scope.row.unit==='个'&&componentsOptions.prop==='name2'">
    <el-form-item :rules="rules" :prop="prop(componentsOptions.prop)" label="" label-width="0" style="margin-right: 0;">
      <el-popover
        v-model="err.isShow"
        :popper-class="getErrPopClass"
        :placement="popoverOptions.placement||'top'"
        :title="popoverOptions.title"
        :width="popoverOptions.width"
        :trigger="popoverOptions.trigger||'manual'"
        @hide="hide"
      >
        <div :style="getErrPopStyle" :class="popoverOptions.class" v-html="getErrHtml(err.errorMsg)" />
        <el-input slot="reference" maxlength="5" size="mini" :value="value" placeholder="请输入0-99999" @input="inputChange(componentsOptions.prop,$event)" />
        <!-- <el-input slot="reference" v-model="scope.row[componentsOptions.prop]" maxlength="5" size="mini" placeholder="请输入" @input="changeMethods(scope, formDatas)" /> -->
      </el-popover></el-form-item>

  </div>
  <div v-else>
    <el-select :value="value" size="mini" placeholder="请选择" @change="inputChange(componentsOptions.prop,$event)">
      <el-option
        v-for="item in options"
        :key="item.value"
        :label="item.label"
        :value="item.value"
      />
    </el-select>
  </div>
</template>

<script>
export default {
  name: 'TableFormCustom',
  inheritAttrs: false,
  props: {
    scope: {
      type: Object
    },
    componentsOptions: {
      type: Object
    },
    editType: {
      type: String
    },
    itemType: {
      type: String
    },
    itemProp: {
      type: String
    },
    itemProps: {
      type: Object
    },
    column: {
      type: Object
    },
    errors: {
      type: Object
    },
    formDatas: {
      type: Object
    },
    setFormDatas: {
      type: Function
    },
    value: {
      type: [String, Object, Array]
    }
  },
  data() {
    return {
      err: {
        isShow: false,
        errorMsg: ''
      }
    }
  },
  computed: {
    getErrPopClass() {
      return this.popoverOptions.popperClass ? this.popoverOptions.popperClass + ' defaultPopperErrClass' : 'defaultPopperErrClass'
    },
    getErrPopStyle() {
      if (this.popoverOptions.errorStyle) {
        return { color: '#FE4949', ...this.popoverOptions.errorStyle }
      }
      return { color: '#FE4949' }
    },
    popoverOptions() {
      return this.column.popoverOptions || {}
    },
    rules() {
      return this.column.rules
    },
    options() {
      if (this.scope.row.unit && this.scope.row.unit !== '个' && this.componentsOptions.prop === 'name2') {
        const arr = this.scope.row.unit.split('/')
        return arr.map(v => {
          return {
            label: v,
            value: v
          }
        })
      } else {
        return [
          { label: 'A', value: 'A' },
          { label: 'B', value: 'B' },
          { label: 'C', value: 'C' }
        ]
      }
    }
  },
  watch: {
    errors: {
      handler(val, oldVal) {
        if (val && val[this.prop(this.componentsOptions.prop)]) {
          this.err.isShow = true
          this.err.errorMsg = val[this.prop(this.componentsOptions.prop)]
        } else {
          this.err.isShow = false
          this.err.errorMsg = ''
        }
      },
      deep: true,
      immediate: true
    }
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
      // console.log(key)
      if (!this.formDatas) {
        return undefined
      }
      return [this.itemProp] + '.' + [this.scope.$index] + '.' + [this.scope.column.property]
    },
    inputChange(key, $event) {
      const values = JSON.parse(JSON.stringify(this.formDatas[this.itemProp]))
      values[this.scope.$index][key] = $event
      this.setFormDatas({ [this.itemProp]: values })
      // console.log(values)
      console.log(this.formDatas)
    }
  }
}
</script>

<style lang="scss" scoped>
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

<style lang="scss">
.yarn-dyed-or-not {
    .el-select .el-input .el-select__caret {
        line-height: 28px;
    }
    .el-input--medium .el-input__inner {
      height: 28px;
    }
}
</style>
