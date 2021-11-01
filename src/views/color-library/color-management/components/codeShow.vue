<!--
 * @Date: 2020-11-17 19:30:30
 * @Author: Againss
 * @LastEditTime: 2021-01-19 18:49:32
 * @LastEditors: anthony
 * @Descripttion:
-->
<template>
  <div v-highlight>
    <el-tooltip :key="scope.row.id" placement="top" effect="light">
      <div slot="content">
        <div
          v-html="
            componentsOptions.type === 'colorManageYarn'
              ? getColorManageYarn
              : colorManageDye
          "
        />
      </div>
      <div
        class="oneRow"
        v-html="
          componentsOptions.type === 'colorManageYarn'
            ? getColorManageYarn.replace(/<br>/g, ',')
            : colorManageDye.replace(/<br>/g, ',')
        "
      />
    </el-tooltip>
  </div>
</template>

<script>

export default {
  props: {
    scope: {
      type: Object
    },
    componentsOptions: {
      type: Object
    }
  },
  data() {
    return {}
  },
  computed: {
    getColorManageYarn() {
      return this.scope.row.colorManageYarn.reduce((str, cru) => {
        const ingredientVal = cru.yarnElement && cru.yarnElement.reduce((s, c) => {
          const sv = ((c.ingredient && c.ingredient.name) || '') +
            c.ingredientRatio +
            '%'
          if (s) {
            s += '/' + sv
          } else {
            s = sv
          }
          return s
        }, '')
        const strv = ((cru.yarnType && cru.yarnType.name) || '') +
          ' ' +
          (cru.element && cru.element.name || '') + ' ' +
          (cru.ingredientType === 1 ? ingredientVal : '100%')
        if (str) {
          str += '<br>' + strv
        } else {
          str = strv
        }
        return str
      }, '')
    },
    colorManageDye() {
      return Array.from(
        new Set(
          (this.scope.row.colorManageDye &&
            this.scope.row.colorManageDye.map((cru) => {
              return (cru.colorSystem && cru.colorSystem.name) || ''
            })) ||
          []
        )
      ).join('<br>')
    }
  }
}
</script>
<style lang="scss" scoped>
.oneRow {
  vertical-align: middle;
  display: inline-block;
  overflow: hidden;
  text-overflow: ellipsis;
  -ms-text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 250px;
}
</style>
