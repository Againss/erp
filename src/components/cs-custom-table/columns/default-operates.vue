/**
 * @Description:操作类单元格
 * @author Roman
 * @date 2020/5/20
*/
<template>
  <div class="defaultOperates">
    <template v-for="(item,index) in getHandle">
      <span :key="index" class="itemStyle" :style="item.style" @click="handle(item)">{{ item.label }}<!-- <el-divider v-if="getFlag(index)" direction="vertical" /> --><span v-if="getFlag(index)" style="width:12px;display:inline-block;" /></span>
    </template>
    <el-tooltip v-if="options&&getMoreHandle.length" :placement="placement" :effect="effect" :popper-class="getOptions.popperClass ? getOptions.popperClass : 'basePopperClass'">
      <div slot="content">
        <div v-for="(item, index) in getMoreHandle" :key="index" class="itemStyle lineHeight" :style="item.style" @click="handle(item)">{{ item.label }}</div>
      </div>
      <span class="itemStyle marginLeft">更多<i class="el-icon-arrow-down" style="margin-left: 5px;" /></span>
    </el-tooltip>
  </div>
</template>

<script>
export default {
  name: 'StateColumn',
  inheritAttrs: false,
  props: {
    dataSource: {
      type: Array
    },
    options: {
      type: Object
    },
    scope: {
      type: Object
    },
    form: {
      type: Object
    },
    editType: {
      type: String
    },
    formDatas: {
      type: Object
    },
    setFormDatas: {
      type: Function
    }
  },
  data() {
    return {

    }
  },
  computed: {
    getLen() {
      return this.getOptions.maxLength || 2
    },
    placement() { return this.getOptions.placement || 'bottom' },
    effect() { return this.getOptions.effect || 'light' },
    getOptions() {
      return this.options || {}
    },
    getHandle() {
      if (this.options) {
        const data = [...this.getDataSource]
        return data.splice(0, this.getLen)
      } else {
        return this.getDataSource
      }
    },
    getMoreHandle() {
      if (this.options) {
        const data = [...this.getDataSource]
        return data.splice(this.getLen)
      } else {
        return []
      }
    },
    getDataSource() {
      const dataSource = this.dataSource.filter(item => {
        if (item.isShow) {
          if (typeof item.isShow === 'function') {
            return item.isShow(this.scope, this.form, this.formDatas, this.setFormDatas)
          } else {
            return item.isShow
          }
        }
        return false
      })
      return dataSource
    }
  },
  mounted() {

  },
  methods: {
    getFlag(index) {
      if (this.options && this.getMoreHandle.length) {
        return index !== this.getHandle.length
      }
      return index + 1 !== this.getHandle.length
    },
    handle(item) {
      item.handle && item.handle(this.scope, this.form, this.formDatas, this.setFormDatas)
    },
    isShow(item) {
      if (item.isShow) {
        if (typeof item.isShow === 'function') {
          return item.isShow(this.scope, this.form, this.formDatas, this.setformdatas)
        } else {
          return item.isShow
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
    .defaultOperates{
        padding: 0px 6px;
        display: inline-block;
    }
    .itemStyle{
        color: rgb(24, 144, 255);
        cursor: pointer;
        white-space:nowrap;
    }
    .itemStyle.marginLeft{ margin-left: -4px}
    .lineHeight{height: 34px; line-height: 34px; padding: 0px 20px;}
    .lineHeight:hover {
        background-color: #f5f7fa;
    }
    .el-divider--vertical{
        margin:0 5px
    }
</style>
<style lang="scss">
.basePopperClass {
  padding: 6px 0;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}
</style>
