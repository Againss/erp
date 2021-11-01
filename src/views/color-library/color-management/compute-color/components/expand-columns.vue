<!--
 * @Author: Sanmao
 * @Date: 2020-11-10 20:06:31
 * @LastEditors: Sanmao
 * @LastEditTime: 2020-11-16 11:23:24
 * @Descripttion: table 展开行
-->
<template>
  <div class="table-expand">
    <div style="width: 96px; height: 20px" />
    <div class="expand-list">
      <ul v-for="(item, index) in scope.row.child || []" :key="index">
        <li class="color-name">{{ item.name || "" }}</li>
        <li class="color-code">
          {{ item.dl + "" ? item.dl : "" }}
        </li>
        <li class="color-code">
          {{ item.da + "" ? item.da : "" }}
        </li>
        <li class="color-code">
          {{ item.db + "" ? item.db : "" }}
        </li>
        <li class="color-code">
          {{ item.dc + "" ? item.dc : "" }}
        </li>
        <li class="color-code">
          {{ item.dh + "" ? item.dh : "" }}
        </li>
        <li class="color-code">
          {{ item.decmc + "" ? item.decmc : "" }}
        </li>
        <li class="color-desc">{{ item.pfdecmc || "" }}</li>
      </ul>
    </div>
  </div>
</template>
<script>
export default {
  name: 'ExpandColumns',
  props: {
    scope: {
      type: Object
    }
  }
}
</script>
<style lang="scss" scoped>
.table-expand {
  display: flex;
  align-items: center;
  .expand-list {
    display: flex;
    flex-direction: column;
    & > ul {
      display: flex;
      align-items: center;
      list-style: none;
      padding: 10px 0;
      margin: 0;
      border-bottom: 1px solid #dfe6ec;
      li {
        padding: 0 10px;
        box-sizing: border-box;
      }

      .color-name {
        width: 104px;
      }
      .color-code {
        width: 80px;
      }
      .color-desc {
        width: 90px;
      }
    }
    & > ul:last-child {
      border-bottom: none;
    }
  }
}
</style>
