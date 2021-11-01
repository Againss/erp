<!--
 * @Date: 2020-10-14 13:46:18
 * @Author: Againss
 * @LastEditTime: 2021-06-29 19:43:59
 * @LastEditors: zhengjin
 * @Descripttion: 纱长设置
-->
<template>
  <div class="setting">
    <span class="cont" :title="value">
      {{ value }}
    </span>
    <!-- <span
      v-if="isEdit || scope.row.edit"
      class="setting-btn"
      @click="Handler"
    >设置</span> -->
  </div>
</template>

<script>
export default {
  props: {
    componentsOptions: {
      type: Object
    },
    // isEdit: {
    //   type: Boolean
    // },
    scope: {
      type: Object
    }
  },
  computed: {
    value() {
      // this.scope.row.combination
      // return this.scope.row[this.scope.column.property]
      const strs = this.scope.row.length.reduce((str, item) => {
        return `${str}${str ? '-' : ''}${item.descUuid && item.descUuid !== '0' ? item.descObj.name : item.desc}/${item.length}cm`
      }, '')
      return strs ? `${strs}--${this.scope.row.holeNumber}/${this.scope.row.holeType}` : ''
    }
  }
  // methods: {
  //   Handler() {
  //     this.componentsOptions.settingHandler(this.scope)
  //   }
  // }
}
</script>

<style lang="scss" scoped>
.setting {
  display: flex;
  align-items: center;
}
.cont {
  margin-right: 10px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.setting-btn {
  word-break: keep-all;
  width: 40px;
  cursor: pointer;
  color: #1890ff;
}
</style>
